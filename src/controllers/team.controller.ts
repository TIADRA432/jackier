import type { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import {
  CatalogValidationError,
  catalogError,
  optionalImageUrl,
  optionalOrder,
  optionalText,
  requireKnownFields,
  requiredText,
  validateUuid,
} from './catalog.validation';

export const TEAM_DEPARTMENTS = ['direction', 'cuisine', 'salle', 'administration', 'traiteur', 'ecole'] as const;
type TeamDepartment = typeof TEAM_DEPARTMENTS[number];

const TEAM_FIELDS = new Set([
  'name', 'role', 'department', 'photoUrl', 'bio',
  'active', 'publicVisible', 'displayOrder'
]);

type TeamPayload = {
  name?: string;
  role?: string;
  department?: TeamDepartment;
  photoUrl?: string | null;
  bio?: string | null;
  active?: boolean;
  publicVisible?: boolean;
  displayOrder?: number;
};

const optionalBoolean = (value: unknown, field: string): boolean | undefined => {
  if (value === undefined) return undefined;
  if (typeof value !== 'boolean') throw new CatalogValidationError(`Invalid ${field}`);
  return value;
};

const optionalDepartment = (value: unknown): TeamDepartment | undefined => {
  if (value === undefined) return undefined;
  const department = optionalText(value, 'department', 60);
  if (!department || !TEAM_DEPARTMENTS.includes(department as TeamDepartment)) {
    throw new CatalogValidationError('Invalid department');
  }
  return department as TeamDepartment;
};

const nullableBio = (value: unknown): string | null | undefined => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== 'string') throw new CatalogValidationError('Invalid bio');
  const result = value.trim();
  if (result.length > 600) throw new CatalogValidationError('Invalid bio');
  return result || null;
};

export const validateTeamPayload = (body: unknown, partial: boolean): TeamPayload => {
  const source = requireKnownFields(body, TEAM_FIELDS);
  const name = partial ? optionalText(source.name, 'name', 160) : requiredText(source.name, 'name', 160);
  const role = partial ? optionalText(source.role, 'role', 120) : requiredText(source.role, 'role', 120);
  const department = optionalDepartment(source.department);
  const photoUrl = source.photoUrl === null ? null : optionalImageUrl(source.photoUrl);
  const bio = nullableBio(source.bio);
  const active = optionalBoolean(source.active, 'active');
  const publicVisible = optionalBoolean(source.publicVisible, 'public visibility');
  const displayOrder = optionalOrder(source.displayOrder);
  const payload: TeamPayload = {};

  if (name !== undefined) payload.name = name;
  if (role !== undefined) payload.role = role;
  if (department !== undefined) payload.department = department;
  if (photoUrl !== undefined) payload.photoUrl = photoUrl;
  if (bio !== undefined) payload.bio = bio;
  if (active !== undefined) payload.active = active;
  if (publicVisible !== undefined) payload.publicVisible = publicVisible;
  if (displayOrder !== undefined) payload.displayOrder = displayOrder;
  return payload;
};

const toClient = (row: Record<string, unknown>) => ({
  id: String(row.id),
  name: String(row.name),
  role: String(row.role),
  department: String(row.department ?? 'salle'),
  photoUrl: row.photo_url === null ? null : String(row.photo_url),
  bio: row.bio === null ? null : String(row.bio ?? ''),
  active: Boolean(row.active),
  publicVisible: Boolean(row.public_visible),
  displayOrder: Number(row.display_order ?? 0),
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

const toPublicClient = (row: Record<string, unknown>) => ({
  id: String(row.id),
  name: String(row.name),
  role: String(row.role),
  department: String(row.department ?? 'salle'),
  photoUrl: row.photo_url === null ? null : String(row.photo_url),
  bio: row.bio === null ? null : String(row.bio ?? ''),
  displayOrder: Number(row.display_order ?? 0),
});

const toDatabase = (payload: TeamPayload) => ({
  ...(payload.name !== undefined ? { name: payload.name } : {}),
  ...(payload.role !== undefined ? { role: payload.role } : {}),
  ...(payload.department !== undefined ? { department: payload.department } : {}),
  ...(payload.photoUrl !== undefined ? { photo_url: payload.photoUrl } : {}),
  ...(payload.bio !== undefined ? { bio: payload.bio } : {}),
  ...(payload.active !== undefined ? { active: payload.active } : {}),
  ...(payload.publicVisible !== undefined ? { public_visible: payload.publicVisible } : {}),
  ...(payload.displayOrder !== undefined ? { display_order: payload.displayOrder } : {}),
});

export const getTeamMembers = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('team_members')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });
    if (error) throw error;
    res.json((data || []).map(toClient));
  } catch (error) {
    return catalogError(error, res, 'Failed to fetch team members');
  }
};

export const getPublicTeamMembers = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('team_members')
      .select('id,name,role,department,photo_url,bio,display_order')
      .eq('active', true)
      .eq('public_visible', true)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });
    if (error) throw error;
    res.json((data || []).map(toPublicClient));
  } catch (error) {
    return catalogError(error, res, 'Failed to fetch public team');
  }
};

export const createTeamMember = async (req: Request, res: Response) => {
  try {
    const payload = validateTeamPayload(req.body, false);
    const { data, error } = await supabase.from('team_members').insert({
      name: payload.name!,
      role: payload.role!,
      department: payload.department ?? 'salle',
      photo_url: payload.photoUrl ?? null,
      bio: payload.bio ?? null,
      active: payload.active ?? true,
      public_visible: payload.publicVisible ?? false,
      display_order: payload.displayOrder ?? 0,
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
