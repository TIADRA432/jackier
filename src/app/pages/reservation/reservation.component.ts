
import { Component, inject, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { ReservationService } from '../../core/services/reservation.service';
import { Reservation } from '../../core/models';
import { SiteSettingsService } from '../../core/services/site-settings.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [ReactiveFormsModule, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-jacquier-cream flex flex-col">
      <!-- Hero -->
      <div class="relative h-[40vh] flex items-center justify-center text-center px-4 overflow-hidden bg-jacquier-dark">
        <img [ngSrc]="siteSettings.image('reservationHero', '/og-image.png').url" fill priority class="object-cover opacity-40" [alt]="siteSettings.image('reservationHero', '').altText || 'Réservation'" referrerPolicy="no-referrer">
        <div class="relative z-10 max-w-4xl mx-auto text-white animate-fade-in-up">
          <span class="block text-jacquier-gold font-bold tracking-[0.2em] mb-4 uppercase text-sm md:text-base">Vivez l'expérience Le Jacquier</span>
          <h1 class="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">Réservez votre table</h1>
        </div>
      </div>

      <div class="flex-grow container mx-auto px-4 py-16 flex justify-center -mt-20 relative z-20">
        <div class="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100">
          
          <!-- Image Side -->
          <div class="lg:w-2/5 relative hidden lg:block">
            <img [ngSrc]="siteSettings.image('reservationHero', '/og-image.png').url" fill priority
              class="object-cover" [alt]="siteSettings.image('reservationHero', '').altText || 'Table au Jacquier'" referrerPolicy="no-referrer">
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
                  <svg class="w-12 h-12 text-jacquier-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 class="text-3xl font-serif font-bold text-jacquier-primary mb-4">Demande de réservation reçue</h3>
                <p class="text-jacquier-text font-light text-lg leading-relaxed max-w-md">
                  Merci <strong class="font-bold text-jacquier-dark">{{ lastReservationName() }}</strong>.<br><br>
                  Votre demande pour le <strong class="font-bold text-jacquier-dark">{{ lastReservationDate() }}</strong> a bien été enregistrée.
                </p>
                <div class="my-6 w-full max-w-md rounded-2xl border border-jacquier-gold/30 bg-jacquier-cream p-5 text-left">
                  <p class="text-xs font-bold uppercase tracking-wider text-jacquier-gold">Statut</p>
                  <p class="mt-1 font-bold text-jacquier-dark">En attente de confirmation par le restaurant</p>
                  @if (lastReservationReference()) {
                    <p class="mt-4 text-xs text-gray-500">Référence</p>
                    <p class="mt-1 break-all font-mono text-sm font-bold text-jacquier-primary">{{ lastReservationReference() }}</p>
                  }
                  <p class="mt-4 text-xs leading-relaxed text-gray-600">
                    Aucun e-mail automatique n’est envoyé actuellement. Le restaurant utilisera les coordonnées fournies pour traiter la demande.
                  </p>
                </div>
                <button (click)="resetForm()" class="px-8 py-4 bg-jacquier-primary text-white rounded-xl font-bold uppercase tracking-wide hover:bg-jacquier-burgundy transition-colors min-h-[44px]">
                  Nouvelle réservation
                </button>
              </div>
            } @else {
              <div class="mb-10 text-center lg:text-left">
                <h2 class="text-3xl font-serif font-bold text-jacquier-primary mb-2">Vos Coordonnées</h2>
                <p class="text-jacquier-text font-light">Veuillez remplir le formulaire ci-dessous.</p>
                @if (siteSettings.openStatus().configured) {
                  <div class="mt-4 inline-flex items-center gap-2 rounded-full bg-jacquier-cream px-4 py-2 text-xs font-bold">
                    <span [class]="siteSettings.openStatus().isOpen ? 'h-2 w-2 rounded-full bg-emerald-500' : 'h-2 w-2 rounded-full bg-gray-400'"></span>
                    <span [class.text-emerald-700]="siteSettings.openStatus().isOpen" [class.text-gray-600]="!siteSettings.openStatus().isOpen">
                      {{ siteSettings.openStatus().label }}
                    </span>
                    @if (siteSettings.openStatus().detail) { <span class="font-normal text-gray-500">· {{ siteSettings.openStatus().detail }}</span> }
                  </div>
                }
              </div>

              @if (submitError()) {
                <div class="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm" role="alert">
                  {{ submitError() }}
                </div>
              }

              <form [formGroup]="reservationForm" (ngSubmit)="onSubmit()" class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-2">
                    <label for="res-name" class="text-xs font-bold text-gray-500 uppercase tracking-wider">Nom Complet</label>
                    <input id="res-name" type="text" formControlName="name" autocomplete="name"
                      [attr.aria-invalid]="reservationForm.get('name')?.touched && reservationForm.get('name')?.invalid"
                      [attr.aria-describedby]="reservationForm.get('name')?.touched && reservationForm.get('name')?.invalid ? 'res-name-error' : null"
                      class="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-jacquier-gold focus:border-transparent outline-none transition-all" placeholder="Votre nom">
                    @if (reservationForm.get('name')?.touched && reservationForm.get('name')?.invalid) {
                      <p id="res-name-error" class="text-red-500 text-xs mt-1" role="alert">Nom requis</p>
                    }
                  </div>
                  
                  <div class="space-y-2">
                    <label for="res-email" class="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                    <input id="res-email" type="email" formControlName="email" autocomplete="email" inputmode="email"
                      [attr.aria-invalid]="reservationForm.get('email')?.touched && reservationForm.get('email')?.invalid"
                      [attr.aria-describedby]="reservationForm.get('email')?.touched && reservationForm.get('email')?.invalid ? 'res-email-error' : null"
                      class="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-jacquier-gold focus:border-transparent outline-none transition-all" placeholder="votre@email.com">
                    @if (reservationForm.get('email')?.touched && reservationForm.get('email')?.invalid) {
                      <p id="res-email-error" class="text-red-500 text-xs mt-1" role="alert">Email valide requis</p>
                    }
                  </div>
                </div>

                <div class="space-y-2">
                  <label for="res-phone" class="text-xs font-bold text-gray-500 uppercase tracking-wider">Téléphone</label>
                  <input id="res-phone" type="tel" formControlName="phone" autocomplete="tel" inputmode="tel"
                    [attr.aria-invalid]="reservationForm.get('phone')?.touched && reservationForm.get('phone')?.invalid"
                    [attr.aria-describedby]="reservationForm.get('phone')?.touched && reservationForm.get('phone')?.invalid ? 'res-phone-error' : null"
                    class="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-jacquier-gold focus:border-transparent outline-none transition-all" placeholder="+224 ...">
                  @if (reservationForm.get('phone')?.touched && reservationForm.get('phone')?.invalid) {
                    <p id="res-phone-error" class="text-red-500 text-xs mt-1" role="alert">Téléphone requis</p>
                  }
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div class="space-y-2">
                    <label for="res-date" class="text-xs font-bold text-gray-500 uppercase tracking-wider">Date</label>
                    <input id="res-date" type="date" formControlName="date" [min]="todayDate"
                      [attr.aria-invalid]="reservationForm.get('date')?.touched && reservationForm.get('date')?.invalid"
                      [attr.aria-describedby]="reservationForm.get('date')?.touched && reservationForm.get('date')?.invalid ? 'res-date-error' : null"
                      class="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-jacquier-gold outline-none transition-all">
                    @if (reservationForm.get('date')?.touched && reservationForm.get('date')?.invalid) {
                      <p id="res-date-error" class="text-red-500 text-xs mt-1" role="alert">Date requise</p>
                    }
                  </div>
                  <div class="space-y-2">
                    <label for="res-time" class="text-xs font-bold text-gray-500 uppercase tracking-wider">Heure</label>
                    <select id="res-time" formControlName="time"
                      [attr.aria-invalid]="reservationForm.get('time')?.touched && reservationForm.get('time')?.invalid"
                      [attr.aria-describedby]="reservationForm.get('time')?.touched && reservationForm.get('time')?.invalid ? 'res-time-error' : null"
                      class="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-jacquier-gold outline-none transition-all appearance-none cursor-pointer">
                      <option value="" disabled selected>Choisir</option>
                      @for (slot of availableTimeSlots(); track slot) {
                        <option [value]="slot">{{ slot }}</option>
                      }
                    </select>
                     @if (reservationForm.get('time')?.touched && reservationForm.get('time')?.invalid) {
                      <p id="res-time-error" class="text-red-500 text-xs mt-1" role="alert">Heure requise</p>
                    }
                    @if (selectedDate() && siteSettings.settings().weeklyHours?.enabled && availableTimeSlots().length === 0) {
                      <p class="text-amber-700 text-xs mt-1" role="status">Le restaurant est fermé ce jour-là selon les horaires configurés.</p>
                    }
                  </div>
                  <div class="space-y-2">
                    <label for="res-guests" class="text-xs font-bold text-gray-500 uppercase tracking-wider">Invités</label>
                    <select id="res-guests" formControlName="guests" class="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-jacquier-gold outline-none transition-all appearance-none cursor-pointer">
                      @for (num of [1,2,3,4,5,6,7,8]; track num) {
                        <option [value]="num">{{ num }} pers.</option>
                      }
                    </select>
                  </div>
                </div>

                <button type="submit" 
                        [disabled]="reservationForm.invalid || isSubmitting()"
                        class="w-full bg-jacquier-primary text-white font-bold uppercase tracking-wide py-4 rounded-xl hover:bg-jacquier-burgundy transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8 shadow-lg min-h-[56px]">
                  @if (isSubmitting()) {
                    <span class="flex items-center justify-center">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement...
                    </span>
                  } @else {
                    Envoyer la demande
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
  readonly siteSettings = inject(SiteSettingsService);

  // Créneaux alignés avec ceux acceptés par le backend (reservation.controller.ts ALLOWED_TIMES).
  readonly timeSlots = ['12:00', '12:30', '13:00', '13:30', '14:00', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];
  readonly todayDate = this.conakryDateString();

  reservationForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9 ()-]{6,30}$/)]],
    date: ['', Validators.required],
    time: ['', Validators.required],
    guests: ['2', Validators.required]
  });

  readonly selectedDate = toSignal(this.reservationForm.controls.date.valueChanges, {
    initialValue: this.reservationForm.controls.date.value ?? ''
  });

  readonly availableTimeSlots = computed(() => {
    const selectedDate = this.selectedDate();
    if (!selectedDate) return this.timeSlots;
    if (selectedDate < this.todayDate) return [];

    const toMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return (hours || 0) * 60 + (minutes || 0);
    };

    let slots = this.timeSlots;
    const schedule = this.siteSettings.settings().weeklyHours;
    if (schedule?.enabled) {
      const dayKey = this.weekdayForDate(selectedDate);
      const day = schedule.days[dayKey];
      if (!day || day.closed || !day.open || !day.close) return [];

      const open = toMinutes(day.open);
      const close = toMinutes(day.close);
      slots = slots.filter(slot => {
        const value = toMinutes(slot);
        return open < close ? value >= open && value < close : value >= open || value < close;
      });
    }

    if (selectedDate === this.todayDate) {
      const now = this.conakryTimeMinutes();
      slots = slots.filter(slot => toMinutes(slot) > now);
    }

    return slots;
  });

  isSubmitting = signal(false);
  successMessage = signal(false);
  submitError = signal<string | null>(null);
  lastReservationName = signal('');
  lastReservationDate = signal('');
  lastReservationReference = signal('');

  constructor() {
    effect(() => {
      const slots = this.availableTimeSlots();
      const selected = this.reservationForm.controls.time.value ?? '';
      if (selected && !slots.includes(selected)) {
        this.reservationForm.controls.time.setValue('');
      }
    });
  }

  private conakryTimeMinutes(): number {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Conakry',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(new Date());
    const hour = Number(parts.find(part => part.type === 'hour')?.value ?? '0');
    const minute = Number(parts.find(part => part.type === 'minute')?.value ?? '0');
    return hour * 60 + minute;
  }

  private conakryDateString(): string {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Africa/Conakry',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(new Date());
    const year = parts.find(part => part.type === 'year')?.value ?? '';
    const month = parts.find(part => part.type === 'month')?.value ?? '';
    const day = parts.find(part => part.type === 'day')?.value ?? '';
    return `${year}-${month}-${day}`;
  }

  private weekdayForDate(date: string): 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' {
    const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'UTC' })
      .format(new Date(`${date}T12:00:00Z`));
    const map = {
      Mon: 'monday', Tue: 'tuesday', Wed: 'wednesday', Thu: 'thursday',
      Fri: 'friday', Sat: 'saturday', Sun: 'sunday'
    } as const;
    return map[weekday as keyof typeof map] ?? 'monday';
  }

  async onSubmit() {
    if (this.reservationForm.valid) {
      this.isSubmitting.set(true);
      this.submitError.set(null);
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
        const result = await this.reservationService.makeReservation(data);
        if (result.success && result.reservation) {
          this.lastReservationName.set(result.reservation.name || data.name);
          this.lastReservationDate.set(`${result.reservation.date} à ${result.reservation.time}`);
          this.lastReservationReference.set(result.reservation.id);
          this.successMessage.set(true);
        } else {
          // La réservation a été rejetée par le serveur : on affiche le message précis
          // renvoyé par ReservationService (distingue 429 / 400 / 500 / coupure réseau)
          // plutôt qu'un message générique qui masquerait la vraie cause.
          this.submitError.set(result.errorMessage ?? 'Impossible d’envoyer la demande de réservation. Merci de réessayer, ou contactez-nous directement.');
        }
      } catch (e) {
        console.error(e);
        this.submitError.set('Une erreur est survenue. Merci de réessayer dans un instant.');
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.reservationForm.markAllAsTouched();
    }
  }

  resetForm() {
    this.successMessage.set(false);
    this.submitError.set(null);
    this.lastReservationReference.set('');
    this.reservationForm.reset({ guests: '2' });
  }
}
