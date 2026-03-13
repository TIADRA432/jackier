import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MenuService } from '../../core/services/menu.service';
import { MenuCategory, MenuItem, WineItem } from '../../core/models/menu.models';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#fcfbf9] text-gray-900 font-sans">
      
      <!-- Section 1: Hero -->
      <section class="relative h-[60vh] md:h-[80vh] w-full overflow-hidden flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src="https://picsum.photos/seed/gastronomy/1920/1080" 
          alt="Le Jacquier Restaurant" 
          class="absolute inset-0 w-full h-full object-cover"
          referrerpolicy="no-referrer"
        />
        <div class="relative z-20 text-center text-white px-4">
          <p class="text-sm md:text-base uppercase tracking-[0.3em] mb-4 font-medium">Le Jacquier</p>
          <h1 class="text-5xl md:text-7xl lg:text-8xl serif mb-6">Carte Gastronomique</h1>
          <p class="text-lg md:text-xl font-light max-w-2xl mx-auto opacity-90">
            Une expérience culinaire d'exception, alliant tradition et modernité.
          </p>
        </div>
      </section>

      <!-- Section 2: Navigation -->
      <section class="sticky top-0 z-30 bg-[#fcfbf9]/95 backdrop-blur-md border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4">
          <nav class="flex overflow-x-auto hide-scrollbar py-4 gap-8 justify-start md:justify-center">
            @for (cat of categories(); track cat.id) {
              <button 
                (click)="selectedCategoryId.set(cat.id!)"
                class="whitespace-nowrap text-sm uppercase tracking-widest transition-all duration-300 pb-1 border-b-2"
                [class.border-gray-900]="selectedCategoryId() === cat.id"
                [class.text-gray-900]="selectedCategoryId() === cat.id"
                [class.border-transparent]="selectedCategoryId() !== cat.id"
                [class.text-gray-400]="selectedCategoryId() !== cat.id"
                [class.hover:text-gray-600]="selectedCategoryId() !== cat.id"
              >
                {{ cat.name }}
              </button>
            }
            <button 
              (click)="selectedCategoryId.set('wines')"
              class="whitespace-nowrap text-sm uppercase tracking-widest transition-all duration-300 pb-1 border-b-2"
              [class.border-gray-900]="selectedCategoryId() === 'wines'"
              [class.text-gray-900]="selectedCategoryId() === 'wines'"
              [class.border-transparent]="selectedCategoryId() !== 'wines'"
              [class.text-gray-400]="selectedCategoryId() !== 'wines'"
              [class.hover:text-gray-600]="selectedCategoryId() !== 'wines'"
            >
              Carte des Vins
            </button>
          </nav>
        </div>
      </section>

      <!-- Section 3 & 4: Menu Content -->
      <main class="max-w-4xl mx-auto px-4 py-16 md:py-24 min-h-[50vh]">
        
        @if (loading()) {
          <div class="flex justify-center items-center h-40">
            <mat-icon class="animate-spin text-gray-400">refresh</mat-icon>
          </div>
        } @else {
          
          <!-- Food Items -->
          @if (selectedCategoryId() !== 'wines') {
            <div class="space-y-16 animate-fade-in">
              
              <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl serif mb-4">{{ currentCategory()?.name }}</h2>
                @if (currentCategory()?.description) {
                  <p class="text-gray-500 max-w-2xl mx-auto italic">{{ currentCategory()?.description }}</p>
                }
              </div>

              <div class="grid gap-12 md:gap-16">
                @for (item of filteredMenuItems(); track item.id) {
                  <article class="group flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start">
                    
                    <div class="w-full md:w-1/3 overflow-hidden rounded-lg aspect-[4/3] md:aspect-square bg-gray-100">
                      @if (item.imageUrl) {
                        <img 
                          [src]="item.imageUrl" 
                          [alt]="item.name"
                          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          referrerpolicy="no-referrer"
                        />
                      } @else {
                        <div class="w-full h-full flex items-center justify-center text-gray-300">
                          <mat-icon class="scale-150">restaurant</mat-icon>
                        </div>
                      }
                    </div>

                    <div class="w-full md:w-2/3 flex flex-col justify-center h-full pt-2">
                      <div class="flex flex-col md:flex-row md:items-baseline justify-between mb-3 gap-2 md:gap-4">
                        <h3 class="text-xl md:text-2xl serif font-medium">{{ item.name }}</h3>
                        <div class="hidden md:block flex-grow border-b border-dotted border-gray-300 mx-4"></div>
                        <span class="text-lg font-medium whitespace-nowrap">{{ item.price }} €</span>
                      </div>
                      
                      <p class="text-gray-600 mb-4">{{ item.shortDescription }}</p>
                      
                      @if (item.description) {
                        <p class="text-sm text-gray-400 italic">{{ item.description }}</p>
                      }
                    </div>
                  </article>
                }
                
                @if (filteredMenuItems().length === 0) {
                  <p class="text-center text-gray-400 italic py-10">Aucun plat disponible dans cette catégorie pour le moment.</p>
                }
              </div>
            </div>
          }

          <!-- Wine Items -->
          @if (selectedCategoryId() === 'wines') {
            <div class="space-y-16 animate-fade-in">
              
              <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl serif mb-4">Carte des Vins</h2>
                <p class="text-gray-500 max-w-2xl mx-auto italic">Une sélection rigoureuse de notre sommelier.</p>
              </div>

              <div class="grid gap-10 md:grid-cols-2">
                @for (wine of wines(); track wine.id) {
                  <article class="border border-gray-100 p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div class="flex justify-between items-start mb-2">
                      <h3 class="text-xl serif font-medium pr-4">{{ wine.name }} {{ wine.year ? wine.year : '' }}</h3>
                      <div class="text-right whitespace-nowrap">
                        @if (wine.priceGlass) {
                          <div class="text-sm text-gray-500">Verre: <span class="text-gray-900 font-medium">{{ wine.priceGlass }} €</span></div>
                        }
                        <div class="text-sm text-gray-500">Bouteille: <span class="text-gray-900 font-medium">{{ wine.priceBottle }} €</span></div>
                      </div>
                    </div>
                    
                    <div class="text-xs uppercase tracking-wider text-gray-400 mb-4">
                      {{ wine.origin }} • {{ wine.grape }}
                    </div>
                    
                    <p class="text-gray-600 text-sm mb-4">{{ wine.description }}</p>
                    
                    @if (wine.pairingSuggestion) {
                      <div class="bg-gray-50 p-3 rounded-lg text-sm">
                        <span class="font-medium text-gray-700">Accord parfait :</span> 
                        <span class="text-gray-600 italic">{{ wine.pairingSuggestion }}</span>
                      </div>
                    }
                  </article>
                }
                
                @if (wines().length === 0) {
                  <p class="text-center text-gray-400 italic py-10 col-span-full">Aucun vin disponible pour le moment.</p>
                }
              </div>
            </div>
          }
        }
      </main>

      <!-- Section 5: CTA -->
      <section class="bg-gray-900 text-white py-20 text-center px-4">
        <h2 class="text-3xl serif mb-6">L'expérience vous tente ?</h2>
        <p class="text-gray-400 mb-10 max-w-md mx-auto">Réservez votre table dès maintenant pour découvrir notre carte gastronomique.</p>
        <button mat-flat-button class="!bg-white !text-gray-900 !px-8 !py-6 !rounded-none !text-sm !tracking-widest !uppercase hover:!bg-gray-100 transition-colors">
          Réserver une table
        </button>
      </section>

      <footer class="py-8 text-center text-sm text-gray-400 border-t border-gray-200">
        <p>&copy; 2026 Le Jacquier. Tous droits réservés.</p>
      </footer>
    </div>
  `,
  styles: [`
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit {
  private menuService = inject(MenuService);

  categories = signal<MenuCategory[]>([]);
  menuItems = signal<MenuItem[]>([]);
  wines = signal<WineItem[]>([]);
  
  selectedCategoryId = signal<string>('');
  loading = signal<boolean>(true);

  currentCategory = computed(() => {
    return this.categories().find(c => c.id === this.selectedCategoryId());
  });

  filteredMenuItems = computed(() => {
    return this.menuItems().filter(item => item.categoryId === this.selectedCategoryId() && item.active);
  });

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loading.set(true);
    
    // In a real app we'd use forkJoin, but for simplicity we'll chain or just load sequentially
    this.menuService.getCategories().subscribe({
      next: (cats) => {
        const activeCats = cats.filter(c => c.active).sort((a, b) => a.order - b.order);
        this.categories.set(activeCats);
        if (activeCats.length > 0 && !this.selectedCategoryId()) {
          this.selectedCategoryId.set(activeCats[0].id!);
        }
        
        this.menuService.getMenuItems().subscribe({
          next: (items) => {
            this.menuItems.set(items.sort((a, b) => a.displayOrder - b.displayOrder));
            
            this.menuService.getWines().subscribe({
              next: (wines) => {
                this.wines.set(wines.filter(w => w.active).sort((a, b) => a.displayOrder - b.displayOrder));
                this.loading.set(false);
              },
              error: () => this.loading.set(false)
            });
          },
          error: () => this.loading.set(false)
        });
      },
      error: () => this.loading.set(false)
    });
  }
}
