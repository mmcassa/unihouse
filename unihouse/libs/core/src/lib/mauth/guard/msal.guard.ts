import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

/**
 * Prevents authenticated users from accessing unauthenticated routes
 * @param route 
 * @param state 
 * @returns 
 */
export const unAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthenticationService)
  const isAuthenticated = authService.currentAuthStatus;// your authentication logic here

  if (!isAuthenticated) {
    return true;
  } else {
    return router.parseUrl('/home');
  }
};

/**
 * Prevents authenticated users from accessing unauthenticated routes
 * @param route 
 * @param state 
 * @returns 
 */
export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthenticationService)
    const isAuthenticated = authService.currentAuthStatus;// your authentication logic here
  
    if (isAuthenticated) {
      return true;
    } else {
      return router.parseUrl('/');
    }
  };