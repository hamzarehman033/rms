import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomerService } from './customer.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly baseUrl = environment.baseUrl;
  private readonly url = '/Auth/Users';

  constructor(
    private http: HttpClient,
    private customerService: CustomerService
  ) {}

  getUsers(customerId?: string): Observable<any> {
    return this.http.get(this.baseUrl + this.url, {
      params: this.getCustomerParams(customerId),
    });
  }

  getUserById(id: number | string, customerId?: string): Observable<any> {
    return this.http.get(this.baseUrl + this.url + '/' + encodeURIComponent(String(id)), {
      params: this.getCustomerParams(customerId),
    });
  }

  createUser(payload: any, customerId?: string): Observable<any> {
    return this.http.post(this.baseUrl + this.url, payload, {
      params: this.getCustomerParams(customerId),
    });
  }

  updateUser(id: number | string, payload: any, customerId?: string): Observable<any> {
    return this.http.post(this.baseUrl + this.url + '/' + encodeURIComponent(String(id)), payload, {
      params: this.getCustomerParams(customerId),
    });
  }

  deleteUser(id: number | string, customerId?: string): Observable<any> {
    return this.http.delete(this.baseUrl + this.url + '/' + encodeURIComponent(String(id)), {
      params: this.getCustomerParams(customerId),
    });
  }

  private getCustomerParams(customerId?: string): HttpParams {
    const activeCustomerId = customerId || this.customerService.getActiveCustomerId() || '';
    return new HttpParams().set('customerId', activeCustomerId);
  }
}