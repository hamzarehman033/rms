import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  baseUrl: string = environment.baseUrl;
  url: string = '/dashboard';
}
