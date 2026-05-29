import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenRefreshInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // If 401 and we have a refresh token, try to refresh
        if (error.status === 401 && this.authService.getRefreshToken() && !this.isRefreshing) {
          this.isRefreshing = true;

          return this.authService.refreshToken().pipe(
            switchMap((response: any) => {
              this.isRefreshing = false;
              
              // Update tokens from response
              if (response.accessToken) {
                localStorage.setItem('access_token', response.accessToken);
              }
              if (response.refreshToken) {
                localStorage.setItem('refresh_token', response.refreshToken);
              }

              // Retry original request with new token
              const token = response.accessToken;
              req = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`
                }
              });

              return next.handle(req);
            }),
            catchError((refreshError) => {
              this.isRefreshing = false;
              // Refresh failed, logout user
              this.authService.logout();
              return throwError(() => refreshError);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}
