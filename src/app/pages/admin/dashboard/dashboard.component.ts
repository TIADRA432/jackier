import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService } from '../../../core/services/dashboard.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 bg-gray-900 min-h-screen">
      <div class="mb-8">
        <h1 class="text-3xl font-serif font-bold text-jacquier-gold">Tableau de Bord</h1>
        <p class="text-gray-400">Aperçu de l'activité du restaurant</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" *ngIf="overview()">
        <!-- Réservations -->
        <div class="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg hover:border-jacquier-gold transition-all">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <mat-icon class="text-blue-500">event</mat-icon>
            </div>
            <span class="text-xs font-bold text-blue-500 uppercase tracking-wider">Aujourd'hui</span>
          </div>
          <h3 class="text-gray-400 text-sm font-medium mb-1">Réservations</h3>
          <div class="text-3xl font-bold text-white">{{ overview()?.stats?.todayReservations || 0 }}</div>
        </div>

        <!-- Revenus -->
        <div class="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg hover:border-jacquier-gold transition-all">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <mat-icon class="text-green-500">payments</mat-icon>
            </div>
            <span class="text-xs font-bold text-green-500 uppercase tracking-wider">Aujourd'hui</span>
          </div>
          <h3 class="text-gray-400 text-sm font-medium mb-1">Revenus</h3>
          <div class="text-3xl font-bold text-white">{{ overview()?.stats?.todayRevenue || 0 | number:'1.0-0' }} FG</div>
        </div>

        <!-- Plats -->
        <div class="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg hover:border-jacquier-gold transition-all">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
              <mat-icon class="text-orange-500">restaurant_menu</mat-icon>
            </div>
            <span class="text-xs font-bold text-orange-500 uppercase tracking-wider">Menu</span>
          </div>
          <h3 class="text-gray-400 text-sm font-medium mb-1">Plats Actifs</h3>
          <div class="text-3xl font-bold text-white">{{ overview()?.stats?.activeMenuItems || 0 }}</div>
        </div>

        <!-- Traiteur -->
        <div class="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg hover:border-jacquier-gold transition-all">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <mat-icon class="text-purple-500">catering</mat-icon>
            </div>
            <span class="text-xs font-bold text-purple-500 uppercase tracking-wider">En cours</span>
          </div>
          <h3 class="text-gray-400 text-sm font-medium mb-1">Commandes Traiteur</h3>
          <div class="text-3xl font-bold text-white">{{ overview()?.stats?.activeCatering || 0 }}</div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8" *ngIf="overview()">
        <div class="bg-gray-800 border border-gray-700 rounded-2xl p-8">
          <h3 class="text-xl font-serif font-bold text-white mb-6">Dernières Activités</h3>
          <div class="space-y-4">
            <div *ngFor="let activity of overview()?.recentActivities" class="flex items-start space-x-4">
              <div class="w-2 h-2 mt-2 rounded-full bg-jacquier-gold"></div>
              <div>
                <p class="text-gray-300">{{ activity.message }}</p>
                <p class="text-xs text-gray-500">{{ activity.date | date:'short' }}</p>
              </div>
            </div>
            <p *ngIf="!overview()?.recentActivities?.length" class="text-gray-500 italic">Aucune activité récente</p>
          </div>
        </div>
        <div class="bg-gray-800 border border-gray-700 rounded-2xl p-8">
          <h3 class="text-xl font-serif font-bold text-white mb-6">Alertes Stock</h3>
          <div class="space-y-4">
            <p class="text-gray-500 italic">Tout est en ordre</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  private dashboardService = inject(DashboardService);
  overview = toSignal(this.dashboardService.getDashboard(), { initialValue: null });
}
