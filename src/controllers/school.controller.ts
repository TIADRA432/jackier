import { NextFunction, Request, Response } from 'express';
import { getCollection, addDoc, updateDoc, deleteDoc } from '../services/db.service';
import {
  CatalogValidationError,
  catalogError,
  optionalOrder,
  optionalText,
  requireKnownFields,
  requiredText,
  validateUuid
} from './catalog.validation';

const SCHOOL_FIELDS = new Set(['title', 'description', 'duration', 'level', 'active', 'displayOrder']);
type SchoolPayload = Record<string, string | number | boolean | null>;

const optionalNullableText = (value: unknown, field: string, maxLength: number): string | null | undefined => {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  return requiredText(value, field, maxLength);
};

export const validateSchoolPayload = (body: unknown, partial = false): SchoolPayload => {
  const source = requireKnownFields(body, SCHOOL_FIELDS);
  const payload: SchoolPayload = {};

  const title = partial ? optionalText(source.title, 'title', 160) : requiredText(source.title, 'title', 160);
  if (title !== undefined) payload.title = title;

  const description = optionalNullableText(source.description, 'description', 2_000);
  const duration = optionalNullableText(source.duration, 'duration', 120);
  const level = optionalNullableText(source.level, 'level', 120);
  const displayOrder = optionalOrder(source.displayOrder);

  if (description !== undefined) payload.description = description;
  if (duration !== undefined) payload.duration = duration;
  if (level !== undefined) payload.level = level;
  if (displayOrder !== undefined) payload.displayOrder = displayOrder;

  if (source.active !== undefined) {
    if (typeof source.active !== 'boolean') throw new CatalogValidationError('Invalid active');
    payload.active = source.active;
  }

  return payload;
};

const sortPrograms = (items: any[]) =>
  items.sort((a, b) => Number(a.displayOrder ?? 0) - Number(b.displayOrder ?? 0));

export const getPublicSchoolPrograms = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getCollection('schoolPrograms');
    res.json(sortPrograms(data.filter((program: any) => program.active !== false)));
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
    res.status(201).json(await addDoc('schoolPrograms', {
      ...payload,
      active: payload.active ?? true,
      displayOrder: payload.displayOrder ?? 0
    }));
  } catch (error) {
    return catalogError(error, res, 'Failed to create school program');
  }
};

export const updateSchoolProgram = async (req: Request, res: Response) => {
  try {
    const id = validateUuid(req.params.id, 'school program');
    res.json(await updateDoc('schoolPrograms', id, validateSchoolPayload(req.body, true)));
  } catch (error) {
    return catalogError(error, res, 'Failed to update school program');
  }
};

export const deleteSchoolProgram = async (req: Request, res: Response) => {
  try {
    await deleteDoc('schoolPrograms', validateUuid(req.params.id, 'school program'));
    res.json({ success: true });
  } catch (error) {
    return catalogError(error, res, 'Failed to delete school program');
  }
};
