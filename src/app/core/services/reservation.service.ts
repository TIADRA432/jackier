
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Reservation } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  async makeReservation(reservation: Reservation): Promise<boolean> {
    try {
      // Le backend attend une heure au format HH:mm parmi des créneaux fixes (voir reservation.controller.ts).
      await firstValueFrom(this.http.post(`${this.apiUrl}/reservations`, reservation));
      return true;
    } catch (error) {
      console.error('Échec de la création de réservation:', error);
      return false;
    }
  }
}
