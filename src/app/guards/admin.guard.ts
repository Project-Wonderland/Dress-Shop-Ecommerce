import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If user is authenticated and has 'admin' role
  if (authService.currentUser() && authService.isAdmin()) {
    return true;
  }

  // Redirect immediately to admin login
  return router.createUrlTree(['/admin/login'], {
    queryParams: { returnUrl: state.url }
  });
};
