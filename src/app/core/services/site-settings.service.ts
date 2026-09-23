import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
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
  private readonly platformId = inject(PLATFORM_ID);
  private readonly now = signal(new Date());

  readonly settings = signal<PublicSettings>({});
  readonly loading = signal(true);

  readonly openStatus = computed(() => {
    const schedule = this.settings().weeklyHours;
    if (!schedule?.enabled) {
      return { configured: false, isOpen: false, label: this.publicInfo().openingHours, detail: '' };
    }

    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: schedule.timezone || 'Africa/Conakry',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(this.now());

    const weekdayShort = parts.find(part => part.type === 'weekday')?.value ?? '';
    const hour = Number(parts.find(part => part.type === 'hour')?.value ?? '0');
    const minute = Number(parts.find(part => part.type === 'minute')?.value ?? '0');
    const currentMinutes = hour * 60 + minute;

    const dayMap: Record<string, keyof typeof schedule.days> = {
      Mon: 'monday', Tue: 'tuesday', Wed: 'wednesday', Thu: 'thursday',
      Fri: 'friday', Sat: 'saturday', Sun: 'sunday'
    };
    const order: Array<keyof typeof schedule.days> = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
    const todayKey = dayMap[weekdayShort] ?? 'monday';
    const todayIndex = order.indexOf(todayKey);
    const previousKey = order[(todayIndex + 6) % 7];

    const toMinutes = (value: string) => {
      const [h, m] = value.split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    };

    const today = schedule.days[todayKey];
    const previous = schedule.days[previousKey];

    let isOpen = false;
    let closesAt = '';

    if (today && !today.closed && today.open && today.close) {
      const open = toMinutes(today.open);
      const close = toMinutes(today.close);
      if (open < close) {
        isOpen = currentMinutes >= open && currentMinutes < close;
        if (isOpen) closesAt = today.close;
      } else {
        isOpen = currentMinutes >= open;
        if (isOpen) closesAt = today.close;
      }
    }

    if (!isOpen && previous && !previous.closed && previous.open && previous.close) {
      const prevOpen = toMinutes(previous.open);
      const prevClose = toMinutes(previous.close);
      if (prevOpen > prevClose && currentMinutes < prevClose) {
        isOpen = true;
        closesAt = previous.close;
      }
    }

    const nextOpening = (() => {
      if (isOpen) return '';
      for (let offset = 0; offset < 7; offset++) {
        const key = order[(todayIndex + offset) % 7];
        const entry = schedule.days[key];
        if (!entry || entry.closed || !entry.open) continue;
        if (offset === 0 && toMinutes(entry.open) <= currentMinutes) continue;
        const labels: Record<string, string> = {
          monday: 'lundi', tuesday: 'mardi', wednesday: 'mercredi', thursday: 'jeudi',
          friday: 'vendredi', saturday: 'samedi', sunday: 'dimanche'
        };
        return offset === 0 ? `ouvre à ${entry.open}` : `ouvre ${labels[key]} à ${entry.open}`;
      }
      return '';
    })();

    return {
      configured: true,
      isOpen,
      label: isOpen ? 'Ouvert maintenant' : 'Fermé actuellement',
      detail: isOpen && closesAt ? `jusqu’à ${closesAt}` : nextOpening
    };
  });

  readonly today = computed(() => {
    const today = this.settings().today;
    return {
      enabled: today?.enabled ?? false,
      eyebrow: today?.eyebrow?.trim() || 'Aujourd’hui au Jacquier',
      title: today?.title?.trim() || '',
      message: today?.message?.trim() || '',
      featuredDishId: today?.featuredDishId?.trim() || '',
      ctaLabel: today?.ctaLabel?.trim() || 'Réserver une table',
      ctaPath: today?.ctaPath || '/reservation',
    };
  });

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
      legalNoticeUrl: current.legalNoticeUrl?.trim() || '',
      privacyPolicyUrl: current.privacyPolicyUrl?.trim() || '',
      socialMedia: current.socialMedia ?? {},
    };
  });

  constructor() {
    void this.reload();
    if (isPlatformBrowser(this.platformId)) {
      window.setInterval(() => this.now.set(new Date()), 60_000);
    }
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
