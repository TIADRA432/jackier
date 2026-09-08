import { NextFunction, Request, Response } from 'express';
import { addDoc, deleteDoc, getCollection, updateDoc } from '../services/db.service';
import { CatalogValidationError, catalogError, optionalImageUrl, optionalOrder, optionalPrice, optionalText, requireKnownFields, requiredText, validateUuid } from './catalog.validation';

const WINE_FIELDS = new Set(['name', 'description', 'priceBottle', 'priceGlass', 'imageUrl', 'displayOrder']);
type WinePayload = Record<string, string | number>;

const validateWinePayload = (body: unknown, partial: boolean): WinePayload => {
  const source = requireKnownFields(body, WINE_FIELDS);
  const name = partial ? optionalText(source.name, 'name', 120) : requiredText(source.name, 'name', 120);
  const priceBottle = optionalPrice(source.priceBottle, 'bottle price');
  const priceGlass = optionalPrice(source.priceGlass, 'glass price');
  if (!partial && priceBottle === undefined) throw new CatalogValidationError('bottle price is required');

  const payload: WinePayload = {};
  if (name !== undefined) payload.name = name;
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

export const getWines = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getCollection('wineItems');
    res.json(data.sort((a: any, b: any) => Number(a.displayOrder ?? 0) - Number(b.displayOrder ?? 0)));
  } catch (error) {
    next(error);
  }
};

export const createWine = async (req: Request, res: Response) => {
  try {
    res.status(201).json(await addDoc('wineItems', validateWinePayload(req.body, false)));
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
