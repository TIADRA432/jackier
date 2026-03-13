import { Request, Response } from 'express';
import { db } from '../config/firebase';

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('expenses').orderBy('createdAt', 'desc').get();
    const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

export const getReports = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('financeReports').orderBy('createdAt', 'desc').get();
    const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch finance reports' });
  }
};

export const addExpense = async (req: Request, res: Response) => {
  try {
    const data = {
      ...req.body,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    const docRef = await db.collection('expenses').add(data);
    res.status(201).json({ id: docRef.id, ...data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add expense' });
  }
};

export const dailyClose = async (req: Request, res: Response) => {
  try {
    const { manualRevenue } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();
    const tomorrow = new Date(today.getTime() + 86400000).toISOString();

    // Calculate total expenses for today
    const expensesSnapshot = await db.collection('expenses')
      .where('date', '>=', todayStr)
      .where('date', '<', tomorrow)
      .get();
    
    let totalExpenses = 0;
    expensesSnapshot.forEach(doc => {
      totalExpenses += doc.data().amount || 0;
    });

    const netIncome = manualRevenue - totalExpenses;

    const data = {
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      totalRevenue: manualRevenue,
      totalExpenses,
      netIncome,
      manualRevenue
    };

    const docRef = await db.collection('financeReports').add(data);
    res.status(201).json({ id: docRef.id, ...data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to perform daily close' });
  }
};
