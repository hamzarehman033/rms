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
  private readonly ACTIVE_CUSTOMER_KEY = 'active_customer_id';

  private readonly customersSubject = new BehaviorSubject<CustomerContextItem[]>([]);
  readonly customers$ = this.customersSubject.asObservable();

  private readonly activeCustomerSubject = new BehaviorSubject<CustomerContextItem | null>(null);
  readonly activeCustomer$ = this.activeCustomerSubject.asObservable();

  baseUrl: string = environment.baseUrl;
  url: string = '/Customer';

  constructor(private http: HttpClient) {}

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
    const customers = this.normalizeCustomers(this.extractList(response));
    this.customersSubject.next(customers);

    if (!customers.length) {
      this.clear();
      return;
    }

    const persistedId = localStorage.getItem(this.ACTIVE_CUSTOMER_KEY);
    const preferred =
      (persistedId ? customers.find(customer => customer.id === persistedId) : undefined) || customers[0];

    this.setActiveCustomer(preferred);
  }

  setActiveCustomerById(id: string): void {
    const customer = this.customersSubject.value.find(item => item.id === id);
    if (!customer) {
      return;
    }

    this.setActiveCustomer(customer);
  }

  getActiveCustomerId(): string | null {
    return this.activeCustomerSubject.value?.id ?? localStorage.getItem(this.ACTIVE_CUSTOMER_KEY);
  }

  clear(): void {
    localStorage.removeItem(this.ACTIVE_CUSTOMER_KEY);
    this.customersSubject.next([]);
    this.activeCustomerSubject.next(null);
  }

  private setActiveCustomer(customer: CustomerContextItem): void {
    localStorage.setItem(this.ACTIVE_CUSTOMER_KEY, customer.id);
    this.activeCustomerSubject.next(customer);
  }

  private extractList(response: any): any[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.data?.items)) {
      return response.data.items;
    }

    if (Array.isArray(response?.items)) {
      return response.items;
    }

    return [];
  }

  private normalizeCustomers(items: any[]): CustomerContextItem[] {
    return items
      .map(item => {
        const id = this.pickFirst(item, ['id', 'customerId', 'Id', 'customerID']);
        const name = this.pickFirst(item, ['name', 'customerName', 'companyName', 'displayName', 'title']);

        if (id === undefined || id === null) {
          return null;
        }

        return {
          id: String(id),
          name: String(name ?? `Customer ${id}`),
          raw: item,
        } as CustomerContextItem;
      })
      .filter((item): item is CustomerContextItem => item !== null);
  }

  private pickFirst(item: any, keys: string[]): any {
    for (const key of keys) {
      if (item && item[key] !== undefined && item[key] !== null && item[key] !== '') {
        return item[key];
      }
    }

    return undefined;
  }
}
