
import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RestaurantService } from '../../core/services/restaurant.service';
import { SiteSettingsService } from '../../core/services/site-settings.service';

// Motif de mise en page "masonry" répété tous les 6 éléments, pour garder un rendu
// visuel riche quel que soit le nombre réel de photos renvoyées par l'API.
const LAYOUT_PATTERN = [
  'md:col-span-2 md:row-span-2',
  '',
  'md:row-span-2',
  '',
  'md:col-span-2',
  ''
];

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Hero -->
    <div class="relative h-[50vh] flex items-center justify-center text-center px-4 overflow-hidden bg-jacquier-dark">
      <img [ngSrc]="siteSettings.image('galleryHero', 'https://picsum.photos/seed/gallery_hero/1920/1080').url" fill priority class="object-cover opacity-40" [alt]="siteSettings.image('galleryHero', '').altText || 'Galerie'" referrerPolicy="no-referrer">
      <div class="relative z-10 max-w-4xl mx-auto text-white animate-fade-in-up">
        <span class="block text-jacquier-gold font-bold tracking-[0.2em] mb-4 uppercase text-sm md:text-base">Immersion visuelle</span>
        <h1 class="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">Galerie</h1>
      </div>
    </div>

    <section class="py-24 bg-jacquier-cream px-4">
      <div class="max-w-7xl mx-auto">

        <!-- Loading skeleton -->
        @if (isLoading()) {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] md:auto-rows-[300px]" role="status" aria-live="polite" aria-label="Chargement de la galerie">
            @for (i of skeletonPlaceholders; track i) {
              <div [class]="'relative overflow-hidden rounded-3xl bg-gray-200 animate-pulse ' + layoutFor(i)"></div>
            }
          </div>
        }

        <!-- Error state -->
        @else if (loadError()) {
          <div class="text-center py-24 bg-white rounded-3xl shadow-lg border border-red-100">
            <p class="text-red-600 text-xl mb-6 font-light">{{ loadError() }}</p>
            <button (click)="retry()" class="px-8 py-3 bg-jacquier-primary text-white rounded-xl font-bold uppercase tracking-wide hover:bg-jacquier-burgundy transition-colors min-h-[44px]">Réessayer</button>
          </div>
        }

        <!-- Empty state -->
        @else if (images().length === 0) {
          <div class="text-center py-24 bg-white rounded-3xl shadow-lg border border-gray-100">
            <p class="text-jacquier-text text-xl font-light">La galerie sera bientôt disponible.</p>
          </div>
        }

        <!-- Grid -->
        @else {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] md:auto-rows-[300px]">
            @for (image of images(); track image.id; let i = $index) {
              <div [class]="'relative overflow-hidden rounded-3xl group cursor-pointer shadow-lg ' + layoutFor(i)">
                <img [ngSrc]="image.imageUrl" fill class="object-cover transition-transform duration-1000 group-hover:scale-105" [alt]="image.title || 'Photo du restaurant Le Jacquier'" referrerPolicy="no-referrer">
                @if (image.title) {
                  <div class="absolute inset-0 bg-gradient-to-t from-jacquier-dark/80 via-jacquier-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <div>
                      @if (image.category) {
                        <span class="text-jacquier-gold text-xs font-bold tracking-widest uppercase mb-1 block">{{ image.category }}</span>
                      }
                      <h3 class="text-white font-serif text-xl font-bold">{{ image.title }}</h3>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    </section>
  `
})
export class GalleryComponent {
  private restaurantService = inject(RestaurantService);
  readonly siteSettings = inject(SiteSettingsService);
  images = this.restaurantService.getGalleryImages();
  isLoading = this.restaurantService.isLoadingGallery();
  loadError = this.restaurantService.getGalleryError();
  skeletonPlaceholders = Array.from({ length: 6 }, (_, i) => i);

  layoutFor(index: number): string {
    return LAYOUT_PATTERN[index % LAYOUT_PATTERN.length];
  }

  retry() {
    this.restaurantService.retryLoadGallery();
  }
}
