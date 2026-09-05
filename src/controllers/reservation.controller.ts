import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_PHONE = 30;
const MAX_NOTES = 1000;
const ALLOWED_TIMES = new Set([
  '12:00', '12:30', '13:00', '13:30', '14:00',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
]);

const format = (row: any) => ({
  id: row.id,
  ...(row.data || {}),
  status: row.status,
  date: row.date,
  createdAt: row.created_at,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const cleanString = (value: unknown, field: string, maxLength: number, required = true): string => {
  if (typeof value !== 'string') {
    if (!required && (value === undefined || value === null || value === '')) return '';
    throw new Error(`${field} must be a string`);
  }
  const result = value.trim();
  if (required && !result) throw new Error(`${field} is required`);
  if (result.length > maxLength) throw new Error(`${field} is too long`);
  return result;
};

const validateReservation = (body: unknown) => {
  if (!isRecord(body)) throw new Error('Invalid reservation payload');

  const firstName = cleanString(body.firstName, 'firstName', MAX_NAME);
  const lastName = cleanString(body.lastName, 'lastName', MAX_NAME);
  const name = cleanString(body.name, 'name', MAX_NAME * 2, false) || `${firstName} ${lastName}`;
  const email = cleanString(body.email, 'email', MAX_EMAIL).toLowerCase();
  const phone = cleanString(body.phone, 'phone', MAX_PHONE);
  const date = cleanString(body.date, 'date', 10);
  const time = cleanString(body.time, 'time', 5);
  const notes = cleanString(body.notes, 'notes', MAX_NOTES, false);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('date must use YYYY-MM-DD format');
  const parsedDate = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) {
    throw new Error('Invalid reservation date');
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Invalid email address');
  if (!ALLOWED_TIMES.has(time)) throw new Error('Invalid reservation time');
  if (!Number.isInteger(body.guests) || body.guests < 1 || body.guests > 8) {
    throw new Error('guests must be between 1 and 8');
  }

  return { firstName, lastName, name, email, phone, date, time, guests: body.guests, notes };
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
    const payload = { ...reservation, createdAt: new Date().toISOString() };
    const { data, error } = await supabase
      .from('reservations')
      .insert({ status: 'pending', date: reservation.date, data: payload })
      .select('*')
      .single();
    if (error) throw error;
    res.status(201).json(format(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid reservation';
    const isValidationError = message.startsWith('Invalid ') || message.includes(' is ') || message.includes('must ') || message.includes(' between ');
    res.status(isValidationError ? 400 : 500).json({ error: isValidationError ? message : 'Failed to create reservation' });
  }
};

export const updateReservationStatus = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('reservations').update({ status: req.body.status }).eq('id', req.params.id).select('*').single();
    if (error) throw error;
    res.json(format(data));
  } catch {
    res.status(500).json({ error: 'Failed to update reservation status' });
  }
};

export const deleteReservation = async (req: Request, res: Response) => {
  try {
    const { error } = await supabase.from('reservations').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
};
