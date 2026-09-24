import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { serverLog } from '../utils/server-log';

const MAX_NAME = 160;
const MAX_EMAIL = 254;
const MAX_PHONE = 30;
const MAX_MESSAGE = 2_000;
const MAX_BUDGET = 120;
const MAX_GUESTS = 5_000;
class CateringValidationError extends Error {}

type CateringWorkflowStatus = 'pending' | 'contacted' | 'quoted' | 'confirmed' | 'completed' | 'cancelled';
const ALLOWED_EVENT_TYPES = new Set(['mariage', 'corporate', 'anniversaire', 'prive', 'autre']);
const ALLOWED_STATUSES = new Set<CateringWorkflowStatus>(['pending', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled']);
const CATERING_TRANSITIONS: Record<CateringWorkflowStatus, Set<CateringWorkflowStatus>> = {
  pending: new Set(['contacted', 'cancelled']),
  contacted: new Set(['quoted', 'cancelled']),
  quoted: new Set(['confirmed', 'cancelled']),
  confirmed: new Set(['completed', 'cancelled']),
  completed: new Set(),
  cancelled: new Set()
};
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const normalizeCateringStatus = (value: unknown): CateringWorkflowStatus => {
  if (value === 'approved') return 'confirmed';
  if (value === 'rejected') return 'cancelled';
  return ALLOWED_STATUSES.has(value as CateringWorkflowStatus)
    ? value as CateringWorkflowStatus
    : 'pending';
};

const normalizePhone = (value: string): string => {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 9) digits = `224${digits}`;
  return digits;
};

const normalizeEmail = (value: string): string => value.trim().toLowerCase();

const format = (row: any) => ({
  id: row.id,
  ...(row.data || {}),
  status: normalizeCateringStatus(row.status),
  createdAt: row.created_at,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const cleanString = (value: unknown, field: string, maxLength: number, required = true): string => {
  if (typeof value !== 'string') {
    if (!required && (value === undefined || value === null)) return '';
    throw new CateringValidationError(`Invalid catering ${field}`);
  }
  const result = value.trim();
  if (required && !result) throw new CateringValidationError(`Invalid catering ${field}`);
  if (result.length > maxLength) throw new CateringValidationError(`Invalid catering ${field}`);
  return result;
};

const conakryDateString = (): string => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Conakry',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());
  const part = (type: string) => parts.find(entry => entry.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
};

export const validateCateringPayload = (body: unknown) => {
  if (!isRecord(body)) throw new CateringValidationError('Invalid catering payload');

  const allowed = new Set(['name', 'phone', 'email', 'eventType', 'date', 'guests', 'budget', 'message']);
  if (Object.keys(body).some(key => !allowed.has(key))) throw new CateringValidationError('Invalid catering field');

  const name = cleanString(body.name, 'name', MAX_NAME);
  const phone = cleanString(body.phone, 'phone', MAX_PHONE);
  const email = cleanString(body.email, 'email', MAX_EMAIL).toLowerCase();
  const eventType = cleanString(body.eventType, 'event type', 40);
  const date = cleanString(body.date, 'date', 10);
  const message = cleanString(body.message, 'message', MAX_MESSAGE);
  const budget = cleanString(body.budget ?? '', 'budget', MAX_BUDGET, false);
  const guests = body.guests;

  if (!/^\S+@\S+\.\S+$/.test(email)) throw new CateringValidationError('Invalid catering email');
  if (!/^\+?[0-9 ()-]{6,30}$/.test(phone)) throw new CateringValidationError('Invalid catering phone');
  if (!ALLOWED_EVENT_TYPES.has(eventType)) throw new CateringValidationError('Invalid catering event type');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new CateringValidationError('Invalid catering date');
  const parsedDate = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date || date < conakryDateString()) {
    throw new CateringValidationError('Invalid catering date');
  }
  if (typeof guests !== 'number' || !Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) {
    throw new CateringValidationError('Invalid catering guests');
  }

  return { name, phone, email, eventType, date, guests, budget, message };
};

const validateUuid = (value: string | string[] | undefined) => {
  const id = Array.isArray(value) ? value[0] : value;
  if (!id || !UUID_PATTERN.test(id)) throw new CateringValidationError('Invalid catering event id');
  return id;
};

const validationResponse = (error: unknown, fallback: string, res: Response) => {
  if (error instanceof CateringValidationError) {
    return res.status(400).json({ error: error.message });
  }
  serverLog('error', 'catering.request_failed', error, { fallback });
  return res.status(500).json({ error: fallback });
};

const ensureNoDuplicateCateringRequest = async (request: { date: string; email: string; phone: string; eventType: string }) => {
  const { data, error } = await supabase
    .from('catering_events')
    .select('id,status,data');
  if (error) throw error;

  const requestEmail = normalizeEmail(request.email);
  const requestPhone = normalizePhone(request.phone);
  const duplicate = (data || []).some((row: any) => {
    if (normalizeCateringStatus(row.status) === 'cancelled') return false;
    const existing = row.data || {};
    const sameEmail = typeof existing.email === 'string' &&
      normalizeEmail(existing.email) === requestEmail;
    const samePhone = requestPhone.length > 0 &&
      typeof existing.phone === 'string' &&
      normalizePhone(existing.phone) === requestPhone;
    return existing.date === request.date &&
      existing.eventType === request.eventType &&
      (sameEmail || samePhone);
  });

  if (duplicate) throw new CateringValidationError('Invalid catering duplicate request');
};

export const getCateringEvents = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('catering_events').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json((data || []).map(format));
  } catch {
    res.status(500).json({ error: 'Failed to fetch catering events' });
  }
};

export const createCateringEvent = async (req: Request, res: Response) => {
  try {
    const catering = validateCateringPayload(req.body);
    await ensureNoDuplicateCateringRequest(catering);
    const payload = { ...catering, createdAt: new Date().toISOString() };
    const { data, error } = await supabase
      .from('catering_events')
      .insert({ status: 'pending', data: payload })
      .select('*')
      .single();
    if (error) throw error;
    res.status(201).json(format(data));
  } catch (error) {
    return validationResponse(error, 'Failed to create catering event', res);
  }
};

export const updateCateringEvent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = validateUuid(req.params.id);
    if (!isRecord(req.body) || Object.keys(req.body).length !== 1 || typeof req.body.status !== 'string' || !ALLOWED_STATUSES.has(req.body.status as CateringWorkflowStatus)) {
      throw new CateringValidationError('Invalid catering status');
    }

    const { data: current, error: currentError } = await supabase
      .from('catering_events')
      .select('status')
      .eq('id', id)
      .maybeSingle();
    if (currentError) throw currentError;
    if (!current) return res.status(404).json({ error: 'Catering request not found' });

    const currentStatus = normalizeCateringStatus(current.status);
    const nextStatus = req.body.status as CateringWorkflowStatus;
    if (currentStatus !== nextStatus && !CATERING_TRANSITIONS[currentStatus].has(nextStatus)) {
      return res.status(409).json({ error: `Invalid catering status transition: ${currentStatus} -> ${nextStatus}` });
    }

    const { data, error } = await supabase
      .from('catering_events')
      .update({ status: nextStatus })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;

    const reference = id.split('-')[0]?.toUpperCase() || id;
    const { error: logError } = await supabase.from('logs').insert({
      action: 'UPDATE_CATERING_STATUS',
      details: `Catering request #${reference} changed to ${req.body.status}`,
      user_id: req.user?.id || 'system',
      timestamp: new Date().toISOString()
    });
    if (logError) serverLog('warn', 'catering.audit_log_failed', logError, { cateringId: id });

    res.json(format(data));
  } catch (error) {
    return validationResponse(error, 'Failed to update catering event', res);
  }
};

export const deleteCateringEvent = async (req: Request, res: Response) => {
  try {
    const id = validateUuid(req.params.id);
    const { error } = await supabase.from('catering_events').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    return validationResponse(error, 'Failed to delete catering event', res);
  }
};
