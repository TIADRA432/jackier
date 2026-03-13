import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-catering-hero',
  standalone: true,
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="relative h-screen flex items-center justify-center text-center px-4 overflow-hidden bg-jacquier-dark">
      <div class="absolute inset-0 z-0">
        <img ngSrc="https://picsum.photos/seed/catering_hero/1920/1080" priority fill class="object-cover opacity-50" alt="Service Traiteur & Événementiel" referrerPolicy="no-referrer">
        <div class="absolute inset-0 bg-gradient-to-b from-jacquier-dark/80 via-jacquier-dark/50 to-jacquier-dark/90"></div>
      </div>
      
      <div class="relative z-10 max-w-5xl mx-auto text-white animate-fade-in-up mt-20">
        <span class="block text-jacquier-gold font-bold tracking-[0.2em] mb-6 uppercase text-sm md:text-base">Le Jacquier Prestige</span>
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-8 leading-tight">
          Service Traiteur & Événementiel d’Exception
        </h1>
        <p class="text-lg md:text-2xl text-jacquier-light mb-12 max-w-3xl mx-auto font-light leading-relaxed">
          Organisation complète de vos mariages, baptêmes, anniversaires, événements d’entreprise et dîners VIP.
        </p>
        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button (click)="scrollToForm()" class="w-full sm:w-auto px-10 py-5 bg-jacquier-gold text-jacquier-dark rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-lg hover:shadow-jacquier-gold/30 min-h-[44px] text-sm">
            Demander un devis
          </button>
          <button (click)="scrollToServices()" class="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-white text-white rounded-xl font-bold uppercase tracking-widest hover:bg-white hover:text-jacquier-dark transition-all duration-300 min-h-[44px] text-sm">
            Voir nos prestations
          </button>
        </div>
      </div>
    </section>
  `
})
export class CateringHeroComponent {
  scrollToForm() {
    document.getElementById('devis-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToServices() {
    document.getElementById('prestations')?.scrollIntoView({ behavior: 'smooth' });
  }
}
