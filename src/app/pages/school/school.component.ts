import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RestaurantService } from '../../core/services/restaurant.service';
import { SiteSettingsService } from '../../core/services/site-settings.service';

@Component({
  selector: 'app-school',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative h-[52vh] flex items-center justify-center text-center px-4 overflow-hidden bg-jacquier-dark">
      <img [ngSrc]="siteSettings.image('schoolHero', '/og-image.png').url" fill priority
        class="object-cover opacity-40"
        [alt]="siteSettings.image('schoolHero', '').altText || 'École de Gastronomie du Jacquier'"
        referrerPolicy="no-referrer">
      <div class="relative z-10 max-w-4xl mx-auto text-white">
        <span class="block text-jacquier-gold font-bold tracking-[0.2em] mb-4 uppercase text-sm md:text-base">Formation & transmission</span>
        <h1 class="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">École de Gastronomie</h1>
        <p class="text-lg md:text-xl text-jacquier-light max-w-2xl mx-auto font-light leading-relaxed">
          Les programmes présentés sur cette page sont ceux actuellement publiés par l’administration du Jacquier.
        </p>
      </div>
    </div>

    <section class="bg-white px-4 py-20">
      <div class="mx-auto max-w-5xl text-center">
        <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm">Programmes officiels</span>
        <h2 class="mt-3 text-4xl md:text-5xl font-serif font-bold text-jacquier-primary">Formations actuellement disponibles</h2>
        <p class="mx-auto mt-5 max-w-2xl font-light leading-relaxed text-jacquier-text">
          Les durées, niveaux et descriptions ci-dessous proviennent directement du catalogue de formation publié par le restaurant.
        </p>
      </div>
    </section>

    <section class="py-20 bg-jacquier-cream px-4">
      <div class="max-w-7xl mx-auto">
        @if (isLoading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="status" aria-live="polite" aria-label="Chargement des programmes">
            @for (i of skeletonPlaceholders; track i) {
              <div class="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 animate-pulse space-y-4">
                <div class="h-6 bg-gray-200 rounded w-2/3"></div>
                <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                <div class="h-16 bg-gray-200 rounded"></div>
              </div>
            }
          </div>
        } @else if (loadError()) {
          <div class="text-center py-20 bg-white rounded-3xl shadow-lg border border-red-100">
            <p class="text-red-600 text-xl mb-6 font-light">{{ loadError() }}</p>
            <button (click)="retry()" class="px-8 py-3 bg-jacquier-primary text-white rounded-xl font-bold uppercase tracking-wide hover:bg-jacquier-burgundy transition-colors min-h-[44px]">Réessayer</button>
          </div>
        } @else if (programs().length === 0) {
          <div class="text-center py-20 bg-white rounded-3xl shadow-lg border border-gray-100">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-jacquier-gold">Prochaines formations</p>
            <h2 class="mt-3 font-serif text-2xl font-bold text-jacquier-dark">Le prochain programme sera annoncé ici</h2>
            <p class="mx-auto mt-3 max-w-xl text-jacquier-text/70">Pour connaître les prochaines sessions ou manifester votre intérêt, contactez directement Le Jacquier.</p>
            <a routerLink="/contact" class="mt-6 inline-flex rounded-xl bg-jacquier-primary px-6 py-3 text-sm font-bold text-white">Nous contacter</a>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (program of programs(); track program.id) {
              <article class="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:-translate-y-1 transition-all duration-300">
                @if (program.level) {
                  <span class="inline-block bg-jacquier-cream text-jacquier-primary text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5">{{ program.level }}</span>
                }
                <h3 class="text-2xl font-serif font-bold text-jacquier-dark">{{ program.title }}</h3>
                @if (program.description) {
                  <p class="mt-4 text-gray-600 font-light leading-relaxed">{{ program.description }}</p>
                }
                <div class="mt-6 flex justify-between items-center border-t border-gray-100 pt-5">
                  <span class="text-sm font-bold text-jacquier-dark">{{ program.duration || 'Durée à préciser' }}</span>
                  <a routerLink="/contact" class="text-jacquier-primary font-bold text-sm hover:text-jacquier-gold transition-colors">Nous contacter →</a>
                </div>
              </article>
            }
          </div>
        }
      </div>
    </section>

    <section class="bg-jacquier-primary px-4 py-16 text-center text-white">
      <h2 class="font-serif text-3xl font-bold">Une question sur un programme publié ?</h2>
      <p class="mx-auto mt-4 max-w-xl text-jacquier-light">Contactez directement le restaurant pour obtenir les informations complémentaires disponibles.</p>
      <a routerLink="/contact" class="mt-7 inline-flex rounded-xl bg-white px-6 py-3 font-bold text-jacquier-primary">Contacter Le Jacquier</a>
    </section>
  `
})
export class SchoolComponent {
  readonly restaurantService = inject(RestaurantService);
  readonly siteSettings = inject(SiteSettingsService);
  readonly programs = this.restaurantService.getSchoolPrograms();
  readonly isLoading = this.restaurantService.isLoadingSchool();
  readonly loadError = this.restaurantService.getSchoolError();
  readonly skeletonPlaceholders = Array.from({ length: 3 }, (_, i) => i);

  retry(): void {
    void this.restaurantService.retryLoadSchoolPrograms();
  }
}
