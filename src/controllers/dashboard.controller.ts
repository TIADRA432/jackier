import { Request, Response } from 'express';
import { db } from '../config/firebase';

export const getDashboardOverview = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();
    const tomorrow = new Date(today.getTime() + 86400000).toISOString();

    // Stats
    const [
      reservationsSnapshot,
      pendingReservationsSnapshot,
      activeDishesSnapshot,
      activeCateringSnapshot,
      financeReportsSnapshot,
      logsSnapshot
    ] = await Promise.all([
      db.collection('reservations').where('date', '>=', todayStr).where('date', '<', tomorrow).get(),
      db.collection('reservations').where('status', '==', 'pending').get(),
      db.collection('menuItems').where('active', '==', true).get(),
      db.collection('cateringEvents').where('status', 'in', ['pending', 'confirmed']).get(),
      db.collection('financeReports').orderBy('date', 'desc').limit(30).get(),
      db.collection('logs').orderBy('timestamp', 'desc').limit(10).get()
    ]);

    let todayRevenue = 0;
    let monthlyRevenue = 0;
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const revenueChart: any[] = [];
    const monthlyData: { [key: string]: number } = {};

    financeReportsSnapshot.forEach(doc => {
      const data = doc.data();
      const reportDate = new Date(data.date);
      
      if (reportDate >= today && reportDate < new Date(today.getTime() + 86400000)) {
        todayRevenue += data.revenue || 0;
      }
      
      if (reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear) {
        monthlyRevenue += data.revenue || 0;
      }

      const monthLabel = reportDate.toLocaleString('default', { month: 'short' });
      monthlyData[monthLabel] = (monthlyData[monthLabel] || 0) + (data.revenue || 0);
    });

    for (const [month, total] of Object.entries(monthlyData)) {
      revenueChart.push({ month, total });
    }

    const recentActivities = logsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.action,
        message: data.details,
        date: data.timestamp
      };
    });

    res.json({
      stats: {
        todayReservations: reservationsSnapshot.size,
        pendingReservations: pendingReservationsSnapshot.size,
        todayRevenue,
        monthlyRevenue,
        activeMenuItems: activeDishesSnapshot.size,
        activeCatering: activeCateringSnapshot.size
      },
      revenueChart,
      recentActivities
    });
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard overview' });
  }
};
