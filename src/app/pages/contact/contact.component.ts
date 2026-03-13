import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-[#fcfbf9] text-gray-900 font-sans pt-24 pb-16">
      <div class="max-w-6xl mx-auto px-4">
        <h1 class="text-5xl md:text-6xl serif mb-12 text-center">Contactez-nous</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 mt-16">
          
          <!-- Contact Info -->
          <div>
            <h2 class="text-3xl serif mb-8">Informations Pratiques</h2>
            <div class="space-y-6 text-gray-600">
              <div class="flex items-start">
                <mat-icon class="mr-4 text-gray-900">location_on</mat-icon>
                <div>
                  <p class="font-medium text-gray-900">Adresse</p>
                  <p>Quartier Almadies, Conakry, Guinée</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <mat-icon class="mr-4 text-gray-900">phone</mat-icon>
                <div>
                  <p class="font-medium text-gray-900">Téléphone</p>
                  <p>+224 620 00 00 00</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <mat-icon class="mr-4 text-gray-900">email</mat-icon>
                <div>
                  <p class="font-medium text-gray-900">Email</p>
                  <p>contact&#64;lejacquier.com</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <mat-icon class="mr-4 text-gray-900">schedule</mat-icon>
                <div>
                  <p class="font-medium text-gray-900">Heures d'ouverture</p>
                  <p>Lun - Jeu : 12h00 - 22h30</p>
                  <p>Ven - Sam : 12h00 - 23h30</p>
                  <p>Dimanche : Fermé</p>
                </div>
              </div>
            </div>
            
            <div class="mt-12 w-full h-64 bg-gray-200 rounded-xl overflow-hidden">
              <!-- Placeholder for Google Maps -->
              <img src="https://picsum.photos/seed/map/800/400" alt="Carte" class="w-full h-full object-cover" referrerpolicy="no-referrer">
            </div>
          </div>
          
          <!-- Contact Form -->
          <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 class="text-3xl serif mb-8">Envoyez-nous un message</h2>
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <mat-form-field appearance="outline">
                  <mat-label>Prénom</mat-label>
                  <input matInput formControlName="firstName">
                </mat-form-field>
                
                <mat-form-field appearance="outline">
                  <mat-label>Nom</mat-label>
                  <input matInput formControlName="lastName">
                </mat-form-field>
              </div>
              
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Sujet</mat-label>
                <input matInput formControlName="subject">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Message</mat-label>
                <textarea matInput rows="5" formControlName="message"></textarea>
              </mat-form-field>
              
              <button mat-flat-button class="!bg-gray-900 !text-white !py-6 !text-sm !uppercase !tracking-widest mt-4" [disabled]="contactForm.invalid">
                Envoyer
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  contactForm;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      alert('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
      this.contactForm.reset();
    }
  }
}
