import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getDashboardOverview = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 86400000);

    const [reservations, pendingReservations, activeDishes, activeCatering, financeReports, logs] = await Promise.all([
      supabase.from('reservations').select('id', { count: 'exact', head: true }).gte('date', today.toISOString()).lt('date', tomorrow.toISOString()),
      supabase.from('reservations').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('menu_items').select('id', { count: 'exact', head: true }).eq('active', true),
      supabase.from('catering_events').select('id', { count: 'exact', head: true }).in('status', ['pending', 'confirmed']),
      supabase.from('finance_reports').select('*').order('date', { ascending: false }).limit(30),
      supabase.from('logs').select('*').order('timestamp', { ascending: false }).limit(10)
    ]);

    const errors = [reservations, pendingReservations, activeDishes, activeCatering, financeReports, logs].filter(result => result.error);
    if (errors.length) throw errors[0].error;

    let todayRevenue = 0;
    let monthlyRevenue = 0;
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthlyData: Record<string, number> = {};

    for (const report of financeReports.data || []) {
      const reportDate = new Date(report.date);
      const revenue = Number(report.total_revenue || 0);
      if (reportDate >= today && reportDate < tomorrow) todayRevenue += revenue;
      if (reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear) monthlyRevenue += revenue;
      const monthLabel = reportDate.toLocaleString('default', { month: 'short' });
      monthlyData[monthLabel] = (monthlyData[monthLabel] || 0) + revenue;
    }

    const revenueChart = Object.entries(monthlyData).map(([month, total]) => ({ month, total }));
    const recentActivities = (logs.data || []).map(log => ({
      id: log.id,
      type: log.action,
      message: log.details,
      date: log.timestamp
    }));

    res.json({
      stats: {
        todayReservations: reservations.count || 0,
        pendingReservations: pendingReservations.count || 0,
        todayRevenue,
        monthlyRevenue,
        activeMenuItems: activeDishes.count || 0,
        activeCatering: activeCatering.count || 0
      },
      revenueChart,
      recentActivities
    });
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard overview' });
  }
};
