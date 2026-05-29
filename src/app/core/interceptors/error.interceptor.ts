import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastService: ToastService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): void {
    let errorMessage = 'An unexpected error occurred';
    let errorSummary = 'Error';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
      errorSummary = 'Client Error';
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to the server. Please check your connection.';
        errorSummary = 'Connection Error';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Bad request. Please check your input.';
        errorSummary = 'Bad Request';
      } else if (error.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
        errorSummary = 'Unauthorized';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to access this resource.';
        errorSummary = 'Forbidden';
      } else if (error.status === 404) {
        errorMessage = 'The requested resource was not found.';
        errorSummary = 'Not Found';
      } else if (error.status === 500) {
        errorMessage = 'An internal server error occurred. Please try again later.';
        errorSummary = 'Server Error';
      } else if (error.status >= 500) {
        errorMessage = 'A server error occurred. Please try again later.';
        errorSummary = 'Server Error';
      } else {
        errorMessage = error.error?.message || `HTTP Error ${error.status}`;
        errorSummary = `Error ${error.status}`;
      }
    }

    this.toastService.showError(errorSummary, errorMessage);
  }
}
