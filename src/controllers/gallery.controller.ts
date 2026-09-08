import type { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { validateUploadedImage } from './upload.controller';
import { CatalogValidationError, catalogError, isRecord, optionalImageUrl, optionalText, validateUuid } from './catalog.validation';

const BUCKET = 'restaurant-media';

type GalleryRow = {
  id: string;
  image_url: string;
  title: string;
  category: string;
  uploaded_at: string;
};

function toGalleryItem(row: GalleryRow) {
  return {
    id: row.id,
    imageUrl: row.image_url,
    title: row.title,
    category: row.category,
    uploadedAt: row.uploaded_at,
  };
}

const GALLERY_FIELDS = new Set(['imageUrl', 'title', 'category']);

const validateGalleryPayload = (body: unknown) => {
  if (!isRecord(body) || Object.keys(body).some(key => !GALLERY_FIELDS.has(key))) {
    throw new CatalogValidationError('Invalid gallery payload');
  }
  return {
    imageUrl: optionalImageUrl(body.imageUrl),
    title: optionalText(body.title, 'title', 200) ?? '',
    category: optionalText(body.category, 'category', 100) ?? 'gallery',
  };
};

export async function getGalleryImages(_req: Request, res: Response) {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('id,image_url,title,category,uploaded_at')
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
      })
      .select('id,image_url,title,category,uploaded_at')
      .single();

    if (error) return res.status(500).json({ message: error.message });
    return res.status(201).json(toGalleryItem(data as GalleryRow));
  } catch (error) {
    return catalogError(error, res, 'Failed to create gallery image');
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
