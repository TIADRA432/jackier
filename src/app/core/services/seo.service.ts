import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SiteSettingsService } from './site-settings.service';

export interface SeoConfig {
  description: string;
  noindex?: boolean;
}

const SITE_ORIGIN = 'https://jackier.abdourahmane591.workers.dev';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);
  private readonly siteSettings = inject(SiteSettingsService);
  private readonly currentUrl = signal('/');

  constructor() {
    effect(() => {
      this.siteSettings.publicInfo();
      this.siteSettings.settings();
      this.currentUrl();
      this.updateRestaurantStructuredData();
    });
  }

  apply(url: string, config: SeoConfig): void {
    const cleanPath = this.cleanPath(url);
    const canonical = `${SITE_ORIGIN}${cleanPath === '/' ? '/' : cleanPath}`;
    const pageTitle = this.title.getTitle() || this.siteSettings.publicInfo().restaurantName;

    this.currentUrl.set(cleanPath);
    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'robots', content: config.noindex ? 'noindex, nofollow' : 'index, follow' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteSettings.publicInfo().restaurantName });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:image', content: this.absoluteUrl(this.siteSettings.image('homeHero', '/og-image.png').url) });
    this.meta.updateTag({ property: 'og:locale', content: 'fr_FR' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: this.absoluteUrl(this.siteSettings.image('homeHero', '/og-image.png').url) });

    this.setCanonical(canonical);
  }

  private cleanPath(url: string): string {
    const value = (url || '/').split('?')[0].split('#')[0] || '/';
    return value.startsWith('/') ? value : `/${value}`;
  }

  private absoluteUrl(value: string): string {
    if (/^https?:\/\//i.test(value)) return value;
    return `${SITE_ORIGIN}${value.startsWith('/') ? value : `/${value}`}`;
  }

  private setCanonical(href: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private updateRestaurantStructuredData(): void {
    const info = this.siteSettings.publicInfo();
    const settings = this.siteSettings.settings();

    const sameAs = Object.values(info.socialMedia ?? {})
      .filter((value): value is string => typeof value === 'string' && /^https?:\/\//i.test(value));

    const weekly = settings.weeklyHours;
    const dayNames: Record<string, string> = {
      monday: 'https://schema.org/Monday',
      tuesday: 'https://schema.org/Tuesday',
      wednesday: 'https://schema.org/Wednesday',
      thursday: 'https://schema.org/Thursday',
      friday: 'https://schema.org/Friday',
      saturday: 'https://schema.org/Saturday',
      sunday: 'https://schema.org/Sunday',
    };

    const openingHoursSpecification = weekly?.enabled
      ? Object.entries(weekly.days)
          .filter(([, day]) => !day.closed && Boolean(day.open) && Boolean(day.close))
          .map(([key, day]) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: dayNames[key],
            opens: day.open,
            closes: day.close,
          }))
      : undefined;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: info.restaurantName,
      url: SITE_ORIGIN,
      image: this.absoluteUrl(this.siteSettings.image('homeHero', '/og-image.png').url),
      telephone: info.phone,
      email: info.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: info.address,
        addressLocality: info.neighborhood || 'Conakry',
        addressCountry: 'GN',
      },
      ...(sameAs.length ? { sameAs } : {}),
      ...(openingHoursSpecification?.length ? { openingHoursSpecification } : {}),
    };

    let script = this.document.querySelector<HTMLScriptElement>('#restaurant-jsonld');
    if (!script) {
      script = this.document.createElement('script');
      script.id = 'restaurant-jsonld';
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
  }
}
