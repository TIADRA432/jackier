import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

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
    ReactiveFormsModule
  ],
  template: `
    <div class="min-h-screen bg-[#fcfbf9] text-gray-900 font-sans pt-24 pb-16">
      <div class="max-w-3xl mx-auto px-4">
        <h1 class="text-5xl md:text-6xl serif mb-6 text-center">Réserver une table</h1>
        <p class="text-center text-gray-500 mb-16 max-w-xl mx-auto">
          Pour toute réservation de plus de 8 personnes, merci de nous contacter directement par téléphone.
        </p>
        
        <div class="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
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
                <input matInput formControlName="firstName">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Nom</mat-label>
                <input matInput formControlName="lastName">
              </mat-form-field>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Téléphone</mat-label>
                <input matInput type="tel" formControlName="phone">
              </mat-form-field>
            </div>
            
            <mat-form-field appearance="outline">
              <mat-label>Demande spéciale (allergies, anniversaire...)</mat-label>
              <textarea matInput rows="3" formControlName="notes"></textarea>
            </mat-form-field>
            
            <button mat-flat-button class="!bg-gray-900 !text-white !py-6 !text-sm !uppercase !tracking-widest mt-4" [disabled]="reservationForm.invalid">
              Confirmer la réservation
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservationComponent {
  reservationForm;
  minDate = new Date();
  availableTimes = [
    '12:00', '12:30', '13:00', '13:30', '14:00',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  constructor(private fb: FormBuilder) {
    this.reservationForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      guests: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      notes: ['']
    });
  }

  onSubmit() {
    if (this.reservationForm.valid) {
      alert('Votre demande de réservation a bien été enregistrée. Vous recevrez une confirmation par email très prochainement.');
      this.reservationForm.reset();
    }
  }
}
