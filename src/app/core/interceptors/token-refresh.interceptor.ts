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

let isRefreshing = false;

export const tokenRefreshInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<any> => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // If 401 and we have a refresh token, try to refresh
      if (error.status === 401 && authService.getRefreshToken() && !isRefreshing) {
        isRefreshing = true;

        return authService.refreshToken().pipe(
          switchMap((response: any) => {
            isRefreshing = false;
              
            // Support both raw and wrapped response contracts.
            const tokenData = response?.data ?? response;
            if (tokenData?.accessToken) {
              localStorage.setItem('access_token', tokenData.accessToken);
            }
            if (tokenData?.refreshToken) {
              localStorage.setItem('refresh_token', tokenData.refreshToken);
            }

            // Retry original request with new token.
            const token = tokenData?.accessToken;
            req = req.clone({
              setHeaders: token
                ? {
                    Authorization: `Bearer ${token}`
                  }
                : {}
            });

            return next(req);
          }),
          catchError((refreshError) => {
            isRefreshing = false;
            // Refresh failed, logout user.
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
