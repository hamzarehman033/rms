import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { VisionDecodedPayload } from '../constants/device-message.model';
import { AiVisionPacketApiModel } from './vision.service';
import { CustomerService } from './customer.service';
import { SignalrService } from './signalr.service';

export type SecurityConnectivityStatus = 'online' | 'offline';

type PresenceRecord = { lastSeenMs: number; timeoutMs: number; heartbeatObserved: boolean };

/**
 * Security/AI connectivity only. RMS telemetry and stopped browser video players
 * do not prove whether the AI edge device is connected.
 *
 * A live heartbeat (messageType=2) or alert (messageType=1) is evidence of life.
 * The UI has two states: ONLINE while fresh AI evidence is available, otherwise
 * OFFLINE (also when the realtime hub is unavailable). Offline is a browser-level
 * indication, not proof that the physical gateway has lost power or network.
 * Previously observed devices expire after 3 heartbeat periods (60-300s).
 * The hub must forward Vision heartbeats for an idle but online device to be
 * continuously reported online. This is browser-observed status, not server SLA.
 */
@Injectable({ providedIn: 'root' })
export class SecurityConnectivityService implements OnDestroy {
  private readonly seen = new Map<number, PresenceRecord>();
  private readonly subscriptions = new Subscription();
  private readonly updates = new BehaviorSubject<number>(0);
  readonly updates$ = this.updates.asObservable();
  private readonly timer: ReturnType<typeof setInterval>;
  private scope: string;
  private hubConnected = false;

  constructor(
    private readonly signalr: SignalrService,
    private readonly customers: CustomerService
  ) {
    this.scope = String(customers.getActiveCustomerId() ?? 'default');
    this.subscriptions.add(this.customers.activeCustomer$.subscribe(customer => {
      const scope = String(customer?.id ?? 'default');
      if (scope !== this.scope) {
        this.scope = scope;
        this.seen.clear();
        this.notify();
      }
    }));
    this.subscriptions.add(this.signalr.isConnected$.subscribe(connected => {
      if (this.hubConnected !== connected) {
        this.hubConnected = connected;
        this.notify();
      }
    }));
    this.subscriptions.add(this.signalr.onVisionDetection$.subscribe(packet => {
      if (packet) this.observe(packet);
    }));
    this.timer = setInterval(() => this.notify(), 10_000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.subscriptions.unsubscribe();
  }

  getDeviceStatus(deviceId: number | string): SecurityConnectivityStatus {
    if (!this.hubConnected) return 'offline';
    const id = Number(deviceId);
    const last = this.seen.get(id);
    if (!last) return 'offline';
    if (Date.now() - last.lastSeenMs <= last.timeoutMs) return 'online';
    return 'offline';
  }

  /** Aggregate all edge devices belonging to a physical security site. */
  getSiteStatus(devices: any[]): SecurityConnectivityStatus {
    const statuses = devices
      .map(device => Number(device?.id ?? device?.deviceId))
      .filter(id => Number.isInteger(id) && id > 0)
      .map(id => this.getDeviceStatus(id));
    if (statuses.includes('online')) return 'online';
    return 'offline';
  }

  /** A recent stored AI alert provides evidence of life after page refresh. */
  seedRecentAlerts(deviceId: number, packets: AiVisionPacketApiModel[]): void {
    if (!Array.isArray(packets)) return;
    const now = Date.now();
    for (const packet of packets) {
      if (Number(packet.messageType) !== 1 || packet.isHeaderCrcValid === false) continue;
      const at = Date.parse(String(packet.receivedAtUtc ?? ''));
      // Never assume an older historical alert proves that a site is still online.
      if (!Number.isFinite(at) || at > now + 60_000 || now - at > 120_000) continue;
      this.record(deviceId, at, Number(packet.heartbeatIntervalSec), false);
    }
  }

  private observe(packet: VisionDecodedPayload): void {
    if (packet.messageType !== 1 && packet.messageType !== 2) return;
    if (packet.isHeaderCrcValid === false) return;
    const id = Number(packet.deviceId);
    if (!Number.isInteger(id) || id <= 0) return;

    const now = Date.now();
    const receivedAt = Date.parse(String(packet.receivedAt ?? ''));
    const timestamp = Number(packet.timestampUtc);
    const sentAt = Number.isFinite(timestamp) && timestamp > 0
      ? (timestamp > 1e12 ? timestamp : timestamp * 1000) : NaN;
    const seenAt = Number.isFinite(receivedAt) ? receivedAt
      : Number.isFinite(sentAt) ? sentAt : now;
    // Guard against replayed history and a badly skewed device clock.
    if (seenAt < now - 10 * 60_000 || seenAt > now + 2 * 60_000) return;

    this.record(id, seenAt, Number(packet.heartbeatIntervalSec), packet.messageType === 2);
  }

  private record(id: number, receivedAtMs: number, heartbeatIntervalSeconds: number, isHeartbeat: boolean): void {
    const now = Date.now();
    const previous = this.seen.get(id);
    if (!Number.isInteger(id) || id <= 0 || receivedAtMs > now + 120_000 ||
        receivedAtMs < now - 300_000 || (previous && receivedAtMs < previous.lastSeenMs)) return;

    const timeoutMs = Number.isFinite(heartbeatIntervalSeconds) && heartbeatIntervalSeconds > 0
      ? Math.min(300_000, Math.max(60_000, heartbeatIntervalSeconds * 3000))
      : previous?.timeoutMs ?? 120_000;
    this.seen.set(id, {
      lastSeenMs: Math.min(receivedAtMs, now),
      timeoutMs,
      heartbeatObserved: isHeartbeat || previous?.heartbeatObserved === true
    });
    this.notify();
  }

  private notify(): void {
    this.updates.next(this.updates.value + 1);
  }
}
