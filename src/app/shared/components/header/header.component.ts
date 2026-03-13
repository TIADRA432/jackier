import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatButtonModule],
  template: `
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <a routerLink="/" class="text-2xl font-serif font-bold text-gray-900 tracking-tight">
              Le Jacquier
            </a>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex space-x-8">
            <a routerLink="/" routerLinkActive="text-gray-900 font-medium" [routerLinkActiveOptions]="{exact: true}" class="text-gray-500 hover:text-gray-900 transition-colors text-sm uppercase tracking-widest">Accueil</a>
            <a routerLink="/menu" routerLinkActive="text-gray-900 font-medium" class="text-gray-500 hover:text-gray-900 transition-colors text-sm uppercase tracking-widest">Menu</a>
            <a routerLink="/about" routerLinkActive="text-gray-900 font-medium" class="text-gray-500 hover:text-gray-900 transition-colors text-sm uppercase tracking-widest">À Propos</a>
            <a routerLink="/gallery" routerLinkActive="text-gray-900 font-medium" class="text-gray-500 hover:text-gray-900 transition-colors text-sm uppercase tracking-widest">Galerie</a>
            <a routerLink="/contact" routerLinkActive="text-gray-900 font-medium" class="text-gray-500 hover:text-gray-900 transition-colors text-sm uppercase tracking-widest">Contact</a>
          </nav>

          <!-- CTA Button -->
          <div class="hidden md:flex items-center">
            <a routerLink="/reservation" mat-flat-button class="!bg-gray-900 !text-white !rounded-none !px-6 !py-2 !text-sm !uppercase !tracking-widest">
              Réserver
            </a>
          </div>

          <!-- Mobile menu button -->
          <div class="flex items-center md:hidden">
            <button mat-icon-button (click)="toggleMenu()" class="text-gray-900">
              <mat-icon>{{ isMenuOpen() ? 'close' : 'menu' }}</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation -->
      @if (isMenuOpen()) {
        <div class="md:hidden bg-white border-t border-gray-100">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a routerLink="/" (click)="toggleMenu()" class="block px-3 py-2 text-base font-medium text-gray-900">Accueil</a>
            <a routerLink="/menu" (click)="toggleMenu()" class="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900">Menu</a>
            <a routerLink="/about" (click)="toggleMenu()" class="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900">À Propos</a>
            <a routerLink="/gallery" (click)="toggleMenu()" class="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900">Galerie</a>
            <a routerLink="/contact" (click)="toggleMenu()" class="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900">Contact</a>
            <a routerLink="/reservation" (click)="toggleMenu()" class="block px-3 py-2 mt-4 text-base font-medium text-white bg-gray-900 text-center">Réserver</a>
          </div>
        </div>
      }
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }
}
