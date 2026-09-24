import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminDataService, DashboardOverview } from '../../../core/services/admin-data.service';

const EMPTY_OVERVIEW: DashboardOverview = {
  stats: { todayReservations: 0, pendingReservations: 0, pendingSchoolRegistrations: 0, todayRevenue: 0, monthlyRevenue: 0, activeMenuItems: 0, activeCatering: 0 },
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
      <header class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-jacquier-gold">Vue opérationnelle</p>
          <h1 class="mt-1 text-3xl font-serif font-bold text-white">Centre de Commande</h1>
          <p class="mt-2 text-sm text-gray-400">Les données utiles pour piloter le restaurant et préparer la livraison.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <a routerLink="/admin/reservations" class="rounded-xl border border-gray-800 bg-[#1a1a1a] px-3 py-2 text-xs font-bold text-gray-300 transition hover:border-jacquier-gold/60 hover:text-white">
            Réservations
          </a>
          <a routerLink="/admin/traiteur" class="rounded-xl border border-gray-800 bg-[#1a1a1a] px-3 py-2 text-xs font-bold text-gray-300 transition hover:border-jacquier-gold/60 hover:text-white">
            Traiteur
          </a>
          <a routerLink="/admin/ecole" class="rounded-xl border border-gray-800 bg-[#1a1a1a] px-3 py-2 text-xs font-bold text-gray-300 transition hover:border-jacquier-gold/60 hover:text-white">
            École
          </a>
          <button type="button" (click)="load()" [disabled]="loading()" class="rounded-xl border border-jacquier-gold/40 px-3 py-2 text-xs font-bold text-jacquier-gold transition hover:bg-jacquier-gold hover:text-jacquier-dark disabled:opacity-50">
            {{ loading() ? 'Actualisation…' : 'Actualiser' }}
          </button>
        </div>
      </header>

      @if (errorMessage()) {
        <div role="alert" class="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">
          {{ errorMessage() }} <button type="button" (click)="load()" class="ml-2 font-bold underline">Réessayer</button>
        </div>
      }

      @if (loading()) {
        <div class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-12 text-center text-gray-400" role="status">Chargement du tableau de bord…</div>
      } @else {
        <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          @for (stat of statCards(); track stat.label) {
            <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
              <p class="text-xs font-bold uppercase tracking-widest text-gray-500">{{ stat.label }}</p>
              <p class="mt-3 text-3xl font-serif font-bold text-white">{{ stat.value }}</p>
              <p class="mt-2 text-xs text-gray-400">{{ stat.description }}</p>
            </article>
          }
        </section>

        <section aria-labelledby="admin-priority-actions" class="rounded-2xl border border-gray-800 bg-[#161616] p-5 sm:p-6">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-jacquier-gold">Priorités</p>
              <h2 id="admin-priority-actions" class="mt-1 text-xl font-serif font-bold text-white">À traiter maintenant</h2>
              <p class="mt-1 text-xs text-gray-500">Uniquement les éléments qui demandent encore une action.</p>
            </div>
            @if (priorityActions().length) {
              <span class="self-start rounded-full bg-jacquier-gold/10 px-3 py-1.5 text-xs font-bold text-jacquier-gold">
                {{ priorityActions().length }} priorité(s)
              </span>
            }
          </div>

          @if (priorityActions().length) {
            <div class="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              @for (action of priorityActions(); track action.id) {
                <a [routerLink]="action.path"
                  class="group rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.03]"
                  [class.border-red-500/30]="action.tone === 'red'"
                  [class.border-amber-500/30]="action.tone === 'amber'"
                  [class.border-blue-500/30]="action.tone === 'blue'">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="text-sm font-bold text-white">{{ action.label }}</p>
                      <p class="mt-1 text-xs leading-5 text-gray-400">{{ action.detail }}</p>
                    </div>
                    <span [class]="priorityBadgeClass(action.tone)">{{ action.count }}</span>
                  </div>
                  <p class="mt-3 text-xs font-bold text-jacquier-gold group-hover:text-white">Ouvrir le module →</p>
                </a>
              }
            </div>
          } @else {
            <div class="mt-5 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-4">
              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">✓</span>
              <div>
                <p class="text-sm font-bold text-white">Aucune action opérationnelle urgente</p>
                <p class="mt-0.5 text-xs text-gray-500">Les files Réservations, Traiteur et École sont à jour.</p>
              </div>
            </div>
          }
        </section>

        <section aria-labelledby="admin-quick-actions" class="rounded-2xl border border-gray-800 bg-[#161616] p-4 sm:p-5">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 id="admin-quick-actions" class="text-sm font-bold text-white">Actions rapides</h2>
              <p class="mt-1 text-xs text-gray-500">Accès direct aux tâches fréquentes sans repasser par toute la navigation.</p>
            </div>
            <div class="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              @for (action of quickActions; track action.path) {
                <a [routerLink]="action.path"
                  class="group flex min-h-[44px] items-center gap-2 rounded-xl border border-gray-800 bg-[#1a1a1a] px-3 py-2.5 text-xs font-bold text-gray-300 transition hover:border-jacquier-gold/50 hover:text-white">
                  <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-[11px] text-jacquier-gold transition group-hover:bg-jacquier-gold/10">{{ action.short }}</span>
                  <span>{{ action.label }}</span>
                </a>
              }
            </div>
          </div>
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

          @if (pendingReadinessChecks().length) {
            <div class="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              @for (check of pendingReadinessChecks(); track check.key) {
                <article class="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <div class="flex items-start gap-3">
                    <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-xs font-bold text-amber-300">!</span>
                    <div>
                      <p class="text-sm font-bold text-white">{{ check.label }}</p>
                      <p class="mt-1 text-xs text-gray-400">{{ check.detail }}</p>
                      <p class="mt-2 text-xs leading-relaxed" [class.text-blue-300]="check.owner === 'admin'" [class.text-amber-300]="check.owner === 'client'">
                        {{ check.owner === 'admin' ? 'Action admin' : 'Information client' }} · {{ check.nextAction }}
                      </p>
                      <a [routerLink]="readinessPath(check.key)" class="mt-3 inline-flex text-xs font-bold text-jacquier-gold hover:text-white">
                        {{ check.owner === 'admin' ? 'Corriger maintenant →' : 'Préparer l’écran →' }}
                      </a>
                    </div>
                  </div>
                </article>
              }
            </div>
          } @else {
            <div class="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-4 text-sm text-emerald-200">
              Tous les contrôles de pré-livraison sont validés.
            </div>
          }
        </section>

        <section class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          @if (overview().revenueChart.length) {
            <article class="lg:col-span-2 rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6 md:p-8">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h2 class="text-xl font-serif font-bold text-white">Revenus enregistrés</h2>
                  <p class="mt-1 text-xs uppercase tracking-widest text-gray-500">Rapports de clôture disponibles</p>
                </div>
                <a routerLink="/admin/finance" class="text-xs font-bold text-jacquier-gold hover:text-white">Finance →</a>
              </div>
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
            </article>
          } @else {
            <article class="lg:col-span-2 rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6">
              <p class="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">Finance</p>
              <h2 class="mt-2 text-lg font-serif font-bold text-white">Aucune clôture financière enregistrée</h2>
              <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                Le graphique reste volontairement masqué tant qu’aucune donnée réelle n’alimente les rapports. Enregistrez une clôture lorsque le restaurant commencera à utiliser ce module.
              </p>
              <a routerLink="/admin/finance" class="mt-4 inline-flex text-xs font-bold text-jacquier-gold hover:text-white">Ouvrir Finance →</a>
            </article>
          }

          <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a]">
            <div class="flex items-center justify-between border-b border-gray-800 p-5">
              <div>
                <h2 class="text-lg font-serif font-bold text-white">Activité récente</h2>
                <p class="mt-1 text-xs text-gray-500">Dernières actions administratives utiles</p>
              </div>
            </div>
            <div class="divide-y divide-gray-800/70">
              @for (activity of overview().recentActivities; track activity.id) {
                <div class="p-5">
                  <div class="flex items-start gap-3">
                    <span class="mt-0.5 rounded-lg bg-jacquier-gold/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-jacquier-gold">{{ activity.type }}</span>
                    <div class="min-w-0">
                      <p class="text-sm leading-5 text-gray-300">{{ activity.message || 'Action enregistrée.' }}</p>
                      <p class="mt-1 text-[10px] uppercase tracking-wide text-gray-600">{{ formatActivityDate(activity.date) }}</p>
                    </div>
                  </div>
                </div>
              } @empty {
                <div class="p-6 text-center">
                  <p class="text-sm font-bold text-white">Aucune activité récente</p>
                  <p class="mt-1 text-xs text-gray-500">Les prochaines actions administratives apparaîtront ici.</p>
                </div>
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
  readonly quickActions = [
    { label: 'Carte', short: 'M', path: '/admin/restaurant' },
    { label: 'Galerie', short: 'G', path: '/admin/galerie' },
    { label: 'Équipe', short: 'E', path: '/admin/equipe' },
    { label: 'Paramètres', short: 'P', path: '/admin/settings' }
  ] as const;
  readonly maximumRevenue = computed(() => Math.max(...this.overview().revenueChart.map(({ total }) => total), 1));
  readonly pendingReadinessChecks = computed(() => this.overview().readiness.checks.filter(check => !check.complete));
  readonly priorityActions = computed(() => {
    const stats = this.overview().stats;
    const readiness = this.overview().readiness;
    const actions: Array<{ id: string; label: string; detail: string; path: string; count: number; tone: 'red' | 'amber' | 'blue' }> = [];

    if (stats.pendingReservations > 0) {
      actions.push({ id: 'reservations', label: 'Réservations en attente', detail: 'Des demandes attendent une confirmation ou une annulation.', path: '/admin/reservations', count: stats.pendingReservations, tone: 'red' });
    }
    if (stats.activeCatering > 0) {
      actions.push({ id: 'catering', label: 'Dossiers Traiteur actifs', detail: 'Des demandes sont encore en cours de traitement.', path: '/admin/traiteur', count: stats.activeCatering, tone: 'amber' });
    }
    if (stats.pendingSchoolRegistrations > 0) {
      actions.push({ id: 'school', label: 'Inscriptions École à confirmer', detail: 'Des participants attendent une décision du restaurant.', path: '/admin/ecole', count: stats.pendingSchoolRegistrations, tone: 'amber' });
    }
    if (readiness.adminPending > 0) {
      actions.push({ id: 'readiness-admin', label: 'Corrections pré-livraison', detail: 'Des actions peuvent encore être réalisées côté administration.', path: '/admin/dashboard', count: readiness.adminPending, tone: 'blue' });
    }
    if (readiness.clientPending > 0) {
      actions.push({ id: 'readiness-client', label: 'Validations restaurant attendues', detail: 'Des informations doivent encore être confirmées par le restaurant.', path: '/admin/dashboard', count: readiness.clientPending, tone: 'blue' });
    }

    return actions;
  });
  readonly statCards = computed(() => {
    const stats = this.overview().stats;
    return [
      { label: 'CA aujourd’hui', value: this.formatCurrency(stats.todayRevenue), description: 'Rapports de clôture du jour' },
      { label: 'Réservations du jour', value: String(stats.todayReservations), description: `${stats.pendingReservations} en attente` },
      { label: 'CA mensuel', value: this.formatCurrency(stats.monthlyRevenue), description: 'Mois en cours' },
      { label: 'Articles actifs', value: String(stats.activeMenuItems), description: 'À la carte' },
      { label: 'Événements traiteur', value: String(stats.activeCatering), description: 'Dossiers encore actifs' }
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

  priorityBadgeClass(tone: 'red' | 'amber' | 'blue'): string {
    if (tone === 'red') return 'shrink-0 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-300';
    if (tone === 'blue') return 'shrink-0 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-300';
    return 'shrink-0 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-300';
  }

  formatActivityDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Date inconnue';
    return new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Africa/Conakry',
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date);
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
