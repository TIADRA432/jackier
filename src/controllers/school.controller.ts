import { Request, Response } from 'express';
import { getCollection, addDoc, updateDoc, deleteDoc } from '../services/db.service';
export const getSchoolPrograms = async (_req: Request, res: Response) => { try { res.json(await getCollection('schoolPrograms')); } catch { res.status(500).json({error:'Failed to fetch school programs'}); } };
export const createSchoolProgram = async (req: Request, res: Response) => { try { res.status(201).json(await addDoc('schoolPrograms',req.body)); } catch { res.status(500).json({error:'Failed to create school program'}); } };
export const updateSchoolProgram = async (req: Request, res: Response) => { try { res.json(await updateDoc('schoolPrograms',String(req.params.id),req.body)); } catch { res.status(500).json({error:'Failed to update school program'}); } };
export const deleteSchoolProgram = async (req: Request, res: Response) => { try { await deleteDoc('schoolPrograms',String(req.params.id)); res.json({success:true}); } catch { res.status(500).json({error:'Failed to delete school program'}); } };
