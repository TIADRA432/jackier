import { Request, Response, NextFunction } from 'express';
import { getCollection, addDoc, updateDoc, deleteDoc } from '../services/db.service';

export const getMenuItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getCollection('menuItems');
    res.json(data.sort((a: any, b: any) => a.displayOrder - b.displayOrder));
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newDoc = await addDoc('menuItems', req.body);
    res.status(201).json(newDoc);
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedDoc = await updateDoc('menuItems', req.params.id, req.body);
    res.json(updatedDoc);
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteDoc('menuItems', req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
