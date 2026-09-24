
import { Component, signal, ChangeDetectionStrategy, ElementRef, HostListener, OnDestroy, inject, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      [class]="isScrolled() || isMobileMenuOpen()
        ? 'fixed w-full z-50 border-b border-white/40 bg-white/90 py-2 shadow-[0_10px_35px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-700'
        : 'fixed w-full z-50 border-b border-transparent bg-transparent py-6 transition-all duration-700'">
      <div class="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <!-- Logo -->
        <a routerLink="/" class="inline-flex h-11 items-center transition-all duration-500"
           [class.text-jacquier-gold]="!isScrolled() && !isMobileMenuOpen()"
           [class.text-jacquier-primary]="isScrolled() || isMobileMenuOpen()">
           <img [src]="siteSettings.logo().url" [alt]="siteSettings.logo().altText"
             [class]="isScrolled() ? 'h-9 w-auto max-w-[200px] object-contain object-left transition-all duration-500' : 'h-10 w-auto max-w-[220px] object-contain object-left transition-all duration-500'" />
        </a>

        <!-- Desktop Nav -->
        <nav class="hidden xl:flex items-center gap-5 2xl:gap-7" aria-label="Navigation principale">
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
             class="bg-jacquier-primary text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-jacquier-burgundy transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-300">
            Réserver
          </a>
        </nav>

        <!-- Mobile Menu Button -->
        <button class="xl:hidden rounded-lg p-2 -mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jacquier-gold focus-visible:ring-offset-2" (click)="toggleMobileMenu()"
                [attr.aria-label]="isMobileMenuOpen() ? 'Fermer le menu' : 'Ouvrir le menu'"
                [attr.aria-expanded]="isMobileMenuOpen()" aria-controls="mobile-nav-panel">
          <div class="w-6 h-5 relative flex flex-col justify-between" aria-hidden="true">
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
      <div class="fixed inset-0 bg-jacquier-dark/50 backdrop-blur-sm z-40 transition-opacity duration-300 xl:hidden"
           [class.opacity-100]="isMobileMenuOpen()"
           [class.opacity-0]="!isMobileMenuOpen()"
           [class.pointer-events-auto]="isMobileMenuOpen()"
           [class.pointer-events-none]="!isMobileMenuOpen()"
           (click)="closeMobileMenu()">
      </div>

      <!-- Mobile Nav Panel -->
      <nav id="mobile-nav-panel" aria-label="Navigation mobile"
           [attr.aria-hidden]="!isMobileMenuOpen()"
           [attr.inert]="isMobileMenuOpen() ? null : ''"
           class="fixed top-0 right-0 h-full w-full bg-jacquier-cream z-50 transform transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)] xl:hidden flex flex-col shadow-2xl"
           [class.translate-x-0]="isMobileMenuOpen()"
           [class.translate-x-full]="!isMobileMenuOpen()">
        
        <div class="p-6 flex justify-between items-center border-b border-gray-100">
          <span class="text-xl font-serif font-bold text-jacquier-primary uppercase tracking-widest">Menu</span>
          <button #mobileCloseButton class="rounded-lg p-2 -mr-2 text-gray-500 hover:text-jacquier-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jacquier-gold" (click)="closeMobileMenu()" aria-label="Fermer le menu">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-8 py-10 flex flex-col justify-center space-y-7">
          @for (link of navLinks; track link.path) {
            <a [routerLink]="link.path" 
               (click)="closeMobileMenu()"
               routerLinkActive="text-jacquier-gold font-bold pl-4 border-l-2 border-jacquier-gold"
               [routerLinkActiveOptions]="{exact: link.exact}"
               class="text-jacquier-dark text-3xl font-serif tracking-wide transition-all duration-500 hover:text-jacquier-gold hover:translate-x-2">
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
export class HeaderComponent implements OnDestroy {
  readonly siteSettings = inject(SiteSettingsService);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly mobileCloseButton = viewChild<ElementRef<HTMLButtonElement>>('mobileCloseButton');
  private previousFocus: HTMLElement | null = null;
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);

  constructor() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      // A route change must never leave the page locked or the mobile drawer layered over content.
      this.isMobileMenuOpen.set(false);
      this.document.body.style.overflow = '';
    });
  }

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
    if (this.isMobileMenuOpen()) this.closeMobileMenu();
    else this.openMobileMenu();
  }

  openMobileMenu() {
    this.previousFocus = this.document.activeElement instanceof HTMLElement ? this.document.activeElement : null;
    this.isMobileMenuOpen.set(true);
    this.document.body.style.overflow = 'hidden';
    queueMicrotask(() => this.mobileCloseButton()?.nativeElement.focus());
  }

  closeMobileMenu() {
    if (!this.isMobileMenuOpen()) return;
    this.isMobileMenuOpen.set(false);
    this.document.body.style.overflow = '';
    queueMicrotask(() => this.previousFocus?.focus());
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isMobileMenuOpen()) this.closeMobileMenu();
  }

  @HostListener('document:keydown.tab', ['$event'])
  trapMobileFocus(event: KeyboardEvent): void {
    if (!this.isMobileMenuOpen()) return;
    const panel = this.document.getElementById('mobile-nav-panel');
    if (!panel) return;
    const focusable = Array.from(panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(element => !element.hasAttribute('disabled'));
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && this.document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && this.document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  ngOnDestroy(): void {
    this.document.body.style.overflow = '';
  }
}
