import { NextFunction, Request, Response } from 'express';
import { addDoc, deleteDoc, getCollection, updateDoc } from '../services/db.service';
import { catalogError, optionalOrder, optionalText, requireKnownFields, requiredText, validateUuid } from './catalog.validation';

const CATEGORY_FIELDS = new Set(['name', 'order']);
type CategoryPayload = Record<string, string | number>;

const validateCategoryPayload = (body: unknown, partial: boolean): CategoryPayload => {
  const source = requireKnownFields(body, CATEGORY_FIELDS);
  const name = partial ? optionalText(source.name, 'name', 80) : requiredText(source.name, 'name', 80);
  const order = optionalOrder(source.order);
  const payload: CategoryPayload = {};
  if (name !== undefined) payload.name = name;
  if (order !== undefined) payload.order = order;
  return payload;
};

export const getCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getCollection('menuCategories');
    res.json(data.sort((a: any, b: any) => Number(a.order ?? 0) - Number(b.order ?? 0)));
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    res.status(201).json(await addDoc('menuCategories', validateCategoryPayload(req.body, false)));
  } catch (error) {
    return catalogError(error, res, 'Failed to create category');
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = validateUuid(req.params.id, 'category');
    res.json(await updateDoc('menuCategories', id, validateCategoryPayload(req.body, true)));
  } catch (error) {
    return catalogError(error, res, 'Failed to update category');
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await deleteDoc('menuCategories', validateUuid(req.params.id, 'category'));
    res.json({ success: true });
  } catch (error) {
    return catalogError(error, res, 'Failed to delete category');
  }
};
