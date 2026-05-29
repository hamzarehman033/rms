import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  baseUrl: string = environment.baseUrl;
  url: string = '/profile';
}
