export interface CateringOrderDto {
  id?: string;
  clientName: string;
  email: string;
  phone: string;
  eventDate: string;
  eventType: string;
  guests: number;
  budget: number;
  requirements?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'approved' | 'rejected';
  createdAt?: string;
}
