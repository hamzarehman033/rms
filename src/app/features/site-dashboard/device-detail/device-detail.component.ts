import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { SignalrService, ToastService } from '@app/core';
import { LineChartOptions } from '../../../shared/components/chart-components';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DecodedPayload, DeviceDataEvent } from '../../../core/constants/device-message.model';

@Component({
  selector: 'app-device-detail',
  standalone: false,
  templateUrl: './device-detail.component.html',
  styleUrl: './device-detail.component.css'
})
export class DeviceDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Input() deviceDetails: any = null;
  isLoadingDevice = false;
  isOperational = false;
  selectedDeviceDetails: any = null;
  lastPacketAt: string | null = null;
  peakSolarPowerKw = 0;
  selectedSection: string = 'live-data';

  dockItems1 = [
    { id: 'live-data', label: 'Live Data', icon: 'pi pi-bolt', command: () => this.selectSection('live-data') },
    { id: 'alerts', label: 'Alerts', icon: 'pi pi-bell', command: () => this.selectSection('alerts') },
    { id: 'devices', label: 'Devices', icon: 'pi pi-server', command: () => this.selectSection('devices') },
    { id: 'charts', label: 'Charts', icon: 'pi pi-chart-line', command: () => this.selectSection('charts') },
    { id: 'specs', label: 'Specs', icon: 'pi pi-info-circle', command: () => this.selectSection('specs') },
  ];
  // Alerts
  alerts = [
    { id: 1, icon: 'pi pi-exclamation-circle-fill', title: 'Solar Inverter Voltage Warning', device: 'DV-003', time: '42 min ago', severity: 'major' },
    { id: 2, icon: 'pi pi-info-circle-fill', title: 'Firmware Update Available', device: 'DV-001', time: '5 hrs ago', severity: 'info' }
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
    this.initializeRealtimeStream();
    this.syncDeviceSelection(this.deviceDetails);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('deviceDetails' in changes) {
      this.syncDeviceSelection(this.deviceDetails);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private syncDeviceSelection(details: any): void {
    if (!details) {
      this.isOperational = false;
      this.selectedDeviceDetails = null;
      this.resetChartSeries();
      this.resetInstalledCapacity();
      return;
    }

    this.selectedDeviceDetails = details;
    this.isOperational = false;
    this.lastPacketAt = null;
    this.resetInstalledCapacity();
    this.liveData.grid.device = this.selectedDeviceDetails?.code || this.selectedDeviceDetails?.name || '-';
    this.resetChartSeries();
    this.subscribeToSelectedDevice();
  }

  selectSection(section: string) {
    this.selectedSection = section;
  }

  private initializeRealtimeStream(): void {
    this.signalrService.onDeviceData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: DeviceDataEvent | null) => {
        if (!event || !this.selectedDeviceDetails) {
          return;
        }

        if (!this.isPacketForSelectedDevice(event) && !this.isPacketForSelectedTopic(event)) {
          return;
        }

        this.applyPacketToLiveData(event);
      });
  }

  private isPacketForSelectedTopic(event: DeviceDataEvent): boolean {
    const selectedTopic = this.normalizeTopic(this.selectedDeviceDetails?.rmsSubscribeTopic);
    const packetTopic = this.normalizeTopic(event.topic);
    return !!selectedTopic && !!packetTopic && selectedTopic === packetTopic;
  }

  private normalizeTopic(topic?: string): string {
    return (topic ?? '').trim().toLowerCase();
  }

  private isPacketForSelectedDevice(event: DeviceDataEvent): boolean {
    const selectedDeviceId = this.toNumericId(this.selectedDeviceDetails?.id);
    const packetDeviceId = this.toNumericId(event.deviceId);

    if (selectedDeviceId === null || packetDeviceId === null) {
      return false;
    }

    return selectedDeviceId === packetDeviceId;
  }

  private applyPacketToLiveData(event: DeviceDataEvent): void {
    this.isOperational = true;
    const payload: DecodedPayload = (event.decodedPayload ?? {}) as DecodedPayload;
    const portalReceiveTime = payload?.portalReceiveTime ?? null;

    const lineAVoltage = payload.lineAVoltage;
    const solarCurrent = payload.solarCurrent;
    const solarPowerW = payload.solarPowerW;
    const solarEnergyTodayWh = payload.solarEnergyTodayWh;
    const batteryCurrent = payload.batteryCurrent;
    const batteryRemainingPercent = payload.batteryRemainingPercent;
    const batteryBackupTimeMin = payload.batteryBackupTimeMin;
    const dcLoadPowerW = payload.dcLoadPowerW;
    const dcBusVoltage = payload.dcBusVoltage;
    const rectifierTotalDcPowerW = payload.rectifierTotalDcPowerW;
    const batteryTotalCapacityAh = payload.batteryTotalCapacityAh;
    const generatorRatingKw = payload['gensetRatingKw'] ?? payload['generatorRatingKw'] ?? payload['gensetCapacityKw'];

    const solarPowerKw = solarPowerW !== null ? solarPowerW / 1000 : null;
    if (solarPowerKw !== null && solarPowerKw > this.peakSolarPowerKw) {
      this.peakSolarPowerKw = solarPowerKw;
    }

    this.updateChartSeries(payload, solarPowerKw);

    this.packetDeviceInfo = {
      deviceType: payload?.deviceType ? String(payload.deviceType) : '-',
      manufacturer: payload?.manufacturer ? String(payload.manufacturer) : '-',
      model: payload?.model ? String(payload.model) : '-',
      batteryStatus: payload?.batteryStatus ? String(payload.batteryStatus) : '-',
      batteryRemainingPercent: payload?.batteryRemainingPercent !== undefined && payload?.batteryRemainingPercent !== null ? String(payload.batteryRemainingPercent) : '-',
      gensetAvailable: payload?.gensetAvailable ? String(payload.gensetAvailable) : '-',
      gensetRunning: payload?.gensetRunning ? String(payload.gensetRunning) : '-',
      gensetStartFailure: payload?.gensetStartFailure ? String(payload.gensetStartFailure) : '-',
      gensetControlMode: payload?.gensetControlMode ? String(payload.gensetControlMode) : '-',
      humidity: payload?.humidity !== undefined && payload?.humidity !== null ? String(payload.humidity) : '-',
      temperature: payload?.ambientTemperature1 !== undefined && payload?.ambientTemperature1 !== null ? String(payload.ambientTemperature1) : '-',
    };

    this.liveData = {
      grid: {
        device: String(payload.deviceId ?? this.selectedDeviceDetails?.code ?? this.selectedDeviceDetails?.name ?? '-'),
        voltage: lineAVoltage !== null ? `${lineAVoltage}V` : '-',
        status: String(payload.mainsAvailable ?? payload.systemStatus ?? '-'),
      },
      solar: {
        current: solarCurrent !== null ? `${solarCurrent}A` : '-',
        power: solarPowerKw !== null ? `${solarPowerKw.toFixed(2)} kW` : '-',
        today: solarEnergyTodayWh !== null ? `${(solarEnergyTodayWh / 1000).toFixed(2)} kWh` : '-',
        peak: this.peakSolarPowerKw > 0 ? `${this.peakSolarPowerKw.toFixed(2)} kW` : '-',
      },
      battery: {
        current: batteryCurrent !== null ? `${batteryCurrent}A` : '-',
        soc: batteryRemainingPercent !== null ? `${batteryRemainingPercent}%` : '-',
        backupMins: batteryBackupTimeMin ?? 0,
      },
      backup: {
        available: this.formatMinutesAsDuration(batteryBackupTimeMin),
        load: dcLoadPowerW !== null ? `${(dcLoadPowerW / 1000).toFixed(2)} kW` : '-',
        remaining: this.formatMinutesAsDuration(batteryBackupTimeMin),
      },
    };

    this.installedCapacity = {
      rectifierCapacity: this.formatAsKw(rectifierTotalDcPowerW),
      batteryCapacity: this.formatAsAh(batteryTotalCapacityAh),
      backupDuration: this.formatMinutesAsDuration(batteryBackupTimeMin),
      solarCapacity: this.formatAsKw(solarPowerW),
      generatorRating: this.formatGeneratorRating(generatorRatingKw, payload.gensetAvailable),
      dcBusVoltage: this.formatAsVolt(dcBusVoltage),
    };

    this.lastPacketAt = portalReceiveTime ? String(portalReceiveTime) : null;
  }

  private updateChartSeries(payload: DecodedPayload, solarPowerKw: number | null): void {
    const solarVoltage = payload.solarVoltage;
    if (solarPowerKw === null && solarVoltage === null) {
      return;
    }

    const packetDate = this.parseDateCandidate(payload?.portalReceiveTime);
    if (!packetDate) {
      return;
    }

    const hourBucket = this.toHourStart(packetDate).getTime();
    if (solarPowerKw !== null) {
      this.hourlySolarKw.set(hourBucket, Number(solarPowerKw.toFixed(2)));
    }
    if (solarVoltage !== null) {
      this.hourlySolarVoltage.set(hourBucket, Number(solarVoltage.toFixed(2)));
    }

    this.patchChartOptions();
  }

  private resetChartSeries(): void {
    this.hourlySolarKw.clear();
    this.hourlySolarVoltage.clear();
    this.patchChartOptions();
  }

  private patchChartOptions(): void {
   
    this.chartOptions = {
      xAxisData: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      seriesData: [
        {
          name: 'Solar Output (kW)',
          data: [0.2, 1.5, 4.2, 6.1, 4.8, 1.2, 0.1],
          color: '#f59e0b'
        },
        {
          name: 'System Load (kW)',
          data: [4.2, 4.0, 4.5, 5.2, 5.5, 5.0, 4.8],
          color: '#38bdf8'
        },
        {
          name: 'Battery SoC (%)',
          data: [95, 97, 99, 100, 100, 98, 96],
          color: '#34d399'
        }
      ]
    };
  }

  private parseDateCandidate(value: unknown): Date | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const parsed = new Date(String(value));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private toHourStart(date: Date): Date {
    const normalized = new Date(date);
    normalized.setMinutes(0, 0, 0);
    return normalized;
  }



  private formatMinutesAsDuration(minutes: number | null): string {
    if (minutes === null || minutes <= 0) {
      return '-';
    }

    const rounded = Math.round(minutes);
    const hours = Math.floor(rounded / 60);
    const mins = rounded % 60;

    if (hours <= 0) {
      return `${mins}m`;
    }

    if (mins <= 0) {
      return `${hours}h`;
    }

    return `${hours}h ${mins}m`;
  }

  private subscribeToSelectedDevice(): void {
    const numericId = this.toNumericId(this.selectedDeviceDetails?.id);
    if (numericId === null) {
      return;
    }

    this.signalrService.subscribeToDevice(numericId).catch(() => {
      this.toastService.showError('Failed to subscribe live socket for selected device');
    });
  }

  private toNumericId(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  }

  private resetInstalledCapacity(): void {
    this.installedCapacity = {
      rectifierCapacity: '-',
      batteryCapacity: '-',
      backupDuration: '-',
      solarCapacity: '-',
      generatorRating: '-',
      dcBusVoltage: '-',
    };
  }

  private formatAsKw(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return String(value);
    }

    return `${(numeric / 1000).toFixed(2)} kW`;
  }

  private formatAsAh(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return String(value);
    }

    return `${numeric.toFixed(0)} Ah`;
  }

  private formatAsVolt(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return String(value);
    }

    return `${numeric.toFixed(1)} V`;
  }

  private formatGeneratorRating(value: unknown, gensetAvailable: unknown): string {
    if (value !== null && value !== undefined && value !== '') {
      const numeric = Number(value);
      if (Number.isFinite(numeric)) {
        return `${numeric.toFixed(2)} kW`;
      }
      return String(value);
    }

    if (gensetAvailable !== null && gensetAvailable !== undefined && String(gensetAvailable).trim() !== '') {
      return String(gensetAvailable);
    }

    return '-';
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
