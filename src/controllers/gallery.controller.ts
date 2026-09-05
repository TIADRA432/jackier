import type { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { validateUploadedImage } from './upload.controller';

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
    let imageUrl = typeof req.body?.imageUrl === 'string' ? req.body.imageUrl.trim() : '';

    if (req.file) {
      const { expectedMime, detectedType } = validateUploadedImage(req);
      const path = `gallery/${Date.now()}-${crypto.randomUUID()}.${detectedType === 'jpeg' ? 'jpg' : detectedType}`;

      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, req.file.buffer, {
        contentType: expectedMime,
        upsert: false,
      });

      if (uploadError) return res.status(500).json({ message: uploadError.message });
      imageUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    }

    if (!imageUrl) return res.status(400).json({ message: 'An image file or imageUrl is required' });

    const { data, error } = await supabase
      .from('gallery_images')
      .insert({
        image_url: imageUrl,
        title: typeof req.body?.title === 'string' ? req.body.title.slice(0, 200) : '',
        category: typeof req.body?.category === 'string' ? req.body.category.slice(0, 100) : 'gallery',
      })
      .select('id,image_url,title,category,uploaded_at')
      .single();

    if (error) return res.status(500).json({ message: error.message });
    return res.status(201).json(toGalleryItem(data as GalleryRow));
  } catch (error) {
    return res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid image upload' });
  }
}

export async function deleteGalleryImage(req: Request, res: Response) {
  const { id } = req.params;
  const { error } = await supabase.from('gallery_images').delete().eq('id', id);
  if (error) return res.status(500).json({ message: error.message });
  return res.status(204).send();
}
