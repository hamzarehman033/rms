import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { SignalrService } from '@app/core';
import { LineChartOptions } from '../../../shared/components/chart-components';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VisionDecodedPayload } from '../../../core/constants/device-message.model';

@Component({
  selector: 'app-ehs-device-detail',
  standalone: false,
  templateUrl: './ehs-device-detail.component.html',
  styleUrl: './ehs-device-detail.component.css'
})
export class EhsDeviceDetailComponent implements OnInit, OnChanges, OnDestroy {
  isLoadingDevice = false;
  isOperational = false;
  selectedDeviceDetails: any = null;
  lastPacketAt: string | null = null;
  peakSolarPowerKw = 0;
  selectedSection: string = 'live-data';
  latestVisionPayload: VisionDecodedPayload | null = null;
  evidenceImageSrc: string | null = null;
  private readonly destroy$ = new Subject<void>();

  // Alerts (legacy dock section)
  alerts = [
    { id: 1, icon: 'pi pi-exclamation-circle-fill', title: 'Solar Inverter Voltage Warning', device: 'DV-003', time: '42 min ago', severity: 'major' },
    { id: 2, icon: 'pi pi-info-circle-fill', title: 'Firmware Update Available', device: 'DV-001', time: '5 hrs ago', severity: 'info' }
  ];

  constructor(private signalrService: SignalrService) {}

  ngOnInit(): void {
    this.signalrService.onVisionDetection$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
        if (!payload || !this.isVisionPacketForCurrentDevice(payload)) {
          return;
        }

        this.applyVisionPacket(payload);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }
  // AI monitoring page structure (placeholder data)
  featureStatuses = [
    { label: 'Helmet', code: 1, count: 0 },
    { label: 'Vest', code: 2, count: 0 },
    { label: 'Restricted Zone', code: 4, count: 0 },
    { label: 'Team Activity', code: 7, count: 0 },
  ];

  cameras = [
    {
      id: 1,
      name: 'Camera 1 - Shelter Area',
      features: 'PPE + Geofence Active',
      status: 'Online',
    },
    {
      id: 2,
      name: 'Camera 2 - Gate Area',
      features: 'Intrusion + Geofence Active',
      status: 'Online',
    },
  ];

  aiAlerts: Array<{ title: string; meta: string; time: string; severity: string }> = [];

  lastEvent = {
    title: 'No Helmet',
    meta: 'Cam 1 - 12:35 PM',
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
    { label: 'Severity', value: 'Major', valueClass: 'text-warning' },
    { label: 'Violation Type', value: 'No Helmet' },
    { label: 'Camera', value: 'Cam 1 - Shelter' },
    { label: 'Status', value: 'New / Unacknowledged' },
  ];


  ngOnDestroy(): void {
    
  }

  private toNumericId(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  }

  getActiveCameraCount(): number {
    return this.latestVisionPayload?.activeCameraCount ?? this.cameras.length;
  }

  getConfiguredCameraCount(): number {
    return this.latestVisionPayload?.configuredCameraCount ?? this.cameras.length;
  }

  private isVisionPacketForCurrentDevice(payload: VisionDecodedPayload): boolean {
    const selectedDeviceId = this.toNumericId(this.selectedDeviceDetails?.id ?? this.selectedDeviceDetails?.deviceId);
    const packetDeviceId = this.toNumericId(payload.deviceId);

    return selectedDeviceId === null || packetDeviceId === null || selectedDeviceId === packetDeviceId;
  }

  private applyVisionPacket(payload: VisionDecodedPayload): void {
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
    this.featureStatuses = this.featureStatuses.map(feature => feature.code === payload.snapshotReasonCode
      ? { ...feature, count: feature.count + 1 }
      : feature
    );
    if (payload.messageType === 1 && payload.snapshotReasonCode !== 0) {
      this.aiAlerts = [
        {
          title: alertTitle,
          meta: `Cam ${payload.cameraId || '-'} · Confidence ${this.formatConfidence(payload.confidence)}`,
          time: packetTime,
          severity: this.getSeverityClass(payload.severity),
        },
        ...this.aiAlerts
      ];
    }
    this.lastEvent = {
      title: payload.snapshotReasonLabel,
      meta: `Cam ${payload.cameraId} - ${packetTime}`,
    };
    const evidenceFile = this.evidenceImageSrc
      ? `AI-${payload.messageIdHash || payload.eventIdHash}.jpg`
      : this.selectedEvent.evidenceFile;

    this.selectedEvent = {
      ...this.selectedEvent,
      violationLabel: payload.eventTypeLabel,
      cameraTime: `Cam ${payload.cameraId} - ${packetTime}`,
      evidenceFile,
      siteCode: payload.topicSiteId ?? this.selectedEvent.siteCode,
      zone: payload.activityZoneLabel,
      status: payload.messageTypeLabel,
    };
    this.selectedEventDetails = [
      { label: 'Event ID', value: String(payload.eventIdHash) },
      { label: 'Severity', value: payload.severityLabel, valueClass: payload.severity >= 2 ? 'text-warning' : '' },
      { label: 'Violation Type', value: payload.eventTypeLabel },
      { label: 'Confidence', value: payload.confidence.toString() },
      { label: 'Camera', value: `Cam ${payload.cameraId}` },
      { label: 'Status', value: payload.messageTypeLabel },
    ];
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
