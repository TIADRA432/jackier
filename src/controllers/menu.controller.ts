import { NextFunction, Request, Response } from 'express';
import { addDoc, deleteDoc, getCollection, updateDoc } from '../services/db.service';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MENU_FIELDS = new Set([
  'name', 'category', 'categoryId', 'price', 'shortDescription', 'imageUrl',
  'active', 'displayOrder', 'isFeatured', 'isVegetarian', 'isSpicy', 'isLocalSpecialty'
]);

class ValidationError extends Error {}

const getParam = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const requiredText = (value: unknown, field: string, maxLength: number): string => {
  if (typeof value !== 'string') throw new ValidationError(`${field} is required`);
  const result = value.trim();
  if (!result || result.length > maxLength) throw new ValidationError(`Invalid ${field}`);
  return result;
};

const optionalText = (value: unknown, field: string, maxLength: number): string | undefined => {
  if (value === undefined) return undefined;
  return requiredText(value, field, maxLength);
};

const optionalBoolean = (value: unknown, field: string): boolean | undefined => {
  if (value === undefined) return undefined;
  if (typeof value !== 'boolean') throw new ValidationError(`Invalid ${field}`);
  return value;
};

const optionalPrice = (value: unknown): number | undefined => {
  if (value === undefined) return undefined;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100_000_000) {
    throw new ValidationError('Invalid price');
  }
  return value;
};

const optionalOrder = (value: unknown): number | undefined => {
  if (value === undefined) return undefined;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 10_000) {
    throw new ValidationError('Invalid display order');
  }
  return value;
};

const optionalImageUrl = (value: unknown): string | undefined => {
  const url = optionalText(value, 'image URL', 2_000);
  if (!url) return url;
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
    return parsed.toString();
  } catch {
    throw new ValidationError('Invalid image URL');
  }
};

type MenuPayload = Record<string, string | number | boolean>;

export const validateMenuPayload = (body: unknown, partial: boolean): MenuPayload => {
  if (!isRecord(body)) throw new ValidationError('Invalid menu payload');
  const keys = Object.keys(body);
  if (!keys.length || keys.some(key => !MENU_FIELDS.has(key))) {
    throw new ValidationError('Invalid menu field');
  }

  const result: MenuPayload = {};
  const name = partial ? optionalText(body.name, 'name', 120) : requiredText(body.name, 'name', 120);
  const category = partial ? optionalText(body.category, 'category', 80) : requiredText(body.category, 'category', 80);
  const categoryId = optionalText(body.categoryId, 'category id', 64);
  const price = optionalPrice(body.price);

  if (!partial && price === undefined) throw new ValidationError('price is required');
  if (name !== undefined) result.name = name;
  if (category !== undefined) result.category = category;
  if (categoryId !== undefined) result.categoryId = categoryId;
  if (price !== undefined) result.price = price;

  const shortDescription = optionalText(body.shortDescription, 'short description', 1_000);
  const imageUrl = optionalImageUrl(body.imageUrl);
  const active = optionalBoolean(body.active, 'active');
  const displayOrder = optionalOrder(body.displayOrder);
  const isFeatured = optionalBoolean(body.isFeatured, 'isFeatured');
  const isVegetarian = optionalBoolean(body.isVegetarian, 'isVegetarian');
  const isSpicy = optionalBoolean(body.isSpicy, 'isSpicy');
  const isLocalSpecialty = optionalBoolean(body.isLocalSpecialty, 'isLocalSpecialty');

  if (shortDescription !== undefined) result.shortDescription = shortDescription;
  if (imageUrl !== undefined) result.imageUrl = imageUrl;
  if (active !== undefined) result.active = active;
  if (displayOrder !== undefined) result.displayOrder = displayOrder;
  if (isFeatured !== undefined) result.isFeatured = isFeatured;
  if (isVegetarian !== undefined) result.isVegetarian = isVegetarian;
  if (isSpicy !== undefined) result.isSpicy = isSpicy;
  if (isLocalSpecialty !== undefined) result.isLocalSpecialty = isLocalSpecialty;

  return result;
};

const validateId = (value: string | string[] | undefined): string => {
  const id = getParam(value);
  if (!id || !UUID_PATTERN.test(id)) throw new ValidationError('Invalid menu item id');
  return id;
};

const respond = (error: unknown, res: Response, fallback: string): Response =>
  res.status(error instanceof ValidationError ? 400 : 500).json({
    error: error instanceof ValidationError ? error.message : fallback
  });

const sortMenuItems = (items: Record<string, unknown>[]) =>
  items.sort((a, b) => Number(a.displayOrder ?? 0) - Number(b.displayOrder ?? 0));

/** Public catalogue: a missing legacy value stays visible; only active === false hides a dish. */
export const getPublicMenuItems = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getCollection('menuItems');
    res.json(sortMenuItems(data.filter(item => item.active !== false)));
  } catch (error) {
    next(error);
  }
};

/** Protected catalogue used by the admin, including dishes temporarily unavailable. */
export const getMenuItems = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(sortMenuItems(await getCollection('menuItems')));
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const payload = validateMenuPayload(req.body, false);
    res.status(201).json(await addDoc('menuItems', { ...payload, active: payload.active ?? true }));
  } catch (error) {
    return respond(error, res, 'Failed to create menu item');
  }
};

export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const id = validateId(req.params.id);
    const payload = validateMenuPayload(req.body, true);
    res.json(await updateDoc('menuItems', id, payload));
  } catch (error) {
    return respond(error, res, 'Failed to update menu item');
  }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    await deleteDoc('menuItems', validateId(req.params.id));
    res.json({ success: true });
  } catch (error) {
    return respond(error, res, 'Failed to delete menu item');
  }
};
