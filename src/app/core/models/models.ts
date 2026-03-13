import { Timestamp } from '@angular/fire/firestore';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'finance' | 'reception' | 'chef' | 'editor';
  createdAt: Timestamp;
}

export interface MenuItem {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: 'entree' | 'plat' | 'dessert' | 'boisson';
  imageUrl: string;
  available: boolean;
  createdAt: Timestamp;
}

export interface Reservation {
  id?: string;
  name: string;
  phone: string;
  email: string;
  date: Timestamp;
  guests: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  notes?: string;
  createdAt: Timestamp;
}

export interface CateringOrder {
  id?: string;
  clientName: string;
  eventDate: Timestamp;
  eventType: string;
  guests: number;
  budget: number;
  status: 'pending' | 'approved' | 'in-progress' | 'completed';
  createdAt: Timestamp;
}

export interface GalleryItem {
  id?: string;
  imageUrl: string;
  title: string;
  category: string;
  uploadedAt: Timestamp;
}

export interface SchoolProgram {
  id?: string;
  title: string;
  duration: string;
  description: string;
  price: number;
  active: boolean;
}

export interface DailyFinanceReport {
  id?: string;
  date: string;
  totalRevenue: number;
  expenses: number;
  netProfit: number;
  closedBy: string;
  closedAt: Timestamp;
}
