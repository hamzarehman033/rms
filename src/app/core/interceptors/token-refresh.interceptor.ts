import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

function isAuthEndpoint(url: string): boolean {
  const normalized = url.toLowerCase();
  return normalized.includes('/auth/token') || normalized.includes('/auth/refresh');
}

export const tokenRefreshInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<any> => {
  const authService = inject(AuthService);

  if (isAuthEndpoint(req.url)) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || !authService.getRefreshToken()) {
        return throwError(() => error);
      }

      return authService.refreshToken().pipe(
        switchMap((accessToken: string) =>
          next(
            req.clone({
              setHeaders: { Authorization: `Bearer ${accessToken}` },
            })
          )
        ),
          catchError((refreshError) => {
            authService.logout();
            return throwError(() => refreshError);
          })
      );
    })
  );
};
