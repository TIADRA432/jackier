
import { Injectable, signal } from '@angular/core';
import { Reservation } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  
  async makeReservation(reservation: Reservation): Promise<boolean> {
    // Simulation d'un appel API
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Réservation reçue:', reservation);
        resolve(true);
      }, 1500);
    });
  }
}
