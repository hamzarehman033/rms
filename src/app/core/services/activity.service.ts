import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Activity {
  id?: number | string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  company: string;
  technicians: number;
  siteId: number | string;
  siteName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private readonly baseUrl = environment.baseUrl;
  private readonly url = '/Activity';

  constructor(private http: HttpClient) {}

  getActivities(): Observable<any> {
    return this.http.get(this.baseUrl + this.url);
  }

  getActivityById(id: number | string): Observable<any> {
    return this.http.get(`${this.baseUrl}${this.url}/${encodeURIComponent(String(id))}`);
  }

  createActivity(payload: Activity): Observable<any> {
    return this.http.post(`${this.baseUrl}${this.url}`, payload);
  }
}
