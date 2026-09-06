
import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RestaurantService } from '../../core/services/restaurant.service';
import { DailySpecialComponent } from '../../shared/components/daily-special/daily-special.component';
import { NgOptimizedImage, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DailySpecialComponent, NgOptimizedImage, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Hero Section -->
    <section class="relative h-screen flex items-center justify-center text-center px-4 overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img ngSrc="https://picsum.photos/seed/jacquier_interior/1920/1080" priority fill 
             class="object-cover w-full h-full" alt="Intérieur du restaurant Le Jacquier"
             referrerPolicy="no-referrer">
        <div class="absolute inset-0 bg-jacquier-dark/60"></div>
      </div>
      
      <div class="relative z-10 max-w-5xl mx-auto text-white animate-fade-in-up">
        <span class="block text-jacquier-gold font-bold tracking-[0.2em] mb-4 uppercase text-sm md:text-base">Bienvenue à Conakry</span>
        <h1 class="text-6xl md:text-8xl font-serif font-bold mb-6 leading-tight">
          Le Jacquier
        </h1>
        <p class="text-lg md:text-2xl text-jacquier-light mb-10 font-light max-w-2xl mx-auto leading-relaxed">
          L'élégance de la fusion franco-guinéenne dans un cadre exceptionnel à Kipé.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a routerLink="/reservation" class="w-full sm:w-auto px-8 py-4 bg-jacquier-gold text-jacquier-dark rounded-xl font-bold uppercase tracking-wide hover:bg-yellow-500 transition-all shadow-lg hover:shadow-jacquier-gold/30 min-h-[44px] flex items-center justify-center">
            Réserver une table
          </a>
          <a routerLink="/menu" class="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-jacquier-light text-jacquier-light rounded-xl font-bold uppercase tracking-wide hover:bg-jacquier-light hover:text-jacquier-dark transition-all min-h-[44px] flex items-center justify-center">
            Découvrir le menu
          </a>
        </div>
      </div>
    </section>

    <!-- Daily Special Section -->
    <section class="py-16 bg-jacquier-cream relative z-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm">Notre Suggestion</span>
          <h2 class="text-4xl md:text-5xl font-serif font-bold text-jacquier-primary mt-2">Le Plat du Jour</h2>
        </div>
        <app-daily-special [dish]="dailyDish()" />
      </div>
    </section>

    <!-- Patrimoine Culinaire (Local Dishes) -->
    <section class="py-24 bg-white px-4">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row items-center gap-16">
          <div class="lg:w-1/2">
            <div class="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img ngSrc="https://picsum.photos/seed/local_food/800/600" fill class="object-cover" alt="Plat local guinéen" referrerPolicy="no-referrer">
            </div>
          </div>
          <div class="lg:w-1/2">
            <span class="text-jacquier-gold font-bold uppercase tracking-widest text-sm mb-2 block">Patrimoine Culinaire</span>
            <h2 class="text-4xl md:text-5xl font-serif font-bold text-jacquier-primary mb-6">L'Âme de la Guinée</h2>
            <p class="text-jacquier-text leading-relaxed mb-8 text-lg font-light">
              Découvrez notre sélection de plats traditionnels revisités avec élégance. 
              Du Poulet Yassa au Riz Gras Royal, chaque recette est un hommage aux saveurs authentiques de notre terroir, préparée avec des ingrédients locaux d'exception.
            </p>
            <a routerLink="/menu" class="inline-flex items-center text-jacquier-primary font-bold hover:text-jacquier-gold transition-colors group">
              Explorer nos spécialités locales
              <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Seafood Section -->
    <section class="py-24 bg-jacquier-primary text-jacquier-light relative overflow-hidden px-4">
      <div class="absolute inset-0 opacity-10">
        <img ngSrc="https://picsum.photos/seed/ocean_pattern/1920/1080" fill class="object-cover" alt="Ocean pattern" referrerPolicy="no-referrer">
      </div>
      <div class="max-w-7xl mx-auto relative z-10">
        <div class="text-center mb-16">
          <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm">Fraîcheur Océane</span>
          <h2 class="text-4xl md:text-5xl font-serif font-bold mt-2">Spécialités de la Mer</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (dish of seafoodDishes(); track dish.id) {
            <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
              <div class="relative h-48 rounded-xl overflow-hidden mb-6">
                <img [ngSrc]="dish.image" fill class="object-cover" [alt]="dish.name" referrerPolicy="no-referrer">
              </div>
              <h3 class="text-2xl font-serif font-bold mb-2">{{ dish.name }}</h3>
              <p class="text-gray-300 font-light mb-4 line-clamp-2">{{ dish.description }}</p>
              <div class="text-jacquier-gold font-bold">{{ dish.price | number:'1.0-0' }} FG</div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Bar & Boissons -->
    <section class="py-24 bg-jacquier-cream px-4">
      <div class="max-w-7xl mx-auto text-center">
        <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm">Lounge & Mixologie</span>
        <h2 class="text-4xl md:text-5xl font-serif font-bold text-jacquier-primary mt-2 mb-16">Bar & Boissons</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-left">
          <div class="order-2 md:order-1">
            <h3 class="text-3xl font-serif font-bold text-jacquier-dark mb-4">L'Art du Cocktail</h3>
            <p class="text-jacquier-text font-light leading-relaxed mb-6">
              Notre barman mixologue vous propose des créations originales mêlant spiritueux premium et fruits locaux de saison. 
              Découvrez également notre cave à vins soigneusement sélectionnée pour accompagner vos mets.
            </p>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center text-jacquier-dark font-medium">
                <span class="w-2 h-2 bg-jacquier-gold rounded-full mr-4"></span> Cocktails Signature
              </li>
              <li class="flex items-center text-jacquier-dark font-medium">
                <span class="w-2 h-2 bg-jacquier-gold rounded-full mr-4"></span> Jus Naturels & Bissap
              </li>
              <li class="flex items-center text-jacquier-dark font-medium">
                <span class="w-2 h-2 bg-jacquier-gold rounded-full mr-4"></span> Cave à Vins d'Exception
              </li>
            </ul>
            <a routerLink="/menu" class="px-6 py-3 bg-jacquier-primary text-white rounded-xl font-bold uppercase tracking-wide hover:bg-jacquier-burgundy transition-colors inline-block">
              Voir la carte des boissons
            </a>
          </div>
          <div class="order-1 md:order-2 relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
            <img ngSrc="https://picsum.photos/seed/cocktail_bar/800/1000" fill class="object-cover" alt="Cocktails au bar" referrerPolicy="no-referrer">
          </div>
        </div>
      </div>
    </section>

    <!-- Catering Teaser -->
    <section class="py-24 bg-jacquier-burgundy text-white px-4">
      <div class="max-w-7xl mx-auto text-center">
        <h2 class="text-4xl md:text-5xl font-serif font-bold mb-6">Événementiel & Traiteur</h2>
        <p class="text-xl font-light max-w-3xl mx-auto mb-10 text-gray-200">
          Sublimez vos réceptions privées et professionnelles avec le service traiteur premium du Jacquier. 
          Sur mesure, élégance et saveurs inoubliables.
        </p>
        <a routerLink="/services-traiteur" class="px-8 py-4 bg-jacquier-gold text-jacquier-dark rounded-xl font-bold uppercase tracking-wide hover:bg-white transition-colors shadow-lg inline-block">
          Demander un devis
        </a>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-24 bg-white px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm">Les Artisans du Goût</span>
          <h2 class="text-4xl md:text-5xl font-serif font-bold text-jacquier-primary mt-2">Notre Équipe</h2>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          @for (member of team(); track member.id) {
            <div class="text-center group">
              <div class="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                <img [ngSrc]="member.image" fill class="object-cover transform group-hover:scale-110 transition-transform duration-500" [alt]="member.name" referrerPolicy="no-referrer">
              </div>
              <h3 class="text-xl font-serif font-bold text-jacquier-dark">{{ member.name }}</h3>
              <p class="text-jacquier-gold font-medium mb-3">{{ member.role }}</p>
              <p class="text-sm text-gray-500 font-light px-4">{{ member.bio }}</p>
            </div>
          }
        </div>
      </div>
    </section>
    <!-- Distinctions -->
    <section class="py-16 bg-jacquier-cream border-t border-b border-jacquier-gold/20 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm mb-8 block">Nos Distinctions</span>
        <div class="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          <div class="flex flex-col items-center">
            <svg class="w-12 h-12 mb-2 text-jacquier-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span class="font-serif font-bold text-sm">Guide Gastronomique 2023</span>
          </div>
          <div class="flex flex-col items-center">
            <svg class="w-12 h-12 mb-2 text-jacquier-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span class="font-serif font-bold text-sm">Meilleur Restaurant Conakry</span>
          </div>
          <div class="flex flex-col items-center">
            <svg class="w-12 h-12 mb-2 text-jacquier-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span class="font-serif font-bold text-sm">Prix d'Excellence Culinaire</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Histoire & Mémoire -->
    <section class="py-24 bg-white relative overflow-hidden px-4">
      <div class="max-w-4xl mx-auto text-center relative z-10">
        <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm">Histoire & Mémoire</span>
        <h2 class="text-4xl md:text-5xl font-serif font-bold text-jacquier-primary mt-2 mb-12">L'Héritage du Jacquier</h2>
        
        <div class="relative border-l-2 border-jacquier-gold/30 ml-4 md:ml-0 md:border-none space-y-12">
          <!-- Timeline Item 1 -->
          <div class="relative pl-8 md:pl-0 md:flex items-center justify-between group">
            <div class="hidden md:block w-5/12 text-right pr-8">
              <h3 class="text-2xl font-serif font-bold text-jacquier-dark">La Fondation</h3>
              <p class="text-gray-500 font-light mt-2">Ouverture des portes avec une vision : marier la France et la Guinée.</p>
            </div>
            <div class="absolute left-[-9px] md:left-1/2 md:-ml-[9px] w-4 h-4 rounded-full bg-jacquier-gold border-4 border-white shadow"></div>
            <div class="md:w-5/12 md:pl-8 text-left">
              <span class="text-jacquier-orange font-bold text-xl">2010</span>
              <div class="md:hidden mt-2">
                <h3 class="text-xl font-serif font-bold text-jacquier-dark">La Fondation</h3>
                <p class="text-gray-500 font-light mt-1 text-sm">Ouverture des portes avec une vision : marier la France et la Guinée.</p>
              </div>
            </div>
          </div>
          
          <!-- Timeline Item 2 -->
          <div class="relative pl-8 md:pl-0 md:flex items-center justify-between group md:flex-row-reverse">
            <div class="hidden md:block w-5/12 text-left pl-8">
              <h3 class="text-2xl font-serif font-bold text-jacquier-dark">L'École de Gastronomie</h3>
              <p class="text-gray-500 font-light mt-2">Transmission du savoir-faire aux nouvelles générations de chefs.</p>
            </div>
            <div class="absolute left-[-9px] md:left-1/2 md:-ml-[9px] w-4 h-4 rounded-full bg-jacquier-gold border-4 border-white shadow"></div>
            <div class="md:w-5/12 md:pr-8 text-left md:text-right">
              <span class="text-jacquier-orange font-bold text-xl">2015</span>
              <div class="md:hidden mt-2">
                <h3 class="text-xl font-serif font-bold text-jacquier-dark">L'École de Gastronomie</h3>
                <p class="text-gray-500 font-light mt-1 text-sm">Transmission du savoir-faire aux nouvelles générations de chefs.</p>
              </div>
            </div>
          </div>

          <!-- Timeline Item 3 -->
          <div class="relative pl-8 md:pl-0 md:flex items-center justify-between group">
            <div class="hidden md:block w-5/12 text-right pr-8">
              <h3 class="text-2xl font-serif font-bold text-jacquier-dark">L'Excellence Reconnue</h3>
              <p class="text-gray-500 font-light mt-2">Devenu une institution incontournable de la capitale guinéenne.</p>
            </div>
            <div class="absolute left-[-9px] md:left-1/2 md:-ml-[9px] w-4 h-4 rounded-full bg-jacquier-gold border-4 border-white shadow"></div>
            <div class="md:w-5/12 md:pl-8 text-left">
              <span class="text-jacquier-orange font-bold text-xl">Aujourd'hui</span>
              <div class="md:hidden mt-2">
                <h3 class="text-xl font-serif font-bold text-jacquier-dark">L'Excellence Reconnue</h3>
                <p class="text-gray-500 font-light mt-1 text-sm">Devenu une institution incontournable de la capitale guinéenne.</p>
              </div>
            </div>
          </div>
          
          <!-- Desktop Center Line -->
          <div class="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-jacquier-gold/30 -translate-x-1/2 -z-10"></div>
        </div>
      </div>
    </section>
  `
})
export class HomeComponent {
  restaurantService = inject(RestaurantService);
  dailyDish = signal(this.restaurantService.getDailySpecial());
  team = this.restaurantService.getTeam();
  
  seafoodDishes = computed(() => {
    return this.restaurantService.getDishes()().filter(d => d.category === 'fruits_de_mer').slice(0, 3);
  });
}
