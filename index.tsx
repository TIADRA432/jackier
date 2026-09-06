

import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppComponent } from './src/app.component';
import { routes } from './src/app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    // URLs propres (/menu, /contact...) au lieu de hash-routing (/#/menu) : meilleures
    // pour le SEO et le partage de liens. Cloudflare sert index.html en fallback SPA
    // pour toute route inconnue (assets.not_found_handling), donc le rafraîchissement
    // de page sur une route profonde continue de fonctionner.
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })),
    provideHttpClient(withFetch())
  ]
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
