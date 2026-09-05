import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CateringOrderDto } from '../dto/catering.dto';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CateringService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getEvents(): Observable<CateringOrderDto[]> { return this.http.get<CateringOrderDto[]>(`${this.apiUrl}/catering`); }
  getCateringOrders(): Observable<CateringOrderDto[]> { return this.getEvents(); }
  createEvent(order: CateringOrderDto): Observable<CateringOrderDto> { return this.http.post<CateringOrderDto>(`${this.apiUrl}/catering`, order); }
  addOrder(order: CateringOrderDto): Promise<CateringOrderDto> { return this.createEvent(order).toPromise() as Promise<CateringOrderDto>; }
  addCateringOrder(order: CateringOrderDto): Promise<CateringOrderDto> { return this.addOrder(order); }
  updateEvent(id: string, data: Partial<CateringOrderDto>): Promise<void> { return this.http.put(`${this.apiUrl}/catering/${id}`, data).toPromise().then(() => undefined); }
  updateCateringOrder(order: CateringOrderDto): Promise<void> { return this.updateEvent(order.id!, order); }
  updateOrderStatus(id: string, status: CateringOrderDto['status']): Promise<void> { return this.updateEvent(id, { status }); }
  deleteEvent(id: string): Promise<void> { return this.http.delete(`${this.apiUrl}/catering/${id}`).toPromise().then(() => undefined); }
  deleteOrder(id: string): Promise<void> { return this.deleteEvent(id); }
  deleteCateringOrder(id: string): Promise<void> { return this.deleteEvent(id); }
}
