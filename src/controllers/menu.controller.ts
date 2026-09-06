import { Request, Response, NextFunction } from 'express';
import { getCollection, addDoc, updateDoc, deleteDoc } from '../services/db.service';
export const getMenuItems = async (req: Request, res: Response, next: NextFunction) => { try { const data = await getCollection('menuItems'); res.json(data.sort((a:any,b:any)=>a.displayOrder-b.displayOrder)); } catch(error){ next(error); } };
export const createMenuItem = async (req: Request, res: Response, next: NextFunction) => { try { res.status(201).json(await addDoc('menuItems',req.body)); } catch(error){ next(error); } };
export const updateMenuItem = async (req: Request, res: Response, next: NextFunction) => { try { res.json(await updateDoc('menuItems',String(req.params.id),req.body)); } catch(error){ next(error); } };
export const deleteMenuItem = async (req: Request, res: Response, next: NextFunction) => { try { await deleteDoc('menuItems',String(req.params.id)); res.json({success:true}); } catch(error){ next(error); } };
