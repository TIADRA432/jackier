import type { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { validateUploadedImage } from './upload.controller';
import {
  CatalogValidationError,
  catalogError,
  isRecord,
  optionalImageUrl,
  optionalOrder,
  optionalText,
  validateUuid,
} from './catalog.validation';

const BUCKET = 'restaurant-media';

export const GALLERY_CATEGORIES = ['restaurant', 'cuisine', 'evenements', 'equipe', 'ambiance', 'ecole'] as const;

type GalleryCategory = typeof GALLERY_CATEGORIES[number];

type GalleryRow = {
  id: string;
  image_url: string;
  title: string;
  category: string;
  display_order: number;
  uploaded_at: string;
};

function toGalleryItem(row: GalleryRow) {
  return {
    id: row.id,
    imageUrl: row.image_url,
    title: row.title,
    category: row.category,
    displayOrder: row.display_order ?? 0,
    uploadedAt: row.uploaded_at,
  };
}

const GALLERY_FIELDS = new Set(['imageUrl', 'title', 'category', 'displayOrder']);

const validateCategory = (value: unknown): GalleryCategory | undefined => {
  if (value === undefined) return undefined;
  const category = optionalText(value, 'category', 100);
  if (!category || !GALLERY_CATEGORIES.includes(category as GalleryCategory)) {
    throw new CatalogValidationError('Invalid gallery category');
  }
  return category as GalleryCategory;
};

export const validateGalleryPayload = (body: unknown, partial = false) => {
  if (!isRecord(body) || !Object.keys(body).length || Object.keys(body).some(key => !GALLERY_FIELDS.has(key))) {
    throw new CatalogValidationError('Invalid gallery payload');
  }

  const imageUrl = optionalImageUrl(body.imageUrl);
  const title = optionalText(body.title, 'title', 200);
  const category = validateCategory(body.category);
  const displayOrder = optionalOrder(body.displayOrder);

  if (partial) {
    return {
      ...(imageUrl !== undefined ? { imageUrl } : {}),
      ...(title !== undefined ? { title } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(displayOrder !== undefined ? { displayOrder } : {}),
    };
  }

  return {
    imageUrl,
    title: title ?? '',
    category: category ?? 'restaurant',
    displayOrder: displayOrder ?? 0,
  };
};

export async function getGalleryImages(_req: Request, res: Response) {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('id,image_url,title,category,display_order,uploaded_at')
    .order('display_order', { ascending: true })
    .order('uploaded_at', { ascending: false });

  if (error) return res.status(500).json({ message: error.message });
  return res.json((data ?? []).map(toGalleryItem));
}

export async function createGalleryImage(req: Request, res: Response) {
  try {
    const payload = validateGalleryPayload(req.body);
    let imageUrl = payload.imageUrl || '';

    if (req.file) {
      let expectedMime: string;
      let detectedType: 'jpeg' | 'png' | 'webp';
      try {
        ({ expectedMime, detectedType } = validateUploadedImage(req));
      } catch (error) {
        throw new CatalogValidationError(error instanceof Error ? error.message : 'Invalid image upload');
      }
      const path = `gallery/${Date.now()}-${crypto.randomUUID()}.${detectedType === 'jpeg' ? 'jpg' : detectedType}`;

      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, req.file.buffer, {
        contentType: expectedMime,
        upsert: false,
      });

      if (uploadError) return res.status(500).json({ message: uploadError.message });
      imageUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    }

    if (!imageUrl) throw new CatalogValidationError('An image file or imageUrl is required');

    const { data, error } = await supabase
      .from('gallery_images')
      .insert({
        image_url: imageUrl,
        title: payload.title,
        category: payload.category,
        display_order: payload.displayOrder,
      })
      .select('id,image_url,title,category,display_order,uploaded_at')
      .single();

    if (error) return res.status(500).json({ message: error.message });
    return res.status(201).json(toGalleryItem(data as GalleryRow));
  } catch (error) {
    return catalogError(error, res, 'Failed to create gallery image');
  }
}

export async function updateGalleryImage(req: Request, res: Response) {
  try {
    const id = validateUuid(req.params.id, 'gallery image');
    const payload = validateGalleryPayload(req.body, true);
    const updates: Record<string, string | number> = {};

    if ('imageUrl' in payload && payload.imageUrl) updates.image_url = payload.imageUrl;
    if ('title' in payload) updates.title = payload.title ?? '';
    if ('category' in payload && payload.category) updates.category = payload.category;
    if ('displayOrder' in payload && payload.displayOrder !== undefined) updates.display_order = payload.displayOrder;

    const { data, error } = await supabase
      .from('gallery_images')
      .update(updates)
      .eq('id', id)
      .select('id,image_url,title,category,display_order,uploaded_at')
      .single();

    if (error) throw error;
    return res.json(toGalleryItem(data as GalleryRow));
  } catch (error) {
    return catalogError(error, res, 'Failed to update gallery image');
  }
}

export async function deleteGalleryImage(req: Request, res: Response) {
  try {
    const id = validateUuid(req.params.id, 'gallery image');
    const { error } = await supabase.from('gallery_images').delete().eq('id', id);
    if (error) throw error;
    return res.status(204).send();
  } catch (error) {
    return catalogError(error, res, 'Failed to delete gallery image');
  }
}
