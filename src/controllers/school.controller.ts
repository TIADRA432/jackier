import { Request, Response } from 'express';
import { db } from '../config/firebase';

export const getSchoolPrograms = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('schoolPrograms').orderBy('createdAt', 'desc').get();
    const programs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch school programs' });
  }
};

export const createSchoolProgram = async (req: Request, res: Response) => {
  try {
    const data = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    const docRef = await db.collection('schoolPrograms').add(data);
    res.status(201).json({ id: docRef.id, ...data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create school program' });
  }
};

export const updateSchoolProgram = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.collection('schoolPrograms').doc(id).update(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update school program' });
  }
};

export const deleteSchoolProgram = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.collection('schoolPrograms').doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete school program' });
  }
};
