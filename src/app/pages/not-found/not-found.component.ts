
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="min-h-[70vh] flex items-center justify-center bg-jacquier-cream px-4 py-24">
      <div class="max-w-2xl mx-auto text-center">
        <span class="block text-jacquier-gold font-bold tracking-[0.2em] mb-4 uppercase text-sm md:text-base">Erreur 404</span>
        <h1 class="text-6xl md:text-8xl font-serif font-bold text-jacquier-dark mb-6">Page introuvable</h1>
        <p class="text-jacquier-text font-light text-lg mb-10 leading-relaxed">
          La page que vous cherchez n'existe pas ou a été déplacée. Retournez à l'accueil ou consultez notre menu.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/" class="px-8 py-4 bg-jacquier-primary text-white rounded-full font-bold tracking-wide hover:bg-jacquier-dark transition-colors duration-300">
            Retour à l'accueil
          </a>
          <a routerLink="/menu" class="px-8 py-4 border-2 border-jacquier-dark text-jacquier-dark rounded-full font-bold tracking-wide hover:bg-jacquier-dark hover:text-white transition-colors duration-300">
            Voir le menu
          </a>
        </div>
      </div>
    </section>
  `
})
export class NotFoundComponent {}
