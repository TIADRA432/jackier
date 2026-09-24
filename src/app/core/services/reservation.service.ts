
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

    // Le backend renvoie un motif précis sur les 400. On le traduit ici en message
    // visiteur stable, sans exposer directement les détails techniques de l'API.
    if (error.status === 400) {
      const backendMessage = (error.error && typeof error.error === 'object' && 'error' in error.error)
        ? String((error.error as { error?: unknown }).error)
        : '';
      return this.describeValidationError(backendMessage);
    }

    if (error.status >= 500) {
      return 'Le serveur a rencontré un problème. Merci de réessayer dans un instant, ou de nous contacter directement.';
    }

    return `Impossible d’envoyer la demande de réservation (code ${error.status}). Merci de réessayer, ou contactez-nous directement.`;
  }

  private describeValidationError(message: string): string {
    const normalized = message.toLowerCase();

    if (normalized.includes('similar request already exists')) {
      return 'Une demande similaire existe déjà pour cette date et cette heure. Choisissez un autre créneau ou contactez le restaurant.';
    }
    if (normalized.includes('date is in the past') || normalized.includes('invalid reservation date') || normalized.includes('yyyy-mm-dd')) {
      return 'La date choisie n’est pas valide. Sélectionnez une date à partir d’aujourd’hui.';
    }
    if (normalized.includes('time has already passed')) {
      return 'Ce créneau est déjà passé. Choisissez une heure encore disponible.';
    }
    if (normalized.includes('restaurant is closed')) {
      return 'Le restaurant est fermé à cette date selon les horaires configurés.';
    }
    if (normalized.includes('outside configured opening hours')) {
      return 'Ce créneau est en dehors des horaires d’ouverture du restaurant.';
    }
    if (normalized.includes('invalid reservation time')) {
      return 'Ce créneau de réservation n’est pas disponible.';
    }
    if (normalized.includes('invalid phone') || normalized.includes('phone must') || normalized.includes('phone is required')) {
      return 'Le numéro de téléphone n’est pas valide. Exemple : +224 625 67 53 63.';
    }
    if (normalized.includes('invalid email') || normalized.includes('email must') || normalized.includes('email is required')) {
      return 'L’adresse e-mail n’est pas valide.';
    }
    if (normalized.includes('guests must be between')) {
      return 'Le nombre de personnes doit être compris entre 1 et 8.';
    }
    if (normalized.includes('name is required') || normalized.includes('name must')) {
      return 'Le nom complet est obligatoire.';
    }

    return 'Certaines informations du formulaire sont invalides. Merci de les vérifier.';
  }
}
