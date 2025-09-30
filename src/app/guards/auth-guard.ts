import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const expectedRoles = route.data['roles'] as Array<'admin' | 'user'>;
  if (expectedRoles && !expectedRoles.includes(authService.userRole())) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
