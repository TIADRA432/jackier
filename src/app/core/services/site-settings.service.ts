import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { MediaReference, PublicSettings, SiteMediaSlot } from './admin-data.service';
import { environment } from '../../../environments/environment';

const FALLBACK_LOGO: MediaReference = {
  url: '/brand/le-jacquier-logo.svg',
  altText: 'Logo Le Jacquier',
};

const DEFAULT_SETTINGS: Required<Pick<PublicSettings,
  'restaurantName' | 'tagline' | 'address' | 'neighborhood' | 'phone' |
  'email' | 'openingHours' | 'currency' | 'mapQuery'
>> = {
  restaurantName: 'Le Jacquier',
  tagline: "L'élégance de la fusion franco-guinéenne dans un cadre exceptionnel à Kipé.",
  address: 'Face au Lycée Kipé / T2 Carrefour Métal Guinée, Conakry',
  neighborhood: 'Kipé',
  phone: '+224 625 67 53 63',
  email: 'contact@lejacquier-conakry.com',
  openingHours: 'Tous les jours de 12h à 23h',
  currency: 'FG',
  mapQuery: 'Kipé, Conakry, Guinée',
};

@Injectable({ providedIn: 'root' })
export class SiteSettingsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  readonly settings = signal<PublicSettings>({});
  readonly loading = signal(true);

  readonly publicInfo = computed(() => {
    const current = this.settings();
    return {
      restaurantName: current.restaurantName?.trim() || DEFAULT_SETTINGS.restaurantName,
      tagline: current.tagline?.trim() || DEFAULT_SETTINGS.tagline,
      address: current.address?.trim() || DEFAULT_SETTINGS.address,
      neighborhood: current.neighborhood?.trim() || DEFAULT_SETTINGS.neighborhood,
      phone: current.phone?.trim() || DEFAULT_SETTINGS.phone,
      email: current.email?.trim() || DEFAULT_SETTINGS.email,
      openingHours: current.openingHours?.trim() || DEFAULT_SETTINGS.openingHours,
      currency: current.currency?.trim() || DEFAULT_SETTINGS.currency,
      mapQuery: current.mapQuery?.trim() || current.address?.trim() || DEFAULT_SETTINGS.mapQuery,
      socialMedia: current.socialMedia ?? {},
    };
  });

  constructor() {
    void this.reload();
  }

  logo(): MediaReference {
    return this.settings().brand?.logo ?? FALLBACK_LOGO;
  }

  image(slot: SiteMediaSlot, fallbackUrl: string): MediaReference {
    return this.settings().brand?.siteMedia?.[slot] ?? { url: fallbackUrl, altText: '' };
  }

  socialUrl(key: 'facebook' | 'instagram' | 'whatsapp' | 'tiktok' | 'linkedin'): string {
    return this.publicInfo().socialMedia[key]?.trim() ?? '';
  }

  async reload(): Promise<void> {
    this.loading.set(true);
    try {
      this.settings.set(await firstValueFrom(this.http.get<PublicSettings>(`${this.apiUrl}/settings`)));
    } catch {
      // Public pages remain usable with defaults and local fallback artwork.
    } finally {
      this.loading.set(false);
    }
  }
}
