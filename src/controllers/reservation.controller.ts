import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { serverLog } from '../utils/server-log';

const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_PHONE = 30;
const MAX_NOTES = 1000;
const ALLOWED_TIMES = new Set([
  '12:00', '12:30', '13:00', '13:30', '14:00',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
]);
class ReservationValidationError extends Error {}

type ReservationWorkflowStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
const ALLOWED_STATUSES = new Set<ReservationWorkflowStatus>(['pending', 'confirmed', 'cancelled', 'completed']);
const RESERVATION_TRANSITIONS: Record<ReservationWorkflowStatus, Set<ReservationWorkflowStatus>> = {
  pending: new Set(['confirmed', 'cancelled']),
  confirmed: new Set(['completed', 'cancelled']),
  completed: new Set(),
  cancelled: new Set()
};
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const WEEKDAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

const toMinutes = (value: string): number => {
  const [hours, minutes] = value.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
};

const normalizePhone = (value: string): string => {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  // The reservation form is for a Conakry restaurant: a 9-digit number without
  // an explicit country code is interpreted as a Guinean local number.
  if (digits.length === 9) digits = `224${digits}`;
  return digits;
};
const normalizeEmail = (value: string): string => value.trim().toLowerCase();

const conakryNow = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Conakry',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date());
  const part = (type: string) => parts.find(entry => entry.type === type)?.value ?? '';
  return {
    date: `${part('year')}-${part('month')}-${part('day')}`,
    minutes: Number(part('hour') || 0) * 60 + Number(part('minute') || 0)
  };
};

const weekdayForDate = (date: string) =>
  WEEKDAY_KEYS[new Date(`${date}T12:00:00Z`).getUTCDay()];

const validateConfiguredAvailability = async (reservation: { date: string; time: string }) => {
  const now = conakryNow();
  if (reservation.date < now.date) throw new ReservationValidationError('Invalid reservation date: date is in the past');
  if (reservation.date === now.date && toMinutes(reservation.time) <= now.minutes) {
    throw new ReservationValidationError('Invalid reservation time: time has already passed');
  }

  const { data, error } = await supabase.from('settings').select('data').eq('id', 'global').maybeSingle();
  if (error) throw error;

  const schedule = (data?.data as any)?.weeklyHours;
  if (!schedule?.enabled) return;

  const day = schedule.days?.[weekdayForDate(reservation.date)];
  if (!day || day.closed || !day.open || !day.close) {
    throw new ReservationValidationError('Invalid reservation time: restaurant is closed on this date');
  }

  const value = toMinutes(reservation.time);
  const open = toMinutes(day.open);
  const close = toMinutes(day.close);
  const allowed = open < close ? value >= open && value < close : value >= open || value < close;
  if (!allowed) throw new ReservationValidationError('Invalid reservation time: outside configured opening hours');
};

const ensureNoDuplicateReservation = async (reservation: { date: string; time: string; email: string; phone: string }) => {
  const { data, error } = await supabase
    .from('reservations')
    .select('id,status,data')
    .eq('date', reservation.date);
  if (error) throw error;

  const reservationEmail = normalizeEmail(reservation.email);
  const reservationPhone = normalizePhone(reservation.phone);
  const duplicate = (data || []).some((row: any) => {
    if (['cancelled', 'rejected'].includes(row.status)) return false;
    const existing = row.data || {};
    const sameEmail = typeof existing.email === 'string' &&
      normalizeEmail(existing.email) === reservationEmail;
    const samePhone = reservationPhone.length > 0 &&
      typeof existing.phone === 'string' &&
      normalizePhone(existing.phone) === reservationPhone;
    return existing.time === reservation.time && (sameEmail || samePhone);
  });

  if (duplicate) {
    throw new ReservationValidationError('Invalid reservation: a similar request already exists for this date and time');
  }
};

const normalizeReservationStatus = (value: unknown): ReservationWorkflowStatus => {
  if (value === 'approved') return 'confirmed';
  if (value === 'rejected') return 'cancelled';
  return ALLOWED_STATUSES.has(value as ReservationWorkflowStatus)
    ? value as ReservationWorkflowStatus
    : 'pending';
};

const format = (row: any) => ({
  id: row.id,
  ...(row.data || {}),
  status: normalizeReservationStatus(row.status),
  date: row.date,
  createdAt: row.created_at,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const getParam = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

const cleanString = (value: unknown, field: string, maxLength: number, required = true): string => {
  if (typeof value !== 'string') {
    if (!required && (value === undefined || value === null || value === '')) return '';
    throw new ReservationValidationError(`${field} must be a string`);
  }
  const result = value.trim();
  if (required && !result) throw new ReservationValidationError(`${field} is required`);
  if (result.length > maxLength) throw new ReservationValidationError(`${field} is too long`);
  return result;
};

export const validateReservation = (body: unknown) => {
  if (!isRecord(body)) throw new ReservationValidationError('Invalid reservation payload');

  const suppliedName = cleanString(body.name, 'name', MAX_NAME * 2, false);
  const firstName = cleanString(body.firstName, 'firstName', MAX_NAME, false);
  const lastName = cleanString(body.lastName, 'lastName', MAX_NAME, false);
  const name = suppliedName || `${firstName} ${lastName}`.trim();
  if (!name) throw new ReservationValidationError('name is required');

  const email = cleanString(body.email, 'email', MAX_EMAIL).toLowerCase();
  const phone = cleanString(body.phone, 'phone', MAX_PHONE);
  const date = cleanString(body.date, 'date', 10);
  const time = cleanString(body.time, 'time', 5);
  const notes = cleanString(body.notes, 'notes', MAX_NOTES, false);
  const guests = body.guests;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new ReservationValidationError('date must use YYYY-MM-DD format');
  const parsedDate = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) {
    throw new ReservationValidationError('Invalid reservation date');
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new ReservationValidationError('Invalid email address');
  if (!/^\+?[0-9 ()-]{6,30}$/.test(phone)) throw new ReservationValidationError('Invalid phone number');
  if (!ALLOWED_TIMES.has(time)) throw new ReservationValidationError('Invalid reservation time');
  if (typeof guests !== 'number' || !Number.isInteger(guests) || guests < 1 || guests > 8) {
    throw new ReservationValidationError('guests must be between 1 and 8');
  }

  return { name, firstName, lastName, email, phone, date, time, guests, notes };
};

const validateUuid = (value: string | string[] | undefined) => {
  const id = getParam(value);
  if (!id || !UUID_PATTERN.test(id)) throw new ReservationValidationError('Invalid reservation id');
  return id;
};

export const getReservations = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json((data || []).map(format));
  } catch {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

export const createReservation = async (req: Request, res: Response) => {
  try {
    const reservation = validateReservation(req.body);
    await validateConfiguredAvailability(reservation);
    await ensureNoDuplicateReservation(reservation);
    const payload = { ...reservation, createdAt: new Date().toISOString() };
    const { data, error } = await supabase
      .from('reservations')
      .insert({ status: 'pending', date: reservation.date, data: payload })
      .select('*')
      .single();
    if (error) throw error;
    res.status(201).json(format(data));
  } catch (error) {
    if (error instanceof ReservationValidationError) {
      return res.status(400).json({ error: error.message });
    }
    serverLog('error', 'reservation.create_failed', error);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
};

export const updateReservationStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = validateUuid(req.params.id);
    if (!isRecord(req.body) || typeof req.body.status !== 'string' || !ALLOWED_STATUSES.has(req.body.status as ReservationWorkflowStatus)) {
      return res.status(400).json({ error: 'Invalid reservation status' });
    }
    const { data: current, error: currentError } = await supabase
      .from('reservations')
      .select('status')
      .eq('id', id)
      .maybeSingle();
    if (currentError) throw currentError;
    if (!current) return res.status(404).json({ error: 'Reservation not found' });

    const currentStatus = normalizeReservationStatus(current.status);
    const nextStatus = req.body.status as ReservationWorkflowStatus;
    if (currentStatus !== nextStatus && !RESERVATION_TRANSITIONS[currentStatus].has(nextStatus)) {
      return res.status(409).json({ error: `Invalid reservation status transition: ${currentStatus} -> ${nextStatus}` });
    }

    const { data, error } = await supabase.from('reservations').update({ status: nextStatus }).eq('id', id).select('*').single();
    if (error) throw error;

    const reference = id.split('-')[0]?.toUpperCase() || id;
    const { error: logError } = await supabase.from('logs').insert({
      action: 'UPDATE_RESERVATION_STATUS',
      details: `Reservation #${reference} changed to ${req.body.status}`,
      user_id: req.user?.id || 'system',
      timestamp: new Date().toISOString()
    });
    if (logError) serverLog('warn', 'reservation.audit_log_failed', logError, { reservationId: id });

    res.json(format(data));
  } catch (error) {
    if (error instanceof ReservationValidationError) {
      return res.status(400).json({ error: error.message });
    }
    serverLog('error', 'reservation.status_update_failed', error);
    res.status(500).json({ error: 'Failed to update reservation status' });
  }
};

export const deleteReservation = async (req: Request, res: Response) => {
  try {
    const id = validateUuid(req.params.id);
    const { error } = await supabase.from('reservations').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    if (error instanceof ReservationValidationError) {
      return res.status(400).json({ error: error.message });
    }
    serverLog('error', 'reservation.delete_failed', error);
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
};
