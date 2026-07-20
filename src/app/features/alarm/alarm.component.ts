import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { DecodedPayload, DeviceDataEvent, DevicesService, SignalrService, ToastService } from '@app/core';

type AlarmState = 'open' | 'acknowledged' | 'resolved';
type AlarmSeverity = 'critical' | 'major' | 'minor' | 'warning' | 'info';

interface AlarmRecord {
  id: string;
  slotToken: string;
  signature: string;
  message: string;
  severity: AlarmSeverity;
  deviceLabel: string;
  occurredAtMs: number;
  state: AlarmState;
  resolvedAtMs: number | null;
}

interface AlarmSlotSnapshot {
  message: string;
  severityText: string;
}

@Component({
  selector: 'app-alarm',
  standalone: false,
  templateUrl: './alarm.component.html',
  styleUrl: './alarm.component.css'
})
export class AlarmComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly deviceLabelById = new Map<number, string>();
  private readonly activeSignatureBySlot = new Map<string, string>();
  private readonly alarmBySignature = new Map<string, AlarmRecord>();
  private nextAlarmId = 100;

  selectedTab = 0;
  isLoading = false;
  tabOptions = [
    { label: 'Open', value: 0 },
    { label: 'Acknowledged', value: 1 },
    { label: 'Resolved', value: 2 }
  ];

  alarmRows: AlarmRecord[] = [];

  constructor(
    private readonly signalrService: SignalrService,
    private readonly devicesService: DevicesService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.bootstrapRealtimeFlow();
  }

  get criticalCount(): number {
    return this.countActiveBySeverity('critical');
  }

  get majorCount(): number {
    return this.countActiveBySeverity('major');
  }

  get minorCount(): number {
    return this.countActiveBySeverity('minor') + this.countActiveBySeverity('warning');
  }

  get resolved24hCount(): number {
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return this.alarmRows.filter(row => row.state === 'resolved' && (row.resolvedAtMs ?? 0) >= dayAgo).length;
  }

  get filteredRows(): AlarmRecord[] {
    const state = this.resolveStateFromTab(this.selectedTab);
    return this.alarmRows.filter(row => row.state === state);
  }

  get canAcknowledgeAll(): boolean {
    return this.alarmRows.some(row => row.state === 'open');
  }

  acknowledgeAll(): void {
    let changed = false;
    for (const row of this.alarmRows) {
      if (row.state === 'open') {
        row.state = 'acknowledged';
        changed = true;
      }
    }

    if (!changed) {
      return;
    }

    this.refreshRows();
  }

  formatWhen(timestampMs: number): string {
    const diffMs = Math.max(0, Date.now() - timestampMs);
    const minute = 60_000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diffMs < minute) {
      return 'just now';
    }

    if (diffMs < hour) {
      return `${Math.floor(diffMs / minute)}m ago`;
    }

    if (diffMs < day) {
      return `${Math.floor(diffMs / hour)}h ago`;
    }

    const days = Math.floor(diffMs / day);
    if (days <= 7) {
      return `${days}d ago`;
    }

    return new Date(timestampMs).toLocaleString();
  }

  severityClass(severity: AlarmSeverity): string {
    return severity;
  }

  stateClass(state: AlarmState): string {
    if (state === 'open') {
      return 'critical';
    }

    if (state === 'acknowledged') {
      return 'warning';
    }

    return 'success';
  }

  private bootstrapRealtimeFlow(): void {
    this.loadDeviceContext();

    this.signalrService.onDeviceData$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event: DeviceDataEvent | null) => {
        if (!event?.decodedPayload) {
          this.resetAlarmState();
          return;
        }

        this.consumePacket(event);
      });
  }

  private loadDeviceContext(): void {
    this.isLoading = true;
    this.resetAlarmState();
    this.devicesService.getDevices()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response: unknown) => {
          const list = this.extractDeviceList(response);
          const ids: number[] = [];

          for (const item of list) {
            const deviceId = this.resolveDeviceIdFromAny(item);
            if (deviceId === null) {
              continue;
            }

            ids.push(deviceId);
            this.deviceLabelById.set(deviceId, this.resolveDeviceLabel(item, deviceId));
          }

          if (!ids.length) {
            return;
          }

          void this.signalrService.subscribeToDevices(ids).catch(() => {
            this.toastService.showError('Unable to subscribe alarm stream for all devices');
          });
        },
        error: () => {
          this.toastService.showError('Failed to load devices for alarm stream');
        }
      });
  }

  private consumePacket(event: DeviceDataEvent): void {
    const payload = event.decodedPayload as DecodedPayload;
    const deviceId = this.toNumber(event.deviceId) ?? this.toNumber(payload.deviceId);

    if (deviceId === null) {
      return;
    }

    const eventMs = this.toTimeMs(payload.portalReceiveTime) || this.toTimeMs(payload.receivedAtUtc) || this.toTimeMs(event.receivedAt) || Date.now();
    const deviceLabel = this.deviceLabelById.get(deviceId) ?? `DV-${deviceId}`;
    const slots: AlarmSlotSnapshot[] = [
      {
        message: String(payload.alarm1Code ?? 'No alarm in this slot'),
        severityText: String(payload.alarm1Level ?? 'None')
      },
      {
        message: String(payload.alarm2Code ?? 'No alarm in this slot'),
        severityText: String(payload.alarm2Level ?? 'None')
      },
      {
        message: String(payload.alarm3Code ?? 'No alarm in this slot'),
        severityText: String(payload.alarm3Level ?? 'None')
      },
      {
        message: String(payload.alarm4Code ?? 'No alarm in this slot'),
        severityText: String(payload.alarm4Level ?? 'None')
      },
      {
        message: String(payload.alarm5Code ?? 'No alarm in this slot'),
        severityText: String(payload.alarm5Level ?? 'None')
      },
      {
        message: String(payload.alarm6Code ?? 'No alarm in this slot'),
        severityText: String(payload.alarm6Level ?? 'None')
      }
    ];

    slots.forEach((slot, index) => {
      const slotToken = `${deviceId}:${index + 1}`;
      this.applySlotUpdate(slotToken, slot, deviceLabel, eventMs);
    });

    this.refreshRows();
  }

  private applySlotUpdate(slotToken: string, slot: AlarmSlotSnapshot, deviceLabel: string, eventMs: number): void {
    if (this.isSlotCleared(slot)) {
      const previousSignature = this.activeSignatureBySlot.get(slotToken);
      if (!previousSignature) {
        return;
      }

      const previous = this.alarmBySignature.get(previousSignature);
      if (previous) {
        previous.state = 'resolved';
        previous.resolvedAtMs = eventMs;
      }
      this.activeSignatureBySlot.delete(slotToken);
      return;
    }

    const severity = this.normalizeSeverity(slot.severityText);
    const signature = `${slotToken}:${slot.message}`;
    const previousSignature = this.activeSignatureBySlot.get(slotToken);

    if (previousSignature && previousSignature !== signature) {
      const previous = this.alarmBySignature.get(previousSignature);
      if (previous && previous.state !== 'resolved') {
        previous.state = 'resolved';
        previous.resolvedAtMs = eventMs;
      }
    }

    const existing = this.alarmBySignature.get(signature);
    if (existing && existing.state !== 'resolved') {
      existing.occurredAtMs = eventMs;
      existing.severity = severity;
      existing.deviceLabel = deviceLabel;
      this.activeSignatureBySlot.set(slotToken, signature);
      return;
    }

    const nextRecord: AlarmRecord = {
      id: `ALR-${this.nextAlarmId++}`,
      slotToken,
      signature,
      message: slot.message,
      severity,
      deviceLabel,
      occurredAtMs: eventMs,
      state: 'open',
      resolvedAtMs: null
    };

    this.alarmBySignature.set(signature, nextRecord);
    this.activeSignatureBySlot.set(slotToken, signature);
  }

  private refreshRows(): void {
    this.alarmRows = Array.from(this.alarmBySignature.values()).sort((a, b) => b.occurredAtMs - a.occurredAtMs);
  }

  private resetAlarmState(): void {
    this.deviceLabelById.clear();
    this.activeSignatureBySlot.clear();
    this.alarmBySignature.clear();
    this.alarmRows = [];
    this.nextAlarmId = 100;
  }

  private extractDeviceList(response: unknown): Record<string, unknown>[] {
    const root = response as Record<string, unknown> | null;
    const pageData = (root?.['data'] as Record<string, unknown> | undefined)?.['pageData'];
    if (Array.isArray(pageData)) {
      return pageData as Record<string, unknown>[];
    }

    const data = root?.['data'];
    if (Array.isArray(data)) {
      return data as Record<string, unknown>[];
    }

    if (Array.isArray(root)) {
      return root as Record<string, unknown>[];
    }

    return [];
  }

  private resolveDeviceIdFromAny(item: Record<string, unknown>): number | null {
    const candidates = [item['id'], item['deviceId'], item['siteId']];
    for (const candidate of candidates) {
      const numeric = this.toNumber(candidate);
      if (numeric !== null) {
        return numeric;
      }
    }

    return null;
  }

  private resolveDeviceLabel(item: Record<string, unknown>, fallbackDeviceId: number): string {
    const labelCandidates = [item['code'], item['deviceCode'], item['name'], item['deviceName']];

    for (const candidate of labelCandidates) {
      const normalized = String(candidate ?? '').trim();
      if (normalized) {
        return normalized;
      }
    }

    return `DV-${fallbackDeviceId}`;
  }

  private countActiveBySeverity(severity: AlarmSeverity): number {
    return this.alarmRows.filter(row => row.state !== 'resolved' && row.severity === severity).length;
  }

  private resolveStateFromTab(tabValue: number): AlarmState {
    if (tabValue === 1) {
      return 'acknowledged';
    }

    if (tabValue === 2) {
      return 'resolved';
    }

    return 'open';
  }

  private isSlotCleared(slot: AlarmSlotSnapshot): boolean {
    const normalizedSeverity = slot.severityText.trim().toLowerCase();
    const normalizedMessage = slot.message.trim().toLowerCase();
    return normalizedSeverity === 'none'
      || normalizedMessage === 'no alarm in this slot'
      || normalizedMessage.includes('no alarm');
  }

  private normalizeSeverity(value: string): AlarmSeverity {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'critical') {
      return 'critical';
    }

    if (normalized === 'major') {
      return 'major';
    }

    if (normalized === 'minor') {
      return 'minor';
    }

    if (normalized === 'warning') {
      return 'warning';
    }

    return 'info';
  }

  private toNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  }

  private toTimeMs(value: unknown): number {
    if (!value) {
      return 0;
    }

    const parsed = new Date(String(value)).getTime();
    return Number.isFinite(parsed) ? parsed : 0;
  }
}
