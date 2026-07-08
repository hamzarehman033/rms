import { Component, OnInit } from '@angular/core';
import { DevicesService } from '../../core/services/devices.service';
import { LocationsService } from '../../core/services/locations.service';
import { StatisticsService } from '../../core/services/statistics.service';
import { TenantService } from '../../core/services/tenant.service';

interface BatteryStatusRecord {
  deviceId: number;
  siteName: string;
  dateUtc: string;
  packetsCount: number;
  avgBatteryVoltage: number;
  avgBatteryCurrent: number;
  avgBatteryTemperature: number;
  avgBatteryRemainingPercent: number;
  avgBatterySoh: number;
}

interface SolarStatusRecord {
  deviceId: number;
  siteName: string;
  dateUtc: string;
  packetsCount: number;
  avgSolarVoltage: number;
  avgSolarCurrent: number;
  avgSolarPowerW: number;
  avgSolarEnergyTodayWh: number;
  solarAvailablePercent: number;
}

interface GridStatusRecord {
  deviceId: number;
  siteName: string;
  dateUtc: string;
  packetsCount: number;
  avgLineAVoltage: number;
  avgLineBVoltage: number;
  avgLineCVoltage: number;
  avgLineACurrent: number;
  avgLineBCurrent: number;
  avgLineCCurrent: number;
  avgAcFrequency: number;
  avgAcInputPowerW: number;
  gridAvailablePercent: number;
}

interface EnergyConsumptionRecord {
  deviceId: number;
  siteName: string;
  dateUtc: string;
  packetsCount: number;
  avgTotalAcEnergyWh: number;
  avgTotalDcEnergyWh: number;
  avgSolarEnergyTodayWh: number;
  avgAcInputPowerW: number;
  avgDcLoadPowerW: number;
  avgTenantLoadW: number | null;
}

interface AlarmStatusRecord {
  deviceId: number;
  siteName: string;
  dateUtc: string;
  packetsCount: number;
  avgActiveAlarmCount: number;
  packetsWithActiveAlarms: number;
  criticalAlarmPackets: number;
  majorAlarmPackets: number;
  minorAlarmPackets: number;
  warningAlarmPackets: number;
  doorOpenEvents: number;
  smokeEvents: number;
  waterLeakEvents: number;
  motionEvents: number;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
  standalone: false,
})
export class ReportsComponent implements OnInit {
  activeTab = 'energy-consumption';

  regions: Array<{ name: string; id: string, children: any[] }> = [];
  subRegions: Array<{ name: string; id: string, children: any[] }> = [];
  zones: Array<{ name: string; id: string }> = [];

  devices: Array<{ name: string; id: string }> = [];
  tenants: Array<{ name: string; id: string }> = [];

  selectedRegion: string | null = '';
  selectedSubRegion: string | null = '';
  selectedZone: string | null = '';
  selectedDevice: string | null = null;
  selectedTenant: string | null = null;

  batteryRecords: BatteryStatusRecord[] = [];
  solarRecords: SolarStatusRecord[] = [];
  gridRecords: GridStatusRecord[] = [];
  energyRecords: EnergyConsumptionRecord[] = [];
  alarmRecords: AlarmStatusRecord[] = [];

  batteryLoading = false;
  solarLoading = false;
  gridLoading = false;
  energyLoading = false;
  alarmLoading = false;

  constructor(
    private statisticsService: StatisticsService,
    private locationsService: LocationsService,
    private devicesService: DevicesService,
    private tenantService: TenantService
  ) {}

  ngOnInit(): void {
    this.loadLocationTree();
    this.loadDevices();
    this.loadTenants();
    this.loadEnergyReport();
    this.loadBatteryReport();
    this.loadSolarReport();
    this.loadGridReport();
    this.loadAlarmReport();
  }

  onExport(): void {
  }

  onRegionChange(): void {
    this.selectedSubRegion = '';
    this.selectedZone = '';
    this.updateSubRegionOptions();
    this.zones = [];
  }

  onSubRegionChange(): void {
    this.selectedZone = '';
    this.updateZoneOptions();
  }

  get batteryAvgVoltage(): number {
    return this.getAverage(this.batteryRecords.map((x) => x.avgBatteryVoltage));
  }

  get batteryAvgCurrent(): number {
    return this.getAverage(this.batteryRecords.map((x) => x.avgBatteryCurrent));
  }

  get batteryAvgTemperature(): number {
    return this.getAverage(this.batteryRecords.map((x) => x.avgBatteryTemperature));
  }

  get batteryAvgSoc(): number {
    return this.getAverage(this.batteryRecords.map((x) => x.avgBatteryRemainingPercent));
  }

  get solarAvgPower(): number {
    return this.getAverage(this.solarRecords.map((x) => x.avgSolarPowerW));
  }

  get solarAvgEnergyTodayWh(): number {
    return this.getAverage(this.solarRecords.map((x) => x.avgSolarEnergyTodayWh));
  }

  get solarAvailability(): number {
    return this.getAverage(this.solarRecords.map((x) => x.solarAvailablePercent));
  }

  get solarAvgVoltage(): number {
    return this.getAverage(this.solarRecords.map((x) => x.avgSolarVoltage));
  }

  get gridAvgPower(): number {
    return this.getAverage(this.gridRecords.map((x) => x.avgAcInputPowerW));
  }

  get gridAvailability(): number {
    return this.getAverage(this.gridRecords.map((x) => x.gridAvailablePercent));
  }

  get gridAvgFrequency(): number {
    return this.getAverage(this.gridRecords.map((x) => x.avgAcFrequency));
  }

  get gridAvgVoltage(): number {
    const voltages = this.gridRecords.map((x) => (x.avgLineAVoltage + x.avgLineBVoltage + x.avgLineCVoltage) / 3);
    return this.getAverage(voltages);
  }

  get energyAvgAcWh(): number {
    return this.getAverage(this.energyRecords.map((x) => x.avgTotalAcEnergyWh));
  }

  get energyAvgDcWh(): number {
    return this.getAverage(this.energyRecords.map((x) => x.avgTotalDcEnergyWh));
  }

  get energyAvgSolarWh(): number {
    return this.getAverage(this.energyRecords.map((x) => x.avgSolarEnergyTodayWh));
  }

  get energyAvgAcPowerW(): number {
    return this.getAverage(this.energyRecords.map((x) => x.avgAcInputPowerW));
  }

  get alarmAvgActiveCount(): number {
    return this.getAverage(this.alarmRecords.map((x) => x.avgActiveAlarmCount));
  }

  get alarmAvgCriticalPackets(): number {
    return this.getAverage(this.alarmRecords.map((x) => x.criticalAlarmPackets));
  }

  get alarmAvgMajorPackets(): number {
    return this.getAverage(this.alarmRecords.map((x) => x.majorAlarmPackets));
  }

  get alarmAvgWarningPackets(): number {
    return this.getAverage(this.alarmRecords.map((x) => x.warningAlarmPackets));
  }

  formatNumber(value: number | null | undefined, digits = 2): string {
    if (value === null || value === undefined || !Number.isFinite(value)) {
      return '0';
    }

    return value.toFixed(digits);
  }

  private loadEnergyReport(): void {
    this.energyLoading = true;
    this.statisticsService.getEnergyConsumptionReport({}).subscribe({
      next: (response) => {
        this.energyRecords = this.extractRecords<EnergyConsumptionRecord>(response);
        this.energyLoading = false;
      },
      error: () => {
        this.energyRecords = [];
        this.energyLoading = false;
      },
    });
  }

  private loadBatteryReport(): void {
    this.batteryLoading = true;
    this.statisticsService.getBatteryStatusReport({}).subscribe({
      next: (response) => {
        this.batteryRecords = this.extractRecords<BatteryStatusRecord>(response);
        this.batteryLoading = false;
      },
      error: () => {
        this.batteryRecords = [];
        this.batteryLoading = false;
      },
    });
  }

  private loadSolarReport(): void {
    this.solarLoading = true;
    this.statisticsService.getSolarStatusReport({}).subscribe({
      next: (response) => {
        this.solarRecords = this.extractRecords<SolarStatusRecord>(response);
        this.solarLoading = false;
      },
      error: () => {
        this.solarRecords = [];
        this.solarLoading = false;
      },
    });
  }

  private loadGridReport(): void {
    this.gridLoading = true;
    this.statisticsService.getGridStatusReport({}).subscribe({
      next: (response) => {
        this.gridRecords = this.extractRecords<GridStatusRecord>(response);
        this.gridLoading = false;
      },
      error: () => {
        this.gridRecords = [];
        this.gridLoading = false;
      },
    });
  }

  private loadAlarmReport(): void {
    this.alarmLoading = true;
    this.statisticsService.getAlarmStatusReport({}).subscribe({
      next: (response) => {
        this.alarmRecords = this.extractRecords<AlarmStatusRecord>(response);
        this.alarmLoading = false;
      },
      error: () => {
        this.alarmRecords = [];
        this.alarmLoading = false;
      },
    });
  }

  private loadLocationTree(): void {
    this.locationsService.getLocationTree().subscribe({
      next: (response) => {
        this.regions = response?.data;
        this.selectedRegion = '';
        this.selectedSubRegion = '';
        this.selectedZone = '';
        this.subRegions = [];
        this.zones = [];
      },
      error: () => {
        this.regions = [];
        this.subRegions = [];
        this.zones = [];
      },
    });
  }

  private loadDevices(): void {
    this.devicesService.getDevices().subscribe({
      next: (response) => {
        this.devices = response?.data?.pageData;
      },
      error: () => {
        this.devices = [];
      },
    });
  }

  private loadTenants(): void {
    this.tenantService.getTenants().subscribe({
      next: (response) => {
        this.tenants = response?.data?.pageData;
      },
      error: () => {
        this.tenants = [];
      },
    });
  }

  private updateSubRegionOptions(): void {
    const selectedRegion = this.regions.find(
      (region) => String(region?.id ?? '') === String(this.selectedRegion ?? '')
    );
    this.subRegions = selectedRegion?.children ?? [];
   
  }

  private updateZoneOptions(): void {
    const selectedSubRegion = this.subRegions.find(
      (subRegion) => String(subRegion?.id ?? '') === String(this.selectedSubRegion ?? '')
    );
    this.zones = selectedSubRegion?.children ?? [];
  }

  private extractRecords<T>(response: any): T[] {
    if (Array.isArray(response?.records)) {
      return response.records as T[];
    }

    if (Array.isArray(response)) {
      return response as T[];
    }

    return [];
  }

  private getAverage(values: number[]): number {
    const valid = values.filter((x) => Number.isFinite(x));
    if (!valid.length) {
      return 0;
    }

    const sum = valid.reduce((acc, value) => acc + value, 0);
    return sum / valid.length;
  }

  private tableToCSV(table: HTMLTableElement): void {
  }
}
