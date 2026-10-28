import { Component, Input } from '@angular/core';
import { SecuritySiteIncident } from '../../../core/services/security-incident.service';

@Component({
  selector: 'app-security-radar',
  standalone: true,
  templateUrl: './security-radar.component.html',
  styleUrl: './security-radar.component.css'
})
export class SecurityRadarComponent {
  @Input() incident: SecuritySiteIncident | null = null;

  get cameraDescription(): string {
    if (!this.incident?.cameraIds.length) return 'Camera not specified';
    return this.incident.cameraIds.map(camera => `Cam ${camera}`).join(' · ');
  }

  get lastDetectedAt(): string {
    const time = this.incident?.lastDetectedAt;
    return time ? new Date(time).toLocaleTimeString() : '—';
  }
}
