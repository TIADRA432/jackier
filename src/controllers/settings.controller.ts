import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const PUBLIC_SETTINGS_KEYS = [
  'restaurantName',
  'address',
  'phone',
  'email',
  'openingHours',
  'currency',
  'socialMedia',
] as const;

const toPublicSettings = (data: Record<string, unknown>) =>
  Object.fromEntries(PUBLIC_SETTINGS_KEYS.filter(key => key in data).map(key => [key, data[key]]));

export const getSettings = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('settings').select('data').eq('id', 'global').maybeSingle();
    if (error) throw error;
    res.json(toPublicSettings((data?.data || {}) as Record<string, unknown>));
  } catch { res.status(500).json({ error: 'Failed to fetch settings' }); }
};

export const updateSettings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data: current } = await supabase.from('settings').select('data').eq('id', 'global').maybeSingle();
    const { error } = await supabase.from('settings').upsert({ id: 'global', data: { ...(current?.data || {}), ...req.body } });
    if (error) throw error;
    const { error: logError } = await supabase.from('logs').insert({
      action: 'UPDATE_SETTINGS',
      details: 'System settings updated',
      user_id: req.user?.id || 'system',
      timestamp: new Date().toISOString()
    });
    if (logError) console.warn('Unable to write settings log:', logError.message);
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Failed to update settings' }); }
};

export const getLogs = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('logs').select('*').order('timestamp', { ascending: false }).limit(100);
    if (error) throw error;
    res.json(data || []);
  } catch { res.status(500).json({ error: 'Failed to fetch logs' }); }
};
