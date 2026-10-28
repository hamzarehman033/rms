import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { SecuritySiteIncident } from '../../../core/services/security-incident.service';

@Component({
  selector: 'app-security-radar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './security-radar.component.html',
  styleUrl: './security-radar.component.css'
})
export class SecurityRadarComponent {
  @Input() incident: SecuritySiteIncident | null = null;

  // Reviewed incidents stay in the service until expiry, but are not intruder alarms.
  get hasActiveIntrusion(): boolean {
    return this.incident?.category === 'intruder';
  }
}
