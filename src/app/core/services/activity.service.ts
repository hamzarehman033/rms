import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Activity {
  id?: number;
  deviceId: number;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  team: string;
  persons: number;
  isActive?: boolean;
}

export interface ActivityFilter {
  key: string;
  value: string | number | boolean;
  operator: string;
  postOperator?: 'and' | 'or';
}

export interface ActivityQuery {
  pagesize?: number;
  pagenumber?: number;
  filters?: ActivityFilter[];
}

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private readonly baseUrl = environment.baseUrl;
  private readonly url = '/Activity';

  constructor(private http: HttpClient) {}

  getActivities(query?: ActivityQuery): Observable<any> {
    let params = new HttpParams()
      .set('pagesize', String(query?.pagesize ?? 10))
      .set('pagenumber', String(query?.pagenumber ?? 1));

    (query?.filters ?? []).forEach((filter, index) => {
      params = params
        .set(`filters[${index}].key`, filter.key)
        .set(`filters[${index}].value`, String(filter.value))
        .set(`filters[${index}].operator`, filter.operator);

      if (filter.postOperator) {
        params = params.set(`filters[${index}].postOperator`, filter.postOperator);
      }
    });

    return this.http.get(this.baseUrl + this.url, { params });
  }

  getActivityById(id: number | string): Observable<any> {
    return this.http.get(`${this.baseUrl}${this.url}/${encodeURIComponent(String(id))}`);
  }

  createActivity(payload: Activity): Observable<any> {
    return this.http.post(`${this.baseUrl}${this.url}`, payload);
  }

  updateActivity(id: number | string, payload: Activity): Observable<any> {
    return this.http.put(`${this.baseUrl}${this.url}/${encodeURIComponent(String(id))}`, payload);
  }

  deleteActivity(id: number | string): Observable<any> {
    return this.http.delete(`${this.baseUrl}${this.url}/${encodeURIComponent(String(id))}`);
  }
}
