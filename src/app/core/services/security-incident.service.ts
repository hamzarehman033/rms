import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { VisionDecodedPayload } from '../constants/device-message.model';
import { AiVisionPacketApiModel } from './vision.service';
import { CustomerService } from './customer.service';
import { SignalrService } from './signalr.service';

export type SecuritySiteCategory = 'healthy' | 'intruder' | 'approved-access' | 'guard';
export type SecurityReviewCategory = 'approved-access' | 'guard';

export interface SecuritySiteIncident {
  siteKey: string;
  category: Exclude<SecuritySiteCategory, 'healthy'>;
  firstDetectedAt: number;
  lastDetectedAt: number;
  expiresAt: number;
  cameraIds: number[];
  lastZone: string;
  eventKeys: string[];
  reviewedAt?: number;
}

type SecurityVisionEvent = Partial<Pick<VisionDecodedPayload,
  'deviceId' | 'messageType' | 'eventType' | 'snapshotReasonCode' | 'cameraId' |
  'timestampUtc' | 'receivedAt' | 'packetSequence' | 'messageIdHash' |
  'eventIdHash' | 'activityZone' | 'activityZoneLabel' | 'isHeaderCrcValid'
>> & { receivedAtUtc?: string };

/**
 * Browser-side security incident state. This is NOT an authoritative backend record.
 * A future backend endpoint must own classification, operator audit and shared expiry.
 */
@Injectable({ providedIn: 'root' })
export class SecurityIncidentService implements OnDestroy {
  readonly intrusionWindowMs = 10 * 60 * 1000;
  private readonly storagePrefix = 'mobigence.security.incidents.v1.';
  private readonly statesSubject = new BehaviorSubject<Record<string, SecuritySiteIncident>>({});
  readonly states$ = this.statesSubject.asObservable();
  private readonly deviceSiteKeys = new Map<number, string>();
  private readonly subscriptions = new Subscription();
  private scope = '';
  private readonly previouslyExpiredKeys = new Set<string>();
  private readonly expiryTimer: ReturnType<typeof setInterval>;

  private readonly onStorage = (event: StorageEvent): void => {
    if (event.key === this.storageKey()) {
      this.statesSubject.next(this.readStorage());
    }
  };

  constructor(
    private readonly signalr: SignalrService,
    private readonly customers: CustomerService
  ) {
    this.scope = String(this.customers.getActiveCustomerId() || 'default');
    this.statesSubject.next(this.readStorage());

    this.subscriptions.add(this.customers.activeCustomer$.subscribe(customer => {
      const nextScope = String(customer?.id || 'default');
      if (nextScope !== this.scope) {
        this.scope = nextScope;
        this.deviceSiteKeys.clear();
        this.statesSubject.next(this.readStorage());
      }
    }));

    this.subscriptions.add(this.signalr.onVisionDetection$.subscribe(payload => {
      if (payload) {
        this.acceptEvent(payload, false);
      }
    }));

    window.addEventListener('storage', this.onStorage);
    this.expiryTimer = setInterval(() => this.expireIncidents(), 2000);
    this.expireIncidents();
  }

  ngOnDestroy(): void {
    clearInterval(this.expiryTimer);
    window.removeEventListener('storage', this.onStorage);
    this.subscriptions.unsubscribe();
  }

  /** Allow multiple AI devices at one physical site to share a security classification. */
  registerDevices(devices: any[]): void {
    const state = { ...this.statesSubject.value };
    let changed = false;

    for (const device of devices) {
      const deviceId = this.numericDeviceId(device?.id ?? device?.deviceId);
      if (deviceId === null) continue;

      const id = device?.siteId ?? device?.site?.id;
      const hasSiteId = id !== null && id !== undefined && String(id).trim() !== '' && String(id) !== '0';
      const siteKey = hasSiteId ? `site:${String(id).trim()}` : `device:${deviceId}`;
      const previousKey = this.deviceSiteKeys.get(deviceId) ?? `device:${deviceId}`;
      this.deviceSiteKeys.set(deviceId, siteKey);

      if (previousKey !== siteKey && state[previousKey]) {
        state[siteKey] = this.mergeIncidents(state[siteKey], state[previousKey], siteKey);
        delete state[previousKey];
        changed = true;
      }
    }

    if (changed) this.publish(state);
  }

  siteKeyForDevice(deviceId: number | string): string {
    const id = this.numericDeviceId(deviceId);
    return id === null ? '' : (this.deviceSiteKeys.get(id) ?? `device:${id}`);
  }

  getIncident(deviceId: number | string): SecuritySiteIncident | null {
    const key = this.siteKeyForDevice(deviceId);
    const incident = this.statesSubject.value[key];
    return incident && incident.expiresAt > Date.now() ? incident : null;
  }

  getCategory(deviceId: number | string): SecuritySiteCategory {
    return this.getIncident(deviceId)?.category ?? 'healthy';
  }

  /** Review ALL currently active intrusions at the site, not just a selected camera. */
  classifySite(deviceId: number | string, category: SecurityReviewCategory): boolean {
    const key = this.siteKeyForDevice(deviceId);
    const incident = this.getIncident(deviceId);
    if (!key || !incident || incident.category !== 'intruder') return false;

    this.publish({
      ...this.statesSubject.value,
      [key]: { ...incident, category, reviewedAt: Date.now() }
    });
    return true;
  }

  /** Rehydrate recent intrusions from the existing read-only Vision history endpoint. */
  ingestHistory(deviceId: number, packets: AiVisionPacketApiModel[]): void {
    if (!Array.isArray(packets) || !packets.length) return;
    const relevant = packets
      .filter(packet => packet.messageType === 1 && (packet.eventType === 4 || packet.snapshotReasonCode === 5))
      .sort((a, b) => this.eventTime(a) - this.eventTime(b));
    if (!relevant.length) return;

    let state = { ...this.statesSubject.value };
    let changed = false;
    for (const packet of relevant) {
      const event: SecurityVisionEvent = {
        ...packet,
        deviceId,
        receivedAt: packet.receivedAtUtc,
        activityZoneLabel: undefined
      };
      const update = this.updateFromEvent(state, event, true);
      if (update) {
        state = update;
        changed = true;
      }
    }
    if (changed) this.publish(state);
  }

  private acceptEvent(event: SecurityVisionEvent, historical: boolean): void {
    const next = this.updateFromEvent(this.statesSubject.value, event, historical);
    if (next) this.publish(next);
  }

  private updateFromEvent(
    state: Record<string, SecuritySiteIncident>,
    event: SecurityVisionEvent,
    historical: boolean
  ): Record<string, SecuritySiteIncident> | null {
    if (Number(event.messageType) !== 1 ||
        (Number(event.eventType) !== 4 && Number(event.snapshotReasonCode) !== 5) ||
        event.isHeaderCrcValid === false) return null;

    const id = this.numericDeviceId(event.deviceId);
    if (id === null) return null;

    const now = Date.now();
    const occurredAt = this.eventTime(event);
    // Ignore stale history/replayed events. The receipt moment starts a live window.
    if (historical && (occurredAt < now - this.intrusionWindowMs || occurredAt > now + 60_000)) return null;
    if (!historical && occurredAt > 0 && occurredAt < now - this.intrusionWindowMs) return null;

    const eventAt = historical ? occurredAt : now;
    const siteKey = this.siteKeyForDevice(id);
    const saved = state[siteKey];
    // Keep a short-lived reviewed tombstone to prevent a later history fetch
    // from reopening the same, already-reviewed incident after its expiry.
    if (historical && saved?.reviewedAt && saved.expiresAt <= now && eventAt <= saved.expiresAt) return null;
    const previous = saved?.expiresAt > now ? saved : null;
    const eventKey = this.eventKey(id, event);
    // Also ignore duplicate MQTT deliveries after a reviewed incident expires,
    // while its short-lived deduplication record remains in storage.
    if (saved?.eventKeys.includes(eventKey)) return null;

    // A manual decision freezes the existing 10-minute window. Additional detections
    // can still light the radar but will NOT undo the decision or extend that window.
    // An unreviewed intrusion extends the window with every NEW detection.
    const expiresAt = previous?.category !== 'intruder' && previous
      ? previous.expiresAt
      : eventAt + this.intrusionWindowMs;
    const cameraId = Number(event.cameraId);
    const cameraIds = previous ? [...previous.cameraIds] : [];
    if (Number.isInteger(cameraId) && cameraId > 0 && !cameraIds.includes(cameraId)) {
      cameraIds.push(cameraId);
    }

    const zone = String(event.activityZoneLabel ?? '').trim();
    const next: SecuritySiteIncident = {
      siteKey,
      category: previous?.category ?? 'intruder',
      firstDetectedAt: previous?.firstDetectedAt ?? eventAt,
      lastDetectedAt: Math.max(eventAt, previous?.lastDetectedAt ?? 0),
      expiresAt,
      cameraIds: cameraIds.sort((a, b) => a - b),
      lastZone: zone || previous?.lastZone || '',
      eventKeys: [...(previous?.eventKeys ?? []), eventKey].slice(-120),
      ...(previous?.reviewedAt ? { reviewedAt: previous.reviewedAt } : {})
    };
    return { ...state, [siteKey]: next };
  }

  private mergeIncidents(
    first: SecuritySiteIncident | undefined,
    second: SecuritySiteIncident,
    key: string
  ): SecuritySiteIncident {
    if (!first) return { ...second, siteKey: key };
    const reviewed = [first, second]
      .filter(item => item.reviewedAt)
      .sort((a, b) => (b.reviewedAt ?? 0) - (a.reviewedAt ?? 0))[0];
    return {
      siteKey: key,
      category: reviewed?.category ?? 'intruder',
      reviewedAt: reviewed?.reviewedAt,
      firstDetectedAt: Math.min(first.firstDetectedAt, second.firstDetectedAt),
      lastDetectedAt: Math.max(first.lastDetectedAt, second.lastDetectedAt),
      expiresAt: reviewed ? reviewed.expiresAt : Math.max(first.expiresAt, second.expiresAt),
      cameraIds: [...new Set([...first.cameraIds, ...second.cameraIds])].sort((a, b) => a - b),
      lastZone: first.lastDetectedAt > second.lastDetectedAt ? first.lastZone : second.lastZone,
      eventKeys: [...new Set([...first.eventKeys, ...second.eventKeys])].slice(-120)
    };
  }

  private eventKey(deviceId: number, event: SecurityVisionEvent): string {
    const camera = Number(event.cameraId ?? 0);
    const messageId = Number(event.messageIdHash ?? 0);
    if (messageId > 0) return `${deviceId}:${camera}:message:${messageId}`;
    const eventId = Number(event.eventIdHash ?? 0);
    const sequence = Number(event.packetSequence ?? 0);
    if (eventId > 0 && sequence > 0) return `${deviceId}:${camera}:event:${eventId}:seq:${sequence}`;
    if (eventId > 0) return `${deviceId}:${camera}:event:${eventId}:at:${Number(event.timestampUtc ?? 0)}`;
    if (sequence > 0) return `${deviceId}:${camera}:seq:${sequence}`;
    return `${deviceId}:${camera}:at:${Number(event.timestampUtc ?? 0)}:zone:${event.activityZone ?? 0}`;
  }

  private eventTime(event: SecurityVisionEvent): number {
    const receivedAt = Date.parse(String(event.receivedAtUtc ?? event.receivedAt ?? ''));
    if (Number.isFinite(receivedAt)) return receivedAt;
    const seconds = Number(event.timestampUtc ?? 0);
    if (!Number.isFinite(seconds) || seconds <= 0) return 0;
    return seconds > 1e12 ? seconds : seconds * 1000;
  }

  private numericDeviceId(input: unknown): number | null {
    const id = Number(input);
    return Number.isInteger(id) && id > 0 ? id : null;
  }

  private expireIncidents(): void {
    const now = Date.now();
    const current = this.statesSubject.value;
    let changed = false;
    const retained: Record<string, SecuritySiteIncident> = {};

    for (const [key, incident] of Object.entries(current)) {
      const keepUntil = incident.reviewedAt
        ? Math.max(incident.expiresAt, incident.lastDetectedAt) + this.intrusionWindowMs
        : incident.expiresAt;
      if (keepUntil <= now) {
        this.previouslyExpiredKeys.delete(key);
        changed = true;
        continue;
      }

      retained[key] = incident;
      if (incident.expiresAt <= now && !this.previouslyExpiredKeys.has(key)) {
        this.previouslyExpiredKeys.add(key);
        changed = true; // Notify views to remove expired rows immediately.
      }
      if (incident.expiresAt > now) this.previouslyExpiredKeys.delete(key);
    }

    if (changed) this.publish(retained);
  }

  private publish(state: Record<string, SecuritySiteIncident>): void {
    this.statesSubject.next(state);
    try {
      localStorage.setItem(this.storageKey(), JSON.stringify(state));
    } catch {
      // A blocked/full browser cache does not prevent live monitoring in this tab.
    }
  }

  private readStorage(): Record<string, SecuritySiteIncident> {
    try {
      const raw = localStorage.getItem(this.storageKey());
      const parsed: unknown = raw ? JSON.parse(raw) : {};
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
      const now = Date.now();
      return Object.fromEntries(
        Object.entries(parsed).filter((entry): entry is [string, SecuritySiteIncident] => {
          const value = entry[1] as SecuritySiteIncident;
          const keepUntil = value?.reviewedAt
            ? Math.max(value.expiresAt, value.lastDetectedAt) + this.intrusionWindowMs
            : value?.expiresAt;
          return !!value && typeof value === 'object' &&
            Number.isFinite(value.expiresAt) && Number.isFinite(keepUntil) && keepUntil > now &&
            ['intruder', 'approved-access', 'guard'].includes(value.category) &&
            Array.isArray(value.eventKeys) && Array.isArray(value.cameraIds);
        })
      );
    } catch {
      return {};
    }
  }

  private storageKey(): string {
    return this.storagePrefix + this.scope;
  }
}
