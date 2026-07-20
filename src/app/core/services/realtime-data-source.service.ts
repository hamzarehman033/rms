import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DecodedPayload, DeviceDataEvent, SYSTEM_STATUS_ENUM } from '../constants/device-message.model';
import { SignalrService } from './signalr.service';

export type DeviceStatusCategory = 'normal' | 'warning' | 'major' | 'critical' | 'comms' | 'unknown';
export type AlarmSeverity = 'critical' | 'major' | 'minor';

export interface FleetStatusBuckets {
  normal: number;
  warning: number;
  major: number;
  critical: number;
  comms: number;
  unknown: number;
}

export interface DeviceRealtimeData {
  deviceId: number;
  topic: string;
  lastPacketAt: string;
  packetCount: number;
  isOnline: boolean;
  systemStatusCode: number | null;
  systemStatusLabel: string;
  statusCategory: DeviceStatusCategory;
  statusText: string;
  activeAlarmCount: number;
  alarmSeverity: AlarmSeverity | null;
  temperatureC: number | null;
  humidityPercent: number | null;
  powerW: number | null;
  dcLoadPowerW: number | null;
  batteryRemainingPercent: number | null;
  dcBusVoltage: number | null;
  lineAVoltage: number | null;
  mainsAvailable: string;
}

export interface FleetRealtimeMetrics {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  devicesWithAlarms: number;
  devicesBySystemStatus: FleetStatusBuckets;
  avgTemperatureC: number | null;
  avgHumidityPercent: number | null;
  totalPowerKw: number;
  packetsPerMinute: number;
  lastPacketAt: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class RealtimeDataSourceService {
  private readonly devicesState$ = new BehaviorSubject<Record<number, DeviceRealtimeData>>({});
  private readonly fleetMetricsState$ = new BehaviorSubject<FleetRealtimeMetrics>(this.emptyFleetMetrics());
  private readonly packetTimestampsMs: number[] = [];

  readonly devices$ = this.devicesState$.asObservable();
  readonly fleetMetrics$ = this.fleetMetricsState$.asObservable();

  constructor(private readonly signalrService: SignalrService) {
    this.signalrService.onDeviceData$.subscribe(event => {
      if (!event || !event.decodedPayload) {
        return;
      }

      this.handleIncomingPacket(event);
    });
  }

  getDevice$(deviceId: number | string): Observable<DeviceRealtimeData | null> {
    const numericId = this.toNumber(deviceId);

    return this.devices$.pipe(
      map(devices => {
        if (numericId === null) {
          return null;
        }
        return devices[numericId] ?? null;
      })
    );
  }

  getTopAlarmedDevices$(limit = 5): Observable<DeviceRealtimeData[]> {
    return this.devices$.pipe(
      map(devices =>
        Object.values(devices)
          .sort((a, b) => {
            if (b.activeAlarmCount !== a.activeAlarmCount) {
              return b.activeAlarmCount - a.activeAlarmCount;
            }
            return this.toTimeMs(b.lastPacketAt) - this.toTimeMs(a.lastPacketAt);
          })
          .slice(0, Math.max(1, limit))
      )
    );
  }

  clear(): void {
    this.packetTimestampsMs.length = 0;
    this.devicesState$.next({});
    this.fleetMetricsState$.next(this.emptyFleetMetrics());
  }

  private handleIncomingPacket(event: DeviceDataEvent): void {
    const packet = event.decodedPayload as DecodedPayload;
    const deviceId = this.resolveDeviceId(event, packet);
    if (deviceId === null) {
      return;
    }

    const nowMs = Date.now();
    this.packetTimestampsMs.push(nowMs);
    this.pruneOldPacketTimestamps(nowMs);

    const current = this.devicesState$.getValue();
    const previous = current[deviceId];
    const systemStatusCode = this.resolveSystemStatusCode(packet, previous?.systemStatusCode ?? null);
    const systemStatusLabel = this.resolveSystemStatusLabel(systemStatusCode);
    const statusCategory = this.resolveStatusCategory(systemStatusCode);
    const alarmSeverity = this.resolveAlarmSeverity(systemStatusCode);
    const activeAlarmCount = this.resolveNumeric(packet?.activeAlarmCount, null) ?? (alarmSeverity ? 1 : 0);

    const nextRecord: DeviceRealtimeData = {
      deviceId,
      topic: String(event.topic ?? previous?.topic ?? ''),
      lastPacketAt: this.resolveLastPacketAt(event, packet),
      packetCount: (previous?.packetCount ?? 0) + 1,
      isOnline: true,
      systemStatusCode,
      systemStatusLabel,
      statusCategory,
      statusText: systemStatusLabel,
      activeAlarmCount,
      alarmSeverity,
      temperatureC: this.resolveTemperature(packet, previous?.temperatureC ?? null),
      humidityPercent: this.resolveNumeric(packet?.humidity, previous?.humidityPercent ?? null),
      powerW: this.resolvePower(packet, previous?.powerW ?? null),
      dcLoadPowerW: this.resolveNumeric(packet?.dcLoadPowerW, previous?.dcLoadPowerW ?? null),
      batteryRemainingPercent: this.resolveNumeric(
        packet?.batteryRemainingPercent,
        previous?.batteryRemainingPercent ?? null
      ),
      dcBusVoltage: this.resolveNumeric(packet?.dcBusVoltage, previous?.dcBusVoltage ?? null),
      lineAVoltage: this.resolveNumeric(packet?.lineAVoltage, previous?.lineAVoltage ?? null),
      mainsAvailable: String(packet?.mainsAvailable ?? previous?.mainsAvailable ?? '-')
    };

    this.devicesState$.next({
      ...current,
      [deviceId]: nextRecord
    });

    this.recomputeFleetMetrics();
  }

  private recomputeFleetMetrics(): void {
    const devices = Object.values(this.devicesState$.getValue());
    if (!devices.length) {
      this.fleetMetricsState$.next(this.emptyFleetMetrics());
      return;
    }

    const onlineDevices = devices.filter(device => device.isOnline).length;
    const offlineDevices = devices.length - onlineDevices;
    const devicesWithAlarms = devices.filter(device => device.activeAlarmCount > 0).length;
    const devicesBySystemStatus = devices.reduce<FleetStatusBuckets>(
      (accumulator, device) => {
        accumulator[device.statusCategory] += 1;
        return accumulator;
      },
      this.emptyStatusBuckets()
    );

    const temperatureValues = devices
      .map(device => device.temperatureC)
      .filter((value): value is number => Number.isFinite(value));

    const humidityValues = devices
      .map(device => device.humidityPercent)
      .filter((value): value is number => Number.isFinite(value));

    const totalPowerW = devices.reduce((sum, device) => {
      return sum + (Number.isFinite(device.powerW) ? (device.powerW as number) : 0);
    }, 0);

    const latestPacketMs = Math.max(...devices.map(device => this.toTimeMs(device.lastPacketAt)));

    this.fleetMetricsState$.next({
      totalDevices: devices.length,
      onlineDevices,
      offlineDevices,
      devicesWithAlarms,
      devicesBySystemStatus,
      avgTemperatureC: this.toAverage(temperatureValues),
      avgHumidityPercent: this.toAverage(humidityValues),
      totalPowerKw: this.roundTo(totalPowerW / 1000, 2),
      packetsPerMinute: this.packetTimestampsMs.length,
      lastPacketAt: latestPacketMs > 0 ? new Date(latestPacketMs).toISOString() : null
    });
  }

  private emptyFleetMetrics(): FleetRealtimeMetrics {
    return {
      totalDevices: 0,
      onlineDevices: 0,
      offlineDevices: 0,
      devicesWithAlarms: 0,
      devicesBySystemStatus: this.emptyStatusBuckets(),
      avgTemperatureC: null,
      avgHumidityPercent: null,
      totalPowerKw: 0,
      packetsPerMinute: 0,
      lastPacketAt: null
    };
  }

  private emptyStatusBuckets(): FleetStatusBuckets {
    return {
      normal: 0,
      warning: 0,
      major: 0,
      critical: 0,
      comms: 0,
      unknown: 0
    };
  }

  private resolveSystemStatusCode(payload: DecodedPayload, fallback: number | null): number | null {
    const fromPayload = this.toNumber(payload?.systemStatus);
    return fromPayload ?? fallback;
  }

  private resolveSystemStatusLabel(statusCode: number | null): string {
    if (statusCode === null) {
      return 'Unknown';
    }

    const labels: string[] = [];
    if (statusCode & (1 << 2)) labels.push('Critical Alarm');
    if (statusCode & (1 << 1)) labels.push('Major Alarm');
    if (statusCode & (1 << 3)) labels.push('Warning');
    if (statusCode & (1 << 4)) labels.push('Comms Issue');
    if (!labels.length && (statusCode & (1 << 0))) labels.push('Normal');

    return labels.length ? labels.join(', ') : SYSTEM_STATUS_ENUM[statusCode] ?? `Unknown (${statusCode})`;
  }

  private resolveStatusCategory(statusCode: number | null): DeviceStatusCategory {
    if (statusCode === null) {
      return 'unknown';
    }

    if (statusCode & (1 << 2)) return 'critical';
    if (statusCode & (1 << 1)) return 'major';
    if (statusCode & (1 << 3)) return 'warning';
    if (statusCode & (1 << 4)) return 'comms';
    if (statusCode & (1 << 0)) return 'normal';
    return 'unknown';
  }

  private resolveDeviceId(event: DeviceDataEvent, payload: DecodedPayload): number | null {
    const fromEvent = this.toNumber(event.deviceId);
    if (fromEvent !== null) {
      return fromEvent;
    }

    return this.toNumber(payload?.deviceId);
  }

  private resolveLastPacketAt(event: DeviceDataEvent, payload: DecodedPayload): string {
    const candidates = [payload?.portalReceiveTime, payload?.receivedAtUtc, event.receivedAt];
    const valid = candidates.find(value => this.toTimeMs(value) > 0);
    return valid ? new Date(this.toTimeMs(valid)).toISOString() : new Date().toISOString();
  }

  private resolveTemperature(payload: DecodedPayload, fallback: number | null): number | null {
    const t1 = this.resolveNumeric(payload?.ambientTemperature1, null);
    const t2 = this.resolveNumeric(payload?.ambientTemperature2, null);

    if (t1 !== null && t2 !== null) {
      return this.roundTo((t1 + t2) / 2, 2);
    }

    if (t1 !== null) {
      return t1;
    }

    if (t2 !== null) {
      return t2;
    }

    return fallback;
  }

  private resolvePower(payload: DecodedPayload, fallback: number | null): number | null {
    const candidates = [
      payload?.dcLoadPowerW,
      payload?.totalAcInputPowerW,
      payload?.rectifierTotalDcPowerW,
      payload?.solarPowerW
    ];

    for (const candidate of candidates) {
      const numeric = this.resolveNumeric(candidate, null);
      if (numeric !== null) {
        return numeric;
      }
    }

    return fallback;
  }

  private resolveNumeric(value: unknown, fallback: number | null): number | null {
    const numeric = this.toNumber(value);
    return numeric === null ? fallback : numeric;
  }

  private resolveAlarmSeverity(statusCode: number | null): AlarmSeverity | null {
    if (statusCode === null) {
      return null;
    }

    if (statusCode & (1 << 2)) return 'critical';
    if (statusCode & (1 << 1)) return 'major';
    if (statusCode & (1 << 3)) return 'minor';
    return null;
  }

  private pruneOldPacketTimestamps(nowMs: number): void {
    const oneMinuteAgo = nowMs - 60_000;
    while (this.packetTimestampsMs.length && this.packetTimestampsMs[0] < oneMinuteAgo) {
      this.packetTimestampsMs.shift();
    }
  }

  private toAverage(values: number[]): number | null {
    if (!values.length) {
      return null;
    }

    const sum = values.reduce((total, current) => total + current, 0);
    return this.roundTo(sum / values.length, 2);
  }

  private roundTo(value: number, fractionDigits: number): number {
    return Number(value.toFixed(fractionDigits));
  }

  private toNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private toTimeMs(value: unknown): number {
    if (!value) {
      return 0;
    }

    const parsed = new Date(String(value)).getTime();
    return Number.isFinite(parsed) ? parsed : 0;
  }
}
