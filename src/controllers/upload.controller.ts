import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

const uploadToStorage = async (req: Request, folder: string) => {
  if (!req.file) throw new Error('No file uploaded');
  const extension = (req.file.originalname.split('.').pop() || 'bin').toLowerCase();
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const { error } = await supabase.storage.from('restaurant-media').upload(filename, req.file.buffer, {
    contentType: req.file.mimetype,
    upsert: false
  });
  if (error) throw error;
  const { data } = supabase.storage.from('restaurant-media').getPublicUrl(filename);
  return data.publicUrl;
};

export const uploadMenuImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ url: await uploadToStorage(req, 'menu') });
  } catch (error) { next(error); }
};

export const uploadWineImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ url: await uploadToStorage(req, 'wines') });
  } catch (error) { next(error); }
};
