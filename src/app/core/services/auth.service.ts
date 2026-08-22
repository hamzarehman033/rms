import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { finalize, map, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CustomerService } from './customer.service';
import { AppRole } from '../constants/roles';
import { SignalrService } from './signalr.service';
import { RealtimeDataSourceService } from './realtime-data-source.service';
import { GraphService } from './graph.service';
import { SitesStreamStateService } from './sites-stream-state.service';
import { toast } from '../../utils/global-toast';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromToken());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private refreshInFlight$: Observable<string> | null = null;

  baseUrl: string = environment.baseUrl;
  url: string = '/Auth';

  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';
  private readonly USER_MODULES_KEY = 'current_user_modules';

  constructor(
    private router: Router,
    private http: HttpClient,
    private customerService: CustomerService,
    private signalrService: SignalrService,
    private realtimeDataSourceService: RealtimeDataSourceService,
    private graphService: GraphService,
    private sitesStreamStateService: SitesStreamStateService
  ) {
    this.updateAuthState(this.hasToken() || !!this.getRefreshToken());
  }

  login(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + this.url + '/login', payload);
  }

  handleLoginSuccess(responseObj: any): void {
    const response = responseObj.data;
    if (response.token) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, response.token);
    }
    if (response.modules) {
      localStorage.setItem(this.USER_MODULES_KEY, JSON.stringify(response.modules || []));
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

  /** Shared in-flight refresh; returns the new access token. */
  refreshToken(): Observable<string> {
    if (this.refreshInFlight$) {
      return this.refreshInFlight$;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token'));
    }

    this.refreshInFlight$ = this.http
      .get(this.baseUrl + this.url + '/refresh', { params: { refreshToken } })
      .pipe(
        map((response: any) => {
          const data = response?.data ?? response;
          const accessToken = data?.token ?? data?.accessToken;
          if (!accessToken) {
            throw new Error('Refresh response missing access token');
          }

          localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
          if (data.refreshToken) {
            localStorage.setItem(this.REFRESH_TOKEN_KEY, data.refreshToken);
          }

          const user = this.extractUserFromToken(accessToken);
          if (user) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
          this.updateAuthState(true);
          return accessToken as string;
        }),
        finalize(() => {
          this.refreshInFlight$ = null;
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );

    return this.refreshInFlight$;
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
    this.refreshInFlight$ = null;
    this.realtimeDataSourceService.clear();
    this.graphService.clearCache();
    this.sitesStreamStateService.clear();
    toast.clear();
    void this.signalrService.stop();
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.USER_MODULES_KEY);
    this.customerService.clear();
    this.currentUserSubject.next(null);
    this.updateAuthState(false);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    if (this.getRefreshToken()) {
      return true;
    }
    return this.hasToken() && !this.isTokenExpired();
  }

  getCurrentUser(): any {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  getCurrentUserModules(): any[] {
    const modulesJson = localStorage.getItem(this.USER_MODULES_KEY);
    return modulesJson ? JSON.parse(modulesJson) : [];
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
