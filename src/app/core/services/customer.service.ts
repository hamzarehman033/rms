import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CustomerContextItem {
  id: string;
  name: string;
  raw: any;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly CUSTOMERS_CACHE_KEY = 'customers_list';

  private readonly customersSubject = new BehaviorSubject<CustomerContextItem[]>([]);
  readonly customers$ = this.customersSubject.asObservable();

  private readonly activeCustomerSubject = new BehaviorSubject<CustomerContextItem | null>(null);
  readonly activeCustomer$ = this.activeCustomerSubject.asObservable();

  baseUrl: string = environment.baseUrl;
  url: string = '/Customer';

  constructor(private http: HttpClient) {
    this.restoreCustomers();
  }

  getCustomers(): Observable<any> {
    return this.http.get(this.baseUrl + this.url);
  }

  createCustomer(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + this.url, payload);
  }

  getCustomerById(id: number | string): Observable<any> {
    return this.http.get(this.baseUrl + this.url + '/' + encodeURIComponent(String(id)));
  }

  updateCustomer(id: number | string, payload: any): Observable<any> {
    return this.http.put(this.baseUrl + this.url + '/' + encodeURIComponent(String(id)), payload);
  }

  deleteCustomer(id: number | string): Observable<any> {
    return this.http.delete(this.baseUrl + this.url + '/' + encodeURIComponent(String(id)));
  }

  updateSubscriptionStatus(id: number | string, isActive: boolean): Observable<any> {
    return this.http.put(
      this.baseUrl +
        this.url +
        '/' +
        encodeURIComponent(String(id)) +
        '/subscription/' +
        encodeURIComponent(String(isActive)),
      {}
    );
  }

  deactivateCustomer(id: number | string): Observable<any> {
    return this.http.put(
      this.baseUrl + this.url + '/' + encodeURIComponent(String(id)) + '/deactivate',
      {}
    );
  }

  initializeFromApiResponse(response: any): void {
    const customers = response.data.pageData;
    this.customersSubject.next(customers);
    localStorage.setItem(this.CUSTOMERS_CACHE_KEY, JSON.stringify(customers));
    this.setActiveCustomer(customers[0]);
  }

  setActiveCustomerById(id: string): void {
    const customer = this.customersSubject.value.find(item => item.id === id);
    if (!customer) {
      return;
    }

    this.setActiveCustomer(customer);
  }

  getActiveCustomerId(): string | null {
    return this.activeCustomerSubject.value?.id ?? null;
  }

  clear(): void {
    localStorage.removeItem(this.CUSTOMERS_CACHE_KEY);
    this.customersSubject.next([]);
    this.activeCustomerSubject.next(null);
  }

  private setActiveCustomer(customer: CustomerContextItem): void {
    this.activeCustomerSubject.next(customer);
  }

  private restoreCustomers(): void {
    const cached = localStorage.getItem(this.CUSTOMERS_CACHE_KEY);
    if (!cached) {
      return;
    }

    try {
      const customers = JSON.parse(cached);

      this.customersSubject.next(customers);
      this.setActiveCustomer(customers[0]);
    } catch {
      localStorage.removeItem(this.CUSTOMERS_CACHE_KEY);
    }
  }

}
