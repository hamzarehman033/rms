import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RawVisionDecodedPayload, mapVisionDecodedPayload, VisionDecodedPayload } from '../../../core/constants/device-message.model';
import { AiVisionPacketApiModel, VisionService } from '../../../core/services/vision.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-security-device-detail',
  standalone: false,
  templateUrl: './security-device-detail.component.html',
  styleUrl: './security-device-detail.component.css'
})
export class SecurityDeviceDetailComponent implements OnInit, OnDestroy {
  readonly timeSpanOptions: Array<{ label: string; value: '1d' | '1w' | '1m' }> = [
    { label: 'Last 1 Day', value: '1d' },
    { label: 'Last 1 Week', value: '1w' },
    { label: 'Last 1 Month', value: '1m' },
  ];
  selectedTimeSpan: '1d' | '1w' | '1m' = '1d';
  selectedDeviceDetails: any = null;
  latestVisionPayload: VisionDecodedPayload | null = null;
  evidenceImageSrc: string | null = null;
  deviceId: number = 0;
  selectedAlertId: number | null = null;
  private readonly historyPayloads = new Map<number, VisionDecodedPayload>();
  private readonly destroy$ = new Subject<void>();

  constructor(private visionService: VisionService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.deviceId = Number(params['id']);

      if (this.deviceId) {
        this.getAiVisionData();
      }
    });
  }

  getAiVisionData(): void {
    this.visionService.getAiVisionData(this.deviceId, this.selectedTimeSpan).pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.applyHistoryFromApi(data);
    });
  }

  onTimeSpanChange(event: Event): void {
    const value = (event.target as HTMLSelectElement | null)?.value as '1d' | '1w' | '1m' | undefined;

    if (!value || !this.deviceId || value === this.selectedTimeSpan) {
      return;
    }

    this.selectedTimeSpan = value;
    this.getAiVisionData();
  }

  featureStatuses: Array<{ label: string; code: number | null; count: number }> = [
    { label: 'Fence/Boundary Violations', code: 4, count: 0 },
    { label: 'Crowd Alerts', code: 6, count: 0 },
    { label: 'Guard Appearance', code: 7, count: 0 },
    { label: 'Stream Health', code: null, count: 0 },
  ];

  cameras = [
    {
      id: 1,
      name: 'Camera 1 - Shelter Area',
      features: 'Intrusion + Geofence Active',
      status: 'Online',
      lastAlert: 'Intrusion - 12:35',
    },
    {
      id: 2,
      name: 'Camera 2 - Gate Area',
      features: 'Fence + Head Count Active',
      status: 'Online',
      lastAlert: 'Boundary Cross - 12:28',
    },
  ];

  aiAlerts: Array<{ id: number; title: string; meta: string; time: string; severity: string }> = [];

  lastEvent = {
    title: '',
    meta: '',
  };

  selectedEvent = {
    violationLabel: '',
    cameraTime: '',
    evidenceFile: '',
    siteCode: '',
    zone: '',
    status: '',
  };

  selectedEventDetails = [
    { label: 'Event ID', value: '-' },
    { label: 'Snapshot Reason', value: '-' },
    { label: 'Active Cameras', value: '-' },
    { label: 'Configured Cameras', value: '-' },
    { label: 'Severity', value: '-', valueClass: '' },
    { label: 'Violation Type', value: '-' },
    { label: 'Confidence', value: '-' },
    { label: 'Camera', value: '-' },
    { label: 'Status', value: '-' },
  ];

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getActiveCameraCount(): number {
    return this.latestVisionPayload?.activeCameraCount ?? this.cameras.length;
  }

  getConfiguredCameraCount(): number {
    return this.latestVisionPayload?.configuredCameraCount ?? this.cameras.length;
  }

  onAlertClick(alert: { id: number }): void {
    this.selectedAlertId = alert.id;

    const cachedPayload = this.historyPayloads.get(alert.id);
    if (cachedPayload) {
      this.applySelectedEventDetails(cachedPayload);
    }

    this.visionService.getVisionPacketDetails(alert.id).pipe(takeUntil(this.destroy$)).subscribe((imageBase64) => {
      if (this.selectedAlertId !== alert.id) {
        return;
      }

      this.evidenceImageSrc = this.getEvidenceImageSrc(imageBase64);

      if (this.evidenceImageSrc && this.latestVisionPayload) {
        this.selectedEvent = {
          ...this.selectedEvent,
          evidenceFile: `SEC-${this.latestVisionPayload.messageIdHash || this.latestVisionPayload.eventIdHash}.jpg`,
        };
      }
    });
  }

  private applyHistoryFromApi(historyPackets: AiVisionPacketApiModel[]): void {
    const mappedHistory = historyPackets
      .map((packet) => ({
        id: packet.id,
        payload: this.mapApiPacketToVisionPayload(packet)
      }))
      .filter((entry): entry is { id: number; payload: VisionDecodedPayload } => !!entry.payload)
      .sort((a, b) => b.payload.timestampUtc - a.payload.timestampUtc);

    this.historyPayloads.clear();
    for (const entry of mappedHistory) {
      this.historyPayloads.set(entry.id, entry.payload);
    }

    const reasonCounts = mappedHistory.reduce<Record<number, number>>((accumulator, entry) => {
      const reasonCode = entry.payload.snapshotReasonCode;

      if (reasonCode > 0) {
        accumulator[reasonCode] = (accumulator[reasonCode] ?? 0) + 1;
      }

      return accumulator;
    }, {});

    this.featureStatuses = this.featureStatuses.map((feature) => ({
      ...feature,
      count: feature.code == null
        ? (mappedHistory[0]?.payload.activeCameraCount ?? 0)
        : (reasonCounts[feature.code] ?? 0)
    }));

    this.aiAlerts = mappedHistory
      .filter((entry) => entry.payload.messageType === 1 && entry.payload.snapshotReasonCode !== 0)
      .map((entry) => {
        const payload = entry.payload;
        const alertTitle = payload.snapshotReasonLabel !== 'None' ? payload.snapshotReasonLabel : payload.eventTypeLabel;

        return {
          id: entry.id,
          title: alertTitle,
          meta: `Cam ${payload.cameraId || '-'} · Confidence ${this.formatConfidence(payload.confidence)}`,
          time: this.formatPacketTime(payload.timestampUtcIso),
          severity: this.getSeverityClass(payload.severity),
        };
      });

    if (mappedHistory.length > 0) {
      const latestPayload = mappedHistory[0].payload;
      const lastEventTitle = latestPayload.snapshotReasonLabel !== 'None' ? latestPayload.snapshotReasonLabel : latestPayload.eventTypeLabel;

      this.lastEvent = {
        title: lastEventTitle,
        meta: `Cam ${latestPayload.cameraId} - ${this.formatPacketTime(latestPayload.timestampUtcIso)}`,
      };
    }

    if (this.aiAlerts.length > 0) {
      this.onAlertClick(this.aiAlerts[0]);
      return;
    }

    this.selectedAlertId = null;
    this.latestVisionPayload = null;
    this.evidenceImageSrc = null;
    this.historyPayloads.clear();
  }

  private applySelectedEventDetails(payload: VisionDecodedPayload): void {
    const packetTime = this.formatPacketTime(payload.timestampUtcIso);
    const alertTitle = payload.snapshotReasonLabel !== 'None' ? payload.snapshotReasonLabel : payload.eventTypeLabel;

    this.latestVisionPayload = payload;
    this.evidenceImageSrc = this.getEvidenceImageSrc(
      payload.image
        ?? payload['imageData']
        ?? payload['imageBytes']
        ?? payload['imageBase64']
        ?? payload['imageHex']
        ?? payload['imageUrl']
        ?? payload['snapshotUrl']
    );

    this.lastEvent = {
      title: alertTitle,
      meta: `Cam ${payload.cameraId} - ${packetTime}`,
    };

    const evidenceFile = this.evidenceImageSrc
      ? `SEC-${payload.messageIdHash || payload.eventIdHash}.jpg`
      : this.selectedEvent.evidenceFile;

    this.selectedEvent = {
      ...this.selectedEvent,
      violationLabel: alertTitle,
      cameraTime: `Cam ${payload.cameraId} - ${packetTime}`,
      evidenceFile,
      siteCode: payload.topicSiteId ?? this.selectedEvent.siteCode,
      zone: payload.activityZoneLabel,
      status: payload.messageTypeLabel,
    };
    this.selectedEventDetails = [
      { label: 'Event ID', value: String(payload.eventIdHash) },
      { label: 'Snapshot Reason', value: payload.snapshotReasonLabel },
      { label: 'Active Cameras', value: String(payload.activeCameraCount) },
      { label: 'Configured Cameras', value: String(payload.configuredCameraCount) },
      { label: 'Severity', value: payload.severityLabel, valueClass: payload.severity >= 2 ? 'text-warning' : '' },
      { label: 'Violation Type', value: payload.eventTypeLabel },
      { label: 'Confidence', value: this.formatConfidence(payload.confidence) },
      { label: 'Camera', value: `Cam ${payload.cameraId}` },
      { label: 'Status', value: payload.messageTypeLabel },
    ];
  }

  private mapApiPacketToVisionPayload(packet: AiVisionPacketApiModel): VisionDecodedPayload | null {
    const normalized = this.normalizeRawPacket(packet);

    if (!normalized) {
      return null;
    }

    return mapVisionDecodedPayload(normalized);
  }

  private normalizeRawPacket(packet: AiVisionPacketApiModel): RawVisionDecodedPayload | null {
    const timestamp = Number(packet.timestampUtc);

    if (!Number.isFinite(timestamp)) {
      return null;
    }

    const timestampUtc = timestamp > 1000000000000 ? Math.floor(timestamp / 1000) : timestamp;
    const ehsCodes = this.normalizeEhsCodes(packet.ehsCodes, packet.ehsCodeCount);
    const hasImage = packet.hasImage === true || !!packet.imageBase64 || !!packet.image;
    const imageValue = packet.image ?? packet.imageBase64 ?? null;
    const activeCameras = packet.activeCameraCount ?? this.countActiveCameras(packet.cameraStatusBitmap);

    return {
      deviceId: this.deviceId,
      topic: String(packet.topic ?? ''),
      receivedAt: packet.receivedAtUtc ?? new Date(timestampUtc * 1000).toISOString(),
      packetSignature: Number(packet.packetSignature ?? 0),
      protocolVersion: Number(packet.protocolVersion ?? packet.packetVersion ?? 1),
      messageType: Number(packet.messageType ?? 0),
      headerLength: Number(packet.headerLength ?? 0),
      flags: Number(packet.flags ?? (hasImage ? 1 : 0)),
      packetSequence: Number(packet.packetSequence ?? packet.id ?? 0),
      timestampUtc,
      siteIdHash: Number(packet.siteIdHash ?? 0),
      edgeDeviceIdHash: Number(packet.edgeDeviceIdHash ?? 0),
      messageIdHash: Number(packet.messageIdHash ?? 0),
      eventIdHash: Number(packet.eventIdHash ?? 0),
      cameraId: Number(packet.cameraId ?? 0),
      eventType: Number(packet.eventType ?? 0),
      severity: Number(packet.severity ?? 0),
      confidence: packet.confidence,
      confidenceRaw: packet.confidenceRaw,
      activityZone: Number(packet.activityZone ?? 0),
      objectCount: Number(packet.objectCount ?? 0),
      ehsCodeCount: Number(packet.ehsCodeCount ?? ehsCodes.length),
      ehsCodes,
      snapshotReasonCode: Number(packet.snapshotReasonCode ?? 0),
      activeCameraCount: Number(activeCameras),
      configuredCameraCount: Number(packet.configuredCameraCount ?? activeCameras),
      detectionEnabled: Number(packet.detectionEnabled ?? 0),
      systemStatus: Number(packet.systemStatus ?? 0),
      heartbeatIntervalSec: Number(packet.heartbeatIntervalSec ?? 0),
      edgeUptimeSec: Number(packet.edgeUptimeSec ?? 0),
      cpuUsagePercent: Number(packet.cpuUsagePercent ?? 0),
      ramUsagePercent: Number(packet.ramUsagePercent ?? 0),
      diskFreePercent: Number(packet.diskFreePercent ?? 0),
      cameraStatusBitmap: Number(packet.cameraStatusBitmap ?? 0),
      modelId: Number(packet.modelId ?? 0),
      imageFormat: Number(packet.imageFormat ?? 0),
      imageEncoding: Number(packet.imageEncoding ?? 0),
      imageWidth: Number(packet.imageWidth ?? 0),
      imageHeight: Number(packet.imageHeight ?? 0),
      imageSizeBytes: Number(packet.imageSizeBytes ?? 0),
      imageCrc32: Number(packet.imageCrc32 ?? 0),
      headerCrc16: Number(packet.headerCrc16 ?? 0),
      isHeaderCrcValid: packet.isHeaderCrcValid ?? true,
      isImageCrcValid: packet.isImageCrcValid ?? true,
      image: imageValue,
      id: packet.id,
    };
  }

  private normalizeEhsCodes(value: number[] | string, expectedCount: number): number[] {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value !== 'string' || !value.trim()) {
      return [];
    }

    try {
      const decoded = atob(value);
      const count = Number.isFinite(expectedCount) ? expectedCount : decoded.length;

      return Array.from(decoded).slice(0, count).map((char) => char.charCodeAt(0));
    } catch {
      return [];
    }
  }

  private countActiveCameras(bitmap: number): number {
    let count = 0;
    let value = bitmap >>> 0;

    while (value) {
      count += value & 1;
      value >>>= 1;
    }

    return count;
  }

  private getEvidenceImageSrc(image: unknown): string | null {
    if (Array.isArray(image)) {
      return `data:image/jpeg;base64,${this.bytesToBase64(image)}`;
    }

    if (image && typeof image === 'object') {
      const imageRecord = image as Record<string, unknown>;

      return this.getEvidenceImageSrc(
        imageRecord['data']
          ?? imageRecord['url']
          ?? imageRecord['src']
          ?? imageRecord['dataUrl']
          ?? imageRecord['base64']
          ?? imageRecord['hex']
          ?? imageRecord['bytes']
      );
    }

    const value = String(image ?? '').trim();

    if (!value) {
      return null;
    }

    if (value.startsWith('data:image') || value.startsWith('http://') || value.startsWith('https://') || value.startsWith('blob:')) {
      return value;
    }

    const compactHex = value.replace(/^0x/i, '').replace(/[\s:-]/g, '');
    if (compactHex.length % 2 === 0 && /^[0-9a-fA-F]+$/.test(compactHex) && compactHex.toUpperCase().startsWith('FFD8')) {
      return `data:image/jpeg;base64,${this.hexToBase64(compactHex)}`;
    }

    return `data:image/jpeg;base64,${value}`;
  }

  private hexToBase64(hex: string): string {
    const bytes: number[] = [];

    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.slice(i, i + 2), 16));
    }

    return this.bytesToBase64(bytes);
  }

  private bytesToBase64(bytes: number[]): string {
    let binary = '';

    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    return btoa(binary);
  }

  private formatConfidence(value: number): string {
    return `${Math.round(value * 100)}%`;
  }

  private getSeverityClass(severity: number): string {
    if (severity >= 3) return 'critical';
    if (severity === 2) return 'major';
    if (severity === 1) return 'warning';
    return 'info';
  }

  private formatPacketTime(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
}
