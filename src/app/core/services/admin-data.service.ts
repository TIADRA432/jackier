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

export interface CateringEvent {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  eventType?: string;
  date?: string;
  guests?: number | string;
  budget?: string | number;
  message?: string;
  status: ReservationStatus;
}

export interface SchoolProgram {
  id: string;
  title?: string;
  description?: string;
  duration?: string;
  level?: string;
}

export interface MenuItem {
  id: string;
  name?: string;
  category?: string;
  price?: number | string;
  imageUrl?: string;
  image?: string;
  description?: string;
  active?: boolean;
  displayOrder?: number;
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

  async getCateringEvents(): Promise<CateringEvent[]> {
    return firstValueFrom(this.http.get<CateringEvent[]>(`${this.apiUrl}/catering`));
  }

  async updateCateringStatus(id: string, status: ReservationStatus): Promise<CateringEvent> {
    return firstValueFrom(this.http.put<CateringEvent>(`${this.apiUrl}/catering/${id}`, { status }));
  }

  async getSchoolPrograms(): Promise<SchoolProgram[]> {
    return firstValueFrom(this.http.get<SchoolProgram[]>(`${this.apiUrl}/school`));
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return firstValueFrom(this.http.get<MenuItem[]>(`${this.apiUrl}/admin/menu`));
  }

  async updateMenuItem(id: string, payload: { active: boolean }): Promise<MenuItem> {
    return firstValueFrom(this.http.put<MenuItem>(`${this.apiUrl}/menu/${id}`, payload));
  }

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<AdminReservation> {
    return firstValueFrom(this.http.put<AdminReservation>(`${this.apiUrl}/reservations/${id}/status`, { status }));
  }
}
