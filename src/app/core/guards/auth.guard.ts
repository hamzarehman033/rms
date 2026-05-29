import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated()) {
      // Check for role-based access
      if (route.data['roles'] && route.data['roles'].length > 0) {
        if (this.authService.hasAnyRole(route.data['roles'])) {
          return true;
        } else {
          // User doesn't have required role
          this.router.navigate(['/unauthorized']);
          return false;
        }
      }
      return true;
    }

    // Store the attempted URL for redirecting after login
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
