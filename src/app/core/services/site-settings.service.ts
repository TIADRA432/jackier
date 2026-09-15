import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { MediaReference, PublicSettings, SiteMediaSlot } from './admin-data.service';
import { environment } from '../../../environments/environment';

const FALLBACK_LOGO: MediaReference = {
  url: '/brand/le-jacquier-logo.svg',
  altText: 'Logo Le Jacquier',
};

@Injectable({ providedIn: 'root' })
export class SiteSettingsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  readonly settings = signal<PublicSettings>({});

  constructor() {
    void this.reload();
  }

  logo(): MediaReference {
    return this.settings().brand?.logo ?? FALLBACK_LOGO;
  }

  image(slot: SiteMediaSlot, fallbackUrl: string): MediaReference {
    return this.settings().brand?.siteMedia?.[slot] ?? { url: fallbackUrl, altText: '' };
  }

  async reload(): Promise<void> {
    try {
      this.settings.set(await firstValueFrom(this.http.get<PublicSettings>(`${this.apiUrl}/settings`)));
    } catch {
      // Public pages remain usable with their local fallback artwork when the API is unavailable.
    }
  }
}
