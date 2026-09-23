import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminDataService, DashboardOverview } from '../../../core/services/admin-data.service';

const EMPTY_OVERVIEW: DashboardOverview = {
  stats: { todayReservations: 0, pendingReservations: 0, todayRevenue: 0, monthlyRevenue: 0, activeMenuItems: 0, activeCatering: 0 },
  revenueChart: [],
  recentActivities: [],
  readiness: { completed: 0, total: 9, percent: 0, adminPending: 0, clientPending: 0, checks: [] }
};

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 animate-fade-in pb-12">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-3xl font-serif font-bold text-white">Centre de Commande</h1>
          <p class="mt-2 text-sm text-gray-400">Données opérationnelles réelles du restaurant.</p>
        </div>
        <button type="button" (click)="load()" [disabled]="loading()" class="self-start rounded-xl border border-gray-700 px-4 py-2 text-sm font-bold text-gray-200 transition hover:border-jacquier-gold hover:text-jacquier-gold disabled:opacity-50">
          {{ loading() ? 'Actualisation…' : 'Actualiser' }}
        </button>
      </header>

      @if (errorMessage()) {
        <div role="alert" class="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">
          {{ errorMessage() }} <button type="button" (click)="load()" class="ml-2 font-bold underline">Réessayer</button>
        </div>
      }

      @if (loading()) {
        <div class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-12 text-center text-gray-400" role="status">Chargement du tableau de bord…</div>
      } @else {
        <section class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          @for (stat of statCards(); track stat.label) {
            <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6">
              <p class="text-xs font-bold uppercase tracking-widest text-gray-500">{{ stat.label }}</p>
              <p class="mt-3 text-3xl font-serif font-bold text-white">{{ stat.value }}</p>
              <p class="mt-2 text-xs text-gray-400">{{ stat.description }}</p>
            </article>
          }
        </section>

        <section class="rounded-2xl border border-jacquier-gold/30 bg-[#171717] p-6 md:p-8">
          <div class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-jacquier-gold">Pré-livraison</p>
              <h2 class="mt-1 text-2xl font-serif font-bold text-white">Préparation à la livraison</h2>
              <p class="mt-2 text-sm text-gray-400">Ce score repose uniquement sur les contenus réellement disponibles et configurés.</p>
            </div>
            <div class="text-left md:text-right">
              <p class="text-4xl font-bold text-white">{{ overview().readiness.percent }}%</p>
              <p class="text-xs text-gray-500">{{ overview().readiness.completed }}/{{ overview().readiness.total }} contrôles prêts</p>
            </div>
          </div>

          <div class="mt-5 flex flex-wrap items-center gap-2">
            <span class="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
              {{ overview().readiness.completed }} prêt(s)
            </span>
            <span class="rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-300">
              {{ overview().readiness.adminPending }} action(s) admin
            </span>
            <span class="rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300">
              {{ overview().readiness.clientPending }} information(s) client
            </span>
            @if (overview().readiness.clientPending > 0) {
              <button type="button" (click)="copyClientRequest()"
                class="rounded-full border border-jacquier-gold/40 px-3 py-1.5 text-xs font-bold text-jacquier-gold transition hover:bg-jacquier-gold hover:text-jacquier-dark">
                Copier la liste à demander
              </button>
            }
            @if (copyFeedback()) {
              <span class="text-xs text-emerald-300" role="status">{{ copyFeedback() }}</span>
            }
          </div>

          <div class="mt-6 h-2 overflow-hidden rounded-full bg-gray-800">
            <div class="h-full rounded-full bg-jacquier-gold transition-all duration-700" [style.width.%]="overview().readiness.percent"></div>
          </div>

          <div class="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            @for (check of overview().readiness.checks; track check.key) {
              <article [class]="check.complete
                ? 'rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4'
                : 'rounded-xl border border-amber-500/20 bg-amber-500/5 p-4'">
                <div class="flex items-start gap-3">
                  <span [class]="check.complete
                    ? 'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-300'
                    : 'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-xs font-bold text-amber-300'">
                    {{ check.complete ? '✓' : '!' }}
                  </span>
                  <div>
                    <p class="text-sm font-bold text-white">{{ check.label }}</p>
                    <p class="mt-1 text-xs text-gray-400">{{ check.detail }}</p>
                    @if (!check.complete) {
                      <p class="mt-2 text-xs leading-relaxed" [class.text-blue-300]="check.owner === 'admin'" [class.text-amber-300]="check.owner === 'client'">
                        {{ check.owner === 'admin' ? 'Action admin' : 'Information client' }} · {{ check.nextAction }}
                      </p>
                      <a [routerLink]="readinessPath(check.key)" class="mt-3 inline-flex text-xs font-bold text-jacquier-gold hover:text-white">
                        {{ check.owner === 'admin' ? 'Corriger maintenant →' : 'Préparer l’écran →' }}
                      </a>
                    }
                  </div>
                </div>
              </article>
            }
          </div>
        </section>

        <section class="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <article class="lg:col-span-2 rounded-2xl border border-gray-800 bg-[#1a1a1a] p-8">
            <h2 class="text-xl font-serif font-bold text-white">Revenus enregistrés</h2>
            <p class="mt-1 text-xs uppercase tracking-widest text-gray-500">Rapports de clôture disponibles</p>
            @if (overview().revenueChart.length) {
              <div class="mt-8 flex h-64 items-end gap-4">
                @for (point of overview().revenueChart; track point.month) {
                  <div class="flex flex-1 flex-col items-center gap-3">
                    <span class="text-xs text-gray-400">{{ formatCurrency(point.total) }}</span>
                    <div class="w-full rounded-t-lg bg-jacquier-gold/20" [style.height.%]="chartHeight(point.total)">
                      <div class="h-1 w-full bg-jacquier-gold"></div>
                    </div>
                    <span class="text-xs font-bold uppercase text-gray-500">{{ point.month }}</span>
                  </div>
                }
              </div>
            } @else {
              <p class="py-16 text-center text-gray-400">Aucun rapport financier disponible pour le moment.</p>
            }
          </article>

          <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a]">
            <div class="border-b border-gray-800 p-6"><h2 class="text-lg font-serif font-bold text-white">Activité récente</h2></div>
            <div class="space-y-5 p-6">
              @for (activity of overview().recentActivities; track activity.id) {
                <div class="border-l-2 border-jacquier-gold pl-4">
                  <p class="text-sm font-bold text-white">{{ activity.type }}</p>
                  <p class="mt-1 text-xs text-gray-400">{{ activity.message || 'Aucun détail disponible.' }}</p>
                  <p class="mt-1 text-[10px] uppercase text-gray-600">{{ activity.date }}</p>
                </div>
              } @empty {
                <p class="text-sm text-gray-400">Aucune activité enregistrée.</p>
              }
            </div>
          </article>
        </section>
      }
    </div>
  `,
  styles: [`.animate-fade-in { animation: fadeIn .6s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`]
})
export class DashboardComponent {
  private readonly adminData = inject(AdminDataService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly overview = signal<DashboardOverview>(EMPTY_OVERVIEW);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly copyFeedback = signal('');
  readonly maximumRevenue = computed(() => Math.max(...this.overview().revenueChart.map(({ total }) => total), 1));
  readonly statCards = computed(() => {
    const stats = this.overview().stats;
    return [
      { label: 'CA aujourd’hui', value: this.formatCurrency(stats.todayRevenue), description: 'Rapports de clôture du jour' },
      { label: 'Réservations du jour', value: String(stats.todayReservations), description: `${stats.pendingReservations} en attente` },
      { label: 'CA mensuel', value: this.formatCurrency(stats.monthlyRevenue), description: 'Mois en cours' },
      { label: 'Articles actifs', value: String(stats.activeMenuItems), description: 'À la carte' },
      { label: 'Événements traiteur', value: String(stats.activeCatering), description: 'En attente ou confirmés' }
    ];
  });

  constructor() { void this.load(); }

  async load(): Promise<void> {
    this.loading.set(true); this.errorMessage.set('');
    try { this.overview.set(await this.adminData.getDashboardOverview()); }
    catch { this.errorMessage.set('Impossible de charger le tableau de bord. Vérifiez votre session administrateur puis réessayez.'); }
    finally { this.loading.set(false); }
  }

  async copyClientRequest(): Promise<void> {
    const pending = this.overview().readiness.checks.filter(check => !check.complete && check.owner === 'client');
    if (!pending.length) {
      this.copyFeedback.set('Aucune information client manquante.');
      return;
    }

    const message = [
      'Bonjour,',
      '',
      'Pour finaliser le site Le Jacquier avant livraison, merci de nous confirmer ou transmettre les éléments suivants :',
      ...pending.map(check => `- ${check.label} : ${check.nextAction}`),
      '',
      'Dès réception, ces éléments pourront être intégrés dans l’administration du site.'
    ].join('\n');

    if (!isPlatformBrowser(this.platformId) || !navigator.clipboard) {
      this.copyFeedback.set('Copie indisponible sur cet appareil.');
      return;
    }

    try {
      await navigator.clipboard.writeText(message);
      this.copyFeedback.set('Liste copiée.');
      window.setTimeout(() => this.copyFeedback.set(''), 2500);
    } catch {
      this.copyFeedback.set('Copie impossible. Réessayez.');
    }
  }

  readinessPath(key: DashboardOverview['readiness']['checks'][number]['key']): string {
    const paths = {
      settings: '/admin/settings',
      menu: '/admin/restaurant',
      wines: '/admin/vins',
      team: '/admin/equipe',
      gallery: '/admin/galerie',
      school: '/admin/ecole',
      hours: '/admin/settings',
      social: '/admin/settings',
      legal: '/admin/settings'
    } as const;
    return paths[key];
  }

  chartHeight(total: number): number { return Math.max(4, Math.round((total / this.maximumRevenue()) * 100)); }
  formatCurrency(value: number): string { return new Intl.NumberFormat('fr-GN', { style: 'currency', currency: 'GNF', maximumFractionDigits: 0 }).format(value); }
}
