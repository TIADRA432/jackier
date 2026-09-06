import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-catering-testimonials',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-24 lg:py-32 bg-jacquier-cream px-4 overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-20 lg:mb-24">
          <span class="text-jacquier-gold font-bold tracking-[0.2em] uppercase text-sm block mb-4">Témoignages</span>
          <h2 class="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-jacquier-primary">Ils Nous Font Confiance</h2>
        </div>
        
        <div class="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-8 pb-8 lg:grid lg:grid-cols-3 lg:overflow-visible lg:snap-none lg:pb-0">
          @for (testimonial of testimonials; track testimonial.author) {
            <div class="snap-center shrink-0 w-[85vw] md:w-[60vw] lg:w-auto bg-white p-10 lg:p-12 rounded-3xl shadow-xl border border-gray-100 relative">
              <div class="absolute -top-6 left-10 w-12 h-12 bg-jacquier-gold rounded-full flex items-center justify-center text-white text-3xl font-serif shadow-lg">
                "
              </div>
              <p class="text-jacquier-text font-light text-lg leading-relaxed mb-8 italic">
                {{ testimonial.text }}
              </p>
              <div class="flex items-center">
                <div class="w-12 h-12 rounded-full bg-jacquier-cream flex items-center justify-center text-jacquier-primary font-bold text-xl mr-4">
                  {{ testimonial.author.charAt(0) }}
                </div>
                <div>
                  <h4 class="font-bold text-jacquier-dark">{{ testimonial.author }}</h4>
                  <p class="text-sm text-jacquier-gold font-bold uppercase tracking-widest">{{ testimonial.event }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class CateringTestimonialsComponent {
  testimonials = [
    { text: 'Le service traiteur du Jacquier a rendu notre mariage inoubliable. Le buffet était somptueux et l\'équipe d\'un professionnalisme rare à Conakry.', author: 'Aïssatou & Mamadou', event: 'Mariage' },
    { text: 'Pour notre séminaire annuel, nous voulions l\'excellence. Le Jacquier a relevé le défi avec brio : ponctualité, qualité des mets et service discret.', author: 'Société Générale Guinée', event: 'Événement Corporate' },
    { text: 'Un dîner d\'anniversaire parfait à domicile. Le chef a su s\'adapter à nos demandes spécifiques et a ébloui nos convives avec ses créations.', author: 'Fatoumata B.', event: 'Dîner Privé' }
  ];
}
