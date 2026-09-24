
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Reservation } from '../models';
import { environment } from '../../../environments/environment';

export interface ReservationReceipt {
  id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  name: string;
  date: string;
  time: string;
  guests: number;
}

export interface ReservationResult {
  success: boolean;
  reservation?: ReservationReceipt;
  /** Message prêt à afficher à l'utilisateur, déjà adapté au type d'erreur rencontré. */
  errorMessage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  async makeReservation(reservation: Reservation): Promise<ReservationResult> {
    try {
      // Le backend attend une heure au format HH:mm parmi des créneaux fixes (voir reservation.controller.ts).
      const created = await firstValueFrom(this.http.post<ReservationReceipt>(`${this.apiUrl}/reservations`, reservation));
      return { success: true, reservation: created };
    } catch (error) {
      console.error('Échec de la création de réservation:', error);
      return { success: false, errorMessage: this.describeError(error) };
    }
  }

  /**
   * Traduit une erreur HTTP en message actionnable pour l'utilisateur, au lieu d'un
   * message générique unique qui masque la vraie cause (limite de débit, validation
   * refusée côté serveur, panne serveur, ou simple coupure réseau).
   */
  private describeError(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'Une erreur inattendue est survenue. Merci de réessayer.';
    }

    // Pas de code de statut du tout : la requête n'a jamais atteint le serveur
    // (coupure réseau, origine refusée par le CORS avant même l'envoi, etc.)
    if (error.status === 0) {
      return 'Impossible de contacter le serveur. Vérifiez votre connexion internet et réessayez.';
    }

    if (error.status === 429) {
      return 'Trop de tentatives en peu de temps. Merci de patienter quelques minutes avant de réessayer.';
    }

    // Le backend renvoie { error: "message précis" } sur les 400 (voir reservation.controller.ts) :
    // on le remonte tel quel plutôt que de le masquer, car c'est souvent la vraie cause utile.
    if (error.status === 400) {
      const backendMessage = (error.error && typeof error.error === 'object' && 'error' in error.error)
        ? String((error.error as { error?: unknown }).error)
        : null;
      return backendMessage || 'Certaines informations du formulaire sont invalides. Merci de les vérifier.';
    }

    if (error.status >= 500) {
      return 'Le serveur a rencontré un problème. Merci de réessayer dans un instant, ou de nous contacter directement.';
    }

    return `Impossible d’envoyer la demande de réservation (code ${error.status}). Merci de réessayer, ou contactez-nous directement.`;
  }
}
