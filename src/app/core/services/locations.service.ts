import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Location {
  id?: number;
  regionId?: number;
  subRegionId?: number;
  zoneId?: number;
  name: string;
  code: string;
  status?: string;
  address?: string;
  coordinates?: string;
  parentId: number;
  level: number;
  customerId?: string;
  children?: Location[];
}

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  baseUrl: string = environment.baseUrl;
  url: string = '/Location';

  constructor(private http: HttpClient) {}

  // GET all locations
  getAllLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.baseUrl}${this.url}`);
  }

  // GET regions tree with nested children
  getLocationTree(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/location/tree`);
  }

  // GET location by ID
  getLocationById(id: number): Observable<Location> {
    return this.http.get<Location>(`${this.baseUrl}${this.url}/${id}`);
  }

  // POST create new location
  createLocation(location: Location): Observable<Location> {
    return this.http.post<Location>(`${this.baseUrl}${this.url}`, location);
  }

  // PUT update location
  updateLocation(id: number, location: Location): Observable<Location> {
    return this.http.put<Location>(`${this.baseUrl}${this.url}/${id}`, location);
  }

  // DELETE location
  deleteLocation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${this.url}/${id}`);
  }
}
