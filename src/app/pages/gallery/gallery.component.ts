import { ChangeDetectionStrategy, Component, ElementRef, HostListener, OnDestroy, computed, inject, signal, viewChild } from '@angular/core';
import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { RestaurantService } from '../../core/services/restaurant.service';
import { SiteSettingsService } from '../../core/services/site-settings.service';
import type { GalleryImage } from '../../core/models';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

const LAYOUT_PATTERN = [
  'md:col-span-2 md:row-span-2',
  '',
  'md:row-span-2',
  '',
  'md:col-span-2',
  ''
];

const CATEGORY_LABELS: Record<string, string> = {
  restaurant: 'Restaurant',
  cuisine: 'Cuisine',
  evenements: 'Événements',
  equipe: 'Équipe',
  ambiance: 'Ambiance',
  ecole: 'École gastronomique',
};

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [NgOptimizedImage, RevealOnScrollDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative h-[50vh] flex items-center justify-center text-center px-4 overflow-hidden bg-jacquier-dark">
      <img [ngSrc]="siteSettings.image('galleryHero', '/og-image.png').url" fill priority class="object-cover opacity-40" [alt]="siteSettings.image('galleryHero', '').altText || 'Galerie'" referrerPolicy="no-referrer">
      <div appRevealOnScroll revealVariant="fade-up" class="relative z-10 max-w-4xl mx-auto text-white">
        <span class="block text-jacquier-gold font-bold tracking-[0.2em] mb-4 uppercase text-sm md:text-base">Immersion visuelle</span>
        <h1 class="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">Galerie</h1>
      </div>
    </div>

    <section class="py-16 md:py-24 bg-jacquier-cream px-4">
      <div class="max-w-7xl mx-auto">
        @if (isLoading()) {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] md:auto-rows-[300px]" role="status" aria-live="polite" aria-label="Chargement de la galerie">
            @for (i of skeletonPlaceholders; track i) {
              <div [class]="'relative overflow-hidden rounded-3xl bg-gray-200 animate-pulse ' + layoutFor(i)"></div>
            }
          </div>
        } @else if (loadError()) {
          <div class="text-center py-24 bg-white rounded-3xl shadow-lg border border-red-100">
            <p class="text-red-600 text-xl mb-6 font-light">{{ loadError() }}</p>
            <button (click)="retry()" class="px-8 py-3 bg-jacquier-primary text-white rounded-xl font-bold uppercase tracking-wide hover:bg-jacquier-burgundy transition-colors min-h-[44px]">Réessayer</button>
          </div>
        } @else if (images().length === 0) {
          <div class="text-center py-24 bg-white rounded-3xl shadow-lg border border-gray-100">
            <p class="text-jacquier-text text-xl font-light">La galerie sera bientôt disponible.</p>
          </div>
        } @else {
          @if (categoryOptions().length > 1) {
            <nav appRevealOnScroll class="mb-10 flex gap-2 overflow-x-auto pb-3" aria-label="Filtrer la galerie">
              <button type="button" (click)="selectCategory('all')" [attr.aria-pressed]="activeCategory() === 'all'"
                [class]="activeCategory() === 'all'
                  ? 'shrink-0 rounded-full bg-jacquier-primary px-5 py-2.5 text-sm font-bold text-white'
                  : 'shrink-0 rounded-full border border-jacquier-primary/30 bg-white px-5 py-2.5 text-sm font-bold text-jacquier-primary hover:border-jacquier-primary'">
                Tout
              </button>
              @for (category of categoryOptions(); track category) {
                <button type="button" (click)="selectCategory(category)" [attr.aria-pressed]="activeCategory() === category"
                  [class]="activeCategory() === category
                    ? 'shrink-0 rounded-full bg-jacquier-primary px-5 py-2.5 text-sm font-bold text-white'
                    : 'shrink-0 rounded-full border border-jacquier-primary/30 bg-white px-5 py-2.5 text-sm font-bold text-jacquier-primary hover:border-jacquier-primary'">
                  {{ categoryLabel(category) }}
                </button>
              }
            </nav>
          }

          @if (filteredImages().length) {
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] md:auto-rows-[300px]">
              @for (image of filteredImages(); track image.id; let i = $index) {
                <button type="button" (click)="openLightbox(image)" appRevealOnScroll revealVariant="fade-scale" [revealDelay]="i * 70"
                  [attr.aria-label]="'Agrandir ' + (image.title || 'cette photo')"
                  [class]="'relative overflow-hidden rounded-3xl group cursor-zoom-in shadow-lg text-left transition-shadow duration-700 hover:shadow-2xl ' + layoutFor(i)">
                  <img [ngSrc]="image.imageUrl" fill class="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.035]" [alt]="image.title || 'Photo du restaurant Le Jacquier'" referrerPolicy="no-referrer">
                  <div class="absolute inset-0 bg-gradient-to-t from-jacquier-dark/85 via-jacquier-dark/15 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <div>
                      <span class="text-jacquier-gold text-xs font-bold tracking-widest uppercase mb-1 block">{{ categoryLabel(normalizedCategory(image.category)) }}</span>
                      @if (image.title) {
                        <h2 class="text-white font-serif text-xl font-bold">{{ image.title }}</h2>
                      }
                    </div>
                  </div>
                </button>
              }
            </div>
          } @else {
            <div class="text-center py-16 bg-white rounded-3xl border border-gray-100">
              <p class="text-jacquier-text">Aucune photo dans cette catégorie.</p>
            </div>
          }
        }
      </div>
    </section>

    @if (selectedImage(); as selected) {
      <div #lightboxDialog class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-3 md:p-8"
        role="dialog" aria-modal="true" tabindex="-1"
        [attr.aria-label]="'Aperçu de ' + (selected.title || 'la photo')"
        (click)="closeLightbox()">
        <div class="relative flex h-full w-full max-w-7xl flex-col items-center justify-center" (click)="$event.stopPropagation()">
          <button #lightboxCloseButton type="button" (click)="closeLightbox()" aria-label="Fermer l’aperçu"
            class="absolute right-0 top-0 z-20 rounded-full border border-white/30 bg-black/50 px-4 py-2 text-sm font-bold text-white hover:bg-white hover:text-black">
            Fermer
          </button>

          @if (filteredImages().length > 1) {
            <button type="button" (click)="previousImage()" aria-label="Photo précédente"
              class="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/55 p-3 text-2xl text-white hover:bg-white hover:text-black">‹</button>
            <button type="button" (click)="nextImage()" aria-label="Photo suivante"
              class="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/55 p-3 text-2xl text-white hover:bg-white hover:text-black">›</button>
          }

          <img [src]="selected.imageUrl" [alt]="selected.title || 'Photo du restaurant Le Jacquier'"
            class="gallery-lightbox-image max-h-[78vh] max-w-full rounded-2xl object-contain shadow-2xl" />

          <div class="mt-4 max-w-3xl text-center text-white">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-jacquier-gold">{{ categoryLabel(normalizedCategory(selected.category)) }}</p>
            @if (selected.title) { <p class="mt-1 font-serif text-xl md:text-2xl">{{ selected.title }}</p> }
            <p class="mt-2 text-xs text-white/60">{{ selectedPosition() }} / {{ filteredImages().length }}</p>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .gallery-lightbox-image { animation: galleryIn 520ms cubic-bezier(.22,.61,.36,1) both; }
    @keyframes galleryIn { from { opacity: 0; transform: scale(.985); } to { opacity: 1; transform: scale(1); } }
    @media (prefers-reduced-motion: reduce) { .gallery-lightbox-image { animation: none; } }
  `]
})
export class GalleryComponent implements OnDestroy {
  private readonly restaurantService = inject(RestaurantService);
  private readonly document = inject(DOCUMENT);
  private readonly lightboxDialog = viewChild<ElementRef<HTMLElement>>('lightboxDialog');
  private readonly lightboxCloseButton = viewChild<ElementRef<HTMLButtonElement>>('lightboxCloseButton');
  private previousFocus: HTMLElement | null = null;
  readonly siteSettings = inject(SiteSettingsService);

  readonly images = this.restaurantService.getGalleryImages();
  readonly isLoading = this.restaurantService.isLoadingGallery();
  readonly loadError = this.restaurantService.getGalleryError();
  readonly activeCategory = signal('all');
  readonly selectedImage = signal<GalleryImage | null>(null);
  readonly skeletonPlaceholders = Array.from({ length: 6 }, (_, i) => i);

  readonly categoryOptions = computed(() => {
    const categories = new Set(this.images().map(image => this.normalizedCategory(image.category)));
    return Array.from(categories).sort((a, b) => this.categoryLabel(a).localeCompare(this.categoryLabel(b), 'fr'));
  });

  readonly filteredImages = computed(() => {
    const active = this.activeCategory();
    return active === 'all'
      ? this.images()
      : this.images().filter(image => this.normalizedCategory(image.category) === active);
  });

  readonly selectedPosition = computed(() => {
    const selected = this.selectedImage();
    if (!selected) return 0;
    const index = this.filteredImages().findIndex(image => image.id === selected.id);
    return index < 0 ? 0 : index + 1;
  });

  layoutFor(index: number): string {
    return LAYOUT_PATTERN[index % LAYOUT_PATTERN.length];
  }

  normalizedCategory(value: string): string {
    return CATEGORY_LABELS[value] ? value : 'restaurant';
  }

  categoryLabel(value: string): string {
    return CATEGORY_LABELS[value] ?? 'Restaurant';
  }

  selectCategory(category: string): void {
    this.activeCategory.set(category);
    this.selectedImage.set(null);
  }

  openLightbox(image: GalleryImage): void {
    this.previousFocus = this.document.activeElement instanceof HTMLElement ? this.document.activeElement : null;
    this.selectedImage.set(image);
    this.document.body.style.overflow = 'hidden';
    queueMicrotask(() => this.lightboxCloseButton()?.nativeElement.focus());
  }

  closeLightbox(): void {
    if (!this.selectedImage()) return;
    this.selectedImage.set(null);
    this.document.body.style.overflow = '';
    queueMicrotask(() => this.previousFocus?.focus());
  }

  nextImage(): void {
    const images = this.filteredImages();
    const selected = this.selectedImage();
    if (!images.length || !selected) return;
    const index = images.findIndex(image => image.id === selected.id);
    this.selectedImage.set(images[(index + 1 + images.length) % images.length]);
  }

  previousImage(): void {
    const images = this.filteredImages();
    const selected = this.selectedImage();
    if (!images.length || !selected) return;
    const index = images.findIndex(image => image.id === selected.id);
    this.selectedImage.set(images[(index - 1 + images.length) % images.length]);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.selectedImage()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeLightbox();
      return;
    }
    if (event.key === 'ArrowRight') this.nextImage();
    if (event.key === 'ArrowLeft') this.previousImage();
    if (event.key === 'Tab') this.trapLightboxFocus(event);
  }

  private trapLightboxFocus(event: KeyboardEvent): void {
    const root = this.lightboxDialog()?.nativeElement;
    if (!root) return;
    const focusable = Array.from(root.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    ));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && this.document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && this.document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  ngOnDestroy(): void {
    this.document.body.style.overflow = '';
  }

  retry(): void {
    void this.restaurantService.retryLoadGallery();
  }
}
