import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteSettingsService } from '../../../core/services/site-settings.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bg-jacquier-dark text-gray-300 py-16 lg:py-24 border-t-4 border-jacquier-gold">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        <div class="lg:col-span-1">
          <h3 class="text-3xl font-serif font-bold text-jacquier-gold mb-6 tracking-wide">{{ info().restaurantName }}</h3>
          <p class="mb-8 text-sm leading-relaxed font-light text-gray-400">{{ info().tagline }}</p>

          @if (hasSocialLinks()) {
            <div class="flex flex-wrap gap-3" aria-label="Réseaux sociaux">
              @if (siteSettings.socialUrl('facebook')) {
                <a [href]="siteSettings.socialUrl('facebook')" target="_blank" rel="noopener noreferrer"
                  class="w-10 h-10 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center hover:bg-jacquier-primary hover:border-jacquier-primary hover:text-white transition-all duration-300"
                  aria-label="Facebook">
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              }
              @if (siteSettings.socialUrl('instagram')) {
                <a [href]="siteSettings.socialUrl('instagram')" target="_blank" rel="noopener noreferrer"
                  class="w-10 h-10 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center hover:bg-jacquier-primary hover:border-jacquier-primary hover:text-white transition-all duration-300"
                  aria-label="Instagram">
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z"/></svg>
                </a>
              }
              @if (siteSettings.socialUrl('whatsapp')) {
                <a [href]="siteSettings.socialUrl('whatsapp')" target="_blank" rel="noopener noreferrer"
                  class="rounded-full bg-gray-800/50 border border-gray-700 px-4 h-10 flex items-center justify-center text-xs font-bold uppercase tracking-wider hover:bg-jacquier-primary hover:border-jacquier-primary hover:text-white transition-all duration-300"
                  aria-label="WhatsApp">WhatsApp</a>
              }
              @if (siteSettings.socialUrl('tiktok')) {
                <a [href]="siteSettings.socialUrl('tiktok')" target="_blank" rel="noopener noreferrer"
                  class="rounded-full bg-gray-800/50 border border-gray-700 px-4 h-10 flex items-center justify-center text-xs font-bold uppercase tracking-wider hover:bg-jacquier-primary hover:border-jacquier-primary hover:text-white transition-all duration-300"
                  aria-label="TikTok">TikTok</a>
              }
              @if (siteSettings.socialUrl('linkedin')) {
                <a [href]="siteSettings.socialUrl('linkedin')" target="_blank" rel="noopener noreferrer"
                  class="rounded-full bg-gray-800/50 border border-gray-700 px-4 h-10 flex items-center justify-center text-xs font-bold uppercase tracking-wider hover:bg-jacquier-primary hover:border-jacquier-primary hover:text-white transition-all duration-300"
                  aria-label="LinkedIn">LinkedIn</a>
              }
            </div>
          }
        </div>

        <div class="lg:col-span-1">
          <h4 class="text-sm font-bold text-white mb-6 uppercase tracking-widest">Navigation</h4>
          <ul class="space-y-4 text-sm font-light">
            <li><a routerLink="/menu" class="hover:text-jacquier-gold transition-colors">Menu & Vins</a></li>
            <li><a routerLink="/services-traiteur" class="hover:text-jacquier-gold transition-colors">Traiteur & Événements</a></li>
            <li><a routerLink="/ecole-gastronomie" class="hover:text-jacquier-gold transition-colors">École de Gastronomie</a></li>
            <li><a routerLink="/about" class="hover:text-jacquier-gold transition-colors">L'Équipe</a></li>
            <li><a routerLink="/gallery" class="hover:text-jacquier-gold transition-colors">Galerie</a></li>
          </ul>
        </div>

        <div class="lg:col-span-1">
          <h4 class="text-sm font-bold text-white mb-6 uppercase tracking-widest">Contact</h4>
          <ul class="space-y-4 text-sm font-light">
            <li class="leading-relaxed">{{ info().address }}</li>
            <li><a [href]="phoneHref()" class="hover:text-jacquier-gold transition-colors">{{ info().phone }}</a></li>
            <li><a [href]="'mailto:' + info().email" class="hover:text-jacquier-gold transition-colors">{{ info().email }}</a></li>
          </ul>
        </div>

        <div class="lg:col-span-1">
          <h4 class="text-sm font-bold text-white mb-6 uppercase tracking-widest">Horaires</h4>
          <div class="bg-gray-800/30 border border-gray-700/50 p-6 rounded-2xl backdrop-blur-sm">
            <p class="text-jacquier-gold font-bold mb-2 tracking-wide uppercase text-xs">{{ info().neighborhood }}</p>
            <p class="text-white text-xl font-serif leading-relaxed">{{ info().openingHours }}</p>
          </div>
          <a routerLink="/reservation" class="mt-6 inline-block w-full text-center border border-jacquier-gold text-jacquier-gold px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-jacquier-gold hover:text-jacquier-dark transition-colors duration-300">
            Réserver une table
          </a>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-light">
        <p>&copy; {{ currentYear }} {{ info().restaurantName }}. Tous droits réservés.</p>
        @if (info().legalNoticeUrl || info().privacyPolicyUrl) {
          <div class="flex flex-wrap gap-x-6 gap-y-2 mt-4 md:mt-0">
            @if (info().legalNoticeUrl) {
              <a [href]="info().legalNoticeUrl" target="_blank" rel="noopener noreferrer"
                class="hover:text-jacquier-gold transition-colors">Mentions légales</a>
            }
            @if (info().privacyPolicyUrl) {
              <a [href]="info().privacyPolicyUrl" target="_blank" rel="noopener noreferrer"
                class="hover:text-jacquier-gold transition-colors">Politique de confidentialité</a>
            }
          </div>
        }
      </div>
    </footer>
  `
})
export class FooterComponent {
  readonly siteSettings = inject(SiteSettingsService);
  readonly info = this.siteSettings.publicInfo;
  readonly currentYear = new Date().getFullYear();

  phoneHref(): string {
    return 'tel:' + this.info().phone.replace(/[^+\d]/g, '');
  }

  hasSocialLinks(): boolean {
    return ['facebook', 'instagram', 'whatsapp', 'tiktok', 'linkedin']
      .some(key => Boolean(this.info().socialMedia[key]));
  }
}
