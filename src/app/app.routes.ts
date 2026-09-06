
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Le Jacquier - Accueil'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'Le Jacquier - À Propos'
  },
  {
    path: 'menu',
    loadComponent: () => import('./pages/menu/menu.component').then(m => m.MenuComponent),
    title: 'Le Jacquier - Menu'
  },
  {
    path: 'services-traiteur',
    loadComponent: () => import('./pages/traiteur/traiteur.component').then(m => m.TraiteurComponent),
    title: 'Service Traiteur à Conakry – Organisation Mariages & Événements'
  },
  {
    path: 'ecole-gastronomie',
    loadComponent: () => import('./pages/school/school.component').then(m => m.SchoolComponent),
    title: 'Le Jacquier - École de Gastronomie'
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery.component').then(m => m.GalleryComponent),
    title: 'Le Jacquier - Galerie'
  },
  {
    path: 'reservation',
    loadComponent: () => import('./pages/reservation/reservation.component').then(m => m.ReservationComponent),
    title: 'Le Jacquier - Réservation'
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
    title: 'Le Jacquier - Contact'
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent), title: 'Admin - Dashboard' },
      { path: 'reservations', loadComponent: () => import('./pages/admin/reservations/reservations.component').then(m => m.ReservationsComponent), title: 'Admin - Réservations' },
      { path: 'stock', loadComponent: () => import('./pages/admin/stock/stock.component').then(m => m.StockComponent), title: 'Admin - Stock' },
      { path: 'analytics', loadComponent: () => import('./pages/admin/analytics/analytics.component').then(m => m.AnalyticsComponent), title: 'Admin - Analyses' },
      { path: 'cms', loadComponent: () => import('./pages/admin/cms/cms.component').then(m => m.CMSComponent), title: 'Admin - CMS' },
      { path: 'traiteur', loadComponent: () => import('./pages/admin/traiteur/traiteur.component').then(m => m.AdminTraiteurComponent), title: 'Admin - Traiteur' },
      { path: 'ecole', loadComponent: () => import('./pages/admin/school/school.component').then(m => m.AdminSchoolComponent), title: 'Admin - École' },
      { path: 'finance', loadComponent: () => import('./pages/admin/finance/finance.component').then(m => m.AdminFinanceComponent), title: 'Admin - Finance' },
      { path: 'equipe', loadComponent: () => import('./pages/admin/equipe/equipe.component').then(m => m.AdminEquipeComponent), title: 'Admin - Équipe' },
      { path: 'settings', loadComponent: () => import('./pages/admin/settings/settings.component').then(m => m.AdminSettingsComponent), title: 'Admin - Paramètres' },
      { path: 'restaurant', loadComponent: () => import('./pages/admin/restaurant/restaurant.component').then(m => m.AdminRestaurantComponent), title: 'Admin - Restaurant' }
    ]
  },
  { path: '**', redirectTo: '' }
];
