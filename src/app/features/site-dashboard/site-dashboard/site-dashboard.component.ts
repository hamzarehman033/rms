import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { SignalrService } from '@app/core';
import { LineChartOptions } from '../../../shared/components/chart-components';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DecodedPayload, DeviceDataEvent } from '../../../core/constants/device-message.model';

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
  selectedDeviceDetails: any = null;
  lastPacketAt: string | null = null;
  peakSolarPowerKw = 0;

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
  ) {
    this.solarChartOptions = this.initSolarChart();
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
      return;
    }

    this.selectedDeviceDetails = details;
    this.isOperational = false;
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
    this.liveData.grid.device = this.selectedDeviceDetails?.code || this.selectedDeviceDetails?.name || '-';
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

    this.lastPacketAt = portalReceiveTime ? String(portalReceiveTime) : null;
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
