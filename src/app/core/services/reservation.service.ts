import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservationDto } from '../dto/reservation.dto';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  getReservations(): Observable<ReservationDto[]> { return this.http.get<ReservationDto[]>(`${this.apiUrl}/reservations`); }
  createReservation(reservation: ReservationDto): Observable<ReservationDto> { return this.http.post<ReservationDto>(`${this.apiUrl}/reservations`, reservation); }
  addReservation(reservation: ReservationDto): Promise<ReservationDto> { return this.createReservation(reservation).toPromise() as Promise<ReservationDto>; }
  updateReservation(reservation: Partial<ReservationDto> & { id?: string }): Promise<void> { return this.updateReservationStatus(reservation.id!, reservation.status || 'pending'); }
  updateReservationStatus(id: string, status: string): Promise<void> { return this.http.put(`${this.apiUrl}/reservations/${id}/status`, { status }).toPromise().then(() => undefined); }
  deleteReservation(id: string): Promise<void> { return this.http.delete(`${this.apiUrl}/reservations/${id}`).toPromise().then(() => undefined); }
}
