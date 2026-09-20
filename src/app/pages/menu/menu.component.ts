
import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { categoryFilters, filterDishes } from '../../core/models/menu-catalog';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { RestaurantService } from '../../core/services/restaurant.service';
import { DishCardComponent } from '../../shared/components/dish-card/dish-card.component';
import { SiteSettingsService } from '../../core/services/site-settings.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [DishCardComponent, FormsModule, DecimalPipe, NgOptimizedImage, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Hero -->
    <div class="relative min-h-[360px] pt-28 pb-14 flex items-center justify-center text-center px-4 overflow-hidden bg-jacquier-dark">
      <img [ngSrc]="siteSettings.image('menuHero', 'https://picsum.photos/seed/menu_hero/1920/1080').url" fill priority class="object-cover opacity-40" [alt]="siteSettings.image('menuHero', '').altText || 'Notre Menu'" referrerPolicy="no-referrer">
      <div class="relative z-10 max-w-4xl mx-auto text-white animate-fade-in-up">
        <span class="block text-jacquier-gold font-bold tracking-[0.2em] mb-4 uppercase text-sm md:text-base">Saveurs d'ici et d'ailleurs</span>
        <h1 class="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">Notre Carte</h1>
        <a routerLink="/reservation" class="inline-block rounded-xl bg-jacquier-primary px-6 py-3 font-bold text-white">Réserver une table</a>
      </div>
    </div>

    <section class="py-10 bg-jacquier-cream min-h-screen px-4">
      <div class="max-w-7xl mx-auto">

        <nav class="sticky top-16 z-30 -mx-4 mb-8 flex gap-3 overflow-x-auto bg-jacquier-cream px-4 py-3 shadow-sm" aria-label="Catégories de la carte">
          @for (filter of filters(); track filter.id) {
            <button type="button" (click)="activeFilter.set(filter.id)" [attr.aria-pressed]="activeFilter() === filter.id"
              class="shrink-0 rounded-full border border-jacquier-primary px-5 py-3 text-sm font-bold"
              [class.bg-jacquier-primary]="activeFilter() === filter.id" [class.text-white]="activeFilter() === filter.id">{{ filter.label }}</button>
          }
        </nav>
        <!-- Controls Container -->
        <div class="mb-16 space-y-10">

          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto relative">
            <label for="menu-search" class="sr-only">Rechercher un plat</label>
            <input
              id="menu-search"
              type="search"
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
              placeholder="Rechercher un plat (ex: Yassa, Thon...)"
              class="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-transparent focus:ring-0 focus:border-jacquier-gold outline-none shadow-lg bg-white text-jacquier-dark font-light text-lg transition-colors"
            >
            <svg class="w-6 h-6 text-jacquier-gold absolute left-5 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Price Range Filters -->
          <details class="max-w-3xl mx-auto bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <summary class="cursor-pointer font-bold text-jacquier-primary">Affiner par budget</summary>
            <div class="flex flex-col md:flex-row items-center gap-6 mt-6">
              <div class="flex-1 w-full">
                <div class="flex justify-between mb-4">
                  <label for="min-price" class="text-xs font-bold uppercase text-gray-500 tracking-wider">Prix Minimum</label>
                  <span class="text-base font-serif font-bold text-jacquier-primary">{{ minPrice() | number:'1.0-0' }} GNF</span>
                </div>
                <input
                  id="min-price"
                  type="range"
                  [min]="0"
                  [max]="priceCeiling()"
                  [step]="5000"
                  [ngModel]="minPrice()"
                  (ngModelChange)="setMinPrice($event)"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-jacquier-gold"
                >
              </div>
              <div class="flex-1 w-full">
                <div class="flex justify-between mb-4">
                  <label for="max-price" class="text-xs font-bold uppercase text-gray-500 tracking-wider">Prix Maximum</label>
                  <span class="text-base font-serif font-bold text-jacquier-primary">{{ effectiveMaxPrice() | number:'1.0-0' }} GNF</span>
                </div>
                <input
                  id="max-price"
                  type="range"
                  [min]="0"
                  [max]="priceCeiling()"
                  [step]="5000"
                  [ngModel]="effectiveMaxPrice()"
                  (ngModelChange)="setMaxPrice($event)"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-jacquier-gold"
                >
              </div>
            </div>
          </details>

          <div class="flex flex-wrap justify-center gap-4">
            <button type="button" (click)="showFeatured.set(!showFeatured())" [attr.aria-pressed]="showFeatured()" class="rounded-xl border border-jacquier-primary px-5 py-3 font-bold" [class.bg-jacquier-primary]="showFeatured()" [class.text-white]="showFeatured()">Suggestions de la Cheffe</button>
            <button type="button" (click)="resetFilters()" class="px-4 py-3 underline">Réinitialiser les filtres</button>
          </div>
          <!-- Preference Toggles -->
          <div class="flex flex-wrap justify-center gap-8 text-sm font-bold text-jacquier-text">
            <label class="flex items-center cursor-pointer space-x-3 select-none group min-h-[44px]">
              <div class="relative">
                <input type="checkbox" class="peer sr-only" [checked]="showVegetarian()" (change)="showVegetarian.set(!showVegetarian())">
                <div class="peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 w-12 h-7 bg-gray-200 rounded-full shadow-inner transition-colors" [class.bg-jacquier-green]="showVegetarian()"></div>
                <div class="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform" [class.translate-x-5]="showVegetarian()"></div>
              </div>
              <span class="group-hover:text-jacquier-green transition-colors">Végétarien</span>
            </label>

            <label class="flex items-center cursor-pointer space-x-3 select-none group min-h-[44px]">
              <div class="relative">
                <input type="checkbox" class="peer sr-only" [checked]="showSpicy()" (change)="showSpicy.set(!showSpicy())">
                <div class="peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 w-12 h-7 bg-gray-200 rounded-full shadow-inner transition-colors" [class.bg-red-500]="showSpicy()"></div>
                <div class="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform" [class.translate-x-5]="showSpicy()"></div>
              </div>
              <span class="group-hover:text-red-500 transition-colors">Épicé</span>
            </label>

            <label class="flex items-center cursor-pointer space-x-3 select-none group min-h-[44px]">
              <div class="relative">
                <input type="checkbox" class="peer sr-only" [checked]="showLocal()" (change)="showLocal.set(!showLocal())">
                <div class="peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 w-12 h-7 bg-gray-200 rounded-full shadow-inner transition-colors" [class.bg-jacquier-gold]="showLocal()"></div>
                <div class="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform" [class.translate-x-5]="showLocal()"></div>
              </div>
              <span class="group-hover:text-jacquier-gold transition-colors">Spécialité Locale</span>
            </label>
          </div>
        </div>

        <!-- Loading skeleton -->
        @if (isLoading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" role="status" aria-live="polite" aria-label="Chargement du menu">
            @for (i of skeletonPlaceholders; track i) {
              <div class="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
                <div class="h-48 bg-gray-200"></div>
                <div class="p-6 space-y-3">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-3 bg-gray-200 rounded w-full"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
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

        <!-- Grid -->
        @else if (filteredDishes().length > 0) {
          <p role="status" aria-live="polite" class="mb-6 text-jacquier-primary">{{ filteredDishes().length }} plat(s) à découvrir</p>
          @if (featuredDishes().length && !showFeatured()) {
            <section aria-labelledby="chef-title" class="mb-12">
              <h2 id="chef-title" class="mb-6 text-3xl font-serif text-jacquier-primary">Les suggestions de la Cheffe</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @for (dish of featuredDishes(); track dish.id) { <app-dish-card [dish]="dish" /> }
              </div>
            </section>
          }
          <h2 class="mb-6 text-3xl font-serif text-jacquier-primary">La carte</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            @for (dish of filteredDishes(); track dish.id) {
              <app-dish-card [dish]="dish" />
            }
          </div>
        } @else {
          <div class="text-center py-24 bg-white rounded-3xl shadow-lg border border-gray-100">
            <div class="w-20 h-20 mx-auto bg-jacquier-cream rounded-full flex items-center justify-center mb-6">
              <svg class="w-10 h-10 text-jacquier-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <p class="text-jacquier-text text-xl mb-6 font-light">{{ allDishes().length ? 'Aucun plat ne correspond à vos critères.' : 'La carte est en cours de préparation. Contactez-nous pour connaître les plats du jour.' }}</p>
            <button (click)="resetFilters()" class="px-8 py-3 bg-jacquier-primary text-white rounded-xl font-bold uppercase tracking-wide hover:bg-jacquier-burgundy transition-colors min-h-[44px]">Réinitialiser les filtres</button>
          </div>
        }
      </div>
    </section>
    <section class="bg-jacquier-primary px-6 py-14 text-center text-white">
      <h2 class="mb-4 text-3xl font-serif">Le plaisir se partage à table</h2>
      <p class="mb-6">Retrouvez-nous au Jacquier pour découvrir la cuisine de la Cheffe.</p>
      <a routerLink="/reservation" class="inline-block rounded-xl bg-white px-6 py-3 font-bold text-jacquier-primary">Réserver une table</a>
    </section>
  `
})
export class MenuComponent {
  restaurantService = inject(RestaurantService);
  readonly siteSettings = inject(SiteSettingsService);
  allDishes = this.restaurantService.getDishes(); // Readonly signal
  isLoading = this.restaurantService.isLoadingMenu();
  loadError = this.restaurantService.getMenuError();
  skeletonPlaceholders = Array.from({ length: 8 }, (_, i) => i);

  // State
  activeFilter = signal<string>('all');
  searchQuery = signal<string>('');
  showVegetarian = signal<boolean>(false);
  showSpicy = signal<boolean>(false);
  showLocal = signal<boolean>(false);
  minPrice = signal<number>(0);
  maxPrice = signal<number | null>(null);
  showFeatured = signal(false);
  priceCeiling = computed(() => Math.max(5000, ...this.allDishes().map(dish => Math.ceil(dish.price / 5000) * 5000)));
  effectiveMaxPrice = computed(() => this.maxPrice() ?? this.priceCeiling());
  setMinPrice(value: number) { this.minPrice.set(Math.min(Number(value), this.effectiveMaxPrice())); }
  setMaxPrice(value: number) { this.maxPrice.set(Math.max(Number(value), this.minPrice())); }

  filters = computed(() => categoryFilters(this.allDishes(), this.restaurantService.menuCategories()));
  filteredDishes = computed(() => filterDishes(this.allDishes(), this.restaurantService.menuCategories(), {
    query: this.searchQuery(), category: this.activeFilter(), vegetarian: this.showVegetarian(),
    spicy: this.showSpicy(), local: this.showLocal(), featured: this.showFeatured(),
    minPrice: this.minPrice(), maxPrice: this.effectiveMaxPrice()
  }));
  featuredDishes = computed(() => this.filteredDishes().filter(dish => dish.isFeatured).slice(0, 3));

  resetFilters() {
    this.activeFilter.set('all');
    this.searchQuery.set('');
    this.showVegetarian.set(false);
    this.showSpicy.set(false);
    this.showLocal.set(false);
    this.minPrice.set(0);
    this.maxPrice.set(null);
    this.showFeatured.set(false);
  }

  retry() {
    this.restaurantService.retryLoadDishes();
  }
}
