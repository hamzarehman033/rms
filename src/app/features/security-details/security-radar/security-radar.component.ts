import { Component, Input, OnChanges } from '@angular/core';
import { NgIf } from '@angular/common';
import { SecuritySiteIncident } from '../../../core/services/security-incident.service';

@Component({
  selector: 'app-security-radar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './security-radar.component.html',
  styleUrl: './security-radar.component.css'
})
export class SecurityRadarComponent implements OnChanges {
  @Input() incident: SecuritySiteIncident | null = null;

  // Illustrative alert position ONLY: no target bearing or range is present in MQTT.
  // Vary the visual position with each distinct received detection (never show coordinates).
  alertX = 180;
  alertY = 110;

  ngOnChanges(): void {
    if (!this.incident) return;
    const seed = Math.floor(this.incident.lastDetectedAt / 1000);
    const angleRadians = (24 + (seed * 47) % 132) * Math.PI / 180;
    const radius = 57 + seed % 96;
    this.alertX = Math.round(180 + radius * Math.cos(angleRadians));
    this.alertY = Math.round(190 - radius * Math.sin(angleRadians));
  }

  get cameraDescription(): string {
    if (!this.incident?.cameraIds.length) return 'Camera not specified';
    return this.incident.cameraIds.map(camera => `Cam ${camera}`).join(' · ');
  }

  get lastDetectedAt(): string {
    const time = this.incident?.lastDetectedAt;
    return time ? new Date(time).toLocaleTimeString() : '—';
  }
}
