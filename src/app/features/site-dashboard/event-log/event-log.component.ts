import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { SignalrService } from '@app/core';
import { LineChartOptions } from '../../../shared/components/chart-components';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ALARM_CODE_LABELS, DecodedPayload, DeviceDataEvent } from '../../../core/constants/device-message.model';

type AlarmSeverity = 'Critical' | 'Major' | 'Minor' | 'Warning' | 'None';

interface AlarmRow {
  descriptionWithCode: string;
  severity: AlarmSeverity;
  source: string;
  timestamp: string;
  status: 'Active' | 'Cleared';
}

@Component({
  selector: 'app-event-log',
  standalone: false,
  templateUrl: './event-log.component.html',
  styleUrl: './event-log.component.css',
})
export class EventLogComponent implements OnInit, OnChanges, OnDestroy {
  solarChartOptions: LineChartOptions;
  isOperational = false;
  @Input() deviceDetails: any = null;
  @Input() isLoadingDevice = false;
  selectedDeviceDetails: any = null;
  lastPacketAt: string | null = null;
  peakSolarPowerKw = 0;
  criticalAlarmCount = 0;
  majorAlarmCount = 0;
  minorAlarmCount = 0;
  clearedAlarmCount = 0;
  alarmRows: AlarmRow[] = [];

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
    this.criticalAlarmCount = 0;
    this.majorAlarmCount = 0;
    this.minorAlarmCount = 0;
    this.clearedAlarmCount = 0;
    this.alarmRows = [];
    this.liveData.grid.device =
      this.selectedDeviceDetails?.code ||
      this.selectedDeviceDetails?.name ||
      '-';
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

        console.log('Received relevant device data packet:', event);
        this.applyPacketToLiveData(event);
      });
  }

  private isPacketForSelectedTopic(event: DeviceDataEvent): boolean {
    const selectedTopic = this.normalizeTopic(
      this.selectedDeviceDetails?.rmsSubscribeTopic,
    );
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

    const solarPowerKw = solarPowerW !== null ? solarPowerW / 1000 : null;
    if (solarPowerKw !== null && solarPowerKw > this.peakSolarPowerKw) {
      this.peakSolarPowerKw = solarPowerKw;
    }

    this.packetDeviceInfo = {
      deviceType: payload?.deviceType ? String(payload.deviceType) : '-',
      manufacturer: payload?.manufacturer ? String(payload.manufacturer) : '-',
      model: payload?.model ? String(payload.model) : '-',
      batteryStatus: payload?.batteryStatus
        ? String(payload.batteryStatus)
        : '-',
      batteryRemainingPercent: payload?.batteryRemainingPercent
        ? String(payload.batteryRemainingPercent)
        : '-',
      gensetAvailable: payload?.gensetAvailable
        ? String(payload.gensetAvailable)
        : '-',
      gensetRunning: payload?.gensetRunning
        ? String(payload.gensetRunning)
        : '-',
      gensetStartFailure: payload?.gensetStartFailure
        ? String(payload.gensetStartFailure)
        : '-',
      gensetControlMode: payload?.gensetControlMode
        ? String(payload.gensetControlMode)
        : '-',
      humidity: payload?.humidity ? String(payload.humidity) : '-',
      temperature: '',
    };

    this.liveData = {
      grid: {
        device: String(
          payload.deviceId ??
            this.selectedDeviceDetails?.code ??
            this.selectedDeviceDetails?.name ??
            '-',
        ),
        voltage: lineAVoltage !== null ? `${lineAVoltage}V` : '-',
        status: String(payload.mainsAvailable ?? payload.systemStatus ?? '-'),
      },
      solar: {
        current: solarCurrent !== null ? `${solarCurrent}A` : '-',
        power: solarPowerKw !== null ? `${solarPowerKw.toFixed(2)} kW` : '-',
        today:
          solarEnergyTodayWh !== null
            ? `${(solarEnergyTodayWh / 1000).toFixed(2)} kWh`
            : '-',
        peak:
          this.peakSolarPowerKw > 0
            ? `${this.peakSolarPowerKw.toFixed(2)} kW`
            : '-',
      },
      battery: {
        current: batteryCurrent !== null ? `${batteryCurrent}A` : '-',
        soc:
          batteryRemainingPercent !== null
            ? `${batteryRemainingPercent}%`
            : '-',
        backupMins: batteryBackupTimeMin ?? 0,
      },
      backup: {
        available: this.formatMinutesAsDuration(batteryBackupTimeMin),
        load:
          dcLoadPowerW !== null
            ? `${(dcLoadPowerW / 1000).toFixed(2)} kW`
            : '-',
        remaining: this.formatMinutesAsDuration(batteryBackupTimeMin),
      },
    };

    this.captureAlarmRows(payload, event);

    this.lastPacketAt = portalReceiveTime ? String(portalReceiveTime) : null;
  }

  private captureAlarmRows(payload: DecodedPayload, event: DeviceDataEvent): void {
    const source = String(
      this.selectedDeviceDetails?.name ??
      this.selectedDeviceDetails?.code ??
      payload.deviceId ??
      '-',
    );
    const timestamp = String(payload.portalReceiveTime ?? event.receivedAt ?? new Date().toISOString());
    const alarmSlots = [
      this.createAlarmSlot(payload.alarm1Code, payload.alarm1Level),
      this.createAlarmSlot(payload.alarm2Code, payload.alarm2Level),
      this.createAlarmSlot(payload.alarm3Code, payload.alarm3Level),
      this.createAlarmSlot(payload.alarm4Code, payload.alarm4Level),
      this.createAlarmSlot(payload.alarm5Code, payload.alarm5Level),
      this.createAlarmSlot(payload.alarm6Code, payload.alarm6Level),
    ];

    let critical = 0;
    let major = 0;
    let minor = 0;
    let cleared = 0;

    const rows: AlarmRow[] = alarmSlots.map((slot) => {
      const isCleared = slot.severity === 'None' || slot.code === 65535 || slot.description === 'No alarm in this slot';
      const status: 'Active' | 'Cleared' = isCleared ? 'Cleared' : 'Active';

      if (!isCleared) {
        if (slot.severity === 'Critical') {
          critical += 1;
        } else if (slot.severity === 'Major') {
          major += 1;
        } else if (slot.severity === 'Minor') {
          minor += 1;
        }
      } else {
        cleared += 1;
      }

      const codeText = slot.code === null ? '-' : String(slot.code);

      return {
        descriptionWithCode: `${slot.description} (${codeText})`,
        severity: slot.severity,
        source,
        timestamp,
        status,
      };
    });

    this.criticalAlarmCount = critical;
    this.majorAlarmCount = major;
    this.minorAlarmCount = minor;
    this.clearedAlarmCount = cleared;
    this.alarmRows = [...rows, ...this.alarmRows].slice(0, 100);
  }

  private createAlarmSlot(description: string | undefined, level: string | null | undefined): {
    code: number | null;
    description: string;
    severity: AlarmSeverity;
  } {
    const normalizedDescription = String(description ?? 'No alarm in this slot');

    return {
      code: this.resolveAlarmCode(normalizedDescription),
      description: normalizedDescription,
      severity: this.normalizeSeverity(level),
    };
  }

  private resolveAlarmCode(description: string): number | null {
    const entries = Object.entries(ALARM_CODE_LABELS);
    for (const [codeText, label] of entries) {
      if (label === description) {
        return Number(codeText);
      }
    }
    return null;
  }

  private normalizeSeverity(level: string | null | undefined): AlarmSeverity {
    if (level === 'Critical' || level === 'Major' || level === 'Minor' || level === 'Warning') {
      return level;
    }
    return 'None';
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
          color: '#f59e0b',
        },
      ],
      height: '300px',
      showLegend: true,
      smooth: true,
      showSymbol: false,
    };
  }
}
