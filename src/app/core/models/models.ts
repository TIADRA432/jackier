export type Timestamp = Date | string | number;

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
  category: 'entree' | 'plat' | 'dessert' | 'boisson' | string;
  imageUrl?: string;
  available: boolean;
  active?: boolean;
  displayOrder?: number;
  createdAt: Timestamp;
}

export interface Reservation {
  id?: string;
  name: string;
  phone: string;
  email: string;
  date: Timestamp;
  guests: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: Timestamp;
}

export interface CateringOrder {
  id?: string;
  clientName: string;
  email?: string;
  phone?: string;
  eventDate: Timestamp;
  eventType: string;
  eventName?: string;
  date?: Timestamp;
  guests: number;
  budget: number;
  requirements?: string;
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'confirmed' | 'cancelled' | 'rejected';
  createdAt: Timestamp;
}

export interface GalleryImage {
  id?: string;
  imageUrl: string;
  title: string;
  category: string;
  uploadedAt: Timestamp;
}

export type GalleryItem = GalleryImage;

export interface SchoolProgram {
  id?: string;
  title: string;
  duration: string;
  description: string;
  price: number;
  active: boolean;
  startDate?: Timestamp;
}

export interface FinanceReport {
  id?: string;
  date: string;
  totalRevenue: number;
  expenses: number;
  netProfit: number;
  closedBy: string;
  closedAt: Timestamp;
}

export type DailyFinanceReport = FinanceReport;
