
import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RestaurantService } from '../../core/services/restaurant.service';
import { SiteSettingsService } from '../../core/services/site-settings.service';
import { DailySpecialComponent } from '../../shared/components/daily-special/daily-special.component';
import { NgOptimizedImage, DecimalPipe } from '@angular/common';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DailySpecialComponent, NgOptimizedImage, DecimalPipe, RevealOnScrollDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Hero Section -->
    <section class="relative h-screen flex items-center justify-center text-center px-4 overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img [ngSrc]="siteSettings.image('homeHero', 'https://picsum.photos/seed/jacquier_interior/1920/1080').url" priority fill
             class="object-cover w-full h-full" [alt]="siteSettings.image('homeHero', '').altText || 'Intérieur du restaurant Le Jacquier'"
             referrerPolicy="no-referrer">
        <div class="absolute inset-0 bg-jacquier-dark/60"></div>
      </div>
      
      <div class="relative z-10 max-w-5xl mx-auto text-white animate-fade-in-up">
        <span class="block text-jacquier-gold font-bold tracking-[0.2em] mb-4 uppercase text-sm md:text-base">Bienvenue à Conakry</span>
        <h1 class="text-6xl md:text-8xl font-serif font-bold mb-6 leading-tight">
          {{ siteSettings.publicInfo().restaurantName }}
        </h1>
        <p class="text-lg md:text-2xl text-jacquier-light mb-10 font-light max-w-2xl mx-auto leading-relaxed">
          {{ siteSettings.publicInfo().tagline }}
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

    @if (siteSettings.today().enabled) {
      <section appRevealOnScroll class="relative z-20 -mt-10 px-4 pb-10">
        <div class="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-jacquier-gold/30 bg-jacquier-dark text-white shadow-2xl">
          <div class="grid lg:grid-cols-[1.15fr_.85fr]">
            <div class="p-7 md:p-10 lg:p-12">
              <span class="inline-flex rounded-full border border-jacquier-gold/40 bg-jacquier-gold/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-jacquier-gold">
                {{ siteSettings.today().eyebrow }}
              </span>

              <h2 class="mt-6 max-w-3xl font-serif text-3xl font-bold leading-tight md:text-5xl">
                {{ siteSettings.today().title || 'Une expérience particulière vous attend aujourd’hui' }}
              </h2>

              @if (siteSettings.today().message) {
                <p class="mt-5 max-w-2xl text-base font-light leading-relaxed text-gray-300 md:text-lg">
                  {{ siteSettings.today().message }}
                </p>
              }

              <div class="mt-8 flex flex-wrap items-center gap-4">
                <a [routerLink]="siteSettings.today().ctaPath"
                  class="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-jacquier-gold px-6 py-3 text-sm font-bold uppercase tracking-wider text-jacquier-dark transition hover:bg-white">
                  {{ siteSettings.today().ctaLabel }}
                </a>
                <span class="text-xs uppercase tracking-[0.16em] text-gray-500">
                  {{ siteSettings.publicInfo().neighborhood }} · {{ siteSettings.publicInfo().openingHours }}
                </span>
              </div>
            </div>

            @if (todayDish(); as dish) {
              <div class="relative min-h-72 overflow-hidden bg-black/20">
                @if (dish.image) {
                  <img [src]="dish.image" [alt]="dish.name" class="absolute inset-0 h-full w-full object-cover" />
                  <div class="absolute inset-0 bg-gradient-to-t from-jacquier-dark via-jacquier-dark/20 to-transparent lg:bg-gradient-to-l"></div>
                }
                <div class="relative flex h-full min-h-72 items-end p-7 md:p-10">
                  <div class="w-full rounded-2xl border border-white/15 bg-black/35 p-5 backdrop-blur">
                    <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-jacquier-gold">À découvrir aujourd’hui</p>
                    <div class="mt-2 flex items-end justify-between gap-4">
                      <div>
                        <h3 class="font-serif text-2xl font-bold text-white">{{ dish.name }}</h3>
                        <p class="mt-2 line-clamp-2 text-sm text-gray-300">{{ dish.description }}</p>
                      </div>
                      <p class="shrink-0 font-bold text-jacquier-gold">{{ dish.price | number:'1.0-0' }} {{ siteSettings.publicInfo().currency }}</p>
                    </div>
                  </div>
                </div>
              </div>
            } @else {
              <div class="flex min-h-72 items-center justify-center bg-gradient-to-br from-jacquier-primary to-jacquier-burgundy p-10 text-center">
                <div>
                  <p class="text-xs font-bold uppercase tracking-[0.18em] text-jacquier-gold">Le Jacquier aujourd’hui</p>
                  <p class="mt-4 font-serif text-3xl font-bold">Cuisine, accueil et ambiance en mouvement.</p>
                </div>
              </div>
            }
          </div>
        </div>
      </section>
    }

    <!-- Curated suggestion -->
    @if (dailyDish() || isMenuLoading()) {
      <section appRevealOnScroll class="py-16 bg-jacquier-cream relative z-20 px-4">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-12">
            <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm">Sélection de la maison</span>
            <h2 class="text-4xl md:text-5xl font-serif font-bold text-jacquier-primary mt-2">Suggestion de la Cheffe</h2>
          </div>
          @if (dailyDish(); as dish) {
            <app-daily-special [dish]="dish" />
          } @else {
            <div class="bg-jacquier-dark rounded-3xl overflow-hidden shadow-2xl animate-pulse" role="status" aria-live="polite" aria-label="Chargement de la suggestion de la Cheffe">
              <div class="grid md:grid-cols-2">
                <div class="p-10 md:p-16 space-y-6">
                  <div class="h-6 bg-gray-700 rounded w-40"></div>
                  <div class="h-10 bg-gray-700 rounded w-2/3"></div>
                  <div class="h-4 bg-gray-700 rounded w-full"></div>
                  <div class="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
                <div class="h-80 md:h-auto bg-gray-700"></div>
              </div>
            </div>
          }
        </div>
      </section>
    }

    <!-- Patrimoine Culinaire (Local Dishes) -->
    <section appRevealOnScroll class="py-24 bg-white px-4">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row items-center gap-16">
          <div class="lg:w-1/2">
            <div class="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img [src]="cuisineVisual()" class="h-full w-full object-cover" alt="Cuisine du Jacquier" referrerPolicy="no-referrer">
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
              <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Seafood Section -->
    <section appRevealOnScroll class="py-24 bg-jacquier-primary text-jacquier-light relative overflow-hidden px-4">
      <div class="absolute inset-0 opacity-10">
        <img ngSrc="https://picsum.photos/seed/ocean_pattern/1920/1080" fill class="object-cover" alt="" aria-hidden="true" referrerPolicy="no-referrer">
      </div>
      <div class="max-w-7xl mx-auto relative z-10">
        <div class="text-center mb-16">
          <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm">Fraîcheur Océane</span>
          <h2 class="text-4xl md:text-5xl font-serif font-bold mt-2">Spécialités de la Mer</h2>
        </div>
        @if (seafoodDishes().length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (dish of seafoodDishes(); track dish.id) {
              <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                <div class="relative h-48 rounded-xl overflow-hidden mb-6 bg-white/10">
                  @if (dish.image) {
                    <img [src]="dish.image" class="h-full w-full object-cover" [alt]="dish.name" referrerPolicy="no-referrer">
                  } @else {
                    <div class="flex h-full items-center justify-center px-6 text-center font-serif text-lg text-white/60">À découvrir au Jacquier</div>
                  }
                </div>
                <h3 class="text-2xl font-serif font-bold mb-2">{{ dish.name }}</h3>
                <p class="text-gray-300 font-light mb-4 line-clamp-2">{{ dish.description }}</p>
                <div class="text-jacquier-gold font-bold">{{ dish.price | number:'1.0-0' }} {{ siteSettings.publicInfo().currency }}</div>
              </div>
            }
          </div>
        } @else if (isMenuLoading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="status" aria-live="polite" aria-label="Chargement des spécialités de la mer">
            @for (i of [0,1,2]; track i) {
              <div class="bg-white/5 rounded-2xl p-6 border border-white/10 animate-pulse">
                <div class="h-48 rounded-xl bg-white/10 mb-6"></div>
                <div class="h-5 bg-white/10 rounded w-2/3 mb-3"></div>
                <div class="h-3 bg-white/10 rounded w-full"></div>
              </div>
            }
          </div>
        }
      </div>
    </section>

    <!-- Bar & Boissons -->
    <section appRevealOnScroll class="py-24 bg-jacquier-cream px-4">
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
                <span class="w-2 h-2 bg-jacquier-gold rounded-full mr-4" aria-hidden="true"></span> Cocktails Signature
              </li>
              <li class="flex items-center text-jacquier-dark font-medium">
                <span class="w-2 h-2 bg-jacquier-gold rounded-full mr-4" aria-hidden="true"></span> Jus Naturels & Bissap
              </li>
              <li class="flex items-center text-jacquier-dark font-medium">
                <span class="w-2 h-2 bg-jacquier-gold rounded-full mr-4" aria-hidden="true"></span> Cave à Vins d'Exception
              </li>
            </ul>
            <a routerLink="/menu" class="px-6 py-3 bg-jacquier-primary text-white rounded-xl font-bold uppercase tracking-wide hover:bg-jacquier-burgundy transition-colors inline-block">
              Voir la carte des boissons
            </a>
          </div>
          <div class="order-1 md:order-2 relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
            <img [src]="ambianceVisual()" class="h-full w-full object-cover" alt="Ambiance du Jacquier" referrerPolicy="no-referrer">
          </div>
        </div>
      </div>
    </section>

    <!-- Catering Teaser -->
    <section appRevealOnScroll class="py-24 bg-jacquier-burgundy text-white px-4">
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

    @if (teamHighlights().length || isTeamLoading()) {
      <section appRevealOnScroll class="py-24 bg-white px-4">
        <div class="max-w-7xl mx-auto">
          <div class="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm">Les Artisans du Goût</span>
              <h2 class="text-4xl md:text-5xl font-serif font-bold text-jacquier-primary mt-2">Rencontrez notre équipe</h2>
            </div>
            <a routerLink="/about" class="text-sm font-bold text-jacquier-primary hover:text-jacquier-gold">Découvrir toute l’équipe →</a>
          </div>

          @if (teamHighlights().length) {
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
              @for (member of teamHighlights(); track member.id) {
                <article class="text-center group">
                  <div class="relative mx-auto mb-5 aspect-square w-full max-w-56 overflow-hidden rounded-3xl bg-jacquier-cream shadow-lg">
                    @if (member.image) {
                      <img [src]="member.image" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" [alt]="member.name" referrerPolicy="no-referrer">
                    } @else {
                      <div class="flex h-full items-center justify-center font-serif text-4xl font-bold text-jacquier-gold/70">{{ initials(member.name) }}</div>
                    }
                  </div>
                  <h3 class="text-lg md:text-xl font-serif font-bold text-jacquier-dark">{{ member.name }}</h3>
                  <p class="mt-1 text-xs md:text-sm font-bold uppercase tracking-wider text-jacquier-gold">{{ member.role }}</p>
                </article>
              }
            </div>
          } @else {
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
              @for (i of [0,1,2,3]; track i) {
                <div class="aspect-[4/5] rounded-3xl bg-gray-100 animate-pulse"></div>
              }
            </div>
          }
        </div>
      </section>
    }

    @if (galleryHighlights().length || isGalleryLoading()) {
      <section appRevealOnScroll class="bg-jacquier-dark px-4 py-24 text-white">
        <div class="mx-auto max-w-7xl">
          <div class="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm">Instants du Jacquier</span>
              <h2 class="mt-2 font-serif text-4xl font-bold md:text-5xl">Le restaurant en images</h2>
              <p class="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">Cuisine, ambiance, équipe et événements : un aperçu alimenté directement par la galerie publique.</p>
            </div>
            <a routerLink="/gallery" class="text-sm font-bold text-jacquier-gold hover:text-white">Explorer toute la galerie →</a>
          </div>

          @if (galleryHighlights().length) {
            <div class="grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-4">
              @for (image of galleryHighlights(); track image.id; let i = $index) {
                <a routerLink="/gallery"
                  [class]="i === 0 ? 'group relative col-span-2 row-span-2 overflow-hidden rounded-3xl' : 'group relative overflow-hidden rounded-3xl'">
                  <img [src]="image.imageUrl" [alt]="image.title || 'Photo du Jacquier'"
                    class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  @if (image.title) {
                    <p class="absolute bottom-4 left-4 right-4 font-serif text-sm font-bold text-white md:text-lg">{{ image.title }}</p>
                  }
                </a>
              }
            </div>
          } @else {
            <div class="grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-4">
              @for (i of [0,1,2,3,4]; track i) {
                <div [class]="i === 0 ? 'col-span-2 row-span-2 rounded-3xl bg-white/10 animate-pulse' : 'rounded-3xl bg-white/10 animate-pulse'"></div>
              }
            </div>
          }
        </div>
      </section>
    }

    @if (schoolHighlights().length || isSchoolLoading()) {
      <section appRevealOnScroll class="bg-jacquier-cream px-4 py-24">
        <div class="mx-auto max-w-7xl">
          <div class="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm">Transmission & savoir-faire</span>
              <h2 class="mt-2 font-serif text-4xl font-bold text-jacquier-primary md:text-5xl">École de Gastronomie</h2>
              <p class="mt-3 max-w-2xl text-sm leading-relaxed text-jacquier-text/70">Les programmes affichés ici proviennent directement de l’administration de l’École.</p>
            </div>
            <a routerLink="/ecole-gastronomie" class="text-sm font-bold text-jacquier-primary hover:text-jacquier-gold">Voir tous les programmes →</a>
          </div>

          @if (schoolHighlights().length) {
            <div class="grid gap-5 md:grid-cols-3">
              @for (program of schoolHighlights(); track program.id) {
                <article class="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div class="flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wider">
                    @if (program.level) { <span class="rounded-full bg-jacquier-primary/10 px-3 py-1.5 text-jacquier-primary">{{ program.level }}</span> }
                    @if (program.duration) { <span class="rounded-full bg-jacquier-gold/15 px-3 py-1.5 text-jacquier-dark">{{ program.duration }}</span> }
                  </div>
                  <h3 class="mt-5 font-serif text-2xl font-bold text-jacquier-dark">{{ program.title }}</h3>
                  <p class="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-500">{{ program.description }}</p>
                  <a routerLink="/ecole-gastronomie" class="mt-6 inline-flex text-sm font-bold text-jacquier-primary hover:text-jacquier-gold">Découvrir le programme →</a>
                </article>
              }
            </div>
          } @else {
            <div class="grid gap-5 md:grid-cols-3">
              @for (i of [0,1,2]; track i) {
                <div class="h-64 rounded-3xl bg-white animate-pulse"></div>
              }
            </div>
          }
        </div>
      </section>
    }
  `
})
export class HomeComponent {
  restaurantService = inject(RestaurantService);
  readonly siteSettings = inject(SiteSettingsService);
  isMenuLoading = this.restaurantService.isLoadingMenu();
  isGalleryLoading = this.restaurantService.isLoadingGallery();
  isSchoolLoading = this.restaurantService.isLoadingSchool();
  isTeamLoading = this.restaurantService.isLoadingTeam();

  // computed() (et non signal() figé) : le plat du jour dépend du menu chargé de manière
  // asynchrone côté service, il doit donc se recalculer automatiquement une fois les
  // données arrivées, plutôt que de rester bloqué sur la valeur (souvent undefined) prise
  // au moment de la construction du composant.
  todayDish = computed(() => {
    const id = this.siteSettings.today().featuredDishId;
    return id ? this.restaurantService.getDishes()().find(dish => dish.id === id) : undefined;
  });

  dailyDish = computed(() => {
    const todayId = this.siteSettings.today().featuredDishId;
    return this.restaurantService.getDishes()()
      .find(dish => dish.isFeatured === true && dish.id !== todayId);
  });

  team = this.restaurantService.getTeam();
  teamHighlights = computed(() => this.team().slice(0, 4));
  galleryHighlights = computed(() => this.restaurantService.getGalleryImages()().slice(0, 5));
  schoolHighlights = computed(() => this.restaurantService.getSchoolPrograms()().slice(0, 3));
  cuisineVisual = computed(() =>
    this.restaurantService.getGalleryImages()().find(image => image.category === 'cuisine')?.imageUrl
      || this.siteSettings.image('homeHero', 'https://picsum.photos/seed/local_food/800/600').url
  );
  ambianceVisual = computed(() =>
    this.restaurantService.getGalleryImages()().find(image => image.category === 'ambiance')?.imageUrl
      || this.siteSettings.image('homeHero', 'https://picsum.photos/seed/cocktail_bar/800/1000').url
  );

  initials(name: string): string {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  }

  seafoodDishes = computed(() => {
    return this.restaurantService.getDishes()().filter(d => d.category === 'fruits_de_mer').slice(0, 3);
  });
}
