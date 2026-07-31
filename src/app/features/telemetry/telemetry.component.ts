import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DeviceDataEvent, DevicesService, SignalrService } from '@app/core';

interface DevicePacketRow {
  deviceId: number;
  name: string;
  code: string;
  packetCount: number;
  lastPacketAt: string | null;
  packet: Record<string, unknown> | null;
}

/** Exact fields from the live decoded packet, one column each. */
const PACKET_COLUMNS: string[] = [
  'id',
  'tenantId',
  'siteId',
  'deviceId',
  'tenantNumber',
  'siteNumber',
  'deviceNumber',
  'epochTime',
  'portalReceiveTime',
  'packetVersion',
  'deviceType',
  'manufacturer',
  'model',
  'siteIdHash',
  'deviceIdHash',
  'packetSequence',
  'systemStatus',
  'activeAlarmCount',
  'lineAVoltage',
  'lineBVoltage',
  'lineCVoltage',
  'lineACurrent',
  'lineBCurrent',
  'lineCCurrent',
  'acFrequency',
  'totalAcInputPowerW',
  'totalAcEnergyWh',
  'mainsAvailable',
  'mainsFailure',
  'dcBusVoltage',
  'dcLoadCurrent',
  'dcLoadPowerW',
  'dcLoadPercent',
  'totalDcEnergyWh',
  'rectifierInstalledCount',
  'rectifierCommCount',
  'rectifierTotalCurrent',
  'rectifierTotalDcPowerW',
  'rectifierAcFail',
  'rectifierMissing',
  'rectifierMaxTemperature',
  'batteryStatus',
  'batteryVoltage',
  'batteryCurrent',
  'batteryRemainingPercent',
  'batteryTotalCapacityAh',
  'batteryRemainingCapacityAh',
  'batteryBackupTimeMin',
  'batteryTemperature',
  'batterySoh',
  'bmuOnlineCount',
  'batteryChargeDischargeKw',
  'solarAvailable',
  'solarVoltage',
  'solarCurrent',
  'solarPowerW',
  'solarEnergyTodayWh',
  'solarControllerCount',
  'solarControllerCommFail',
  'solarChargingHours',
  'gensetAvailable',
  'gensetRunning',
  'gensetStartFailure',
  'gensetControlMode',
  'gensetRunHours',
  'gensetStartCount',
  'fuelLevelPercent',
  'fuelVolumeL',
  'fuelTheftAlarm',
  'fuelLowAlarm',
  'gensetPowerW',
  'tenant1LoadW',
  'tenant1CurrentA',
  'tenant2LoadW',
  'tenant2CurrentA',
  'tenant3LoadW',
  'tenant3CurrentA',
  'tenant4LoadW',
  'tenant4CurrentA',
  'ambientTemperature1',
  'ambientTemperature2',
  'humidity',
  'doorOpenAlarm',
  'smokeAlarm',
  'waterLeakAlarm',
  'motionAlarm',
  'digitalInputBitmap',
  'relayOutputBitmap',
  'alarm1Code',
  'alarm1Level',
  'alarm2Code',
  'alarm2Level',
  'alarm3Code',
  'alarm3Level',
  'alarmBitmap1',
  'deviceUptimeSeconds',
  'signalStrengthDbm',
  'networkType',
  'simStatus',
  'dataValidityBitmap',
  'lastSuccessfulPollAgeSeconds',
  'gatewayCpuUsagePercent',
  'gatewayRamUsagePercent',
  'gatewayTemperature',
  'activePowerSource',
  'powerSourcePriority',
  'hybridModeEnabled',
  'gensetVoltageL1',
  'gensetVoltageL2',
  'gensetVoltageL3',
  'gensetCurrentL1',
  'gensetCurrentL2',
  'gensetCurrentL3',
  'gensetFrequency',
  'gensetBatteryVoltage',
  'gensetFuelConsumptionRateLph',
  'gensetNextServiceHours',
  'fuelTankCapacityL',
  'fuelSensorStatus',
  'fuelConsumptionRateLph',
  'fuelRuntimeRemainingMin',
  'batterySoc',
  'batteryCycleCount',
  'batteryTotalDischargeTimes',
  'batteryTotalDischargeEnergyWh',
  'batteryMaxCellVoltageMv',
  'batteryMinCellVoltageMv',
  'batteryMaxCellTemp',
  'batteryStatusExtended',
  'batteryContactorStatus',
  'rectifierFaultCount',
  'rectifierCapacityTotalW',
  'rectifierCapacityUsedPercent',
  'rectifierEfficiencyPercent',
  'rectifierRedundancyStatus',
  'rectifierHighestLoadModulePercent',
  'dcLvd1Status',
  'dcLvd2Status',
  'dcFuseAlarmBitmap',
  'dcBranchAlarmBitmap',
  'dcCriticalLoadCurrent',
  'dcNonCriticalLoadCurrent',
  'batteryLvdStatus',
  'solarTotalEnergyLifetimeWh',
  'solarControllerFaultCount',
  'solarBatteryChargeCurrent',
  'solarMpptStatus',
  'solarDailyPeakPowerW',
  'solarPanelStringAlarmBitmap',
  'rectifier1OutputCurrent',
  'rectifier2OutputCurrent',
  'rectifier3OutputCurrent',
  'rectifier4OutputCurrent',
  'alarm4Code',
  'alarm4Level',
  'alarm5Code',
  'alarm5Level',
  'alarm6Code',
  'alarm6Level',
  'extMainL1Voltage',
  'extMainL2Voltage',
  'extMainL3Voltage',
  'extMainL1Current',
  'extMainL2Current',
  'extMainL3Current',
  'extMainFrequency',
  'extMainTotalPowerW',
  'extMainTotalEnergyWh',
  'extGensetL1Voltage',
  'extGensetL2Voltage',
  'extGensetL3Voltage',
  'extGensetL1Current',
  'extGensetL2Current',
  'extGensetL3Current',
  'extGensetFrequency',
  'extGensetTotalPowerW',
  'extGensetTotalEnergyWh',
  'crc16',
  'isCrcValid',
  'extensionCrc16',
  'isExtensionCrcValid',
  'receivedAtUtc',
  'error',
  'regionId',
  'subRegionId',
  'zoneId'
];

@Component({
  selector: 'app-telemetry',
  standalone: false,
  templateUrl: './telemetry.component.html',
  styleUrl: './telemetry.component.css'
})
export class TelemetryComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly columns = PACKET_COLUMNS;
  isLoading = false;
  rows: DevicePacketRow[] = [];
  private readonly rowsByDeviceId = new Map<number, DevicePacketRow>();

  constructor(
    private readonly devicesService: DevicesService,
    private readonly signalrService: SignalrService
  ) {}

  ngOnInit(): void {
    this.loadDevices();
    this.listenForPackets();
  }

  val(packet: Record<string, unknown> | null, key: string): string {
    if (!packet) {
      return '—';
    }

    const value = packet[key];
    if (value === null || value === undefined || value === '') {
      return '—';
    }

    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }

    if (typeof value === 'number') {
      return Number.isInteger(value) ? String(value) : value.toFixed(1);
    }

    return String(value);
  }

  private loadDevices(): void {
    this.isLoading = true;
    this.devicesService.getDevices().subscribe({
      next: (response: any) => {
        const list = response?.data?.pageData ?? response?.data ?? response ?? [];
        const devices = Array.isArray(list) ? list : [];

        devices.forEach((device: any) => {
          const deviceId = Number(device?.id ?? device?.deviceId ?? device?.siteId);
          if (!Number.isFinite(deviceId) || deviceId <= 0 || this.rowsByDeviceId.has(deviceId)) {
            return;
          }

          this.rowsByDeviceId.set(deviceId, {
            deviceId,
            name: String(device?.name ?? device?.siteName ?? device?.deviceName ?? `Device ${deviceId}`),
            code: String(device?.code ?? device?.siteCode ?? device?.deviceCode ?? ''),
            packetCount: 0,
            lastPacketAt: null,
            packet: null
          });
        });

        this.syncRows();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private listenForPackets(): void {
    this.signalrService.onDeviceData$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        if (event) {
          this.applyPacket(event);
        }
      });
  }

  private applyPacket(event: DeviceDataEvent): void {
    const deviceId = Number(event.deviceId);
    if (!Number.isFinite(deviceId) || deviceId <= 0) {
      return;
    }

    let row = this.rowsByDeviceId.get(deviceId);
    if (!row) {
      row = {
        deviceId,
        name: String(event.decodedPayload?.deviceId ?? `Device ${deviceId}`),
        code: String(event.decodedPayload?.deviceId ?? ''),
        packetCount: 0,
        lastPacketAt: null,
        packet: null
      };
      this.rowsByDeviceId.set(deviceId, row);
    }

    row.packetCount += 1;
    row.lastPacketAt =
      event.receivedAt ||
      String(event.decodedPayload?.portalReceiveTime ?? '') ||
      new Date().toISOString();
    row.packet = (event.decodedPayload as unknown as Record<string, unknown>) ?? null;
    this.syncRows();
  }

  private syncRows(): void {
    this.rows = Array.from(this.rowsByDeviceId.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }
}
