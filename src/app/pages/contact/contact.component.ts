import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { SiteSettingsService } from '../../core/services/site-settings.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative h-[50vh] flex items-center justify-center text-center px-4 overflow-hidden bg-jacquier-dark">
      <img [ngSrc]="siteSettings.image('contactHero', '/og-image.png').url" fill priority
        class="object-cover opacity-40" [alt]="siteSettings.image('contactHero', '').altText || 'Contact'" referrerPolicy="no-referrer">
      <div class="relative z-10 max-w-4xl mx-auto text-white animate-fade-in-up">
        <span class="block text-jacquier-gold font-bold tracking-[0.2em] mb-4 uppercase text-sm md:text-base">Nous trouver à Conakry</span>
        <h1 class="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">Contact & Accès</h1>
      </div>
    </div>

    <section class="py-24 bg-jacquier-cream px-4">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row gap-16">
          <div class="lg:w-1/3 space-y-8">
            <div class="bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
              <h3 class="text-2xl font-serif font-bold text-jacquier-dark mb-4">Adresse</h3>
              <p class="text-jacquier-text font-light leading-relaxed">{{ info().address }}</p>
              <p class="text-sm text-gray-400 mt-2 uppercase tracking-wider font-bold">{{ info().neighborhood }}</p>
            </div>

            <div class="bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
              <h3 class="text-2xl font-serif font-bold text-jacquier-dark mb-4">Réservations</h3>
              <a [href]="phoneHref()" class="block text-2xl font-bold text-jacquier-primary mb-2 hover:text-jacquier-gold">{{ info().phone }}</a>
              <a [href]="'mailto:' + info().email" class="text-jacquier-text font-light hover:text-jacquier-gold">{{ info().email }}</a>
            </div>

            <div class="bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
              <h3 class="text-2xl font-serif font-bold text-jacquier-dark mb-4">Horaires</h3>
              <p class="text-jacquier-text font-light leading-relaxed">{{ info().openingHours }}</p>
              @if (siteSettings.openStatus().configured) {
                <div class="mt-5 flex items-center gap-2 rounded-xl bg-jacquier-cream px-4 py-3 text-sm">
                  <span [class]="siteSettings.openStatus().isOpen ? 'h-2.5 w-2.5 rounded-full bg-emerald-500' : 'h-2.5 w-2.5 rounded-full bg-gray-400'"></span>
                  <strong [class.text-emerald-700]="siteSettings.openStatus().isOpen" [class.text-gray-600]="!siteSettings.openStatus().isOpen">
                    {{ siteSettings.openStatus().label }}
                  </strong>
                  @if (siteSettings.openStatus().detail) { <span class="text-gray-500">· {{ siteSettings.openStatus().detail }}</span> }
                </div>
              }
            </div>
          </div>

          <div class="lg:w-2/3 h-[420px] sm:h-[500px] lg:h-auto bg-gray-200 rounded-3xl overflow-hidden shadow-2xl relative border border-gray-100">
            <iframe width="100%" height="100%" frameborder="0" scrolling="no" loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              [src]="mapUrl()" title="Localisation du restaurant"
              class="absolute inset-0 w-full h-full grayscale contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            </iframe>
            <div class="absolute inset-x-3 bottom-3 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/50 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-xs sm:p-6">
              <h4 class="font-bold text-jacquier-dark mb-1">Repère</h4>
              <p class="text-sm text-jacquier-text font-light">{{ info().address }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ContactComponent {
  readonly siteSettings = inject(SiteSettingsService);
  private readonly sanitizer = inject(DomSanitizer);
  readonly info = this.siteSettings.publicInfo;

  readonly mapUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://maps.google.com/maps?q=${encodeURIComponent(this.info().mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    )
  );

  phoneHref(): string {
    return 'tel:' + this.info().phone.replace(/[^+\d]/g, '');
  }
}
