import type { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { CatalogValidationError, catalogError, optionalImageUrl, optionalText, requireKnownFields, requiredText, validateUuid } from './catalog.validation';

const TEAM_FIELDS = new Set(['name', 'role', 'photoUrl', 'active']);

type TeamPayload = {
  name?: string;
  role?: string;
  photoUrl?: string | null;
  active?: boolean;
};

const optionalBoolean = (value: unknown): boolean | undefined => {
  if (value === undefined) return undefined;
  if (typeof value !== 'boolean') throw new CatalogValidationError('Invalid active');
  return value;
};

export const validateTeamPayload = (body: unknown, partial: boolean): TeamPayload => {
  const source = requireKnownFields(body, TEAM_FIELDS);
  const name = partial ? optionalText(source.name, 'name', 160) : requiredText(source.name, 'name', 160);
  const role = partial ? optionalText(source.role, 'role', 120) : requiredText(source.role, 'role', 120);
  const photoUrl = source.photoUrl === null ? null : optionalImageUrl(source.photoUrl);
  const active = optionalBoolean(source.active);
  const payload: TeamPayload = {};

  if (name !== undefined) payload.name = name;
  if (role !== undefined) payload.role = role;
  if (photoUrl !== undefined) payload.photoUrl = photoUrl;
  if (active !== undefined) payload.active = active;
  return payload;
};

const toClient = (row: Record<string, unknown>) => ({
  id: String(row.id),
  name: String(row.name),
  role: String(row.role),
  photoUrl: row.photo_url === null ? null : String(row.photo_url),
  active: Boolean(row.active),
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

const toDatabase = (payload: TeamPayload) => ({
  ...(payload.name !== undefined ? { name: payload.name } : {}),
  ...(payload.role !== undefined ? { role: payload.role } : {}),
  ...(payload.photoUrl !== undefined ? { photo_url: payload.photoUrl } : {}),
  ...(payload.active !== undefined ? { active: payload.active } : {}),
});

export const getTeamMembers = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('team_members').select('*').order('name', { ascending: true });
    if (error) throw error;
    res.json((data || []).map(toClient));
  } catch (error) {
    return catalogError(error, res, 'Failed to fetch team members');
  }
};

export const createTeamMember = async (req: Request, res: Response) => {
  try {
    const payload = validateTeamPayload(req.body, false);
    const { data, error } = await supabase.from('team_members').insert({
      name: payload.name!,
      role: payload.role!,
      photo_url: payload.photoUrl ?? null,
      active: payload.active ?? true,
    }).select('*').single();
    if (error) throw error;
    res.status(201).json(toClient(data));
  } catch (error) {
    return catalogError(error, res, 'Failed to create team member');
  }
};

export const updateTeamMember = async (req: Request, res: Response) => {
  try {
    const id = validateUuid(req.params.id, 'team member');
    const payload = validateTeamPayload(req.body, true);
    const { data, error } = await supabase.from('team_members')
      .update({ ...toDatabase(payload), updated_at: new Date().toISOString() })
      .eq('id', id).select('*').single();
    if (error) throw error;
    res.json(toClient(data));
  } catch (error) {
    return catalogError(error, res, 'Failed to update team member');
  }
};

export const deleteTeamMember = async (req: Request, res: Response) => {
  try {
    const id = validateUuid(req.params.id, 'team member');
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    return catalogError(error, res, 'Failed to delete team member');
  }
};
