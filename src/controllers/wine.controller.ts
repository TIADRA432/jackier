import { Request, Response, NextFunction } from 'express';
import { getCollection, addDoc, updateDoc, deleteDoc } from '../services/db.service';

export const getWines = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getCollection('wineItems');
    res.json(data.sort((a: any, b: any) => a.displayOrder - b.displayOrder));
  } catch (error) {
    next(error);
  }
};

export const createWine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newDoc = await addDoc('wineItems', req.body);
    res.status(201).json(newDoc);
  } catch (error) {
    next(error);
  }
};

export const updateWine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedDoc = await updateDoc('wineItems', req.params.id, req.body);
    res.json(updatedDoc);
  } catch (error) {
    next(error);
  }
};

export const deleteWine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteDoc('wineItems', req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
