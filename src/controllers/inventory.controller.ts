import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { CatalogValidationError, catalogError, optionalPrice, optionalText, requireKnownFields, requiredText, validateUuid } from './catalog.validation';

const INVENTORY_FIELDS = new Set(['name', 'category', 'unit', 'quantity', 'reorderLevel', 'unitCost', 'active']);

type InventoryPayload = {
  name?: string;
  category?: string;
  unit?: string;
  quantity?: number;
  reorderLevel?: number;
  unitCost?: number;
  active?: boolean;
};

const optionalQuantity = (value: unknown, field: string): number | undefined => {
  if (value === undefined) return undefined;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1_000_000) {
    throw new CatalogValidationError(`Invalid ${field}`);
  }
  return value;
};

const optionalBoolean = (value: unknown, field: string): boolean | undefined => {
  if (value === undefined) return undefined;
  if (typeof value !== 'boolean') throw new CatalogValidationError(`Invalid ${field}`);
  return value;
};

const validateInventoryPayload = (body: unknown, partial: boolean): InventoryPayload => {
  const source = requireKnownFields(body, INVENTORY_FIELDS);
  const name = partial ? optionalText(source.name, 'name', 160) : requiredText(source.name, 'name', 160);
  const category = optionalText(source.category, 'category', 80);
  const unit = optionalText(source.unit, 'unit', 16);
  const quantity = optionalQuantity(source.quantity, 'quantity');
  const reorderLevel = optionalQuantity(source.reorderLevel, 'reorderLevel');
  const unitCost = optionalPrice(source.unitCost, 'unitCost');
  const active = optionalBoolean(source.active, 'active');
  const payload: InventoryPayload = {};

  if (name !== undefined) payload.name = name;
  if (category !== undefined) payload.category = category;
  if (unit !== undefined) payload.unit = unit;
  if (quantity !== undefined) payload.quantity = quantity;
  if (reorderLevel !== undefined) payload.reorderLevel = reorderLevel;
  if (unitCost !== undefined) payload.unitCost = unitCost;
  if (active !== undefined) payload.active = active;
  return payload;
};

const toClient = (row: Record<string, unknown>) => ({
  id: String(row.id),
  name: String(row.name),
  category: String(row.category),
  unit: String(row.unit),
  quantity: Number(row.quantity),
  reorderLevel: Number(row.reorder_level),
  unitCost: row.unit_cost === null ? undefined : Number(row.unit_cost),
  active: Boolean(row.active),
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

const toDatabase = (payload: InventoryPayload) => ({
  ...(payload.name !== undefined ? { name: payload.name } : {}),
  ...(payload.category !== undefined ? { category: payload.category } : {}),
  ...(payload.unit !== undefined ? { unit: payload.unit } : {}),
  ...(payload.quantity !== undefined ? { quantity: payload.quantity } : {}),
  ...(payload.reorderLevel !== undefined ? { reorder_level: payload.reorderLevel } : {}),
  ...(payload.unitCost !== undefined ? { unit_cost: payload.unitCost } : {}),
  ...(payload.active !== undefined ? { active: payload.active } : {}),
});

export const getInventoryItems = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('inventory_items').select('*').order('name', { ascending: true });
    if (error) throw error;
    res.json((data || []).map(toClient));
  } catch (error) {
    return catalogError(error, res, 'Failed to fetch inventory');
  }
};

export const createInventoryItem = async (req: Request, res: Response) => {
  try {
    const payload = validateInventoryPayload(req.body, false);
    const { data, error } = await supabase.from('inventory_items').insert({
      name: payload.name!,
      category: payload.category ?? 'Non classé',
      unit: payload.unit ?? 'unité',
      quantity: payload.quantity ?? 0,
      reorder_level: payload.reorderLevel ?? 0,
      unit_cost: payload.unitCost ?? null,
      active: payload.active ?? true,
    }).select('*').single();
    if (error) throw error;
    res.status(201).json(toClient(data));
  } catch (error) {
    return catalogError(error, res, 'Failed to create inventory item');
  }
};

export const updateInventoryItem = async (req: Request, res: Response) => {
  try {
    const id = validateUuid(req.params.id, 'inventory item');
    const payload = validateInventoryPayload(req.body, true);
    const { data, error } = await supabase.from('inventory_items')
      .update({ ...toDatabase(payload), updated_at: new Date().toISOString() })
      .eq('id', id).select('*').single();
    if (error) throw error;
    res.json(toClient(data));
  } catch (error) {
    return catalogError(error, res, 'Failed to update inventory item');
  }
};

export const deleteInventoryItem = async (req: Request, res: Response) => {
  try {
    const id = validateUuid(req.params.id, 'inventory item');
    const { error } = await supabase.from('inventory_items').delete().eq('id', id);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    return catalogError(error, res, 'Failed to delete inventory item');
  }
};
