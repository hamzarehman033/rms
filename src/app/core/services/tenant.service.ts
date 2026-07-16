import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Tenant {
  id?: number | string;
  tenantId?: number | string;
  name: string;
  code: string;
  status?: string;
  description?: string;
  customerId?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  private readonly baseUrl = environment.baseUrl;
  private readonly url = '/Tenant';

  constructor(private http: HttpClient) {}

  getTenants(): Observable<any> {
    return this.http.get(this.baseUrl + this.url);
  }

  getTenantById(id: number | string): Observable<any> {
    return this.http.get(`${this.baseUrl}${this.url}/${encodeURIComponent(String(id))}`);
  }

  createTenant(payload: Tenant): Observable<any> {
    return this.http.post(`${this.baseUrl}${this.url}`, payload);
  }

  updateTenant(id: number | string, payload: Tenant): Observable<any> {
    return this.http.put(`${this.baseUrl}${this.url}/${encodeURIComponent(String(id))}`, payload);
  }

  deleteTenant(id: number | string): Observable<any> {
    return this.http.delete(`${this.baseUrl}${this.url}/${encodeURIComponent(String(id))}`);
  }
}
