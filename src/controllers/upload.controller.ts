import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import path from 'path';

export const uploadMenuImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const filename = `menu-${Date.now()}.webp`;
    const filepath = path.join(process.cwd(), 'uploads/menu', filename);
    
    await sharp(req.file.buffer)
      .resize(800, 600, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(filepath);
      
    res.json({ url: `/uploads/menu/${filename}` });
  } catch (error) {
    next(error);
  }
};

export const uploadWineImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const filename = `wine-${Date.now()}.webp`;
    const filepath = path.join(process.cwd(), 'uploads/wines', filename);
    
    await sharp(req.file.buffer)
      .resize(400, 800, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .webp({ quality: 80 })
      .toFile(filepath);
      
    res.json({ url: `/uploads/wines/${filename}` });
  } catch (error) {
    next(error);
  }
};
