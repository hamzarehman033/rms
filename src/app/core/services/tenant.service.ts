import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
}
