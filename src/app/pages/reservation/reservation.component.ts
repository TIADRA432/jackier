import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ReservationService } from '../../core/services/reservation.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="min-h-screen bg-[#fcfbf9] text-gray-900 font-sans pt-24 pb-16">
      <div class="max-w-3xl mx-auto px-4">
        <h1 class="text-5xl md:text-6xl serif mb-6 text-center">Réserver une table</h1>
        <p class="text-center text-gray-500 mb-16 max-w-xl mx-auto">
          Pour toute réservation de plus de 8 personnes, merci de nous contacter directement par téléphone.
        </p>

        <div class="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          @if (successMessage) {
            <div class="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-green-800" role="status">
              {{ successMessage }}
            </div>
          }
          @if (errorMessage) {
            <div class="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-red-800" role="alert">
              {{ errorMessage }}
            </div>
          }

          <form [formGroup]="reservationForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <mat-form-field appearance="outline">
                <mat-label>Date</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="date" [min]="minDate">
                <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Heure</mat-label>
                <mat-select formControlName="time">
                  @for (time of availableTimes; track time) {
                    <mat-option [value]="time">{{ time }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline">
              <mat-label>Nombre de personnes</mat-label>
              <mat-select formControlName="guests">
                @for (n of [1,2,3,4,5,6,7,8]; track n) {
                  <mat-option [value]="n">{{ n }} personne{{ n > 1 ? 's' : '' }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <div class="border-t border-gray-100 my-4"></div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <mat-form-field appearance="outline">
                <mat-label>Prénom</mat-label>
                <input matInput formControlName="firstName" maxlength="100">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Nom</mat-label>
                <input matInput formControlName="lastName" maxlength="100">
              </mat-form-field>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" maxlength="254">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Téléphone</mat-label>
                <input matInput type="tel" formControlName="phone" maxlength="30">
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline">
              <mat-label>Demande spéciale (allergies, anniversaire...)</mat-label>
              <textarea matInput rows="3" formControlName="notes" maxlength="1000"></textarea>
            </mat-form-field>

            <button mat-flat-button type="submit" class="!bg-gray-900 !text-white !py-6 !text-sm !uppercase !tracking-widest mt-4" [disabled]="reservationForm.invalid || submitting">
              {{ submitting ? 'Envoi en cours...' : 'Confirmer la réservation' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationComponent {
  private readonly reservationService = inject(ReservationService);
  private readonly fb = inject(FormBuilder);

  reservationForm = this.fb.group({
    date: [null as Date | null, Validators.required],
    time: ['', Validators.required],
    guests: [null as number | null, [Validators.required, Validators.min(1), Validators.max(8)]],
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    phone: ['', [Validators.required, Validators.maxLength(30)]],
    notes: ['', Validators.maxLength(1000)],
  });

  minDate = new Date();
  submitting = false;
  successMessage = '';
  errorMessage = '';

  availableTimes = [
    '12:00', '12:30', '13:00', '13:30', '14:00',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  ];

  onSubmit() {
    if (this.reservationForm.invalid || this.submitting) {
      this.reservationForm.markAllAsTouched();
      return;
    }

    const value = this.reservationForm.getRawValue();
    if (!value.date || !value.guests) return;

    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.reservationService.createReservation({
      name: `${value.firstName!.trim()} ${value.lastName!.trim()}`,
      email: value.email!.trim(),
      phone: value.phone!.trim(),
      date: this.formatDate(value.date),
      time: value.time!,
      guests: value.guests,
      notes: value.notes?.trim() || '',
      status: 'pending',
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = 'Votre demande de réservation a bien été enregistrée. Nous vous contacterons pour confirmer votre réservation.';
        this.reservationForm.reset();
      },
      error: (error) => {
        this.submitting = false;
        this.errorMessage = error?.error?.error || 'Impossible d’enregistrer votre demande. Veuillez réessayer ou nous contacter directement.';
      },
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
