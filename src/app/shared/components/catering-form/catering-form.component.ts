import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RestaurantService } from '../../../core/services/restaurant.service';

@Component({
  selector: 'app-catering-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="devis-form" class="py-24 lg:py-32 bg-white px-4">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-16 lg:mb-20">
          <span class="text-jacquier-gold font-bold tracking-[0.2em] uppercase text-sm block mb-4">Devis Sur-Mesure</span>
          <h2 class="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-jacquier-primary">Parlez-Nous de Votre Événement</h2>
        </div>
        
        <div class="bg-jacquier-cream p-8 md:p-12 lg:p-16 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-jacquier-gold via-jacquier-primary to-jacquier-gold" aria-hidden="true"></div>
          
          @if (isSubmitted()) {
            <div class="text-center py-16 animate-fade-in">
              <div class="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 class="text-3xl font-serif font-bold text-jacquier-dark mb-4">Demande Envoyée !</h3>
              <p class="text-jacquier-text font-light text-lg mb-8">Notre équipe vous contactera sous 24h ouvrées pour discuter de votre événement.</p>
              <button (click)="resetForm()" class="px-8 py-4 bg-jacquier-primary text-white rounded-xl font-bold uppercase tracking-widest hover:bg-jacquier-burgundy transition-colors duration-300 text-sm">
                Nouvelle Demande
              </button>
            </div>
          } @else {
            @if (submitError()) {
              <div class="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm" role="alert">
                {{ submitError() }}
              </div>
            }

            <form [formGroup]="devisForm" (ngSubmit)="onSubmit()" class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Nom Complet -->
                <div class="space-y-2">
                  <label for="name" class="block text-sm font-bold text-jacquier-dark uppercase tracking-widest">Nom Complet *</label>
                  <input type="text" id="name" formControlName="name" 
                         class="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-jacquier-gold focus:border-transparent transition-all outline-none text-jacquier-dark"
                         [class.border-red-500]="devisForm.get('name')?.invalid && devisForm.get('name')?.touched"
                         placeholder="Jean Dupont">
                  @if (devisForm.get('name')?.invalid && devisForm.get('name')?.touched) {
                    <p class="text-red-500 text-xs mt-1 font-medium" role="alert">Ce champ est requis.</p>
                  }
                </div>
                
                <!-- Téléphone -->
                <div class="space-y-2">
                  <label for="phone" class="block text-sm font-bold text-jacquier-dark uppercase tracking-widest">Téléphone *</label>
                  <input type="tel" id="phone" formControlName="phone" 
                         class="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-jacquier-gold focus:border-transparent transition-all outline-none text-jacquier-dark"
                         [class.border-red-500]="devisForm.get('phone')?.invalid && devisForm.get('phone')?.touched"
                         placeholder="+224 620 00 00 00">
                  @if (devisForm.get('phone')?.invalid && devisForm.get('phone')?.touched) {
                    <p class="text-red-500 text-xs mt-1 font-medium" role="alert">Un numéro de téléphone valide est requis.</p>
                  }
                </div>
                
                <!-- Email -->
                <div class="space-y-2 md:col-span-2">
                  <label for="email" class="block text-sm font-bold text-jacquier-dark uppercase tracking-widest">Email *</label>
                  <input type="email" id="email" formControlName="email" 
                         class="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-jacquier-gold focus:border-transparent transition-all outline-none text-jacquier-dark"
                         [class.border-red-500]="devisForm.get('email')?.invalid && devisForm.get('email')?.touched"
                         placeholder="jean.dupont@exemple.com">
                  @if (devisForm.get('email')?.invalid && devisForm.get('email')?.touched) {
                    <p class="text-red-500 text-xs mt-1 font-medium" role="alert">Une adresse email valide est requise.</p>
                  }
                </div>
                
                <!-- Type d'événement -->
                <div class="space-y-2">
                  <label for="eventType" class="block text-sm font-bold text-jacquier-dark uppercase tracking-widest">Type d'Événement *</label>
                  <select id="eventType" formControlName="eventType" 
                          class="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-jacquier-gold focus:border-transparent transition-all outline-none text-jacquier-dark appearance-none"
                          [class.border-red-500]="devisForm.get('eventType')?.invalid && devisForm.get('eventType')?.touched">
                    <option value="" disabled selected>Sélectionnez un type</option>
                    <option value="mariage">Mariage</option>
                    <option value="corporate">Événement d'Entreprise</option>
                    <option value="anniversaire">Anniversaire / Baptême</option>
                    <option value="prive">Dîner Privé</option>
                    <option value="autre">Autre</option>
                  </select>
                  @if (devisForm.get('eventType')?.invalid && devisForm.get('eventType')?.touched) {
                    <p class="text-red-500 text-xs mt-1 font-medium" role="alert">Veuillez sélectionner un type d'événement.</p>
                  }
                </div>
                
                <!-- Date -->
                <div class="space-y-2">
                  <label for="date" class="block text-sm font-bold text-jacquier-dark uppercase tracking-widest">Date Prévue *</label>
                  <input type="date" id="date" formControlName="date" 
                         class="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-jacquier-gold focus:border-transparent transition-all outline-none text-jacquier-dark"
                         [class.border-red-500]="devisForm.get('date')?.invalid && devisForm.get('date')?.touched">
                  @if (devisForm.get('date')?.invalid && devisForm.get('date')?.touched) {
                    <p class="text-red-500 text-xs mt-1 font-medium" role="alert">Veuillez sélectionner une date.</p>
                  }
                </div>
                
                <!-- Nombre d'invités -->
                <div class="space-y-2">
                  <label for="guests" class="block text-sm font-bold text-jacquier-dark uppercase tracking-widest">Nombre d'Invités *</label>
                  <input type="number" id="guests" formControlName="guests" min="1"
                         class="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-jacquier-gold focus:border-transparent transition-all outline-none text-jacquier-dark"
                         [class.border-red-500]="devisForm.get('guests')?.invalid && devisForm.get('guests')?.touched"
                         placeholder="Ex: 50">
                  @if (devisForm.get('guests')?.invalid && devisForm.get('guests')?.touched) {
                    <p class="text-red-500 text-xs mt-1 font-medium" role="alert">Veuillez indiquer le nombre d'invités.</p>
                  }
                </div>
                
                <!-- Budget -->
                <div class="space-y-2">
                  <label for="budget" class="block text-sm font-bold text-jacquier-dark uppercase tracking-widest">Budget Estimé (FG)</label>
                  <input type="text" id="budget" formControlName="budget" 
                         class="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-jacquier-gold focus:border-transparent transition-all outline-none text-jacquier-dark"
                         placeholder="Ex: 10 000 000 FG">
                </div>
                
                <!-- Message -->
                <div class="space-y-2 md:col-span-2">
                  <label for="message" class="block text-sm font-bold text-jacquier-dark uppercase tracking-widest">Détails & Besoins Spécifiques *</label>
                  <textarea id="message" formControlName="message" rows="5"
                            class="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-jacquier-gold focus:border-transparent transition-all outline-none text-jacquier-dark resize-none"
                            [class.border-red-500]="devisForm.get('message')?.invalid && devisForm.get('message')?.touched"
                            placeholder="Décrivez votre événement, vos envies, le lieu..."></textarea>
                  @if (devisForm.get('message')?.invalid && devisForm.get('message')?.touched) {
                    <p class="text-red-500 text-xs mt-1 font-medium" role="alert">Veuillez fournir quelques détails sur votre événement.</p>
                  }
                </div>
              </div>
              
              <div class="pt-6">
                <button type="submit" 
                        [disabled]="devisForm.invalid || isSubmitting()"
                        class="w-full py-5 bg-jacquier-primary text-white rounded-xl font-bold uppercase tracking-widest hover:bg-jacquier-burgundy transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm flex justify-center items-center group">
                  @if (isSubmitting()) {
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  } @else {
                    Envoyer la Demande
                    <svg class="w-5 h-5 ml-3 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  }
                </button>
                <p class="text-center text-xs text-gray-500 mt-6 font-light">
                  * Champs obligatoires. Vos données sont sécurisées et ne seront utilisées que pour traiter votre demande.
                </p>
              </div>
            </form>
          }
        </div>
      </div>
    </section>
  `
})
export class CateringFormComponent {
  private restaurantService = inject(RestaurantService);

  isSubmitting = signal(false);
  isSubmitted = signal(false);
  submitError = signal<string | null>(null);
  
  devisForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.devisForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
      eventType: ['', Validators.required],
      date: ['', Validators.required],
      guests: ['', [Validators.required, Validators.min(1)]],
      budget: [''],
      message: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.devisForm.valid) {
      this.isSubmitting.set(true);
      this.submitError.set(null);
      try {
        await this.restaurantService.submitCateringRequest(this.devisForm.getRawValue());
        this.isSubmitted.set(true);
      } catch (err) {
        console.error('Échec de l\'envoi de la demande de devis traiteur', err);
        this.submitError.set('Impossible d\'envoyer votre demande pour le moment. Merci de réessayer, ou contactez-nous directement par téléphone.');
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      Object.keys(this.devisForm.controls).forEach(key => {
        this.devisForm.get(key)?.markAsTouched();
      });
    }
  }

  resetForm() {
    this.devisForm.reset();
    this.isSubmitted.set(false);
    this.submitError.set(null);
  }
}
