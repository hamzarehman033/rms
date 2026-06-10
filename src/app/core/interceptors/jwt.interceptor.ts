import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CustomerService } from '../services/customer.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private customerService: CustomerService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();

    const activeCustomerId = this.customerService.getActiveCustomerId();
    const isAuthRequest = req.url.toLowerCase().includes('/auth/');

    if (token) {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };

      if (activeCustomerId && !isAuthRequest) {
        headers['X-Customer-Id'] = activeCustomerId;
      }

      req = req.clone({
        setHeaders: headers,
      });
    }

    return next.handle(req);
  }
}
