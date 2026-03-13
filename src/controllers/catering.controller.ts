import { Request, Response } from 'express';
import { db } from '../config/firebase';

export const getCateringEvents = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('cateringEvents').orderBy('createdAt', 'desc').get();
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch catering events' });
  }
};

export const createCateringEvent = async (req: Request, res: Response) => {
  try {
    const data = {
      ...req.body,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    const docRef = await db.collection('cateringEvents').add(data);
    res.status(201).json({ id: docRef.id, ...data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create catering event' });
  }
};

export const updateCateringEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.collection('cateringEvents').doc(id).update(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update catering event' });
  }
};

export const deleteCateringEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.collection('cateringEvents').doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete catering event' });
  }
};
