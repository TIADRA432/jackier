
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bg-jacquier-dark text-gray-300 py-16 lg:py-24 border-t-4 border-jacquier-gold">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        
        <!-- Brand & About -->
        <div class="lg:col-span-1">
          <h3 class="text-3xl font-serif font-bold text-jacquier-gold mb-6 tracking-wide">Le Jacquier</h3>
          <p class="mb-8 text-sm leading-relaxed font-light text-gray-400">
            Une fusion exquise entre la gastronomie française et les saveurs guinéennes, 
            au cœur de Kipé. Un voyage culinaire unique où tradition et modernité se rencontrent.
          </p>
          <div class="flex space-x-4">
            <!-- Social Icons -->
            <a href="#" class="w-10 h-10 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center hover:bg-jacquier-primary hover:border-jacquier-primary hover:text-white transition-all duration-300 group" aria-label="Facebook">
              <svg class="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center hover:bg-jacquier-primary hover:border-jacquier-primary hover:text-white transition-all duration-300 group" aria-label="Instagram">
              <svg class="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
        </div>

        <!-- Navigation -->
        <div class="lg:col-span-1">
          <h4 class="text-sm font-bold text-white mb-6 uppercase tracking-widest">Navigation</h4>
          <ul class="space-y-4 text-sm font-light">
            <li><a routerLink="/menu" class="hover:text-jacquier-gold transition-colors inline-block transform hover:translate-x-1 duration-300">Menu & Vins</a></li>
            <li><a routerLink="/services-traiteur" class="hover:text-jacquier-gold transition-colors inline-block transform hover:translate-x-1 duration-300">Traiteur & Événements</a></li>
            <li><a routerLink="/ecole-gastronomie" class="hover:text-jacquier-gold transition-colors inline-block transform hover:translate-x-1 duration-300">École de Gastronomie</a></li>
            <li><a routerLink="/about" class="hover:text-jacquier-gold transition-colors inline-block transform hover:translate-x-1 duration-300">L'Équipe</a></li>
            <li><a routerLink="/gallery" class="hover:text-jacquier-gold transition-colors inline-block transform hover:translate-x-1 duration-300">Galerie</a></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="lg:col-span-1">
          <h4 class="text-sm font-bold text-white mb-6 uppercase tracking-widest">Contact</h4>
          <ul class="space-y-4 text-sm font-light">
            <li class="flex items-start group">
              <svg class="w-5 h-5 mr-3 text-jacquier-gold shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span class="leading-relaxed">{{ info.address }}</span>
            </li>
            <li class="flex items-center group">
              <svg class="w-5 h-5 mr-3 text-jacquier-gold shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              <a [href]="'tel:' + info.phone" class="hover:text-jacquier-gold transition-colors">{{ info.phone }}</a>
            </li>
            <li class="flex items-center group">
              <svg class="w-5 h-5 mr-3 text-jacquier-gold shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <a [href]="'mailto:' + info.email" class="hover:text-jacquier-gold transition-colors">{{ info.email }}</a>
            </li>
          </ul>
        </div>

        <!-- Hours -->
        <div class="lg:col-span-1">
          <h4 class="text-sm font-bold text-white mb-6 uppercase tracking-widest">Horaires</h4>
          <div class="bg-gray-800/30 border border-gray-700/50 p-6 rounded-2xl backdrop-blur-sm">
            <p class="text-jacquier-gold font-bold mb-2 tracking-wide uppercase text-xs">Ouvert 7j/7</p>
            <p class="text-white text-2xl font-serif mb-1">{{ info.hours }}</p>
            <p class="text-xs text-gray-400 font-light">Cuisine ouverte non-stop</p>
          </div>
          <a routerLink="/reservation" class="mt-6 inline-block w-full text-center border border-jacquier-gold text-jacquier-gold px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-jacquier-gold hover:text-jacquier-dark transition-colors duration-300">
            Réserver une table
          </a>
        </div>
      </div>
      
      <div class="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-light">
        <p>&copy; {{ currentYear }} Le Jacquier. Tous droits réservés.</p>
        <div class="flex space-x-6 mt-4 md:mt-0">
          <a href="#" class="hover:text-jacquier-gold transition-colors">Mentions légales</a>
          <a href="#" class="hover:text-jacquier-gold transition-colors">Politique de confidentialité</a>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  restaurantService = inject(RestaurantService);
  info = this.restaurantService.info;
  currentYear = new Date().getFullYear();
}
