import { Request, Response, NextFunction } from 'express';
import { getCollection, addDoc, updateDoc, deleteDoc } from '../services/db.service';
export const getWines = async (req: Request, res: Response, next: NextFunction) => { try { const data=await getCollection('wineItems'); res.json(data.sort((a:any,b:any)=>a.displayOrder-b.displayOrder)); } catch(error){ next(error); } };
export const createWine = async (req: Request, res: Response, next: NextFunction) => { try { res.status(201).json(await addDoc('wineItems',req.body)); } catch(error){ next(error); } };
export const updateWine = async (req: Request, res: Response, next: NextFunction) => { try { res.json(await updateDoc('wineItems',String(req.params.id),req.body)); } catch(error){ next(error); } };
export const deleteWine = async (req: Request, res: Response, next: NextFunction) => { try { await deleteDoc('wineItems',String(req.params.id)); res.json({success:true}); } catch(error){ next(error); } };
