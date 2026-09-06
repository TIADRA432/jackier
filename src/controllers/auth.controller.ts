import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

export const setupAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const { data: users, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listError) throw listError;

    const existing = users.users.find(user => user.email?.toLowerCase() === String(email).toLowerCase());
    let userId: string;

    if (existing) {
      const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
        user_metadata: { ...(existing.user_metadata || {}), role: 'ADMIN' }
      });
      if (error) throw error;
      userId = data.user.id;
    } else {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: 'ADMIN' }
      });
      if (error) throw error;
      if (!data.user) throw new Error('Supabase did not return the created user');
      userId = data.user.id;
    }

    const { error: profileError } = await supabase.from('profiles').upsert({
      id: userId,
      email,
      role: 'ADMIN'
    });
    if (profileError) throw profileError;

    res.status(200).json({ success: true, message: 'Admin user created/updated successfully', uid: userId });
  } catch (error) {
    next(error);
  }
};
