import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TeamGridComponent } from '../../shared/components/team-grid/team-grid.component';
import { RestaurantService } from '../../core/services/restaurant.service';
import { SiteSettingsService } from '../../core/services/site-settings.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, TeamGridComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative h-[50vh] flex items-center justify-center text-center px-4 overflow-hidden bg-jacquier-dark">
      <img [ngSrc]="siteSettings.image('aboutHero', '/og-image.png').url" fill priority
        class="object-cover opacity-40"
        [alt]="siteSettings.image('aboutHero', '').altText || 'Le Jacquier à ' + siteSettings.publicInfo().neighborhood"
        referrerPolicy="no-referrer">
      <div class="relative z-10 max-w-4xl mx-auto text-white">
        <span class="block text-jacquier-gold font-bold tracking-[0.2em] mb-4 uppercase text-sm md:text-base">
          {{ siteSettings.publicInfo().neighborhood }} · Conakry
        </span>
        <h1 class="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">Le Jacquier</h1>
        <p class="mx-auto max-w-2xl text-base font-light leading-relaxed text-jacquier-light md:text-xl">
          {{ siteSettings.publicInfo().tagline }}
        </p>
      </div>
    </div>

    <section class="bg-white px-4 py-24">
      <div class="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_.9fr] lg:items-center">
        <div>
          <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm">Le restaurant</span>
          <h2 class="mt-3 text-4xl md:text-5xl font-serif font-bold text-jacquier-primary">Une table à {{ siteSettings.publicInfo().neighborhood }}</h2>
          <p class="mt-7 text-lg font-light leading-relaxed text-jacquier-text">
            Le Jacquier vous accueille au {{ siteSettings.publicInfo().address }}.
            La carte publique présente les plats actuellement disponibles, tandis que les suggestions et actualités évoluent directement depuis l’administration du restaurant.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a routerLink="/menu" class="rounded-xl bg-jacquier-primary px-6 py-3 text-sm font-bold text-white">Découvrir la carte</a>
            <a routerLink="/reservation" class="rounded-xl border border-jacquier-primary px-6 py-3 text-sm font-bold text-jacquier-primary">Réserver une table</a>
          </div>
        </div>

        @if (aboutVisuals().length) {
          <div class="grid grid-cols-2 gap-3">
            @for (image of aboutVisuals(); track image.id; let i = $index) {
              <div [class]="i === 0 ? 'relative col-span-2 aspect-[16/9] overflow-hidden rounded-3xl' : 'relative aspect-square overflow-hidden rounded-3xl'">
                <img [src]="image.imageUrl" [alt]="image.title || 'Le Jacquier'" class="h-full w-full object-cover" referrerPolicy="no-referrer">
              </div>
            }
          </div>
        } @else {
          <div class="relative aspect-[4/3] overflow-hidden rounded-3xl bg-jacquier-cream">
            <img [src]="siteSettings.image('aboutHero', '/og-image.png').url"
              [alt]="siteSettings.image('aboutHero', '').altText || 'Le Jacquier'"
              class="h-full w-full object-cover" referrerPolicy="no-referrer">
          </div>
        }
      </div>
    </section>

    <section class="bg-jacquier-cream px-4 py-24">
      <div class="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
        <article class="rounded-3xl bg-white p-8 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-jacquier-gold">La carte</p>
          <h2 class="mt-3 font-serif text-3xl font-bold text-jacquier-dark">Des propositions publiées par le restaurant</h2>
          <p class="mt-4 leading-relaxed text-jacquier-text/75">
            Les plats, leurs prix, leur disponibilité et les suggestions de la Cheffe sont issus du catalogue actuellement géré par l’équipe du Jacquier.
          </p>
          <a routerLink="/menu" class="mt-6 inline-flex font-bold text-jacquier-primary">Voir la carte →</a>
        </article>
        <article class="rounded-3xl bg-white p-8 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-jacquier-gold">L’ambiance</p>
          <h2 class="mt-3 font-serif text-3xl font-bold text-jacquier-dark">Le restaurant en images</h2>
          <p class="mt-4 leading-relaxed text-jacquier-text/75">
            La galerie publique rassemble les photos réellement sélectionnées par le restaurant : cuisine, ambiance, équipe et événements lorsqu’ils sont disponibles.
          </p>
          <a routerLink="/gallery" class="mt-6 inline-flex font-bold text-jacquier-primary">Explorer la galerie →</a>
        </article>
      </div>
    </section>

    <section class="bg-white px-4 py-24">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm block mb-2">Nos talents</span>
          <h2 class="text-4xl md:text-5xl font-serif font-bold text-jacquier-primary mb-6">L’Équipe du Jacquier</h2>
          <p class="text-jacquier-text font-light text-lg max-w-2xl mx-auto">Les profils affichés ici sont ceux que le restaurant a explicitement rendus publics.</p>
        </div>
        @if (teamLoading()) {
          <p class="py-12 text-center text-jacquier-text/60" role="status">Chargement de l’équipe…</p>
        } @else if (teamError()) {
          <div class="text-center">
            <p class="text-jacquier-text/70">{{ teamError() }}</p>
            <button type="button" (click)="retryTeam()" class="mt-4 rounded-xl bg-jacquier-primary px-5 py-3 text-sm font-bold text-white">Réessayer</button>
          </div>
        } @else if (team().length) {
          <app-team-grid [members]="team()" />
        } @else {
          <p class="py-12 text-center text-jacquier-text/60">Aucun profil d’équipe n’est publié pour le moment.</p>
        }
      </div>
    </section>
  `
})
export class AboutComponent {
  readonly restaurantService = inject(RestaurantService);
  readonly siteSettings = inject(SiteSettingsService);
  readonly team = this.restaurantService.getTeam();
  readonly teamLoading = this.restaurantService.isLoadingTeam();
  readonly teamError = this.restaurantService.getTeamError();
  readonly aboutVisuals = computed(() =>
    this.restaurantService.getGalleryImages()()
      .filter(image => ['restaurant', 'ambiance', 'cuisine', 'equipe'].includes(image.category))
      .slice(0, 3)
  );

  retryTeam(): void {
    void this.restaurantService.retryLoadTeam();
  }
}
