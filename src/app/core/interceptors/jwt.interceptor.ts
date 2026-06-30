import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { CustomerService } from '../services/customer.service';

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const customerService = inject(CustomerService);
  const token = authService.getAccessToken();

  const activeCustomerId = customerService.getActiveCustomerId();
  const isAuthRequest = req.url.toLowerCase().includes('/auth/token');

  if (token) {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (activeCustomerId && !isAuthRequest) {
      const customerId = String(activeCustomerId).trim();
      if (customerId) {
        headers['X-Customer-Id'] = customerId;
      }
    }

    req = req.clone({
      setHeaders: headers,
    });
  }

  return next(req);
};
