import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DevicePayload {
  siteId?: string | number;
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
}

export interface DeviceInfrastructurePayload {
  rectifierBrand: string;
  rectifierQty: number;
  rectifierCapacity: string;
  batteryBrand: string;
  batteryQty: number;
  batteryCapacity: string;
  solarBrand: string;
  solarQty: number;
  solarCapacity: string;
  generatorBrand: string;
  generatorQty: number;
  generatorCapacity: string;
  rmsSerialNumber: string;
  simCardNumber: string;
  camerasInstalledCount: number;
  aiEhsInstalled: boolean;
  aiSecurityInstalled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  private readonly baseUrl = environment.baseUrl;
  private readonly url = '/Device';

  constructor(private http: HttpClient) {}

  getDevices(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${this.url}`);
  }

  getDeviceById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${this.url}/${encodeURIComponent(String(id))}`);
  }

  createDevice(payload: DevicePayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${this.url}`, payload);
  }

  updateDevice(id: number | string, payload: Partial<DevicePayload>): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}${this.url}/${encodeURIComponent(String(id))}`, payload);
  }

  deleteDevice(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}${this.url}/${encodeURIComponent(String(id))}`);
  }

  updateDeviceInfrastructure(deviceId: number | string, payload: DeviceInfrastructurePayload): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/device/${encodeURIComponent(String(deviceId))}/infrastructure`, payload);
  }
}
