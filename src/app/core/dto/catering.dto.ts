export interface CateringOrderDto {
  id?: string;
  clientName: string;
  email: string;
  phone: string;
  eventDate: string;
  eventType: string;
  eventName?: string;
  date?: string;
  guests: number;
  budget: number;
  requirements?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'approved' | 'rejected' | 'in-progress';
  createdAt?: string;
}
