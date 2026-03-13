import { Request, Response } from 'express';
import { db } from '../config/firebase';

export const getReservations = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('reservations').orderBy('createdAt', 'desc').get();
    const reservations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

export const createReservation = async (req: Request, res: Response) => {
  try {
    const data = {
      ...req.body,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    const docRef = await db.collection('reservations').add(data);
    res.status(201).json({ id: docRef.id, ...data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reservation' });
  }
};

export const updateReservationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.collection('reservations').doc(id).update({ status });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reservation status' });
  }
};

export const deleteReservation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.collection('reservations').doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
};
