import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { SignalrService, ToastService } from '@app/core';
import { LineChartOptions } from '../../../shared/components/chart-components';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DecodedPayload, DeviceDataEvent } from '../../../core/constants/device-message.model';

@Component({
  selector: 'app-security-device-detail',
  standalone: false,
  templateUrl: './security-device-detail.component.html',
  styleUrl: './security-device-detail.component.css'
})
export class SecurityDeviceDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Input() deviceDetails: any = null;
  isLoadingDevice = false;
  isOperational = false;
  selectedDeviceDetails: any = null;
  lastPacketAt: string | null = null;
  peakSolarPowerKw = 0;
  selectedSection: string = 'live-data';


  featureStatuses = [
    { label: 'Fence/Boundary Violations', active: true },
    { label: 'Head Count', active: true },
    { label: 'Guard Appearance', active: true },
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

  aiAlerts = [
    { title: 'Geofence Violation', meta: 'Shelter Camera · Confidence 91%', time: '12:35', severity: 'critical' },
    { title: 'Fence / Boundary Cross', meta: 'Gate Camera · Confidence 88%', time: '12:28', severity: 'major' },
    { title: 'Guard Appearance Alert', meta: 'Cam 2 · Confidence 84%', time: '12:21', severity: 'major' },
    { title: 'Head Count Change', meta: 'Cam 1 · Info', time: '12:10', severity: 'info' },
  ];

  lastEvent = {
    title: 'Geofence Violation',
    meta: 'Cam 1 - 12:35 PM',
  };

  selectedEvent = {
    violationLabel: 'INTRUSION',
    cameraTime: 'Cam 1 - 12:35:20 PM',
    evidenceFile: 'SEC-2026-000123.jpg',
    siteCode: 'RMS-AI-102',
    zone: 'Shelter Area',
    status: 'New',
  };

  selectedEventDetails = [
    { label: 'Event ID', value: 'SEC-2026-000123' },
    { label: 'Severity', value: 'Major', valueClass: 'text-warning' },
    { label: 'Violation Type', value: 'Geofence / Intrusion' },
    { label: 'Confidence', value: '91%' },
    { label: 'Camera', value: 'Cam 1 - Shelter' },
    { label: 'Status', value: 'New / Unacknowledged' },
    { label: 'Suggested Action', value: 'Notify security supervisor' },
    { label: 'Controls', value: 'Ack · False Alarm · Close' },
  ];

  liveData = {
    grid: { voltage: '-', status: '-', device: '-' },
    solar: { current: '-', power: '-', today: '-', peak: '-' },
    battery: { current: '-', soc: '-', backupMins: 0 },
    backup: { available: '-', load: '-', remaining: '-' },
  };

  installedCapacity = {
    rectifierCapacity: '-',
    batteryCapacity: '-',
    backupDuration: '-',
    solarCapacity: '-',
    generatorRating: '-',
    dcBusVoltage: '-',
  };

  packetDeviceInfo = {
    deviceType: '-',
    manufacturer: '-',
    model: '-',
    batteryStatus: '-',
    batteryRemainingPercent: '-',
    gensetAvailable: '-',
    gensetRunning: '-',
    gensetStartFailure: '-',
    gensetControlMode: '-',
    humidity: '-',
    temperature: '-',
  };

  chartOptions: LineChartOptions;
  private readonly hourlySolarKw = new Map<number, number>();
  private readonly hourlySolarVoltage = new Map<number, number>();
  private readonly destroy$ = new Subject<void>();

  get installedCapacityItems(): Array<{ label: string; value: string }> {
    return [
      { label: 'Rectifier Capacity', value: this.installedCapacity.rectifierCapacity },
      { label: 'Battery Capacity', value: this.installedCapacity.batteryCapacity },
      { label: 'Backup Duration', value: this.installedCapacity.backupDuration },
      { label: 'Solar Capacity', value: this.installedCapacity.solarCapacity },
      { label: 'Generator Rating', value: this.installedCapacity.generatorRating },
      { label: 'DC Bus Voltage', value: this.installedCapacity.dcBusVoltage },
    ];
  }

  constructor(
    private signalrService: SignalrService,
    private toastService: ToastService,
  ) {
    this.chartOptions = this.initChart();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
