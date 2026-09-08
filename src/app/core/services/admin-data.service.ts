import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'approved' | 'rejected';

export interface AdminReservation {
  id: string;
  name: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status: ReservationStatus;
}

export interface DashboardOverview {
  stats: {
    todayReservations: number;
    pendingReservations: number;
    todayRevenue: number;
    monthlyRevenue: number;
    activeMenuItems: number;
    activeCatering: number;
  };
  revenueChart: Array<{ month: string; total: number }>;
  recentActivities: Array<{ id: string; type: string; message: string; date: string }>;
}

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  async getReservations(): Promise<AdminReservation[]> {
    return firstValueFrom(this.http.get<AdminReservation[]>(`${this.apiUrl}/reservations`));
  }

  async getDashboardOverview(): Promise<DashboardOverview> {
    return firstValueFrom(this.http.get<DashboardOverview>(`${this.apiUrl}/dashboard/overview`));
  }

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<AdminReservation> {
    return firstValueFrom(this.http.put<AdminReservation>(`${this.apiUrl}/reservations/${id}/status`, { status }));
  }
}
