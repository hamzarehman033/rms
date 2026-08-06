import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { SignalrService, ToastService } from '@app/core';
import { LineChartOptions } from '../../../shared/components/chart-components';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DecodedPayload, DeviceDataEvent } from '../../../core/constants/device-message.model';

@Component({
  selector: 'app-ehs-device-detail',
  standalone: false,
  templateUrl: './ehs-device-detail.component.html',
  styleUrl: './ehs-device-detail.component.css'
})
export class EhsDeviceDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Input() deviceDetails: any = null;
  isLoadingDevice = false;
  isOperational = false;
  selectedDeviceDetails: any = null;
  lastPacketAt: string | null = null;
  peakSolarPowerKw = 0;
  selectedSection: string = 'live-data';

  // Alerts (legacy dock section)
  alerts = [
    { id: 1, icon: 'pi pi-exclamation-circle-fill', title: 'Solar Inverter Voltage Warning', device: 'DV-003', time: '42 min ago', severity: 'major' },
    { id: 2, icon: 'pi pi-info-circle-fill', title: 'Firmware Update Available', device: 'DV-001', time: '5 hrs ago', severity: 'info' }
  ];

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }
  // AI monitoring page structure (placeholder data)
  featureStatuses = [
    { label: 'Helmet', active: true },
    { label: 'Vest', active: true },
    { label: 'Restricted Zone', active: true },
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
    { title: 'Person Detected', meta: 'Cam 2 · Info', time: '12:10', severity: 'info' },
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
    { label: 'Event ID', value: 'AI-2026-000123' },
    { label: 'Severity', value: 'Major', valueClass: 'text-warning' },
    { label: 'Violation Type', value: 'No Helmet' },
    { label: 'Confidence', value: '91%' },
    { label: 'Camera', value: 'Cam 1 - Shelter' },
    { label: 'Status', value: 'New / Unacknowledged' },
    { label: 'Suggested Action', value: 'Notify supervisor' },
    { label: 'Controls', value: 'Ack · False Alarm · Close' },
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
