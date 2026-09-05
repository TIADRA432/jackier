import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { getProfile } from '../services/db.service';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const token = authHeader.slice(7);
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = data.user;
    next();
  } catch (error) {
    console.error('Error verifying Supabase token:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export const requireRole = (roles: string[]) => async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) return res.status(403).json({ error: 'Forbidden' });
    const profile = await getProfile(req.user.id);
    if (!profile || !roles.includes(profile.role)) return res.status(403).json({ error: 'Forbidden' });
    req.user.profile = profile;
    next();
  } catch (error) {
    console.error('Error checking user role:', error);
    return res.status(403).json({ error: 'Forbidden' });
  }
};
