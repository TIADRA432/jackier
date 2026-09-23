import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { CatalogValidationError, catalogError, isRecord, optionalImageUrl, optionalText, requireKnownFields, requiredText, validateUuid } from './catalog.validation';

const PUBLIC_SETTINGS_KEYS = [
  'restaurantName',
  'tagline',
  'address',
  'neighborhood',
  'phone',
  'email',
  'openingHours',
  'currency',
  'mapQuery',
  'legalNoticeUrl',
  'privacyPolicyUrl',
  'today',
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

const SOCIAL_MEDIA_KEYS = new Set(['facebook', 'instagram', 'whatsapp', 'tiktok', 'linkedin']);
const TODAY_FIELDS = new Set(['enabled', 'eyebrow', 'title', 'message', 'featuredDishId', 'ctaLabel', 'ctaPath']);
const TODAY_CTA_PATHS = new Set(['/reservation', '/menu', '/gallery', '/services-traiteur', '/ecole-gastronomie', '/contact']);

const validateToday = (value: unknown) => {
  const source = requireKnownFields(value, TODAY_FIELDS);
  if (typeof source.enabled !== 'boolean') throw new CatalogValidationError('Invalid today.enabled');

  const eyebrow = optionalSettingsText(source.eyebrow, 'today.eyebrow', 80) ?? '';
  const title = optionalSettingsText(source.title, 'today.title', 140) ?? '';
  const message = optionalSettingsText(source.message, 'today.message', 420) ?? '';
  const ctaLabel = optionalSettingsText(source.ctaLabel, 'today.ctaLabel', 80) ?? '';
  const ctaPath = optionalSettingsText(source.ctaPath, 'today.ctaPath', 120) ?? '';

  if (ctaPath && !TODAY_CTA_PATHS.has(ctaPath)) {
    throw new CatalogValidationError('Invalid today.ctaPath');
  }

  let featuredDishId: string | undefined;
  if (source.featuredDishId !== undefined && source.featuredDishId !== '') {
    if (typeof source.featuredDishId !== 'string') throw new CatalogValidationError('Invalid today.featuredDishId');
    featuredDishId = validateUuid(source.featuredDishId, 'today.featuredDishId');
  }

  return {
    enabled: source.enabled,
    eyebrow,
    title,
    message,
    ...(featuredDishId ? { featuredDishId } : {}),
    ctaLabel,
    ctaPath: ctaPath || '/reservation'
  };
};

const validateSocialMedia = (value: unknown): Record<string, string> => {
  if (!isRecord(value) || Object.keys(value).length > SOCIAL_MEDIA_KEYS.size) {
    throw new CatalogValidationError('Invalid socialMedia');
  }

  return Object.fromEntries(Object.entries(value).map(([key, rawUrl]) => {
    if (!SOCIAL_MEDIA_KEYS.has(key)) throw new CatalogValidationError('Invalid socialMedia key');
    const url = optionalText(rawUrl, `socialMedia.${key}`, 2_000) ?? '';
    if (!url) return [key, ''];

    let parsed: URL;
    try { parsed = new URL(url); }
    catch { throw new CatalogValidationError(`Invalid socialMedia.${key}`); }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new CatalogValidationError(`Invalid socialMedia.${key}`);
    }
    return [key, parsed.toString()];
  }));
};

const optionalSettingsText = (value: unknown, field: string, maxLength: number): string | undefined => {
  if (value === undefined) return undefined;
  if (typeof value !== 'string') throw new CatalogValidationError(`Invalid ${field}`);
  const result = value.trim();
  if (result.length > maxLength) throw new CatalogValidationError(`Invalid ${field}`);
  return result;
};

const validateSettingsPayload = (body: unknown): Record<string, unknown> => {
  const source = requireKnownFields(body, SETTINGS_FIELDS);
  const settings: Record<string, unknown> = {};
  const textFields: Array<[keyof typeof source, string, number]> = [
    ['restaurantName', 'restaurantName', 120],
    ['tagline', 'tagline', 240],
    ['address', 'address', 300],
    ['neighborhood', 'neighborhood', 120],
    ['phone', 'phone', 64],
    ['email', 'email', 254],
    ['openingHours', 'openingHours', 300],
    ['currency', 'currency', 16],
    ['mapQuery', 'mapQuery', 300],
    ['legalNoticeUrl', 'legalNoticeUrl', 2_000],
    ['privacyPolicyUrl', 'privacyPolicyUrl', 2_000],
  ];

  for (const [key, label, maxLength] of textFields) {
    const value = optionalSettingsText(source[key], label, maxLength);
    if (value !== undefined) settings[key] = value;
  }

  if (settings.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email as string)) {
    throw new CatalogValidationError('Invalid email');
  }

  for (const field of ['legalNoticeUrl', 'privacyPolicyUrl'] as const) {
    const value = settings[field];
    if (typeof value === 'string' && value) {
      let parsed: URL;
      try { parsed = new URL(value); }
      catch { throw new CatalogValidationError(`Invalid ${field}`); }
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new CatalogValidationError(`Invalid ${field}`);
      settings[field] = parsed.toString();
    }
  }

  if (source.today !== undefined) settings.today = validateToday(source.today);
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
