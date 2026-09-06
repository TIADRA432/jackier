
import { Component, signal, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="fixed w-full z-50 transition-all duration-500" 
            [class.bg-white]="isScrolled() || isMobileMenuOpen()" 
            [class.shadow-md]="isScrolled() || isMobileMenuOpen()"
            [class.py-2]="isScrolled()"
            [class.py-6]="!isScrolled()"
            [class.bg-transparent]="!isScrolled() && !isMobileMenuOpen()">
      <div class="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <!-- Logo -->
        <a routerLink="/" class="text-2xl md:text-3xl font-serif font-bold tracking-widest uppercase transition-colors duration-300" 
           [class.text-jacquier-gold]="!isScrolled() && !isMobileMenuOpen()"
           [class.text-jacquier-primary]="isScrolled() || isMobileMenuOpen()">
           Le Jacquier
        </a>

        <!-- Desktop Nav -->
        <nav class="hidden lg:flex space-x-8 items-center">
          @for (link of navLinks; track link.path) {
            <a [routerLink]="link.path" 
               routerLinkActive="text-jacquier-gold after:w-full"
               [routerLinkActiveOptions]="{exact: link.exact}"
               class="relative text-xs font-bold uppercase tracking-widest transition-colors duration-300 hover:text-jacquier-gold whitespace-nowrap after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[2px] after:bg-jacquier-gold after:transition-all after:duration-300 hover:after:w-full"
               [class.text-white]="!isScrolled()"
               [class.text-jacquier-dark]="isScrolled()">
              {{ link.label }}
            </a>
          }
          <a routerLink="/reservation" 
             class="bg-jacquier-primary text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-jacquier-burgundy transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-300">
            Réserver
          </a>
        </nav>

        <!-- Mobile Menu Button -->
        <button class="lg:hidden focus:outline-none p-2 -mr-2" (click)="toggleMobileMenu()" aria-label="Toggle menu">
          <div class="w-6 h-5 relative flex flex-col justify-between">
            <span class="w-full h-[2px] rounded-full transition-all duration-300"
                  [class.bg-white]="!isScrolled() && !isMobileMenuOpen()"
                  [class.bg-jacquier-primary]="isScrolled() || isMobileMenuOpen()"
                  [class.rotate-45]="isMobileMenuOpen()"
                  [class.translate-y-[9px]]="isMobileMenuOpen()"></span>
            <span class="w-full h-[2px] rounded-full transition-all duration-300"
                  [class.bg-white]="!isScrolled() && !isMobileMenuOpen()"
                  [class.bg-jacquier-primary]="isScrolled() || isMobileMenuOpen()"
                  [class.opacity-0]="isMobileMenuOpen()"></span>
            <span class="w-full h-[2px] rounded-full transition-all duration-300"
                  [class.bg-white]="!isScrolled() && !isMobileMenuOpen()"
                  [class.bg-jacquier-primary]="isScrolled() || isMobileMenuOpen()"
                  [class.-rotate-45]="isMobileMenuOpen()"
                  [class.-translate-y-[9px]]="isMobileMenuOpen()"></span>
          </div>
        </button>
      </div>

      <!-- Mobile Nav Overlay -->
      <div class="fixed inset-0 bg-jacquier-dark/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden"
           [class.opacity-100]="isMobileMenuOpen()"
           [class.opacity-0]="!isMobileMenuOpen()"
           [class.pointer-events-auto]="isMobileMenuOpen()"
           [class.pointer-events-none]="!isMobileMenuOpen()"
           (click)="closeMobileMenu()">
      </div>

      <!-- Mobile Nav Panel -->
      <nav class="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white z-50 transform transition-transform duration-500 ease-in-out lg:hidden flex flex-col shadow-2xl"
           [class.translate-x-0]="isMobileMenuOpen()"
           [class.translate-x-full]="!isMobileMenuOpen()">
        
        <div class="p-6 flex justify-between items-center border-b border-gray-100">
          <span class="text-xl font-serif font-bold text-jacquier-primary uppercase tracking-widest">Menu</span>
          <button class="p-2 -mr-2 text-gray-500 hover:text-jacquier-primary transition-colors" (click)="closeMobileMenu()">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto py-6 px-6 flex flex-col space-y-6">
          @for (link of navLinks; track link.path) {
            <a [routerLink]="link.path" 
               (click)="closeMobileMenu()"
               routerLinkActive="text-jacquier-gold font-bold pl-4 border-l-2 border-jacquier-gold"
               [routerLinkActiveOptions]="{exact: link.exact}"
               class="text-jacquier-dark text-lg font-serif uppercase tracking-wider transition-all duration-300 hover:text-jacquier-gold hover:pl-2">
              {{ link.label }}
            </a>
          }
        </div>

        <div class="p-6 border-t border-gray-100 bg-gray-50">
          <a routerLink="/reservation" 
             (click)="closeMobileMenu()"
             class="block w-full bg-jacquier-primary text-white text-center py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-jacquier-burgundy transition-colors shadow-md">
            Réserver une table
          </a>
        </div>
      </nav>
    </header>
  `
})
export class HeaderComponent {
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);

  navLinks = [
    { path: '/', label: 'Accueil', exact: true },
    { path: '/menu', label: 'Menu & Vins', exact: false },
    { path: '/services-traiteur', label: 'Traiteur', exact: false },
    { path: '/ecole-gastronomie', label: 'École', exact: false },
    { path: '/about', label: 'L\'Équipe', exact: false },
    { path: '/gallery', label: 'Galerie', exact: false },
    { path: '/contact', label: 'Contact', exact: false },
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 50);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
}
