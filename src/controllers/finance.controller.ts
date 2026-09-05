import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('expenses').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json((data || []).map(row => ({ id: row.id, ...(row.data || {}), amount: row.amount, date: row.date, createdAt: row.created_at })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

export const getReports = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('finance_reports').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json((data || []).map(row => ({
      id: row.id,
      date: row.date,
      createdAt: row.created_at,
      totalRevenue: row.total_revenue,
      totalExpenses: row.total_expenses,
      netIncome: row.net_income,
      manualRevenue: row.manual_revenue,
      revenue: row.total_revenue
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch finance reports' });
  }
};

export const addExpense = async (req: Request, res: Response) => {
  try {
    const now = new Date().toISOString();
    const payload = { ...req.body, date: now, createdAt: now };
    const { data, error } = await supabase.from('expenses').insert({
      amount: Number(req.body.amount || 0),
      date: now,
      data: payload
    }).select('*').single();
    if (error) throw error;
    res.status(201).json({ id: data.id, ...payload });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add expense' });
  }
};

export const dailyClose = async (req: Request, res: Response) => {
  try {
    const manualRevenue = Number(req.body.manualRevenue || 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 86400000);

    const { data: expenses, error: expensesError } = await supabase
      .from('expenses').select('amount,date').gte('date', today.toISOString()).lt('date', tomorrow.toISOString());
    if (expensesError) throw expensesError;

    const totalExpenses = (expenses || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const now = new Date().toISOString();
    const report = {
      date: now,
      createdAt: now,
      totalRevenue: manualRevenue,
      totalExpenses,
      netIncome: manualRevenue - totalExpenses,
      manualRevenue
    };

    const { data, error } = await supabase.from('finance_reports').insert({
      date: now,
      total_revenue: manualRevenue,
      total_expenses: totalExpenses,
      net_income: manualRevenue - totalExpenses,
      manual_revenue: manualRevenue
    }).select('*').single();
    if (error) throw error;
    res.status(201).json({ id: data.id, ...report, revenue: manualRevenue });
  } catch (error) {
    res.status(500).json({ error: 'Failed to perform daily close' });
  }
};
