import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CateringOrderDto } from '../dto/catering.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CateringService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getEvents(): Observable<CateringOrderDto[]> {
    return this.http.get<CateringOrderDto[]>(`${this.apiUrl}/catering`);
  }

  getCateringOrders(): Observable<CateringOrderDto[]> {
    return this.getEvents();
  }

  createEvent(order: CateringOrderDto): Observable<CateringOrderDto> {
    return this.http.post<CateringOrderDto>(`${this.apiUrl}/catering`, order);
  }

  addOrder(order: CateringOrderDto): Promise<CateringOrderDto> {
    return new Promise((resolve, reject) => {
      this.createEvent(order).subscribe({
        next: (res) => resolve(res),
        error: (err) => reject(err)
      });
    });
  }

  updateEvent(id: string, data: Partial<CateringOrderDto>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.put(`${this.apiUrl}/catering/${id}`, data).subscribe({
        next: () => resolve(),
        error: (err) => reject(err)
      });
    });
  }

  updateOrderStatus(id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled'): Promise<void> {
    return this.updateEvent(id, { status });
  }

  deleteEvent(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.delete(`${this.apiUrl}/catering/${id}`).subscribe({
        next: () => resolve(),
        error: (err) => reject(err)
      });
    });
  }

  deleteOrder(id: string): Promise<void> {
    return this.deleteEvent(id);
  }
}
