import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-catering-gallery',
  standalone: true,
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-24 lg:py-32 bg-jacquier-dark px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-20 lg:mb-24">
          <span class="text-jacquier-gold font-bold tracking-[0.2em] uppercase text-sm block mb-4">Galerie Événementielle</span>
          <h2 class="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white">Nos Réalisations</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          @for (image of images; track image.src) {
            <div class="relative h-80 lg:h-96 rounded-3xl overflow-hidden group cursor-pointer shadow-2xl">
              <img [ngSrc]="image.src" fill class="object-cover transform group-hover:scale-110 transition-transform duration-1000" [alt]="image.alt" referrerPolicy="no-referrer">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <span class="text-jacquier-gold font-bold uppercase tracking-widest text-xs mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">{{ image.category }}</span>
                <h3 class="text-2xl font-serif font-bold text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">{{ image.title }}</h3>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class CateringGalleryComponent {
  images = [
    { src: 'https://picsum.photos/seed/wedding_table/800/1000', alt: 'Table de mariage', category: 'Mariages', title: 'Dîner de Noces' },
    { src: 'https://picsum.photos/seed/corporate_buffet/800/1000', alt: 'Buffet d\'entreprise', category: 'Corporate', title: 'Cocktail Dînatoire' },
    { src: 'https://picsum.photos/seed/vip_dinner/800/1000', alt: 'Dîner VIP', category: 'Dîners VIP', title: 'Soirée Privée' },
    { src: 'https://picsum.photos/seed/event_decor/800/1000', alt: 'Décoration événementielle', category: 'Décoration', title: 'Mise en Place' },
    { src: 'https://picsum.photos/seed/wedding_cake/800/1000', alt: 'Gâteau de mariage', category: 'Pâtisserie', title: 'Pièce Montée' },
    { src: 'https://picsum.photos/seed/event_service/800/1000', alt: 'Service en salle', category: 'Service', title: 'Équipe en Action' }
  ];
}
