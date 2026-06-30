import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SiteRecord {
  id?: number | string;
  regionId?: number;
  subRegionId?: number;
  zoneId?: number;
  name: string;
  code: string;
  status?: string;
  address?: string;
  coordinates?: string;
  customerId?: string | null;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class SitesService {
  private readonly baseUrl = environment.baseUrl;
  private readonly url = '/Site';

  constructor(private http: HttpClient) {}

  getSites(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${this.url}`);
  }

  getCombinedSites(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Site/combined`);
  }

  getSiteById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${this.url}/${encodeURIComponent(String(id))}`);
  }

  createSite(payload: SiteRecord): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${this.url}`, payload);
  }

  createSiteDetails(payload: {
    regionId: number;
    subRegionId: number;
    zoneId: number;
    name: string;
    code: string;
    status: string;
    address: string;
    coordinates: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/site`, payload);
  }

   createDevice(payload: {
    name: string;
    code: string;
    status: string;
    installationDate: string;
    mqttHost: string;
    mqttPort: number;
    mqttClientId: string;
    mqttUsername: string;
    mqttPassword: string;
    useTls: boolean;
    keepAliveSeconds: number;
    rmsSubscribeTopic: string;
    aiSubscribeTopic: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Device`, payload);
  }


  updateSite(id: number | string, payload: SiteRecord): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}${this.url}/${encodeURIComponent(String(id))}`, payload);
  }

  deleteSite(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}${this.url}/${encodeURIComponent(String(id))}`);
  }
}
