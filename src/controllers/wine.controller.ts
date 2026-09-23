import { NextFunction, Request, Response } from 'express';
import { addDoc, deleteDoc, getCollection, updateDoc } from '../services/db.service';
import { CatalogValidationError, catalogError, optionalImageUrl, optionalOrder, optionalPrice, optionalText, requireKnownFields, requiredText, validateUuid } from './catalog.validation';

const WINE_FIELDS = new Set(['name', 'origin', 'grape', 'year', 'description', 'priceBottle', 'priceGlass', 'imageUrl', 'displayOrder', 'active']);
type WinePayload = Record<string, string | number | boolean>;

const validateWinePayload = (body: unknown, partial: boolean): WinePayload => {
  const source = requireKnownFields(body, WINE_FIELDS);
  const name = partial ? optionalText(source.name, 'name', 120) : requiredText(source.name, 'name', 120);
  const priceBottle = optionalPrice(source.priceBottle, 'bottle price');
  const priceGlass = optionalPrice(source.priceGlass, 'glass price');
  if (!partial && priceBottle === undefined) throw new CatalogValidationError('bottle price is required');

  const payload: WinePayload = {};
  if (name !== undefined) payload.name = name;

  const origin = optionalText(source.origin, 'origin', 120);
  const grape = optionalText(source.grape, 'grape', 120);
  if (origin !== undefined) payload.origin = origin;
  if (grape !== undefined) payload.grape = grape;

  if (source.year !== undefined) {
    if (typeof source.year !== 'number' || !Number.isInteger(source.year) || source.year < 1900 || source.year > 2100) {
      throw new CatalogValidationError('Invalid year');
    }
    payload.year = source.year;
  }

  if (source.active !== undefined) {
    if (typeof source.active !== 'boolean') throw new CatalogValidationError('Invalid active');
    payload.active = source.active;
  }
  if (priceBottle !== undefined) payload.priceBottle = priceBottle;
  if (priceGlass !== undefined) payload.priceGlass = priceGlass;

  const description = optionalText(source.description, 'description', 1_000);
  const imageUrl = optionalImageUrl(source.imageUrl);
  const displayOrder = optionalOrder(source.displayOrder);
  if (description !== undefined) payload.description = description;
  if (imageUrl !== undefined) payload.imageUrl = imageUrl;
  if (displayOrder !== undefined) payload.displayOrder = displayOrder;
  return payload;
};

const sortWines = (items: any[]) =>
  items.sort((a: any, b: any) => Number(a.displayOrder ?? 0) - Number(b.displayOrder ?? 0));

export const getPublicWines = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getCollection('wineItems');
    res.json(sortWines(data.filter((wine: any) => wine.active !== false)));
  } catch (error) {
    next(error);
  }
};

export const getWines = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(sortWines(await getCollection('wineItems')));
  } catch (error) {
    next(error);
  }
};

export const createWine = async (req: Request, res: Response) => {
  try {
    const payload = validateWinePayload(req.body, false);
    res.status(201).json(await addDoc('wineItems', { ...payload, active: payload.active ?? true }));
  } catch (error) {
    return catalogError(error, res, 'Failed to create wine');
  }
};

export const updateWine = async (req: Request, res: Response) => {
  try {
    const id = validateUuid(req.params.id, 'wine');
    res.json(await updateDoc('wineItems', id, validateWinePayload(req.body, true)));
  } catch (error) {
    return catalogError(error, res, 'Failed to update wine');
  }
};

export const deleteWine = async (req: Request, res: Response) => {
  try {
    await deleteDoc('wineItems', validateUuid(req.params.id, 'wine'));
    res.json({ success: true });
  } catch (error) {
    return catalogError(error, res, 'Failed to delete wine');
  }
};
