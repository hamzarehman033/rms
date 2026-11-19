import { Component, Input } from '@angular/core';
import { RadarDetectionEvent, RadarTarget } from '../../../core/constants/device-message.model';
import { SecuritySiteIncident } from '../../../core/services/security-incident.service';
import { getValidRadarTargets, RADAR_MAX_DISTANCE_MM } from '../../../core/services/radar-frame';

const RADAR_ORIGIN = { x: 180, y: 180 };
const RADAR_RADIUS = 160;

interface RadarDot extends RadarTarget {
  x: number;
  y: number;
}

@Component({
  selector: 'app-security-radar',
  standalone: true,
  imports: [],
  templateUrl: './security-radar.component.html',
  styleUrl: './security-radar.component.css'
})
export class SecurityRadarComponent {
  private static nextInstanceId = 0;
  // Unique paint-server IDs keep multiple radar cards independent in one page.
  readonly gradientId = `security-radar-glow-${SecurityRadarComponent.nextInstanceId++}`;
  @Input() incident: SecuritySiteIncident | null = null;
  dots: RadarDot[] = [];

  @Input() set frame(frame: RadarDetectionEvent | null) {
    this.dots = getValidRadarTargets(frame).map(target => {
      const angle = target.angleDeg * Math.PI / 180;
      const radius = target.distanceMm / RADAR_MAX_DISTANCE_MM * RADAR_RADIUS;
      // Sensor-local display convention: 0 degrees is right, 180 is left.
      // A occupies the upper half; B is reflected below the same centre.
      // This separates the sensors without assuming a physical compass bearing.
      const verticalDirection = target.radarId === 1 ? -1 : 1;
      return {
        ...target,
        x: RADAR_ORIGIN.x + radius * Math.cos(angle),
        y: RADAR_ORIGIN.y + verticalDirection * radius * Math.sin(angle)
      };
    });
  }

  // Reviewed incidents stay in the service until expiry, but are not intruder alarms.
  get hasActiveIntrusion(): boolean {
    return this.incident?.category === 'intruder';
  }
}
