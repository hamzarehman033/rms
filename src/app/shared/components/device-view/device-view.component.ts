import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DevicesService, SignalrService, ToastService } from '@app/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { DecodedPayload, DeviceDataEvent } from '../../../core/constants/device-message.model';


@Component({
  selector: 'app-device-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-view.component.html',
  styleUrl: './device-view.component.css',
})
export class DeviceViewComponent implements OnInit, OnDestroy {
  @Input() deviceId: string | number | null = null;

  // Popover state
  showPopover = false;
  popoverX = 0;
  popoverY = 0;
  selectedDeviceName = '';
  selectedDevice: any = null;
  selectedDeviceDetails: any = null;
  isLoadingDevice = false;
  isOperational = false;

  private selectedTopic: string | null = null;
  private readonly destroy$ = new Subject<void>();

  // Device data by ID/type
  devicesMap: { [key: string]: any } = {
    'tower': {
      name: 'Tower A-1',
      type: 'Communication Tower',
      id: 'DEV-2024-00147',
      status: '-',
      location: '-',
      firmware: '-',
      temperature: '-',
      power: '-',
      cpu: '-',
      uptime: '-',
      signal: '-',
      lastUpdated: '-',
      lineACurrent: '-',
      lineAVoltage: '-',
      lineBCurrent: '-',
      lineBVoltage: '-',
      lineCCurrent: '-',
      lineCVoltage: '-',
    },
    'generator': {
      name: 'Generator B-2',
      type: 'Backup Generator',
      id: 'GEN-2024-00201',
      status: '-',
      location: '-',
      firmware: '-',
      temperature: '-',
      power: '-',
      cpu: '-',
      uptime: '-',
      signal: '-',
      lastUpdated: '-',
      gensetAvailable: '-',
      gensetControlMode: '-',
      gensetRunHours: '-',
      gensetRunning: '-',
      gensetStartCount: '-',
      gensetStartFailure: '-',
    },
    'solar': {
      name: 'Solar Panel Array C-3',
      type: 'Solar Power System',
      id: 'SOL-2024-00302',
      status: '-',
      location: '-',
      firmware: '-',
      temperature: '-',
      power: '-',
      cpu: '-',
      uptime: '-',
      signal: '-',
      lastUpdated: '-',
      solarAvailable: '-',
      solarChargingHours: '-',
      solarControllerCommFail: '-',
      solarControllerCount: '-',
      solarCurrent: '-',
      solarEnergyTodayWh: '-',
      solarPowerW: '-',
      solarVoltage: '-',
    },
    'device1': {
      name: 'Sensors',
      type: 'IoT Controller',
      id: 'IOT-2024-00403',
      status: '-',
      location: '-',
      firmware: '-',
      temperature: '-',
      power: '-',
      cpu: '-',
      uptime: '-',
      signal: '-',
      lastUpdated: '-',
    },
    'computer': {
      name: 'Computer E-5',
      type: 'Control Station',
      id: 'CPU-2024-00504',
      status: '-',
      location: '-',
      firmware: '-',
      temperature: '-',
      power: '-',
      cpu: '-',
      uptime: '-',
      signal: '-',
      lastUpdated: '-',
    },
    'battery': {
      name: 'Battery F-6',
      type: 'Energy Storage System',
      id: 'BAT-2024-00605',
      status: '-',
      location: '-',
      firmware: '-',
      temperature: '-',
      power: '-',
      cpu: '-',
      uptime: '-',
      signal: '-',
      lastUpdated: '-',
      batteryBackupTimeMin: '-',
      batteryChargeDischargeKw: '-',
      batteryCurrent: '-',
      batteryRemainingCapacityAh: '-',
      batteryRemainingPercent: '-',
      batterySoh: '-',
      batteryStatus: '-',
      batteryTemperature: '-',
      batteryTotalCapacityAh: '-',
      batteryVoltage: '-',
    },
    'rectifier': {
      name: 'Rectifier G-7',
      type: 'Power Rectification Unit',
      id: 'REC-2024-00706',
      status: '-',
      location: '-',
      firmware: '-',
      temperature: '-',
      power: '-',
      cpu: '-',
      uptime: '-',
      signal: '-',
      lastUpdated: '-',
      rectifierAcFail: '-',
      rectifierCommCount: '-',
      rectifierInstalledCount: '-',
      rectifierMaxTemperature: '-',
      rectifierMissing: '-',
      rectifierTotalCurrent: '-',
      rectifierTotalDcPowerW: '-',
    }
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly devicesService: DevicesService,
    private readonly signalrService: SignalrService,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.initializeRealtimeStream();

    if (this.deviceId !== null && this.deviceId !== undefined && this.deviceId !== '') {
      this.loadDeviceDetails(String(this.deviceId));
      return;
    }

    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((id) => {
        if (!id) {
          return;
        }
        this.loadDeviceDetails(id);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showTooltip(event: MouseEvent, deviceId: string) {
    const device = this.devicesMap[deviceId];
    
    if (device) {
      this.selectedDeviceName = device.name;
      this.selectedDevice = device;
      
      // Position popover at click location with offset
      this.popoverX = event.clientX - 20;
      this.popoverY = event.clientY + 10;
      
      this.showPopover = true;
    }
  }

  private loadDeviceDetails(id: string): void {
    this.isLoadingDevice = true;
    this.devicesService.getDeviceById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          const payload = response?.data ?? response;
          this.selectedDeviceDetails = payload ?? null;
          this.selectedTopic = this.normalizeTopic(this.selectedDeviceDetails?.rmsSubscribeTopic);
          this.isLoadingDevice = false;
        },
        error: () => {
          this.selectedDeviceDetails = null;
          this.selectedTopic = null;
          this.isLoadingDevice = false;
          this.toastService.showError('Failed to load device for device view');
        }
      });
  }

  private initializeRealtimeStream(): void {
    this.signalrService.onDeviceData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: DeviceDataEvent | null) => {
        if (!event || !event.decodedPayload) {
          return;
        }

        if (!this.isPacketForCurrentDevice(event)) {
          return;
        }

        this.isOperational = true;
        console.log('Received device data event:', event);
        this.applyPacketToDevicesMap((event.decodedPayload ?? {}) as DecodedPayload);
      });
  }

  private isPacketForCurrentDevice(event: DeviceDataEvent): boolean {
    const packetTopic = this.normalizeTopic(event.topic);

    if (this.selectedTopic && packetTopic && this.selectedTopic === packetTopic) {
      return true;
    }

    const selectedId = this.selectedDeviceDetails?.id;
    return selectedId !== null && selectedId !== undefined && Number(event.deviceId) === Number(selectedId);
  }

  private normalizeTopic(topic?: string): string {
    return (topic ?? '').trim().toLowerCase();
  }

  private applyPacketToDevicesMap(payload: DecodedPayload): void {
    const updatedAt = this.toDisplayTime(payload?.portalReceiveTime);

    this.patchDevice('tower', {
      status: this.toOnlineStatus(payload?.mainsAvailable),
      temperature: this.toValue(payload?.ambientTemperature1),
      power: this.toValue(payload?.totalAcInputPowerW),
      signal: this.toSignalValue(payload?.mainsAvailable),
      lastUpdated: updatedAt,
      lineACurrent: this.toValue(payload?.lineACurrent),
      lineAVoltage: this.toValue(payload?.lineAVoltage),
      lineBCurrent: this.toValue(payload?.lineBCurrent),
      lineBVoltage: this.toValue(payload?.lineBVoltage),
      lineCCurrent: this.toValue(payload?.lineCCurrent),
      lineCVoltage: this.toValue(payload?.lineCVoltage),
    });

    this.patchDevice('generator', {
      status: this.toOnlineStatus(payload?.gensetRunning),
      temperature: this.toValue(payload?.ambientTemperature2),
      power: this.toValue(payload?.gensetRunHours),
      signal: this.toSignalValue(payload?.gensetAvailable),
      lastUpdated: updatedAt,
      gensetAvailable: this.toValue(payload?.gensetAvailable),
      gensetControlMode: this.toValue(payload?.gensetControlMode),
      gensetRunHours: this.toValue(payload?.gensetRunHours),
      gensetRunning: this.toValue(payload?.gensetRunning),
      gensetStartCount: this.toValue(payload?.gensetStartCount),
      gensetStartFailure: this.toValue(payload?.gensetStartFailure),
    });

    this.patchDevice('solar', {
      status: this.toOnlineStatus(payload?.solarAvailable),
      temperature: this.toValue(payload?.ambientTemperature1),
      power: this.toValue(payload?.solarPowerW),
      signal: this.toSignalValue(payload?.solarAvailable),
      lastUpdated: updatedAt,
      solarAvailable: this.toValue(payload?.solarAvailable),
      solarChargingHours: this.toValue(payload?.solarChargingHours),
      solarControllerCommFail: this.toValue(payload?.solarControllerCommFail),
      solarControllerCount: this.toValue(payload?.solarControllerCount),
      solarCurrent: this.toValue(payload?.solarCurrent),
      solarEnergyTodayWh: this.toValue(payload?.solarEnergyTodayWh),
      solarPowerW: this.toValue(payload?.solarPowerW),
      solarVoltage: this.toValue(payload?.solarVoltage),
    });

    this.patchDevice('battery', {
      status: this.toOnlineStatus(payload?.batteryStatus),
      temperature: this.toValue(payload?.batteryTemperature),
      power: this.toValue(payload?.batteryChargeDischargeKw),
      signal: this.toValue(payload?.batteryRemainingPercent),
      lastUpdated: updatedAt,
      batteryBackupTimeMin: this.toValue(payload?.batteryBackupTimeMin),
      batteryChargeDischargeKw: this.toValue(payload?.batteryChargeDischargeKw),
      batteryCurrent: this.toValue(payload?.batteryCurrent),
      batteryRemainingCapacityAh: this.toValue(payload?.batteryRemainingCapacityAh),
      batteryRemainingPercent: this.toValue(payload?.batteryRemainingPercent),
      batterySoh: this.toValue(payload?.batterySoh),
      batteryStatus: this.toValue(payload?.batteryStatus),
      batteryTemperature: this.toValue(payload?.batteryTemperature),
      batteryTotalCapacityAh: this.toValue(payload?.batteryTotalCapacityAh),
      batteryVoltage: this.toValue(payload?.batteryVoltage),
    });

    this.patchDevice('rectifier', {
      status: this.toOnlineStatus(payload?.rectifierCommCount),
      temperature: this.toValue(payload?.rectifierMaxTemperature),
      power: this.toValue(payload?.rectifierTotalDcPowerW),
      signal: this.toValue(payload?.rectifierCommCount),
      lastUpdated: updatedAt,
      rectifierAcFail: this.toValue(payload?.rectifierAcFail),
      rectifierCommCount: this.toValue(payload?.rectifierCommCount),
      rectifierInstalledCount: this.toValue(payload?.rectifierInstalledCount),
      rectifierMaxTemperature: this.toValue(payload?.rectifierMaxTemperature),
      rectifierMissing: this.toValue(payload?.rectifierMissing),
      rectifierTotalCurrent: this.toValue(payload?.rectifierTotalCurrent),
      rectifierTotalDcPowerW: this.toValue(payload?.rectifierTotalDcPowerW),
    });

    this.patchDevice('device1', {
      status: this.toOnlineStatus(payload?.systemStatus),
      temperature: this.toValue(payload?.ambientTemperature1),
      power: this.toValue(payload?.dcLoadPowerW),
      signal: this.toValue(payload?.humidity),
      lastUpdated: updatedAt,
    });

    this.patchDevice('computer', {
      status: this.toOnlineStatus(payload?.mainsAvailable),
      temperature: this.toValue(payload?.ambientTemperature2),
      power: this.toValue(payload?.dcLoadPowerW),
      cpu: this.toValue(payload?.dcLoadPercent),
      signal: this.toSignalValue(payload?.mainsAvailable),
      lastUpdated: updatedAt,
    });

    if (this.selectedDeviceName) {
      const selectedKey = this.findDeviceKeyByName(this.selectedDeviceName);
      if (selectedKey) {
        this.selectedDevice = this.devicesMap[selectedKey];
      }
    }
  }

  private patchDevice(key: string, patch: Partial<any>): void {
    if (!this.devicesMap[key]) {
      return;
    }
    this.devicesMap[key] = {
      ...this.devicesMap[key],
      ...patch,
    };
  }

  private findDeviceKeyByName(name: string): string | null {
    const key = Object.keys(this.devicesMap).find((deviceKey) => this.devicesMap[deviceKey]?.name === name);
    return key ?? null;
  }

  private toNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private toValue(value: unknown): string | number {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    return value as string | number;
  }

  private toSignalValue(candidate: unknown): string | number {
    const numeric = this.toNumber(candidate);
    if (numeric !== null) {
      return Math.max(0, Math.min(100, Math.round(numeric)));
    }
    if (typeof candidate === 'string') {
      const normalized = candidate.toLowerCase();
      return normalized.includes('not') || normalized.includes('stop') || normalized.includes('off') ? 0 : 100;
    }
    return candidate ? 100 : '-';
  }

  private toOnlineStatus(candidate: unknown): string {
    if (candidate === null || candidate === undefined || candidate === '') {
      return '-';
    }
    if (typeof candidate === 'string') {
      const normalized = candidate.toLowerCase();
      if (normalized.includes('not') || normalized.includes('stop') || normalized.includes('off')) {
        return 'offline';
      }
      return 'online';
    }
    if (typeof candidate === 'number') {
      return candidate > 0 ? 'online' : 'offline';
    }
    return candidate ? 'online' : 'offline';
  }

  private toDisplayTime(value: unknown): string {
    if (!value) {
      return '-';
    }
    const parsed = new Date(String(value));
    if (Number.isNaN(parsed.getTime())) {
      return '-';
    }
    return parsed.toLocaleTimeString();
  }


  closePopover() {
    this.showPopover = false;
  }
}
