import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const doc = await db.collection('settings').doc('global').get();
    if (!doc.exists) {
      return res.json({});
    }
    res.json(doc.data());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    await db.collection('settings').doc('global').set(req.body, { merge: true });
    
    // Log the action
    await db.collection('logs').add({
      action: 'UPDATE_SETTINGS',
      details: 'System settings updated',
      userId: req.user?.uid || 'system',
      timestamp: new Date().toISOString()
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

export const getLogs = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('logs').orderBy('timestamp', 'desc').limit(100).get();
    const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};
