import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../core/services/statistics.service';

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

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
  standalone: false,
})
export class ReportsComponent implements OnInit {
  activeTab = 'energy-consumption';

  regions = [
    { label: 'North', value: 'north' },
    { label: 'South', value: 'south' },
    { label: 'East', value: 'east' },
    { label: 'West', value: 'west' },
  ];

  subRegions = [
    { label: 'North-1', value: 'north-1' },
    { label: 'North-2', value: 'north-2' },
    { label: 'South-1', value: 'south-1' },
    { label: 'West-1', value: 'west-1' },
  ];

  zones = [
    { label: 'Zone A', value: 'zone-a' },
    { label: 'Zone B', value: 'zone-b' },
    { label: 'Zone C', value: 'zone-c' },
  ];

  devices = [
    { label: 'Gateway A1', value: 'gateway-a1' },
    { label: 'Pump Ctrl 03', value: 'pump-ctrl-03' },
    { label: 'Sensor T-12', value: 'sensor-t-12' },
    { label: 'Meter L2', value: 'meter-l2' },
  ];

  tenants = [
    { label: 'Tenant Alpha', value: 'tenant-alpha' },
    { label: 'Tenant Beta', value: 'tenant-beta' },
    { label: 'Tenant Gamma', value: 'tenant-gamma' },
  ];

  selectedRegion: string | null = null;
  selectedSubRegion: string | null = null;
  selectedZone: string | null = null;
  selectedDevice: string | null = null;
  selectedTenant: string | null = null;

  batteryRecords: BatteryStatusRecord[] = [];
  solarRecords: SolarStatusRecord[] = [];
  gridRecords: GridStatusRecord[] = [];
  energyRecords: EnergyConsumptionRecord[] = [];

  batteryLoading = false;
  solarLoading = false;
  gridLoading = false;
  energyLoading = false;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadEnergyReport();
    this.loadBatteryReport();
    this.loadSolarReport();
    this.loadGridReport();
  }

  onExport(): void {
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
