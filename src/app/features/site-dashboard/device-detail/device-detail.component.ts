import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DevicesService, SignalrService, ToastService } from '@app/core';
import { LineChartOptions } from '../../../shared/components/chart-components';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { DecodedPayload, DeviceDataEvent } from '../../../core/constants/device-message.model';

@Component({
  selector: 'app-device-detail',
  standalone: false,
  templateUrl: './device-detail.component.html',
  styleUrl: './device-detail.component.css'
})
export class DeviceDetailComponent implements OnInit, OnDestroy {
  deviceId: string | null = null;
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

  constructor(
    private route: ActivatedRoute,
    private devicesService: DevicesService,
    private signalrService: SignalrService,
    private toastService: ToastService,
  ) {
    this.chartOptions = this.initChart();
  }

  ngOnInit(): void {
    this.initializeRealtimeStream();

    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((id) => {
        if (!id) {
          this.deviceId = null;
          this.isOperational = false;
          this.selectedDeviceDetails = null;
          this.resetChartSeries();
          return;
        }

        this.deviceId = id;
        this.loadDeviceDetails(id);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectSection(section: string) {
    this.selectedSection = section;
  }

  private loadDeviceDetails(id: string): void {
    this.isLoadingDevice = true;
    this.devicesService.getDeviceById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          const payload = response?.data ?? response;
          this.selectedDeviceDetails = payload ?? null;
          this.isOperational = false;
          this.lastPacketAt = null;
          this.liveData.grid.device = this.selectedDeviceDetails?.code || this.selectedDeviceDetails?.name || '-';
          this.resetChartSeries();
          this.isLoadingDevice = false;
        },
        error: () => {
          this.isOperational = false;
          this.selectedDeviceDetails = null;
          this.isLoadingDevice = false;
          this.toastService.showError('Failed to load device details');
        }
      });
  }

  private initializeRealtimeStream(): void {
    this.signalrService.onDeviceData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: DeviceDataEvent | null) => {
        if (!event || !this.selectedDeviceDetails?.rmsSubscribeTopic) {
          return;
        }

        if (!this.isPacketForSelectedTopic(event)) {
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
