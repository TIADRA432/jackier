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

export interface MenuCategory {
  id: string;
  name: string;
  order?: number;
}

export interface WineItem {
  id: string;
  name: string;
  description?: string;
  priceBottle: number;
  priceGlass?: number;
  imageUrl?: string;
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

  async getCategories(): Promise<MenuCategory[]> {
    return firstValueFrom(this.http.get<MenuCategory[]>(`${this.apiUrl}/categories`));
  }

  async createCategory(payload: Omit<MenuCategory, 'id'>): Promise<MenuCategory> {
    return firstValueFrom(this.http.post<MenuCategory>(`${this.apiUrl}/categories`, payload));
  }

  async updateCategory(id: string, payload: Omit<MenuCategory, 'id'>): Promise<MenuCategory> {
    return firstValueFrom(this.http.put<MenuCategory>(`${this.apiUrl}/categories/${id}`, payload));
  }

  async deleteCategory(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.apiUrl}/categories/${id}`));
  }

  async getWines(): Promise<WineItem[]> {
    return firstValueFrom(this.http.get<WineItem[]>(`${this.apiUrl}/wines`));
  }

  async createWine(payload: Omit<WineItem, 'id'>): Promise<WineItem> {
    return firstValueFrom(this.http.post<WineItem>(`${this.apiUrl}/wines`, payload));
  }

  async updateWine(id: string, payload: Omit<WineItem, 'id'>): Promise<WineItem> {
    return firstValueFrom(this.http.put<WineItem>(`${this.apiUrl}/wines/${id}`, payload));
  }

  async deleteWine(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.apiUrl}/wines/${id}`));
  }

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<AdminReservation> {
    return firstValueFrom(this.http.put<AdminReservation>(`${this.apiUrl}/reservations/${id}/status`, { status }));
  }
}
