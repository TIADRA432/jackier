import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { serverLog } from '../utils/server-log';

const RESERVATION_STATUS_LABELS: Record<string, string> = {
  pending: 'en attente',
  confirmed: 'confirmée',
  cancelled: 'annulée',
  completed: 'terminée'
};

const CATERING_STATUS_LABELS: Record<string, string> = {
  pending: 'en attente',
  contacted: 'contactée',
  quoted: 'devis envoyé',
  confirmed: 'confirmée',
  completed: 'terminée',
  cancelled: 'annulée'
};

const formatActivity = (log: any) => {
  const action = String(log.action || 'ACTIVITY');
  const details = String(log.details || '');

  if (action === 'UPDATE_RESERVATION_STATUS') {
    const match = details.match(/Reservation #([^\s]+) changed to ([a-z_]+)/i);
    const reference = match?.[1] || '—';
    const status = RESERVATION_STATUS_LABELS[match?.[2] || ''] || match?.[2] || 'mise à jour';
    return {
      id: log.id,
      type: 'Réservation',
      message: `Réservation #${reference} passée au statut « ${status} ».`,
      date: log.timestamp
    };
  }

  if (action === 'UPDATE_CATERING_STATUS') {
    const match = details.match(/Catering request #([^\s]+) changed to ([a-z_]+)/i);
    const reference = match?.[1] || '—';
    const status = CATERING_STATUS_LABELS[match?.[2] || ''] || match?.[2] || 'mise à jour';
    return {
      id: log.id,
      type: 'Traiteur',
      message: `Demande #${reference} passée au statut « ${status} ».`,
      date: log.timestamp
    };
  }

  if (action === 'UPDATE_SETTINGS') {
    return {
      id: log.id,
      type: 'Paramètres',
      message: 'Configuration du site mise à jour.',
      date: log.timestamp
    };
  }

  return {
    id: log.id,
    type: action.toLowerCase().replace(/_/g, ' ').replace(/^./, value => value.toUpperCase()),
    message: details || 'Action enregistrée.',
    date: log.timestamp
  };
};

const compactActivities = (logs: any[]) => {
  const activities = logs.map(formatActivity);
  const compacted: Array<{ id: string; type: string; message: string; date: string }> = [];

  for (const activity of activities) {
    const previous = compacted[compacted.length - 1];
    if (previous && previous.type === activity.type && previous.message === activity.message) continue;
    compacted.push(activity);
    if (compacted.length >= 8) break;
  }

  return compacted;
};

export const getDashboardOverview = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 86400000);

    const [reservations, pendingReservations, pendingSchoolRegistrations, activeDishes, activeCatering, financeReports, logs, activeWines, publicTeam, gallery, school, settings] = await Promise.all([
      supabase.from('reservations').select('id', { count: 'exact', head: true }).gte('date', today.toISOString()).lt('date', tomorrow.toISOString()),
      supabase.from('reservations').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('school_registrations').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('menu_items').select('id', { count: 'exact', head: true }).eq('active', true),
      supabase.from('catering_events').select('id', { count: 'exact', head: true }).in('status', ['pending', 'contacted', 'quoted', 'confirmed']),
      supabase.from('finance_reports').select('*').order('date', { ascending: false }).limit(30),
      supabase.from('logs').select('*').order('timestamp', { ascending: false }).limit(30),
      supabase.from('wine_items').select('id', { count: 'exact', head: true }).eq('active', true),
      supabase.from('team_members').select('id', { count: 'exact', head: true }).eq('active', true).eq('public_visible', true),
      supabase.from('gallery_images').select('id', { count: 'exact', head: true }),
      supabase.from('school_programs').select('id,data'),
      supabase.from('settings').select('data').eq('id', 'global').maybeSingle()
    ]);

    const errors = [reservations, pendingReservations, pendingSchoolRegistrations, activeDishes, activeCatering, financeReports, logs, activeWines, publicTeam, gallery, school, settings].filter(result => result.error);
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
    const recentActivities = compactActivities(logs.data || []);

    const settingsData = (settings.data?.data || {}) as Record<string, any>;
    const activeSchoolPrograms = (school.data || []).filter((row: any) => row.data?.active !== false).length;
    const socialMedia = settingsData.socialMedia && typeof settingsData.socialMedia === 'object' ? settingsData.socialMedia : {};
    const hasSocial = Object.values(socialMedia).some(value => typeof value === 'string' && value.trim());
    const hasLegal = Boolean(settingsData.legalNoticeUrl && settingsData.privacyPolicyUrl);
    const readinessChecks = [
      { key: 'settings', label: 'Paramètres établissement', complete: Boolean(settings.data), detail: settings.data ? 'Configuration enregistrée' : 'Configuration globale absente', owner: 'admin', nextAction: settings.data ? 'Aucune action' : 'Enregistrer les paramètres globaux' },
      { key: 'menu', label: 'Menu public', complete: (activeDishes.count || 0) > 0, detail: `${activeDishes.count || 0} plat(s) actif(s)`, owner: 'admin', nextAction: (activeDishes.count || 0) > 0 ? 'Aucune action' : 'Publier au moins un plat validé' },
      { key: 'wines', label: 'Carte des vins', complete: (activeWines.count || 0) > 0, detail: `${activeWines.count || 0} vin(s) actif(s)`, owner: 'client', nextAction: (activeWines.count || 0) > 0 ? 'Aucune action' : 'Obtenir la carte des vins validée puis la saisir' },
      { key: 'team', label: 'Équipe publique', complete: (publicTeam.count || 0) > 0, detail: `${publicTeam.count || 0} profil(s) public(s)`, owner: 'client', nextAction: (publicTeam.count || 0) > 0 ? 'Aucune action' : 'Obtenir noms, rôles, bios et photos validés' },
      { key: 'gallery', label: 'Galerie', complete: (gallery.count || 0) > 0, detail: `${gallery.count || 0} image(s)`, owner: 'admin', nextAction: (gallery.count || 0) > 0 ? 'Aucune action' : 'Publier des visuels validés' },
      { key: 'school', label: 'École gastronomique', complete: activeSchoolPrograms > 0, detail: `${activeSchoolPrograms} programme(s) public(s)`, owner: 'client', nextAction: activeSchoolPrograms > 0 ? 'Aucune action' : 'Obtenir les programmes validés puis les publier' },
      { key: 'hours', label: 'Horaires temps réel', complete: settingsData.weeklyHours?.enabled === true, detail: settingsData.weeklyHours?.enabled === true ? 'Statut ouvert/fermé actif' : 'Horaires détaillés non activés', owner: 'client', nextAction: settingsData.weeklyHours?.enabled === true ? 'Aucune action' : 'Faire confirmer les horaires jour par jour' },
      { key: 'social', label: 'Réseaux sociaux', complete: hasSocial, detail: hasSocial ? 'Au moins un réseau configuré' : 'Aucun réseau configuré', owner: 'client', nextAction: hasSocial ? 'Aucune action' : 'Obtenir les URLs officielles des réseaux sociaux' },
      { key: 'legal', label: 'Liens légaux', complete: hasLegal, detail: hasLegal ? 'Mentions légales et confidentialité configurées' : 'Liens légaux incomplets', owner: 'client', nextAction: hasLegal ? 'Aucune action' : 'Obtenir ou faire valider les documents légaux' }
    ];
    const completedReadiness = readinessChecks.filter(check => check.complete).length;

    res.json({
      stats: {
        todayReservations: reservations.count || 0,
        pendingReservations: pendingReservations.count || 0,
        pendingSchoolRegistrations: pendingSchoolRegistrations.count || 0,
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
        adminPending: readinessChecks.filter(check => !check.complete && check.owner === 'admin').length,
        clientPending: readinessChecks.filter(check => !check.complete && check.owner === 'client').length,
        checks: readinessChecks
      }
    });
  } catch (error) {
    serverLog('error', 'dashboard.overview_failed', error);
    res.status(500).json({ error: 'Failed to fetch dashboard overview' });
  }
};
