import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RestaurantService } from '../../../core/services/restaurant.service';

@Component({
  selector: 'app-catering-gallery',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (eventImages().length) {
      <section class="py-24 lg:py-32 bg-jacquier-dark px-4">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-20 lg:mb-24">
            <span class="text-jacquier-gold font-bold tracking-[0.2em] uppercase text-sm block mb-4">Galerie Événementielle</span>
            <h2 class="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white">Nos Réalisations</h2>
            <p class="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">Sélection issue directement de la galerie publique du Jacquier.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            @for (image of eventImages(); track image.id) {
              <article class="relative h-80 lg:h-96 rounded-3xl overflow-hidden group shadow-2xl">
                <img [src]="image.imageUrl" class="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.035]" [alt]="image.title || 'Événement Le Jacquier'" referrerPolicy="no-referrer">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent flex flex-col justify-end p-8">
                  <span class="text-jacquier-gold font-bold uppercase tracking-widest text-xs mb-2">Événement</span>
                  @if (image.title) { <h3 class="text-2xl font-serif font-bold text-white">{{ image.title }}</h3> }
                </div>
              </article>
            }
          </div>
        </div>
      </section>
    }
  `
})
export class CateringGalleryComponent {
  private readonly restaurantService = inject(RestaurantService);
  readonly eventImages = computed(() =>
    this.restaurantService.getGalleryImages()()
      .filter(image => image.category === 'evenements')
      .slice(0, 6)
  );
}
