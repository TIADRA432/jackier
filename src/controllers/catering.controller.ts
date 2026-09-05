import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

const MAX_STRING_LENGTH = 1000;
const MAX_KEYS = 40;
const MAX_ARRAY_ITEMS = 50;
const ALLOWED_STATUSES = new Set(['pending', 'confirmed', 'cancelled', 'completed', 'approved', 'rejected']);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const format = (row: any) => ({
  id: row.id,
  ...(row.data || {}),
  status: row.status,
  createdAt: row.created_at,
});

const validateValue = (value: unknown, depth = 0): unknown => {
  if (depth > 4) throw new Error('Payload nesting is too deep');
  if (typeof value === 'string') {
    const result = value.trim();
    if (result.length > MAX_STRING_LENGTH) throw new Error('A text field is too long');
    return result;
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error('Invalid numeric value');
    return value;
  }
  if (typeof value === 'boolean' || value === null) return value;
  if (Array.isArray(value)) {
    if (value.length > MAX_ARRAY_ITEMS) throw new Error('Too many array items');
    return value.map(item => validateValue(item, depth + 1));
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length > MAX_KEYS) throw new Error('Too many fields in payload');
    return Object.fromEntries(entries.map(([key, item]) => {
      if (key.length > 100) throw new Error('A field name is too long');
      return [key, validateValue(item, depth + 1)];
    }));
  }
  throw new Error('Invalid payload value');
};

const validateCateringPayload = (body: unknown) => {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new Error('Invalid catering payload');
  }
  return validateValue(body) as Record<string, unknown>;
};

const validateUuid = (value: string | undefined) => {
  if (!value || !UUID_PATTERN.test(value)) throw new Error('Invalid catering event id');
};

const validationResponse = (error: unknown, fallback: string, res: Response) => {
  const message = error instanceof Error ? error.message : '';
  const isValidationError = message.startsWith('Invalid ') || message.includes('too ') || message.includes('Too ') || message.includes('A ') || message.includes('Payload ');
  return res.status(isValidationError ? 400 : 500).json({ error: isValidationError ? message : fallback });
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
    validateUuid(req.params.id);
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      throw new Error('Invalid catering payload');
    }
    const incoming = validateCateringPayload(req.body);
    if ('status' in incoming && (typeof incoming.status !== 'string' || !ALLOWED_STATUSES.has(incoming.status))) {
      throw new Error('Invalid catering status');
    }
    const { data: existing, error: readError } = await supabase.from('catering_events').select('*').eq('id', req.params.id).single();
    if (readError) throw readError;
    const payload = { ...(existing.data || {}), ...incoming };
    const { data, error } = await supabase.from('catering_events').update({ status: typeof incoming.status === 'string' ? incoming.status : existing.status, data: payload }).eq('id', req.params.id).select('*').single();
    if (error) throw error;
    res.json(format(data));
  } catch (error) {
    return validationResponse(error, 'Failed to update catering event', res);
  }
};

export const deleteCateringEvent = async (req: Request, res: Response) => {
  try {
    validateUuid(req.params.id);
    const { error } = await supabase.from('catering_events').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    return validationResponse(error, 'Failed to delete catering event', res);
  }
};