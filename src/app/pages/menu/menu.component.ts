
import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { RestaurantService } from '../../core/services/restaurant.service';
import { DishCardComponent } from '../../shared/components/dish-card/dish-card.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [DishCardComponent, FormsModule, DecimalPipe, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Hero -->
    <div class="relative h-[50vh] flex items-center justify-center text-center px-4 overflow-hidden bg-jacquier-dark">
      <img ngSrc="https://picsum.photos/seed/menu_hero/1920/1080" fill priority class="object-cover opacity-40" alt="Notre Menu" referrerPolicy="no-referrer">
      <div class="relative z-10 max-w-4xl mx-auto text-white animate-fade-in-up">
        <span class="block text-jacquier-gold font-bold tracking-[0.2em] mb-4 uppercase text-sm md:text-base">Saveurs d'ici et d'ailleurs</span>
        <h1 class="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">Notre Carte</h1>
      </div>
    </div>

    <section class="py-24 bg-jacquier-cream min-h-screen px-4">
      <div class="max-w-7xl mx-auto">
        
        <!-- Controls Container -->
        <div class="mb-16 space-y-10">
          
          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto relative">
            <input 
              type="text" 
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
              placeholder="Rechercher un plat (ex: Yassa, Thon...)"
              class="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-transparent focus:ring-0 focus:border-jacquier-gold outline-none shadow-lg bg-white text-jacquier-dark font-light text-lg transition-colors"
            >
            <svg class="w-6 h-6 text-jacquier-gold absolute left-5 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Category Filters -->
          <div class="flex flex-wrap justify-center gap-4">
            @for (filter of filters; track filter.id) {
              <button 
                (click)="activeFilter.set(filter.id)"
                class="px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-all border-2 min-h-[44px]"
                [class.bg-jacquier-primary]="activeFilter() === filter.id"
                [class.text-white]="activeFilter() === filter.id"
                [class.border-jacquier-primary]="activeFilter() === filter.id"
                [class.bg-white]="activeFilter() !== filter.id"
                [class.text-jacquier-text]="activeFilter() !== filter.id"
                [class.border-transparent]="activeFilter() !== filter.id"
                [class.hover:border-jacquier-gold]="activeFilter() !== filter.id"
                [class.shadow-sm]="activeFilter() !== filter.id">
                {{ filter.label }}
              </button>
            }
          </div>

          <!-- Price Range Filters -->
          <div class="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <div class="flex flex-col md:flex-row items-center gap-12">
              <div class="flex-1 w-full">
                <div class="flex justify-between mb-4">
                  <span class="text-xs font-bold uppercase text-gray-500 tracking-wider">Prix Minimum</span>
                  <span class="text-base font-serif font-bold text-jacquier-primary">{{ minPrice() | number:'1.0-0' }} FG</span>
                </div>
                <input 
                  type="range" 
                  [min]="0" 
                  [max]="1000000" 
                  [step]="5000"
                  [ngModel]="minPrice()"
                  (ngModelChange)="minPrice.set($event)"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-jacquier-gold"
                >
              </div>
              <div class="flex-1 w-full">
                <div class="flex justify-between mb-4">
                  <span class="text-xs font-bold uppercase text-gray-500 tracking-wider">Prix Maximum</span>
                  <span class="text-base font-serif font-bold text-jacquier-primary">{{ maxPrice() | number:'1.0-0' }} FG</span>
                </div>
                <input 
                  type="range" 
                  [min]="0" 
                  [max]="1000000" 
                  [step]="5000"
                  [ngModel]="maxPrice()"
                  (ngModelChange)="maxPrice.set($event)"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-jacquier-gold"
                >
              </div>
            </div>
          </div>

          <!-- Preference Toggles -->
          <div class="flex flex-wrap justify-center gap-8 text-sm font-bold text-jacquier-text">
            <label class="flex items-center cursor-pointer space-x-3 select-none group min-h-[44px]">
              <div class="relative">
                <input type="checkbox" class="sr-only" [checked]="showVegetarian()" (change)="showVegetarian.set(!showVegetarian())">
                <div class="w-12 h-7 bg-gray-200 rounded-full shadow-inner transition-colors" [class.bg-jacquier-green]="showVegetarian()"></div>
                <div class="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform" [class.translate-x-5]="showVegetarian()"></div>
              </div>
              <span class="group-hover:text-jacquier-green transition-colors">Végétarien</span>
            </label>

            <label class="flex items-center cursor-pointer space-x-3 select-none group min-h-[44px]">
              <div class="relative">
                <input type="checkbox" class="sr-only" [checked]="showSpicy()" (change)="showSpicy.set(!showSpicy())">
                <div class="w-12 h-7 bg-gray-200 rounded-full shadow-inner transition-colors" [class.bg-red-500]="showSpicy()"></div>
                <div class="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform" [class.translate-x-5]="showSpicy()"></div>
              </div>
              <span class="group-hover:text-red-500 transition-colors">Épicé</span>
            </label>

            <label class="flex items-center cursor-pointer space-x-3 select-none group min-h-[44px]">
              <div class="relative">
                <input type="checkbox" class="sr-only" [checked]="showLocal()" (change)="showLocal.set(!showLocal())">
                <div class="w-12 h-7 bg-gray-200 rounded-full shadow-inner transition-colors" [class.bg-jacquier-gold]="showLocal()"></div>
                <div class="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform" [class.translate-x-5]="showLocal()"></div>
              </div>
              <span class="group-hover:text-jacquier-gold transition-colors">Spécialité Locale</span>
            </label>
          </div>
        </div>

        <!-- Grid -->
        @if (filteredDishes().length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in-up">
            @for (dish of filteredDishes(); track dish.id) {
              <app-dish-card [dish]="dish" />
            }
          </div>
        } @else {
          <div class="text-center py-24 bg-white rounded-3xl shadow-lg border border-gray-100">
            <div class="w-20 h-20 mx-auto bg-jacquier-cream rounded-full flex items-center justify-center mb-6">
              <svg class="w-10 h-10 text-jacquier-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <p class="text-jacquier-text text-xl mb-6 font-light">Aucun plat ne correspond à vos critères.</p>
            <button (click)="resetFilters()" class="px-8 py-3 bg-jacquier-primary text-white rounded-xl font-bold uppercase tracking-wide hover:bg-jacquier-burgundy transition-colors min-h-[44px]">Réinitialiser les filtres</button>
          </div>
        }
      </div>
    </section>
  `
})
export class MenuComponent {
  restaurantService = inject(RestaurantService);
  allDishes = this.restaurantService.getDishes(); // Readonly signal
  
  // State
  activeFilter = signal<string>('all');
  searchQuery = signal<string>('');
  showVegetarian = signal<boolean>(false);
  showSpicy = signal<boolean>(false);
  showLocal = signal<boolean>(false);
  minPrice = signal<number>(0);
  maxPrice = signal<number>(1000000);
  
  filters = [
    { id: 'all', label: 'Tout' },
    { id: 'entree', label: 'Entrées' },
    { id: 'plat', label: 'Plats' },
    { id: 'local', label: 'Cuisine Locale' },
    { id: 'fruits_de_mer', label: 'Fruits de Mer' },
    { id: 'dessert', label: 'Desserts' },
    { id: 'boisson', label: 'Boissons' },
    { id: 'vin', label: 'Vins' }
  ];

  filteredDishes = computed(() => {
    let dishes = this.allDishes();
    const query = this.searchQuery().toLowerCase();
    const catFilter = this.activeFilter();

    // 1. Search Filter
    if (query) {
      dishes = dishes.filter(d => 
        d.name.toLowerCase().includes(query) || 
        d.description.toLowerCase().includes(query)
      );
    }

    // 2. Category Filter
    if (catFilter !== 'all') {
      dishes = dishes.filter(d => d.category === catFilter);
    }

    // 3. Boolean Filters
    if (this.showVegetarian()) {
      dishes = dishes.filter(d => d.isVegetarian);
    }
    if (this.showSpicy()) {
      dishes = dishes.filter(d => d.isSpicy);
    }
    if (this.showLocal()) {
      dishes = dishes.filter(d => d.isLocalSpecialty);
    }

    // 4. Price Filter
    dishes = dishes.filter(d => d.price >= this.minPrice() && d.price <= this.maxPrice());

    return dishes;
  });

  resetFilters() {
    this.activeFilter.set('all');
    this.searchQuery.set('');
    this.showVegetarian.set(false);
    this.showSpicy.set(false);
    this.showLocal.set(false);
    this.minPrice.set(0);
    this.maxPrice.set(1000000);
  }
}
