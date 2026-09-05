import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

const format = (row: any) => ({ id: row.id, ...(row.data || {}), status: row.status, date: row.date, createdAt: row.created_at });

export const getReservations = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json((data || []).map(format));
  } catch { res.status(500).json({ error: 'Failed to fetch reservations' }); }
};

export const createReservation = async (req: Request, res: Response) => {
  try {
    const payload = { ...req.body, createdAt: new Date().toISOString(), status: 'pending' };
    const { data, error } = await supabase.from('reservations').insert({ status: 'pending', date: req.body.date || null, data: payload }).select('*').single();
    if (error) throw error;
    res.status(201).json(format(data));
  } catch { res.status(500).json({ error: 'Failed to create reservation' }); }
};

export const updateReservationStatus = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('reservations').update({ status: req.body.status }).eq('id', req.params.id).select('*').single();
    if (error) throw error;
    res.json(format(data));
  } catch { res.status(500).json({ error: 'Failed to update reservation status' }); }
};

export const deleteReservation = async (req: Request, res: Response) => {
  try {
    const { error } = await supabase.from('reservations').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Failed to delete reservation' }); }
};
