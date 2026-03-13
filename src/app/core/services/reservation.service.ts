import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservationDto } from '../dto/reservation.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getReservations(): Observable<ReservationDto[]> {
    return this.http.get<ReservationDto[]>(`${this.apiUrl}/reservations`);
  }

  createReservation(reservation: ReservationDto): Observable<ReservationDto> {
    return this.http.post<ReservationDto>(`${this.apiUrl}/reservations`, reservation);
  }

  addReservation(reservation: ReservationDto): Promise<ReservationDto> {
    return new Promise((resolve, reject) => {
      this.createReservation(reservation).subscribe({
        next: (res) => resolve(res),
        error: (err) => reject(err)
      });
    });
  }

  updateReservationStatus(id: string, status: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.put(`${this.apiUrl}/reservations/${id}/status`, { status }).subscribe({
        next: () => resolve(),
        error: (err) => reject(err)
      });
    });
  }

  deleteReservation(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.delete(`${this.apiUrl}/reservations/${id}`).subscribe({
        next: () => resolve(),
        error: (err) => reject(err)
      });
    });
  }
}
