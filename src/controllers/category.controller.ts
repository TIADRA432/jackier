import { Request, Response, NextFunction } from 'express';
import { getCollection, addDoc, updateDoc, deleteDoc } from '../services/db.service';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getCollection('menuCategories');
    res.json(data.sort((a: any, b: any) => a.order - b.order));
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newDoc = await addDoc('menuCategories', req.body);
    res.status(201).json(newDoc);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedDoc = await updateDoc('menuCategories', req.params.id, req.body);
    res.json(updatedDoc);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteDoc('menuCategories', req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
