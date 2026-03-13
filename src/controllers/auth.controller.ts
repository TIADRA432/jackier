import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { db } from '../config/firebase';

export const setupAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!db) {
      return res.status(500).json({ error: 'Firebase Admin not initialized. Cannot create admin user.' });
    }

    const auth = getAuth();
    
    let userRecord;
    try {
      // Check if user already exists
      userRecord = await auth.getUserByEmail(email);
      // Update password if user exists
      await auth.updateUser(userRecord.uid, { password });
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        // Create new user
        userRecord = await auth.createUser({
          email,
          password,
          emailVerified: true,
        });
      } else {
        throw error;
      }
    }

    // Set custom claims for admin
    await auth.setCustomUserClaims(userRecord.uid, { admin: true });

    // Add to Firestore users collection
    await db.collection('users').doc(userRecord.uid).set({
      email: userRecord.email,
      role: 'ADMIN',
      createdAt: new Date()
    }, { merge: true });

    res.status(200).json({ 
      success: true, 
      message: 'Admin user created/updated successfully',
      uid: userRecord.uid 
    });
  } catch (error) {
    next(error);
  }
};
