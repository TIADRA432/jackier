import type { NextFunction, Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { CatalogValidationError, catalogError, isRecord, optionalText, requireKnownFields, validateUuid } from './catalog.validation';
import { validateUploadedImage } from './upload.controller';

const BUCKET = 'restaurant-media';
const MEDIA_CATEGORIES = ['branding', 'hero', 'menu', 'wines', 'gallery', 'team'] as const;
const MEDIA_FIELDS = new Set(['title', 'altText', 'category']);

type MediaCategory = typeof MEDIA_CATEGORIES[number];
type MediaRow = {
  id: string;
  bucket_id: string;
  path: string;
  public_url: string;
  original_name: string;
  title: string;
  alt_text: string;
  category: MediaCategory;
  mime_type: string;
  size_bytes: number;
  created_at: string;
};

const EXTENSIONS = { jpeg: 'jpg', png: 'png', webp: 'webp' } as const;

const toMediaAsset = (row: MediaRow) => ({
  id: row.id,
  bucketId: row.bucket_id,
  path: row.path,
  publicUrl: row.public_url,
  originalName: row.original_name,
  title: row.title,
  altText: row.alt_text,
  category: row.category,
  mimeType: row.mime_type,
  sizeBytes: row.size_bytes,
  createdAt: row.created_at,
});

const validateCategory = (value: unknown): MediaCategory => {
  if (typeof value !== 'string' || !MEDIA_CATEGORIES.includes(value as MediaCategory)) {
    throw new CatalogValidationError('Invalid media category');
  }
  return value as MediaCategory;
};

const validateMediaPayload = (body: unknown) => {
  const source = requireKnownFields(body, MEDIA_FIELDS);
  const altText = optionalText(source.altText, 'altText', 200);
  if (!altText) throw new CatalogValidationError('altText is required');
  return {
    title: optionalText(source.title, 'title', 200) ?? '',
    altText,
    category: validateCategory(source.category),
  };
};

const validatePartialMediaPayload = (body: unknown) => {
  if (!isRecord(body) || Object.keys(body).some(key => !MEDIA_FIELDS.has(key))) {
    throw new CatalogValidationError('Invalid media payload');
  }
  const payload: Partial<{ title: string; altText: string; category: MediaCategory }> = {};
  if ('title' in body) payload.title = optionalText(body.title, 'title', 200) ?? '';
  if ('altText' in body) {
    const altText = optionalText(body.altText, 'altText', 200);
    if (!altText) throw new CatalogValidationError('altText is required');
    payload.altText = altText;
  }
  if ('category' in body) payload.category = validateCategory(body.category);
  if (!Object.keys(payload).length) throw new CatalogValidationError('Invalid media payload');
  return payload;
};

export const getMediaAssets = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('media_assets')
      .select('id,bucket_id,path,public_url,original_name,title,alt_text,category,mime_type,size_bytes,created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return res.json((data ?? []).map(row => toMediaAsset(row as MediaRow)));
  } catch (error) {
    return next(error);
  }
};

export const createMediaAsset = async (req: Request, res: Response, next: NextFunction) => {
  let uploadedPath: string | undefined;
  try {
    if (!req.file) throw new CatalogValidationError('An image file is required');
    const metadata = validateMediaPayload(req.body);
    const { detectedType, expectedMime } = validateUploadedImage(req);
    uploadedPath = `${metadata.category}/${Date.now()}-${crypto.randomUUID()}.${EXTENSIONS[detectedType]}`;

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(uploadedPath, req.file.buffer, {
      contentType: expectedMime,
      cacheControl: '31536000',
      upsert: false,
    });
    if (uploadError) throw uploadError;

    const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(uploadedPath).data.publicUrl;
    const { data, error } = await supabase
      .from('media_assets')
      .insert({
        bucket_id: BUCKET,
        path: uploadedPath,
        public_url: publicUrl,
        original_name: req.file.originalname.slice(0, 255) || 'image',
        title: metadata.title,
        alt_text: metadata.altText,
        category: metadata.category,
        mime_type: expectedMime,
        size_bytes: req.file.size,
      })
      .select('id,bucket_id,path,public_url,original_name,title,alt_text,category,mime_type,size_bytes,created_at')
      .single();
    if (error) throw error;
    return res.status(201).json(toMediaAsset(data as MediaRow));
  } catch (error) {
    if (uploadedPath) await supabase.storage.from(BUCKET).remove([uploadedPath]);
    return catalogError(error, res, 'Failed to create media asset');
  }
};

export const updateMediaAsset = async (req: Request, res: Response) => {
  try {
    const id = validateUuid(req.params.id, 'media asset');
    const payload = validatePartialMediaPayload(req.body);
    const update = {
      ...(payload.title !== undefined ? { title: payload.title } : {}),
      ...(payload.altText !== undefined ? { alt_text: payload.altText } : {}),
      ...(payload.category !== undefined ? { category: payload.category } : {}),
    };
    const { data, error } = await supabase
      .from('media_assets')
      .update(update)
      .eq('id', id)
      .select('id,bucket_id,path,public_url,original_name,title,alt_text,category,mime_type,size_bytes,created_at')
      .single();
    if (error) throw error;
    return res.json(toMediaAsset(data as MediaRow));
  } catch (error) {
    return catalogError(error, res, 'Failed to update media asset');
  }
};

export const deleteMediaAsset = async (req: Request, res: Response) => {
  try {
    const id = validateUuid(req.params.id, 'media asset');
    const { data, error } = await supabase
      .from('media_assets')
      .select('id,bucket_id,path,public_url,original_name,title,alt_text,category,mime_type,size_bytes,created_at')
      .eq('id', id)
      .single();
    if (error) throw error;
    const asset = data as MediaRow;

    const [settingResult, galleryResult, menuResult, wineResult, teamResult] = await Promise.all([
      supabase.from('settings').select('data').eq('id', 'global').maybeSingle(),
      supabase.from('gallery_images').select('id').eq('image_url', asset.public_url).limit(1),
      supabase.from('menu_items').select('id').eq('image_url', asset.public_url).limit(1),
      supabase.from('wine_items').select('id').eq('image_url', asset.public_url).limit(1),
      supabase.from('team_members').select('id').eq('photo_url', asset.public_url).limit(1),
    ]);
    if (settingResult.error || galleryResult.error || menuResult.error || wineResult.error || teamResult.error) {
      throw settingResult.error ?? galleryResult.error ?? menuResult.error ?? wineResult.error ?? teamResult.error;
    }
    if (JSON.stringify(settingResult.data?.data ?? {}).includes(asset.id)
      || galleryResult.data?.length || menuResult.data?.length || wineResult.data?.length || teamResult.data?.length) {
      return res.status(409).json({ error: 'This media asset is currently used by the site' });
    }

    const { error: storageError } = await supabase.storage.from(asset.bucket_id).remove([asset.path]);
    if (storageError) throw storageError;
    const { error: deleteError } = await supabase.from('media_assets').delete().eq('id', id);
    if (deleteError) throw deleteError;
    return res.status(204).send();
  } catch (error) {
    return catalogError(error, res, 'Failed to delete media asset');
  }
};
