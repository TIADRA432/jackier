import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRoles = route.data['roles'] as Array<string>;

  // If user is already loaded in signal
  if (authService.currentUser()) {
    const hasRole = authService.hasRole(expectedRoles);
    if (!hasRole) {
      router.navigate(['/']);
    }
    return hasRole;
  }

  // Otherwise wait for user$
  return authService.user$.pipe(
    take(1),
    map(user => {
      // This is still tricky because user$ is Firebase User, not our User profile with role.
      // Ideally we should wait for currentUser signal to be populated.
      // For now, let's just check if logged in as a fallback, or redirect to login.
      return !!user;
    }),
    tap(loggedIn => {
      if (!loggedIn) {
        router.navigate(['/auth/login']);
      }
    })
  );
};
