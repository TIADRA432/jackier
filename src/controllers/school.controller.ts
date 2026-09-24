import { NextFunction, Request, Response } from 'express';
import { getCollection, addDoc, updateDoc, deleteDoc } from '../services/db.service';
import { supabase } from '../config/supabase';
import {
  CatalogValidationError,
  catalogError,
  optionalOrder,
  requireKnownFields,
  validateUuid
} from './catalog.validation';

const PROGRAM_FIELDS = new Set([
  'title', 'description', 'duration', 'level', 'price', 'capacity',
  'prerequisites', 'instructor', 'materialsIncluded', 'status',
  'active', 'displayOrder'
]);
const SESSION_FIELDS = new Set(['programId', 'startsAt', 'endsAt', 'capacity', 'location', 'status']);
const REGISTRATION_FIELDS = new Set(['sessionId', 'fullName', 'email', 'phone', 'notes']);
const REGISTRATION_STATUSES = new Set(['pending', 'confirmed', 'paid', 'cancelled']);
const PROGRAM_STATUSES = new Set(['draft', 'published', 'archived']);
const SESSION_STATUSES = new Set(['scheduled', 'cancelled', 'completed']);
const PROGRAM_LEVELS = new Set(['Débutant', 'Intermédiaire', 'Pro']);

type SchoolPayload = Record<string, string | number | boolean | string[] | null>;

const cleanText = (value: unknown, field: string, maxLength: number, required = false): string | null | undefined => {
  if (value === undefined) return undefined;
  if (value === null || value === '') {
    if (required) throw new CatalogValidationError(`${field} is required`);
    return null;
  }
  if (typeof value !== 'string') throw new CatalogValidationError(`Invalid ${field}`);

  const normalized = value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\r\n?/g, '\n')
    .trim();

  if (!normalized || normalized.length > maxLength) throw new CatalogValidationError(`Invalid ${field}`);
  if (/<\/?[a-z][\s\S]*>/i.test(normalized) || /(?:javascript|data):/i.test(normalized)) {
    throw new CatalogValidationError(`Invalid ${field}`);
  }
  return normalized;
};

const cleanEmail = (value: unknown): string => {
  const email = cleanText(value, 'email', 254, true) as string;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new CatalogValidationError('Invalid email');
  return email.toLowerCase();
};

const cleanPhone = (value: unknown): string => {
  const phone = cleanText(value, 'phone', 32, true) as string;
  if (!/^\+?[0-9 ()-]{6,32}$/.test(phone)) throw new CatalogValidationError('Invalid phone');
  return phone;
};

const positiveInteger = (value: unknown, field: string, min: number, max: number): number | undefined => {
  if (value === undefined) return undefined;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) {
    throw new CatalogValidationError(`Invalid ${field}`);
  }
  return value;
};

const nonNegativePrice = (value: unknown): number | null | undefined => {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100_000_000) {
    throw new CatalogValidationError('Invalid price');
  }
  return value;
};

const cleanMaterials = (value: unknown): string[] | undefined => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.length > 30) throw new CatalogValidationError('Invalid materials included');
  return value
    .map(item => cleanText(item, 'material', 120, true) as string)
    .filter(Boolean);
};

const isoDate = (value: unknown, field: string): string => {
  const text = cleanText(value, field, 64, true) as string;
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) throw new CatalogValidationError(`Invalid ${field}`);
  return date.toISOString();
};

export const validateSchoolPayload = (body: unknown, partial = false): SchoolPayload => {
  const source = requireKnownFields(body, PROGRAM_FIELDS);
  const payload: SchoolPayload = {};

  const title = cleanText(source.title, 'title', 160, !partial);
  if (title !== undefined) payload.title = title;

  const description = cleanText(source.description, 'description', 2_000);
  const duration = cleanText(source.duration, 'duration', 120);
  const prerequisites = cleanText(source.prerequisites, 'prerequisites', 1_000);
  const instructor = cleanText(source.instructor, 'instructor', 160);
  const price = nonNegativePrice(source.price);
  const capacity = positiveInteger(source.capacity, 'capacity', 1, 500);
  const displayOrder = optionalOrder(source.displayOrder);
  const materialsIncluded = cleanMaterials(source.materialsIncluded);

  if (description !== undefined) payload.description = description;
  if (duration !== undefined) payload.duration = duration;
  if (prerequisites !== undefined) payload.prerequisites = prerequisites;
  if (instructor !== undefined) payload.instructor = instructor;
  if (price !== undefined) payload.price = price;
  if (capacity !== undefined) payload.capacity = capacity;
  if (displayOrder !== undefined) payload.displayOrder = displayOrder;
  if (materialsIncluded !== undefined) payload.materialsIncluded = materialsIncluded;

  if (source.level !== undefined) {
    const level = cleanText(source.level, 'level', 40, true) as string;
    if (!PROGRAM_LEVELS.has(level)) throw new CatalogValidationError('Invalid level');
    payload.level = level;
  }

  if (source.status !== undefined) {
    const status = cleanText(source.status, 'status', 20, true) as string;
    if (!PROGRAM_STATUSES.has(status)) throw new CatalogValidationError('Invalid program status');
    payload.status = status;
    payload.active = status === 'published';
  } else if (source.active !== undefined) {
    if (typeof source.active !== 'boolean') throw new CatalogValidationError('Invalid active');
    payload.active = source.active;
    payload.status = source.active ? 'published' : 'draft';
  }

  return payload;
};

const validateSessionPayload = (body: unknown, partial = false): Record<string, unknown> => {
  const source = requireKnownFields(body, SESSION_FIELDS);
  const payload: Record<string, unknown> = {};

  if (!partial || source.programId !== undefined) payload.programId = validateUuid(source.programId as string | undefined, 'school program');
  if (!partial || source.startsAt !== undefined) payload.startsAt = isoDate(source.startsAt, 'startsAt');
  if (!partial || source.endsAt !== undefined) payload.endsAt = isoDate(source.endsAt, 'endsAt');

  const capacity = positiveInteger(source.capacity, 'capacity', 1, 500);
  if (capacity !== undefined) payload.capacity = capacity;

  const location = cleanText(source.location, 'location', 180);
  if (location !== undefined) payload.location = location;

  if (source.status !== undefined) {
    const status = cleanText(source.status, 'status', 20, true) as string;
    if (!SESSION_STATUSES.has(status)) throw new CatalogValidationError('Invalid session status');
    payload.status = status;
  }

  if (payload.startsAt && payload.endsAt && new Date(payload.endsAt as string) <= new Date(payload.startsAt as string)) {
    throw new CatalogValidationError('Session end must be after start');
  }

  return payload;
};

const sortPrograms = (items: any[]) =>
  items.sort((a, b) => Number(a.displayOrder ?? 0) - Number(b.displayOrder ?? 0));

const publicPrograms = (items: any[]) =>
  sortPrograms(items.filter((program: any) => (program.status ?? (program.active !== false ? 'published' : 'draft')) === 'published'));

const registrationCountBySession = async (sessionIds: string[]) => {
  if (!sessionIds.length) return new Map<string, number>();
  const { data, error } = await supabase
    .from('school_registrations')
    .select('session_id,status')
    .in('session_id', sessionIds)
    .neq('status', 'cancelled');
  if (error) throw error;
  const counts = new Map<string, number>();
  for (const row of data ?? []) counts.set(row.session_id, (counts.get(row.session_id) ?? 0) + 1);
  return counts;
};

const withRemainingPlaces = async (sessions: any[]) => {
  const counts = await registrationCountBySession(sessions.map(session => session.id));
  return sessions.map(session => ({
    id: session.id,
    programId: session.program_id,
    startsAt: session.starts_at,
    endsAt: session.ends_at,
    capacity: session.capacity,
    location: session.location,
    status: session.status,
    createdAt: session.created_at,
    updatedAt: session.updated_at,
    registeredCount: counts.get(session.id) ?? 0,
    remainingPlaces: Math.max(0, Number(session.capacity) - (counts.get(session.id) ?? 0))
  }));
};

export const getPublicSchoolPrograms = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(publicPrograms(await getCollection('schoolPrograms')));
  } catch (error) {
    next(error);
  }
};

export const getSchoolPrograms = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(sortPrograms(await getCollection('schoolPrograms')));
  } catch (error) {
    next(error);
  }
};

export const createSchoolProgram = async (req: Request, res: Response) => {
  try {
    const payload = validateSchoolPayload(req.body, false);
    const status = String(payload.status ?? 'draft');
    res.status(201).json(await addDoc('schoolPrograms', {
      ...payload,
      status,
      active: status === 'published',
      displayOrder: payload.displayOrder ?? 0
    }));
  } catch (error) {
    return catalogError(error, res, 'Failed to create school program');
  }
};

export const updateSchoolProgram = async (req: Request, res: Response) => {
  try {
    const id = validateUuid(req.params.id, 'school program');
    const existing = (await getCollection('schoolPrograms')).find((item: any) => item.id === id);
    if (!existing) return res.status(404).json({ error: 'School program not found' });
    const payload = validateSchoolPayload(req.body, true);
    const { id: _id, createdAt: _createdAt, ...existingData } = existing;
    const merged = { ...existingData, ...payload };
    res.json(await updateDoc('schoolPrograms', id, merged));
  } catch (error) {
    return catalogError(error, res, 'Failed to update school program');
  }
};

export const deleteSchoolProgram = async (req: Request, res: Response) => {
  try {
    const id = validateUuid(req.params.id, 'school program');
    const { count, error } = await supabase
      .from('school_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('program_id', id);
    if (error) throw error;
    if ((count ?? 0) > 0) return res.status(409).json({ error: 'Archive this program instead: sessions already exist' });
    await deleteDoc('schoolPrograms', id);
    res.json({ success: true });
  } catch (error) {
    return catalogError(error, res, 'Failed to delete school program');
  }
};

export const getPublicSchoolSessions = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const programIds = new Set(publicPrograms(await getCollection('schoolPrograms')).map((program: any) => program.id));
    if (!programIds.size) return res.json([]);

    const { data, error } = await supabase
      .from('school_sessions')
      .select('*')
      .in('program_id', [...programIds])
      .eq('status', 'scheduled')
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true });
    if (error) throw error;
    res.json(await withRemainingPlaces(data ?? []));
  } catch (error) {
    next(error);
  }
};

export const getAdminSchoolSessions = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase.from('school_sessions').select('*').order('starts_at', { ascending: true });
    if (error) throw error;
    res.json(await withRemainingPlaces(data ?? []));
  } catch (error) {
    next(error);
  }
};

export const createSchoolSession = async (req: Request, res: Response) => {
  try {
    const payload = validateSessionPayload(req.body, false);
    if (new Date(payload.startsAt as string) <= new Date()) throw new CatalogValidationError('Session start must be in the future');

    const program = (await getCollection('schoolPrograms')).find((item: any) => item.id === payload.programId);
    if (!program || program.status === 'archived') throw new CatalogValidationError('Invalid school program');

    const { data, error } = await supabase.from('school_sessions').insert({
      program_id: payload.programId,
      starts_at: payload.startsAt,
      ends_at: payload.endsAt,
      capacity: payload.capacity,
      location: payload.location,
      status: payload.status ?? 'scheduled'
    }).select('*').single();
    if (error) throw error;
    res.status(201).json((await withRemainingPlaces([data]))[0]);
  } catch (error) {
    return catalogError(error, res, 'Failed to create school session');
  }
};

export const updateSchoolSession = async (req: Request, res: Response) => {
  try {
    const id = validateUuid(req.params.id, 'school session');
    const payload = validateSessionPayload(req.body, true);

    const { data: current, error: currentError } = await supabase
      .from('school_sessions')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (currentError) throw currentError;
    if (!current) return res.status(404).json({ error: 'School session not found' });

    const nextStartsAt = String(payload.startsAt ?? current.starts_at);
    const nextEndsAt = String(payload.endsAt ?? current.ends_at);
    const nextCapacity = Number(payload.capacity ?? current.capacity);
    if (new Date(nextEndsAt) <= new Date(nextStartsAt)) {
      throw new CatalogValidationError('Session end must be after start');
    }

    const counts = await registrationCountBySession([id]);
    if ((counts.get(id) ?? 0) > nextCapacity) {
      return res.status(409).json({ error: 'Capacity cannot be lower than current registrations' });
    }

    if (payload.programId !== undefined) {
      const program = (await getCollection('schoolPrograms')).find((item: any) => item.id === payload.programId);
      if (!program || program.status === 'archived') throw new CatalogValidationError('Invalid school program');
    }

    const mapped: Record<string, unknown> = {};
    if (payload.programId !== undefined) mapped.program_id = payload.programId;
    if (payload.startsAt !== undefined) mapped.starts_at = payload.startsAt;
    if (payload.endsAt !== undefined) mapped.ends_at = payload.endsAt;
    if (payload.capacity !== undefined) mapped.capacity = payload.capacity;
    if (payload.location !== undefined) mapped.location = payload.location;
    if (payload.status !== undefined) mapped.status = payload.status;
    mapped.updated_at = new Date().toISOString();

    const { data, error } = await supabase.from('school_sessions').update(mapped).eq('id', id).select('*').single();
    if (error) throw error;
    res.json((await withRemainingPlaces([data]))[0]);
  } catch (error) {
    return catalogError(error, res, 'Failed to update school session');
  }
};

export const deleteSchoolSession = async (req: Request, res: Response) => {
  try {
    const id = validateUuid(req.params.id, 'school session');
    const { count, error: countError } = await supabase
      .from('school_registrations')
      .select('id', { count: 'exact', head: true })
      .eq('session_id', id);
    if (countError) throw countError;
    if ((count ?? 0) > 0) {
      const { data, error } = await supabase
        .from('school_sessions')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single();
      if (error) throw error;
      return res.json((await withRemainingPlaces([data]))[0]);
    }
    const { error } = await supabase.from('school_sessions').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    return catalogError(error, res, 'Failed to delete school session');
  }
};

export const createSchoolRegistration = async (req: Request, res: Response) => {
  try {
    const source = requireKnownFields(req.body, REGISTRATION_FIELDS);
    const sessionId = validateUuid(source.sessionId as string | undefined, 'school session');
    const fullName = cleanText(source.fullName, 'fullName', 160, true) as string;
    const email = cleanEmail(source.email);
    const phone = cleanPhone(source.phone);
    const notes = cleanText(source.notes, 'notes', 1_200);

    const { data: session, error: sessionError } = await supabase
      .from('school_sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle();
    if (sessionError) throw sessionError;
    if (!session || session.status !== 'scheduled' || new Date(session.starts_at) <= new Date()) {
      return res.status(409).json({ error: 'This session is no longer open for registration' });
    }

    const program = (await getCollection('schoolPrograms')).find((item: any) => item.id === session.program_id);
    if (!program || (program.status ?? 'draft') !== 'published') {
      return res.status(409).json({ error: 'This program is not open for registration' });
    }

    const { data, error } = await supabase.rpc('register_school_participant', {
      p_session_id: sessionId,
      p_full_name: fullName,
      p_email: email,
      p_phone: phone,
      p_notes: notes,
      p_price_snapshot: typeof program.price === 'number' ? program.price : null
    });
    if (error) {
      const message = String(error.message || '');
      if (message.includes('session_full')) return res.status(409).json({ error: 'This session is full' });
      if (message.includes('duplicate_registration')) return res.status(409).json({ error: 'A registration already exists for this participant and session' });
      if (message.includes('session_not_open')) return res.status(409).json({ error: 'This session is no longer open for registration' });
      throw error;
    }

    const created = Array.isArray(data) ? data[0] : data;
    res.status(201).json({
      id: created.id,
      sessionId: created.session_id,
      status: created.status,
      createdAt: created.created_at
    });
  } catch (error) {
    return catalogError(error, res, 'Failed to create school registration');
  }
};

export const getSchoolRegistrations = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('school_registrations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json((data ?? []).map(item => ({
      id: item.id,
      sessionId: item.session_id,
      fullName: item.full_name,
      email: item.email,
      phone: item.phone,
      notes: item.notes,
      status: item.status,
      priceSnapshot: item.price_snapshot,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    })));
  } catch (error) {
    next(error);
  }
};

export const updateSchoolRegistrationStatus = async (req: Request, res: Response) => {
  try {
    const id = validateUuid(req.params.id, 'school registration');
    const source = requireKnownFields(req.body, new Set(['status']));
    const status = cleanText(source.status, 'status', 20, true) as string;
    if (!REGISTRATION_STATUSES.has(status)) throw new CatalogValidationError('Invalid registration status');

    const { data, error } = await supabase.rpc('update_school_registration_status', {
      p_registration_id: id,
      p_status: status
    });
    if (error) {
      const message = String(error.message || '');
      if (message.includes('session_full')) return res.status(409).json({ error: 'The session is full; this cancelled registration cannot be reactivated' });
      if (message.includes('registration_not_found')) return res.status(404).json({ error: 'School registration not found' });
      throw error;
    }

    const updated = Array.isArray(data) ? data[0] : data;
    res.json({
      id: updated.id,
      sessionId: updated.session_id,
      fullName: updated.full_name,
      email: updated.email,
      phone: updated.phone,
      notes: updated.notes,
      status: updated.status,
      priceSnapshot: updated.price_snapshot,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at
    });
  } catch (error) {
    return catalogError(error, res, 'Failed to update school registration');
  }
};
