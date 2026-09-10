import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { CatalogValidationError, catalogError, isRecord, optionalImageUrl, optionalText, requireKnownFields, requiredText, validateUuid } from './catalog.validation';

const PUBLIC_SETTINGS_KEYS = [
  'restaurantName',
  'address',
  'phone',
  'email',
  'openingHours',
  'currency',
  'socialMedia',
  'brand',
] as const;

const SETTINGS_FIELDS = new Set<string>(PUBLIC_SETTINGS_KEYS);
const BRAND_FIELDS = new Set(['logo', 'siteMedia']);
const MEDIA_REFERENCE_FIELDS = new Set(['id', 'url', 'altText']);
const SITE_MEDIA_SLOTS = new Set([
  'homeHero', 'menuHero', 'reservationHero', 'aboutHero', 'contactHero',
  'schoolHero', 'galleryHero', 'cateringHero'
]);

type MediaReference = { id: string; url: string; altText: string };

const validateMediaReference = (value: unknown, label: string): MediaReference => {
  const source = requireKnownFields(value, MEDIA_REFERENCE_FIELDS);
  if (typeof source.id !== 'string') throw new CatalogValidationError(`Invalid ${label}.id`);
  const url = optionalImageUrl(source.url);
  if (!url) throw new CatalogValidationError(`Invalid ${label}.url`);
  return {
    id: validateUuid(source.id, `${label}.id`),
    url,
    altText: requiredText(source.altText, `${label}.altText`, 200),
  };
};

const validateBrand = (value: unknown) => {
  const source = requireKnownFields(value, BRAND_FIELDS);
  const brand: { logo?: MediaReference; siteMedia?: Record<string, MediaReference> } = {};
  if (source.logo !== undefined) brand.logo = validateMediaReference(source.logo, 'brand.logo');
  if (source.siteMedia !== undefined) {
    if (!isRecord(source.siteMedia) || Object.keys(source.siteMedia).some(key => !SITE_MEDIA_SLOTS.has(key))) {
      throw new CatalogValidationError('Invalid brand.siteMedia');
    }
    brand.siteMedia = Object.fromEntries(
      Object.entries(source.siteMedia).map(([slot, media]) => [slot, validateMediaReference(media, `brand.siteMedia.${slot}`)])
    );
  }
  if (!Object.keys(brand).length) throw new CatalogValidationError('Invalid brand');
  return brand;
};

const validateSocialMedia = (value: unknown): Record<string, string> => {
  if (!isRecord(value) || Object.keys(value).length > 10) {
    throw new CatalogValidationError('Invalid socialMedia');
  }

  return Object.fromEntries(Object.entries(value).map(([key, url]) => {
    if (!/^[a-zA-Z][a-zA-Z0-9_-]{0,31}$/.test(key)) {
      throw new CatalogValidationError('Invalid socialMedia key');
    }
    return [key, optionalText(url, `socialMedia.${key}`, 2_000) ?? ''];
  }));
};

const validateSettingsPayload = (body: unknown): Record<string, unknown> => {
  const source = requireKnownFields(body, SETTINGS_FIELDS);
  const settings: Record<string, unknown> = {};
  const textFields: Array<[keyof typeof source, string, number]> = [
    ['restaurantName', 'restaurantName', 120],
    ['address', 'address', 300],
    ['phone', 'phone', 64],
    ['email', 'email', 254],
    ['openingHours', 'openingHours', 300],
    ['currency', 'currency', 16],
  ];

  for (const [key, label, maxLength] of textFields) {
    const value = optionalText(source[key], label, maxLength);
    if (value !== undefined) settings[key] = value;
  }

  if (settings.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email as string)) {
    throw new CatalogValidationError('Invalid email');
  }
  if (source.socialMedia !== undefined) settings.socialMedia = validateSocialMedia(source.socialMedia);
  if (source.brand !== undefined) settings.brand = validateBrand(source.brand);
  if (!Object.keys(settings).length) throw new CatalogValidationError('Invalid settings payload');
  return settings;
};

const toPublicSettings = (data: Record<string, unknown>) =>
  Object.fromEntries(PUBLIC_SETTINGS_KEYS.filter(key => key in data).map(key => [key, data[key]]));

export const getSettings = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('settings').select('data').eq('id', 'global').maybeSingle();
    if (error) throw error;
    res.json(toPublicSettings((data?.data || {}) as Record<string, unknown>));
  } catch { res.status(500).json({ error: 'Failed to fetch settings' }); }
};

export const updateSettings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const settings = validateSettingsPayload(req.body);
    const { data: current } = await supabase.from('settings').select('data').eq('id', 'global').maybeSingle();
    const { error } = await supabase.from('settings').upsert({ id: 'global', data: { ...(current?.data || {}), ...settings } });
    if (error) throw error;
    const { error: logError } = await supabase.from('logs').insert({
      action: 'UPDATE_SETTINGS',
      details: 'System settings updated',
      user_id: req.user?.id || 'system',
      timestamp: new Date().toISOString()
    });
    if (logError) console.warn('Unable to write settings log:', logError.message);
    res.json({ success: true });
  } catch (error) { return catalogError(error, res, 'Failed to update settings'); }
};

export const getLogs = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('logs').select('*').order('timestamp', { ascending: false }).limit(100);
    if (error) throw error;
    res.json(data || []);
  } catch { res.status(500).json({ error: 'Failed to fetch logs' }); }
};
