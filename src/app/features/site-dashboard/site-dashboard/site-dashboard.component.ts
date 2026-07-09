import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { SignalrService, TenantService } from '@app/core';
import { LineChartOptions } from '../../../shared/components/chart-components';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DecodedPayload, DeviceDataEvent } from '../../../core/constants/device-message.model';

interface TenantCard {
  id: number;
  name: string;
  meta: string;
  status: string;
  statusClass: string;
  load: string;
  current: string;
  voltage: string;
  today: string;
  allocation: number;
}

@Component({
  selector: 'app-site-dashboard',
  standalone: false,
  templateUrl: './site-dashboard.component.html',
  styleUrl: './site-dashboard.component.css'
})
export class SiteDashboardComponent implements OnInit, OnChanges, OnDestroy {
  solarChartOptions: LineChartOptions;
  @Input() deviceDetails: any = null;
  isLoadingDevice = false;
  isOperational = false;
  activeAlarmCount = 0;
  selectedDeviceDetails: any = null;
  lastPacketAt: string | null = null;
  peakSolarPowerKw = 0;

  tenantCards: TenantCard[] = [];
  private tenantNameById = new Map<number, string>();

  liveData = {
    grid: { voltage: '-', status: '-', device: '-' },
    solar: { current: '-', power: '-', today: '-', peak: '-' },
    battery: { current: '-', soc: '-', backupMins: 0 },
    backup: { available: '-', load: '-', remaining: '-' },
  };

  detailCards = {
    gridCp: {
      voltageL1: '-',
      voltageL2: '-',
      voltageL3: '-',
      frequency: '-',
      currentDraw: '-',
      power: '-',
    },
    rectifier: {
      outputVoltage: '-',
      outputCurrent: '-',
      outputPower: '-',
      efficiency: '-',
      dcBus: '-',
    },
    batteryBank: {
      stateOfCharge: '-',
      voltage: '-',
      current: '-',
      capacity: '-',
      backupTime: '-',
      temp: '-',
    },
    solarPv: {
      dcVoltage: '-',
      dcCurrent: '-',
      powerOutput: '-',
      irradiance: '-',
    },
    generator: {
      model: '-',
      fuelLevel: '-',
      runHours: '-',
      oilPressure: '-',
      coolantTemp: '-',
    },
    activeAlarms: {
      title: '-',
      status: '-',
    },
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

  private readonly destroy$ = new Subject<void>();

  constructor(
    private signalrService: SignalrService,
    private tenantService: TenantService,
  ) {
    this.solarChartOptions = this.initSolarChart();
  }

  ngOnInit(): void {
    this.loadTenantDirectory();
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
      return;
    }

    this.selectedDeviceDetails = details;
    this.isOperational = false;
    this.activeAlarmCount = 0;
    this.lastPacketAt = null;
    this.packetDeviceInfo = {
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
    this.detailCards = {
      gridCp: {
        voltageL1: '-',
        voltageL2: '-',
        voltageL3: '-',
        frequency: '-',
        currentDraw: '-',
        power: '-',
      },
      rectifier: {
        outputVoltage: '-',
        outputCurrent: '-',
        outputPower: '-',
        efficiency: '-',
        dcBus: '-',
      },
      batteryBank: {
        stateOfCharge: '-',
        voltage: '-',
        current: '-',
        capacity: '-',
        backupTime: '-',
        temp: '-',
      },
      solarPv: {
        dcVoltage: '-',
        dcCurrent: '-',
        powerOutput: '-',
        irradiance: '-',
      },
      generator: {
        model: '-',
        fuelLevel: '-',
        runHours: '-',
        oilPressure: '-',
        coolantTemp: '-',
      },
      activeAlarms: {
        title: '-',
        status: '-',
      },
    };
    this.tenantCards = this.buildTenantCards(details);
    this.liveData.grid.device = this.selectedDeviceDetails?.code || this.selectedDeviceDetails?.name || '-';
  }

  getTenantAccentClass(index: number): string {
    const accentClasses = ['accent-jazz', 'accent-zong', 'accent-telenor', 'accent-ufone'];
    return accentClasses[index % accentClasses.length];
  }

  private initializeRealtimeStream(): void {
    this.signalrService.onDeviceData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event : DeviceDataEvent | null) => {
        if (!event || !this.selectedDeviceDetails?.rmsSubscribeTopic) {
          return;
        }

        if (!this.isPacketForSelectedTopic(event)) {
          return;
        }

        console.log('Received relevant device data packet:', event);
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
    const payload: DecodedPayload = event.decodedPayload;
    const portalReceiveTime = payload?.portalReceiveTime ?? null;

    const lineAVoltage = payload.lineAVoltage ?? null;
    const solarCurrent = payload.solarCurrent ?? null;
    const solarPowerW = payload.solarPowerW ?? null;
    const solarEnergyTodayWh = payload.solarEnergyTodayWh ?? null;
    const batteryCurrent = payload.batteryCurrent ?? null;
    const batteryRemainingPercent = payload.batteryRemainingPercent ?? null;
    const batteryBackupTimeMin = payload.batteryBackupTimeMin ?? null;
    const dcLoadPowerW = payload.dcLoadPowerW ?? null;
    const temperature =
      payload.batteryTemperature ??
      payload.ambientTemperature1 ??
      payload.ambientTemperature2 ??
      payload.rectifierMaxTemperature ??
      null;

    const solarPowerKw = solarPowerW !== null ? solarPowerW / 1000 : null;
    if (solarPowerKw !== null && solarPowerKw > this.peakSolarPowerKw) {
      this.peakSolarPowerKw = solarPowerKw;
    }

    this.packetDeviceInfo = {
      deviceType: payload?.deviceType ? String(payload.deviceType) : '-',
      manufacturer: payload?.manufacturer ? String(payload.manufacturer) : '-',
      model: payload?.model ? String(payload.model) : '-',
      batteryStatus: payload?.batteryStatus ? String(payload.batteryStatus) : '-',
      batteryRemainingPercent: payload?.batteryRemainingPercent ? String(payload.batteryRemainingPercent) : '-',
      gensetAvailable: payload?.gensetAvailable ? String(payload.gensetAvailable) : '-',
      gensetRunning: payload?.gensetRunning ? String(payload.gensetRunning) : '-',
      gensetStartFailure: payload?.gensetStartFailure ? String(payload.gensetStartFailure) : '-',
      gensetControlMode: payload?.gensetControlMode ? String(payload.gensetControlMode) : '-',
      humidity: payload?.humidity !== null && payload?.humidity !== undefined ? String(payload.humidity) : '-',
      temperature: temperature !== null ? `${temperature}°C` : '-',
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

    const activeAlarmCount = payload.activeAlarmCount ?? 0;
    this.activeAlarmCount = activeAlarmCount;

    const alarmTitle = activeAlarmCount > 0
      ? `Alarm ${payload.alarm1Code ?? '-'}`
      : 'No active alarms';
    const alarmStatus = activeAlarmCount > 0
      ? String(payload.alarm1Level ?? 'Active')
      : 'Normal';

    this.detailCards = {
      gridCp: {
        voltageL1: this.formatMetric(payload.lineAVoltage, 'V', 1),
        voltageL2: this.formatMetric(payload.lineBVoltage, 'V', 1, [65535]),
        voltageL3: this.formatMetric(payload.lineCVoltage, 'V', 1, [65535]),
        frequency: this.formatMetric(payload.acFrequency, 'Hz', 1),
        currentDraw: this.formatMetric(payload.dcLoadCurrent, 'A', 1, [32767]),
        power: this.formatMetric(payload.totalAcInputPowerW, 'kW', 2, [], 1000),
      },
      rectifier: {
        outputVoltage: this.formatMetric(payload.dcBusVoltage, 'V', 1),
        outputCurrent: this.formatMetric(payload.rectifierTotalCurrent, 'A', 1),
        outputPower: this.formatMetric(payload.rectifierTotalDcPowerW, 'kW', 2, [], 1000),
        efficiency: this.calculateEfficiency(payload.rectifierTotalDcPowerW, payload.totalAcInputPowerW),
        dcBus: this.formatMetric(payload.dcBusVoltage, 'V', 1),
      },
      batteryBank: {
        stateOfCharge: this.formatMetric(payload.batteryRemainingPercent, '%', 0),
        voltage: this.formatMetric(payload.batteryVoltage, 'V', 1),
        current: this.formatMetric(payload.batteryCurrent, 'A', 1),
        capacity: this.formatMetric(payload.batteryRemainingCapacityAh, 'Ah', 1),
        backupTime: this.formatMinutesAsDuration(payload.batteryBackupTimeMin ?? null),
        temp: this.formatMetric(payload.batteryTemperature, '°C', 1),
      },
      solarPv: {
        dcVoltage: this.formatMetric(payload.solarVoltage, 'V', 1),
        dcCurrent: this.formatMetric(payload.solarCurrent, 'A', 1),
        powerOutput: this.formatMetric(payload.solarPowerW, 'kW', 2, [], 1000),
        irradiance: '-',
      },
      generator: {
        model: this.selectedDeviceDetails?.model || this.packetDeviceInfo.model || '-',
        fuelLevel: this.formatMetric(payload.fuelLevelPercent, '%', 0),
        runHours: this.formatMetric(payload.gensetRunHours, 'h', 0),
        oilPressure: '-',
        coolantTemp: this.formatMetric(payload.ambientTemperature2, '°C', 1),
      },
      activeAlarms: {
        title: alarmTitle,
        status: alarmStatus,
      },
    };

    const tenantLoads = [
      this.toSafeNumber(payload.tenant1LoadW, [0xFFFFFFFF]),
      this.toSafeNumber(payload.tenant2LoadW, [0xFFFFFFFF]),
      this.toSafeNumber(payload.tenant3LoadW, [0xFFFFFFFF]),
      this.toSafeNumber(payload.tenant4LoadW, [0xFFFFFFFF]),
    ];
    const tenantCurrents = [
      this.toSafeNumber(payload.tenant1Current, [0x7FFF]),
      this.toSafeNumber(payload.tenant2Current, [0x7FFF]),
      this.toSafeNumber(payload.tenant3Current, [0x7FFF]),
      this.toSafeNumber(payload.tenant4Current, [0x7FFF]),
    ];
    const totalTenantLoad = tenantLoads.reduce<number>((acc, value) => acc + Number(value ?? 0), 0);
    const dcBusVoltage = this.toSafeNumber(payload.dcBusVoltage, [0xFFFF]);

    this.tenantCards = this.tenantCards.map((card, index) => {
      const load = tenantLoads[index];
      const current = tenantCurrents[index];
      const allocation = totalTenantLoad > 0 && load !== null ? Math.round((load / totalTenantLoad) * 100) : 0;
      return {
        ...card,
        status: load !== null && load > 0 ? 'ACTIVE' : 'STANDBY',
        statusClass: load !== null && load > 0 ? 'status-active' : 'status-warn',
        load: load !== null ? `${(load / 1000).toFixed(2)} kW` : '-',
        current: current !== null ? `${current.toFixed(1)} A` : '-',
        voltage: dcBusVoltage !== null ? `${dcBusVoltage.toFixed(1)} V` : '-',
        today: '-',
        allocation,
      };
    });

    this.lastPacketAt = portalReceiveTime ? String(portalReceiveTime) : null;
  }

  private loadTenantDirectory(): void {
    this.tenantService.getTenants()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          const tenants = response?.data?.pageData ?? [];
          this.tenantNameById.clear();

          for (const item of tenants) {
            const id = Number(item?.id ?? item?.tenantId);
            if (!Number.isFinite(id) || id <= 0) {
              continue;
            }

            const name = String(item?.name ?? item?.tenantName ?? `Tenant ${id}`).trim();
            this.tenantNameById.set(id, name || `Tenant ${id}`);
          }

          if (this.selectedDeviceDetails) {
            this.tenantCards = this.buildTenantCards(this.selectedDeviceDetails);
          }
        },
        error: () => {
          this.tenantNameById.clear();
        }
      });
  }

  private buildTenantCards(details: any): TenantCard[] {
    const tenantIds = this.extractDeviceTenantIds(details);
    return tenantIds.map((id) => ({
      id,
      name: this.tenantNameById.get(id) ?? `Tenant ${id}`,
      meta: `Tenant ID ${id}`,
      status: 'STANDBY',
      statusClass: 'status-warn',
      load: '-',
      current: '-',
      voltage: '-',
      today: '-',
      allocation: 0,
    }));
  }

  private extractDeviceTenantIds(details: any): number[] {
    const raw = details?.DeviceTenants ?? details?.deviceTenants ?? details?.tenantIds;
    if (!Array.isArray(raw)) {
      return [];
    }

    return raw
      .map((value: any) => Number(value?.id ?? value?.tenantId ?? value))
      .filter((value: number) => Number.isFinite(value) && value > 0);
  }

  private toSafeNumber(value: number | null | undefined, invalidValues: number[] = []): number | null {
    if (value === null || value === undefined || !Number.isFinite(value) || invalidValues.includes(value)) {
      return null;
    }
    return value;
  }

  private formatMetric(
    value: number | null | undefined,
    unit: string,
    decimals = 1,
    invalidValues: number[] = [],
    scale = 1,
  ): string {
    if (value === null || value === undefined || !Number.isFinite(value) || invalidValues.includes(value)) {
      return '-';
    }

    const scaled = value / scale;
    const fixed = scaled.toFixed(decimals);
    return `${Number(fixed)}${unit}`;
  }

  private calculateEfficiency(outputPowerW: number | null | undefined, inputPowerW: number | null | undefined): string {
    if (
      outputPowerW === null ||
      outputPowerW === undefined ||
      inputPowerW === null ||
      inputPowerW === undefined ||
      inputPowerW <= 0
    ) {
      return '-';
    }

    const efficiency = (outputPowerW / inputPowerW) * 100;
    return `${efficiency.toFixed(1)}%`;
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

  initSolarChart(): LineChartOptions {
    return {
      xAxisData: [],
      seriesData: [
        {
          name: 'Solar Output (kW)',
          data: [],
          color: '#f59e0b'
        }
      ],
      height: '300px',
      showLegend: true,
      smooth: true,
      showSymbol: false
    };
  }
}
