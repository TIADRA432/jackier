import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  template: `
    <footer class="bg-gray-900 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <!-- Brand -->
          <div class="col-span-1 md:col-span-1">
            <h3 class="text-2xl font-serif font-bold tracking-tight mb-6">Le Jacquier</h3>
            <p class="text-gray-400 text-sm leading-relaxed mb-6">
              Une expérience culinaire d'exception au cœur de Conakry. Cuisine fusion franco-guinéenne.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <mat-icon>facebook</mat-icon>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <mat-icon>camera_alt</mat-icon>
              </a>
            </div>
          </div>

          <!-- Links -->
          <div class="col-span-1">
            <h4 class="text-sm font-semibold uppercase tracking-widest mb-6">Navigation</h4>
            <ul class="space-y-4 text-sm text-gray-400">
              <li><a routerLink="/" class="hover:text-white transition-colors">Accueil</a></li>
              <li><a routerLink="/menu" class="hover:text-white transition-colors">Menu Gastronomique</a></li>
              <li><a routerLink="/about" class="hover:text-white transition-colors">Notre Histoire</a></li>
              <li><a routerLink="/gallery" class="hover:text-white transition-colors">Galerie</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div class="col-span-1">
            <h4 class="text-sm font-semibold uppercase tracking-widest mb-6">Contact</h4>
            <ul class="space-y-4 text-sm text-gray-400">
              <li class="flex items-start">
                <mat-icon class="mr-3 text-gray-500 text-sm">location_on</mat-icon>
                <span>Conakry, Guinée</span>
              </li>
              <li class="flex items-center">
                <mat-icon class="mr-3 text-gray-500 text-sm">phone</mat-icon>
                <span>+224 620 00 00 00</span>
              </li>
              <li class="flex items-center">
                <mat-icon class="mr-3 text-gray-500 text-sm">email</mat-icon>
                <span>contact&#64;lejacquier.com</span>
              </li>
            </ul>
          </div>

          <!-- Hours -->
          <div class="col-span-1">
            <h4 class="text-sm font-semibold uppercase tracking-widest mb-6">Horaires</h4>
            <ul class="space-y-4 text-sm text-gray-400">
              <li class="flex justify-between">
                <span>Lundi - Jeudi</span>
                <span>12:00 - 22:30</span>
              </li>
              <li class="flex justify-between">
                <span>Vendredi - Samedi</span>
                <span>12:00 - 23:30</span>
              </li>
              <li class="flex justify-between">
                <span>Dimanche</span>
                <span>Fermé</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div class="mt-16 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {{ currentYear }} Le Jacquier. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
