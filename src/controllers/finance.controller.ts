import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import {
  CatalogValidationError,
  catalogError,
  optionalPrice,
  optionalText,
  requireKnownFields,
  requiredText
} from './catalog.validation';

const EXPENSE_FIELDS = new Set(['label', 'category', 'amount']);
const DAILY_CLOSE_FIELDS = new Set(['manualRevenue']);

const validateExpensePayload = (body: unknown) => {
  const source = requireKnownFields(body, EXPENSE_FIELDS);
  const amount = optionalPrice(source.amount, 'amount');
  if (amount === undefined || amount <= 0) {
    throw new CatalogValidationError('amount must be greater than zero');
  }

  return {
    label: requiredText(source.label, 'label', 160),
    category: optionalText(source.category, 'category', 80),
    amount
  };
};

const validateDailyClosePayload = (body: unknown): number => {
  const source = requireKnownFields(body, DAILY_CLOSE_FIELDS);
  const manualRevenue = optionalPrice(source.manualRevenue, 'manualRevenue');
  if (manualRevenue === undefined) {
    throw new CatalogValidationError('manualRevenue is required');
  }
  return manualRevenue;
};

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
    const expense = validateExpensePayload(req.body);
    const now = new Date().toISOString();
    const payload = { ...expense, date: now, createdAt: now };
    const { data, error } = await supabase.from('expenses').insert({
      amount: expense.amount,
      date: now,
      data: payload
    }).select('*').single();
    if (error) throw error;
    res.status(201).json({ id: data.id, ...payload });
  } catch (error) {
    return catalogError(error, res, 'Failed to add expense');
  }
};

export const dailyClose = async (req: Request, res: Response) => {
  try {
    const manualRevenue = validateDailyClosePayload(req.body);
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
    return catalogError(error, res, 'Failed to perform daily close');
  }
};
