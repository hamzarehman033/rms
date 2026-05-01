import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  login(): void {
    this.router.navigate(['/dashboard']);
    
  }

  logout(): void {
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getCurrentUser(): string | null {
    return localStorage.getItem('userEmail');
  }
}
