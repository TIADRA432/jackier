
import { Routes } from '@angular/router';
import { adminAuthGuard } from './core/guards/admin-auth.guard';

export const routes: Routes = [
  { path: 'carte', redirectTo: 'menu', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Le Jacquier – Restaurant à Kipé, Conakry',
    data: { seo: { description: 'Découvrez Le Jacquier à Kipé, Conakry : cuisine, menu, équipe, galerie et réservation en ligne.' } }
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'À propos – Le Jacquier',
    data: { seo: { description: 'Découvrez l’univers du Jacquier, son équipe publique et l’identité du restaurant à Kipé, Conakry.' } }
  },
  {
    path: 'menu',
    loadComponent: () => import('./pages/menu/menu.component').then(m => m.MenuComponent),
    title: 'Menu & Carte des vins – Le Jacquier',
    data: { seo: { description: 'Consultez les plats et vins actuellement publiés par Le Jacquier à Kipé, Conakry.' } }
  },
  {
    path: 'services-traiteur',
    loadComponent: () => import('./pages/traiteur/traiteur.component').then(m => m.TraiteurComponent),
    title: 'Service Traiteur à Conakry – Le Jacquier',
    data: { seo: { description: 'Découvrez le service traiteur du Jacquier à Conakry et envoyez une demande pour votre événement.' } }
  },
  {
    path: 'ecole-gastronomie',
    loadComponent: () => import('./pages/school/school.component').then(m => m.SchoolComponent),
    title: 'École de Gastronomie – Le Jacquier',
    data: { seo: { description: 'Découvrez les programmes de formation actuellement publiés par l’École de Gastronomie du Jacquier à Conakry.' } }
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery.component').then(m => m.GalleryComponent),
    title: 'Galerie – Le Jacquier',
    data: { seo: { description: 'Découvrez en images la cuisine, l’ambiance, l’équipe et les événements du Jacquier à Conakry.' } }
  },
  {
    path: 'reservation',
    loadComponent: () => import('./pages/reservation/reservation.component').then(m => m.ReservationComponent),
    title: 'Réserver une table – Le Jacquier',
    data: { seo: { description: 'Envoyez votre demande de réservation au Jacquier à Kipé, Conakry, selon les créneaux disponibles.' } }
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact & Accès – Le Jacquier',
    data: { seo: { description: 'Adresse, téléphone, horaires et accès au restaurant Le Jacquier à Kipé, Conakry.' } }
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin/login/admin-login.component').then(m => m.AdminLoginComponent),
    title: 'Le Jacquier - Connexion administration'
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [adminAuthGuard],
    canActivateChild: [adminAuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent), title: 'Admin - Dashboard' },
      { path: 'reservations', loadComponent: () => import('./pages/admin/reservations/reservations.component').then(m => m.ReservationsComponent), title: 'Admin - Réservations' },
      { path: 'stock', loadComponent: () => import('./pages/admin/stock/stock.component').then(m => m.StockComponent), title: 'Admin - Stock' },
      { path: 'analytics', loadComponent: () => import('./pages/admin/analytics/analytics.component').then(m => m.AnalyticsComponent), title: 'Admin - Analyses' },
      { path: 'cms', loadComponent: () => import('./pages/admin/cms/cms.component').then(m => m.CMSComponent), title: 'Admin - CMS' },
      { path: 'galerie', loadComponent: () => import('./pages/admin/gallery/admin-gallery.component').then(m => m.AdminGalleryComponent), title: 'Admin - Galerie publique' },
      { path: 'traiteur', loadComponent: () => import('./pages/admin/traiteur/traiteur.component').then(m => m.AdminTraiteurComponent), title: 'Admin - Traiteur' },
      { path: 'ecole', loadComponent: () => import('./pages/admin/school/school.component').then(m => m.AdminSchoolComponent), title: 'Admin - École' },
      { path: 'finance', loadComponent: () => import('./pages/admin/finance/finance.component').then(m => m.AdminFinanceComponent), title: 'Admin - Finance' },
      { path: 'equipe', loadComponent: () => import('./pages/admin/equipe/equipe.component').then(m => m.AdminEquipeComponent), title: 'Admin - Équipe' },
      { path: 'settings', loadComponent: () => import('./pages/admin/settings/settings.component').then(m => m.AdminSettingsComponent), title: 'Admin - Paramètres' },
      { path: 'restaurant', loadComponent: () => import('./pages/admin/restaurant/restaurant.component').then(m => m.AdminRestaurantComponent), title: 'Admin - Restaurant' },
      { path: 'categories', loadComponent: () => import('./pages/admin/categories/categories.component').then(m => m.AdminCategoriesComponent), title: 'Admin - Catégories du menu' },
      { path: 'vins', loadComponent: () => import('./pages/admin/wines/wines.component').then(m => m.AdminWinesComponent), title: 'Admin - Carte des vins' }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page introuvable – Le Jacquier',
    data: { seo: { description: 'La page demandée est introuvable.', noindex: true } }
  }
];
