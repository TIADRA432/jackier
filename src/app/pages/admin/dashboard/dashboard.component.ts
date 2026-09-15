import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService, DashboardOverview } from '../../../core/services/admin-data.service';

const EMPTY_OVERVIEW: DashboardOverview = {
  stats: { todayReservations: 0, pendingReservations: 0, todayRevenue: 0, monthlyRevenue: 0, activeMenuItems: 0, activeCatering: 0 },
  revenueChart: [],
  recentActivities: []
};

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
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

  readonly overview = signal<DashboardOverview>(EMPTY_OVERVIEW);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
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

  chartHeight(total: number): number { return Math.max(4, Math.round((total / this.maximumRevenue()) * 100)); }
  formatCurrency(value: number): string { return new Intl.NumberFormat('fr-GN', { style: 'currency', currency: 'GNF', maximumFractionDigits: 0 }).format(value); }
}
