import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RecentSitesFilterRequest {
  regionId: number;
  subRegionId: number;
  zoneId: number;
  status: number;
  deviceId: number;
  timeRange: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private readonly baseUrl = environment.baseUrl;
  private readonly url = '/Statistic';

  constructor(private http: HttpClient) {}

  getDashboardSummary(data:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${this.url}/dashboard-summary`, data);
  }

  getTelemetryEnvironmentCounts(data:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${this.url}/TelemetryEnvironmentCounts`, data);
  }

  getTelemetryHourlyTempHumidityStats(data:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${this.url}/TelemetryGetHourlyTempHumidityStats`, data);
  }

  getTop5DevicesByActivityInLastHour(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${this.url}/GetTop5DevicesByActivityInLastHour`);
  }

  getRecentAnomalies(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${this.url}/GetRecentAnomalies`);
  }

  getWeeklyAlerts(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${this.url}/weekly-alerts`);
  }

  getRecentSites(filters: RecentSitesFilterRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${this.url}/recent-sites`, filters);
  }

  getBatteryStatusReport(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${this.url}/battery-status-report`, data);
  }

  getSolarStatusReport(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${this.url}/solar-status-report`, data);
  }

  getGridStatusReport(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${this.url}/grid-status-report`, data);
  }

  getEnergyConsumptionReport(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${this.url}/energy-consumption-report`, data);
  }

  getAlarmStatusReport(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${this.url}/alarm-status-report`, data);
  }
}