

import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection, ErrorHandler } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { App } from './src/app/app';
import { routes } from './src/app/app.routes';
import { GlobalErrorHandler } from './src/app/core/error-handler/global-error-handler';
import { authInterceptor } from './src/app/core/interceptors/auth.interceptor';
import { environment } from './src/environments/environment';

bootstrapApplication(App, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
