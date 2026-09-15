import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AdminAuthService } from '../services/admin-auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  // Only first-party API calls should receive an Authorization header.
  if (!request.url.startsWith('/api/')) return next(request);

  const auth = inject(AdminAuthService);
  return from(auth.getAccessToken()).pipe(
    switchMap((accessToken) => next(accessToken
      ? request.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
      : request
    ))
  );
};
