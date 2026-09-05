import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

const format = (row: any) => ({ id: row.id, ...(row.data || {}), status: row.status, createdAt: row.created_at });

export const getCateringEvents = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('catering_events').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json((data || []).map(format));
  } catch { res.status(500).json({ error: 'Failed to fetch catering events' }); }
};

export const createCateringEvent = async (req: Request, res: Response) => {
  try {
    const payload = { ...req.body, createdAt: new Date().toISOString(), status: 'pending' };
    const { data, error } = await supabase.from('catering_events').insert({ status: 'pending', data: payload }).select('*').single();
    if (error) throw error;
    res.status(201).json(format(data));
  } catch { res.status(500).json({ error: 'Failed to create catering event' }); }
};

export const updateCateringEvent = async (req: Request, res: Response) => {
  try {
    const { data: existing, error: readError } = await supabase.from('catering_events').select('*').eq('id', req.params.id).single();
    if (readError) throw readError;
    const payload = { ...(existing.data || {}), ...req.body };
    const { data, error } = await supabase.from('catering_events').update({ status: req.body.status || existing.status, data: payload }).eq('id', req.params.id).select('*').single();
    if (error) throw error;
    res.json(format(data));
  } catch { res.status(500).json({ error: 'Failed to update catering event' }); }
};

export const deleteCateringEvent = async (req: Request, res: Response) => {
  try {
    const { error } = await supabase.from('catering_events').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Failed to delete catering event' }); }
};
