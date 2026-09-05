export interface ReservationDto {
  id?: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'approved' | 'rejected';
  createdAt?: string;
}
