import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService } from '../../core/services/dashboard.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule],
  template: `
    <div class="dashboard-container">
      <h1 class="mat-h1">Tableau de Bord</h1>
      
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Réservations</mat-card-title>
            <mat-icon mat-card-avatar color="primary">event</mat-icon>
          </mat-card-header>
          <mat-card-content>
            <h2 class="stat-value">{{ stats?.totalReservations || 0 }}</h2>
            <p>Total Réservations</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Revenus (Aujourd'hui)</mat-card-title>
            <mat-icon mat-card-avatar color="accent">attach_money</mat-icon>
          </mat-card-header>
          <mat-card-content>
            <h2 class="stat-value">{{ stats?.todayRevenue | currency:'EUR' }}</h2>
            <p>Revenus du jour</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Traiteur</mat-card-title>
            <mat-icon mat-card-avatar color="warn">room_service</mat-icon>
          </mat-card-header>
          <mat-card-content>
            <h2 class="stat-value">{{ stats?.cateringOrders || 0 }}</h2>
            <p>Commandes en cours</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>École</mat-card-title>
            <mat-icon mat-card-avatar>school</mat-icon>
          </mat-card-header>
          <mat-card-content>
            <h2 class="stat-value">{{ stats?.activePrograms || 0 }}</h2>
            <p>Programmes actifs</p>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="charts-container">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Revenus Mensuels</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas id="revenueChart"></canvas>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Activité Récente</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <ul class="activity-list">
              <li *ngFor="let item of recentActivity">
                <span class="activity-date">{{ item.createdAt?.toDate() | date:'short' }}</span>
                <span class="activity-desc">{{ item.type === 'reservation' ? 'Nouvelle réservation de ' + item.name : 'Commande traiteur' }}</span>
              </li>
            </ul>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      padding: 10px;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      margin: 10px 0;
    }
    .charts-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
    }
    .chart-card {
      min-height: 300px;
    }
    .activity-list {
      list-style: none;
      padding: 0;
    }
    .activity-list li {
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    .activity-date {
      color: #888;
      margin-right: 10px;
      font-size: 0.9em;
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private dashboardService = inject(DashboardService);
  stats: any;
  recentActivity: any[] = [];

  ngOnInit() {
    this.loadStats();
    this.loadActivity();
  }

  ngAfterViewInit() {
    this.initChart();
  }

  loadStats() {
    this.dashboardService.getStats().subscribe(data => {
      this.stats = data;
    });
  }

  loadActivity() {
    this.dashboardService.getRecentActivity().subscribe(data => {
      this.recentActivity = data;
    });
  }

  initChart() {
    // Mock chart data for now
    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (!ctx) return;
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Revenus (€)',
          data: [12000, 19000, 3000, 5000, 2000, 3000],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
