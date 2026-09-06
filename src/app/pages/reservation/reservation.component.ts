
import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { ReservationService } from '../../core/services/reservation.service';
import { Reservation } from '../../core/models';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [ReactiveFormsModule, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-jacquier-cream flex flex-col">
      <!-- Hero -->
      <div class="relative h-[40vh] flex items-center justify-center text-center px-4 overflow-hidden bg-jacquier-dark">
        <img ngSrc="https://picsum.photos/seed/reservation_hero/1920/1080" fill priority class="object-cover opacity-40" alt="Réservation" referrerPolicy="no-referrer">
        <div class="relative z-10 max-w-4xl mx-auto text-white animate-fade-in-up">
          <span class="block text-jacquier-gold font-bold tracking-[0.2em] mb-4 uppercase text-sm md:text-base">Vivez l'expérience Le Jacquier</span>
          <h1 class="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">Réservez votre table</h1>
        </div>
      </div>

      <div class="flex-grow container mx-auto px-4 py-16 flex justify-center -mt-20 relative z-20">
        <div class="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100">
          
          <!-- Image Side -->
          <div class="lg:w-2/5 relative hidden lg:block">
            <img ngSrc="https://picsum.photos/seed/table/800/1200" fill priority class="object-cover" alt="Table setting" referrerPolicy="no-referrer">
            <div class="absolute inset-0 bg-gradient-to-t from-jacquier-dark/90 via-jacquier-dark/40 to-transparent"></div>
            <div class="absolute bottom-12 left-10 right-10 text-white">
              <span class="text-jacquier-gold font-bold tracking-widest uppercase text-xs mb-3 block">L'Excellence</span>
              <h3 class="font-serif text-3xl font-bold mb-4 leading-tight">Un dîner parfait vous attend</h3>
              <p class="text-jacquier-light font-light leading-relaxed">Réservez votre table pour vivre des moments gastronomiques inoubliables dans un cadre d'exception.</p>
            </div>
          </div>

          <!-- Form Side -->
          <div class="lg:w-3/5 p-8 md:p-12 lg:p-16">
            @if (successMessage()) {
              <div class="h-full flex flex-col items-center justify-center text-center animate-fade-in-up py-12">
                <div class="w-24 h-24 bg-jacquier-cream rounded-full flex items-center justify-center mb-8 shadow-inner">
                  <svg class="w-12 h-12 text-jacquier-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 class="text-3xl font-serif font-bold text-jacquier-primary mb-4">Réservation Confirmée !</h3>
                <p class="text-jacquier-text font-light text-lg mb-10 leading-relaxed max-w-md">
                  Merci <strong class="font-bold text-jacquier-dark">{{ lastReservationName() }}</strong>.<br><br>
                  Nous avons bien reçu votre demande pour le <strong class="font-bold text-jacquier-dark">{{ lastReservationDate() }}</strong>.<br>
                  Un email de confirmation vous a été envoyé.
                </p>
                <button (click)="resetForm()" class="px-8 py-4 bg-jacquier-primary text-white rounded-xl font-bold uppercase tracking-wide hover:bg-jacquier-burgundy transition-colors min-h-[44px]">
                  Nouvelle réservation
                </button>
              </div>
            } @else {
              <div class="mb-10 text-center lg:text-left">
                <h2 class="text-3xl font-serif font-bold text-jacquier-primary mb-2">Vos Coordonnées</h2>
                <p class="text-jacquier-text font-light">Veuillez remplir le formulaire ci-dessous.</p>
              </div>
              
              <form [formGroup]="reservationForm" (ngSubmit)="onSubmit()" class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Nom Complet</label>
                    <input type="text" formControlName="name" class="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-jacquier-gold focus:border-transparent outline-none transition-all" placeholder="Votre nom">
                    @if (reservationForm.get('name')?.touched && reservationForm.get('name')?.invalid) {
                      <p class="text-red-500 text-xs mt-1">Nom requis</p>
                    }
                  </div>
                  
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                    <input type="email" formControlName="email" class="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-jacquier-gold focus:border-transparent outline-none transition-all" placeholder="votre@email.com">
                    @if (reservationForm.get('email')?.touched && reservationForm.get('email')?.invalid) {
                      <p class="text-red-500 text-xs mt-1">Email valide requis</p>
                    }
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Téléphone</label>
                  <input type="tel" formControlName="phone" class="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-jacquier-gold focus:border-transparent outline-none transition-all" placeholder="+224 ...">
                  @if (reservationForm.get('phone')?.touched && reservationForm.get('phone')?.invalid) {
                    <p class="text-red-500 text-xs mt-1">Téléphone requis</p>
                  }
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Date</label>
                    <input type="date" formControlName="date" class="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-jacquier-gold outline-none transition-all">
                    @if (reservationForm.get('date')?.touched && reservationForm.get('date')?.invalid) {
                      <p class="text-red-500 text-xs mt-1">Date requise</p>
                    }
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Heure</label>
                    <input type="time" formControlName="time" class="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-jacquier-gold outline-none transition-all">
                     @if (reservationForm.get('time')?.touched && reservationForm.get('time')?.invalid) {
                      <p class="text-red-500 text-xs mt-1">Heure requise</p>
                    }
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Invités</label>
                    <select formControlName="guests" class="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-jacquier-gold outline-none transition-all appearance-none cursor-pointer">
                      @for (num of [1,2,3,4,5,6,7,8,9,10]; track num) {
                        <option [value]="num">{{ num }} pers.</option>
                      }
                      <option value="11+">Plus de 10</option>
                    </select>
                  </div>
                </div>

                <button type="submit" 
                        [disabled]="reservationForm.invalid || isSubmitting()"
                        class="w-full bg-jacquier-primary text-white font-bold uppercase tracking-wide py-4 rounded-xl hover:bg-jacquier-burgundy transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8 shadow-lg min-h-[56px]">
                  @if (isSubmitting()) {
                    <span class="flex items-center justify-center">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement...
                    </span>
                  } @else {
                    Confirmer la réservation
                  }
                </button>
              </form>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class ReservationComponent {
  fb = inject(FormBuilder);
  reservationService = inject(ReservationService);
  
  reservationForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    guests: ['2', Validators.required]
  });

  isSubmitting = signal(false);
  successMessage = signal(false);
  lastReservationName = signal('');
  lastReservationDate = signal('');

  async onSubmit() {
    if (this.reservationForm.valid) {
      this.isSubmitting.set(true);
      const rawValue = this.reservationForm.getRawValue();
      
      const data: Reservation = {
        name: rawValue.name ?? '',
        email: rawValue.email ?? '',
        phone: rawValue.phone ?? '',
        date: rawValue.date ?? '',
        time: rawValue.time ?? '',
        guests: parseInt(rawValue.guests ?? '0', 10)
      };
      
      try {
        await this.reservationService.makeReservation(data);
        this.lastReservationName.set(data.name);
        this.lastReservationDate.set(`${data.date} à ${data.time}`);
        this.successMessage.set(true);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.reservationForm.markAllAsTouched();
    }
  }

  resetForm() {
    this.successMessage.set(false);
    this.reservationForm.reset({ guests: '2' });
  }
}
