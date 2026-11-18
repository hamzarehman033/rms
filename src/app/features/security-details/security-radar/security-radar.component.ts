import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { RadarDetectionEvent, RadarTarget } from '../../../core/constants/device-message.model';
import { SecuritySiteIncident } from '../../../core/services/security-incident.service';

const RADAR_ORIGIN = { x: 180, y: 190 };
const RADAR_RADIUS = 174;
const MAX_DISTANCE_MM = 8000;

interface RadarDot extends RadarTarget {
  x: number;
  y: number;
}

@Component({
  selector: 'app-security-radar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './security-radar.component.html',
  styleUrl: './security-radar.component.css'
})
export class SecurityRadarComponent {
  @Input() incident: SecuritySiteIncident | null = null;
  dots: RadarDot[] = [];

  @Input() set frame(frame: RadarDetectionEvent | null) {
    const dots: RadarDot[] = [];
    if (frame) {
      for (const target of frame.targets) {
        if (!target || (target.radarId !== 1 && target.radarId !== 2)
            || ![1, 2, 3].includes(target.slot)
            || !Number.isFinite(target.angleDeg) || target.angleDeg < 0 || target.angleDeg > 180
            || !Number.isFinite(target.distanceMm) || target.distanceMm < 0 || target.distanceMm > MAX_DISTANCE_MM) {
          console.warn('[Security Radar] Ignoring invalid radar target', target);
          continue;
        }
        if (target.radarId === 1 ? !frame.radarAOnline : !frame.radarBOnline) continue;

        const angle = target.angleDeg * Math.PI / 180;
        const radius = target.distanceMm / MAX_DISTANCE_MM * RADAR_RADIUS;
        // Angles increase counterclockwise from the right, but SVG y increases downward.
        dots.push({
          ...target,
          x: RADAR_ORIGIN.x + radius * Math.cos(angle),
          y: RADAR_ORIGIN.y - radius * Math.sin(angle)
        });
      }
    }
    this.dots = dots;
  }

  // Reviewed incidents stay in the service until expiry, but are not intruder alarms.
  get hasActiveIntrusion(): boolean {
    return this.incident?.category === 'intruder';
  }
}
