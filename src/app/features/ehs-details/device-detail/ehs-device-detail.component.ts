import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { LineChartOptions } from '../../../shared/components/chart-components';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RawVisionDecodedPayload, mapVisionDecodedPayload, VisionDecodedPayload } from '../../../core/constants/device-message.model';
import { DeviceCameraPayload, DevicesService } from '../../../core/services/devices.service';
import { CameraStreamService } from '../../../core/services/camera-stream.service';
import { AiVisionPacketApiModel, VisionService } from '../../../core/services/vision.service';
import { SignalrService } from '../../../core/services/signalr.service';
import { ActivatedRoute } from '@angular/router';
import { toast } from '../../../utils/global-toast';

interface LiveCamera {
  cameraIndex: number;
  name: string;
  isEnabled: boolean;
  isStreaming: boolean;
  isBusy: boolean;
  hasVideo: boolean;
}

@Component({
  selector: 'app-ehs-device-detail',
  standalone: false,
  templateUrl: './ehs-device-detail.component.html',
  styleUrl: './ehs-device-detail.component.css'
})
export class EhsDeviceDetailComponent implements OnInit, OnDestroy {
  readonly timeSpanOptions: Array<{ label: string; value: '1d' | '1w' | '1m' }> = [
    { label: 'Last 1 Day', value: '1d' },
    { label: 'Last 1 Week', value: '1w' },
    { label: 'Last 1 Month', value: '1m' },
  ];
  selectedTimeSpan: '1d' | '1w' | '1m' = '1d';
  isLoadingDevice = false;
  isOperational = false;
  selectedDeviceDetails: any = null;
  lastPacketAt: string | null = null;
  peakSolarPowerKw = 0;
  selectedSection: string = 'live-data';
  latestVisionPayload: VisionDecodedPayload | null = null;
  evidenceImageSrc: string | null = null;
  aiVisionData: any = null;
  deviceId: number = 0;
  private readonly destroy$ = new Subject<void>();

  selectedAlertId: number | null = null;
  private readonly historyPayloads = new Map<number, VisionDecodedPayload>();
  @ViewChildren('cameraVideo') private cameraVideos?: QueryList<ElementRef<HTMLVideoElement>>;

  constructor(
    private visionService: VisionService,
    private devicesService: DevicesService,
    private cameraStreamService: CameraStreamService,
    private signalrService: SignalrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.signalrService.onVisionDetection$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => this.applyLiveVisionPacket(payload));

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.deviceId = Number(params['id']);

      if (this.deviceId) {
        void this.cameraStreamService.stopAll();
        this.cameras = [];
        this.loadCameras();
        this.getAiVisionData();
        void this.signalrService.subscribeToDevice(this.deviceId);
      }
    });
  }

  getAiVisionData(): void {
    this.visionService.getAiVisionData(this.deviceId, this.selectedTimeSpan).pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.aiVisionData = data;
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

  // AI monitoring page structure (placeholder data)
  featureStatuses = [
    { label: 'Helmet', code: 1, count: 0 },
    { label: 'Vest', code: 2, count: 0 },
    { label: 'Restricted Zone', code: 4, count: 0 },
    { label: 'Team Activity', code: 7, count: 0 },
  ];

  cameras: LiveCamera[] = [];

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
    { label: 'Event ID Hash', value: '-' },
    { label: 'Snapshot Reason', value: '-' },
    { label: 'Confidence', value: '-' },
    { label: 'Active Cameras', value: '-' },
    { label: 'Configured Cameras', value: '-' },
    { label: 'Severity', value: '', valueClass: 'text-warning' },
    { label: 'Violation Type', value: '' },
    { label: 'Camera', value: '' },
    { label: 'Status', value: '' },
  ];


  ngOnDestroy(): void {
    void this.cameraStreamService.stopAll();
    this.destroy$.next();
    this.destroy$.complete();
  }

  getActiveCameraCount(): number {
    return this.latestVisionPayload?.activeCameraCount ?? this.cameras.filter(camera => camera.isStreaming).length;
  }

  getConfiguredCameraCount(): number {
    return this.latestVisionPayload?.configuredCameraCount ?? this.cameras.length;
  }

  cameraViewportLabel(camera: LiveCamera): string {
    if (!camera.isEnabled) {
      return 'Camera disabled';
    }

    if (camera.isBusy) {
      return camera.isStreaming ? 'Stopping…' : 'Starting…';
    }

    if (camera.isStreaming) {
      return camera.hasVideo ? 'Live' : 'Waiting for remote stream';
    }

    return 'Stream stopped';
  }

  async toggleCameraStream(camera: LiveCamera): Promise<void> {
    if (!this.deviceId || !camera.isEnabled || camera.isBusy) {
      return;
    }

    camera.isBusy = true;

    try {
      if (camera.isStreaming) {
        await this.cameraStreamService.stop(this.deviceId, camera.cameraIndex);
        camera.isStreaming = false;
        camera.hasVideo = false;
      } else {
        const video = this.getCameraVideo(camera.cameraIndex);
        if (!video) {
          throw new Error('Camera viewport is not ready');
        }

        console.log('[CameraStream] Camera', {
          deviceId: this.deviceId,
          cameraIndex: camera.cameraIndex,
          name: camera.name,
          isEnabled: camera.isEnabled
        });
        await this.cameraStreamService.start(
          this.deviceId,
          camera.cameraIndex,
          video,
          () => { camera.hasVideo = true; },
          () => { camera.hasVideo = false; }
        );
        camera.isStreaming = true;
      }
    } catch (error: unknown) {
      camera.isStreaming = false;
      camera.hasVideo = false;
      const message = error instanceof Error ? error.message : 'Failed to update camera stream';
      toast.error(message);
    } finally {
      camera.isBusy = false;
    }
  }

  private getCameraVideo(cameraIndex: number): HTMLVideoElement | null {
    return this.cameraVideos?.find(
      (ref) => Number(ref.nativeElement.getAttribute('data-camera-index')) === cameraIndex
    )?.nativeElement ?? null;
  }

  private loadCameras(): void {
    this.devicesService.getDeviceById(this.deviceId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response: unknown) => {
        this.cameras = this.mapLiveCameras(response);
      },
      error: () => {
        this.cameras = [];
        toast.error('Failed to load cameras');
      }
    });
  }

  private mapLiveCameras(response: unknown): LiveCamera[] {
    const responseData = (response as { data?: Record<string, unknown> } | Record<string, unknown>) ?? {};
    const data = (responseData as { data?: Record<string, unknown> }).data ?? responseData as Record<string, unknown>;
    const nested = (data['infrastructure'] ?? data['deviceInfrastructure'] ?? {}) as Record<string, unknown>;
    const cameras = (data['cameras'] ?? nested['cameras'] ?? []) as DeviceCameraPayload[];
    if (!Array.isArray(cameras)) {
      return [];
    }

    return cameras
      .slice()
      .sort((left, right) => Number(left.cameraIndex) - Number(right.cameraIndex))
      .slice(0, 2)
      .map((camera) => ({
        cameraIndex: Number(camera.cameraIndex),
        name: camera.name?.trim() || `Camera ${camera.cameraIndex}`,
        isEnabled: camera.isEnabled !== false,
        isStreaming: false,
        isBusy: false,
        hasVideo: false,
      }));
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
          evidenceFile: `AI-${this.latestVisionPayload.messageIdHash || this.latestVisionPayload.eventIdHash}.jpg`,
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
      count: reasonCounts[feature.code] ?? 0
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

  private applyLiveVisionPacket(payload: VisionDecodedPayload | null): void {
    if (!payload || Number(payload.deviceId) !== this.deviceId) {
      return;
    }
    const id =  -Math.abs(payload.messageIdHash || payload.packetSequence || Date.now());
    this.historyPayloads.set(id, payload);
    this.lastPacketAt = payload.timestampUtcIso;

    if (payload.messageType === 1 && payload.snapshotReasonCode !== 0) {
      const alert = {
        id,
        title: payload.snapshotReasonLabel !== 'None' ? payload.snapshotReasonLabel : payload.eventTypeLabel,
        meta: `Cam ${payload.cameraId || '-'} · Confidence ${this.formatConfidence(payload.confidence)}`,
        time: this.formatPacketTime(payload.timestampUtcIso),
        severity: this.getSeverityClass(payload.severity),
      };
      this.aiAlerts = [alert, ...this.aiAlerts.filter(item => item.id !== id)];
      this.selectedAlertId = alert.id;

      const cachedPayload = this.historyPayloads.get(alert.id);
      if (cachedPayload) {
        this.applySelectedEventDetails(cachedPayload);
      }
    }
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
        ?? payload['imageBase64']
    );

    this.lastEvent = {
      title: alertTitle,
      meta: `Cam ${payload.cameraId} - ${packetTime}`,
    };

    const evidenceFile = this.evidenceImageSrc
      ? `AI-${payload.messageIdHash || payload.eventIdHash}.jpg`
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
      { label: 'Reason', value: payload.snapshotReasonLabel },
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

      // SignalR sends { data: "<base64>" }; also accept byte arrays / alternate keys.
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

  initChart(): LineChartOptions {
    return {
      xAxisData: [],
      seriesData: [
        {
          name: 'Solar Output (kW)',
          data: [],
          color: '#f59e0b'
        },
        {
          name: 'Solar Voltage (V)',
          data: [],
          color: '#38bdf8'
        }
      ],
      height: '300px',
      showLegend: true,
      smooth: true,
      showSymbol: false
    };
  }
}
