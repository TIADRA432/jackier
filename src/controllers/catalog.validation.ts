import { Response } from 'express';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class CatalogValidationError extends Error {}

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const requireKnownFields = (body: unknown, allowed: Set<string>): Record<string, unknown> => {
  if (!isRecord(body) || !Object.keys(body).length || Object.keys(body).some(key => !allowed.has(key))) {
    throw new CatalogValidationError('Invalid catalogue payload');
  }
  return body;
};

export const requiredText = (value: unknown, field: string, maxLength: number): string => {
  if (typeof value !== 'string') throw new CatalogValidationError(`${field} is required`);
  const result = value.trim();
  if (!result || result.length > maxLength) throw new CatalogValidationError(`Invalid ${field}`);
  return result;
};

export const optionalText = (value: unknown, field: string, maxLength: number): string | undefined =>
  value === undefined ? undefined : requiredText(value, field, maxLength);

export const optionalPrice = (value: unknown, field: string): number | undefined => {
  if (value === undefined) return undefined;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100_000_000) {
    throw new CatalogValidationError(`Invalid ${field}`);
  }
  return value;
};

export const optionalOrder = (value: unknown): number | undefined => {
  if (value === undefined) return undefined;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 10_000) {
    throw new CatalogValidationError('Invalid display order');
  }
  return value;
};

export const optionalImageUrl = (value: unknown): string | undefined => {
  const url = optionalText(value, 'image URL', 2_000);
  if (!url) return url;
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
    return parsed.toString();
  } catch {
    throw new CatalogValidationError('Invalid image URL');
  }
};

export const validateUuid = (value: string | string[] | undefined, label: string): string => {
  const id = Array.isArray(value) ? value[0] : value;
  if (!id || !UUID_PATTERN.test(id)) throw new CatalogValidationError(`Invalid ${label} id`);
  return id;
};

export const catalogError = (error: unknown, res: Response, fallback: string): Response =>
  res.status(error instanceof CatalogValidationError ? 400 : 500).json({
    error: error instanceof CatalogValidationError ? error.message : fallback
  });
