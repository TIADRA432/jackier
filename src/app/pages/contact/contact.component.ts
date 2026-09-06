
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RestaurantService } from '../../core/services/restaurant.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Hero -->
    <div class="relative h-[50vh] flex items-center justify-center text-center px-4 overflow-hidden bg-jacquier-dark">
      <img ngSrc="https://picsum.photos/seed/contact_hero/1920/1080" fill priority class="object-cover opacity-40" alt="Contact" referrerPolicy="no-referrer">
      <div class="relative z-10 max-w-4xl mx-auto text-white animate-fade-in-up">
        <span class="block text-jacquier-gold font-bold tracking-[0.2em] mb-4 uppercase text-sm md:text-base">Nous trouver à Conakry</span>
        <h1 class="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">Contact & Accès</h1>
      </div>
    </div>

    <section class="py-24 bg-jacquier-cream px-4">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row gap-16">
          
          <!-- Info -->
          <div class="lg:w-1/3 space-y-8">
            <div class="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div class="absolute top-0 left-0 w-2 h-full bg-jacquier-primary"></div>
              <div class="w-12 h-12 bg-jacquier-cream rounded-full flex items-center justify-center text-jacquier-primary mb-6">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <h3 class="text-2xl font-serif font-bold text-jacquier-dark mb-4">Adresse</h3>
              <p class="text-jacquier-text font-light leading-relaxed">{{ info.address }}</p>
              <p class="text-sm text-gray-400 mt-2 uppercase tracking-wider font-bold">Quartier Kipé</p>
            </div>

            <div class="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div class="absolute top-0 left-0 w-2 h-full bg-jacquier-gold"></div>
              <div class="w-12 h-12 bg-jacquier-cream rounded-full flex items-center justify-center text-jacquier-gold mb-6">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </div>
              <h3 class="text-2xl font-serif font-bold text-jacquier-dark mb-4">Réservations</h3>
              <p class="text-2xl font-bold text-jacquier-primary mb-2">{{ info.phone }}</p>
              <p class="text-jacquier-text font-light">{{ info.email }}</p>
            </div>

            <div class="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div class="absolute top-0 left-0 w-2 h-full bg-jacquier-dark"></div>
              <div class="w-12 h-12 bg-jacquier-cream rounded-full flex items-center justify-center text-jacquier-dark mb-6">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 class="text-2xl font-serif font-bold text-jacquier-dark mb-4">Horaires</h3>
              <p class="text-jacquier-text font-light leading-relaxed">{{ info.hours }}</p>
              <p class="text-sm text-jacquier-gold mt-2 uppercase tracking-wider font-bold">Ouvert les jours fériés</p>
            </div>
          </div>

          <!-- Map -->
          <div class="lg:w-2/3 h-[600px] lg:h-auto bg-gray-200 rounded-3xl overflow-hidden shadow-2xl relative border border-gray-100">
            <iframe 
              width="100%" 
              height="100%" 
              frameborder="0" 
              scrolling="no" 
              marginheight="0" 
              marginwidth="0" 
              src="https://maps.google.com/maps?q=Kipe,%20Conakry,%20Guinee&t=&z=15&ie=UTF8&iwloc=&output=embed"
              class="absolute inset-0 w-full h-full grayscale contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            </iframe>
            <div class="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 max-w-xs">
              <div class="flex items-start">
                <div class="w-10 h-10 bg-jacquier-primary rounded-full flex items-center justify-center text-white shrink-0 mr-4">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <h4 class="font-bold text-jacquier-dark mb-1">Repère</h4>
                  <p class="text-sm text-jacquier-text font-light">Face au Lycée Kipé / Carrefour Métal</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `
})
export class ContactComponent {
  restaurantService = inject(RestaurantService);
  info = this.restaurantService.info;
}
