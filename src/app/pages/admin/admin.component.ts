import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminAuthService } from '../../core/services/admin-auth.service';
import { AdminDataService, DashboardOverview, SchoolRegistration } from '../../core/services/admin-data.service';

interface AdminSearchItem {
  label: string;
  path: string;
  group: string;
  description: string;
  keywords: string;
}

interface AdminNotificationItem {
  id: string;
  label: string;
  detail: string;
  path: string;
  count: number;
  tone: 'amber' | 'blue' | 'red';
}

const EMPTY_OVERVIEW: DashboardOverview = {
  stats: {
    todayReservations: 0,
    pendingReservations: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    activeMenuItems: 0,
    activeCatering: 0
  },
  revenueChart: [],
  recentActivities: [],
  readiness: { completed: 0, total: 9, percent: 0, adminPending: 0, clientPending: 0, checks: [] }
};

const ADMIN_SEARCH_ITEMS: AdminSearchItem[] = [
  { label: 'Centre de Commande', path: '/admin/dashboard', group: 'Monitoring', description: 'Indicateurs, activité et préparation à la livraison', keywords: 'dashboard accueil statistiques monitoring readiness' },
  { label: 'Restaurant & Menu', path: '/admin/restaurant', group: 'Opérations', description: 'Plats, disponibilités et suggestions', keywords: 'restaurant menu carte plats suggestions disponibilité' },
  { label: 'Catégories du menu', path: '/admin/categories', group: 'Opérations', description: 'Organisation des catégories de la carte', keywords: 'catégories menu carte' },
  { label: 'Carte des vins', path: '/admin/vins', group: 'Opérations', description: 'Vins, prix verre et bouteille', keywords: 'vins boissons cave bouteille verre' },
  { label: 'Réservations', path: '/admin/reservations', group: 'Opérations', description: 'Demandes de réservation et statuts', keywords: 'réservation table clients pending confirmé' },
  { label: 'Service Traiteur', path: '/admin/traiteur', group: 'Opérations', description: 'Demandes de devis et événements', keywords: 'traiteur événements devis catering' },
  { label: 'École Gastronomique', path: '/admin/ecole', group: 'Opérations', description: 'Programmes, sessions, jauges et inscriptions', keywords: 'école formation programme session inscription atelier masterclass' },
  { label: 'Stock & Inventaire', path: '/admin/stock', group: 'Opérations', description: 'Quantités, seuils et coûts', keywords: 'stock inventaire quantité seuil coût' },
  { label: 'Finance & BI', path: '/admin/finance', group: 'Intelligence', description: 'Dépenses et clôtures', keywords: 'finance dépenses revenus clôture chiffre affaires' },
  { label: 'Analyses Avancées', path: '/admin/analytics', group: 'Intelligence', description: 'Indicateurs opérationnels', keywords: 'analytics analyses indicateurs rapports' },
  { label: 'Équipe & Personnel', path: '/admin/equipe', group: 'Administration', description: 'Profils internes et publication', keywords: 'équipe personnel staff profils' },
  { label: 'CMS & Contenu', path: '/admin/cms', group: 'Administration', description: 'Médiathèque et contenus', keywords: 'cms contenu médias images' },
  { label: 'Galerie publique', path: '/admin/galerie', group: 'Administration', description: 'Photos visibles sur le site', keywords: 'galerie photos images public' },
  { label: 'Paramètres', path: '/admin/settings', group: 'Administration', description: 'Coordonnées, horaires et identité', keywords: 'paramètres réglages adresse téléphone horaires réseaux sociaux' }
];

const ADMIN_ROUTE_LABELS = new Map(ADMIN_SEARCH_ITEMS.map(item => [item.path, item.label]));

@Component({
  selector: "app-admin-layout",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="min-h-screen bg-[#121212] text-white flex overflow-hidden font-sans"
    >
      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-50 w-72 bg-[#1a1a1a] border-r border-gray-800 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0"
        [class.-translate-x-full]="!isSidebarOpen()"
      >
        <!-- Logo Area -->
        <div
          class="h-20 flex items-center justify-between px-6 border-b border-gray-800"
        >
          <a
            routerLink="/"
            class="text-jacquier-gold font-serif font-bold text-xl tracking-widest uppercase flex items-center gap-3"
          >
            <div
              class="w-8 h-8 bg-jacquier-gold rounded-full flex items-center justify-center text-[#1a1a1a] font-bold text-lg"
            >
              J
            </div>
            <span>
              <span class="block">Le Jacquier</span>
              <span class="mt-0.5 block font-sans text-[9px] font-bold tracking-[0.14em] text-gray-600">BACK OFFICE</span>
            </span>
          </a>
          <button
            (click)="toggleSidebar()"
            class="lg:hidden text-gray-400 hover:text-white"
            aria-label="Fermer le menu de navigation"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <ul class="space-y-1 px-3">
            <!-- Layer 1: Monitoring -->
            <li>
              <div
                class="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600"
              >
                Monitoring
              </div>
              <a
                routerLink="/admin/dashboard"
                [routerLinkActiveOptions]="{ exact: true }"
                ariaCurrentWhenActive="page"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold shadow-[inset_3px_0_0_rgba(212,175,55,0.9)]"
                class="group flex min-h-[42px] items-center rounded-xl border-l-2 border-transparent px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  ></path>
                </svg>
                Centre de Commande
              </a>
            </li>

            <!-- Layer 2: Opérations -->
            <li class="pt-3">
              <div
                class="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600"
              >
                Opérations
              </div>
              <a
                routerLink="/admin/restaurant"
                ariaCurrentWhenActive="page"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold shadow-[inset_3px_0_0_rgba(212,175,55,0.9)]"
                class="group flex min-h-[42px] items-center rounded-xl border-l-2 border-transparent px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  ></path>
                </svg>
                Restaurant & Menu
              </a>
              <a
                routerLink="/admin/categories"
                ariaCurrentWhenActive="page"
                routerLinkActive="border-jacquier-gold text-jacquier-gold bg-jacquier-gold/5"
                class="ml-9 mt-1 block rounded-lg border-l border-gray-800 px-3 py-2 text-xs text-gray-500 transition-colors hover:border-jacquier-gold/60 hover:bg-gray-800 hover:text-white"
              >
                Catégories du menu
              </a>
              <a
                routerLink="/admin/vins"
                ariaCurrentWhenActive="page"
                routerLinkActive="border-jacquier-gold text-jacquier-gold bg-jacquier-gold/5"
                class="ml-9 mt-1 block rounded-lg border-l border-gray-800 px-3 py-2 text-xs text-gray-500 transition-colors hover:border-jacquier-gold/60 hover:bg-gray-800 hover:text-white"
              >
                Carte des vins
              </a>
              <a
                routerLink="/admin/reservations"
                ariaCurrentWhenActive="page"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold shadow-[inset_3px_0_0_rgba(212,175,55,0.9)]"
                class="group mt-1 flex min-h-[42px] items-center rounded-xl border-l-2 border-transparent px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <span class="min-w-0 flex-1">Réservations</span>
                @if (overview().stats.pendingReservations > 0) {
                  <span class="ml-2 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300">{{ overview().stats.pendingReservations }}</span>
                }
              </a>
              <a
                routerLink="/admin/traiteur"
                ariaCurrentWhenActive="page"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold shadow-[inset_3px_0_0_rgba(212,175,55,0.9)]"
                class="group mt-1 flex min-h-[42px] items-center rounded-xl border-l-2 border-transparent px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                <span class="min-w-0 flex-1">Service Traiteur</span>
                @if (overview().stats.activeCatering > 0) {
                  <span class="ml-2 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-300">{{ overview().stats.activeCatering }}</span>
                }
              </a>
              <a
                routerLink="/admin/ecole"
                ariaCurrentWhenActive="page"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold shadow-[inset_3px_0_0_rgba(212,175,55,0.9)]"
                class="group mt-1 flex min-h-[42px] items-center rounded-xl border-l-2 border-transparent px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  ></path>
                </svg>
                <span class="min-w-0 flex-1">École Gastronomique</span>
                @if (pendingSchoolCount() > 0) {
                  <span class="ml-2 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300">{{ pendingSchoolCount() }}</span>
                }
              </a>
              <a
                routerLink="/admin/stock"
                ariaCurrentWhenActive="page"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold shadow-[inset_3px_0_0_rgba(212,175,55,0.9)]"
                class="group mt-1 flex min-h-[42px] items-center rounded-xl border-l-2 border-transparent px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  ></path>
                </svg>
                Stock & Inventaire
              </a>
            </li>

            <!-- Layer 3: Intelligence -->
            <li class="pt-3">
              <div
                class="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600"
              >
                Intelligence
              </div>
              <a
                routerLink="/admin/finance"
                ariaCurrentWhenActive="page"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold shadow-[inset_3px_0_0_rgba(212,175,55,0.9)]"
                class="group flex min-h-[42px] items-center rounded-xl border-l-2 border-transparent px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
                Finance & BI
              </a>
              <a
                routerLink="/admin/analytics"
                ariaCurrentWhenActive="page"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold shadow-[inset_3px_0_0_rgba(212,175,55,0.9)]"
                class="group mt-1 flex min-h-[42px] items-center rounded-xl border-l-2 border-transparent px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                Analyses Avancées
              </a>
            </li>

            <!-- Layer 4: Administration -->
            <li class="pt-3">
              <div
                class="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600"
              >
                Administration
              </div>
              <a
                routerLink="/admin/equipe"
                ariaCurrentWhenActive="page"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold shadow-[inset_3px_0_0_rgba(212,175,55,0.9)]"
                class="group flex min-h-[42px] items-center rounded-xl border-l-2 border-transparent px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
                Équipe & Personnel
              </a>
              <a
                routerLink="/admin/cms"
                ariaCurrentWhenActive="page"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold shadow-[inset_3px_0_0_rgba(212,175,55,0.9)]"
                class="group mt-1 flex min-h-[42px] items-center rounded-xl border-l-2 border-transparent px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  ></path>
                </svg>
                CMS & Contenu
              </a>
              <a
                routerLink="/admin/galerie"
                ariaCurrentWhenActive="page"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold shadow-[inset_3px_0_0_rgba(212,175,55,0.9)]"
                class="group mt-1 flex min-h-[42px] items-center rounded-xl border-l-2 border-transparent px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                Galerie publique
              </a>
              <a
                routerLink="/admin/settings"
                ariaCurrentWhenActive="page"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold shadow-[inset_3px_0_0_rgba(212,175,55,0.9)]"
                class="group mt-1 flex min-h-[42px] items-center rounded-xl border-l-2 border-transparent px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  ></path>
                </svg>
                Paramètres
              </a>
            </li>
          </ul>
        </nav>

        <!-- User Profile (Bottom Sidebar) -->
        <div class="p-4 border-t border-gray-800">
          <div
            class="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700"
          >
            <div
              class="w-10 h-10 rounded-full bg-jacquier-gold flex items-center justify-center text-[#1a1a1a] font-bold"
            >
              AD
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-white truncate">Administrateur</p>
              <p class="text-xs text-jacquier-gold truncate">{{ adminEmail() || 'Accès sécurisé' }}</p>
            </div>
          </div>
          <button (click)="signOut()" class="mt-3 w-full rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 transition hover:border-jacquier-gold hover:text-jacquier-gold">
            Se déconnecter
          </button>
        </div>
      </aside>

      <!-- Overlay for mobile -->
      @if (isSidebarOpen()) {
        <div
          class="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          (click)="toggleSidebar()"
        ></div>
      }

      <!-- Main Content Area -->
      <div
        class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative"
      >
        <!-- Top Navbar -->
        <header class="relative z-30 border-b border-gray-800 bg-[#121212]/95 backdrop-blur-xl">
          <div class="flex h-20 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div class="flex min-w-0 flex-1 items-center gap-3">
              <button
                type="button"
                (click)="toggleSidebar()"
                class="lg:hidden rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                aria-label="Ouvrir le menu de navigation"
                [attr.aria-expanded]="isSidebarOpen()"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>

              <div class="hidden min-w-0 lg:block">
                <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-600">Administration</p>
                <p class="truncate text-sm font-bold text-white">{{ currentSection() }}</p>
              </div>

              <div class="relative hidden w-full max-w-xl sm:block">
                <div class="flex min-h-[44px] items-center rounded-xl border border-gray-800 bg-[#1a1a1a] px-3 transition-all focus-within:border-jacquier-gold focus-within:ring-1 focus-within:ring-jacquier-gold/40">
                  <svg class="mr-2 h-5 w-5 shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  <input
                    id="admin-global-search"
                    type="search"
                    autocomplete="off"
                    [value]="searchQuery()"
                    (input)="onSearchInput($event)"
                    (focus)="isSearchOpen.set(true)"
                    (keydown)="onSearchKeydown($event)"
                    placeholder="Rechercher un module, une action…"
                    class="w-full border-none bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
                    aria-label="Rechercher dans l’administration"
                    aria-controls="admin-search-results"
                    [attr.aria-expanded]="searchResultsVisible()"
                  />
                  <kbd class="ml-2 hidden rounded border border-gray-700 px-1.5 py-0.5 text-[10px] text-gray-500 xl:inline">/</kbd>
                </div>

                @if (searchResultsVisible()) {
                  <div id="admin-search-results" class="absolute left-0 right-0 top-[calc(100%+0.6rem)] overflow-hidden rounded-2xl border border-gray-700 bg-[#181818] shadow-2xl">
                    @if (searchResults().length) {
                      <div class="max-h-[420px] overflow-y-auto p-2 custom-scrollbar">
                        @for (item of searchResults(); track item.path) {
                          <button type="button" (click)="navigateTo(item.path)"
                            class="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/5 focus:bg-white/5 focus:outline-none">
                            <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-jacquier-gold/10 text-xs font-bold text-jacquier-gold">↗</span>
                            <span class="min-w-0">
                              <span class="block text-sm font-bold text-white">{{ item.label }}</span>
                              <span class="mt-0.5 block text-xs text-gray-500">{{ item.group }} · {{ item.description }}</span>
                            </span>
                          </button>
                        }
                      </div>
                    } @else {
                      <div class="px-5 py-6 text-center">
                        <p class="text-sm font-bold text-white">Aucun résultat</p>
                        <p class="mt-1 text-xs text-gray-500">Essayez “réservation”, “école”, “galerie” ou “paramètres”.</p>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>

            <div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button type="button" (click)="toggleMobileSearch()"
                class="sm:hidden rounded-xl p-2.5 text-gray-400 transition hover:bg-gray-800 hover:text-jacquier-gold"
                aria-label="Ouvrir la recherche"
                [attr.aria-expanded]="mobileSearchOpen()">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>

              <div class="relative">
                <button type="button" (click)="toggleNotifications()"
                  class="relative rounded-xl p-2.5 text-gray-400 transition hover:bg-gray-800 hover:text-jacquier-gold"
                  aria-label="Afficher les notifications"
                  aria-controls="admin-notifications"
                  [attr.aria-expanded]="isNotificationsOpen()">
                  <svg class="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                  @if (notificationCount() > 0) {
                    <span class="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#121212] bg-red-500 px-1 text-[10px] font-bold text-white">
                      {{ notificationCount() > 99 ? '99+' : notificationCount() }}
                    </span>
                  }
                </button>

                @if (isNotificationsOpen()) {
                  <div id="admin-notifications" class="absolute right-0 top-[calc(100%+0.75rem)] w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-gray-700 bg-[#181818] shadow-2xl">
                    <div class="flex items-center justify-between border-b border-gray-800 px-4 py-3">
                      <div>
                        <p class="text-sm font-bold text-white">À traiter</p>
                        <p class="text-xs text-gray-500">Alertes issues des données réelles</p>
                      </div>
                      <button type="button" (click)="loadHeaderData()" [disabled]="notificationsLoading()"
                        class="rounded-lg px-2.5 py-1.5 text-xs font-bold text-jacquier-gold hover:bg-jacquier-gold/10 disabled:opacity-50">
                        {{ notificationsLoading() ? 'Actualisation…' : 'Actualiser' }}
                      </button>
                    </div>

                    <div class="max-h-[420px] overflow-y-auto p-2 custom-scrollbar">
                      @if (notificationError()) {
                        <p class="m-2 rounded-xl bg-red-950/30 px-3 py-3 text-xs text-red-200">{{ notificationError() }}</p>
                      }
                      @if (!notificationsLoading() && notificationItems().length === 0 && !notificationError()) {
                        <div class="px-4 py-8 text-center">
                          <div class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">✓</div>
                          <p class="mt-3 text-sm font-bold text-white">Rien d’urgent</p>
                          <p class="mt-1 text-xs text-gray-500">Aucune action opérationnelle en attente.</p>
                        </div>
                      }
                      @for (item of notificationItems(); track item.id) {
                        <button type="button" (click)="navigateTo(item.path)"
                          class="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/5">
                          <span [class]="notificationToneClass(item.tone)">{{ item.count }}</span>
                          <span class="min-w-0">
                            <span class="block text-sm font-bold text-white">{{ item.label }}</span>
                            <span class="mt-0.5 block text-xs leading-5 text-gray-500">{{ item.detail }}</span>
                          </span>
                        </button>
                      }
                    </div>
                  </div>
                }
              </div>

              <a routerLink="/" target="_blank" rel="noopener"
                class="hidden items-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 lg:flex">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                Voir le site
              </a>

              <div class="relative">
                <button type="button" (click)="toggleUserMenu()"
                  class="flex min-h-[44px] items-center gap-2 rounded-xl border border-gray-800 bg-[#1a1a1a] px-2.5 transition hover:border-gray-700"
                  aria-label="Menu administrateur"
                  aria-controls="admin-user-menu"
                  [attr.aria-expanded]="isUserMenuOpen()">
                  <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-jacquier-gold text-xs font-black text-[#1a1a1a]">{{ adminInitials() }}</span>
                  <span class="hidden max-w-40 text-left xl:block">
                    <span class="block truncate text-xs font-bold text-white">Administrateur</span>
                    <span class="block truncate text-[10px] text-gray-500">{{ adminEmail() || 'Session sécurisée' }}</span>
                  </span>
                  <svg class="hidden h-4 w-4 text-gray-500 xl:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                @if (isUserMenuOpen()) {
                  <div id="admin-user-menu" class="absolute right-0 top-[calc(100%+0.75rem)] w-64 overflow-hidden rounded-2xl border border-gray-700 bg-[#181818] p-2 shadow-2xl">
                    <div class="border-b border-gray-800 px-3 py-3">
                      <p class="text-sm font-bold text-white">Administrateur</p>
                      <p class="mt-1 truncate text-xs text-gray-500">{{ adminEmail() || 'Session Supabase active' }}</p>
                    </div>
                    <button type="button" (click)="navigateTo('/admin/settings')" class="mt-2 w-full rounded-xl px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white">Paramètres</button>
                    <a routerLink="/" target="_blank" rel="noopener" class="block rounded-xl px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white">Voir le site public</a>
                    <button type="button" (click)="signOut()" class="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-bold text-red-300 hover:bg-red-500/10">Se déconnecter</button>
                  </div>
                }
              </div>
            </div>
          </div>

          @if (mobileSearchOpen()) {
            <div class="absolute left-0 right-0 top-full border-b border-gray-800 bg-[#121212] p-3 shadow-2xl sm:hidden">
              <div class="flex min-h-[46px] items-center rounded-xl border border-gray-700 bg-[#1a1a1a] px-3">
                <svg class="mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input type="search" autocomplete="off" [value]="searchQuery()" (input)="onSearchInput($event)" (keydown)="onSearchKeydown($event)"
                  placeholder="Rechercher dans l’administration…" class="w-full border-none bg-transparent text-sm text-white outline-none placeholder:text-gray-500" />
                <button type="button" (click)="closeSearch()" class="rounded-lg p-2 text-gray-500 hover:text-white" aria-label="Fermer la recherche">×</button>
              </div>
              @if (searchQuery().trim()) {
                <div class="mt-2 max-h-[55vh] overflow-y-auto rounded-xl border border-gray-800 bg-[#181818] p-2 custom-scrollbar">
                  @for (item of searchResults(); track item.path) {
                    <button type="button" (click)="navigateTo(item.path)" class="block w-full rounded-lg px-3 py-3 text-left hover:bg-white/5">
                      <span class="block text-sm font-bold text-white">{{ item.label }}</span>
                      <span class="mt-0.5 block text-xs text-gray-500">{{ item.description }}</span>
                    </button>
                  } @empty {
                    <p class="px-3 py-5 text-center text-sm text-gray-500">Aucun résultat.</p>
                  }
                </div>
              }
            </div>
          }
        </header>

        <!-- Page Content -->
        <main class="admin-scroll-area flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 xl:p-10 custom-scrollbar">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .custom-scrollbar,
      .admin-scroll-area,
      :host ::ng-deep .overflow-x-auto,
      :host ::ng-deep .overflow-y-auto {
        scrollbar-width: auto;
        scrollbar-color: rgba(212, 175, 55, 0.78) #1a1a1a;
      }

      .admin-scroll-area {
        scrollbar-gutter: stable;
        overscroll-behavior: contain;
      }

      .custom-scrollbar::-webkit-scrollbar,
      .admin-scroll-area::-webkit-scrollbar,
      :host ::ng-deep .overflow-x-auto::-webkit-scrollbar,
      :host ::ng-deep .overflow-y-auto::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      .custom-scrollbar::-webkit-scrollbar-track,
      .admin-scroll-area::-webkit-scrollbar-track,
      :host ::ng-deep .overflow-x-auto::-webkit-scrollbar-track,
      :host ::ng-deep .overflow-y-auto::-webkit-scrollbar-track {
        background: #1a1a1a;
        border-radius: 999px;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb,
      .admin-scroll-area::-webkit-scrollbar-thumb,
      :host ::ng-deep .overflow-x-auto::-webkit-scrollbar-thumb,
      :host ::ng-deep .overflow-y-auto::-webkit-scrollbar-thumb {
        min-height: 42px;
        background: rgba(212, 175, 55, 0.72);
        border: 2px solid #1a1a1a;
        border-radius: 999px;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb:hover,
      .admin-scroll-area::-webkit-scrollbar-thumb:hover,
      :host ::ng-deep .overflow-x-auto::-webkit-scrollbar-thumb:hover,
      :host ::ng-deep .overflow-y-auto::-webkit-scrollbar-thumb:hover {
        background: #d4af37;
      }

      :host ::ng-deep .overflow-x-auto {
        scrollbar-gutter: stable;
        padding-bottom: 4px;
      }
    `,
  ],
})
export class AdminComponent {
  private readonly adminData = inject(AdminDataService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isSidebarOpen = signal(false);
  readonly searchQuery = signal('');
  readonly isSearchOpen = signal(false);
  readonly mobileSearchOpen = signal(false);
  readonly isNotificationsOpen = signal(false);
  readonly isUserMenuOpen = signal(false);
  readonly notificationsLoading = signal(true);
  readonly notificationError = signal('');
  readonly adminEmail = signal<string | null>(null);
  readonly currentSection = signal('Centre de Commande');
  readonly overview = signal<DashboardOverview>(EMPTY_OVERVIEW);
  readonly schoolRegistrations = signal<SchoolRegistration[]>([]);

  readonly searchResults = computed(() => {
    const query = this.normalize(this.searchQuery());
    if (!query) return [];
    return ADMIN_SEARCH_ITEMS
      .filter(item => this.normalize(`${item.label} ${item.group} ${item.description} ${item.keywords}`).includes(query))
      .slice(0, 8);
  });

  readonly searchResultsVisible = computed(() => this.isSearchOpen() && this.searchQuery().trim().length > 0);

  readonly notificationItems = computed<AdminNotificationItem[]>(() => {
    const items: AdminNotificationItem[] = [];
    const overview = this.overview();
    const pendingSchool = this.schoolRegistrations().filter(item => item.status === 'pending').length;

    if (overview.stats.pendingReservations > 0) {
      items.push({
        id: 'reservations',
        label: 'Réservations en attente',
        detail: 'Des demandes doivent être confirmées ou annulées.',
        path: '/admin/reservations',
        count: overview.stats.pendingReservations,
        tone: 'amber'
      });
    }
    if (overview.stats.activeCatering > 0) {
      items.push({
        id: 'catering',
        label: 'Demandes traiteur à suivre',
        detail: 'Événements en attente ou déjà confirmés à surveiller.',
        path: '/admin/traiteur',
        count: overview.stats.activeCatering,
        tone: 'blue'
      });
    }
    if (pendingSchool > 0) {
      items.push({
        id: 'school',
        label: 'Inscriptions École en attente',
        detail: 'Des participants attendent une décision de l’équipe.',
        path: '/admin/ecole',
        count: pendingSchool,
        tone: 'amber'
      });
    }
    if (overview.readiness.adminPending > 0) {
      items.push({
        id: 'readiness-admin',
        label: 'Pré-livraison : actions admin',
        detail: 'Des éléments techniques ou de contenu peuvent encore être complétés.',
        path: '/admin/dashboard',
        count: overview.readiness.adminPending,
        tone: 'red'
      });
    }
    if (overview.readiness.clientPending > 0) {
      items.push({
        id: 'readiness-client',
        label: 'Informations client attendues',
        detail: 'Des contenus nécessitent encore une validation du restaurant.',
        path: '/admin/dashboard',
        count: overview.readiness.clientPending,
        tone: 'blue'
      });
    }

    return items;
  });

  readonly notificationCount = computed(() =>
    this.notificationItems().reduce((total, item) => total + item.count, 0)
  );

  readonly pendingSchoolCount = computed(() =>
    this.schoolRegistrations().filter(item => item.status === 'pending').length
  );

  readonly adminInitials = computed(() => {
    const email = this.adminEmail();
    if (!email) return 'AD';
    const local = email.split('@')[0] || '';
    const parts = local.split(/[._-]+/).filter(Boolean);
    const initials = parts.slice(0, 2).map(part => part[0]?.toUpperCase()).join('');
    return initials || local.slice(0, 2).toUpperCase() || 'AD';
  });

  constructor(private readonly auth: AdminAuthService, private readonly router: Router) {
    this.currentSection.set(this.sectionForUrl(this.router.url));

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => {
        this.currentSection.set(this.sectionForUrl(event.urlAfterRedirects));
        this.isSidebarOpen.set(false);
        this.isSearchOpen.set(false);
        this.mobileSearchOpen.set(false);
        this.isNotificationsOpen.set(false);
        this.isUserMenuOpen.set(false);
      });

    void this.loadAdminIdentity();
    void this.loadHeaderData();
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(value => !value);
  }

  toggleMobileSearch(): void {
    this.mobileSearchOpen.update(value => !value);
    this.isNotificationsOpen.set(false);
    this.isUserMenuOpen.set(false);
  }

  toggleNotifications(): void {
    this.isNotificationsOpen.update(value => !value);
    this.isUserMenuOpen.set(false);
    this.isSearchOpen.set(false);
    this.mobileSearchOpen.set(false);
    if (this.isNotificationsOpen()) void this.loadHeaderData();
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update(value => !value);
    this.isNotificationsOpen.set(false);
    this.isSearchOpen.set(false);
    this.mobileSearchOpen.set(false);
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value ?? '';
    this.searchQuery.set(value);
    this.isSearchOpen.set(true);
    this.isNotificationsOpen.set(false);
    this.isUserMenuOpen.set(false);
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeSearch();
      return;
    }
    if (event.key === 'Enter' && this.searchResults().length) {
      event.preventDefault();
      void this.navigateTo(this.searchResults()[0].path);
    }
  }

  closeSearch(): void {
    this.searchQuery.set('');
    this.isSearchOpen.set(false);
    this.mobileSearchOpen.set(false);
  }

  async navigateTo(path: string): Promise<void> {
    this.searchQuery.set('');
    await this.router.navigateByUrl(path);
  }

  async loadHeaderData(): Promise<void> {
    this.notificationsLoading.set(true);
    this.notificationError.set('');

    const [overviewResult, schoolResult] = await Promise.allSettled([
      this.adminData.getDashboardOverview(),
      this.adminData.getSchoolRegistrations()
    ]);

    if (overviewResult.status === 'fulfilled') this.overview.set(overviewResult.value);
    if (schoolResult.status === 'fulfilled') this.schoolRegistrations.set(schoolResult.value);

    if (overviewResult.status === 'rejected' || schoolResult.status === 'rejected') {
      this.notificationError.set('Certaines alertes n’ont pas pu être actualisées.');
    }
    this.notificationsLoading.set(false);
  }

  notificationToneClass(tone: AdminNotificationItem['tone']): string {
    if (tone === 'red') return 'flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 px-2 text-xs font-bold text-red-300';
    if (tone === 'blue') return 'flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 px-2 text-xs font-bold text-blue-300';
    return 'flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 px-2 text-xs font-bold text-amber-300';
  }

  @HostListener('document:keydown', ['$event'])
  onGlobalKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const editing = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;

    if (event.key === '/' && !editing) {
      event.preventDefault();
      this.isSearchOpen.set(true);
      this.isNotificationsOpen.set(false);
      this.isUserMenuOpen.set(false);
      document.getElementById('admin-global-search')?.focus();
    }

    if (event.key === 'Escape') {
      this.isSearchOpen.set(false);
      this.mobileSearchOpen.set(false);
      this.isNotificationsOpen.set(false);
      this.isUserMenuOpen.set(false);
    }
  }

  async signOut(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigateByUrl('/admin/login');
  }

  private async loadAdminIdentity(): Promise<void> {
    this.adminEmail.set(await this.auth.getCurrentUserEmail());
  }

  private sectionForUrl(url: string): string {
    const path = url.split('?')[0]?.split('#')[0] || '/admin/dashboard';
    return ADMIN_ROUTE_LABELS.get(path) || 'Administration';
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
