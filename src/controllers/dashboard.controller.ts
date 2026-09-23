import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getDashboardOverview = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 86400000);

    const [reservations, pendingReservations, activeDishes, activeCatering, financeReports, logs, activeWines, publicTeam, gallery, school, settings] = await Promise.all([
      supabase.from('reservations').select('id', { count: 'exact', head: true }).gte('date', today.toISOString()).lt('date', tomorrow.toISOString()),
      supabase.from('reservations').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('menu_items').select('id', { count: 'exact', head: true }).eq('active', true),
      supabase.from('catering_events').select('id', { count: 'exact', head: true }).in('status', ['pending', 'confirmed']),
      supabase.from('finance_reports').select('*').order('date', { ascending: false }).limit(30),
      supabase.from('logs').select('*').order('timestamp', { ascending: false }).limit(10),
      supabase.from('wine_items').select('id', { count: 'exact', head: true }).eq('active', true),
      supabase.from('team_members').select('id', { count: 'exact', head: true }).eq('active', true).eq('public_visible', true),
      supabase.from('gallery_images').select('id', { count: 'exact', head: true }),
      supabase.from('school_programs').select('id,data'),
      supabase.from('settings').select('data').eq('id', 'global').maybeSingle()
    ]);

    const errors = [reservations, pendingReservations, activeDishes, activeCatering, financeReports, logs, activeWines, publicTeam, gallery, school, settings].filter(result => result.error);
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

    const settingsData = (settings.data?.data || {}) as Record<string, any>;
    const activeSchoolPrograms = (school.data || []).filter((row: any) => row.data?.active !== false).length;
    const socialMedia = settingsData.socialMedia && typeof settingsData.socialMedia === 'object' ? settingsData.socialMedia : {};
    const readinessChecks = [
      { key: 'settings', label: 'Paramètres établissement', complete: Boolean(settings.data), detail: settings.data ? 'Configuration enregistrée' : 'Configuration globale absente' },
      { key: 'menu', label: 'Menu public', complete: (activeDishes.count || 0) > 0, detail: `${activeDishes.count || 0} plat(s) actif(s)` },
      { key: 'wines', label: 'Carte des vins', complete: (activeWines.count || 0) > 0, detail: `${activeWines.count || 0} vin(s) actif(s)` },
      { key: 'team', label: 'Équipe publique', complete: (publicTeam.count || 0) > 0, detail: `${publicTeam.count || 0} profil(s) public(s)` },
      { key: 'gallery', label: 'Galerie', complete: (gallery.count || 0) > 0, detail: `${gallery.count || 0} image(s)` },
      { key: 'school', label: 'École gastronomique', complete: activeSchoolPrograms > 0, detail: `${activeSchoolPrograms} programme(s) public(s)` },
      { key: 'hours', label: 'Horaires temps réel', complete: settingsData.weeklyHours?.enabled === true, detail: settingsData.weeklyHours?.enabled === true ? 'Statut ouvert/fermé actif' : 'Horaires détaillés non activés' },
      { key: 'social', label: 'Réseaux sociaux', complete: Object.values(socialMedia).some(value => typeof value === 'string' && value.trim()), detail: Object.values(socialMedia).some(value => typeof value === 'string' && value.trim()) ? 'Au moins un réseau configuré' : 'Aucun réseau configuré' },
      { key: 'legal', label: 'Liens légaux', complete: Boolean(settingsData.legalNoticeUrl && settingsData.privacyPolicyUrl), detail: settingsData.legalNoticeUrl && settingsData.privacyPolicyUrl ? 'Mentions légales et confidentialité configurées' : 'Liens légaux incomplets' }
    ];
    const completedReadiness = readinessChecks.filter(check => check.complete).length;

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
      recentActivities,
      readiness: {
        completed: completedReadiness,
        total: readinessChecks.length,
        percent: Math.round((completedReadiness / readinessChecks.length) * 100),
        checks: readinessChecks
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard overview' });
  }
};
