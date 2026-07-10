import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SitesStreamStateService {
  readonly activeStreamingDeviceIds = new Set<number>();
  readonly streamActionInProgressIds = new Set<number>();
}
