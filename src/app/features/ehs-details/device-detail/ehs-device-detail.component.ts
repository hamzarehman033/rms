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

  aiAlerts = [
    { title: 'PPE Violation - No Helmet', meta: 'Cam 1 · High confidence', time: '12:35', severity: 'critical' },
    { title: 'PPE Violation - No Vest', meta: 'Cam 1 · Medium confidence', time: '12:28', severity: 'major' },
    { title: 'Restricted Zone Entry', meta: 'Cam 2 · High confidence', time: '12:21', severity: 'critical' },
  ];

  lastEvent = {
    title: 'No Helmet',
    meta: 'Cam 1 - 12:35 PM',
  };

  selectedEvent = {
    violationLabel: 'PPE VIOLATION',
    cameraTime: 'Cam 1 - 12:35:20 PM',
    evidenceFile: 'AI-2026-000123.jpg',
    siteCode: 'RMS-AI-102',
    zone: 'Shelter Area',
    status: 'New',
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
    this.latestVisionPayload = payload;
    this.featureStatuses = this.featureStatuses.map(feature => feature.code === payload.snapshotReasonCode
      ? { ...feature, count: feature.count + 1 }
      : feature
    );
    this.lastEvent = {
      title: payload.snapshotReasonLabel,
      meta: `Cam ${payload.cameraId} - ${this.formatPacketTime(payload.timestampUtcIso)}`,
    };
    this.selectedEvent = {
      ...this.selectedEvent,
      violationLabel: payload.eventTypeLabel,
      cameraTime: `Cam ${payload.cameraId} - ${this.formatPacketTime(payload.timestampUtcIso)}`,
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
