import { RadarDetectionEvent, RadarTarget } from '../constants/device-message.model';

export const RADAR_MAX_DISTANCE_MM = 8000;

/** Validate the decoded SignalR contract, without assuming a backend signature representation. */
export function isValidRadarFrame(frame: RadarDetectionEvent | null | undefined): frame is RadarDetectionEvent {
  return !!frame && Number.isInteger(frame.deviceId) && frame.deviceId > 0 &&
    frame.messageType === 3 && Array.isArray(frame.targets) &&
    typeof frame.radarAOnline === 'boolean' && typeof frame.radarBOnline === 'boolean';
}

/** The display and incident service use the same accepted targets. Empty/offline slots are not detections. */
export function getValidRadarTargets(frame: RadarDetectionEvent | null | undefined): RadarTarget[] {
  if (!isValidRadarFrame(frame)) return [];
  const targets: RadarTarget[] = [];
  const occupiedSlots = new Set<string>();
  for (const target of frame.targets) {
    if (!target || (target.radarId !== 1 && target.radarId !== 2) ||
        ![1, 2, 3].includes(target.slot) ||
        !Number.isFinite(target.angleDeg) || target.angleDeg < 0 || target.angleDeg > 180 ||
        !Number.isFinite(target.distanceMm) || target.distanceMm < 0 || target.distanceMm > RADAR_MAX_DISTANCE_MM ||
        !(target.radarId === 1 ? frame.radarAOnline : frame.radarBOnline)) continue;
    const key = `${target.radarId}:${target.slot}`;
    if (occupiedSlots.has(key)) continue;
    occupiedSlots.add(key);
    targets.push(target);
  }
  return targets;
}
