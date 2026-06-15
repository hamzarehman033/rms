import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { CustomerService } from './customer.service';
import { AppRole } from '../constants/roles';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromToken());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  baseUrl: string = environment.baseUrl;
  url: string = '/Auth';

  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';

  constructor(
    private router: Router,
    private http: HttpClient,
    private customerService: CustomerService
  ) {
    this.updateAuthState(this.hasToken());
  }

  login(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + this.url + '/token', payload);
  }

  handleLoginSuccess(responseObj: any): void {
    const response = responseObj.data;
    if (response.accessToken) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
    }
    if (response.refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    }
    const user = this.extractUserFromToken(response.token);
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.currentUserSubject.next(user);
    }
    this.updateAuthState(true);
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    const payload = { refreshToken };
    return this.http.post(this.baseUrl + this.url + '/refresh', payload);
  }

  createAdminUser(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + this.url + '/admin/create-user', payload);
  }

  changePassword(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + this.url + '/changepassword', payload);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private hasToken(): boolean {
    return !!this.getAccessToken();
  }

  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    try {
      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) return true;
      const expiration = payload.exp * 1000;
      return Date.now() >= expiration;
    } catch (error) {
      return true;
    }
  }

  updateAuthState(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.customerService.clear();
    this.currentUserSubject.next(null);
    this.updateAuthState(false);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return this.hasToken() && !this.isTokenExpired();
  }

  getCurrentUser(): any {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  private getUserFromToken(): any {
    const token = this.getAccessToken();
    return token ? this.extractUserFromToken(token) : null;
  }

  private extractUserFromToken(token: string): any {
    try {
      const payload = this.decodeToken(token);
      return {
        id: payload.sub || payload.id,
        email: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/emailaddress'] || payload.email,
        name: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload.name,
        roles: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        claims: payload
      };
    } catch (error) {
      console.error('Error extracting user from token:', error);
      return null;
    }
  }

  hasRole(role: AppRole): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  }

  hasAnyRole(roles: AppRole[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
