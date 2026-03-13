
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { RestaurantService } from '../../core/services/restaurant.service';

@Component({
  selector: 'app-catering',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Hero -->
    <div class="relative h-[70vh] flex items-center justify-center text-center px-4 overflow-hidden bg-jacquier-dark">
      <img ngSrc="https://picsum.photos/seed/catering_event/1920/1080" fill priority class="object-cover opacity-40" alt="Service Traiteur" referrerPolicy="no-referrer">
      <div class="relative z-10 max-w-5xl mx-auto text-white animate-fade-in-up">
        <span class="block text-jacquier-gold font-bold tracking-[0.2em] mb-4 uppercase text-sm md:text-base">Le Jacquier Événements</span>
        <h1 class="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">L'Art de Recevoir</h1>
        <p class="text-lg md:text-2xl text-jacquier-light mb-10 max-w-3xl mx-auto font-light leading-relaxed">
          Mariages, séminaires, dîners privés... Apportez l'excellence gastronomique du Jacquier à vos événements les plus prestigieux.
        </p>
        <a href="#contact-devis" class="inline-flex items-center justify-center px-8 py-4 bg-jacquier-gold text-jacquier-dark rounded-xl font-bold uppercase tracking-wide hover:bg-yellow-500 transition-all shadow-lg hover:shadow-jacquier-gold/30 min-h-[44px]">
          Demander un devis
        </a>
      </div>
    </div>

    <!-- Services Grid -->
    <section class="py-24 bg-jacquier-cream px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-20">
          <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm block mb-2">Prestations Sur-Mesure</span>
          <h2 class="text-4xl md:text-5xl font-serif font-bold text-jacquier-primary">Nos Services Traiteur</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          @for (service of services(); track service.id) {
            <div class="bg-white p-10 rounded-2xl text-center hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
              <div class="w-20 h-20 mx-auto bg-jacquier-cream rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                {{ service.icon }}
              </div>
              <h3 class="text-2xl font-serif font-bold text-jacquier-dark mb-4">{{ service.title }}</h3>
              <p class="text-gray-600 font-light leading-relaxed">{{ service.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Timeline / Organisation -->
    <section class="py-24 bg-white px-4">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-20">
          <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm block mb-2">Notre Méthodologie</span>
          <h2 class="text-4xl md:text-5xl font-serif font-bold text-jacquier-primary">L'Organisation Parfaite</h2>
        </div>
        
        <div class="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-jacquier-gold/30 before:to-transparent">
          <!-- Step 1 -->
          <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-jacquier-gold text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">1</div>
            <div class="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-jacquier-cream p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 class="font-serif font-bold text-xl text-jacquier-dark mb-2">Rencontre & Dégustation</h3>
              <p class="text-gray-600 font-light text-sm">Échange sur vos attentes, définition du menu et dégustation personnalisée avec notre Chef.</p>
            </div>
          </div>
          <!-- Step 2 -->
          <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-jacquier-gold text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">2</div>
            <div class="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-jacquier-cream p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 class="font-serif font-bold text-xl text-jacquier-dark mb-2">Planification Logistique</h3>
              <p class="text-gray-600 font-light text-sm">Repérage des lieux, gestion du matériel et coordination avec vos autres prestataires.</p>
            </div>
          </div>
          <!-- Step 3 -->
          <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-jacquier-gold text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">3</div>
            <div class="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-jacquier-cream p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 class="font-serif font-bold text-xl text-jacquier-dark mb-2">Le Jour J</h3>
              <p class="text-gray-600 font-light text-sm">Service impeccable, discrétion et excellence gastronomique pour éblouir vos convives.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-24 bg-jacquier-primary text-white px-4">
      <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div class="lg:w-1/2">
          <div class="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
            <img ngSrc="https://picsum.photos/seed/buffet/800/600" fill class="object-cover" alt="Buffet Prestige" referrerPolicy="no-referrer">
          </div>
        </div>
        <div class="lg:w-1/2">
          <span class="text-jacquier-gold uppercase tracking-widest font-bold mb-2 block text-sm">Excellence & Logistique</span>
          <h2 class="text-4xl md:text-5xl font-serif font-bold mb-8">Nous nous occupons de tout</h2>
          <ul class="space-y-8">
            <li class="flex items-start">
              <div class="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-jacquier-gold mr-6">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                <strong class="block text-xl font-serif mb-2">Menus Personnalisés</strong>
                <span class="text-gray-300 font-light leading-relaxed">Adaptés à votre budget et vos envies (Cuisine locale, internationale ou fusion).</span>
              </div>
            </li>
            <li class="flex items-start">
              <div class="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-jacquier-gold mr-6">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                <strong class="block text-xl font-serif mb-2">Service Complet</strong>
                <span class="text-gray-300 font-light leading-relaxed">Mise en place, décoration, serveurs qualifiés et nettoyage.</span>
              </div>
            </li>
            <li class="flex items-start">
              <div class="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-jacquier-gold mr-6">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                <strong class="block text-xl font-serif mb-2">Logistique Maîtrisée</strong>
                <span class="text-gray-300 font-light leading-relaxed">Livraison en camion réfrigéré et installation sur site à Conakry et environs.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Simple Contact CTA -->
    <section id="contact-devis" class="py-24 bg-jacquier-cream px-4">
      <div class="max-w-4xl mx-auto text-center bg-white p-12 md:p-16 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-2 bg-jacquier-gold"></div>
        <h2 class="text-4xl font-serif font-bold text-jacquier-primary mb-6">Prêt à organiser votre événement ?</h2>
        <p class="text-jacquier-text font-light text-lg mb-10 max-w-2xl mx-auto">
          Contactez notre responsable traiteur pour une proposition personnalisée sous 24h.
        </p>
        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a href="tel:+224625675363" class="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-jacquier-primary text-white rounded-xl font-bold hover:bg-jacquier-burgundy transition-colors min-h-[44px]">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            +224 625 67 53 63
          </a>
          <a routerLink="/contact" class="w-full sm:w-auto flex items-center justify-center px-8 py-4 border-2 border-jacquier-primary text-jacquier-primary rounded-xl font-bold hover:bg-jacquier-primary hover:text-white transition-colors min-h-[44px]">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            Envoyer un message
          </a>
        </div>
      </div>
    </section>
  `
})
export class CateringComponent {
  restaurantService = inject(RestaurantService);
  services = this.restaurantService.getCateringServices();
}
