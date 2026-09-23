import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

const MAX_NAME = 160;
const MAX_EMAIL = 254;
const MAX_PHONE = 30;
const MAX_MESSAGE = 2_000;
const MAX_BUDGET = 120;
const MAX_GUESTS = 5_000;
const ALLOWED_EVENT_TYPES = new Set(['mariage', 'corporate', 'anniversaire', 'prive', 'autre']);
const ALLOWED_STATUSES = new Set(['pending', 'confirmed', 'cancelled', 'completed', 'approved', 'rejected']);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const format = (row: any) => ({
  id: row.id,
  ...(row.data || {}),
  status: row.status,
  createdAt: row.created_at,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const cleanString = (value: unknown, field: string, maxLength: number, required = true): string => {
  if (typeof value !== 'string') {
    if (!required && (value === undefined || value === null)) return '';
    throw new Error(`Invalid catering ${field}`);
  }
  const result = value.trim();
  if (required && !result) throw new Error(`Invalid catering ${field}`);
  if (result.length > maxLength) throw new Error(`Invalid catering ${field}`);
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
  if (!isRecord(body)) throw new Error('Invalid catering payload');

  const allowed = new Set(['name', 'phone', 'email', 'eventType', 'date', 'guests', 'budget', 'message']);
  if (Object.keys(body).some(key => !allowed.has(key))) throw new Error('Invalid catering field');

  const name = cleanString(body.name, 'name', MAX_NAME);
  const phone = cleanString(body.phone, 'phone', MAX_PHONE);
  const email = cleanString(body.email, 'email', MAX_EMAIL).toLowerCase();
  const eventType = cleanString(body.eventType, 'event type', 40);
  const date = cleanString(body.date, 'date', 10);
  const message = cleanString(body.message, 'message', MAX_MESSAGE);
  const budget = cleanString(body.budget ?? '', 'budget', MAX_BUDGET, false);
  const guests = body.guests;

  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Invalid catering email');
  if (!ALLOWED_EVENT_TYPES.has(eventType)) throw new Error('Invalid catering event type');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Invalid catering date');
  const parsedDate = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date || date < conakryDateString()) {
    throw new Error('Invalid catering date');
  }
  if (typeof guests !== 'number' || !Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) {
    throw new Error('Invalid catering guests');
  }

  return { name, phone, email, eventType, date, guests, budget, message };
};

const validateUuid = (value: string | string[] | undefined) => {
  const id = Array.isArray(value) ? value[0] : value;
  if (!id || !UUID_PATTERN.test(id)) throw new Error('Invalid catering event id');
  return id;
};

const validationResponse = (error: unknown, fallback: string, res: Response) => {
  const message = error instanceof Error ? error.message : '';
  const isValidationError = message.startsWith('Invalid catering');
  return res.status(isValidationError ? 400 : 500).json({ error: isValidationError ? message : fallback });
};

const ensureNoDuplicateCateringRequest = async (request: { date: string; email: string; phone: string; eventType: string }) => {
  const { data, error } = await supabase
    .from('catering_events')
    .select('id,status,data');
  if (error) throw error;

  const duplicate = (data || []).some((row: any) => {
    if (['cancelled', 'rejected'].includes(row.status)) return false;
    const existing = row.data || {};
    return existing.date === request.date &&
      existing.eventType === request.eventType &&
      (existing.email === request.email || existing.phone === request.phone);
  });

  if (duplicate) throw new Error('Invalid catering duplicate request');
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

export const updateCateringEvent = async (req: Request, res: Response) => {
  try {
    const id = validateUuid(req.params.id);
    if (!isRecord(req.body) || Object.keys(req.body).length !== 1 || typeof req.body.status !== 'string' || !ALLOWED_STATUSES.has(req.body.status)) {
      throw new Error('Invalid catering status');
    }

    const { data, error } = await supabase
      .from('catering_events')
      .update({ status: req.body.status })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
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
