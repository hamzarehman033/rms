import { Component, OnInit } from '@angular/core';
import { DEVICE_TYPE_OPTIONS } from '../../core/constants/device-type';
import { ReportFileFormat, REPORT_FORMAT_OPTIONS, ReportType, ReportFiltersPayload } from '../../core/constants/report.enums';
import { DevicesService } from '../../core/services/devices.service';
import { LocationsService } from '../../core/services/locations.service';
import { StatisticsService } from '../../core/services/statistics.service';
import { TenantService } from '../../core/services/tenant.service';
import { toast } from '../../utils/global-toast';

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
  readonly reportType = ReportType;
  formatOptions = REPORT_FORMAT_OPTIONS;
  selectedFormat: ReportFileFormat = ReportFileFormat.Excel;
  isExporting = false;

  regions: Array<{ name: string; id: string, children: any[] }> = [];
  subRegions: Array<{ name: string; id: string, children: any[] }> = [];
  zones: Array<{ name: string; id: string }> = [];

  devices: Array<{ name: string; id: string, regionId: string, subRegionId: string, zoneId: string, type: string }> = [];
  tenants: Array<{ name: string; id: string }> = [];

  selectedRegion: string | number | null = null;
  selectedSubRegion: string | number | null = null;
  selectedZone: string | number | null = null;
  selectedDevices: Array<string | number> = [];
  selectedSiteType: string | null = null;
  selectedTenants: Array<string | number> = [];


  siteTypeOptions = DEVICE_TYPE_OPTIONS.map((item) => ({
    label: item.label,
    value: item.value,
  }));

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


  filteredDevices: Array<{ name: string; id: string | number, regionId?: string | number, subRegionId?: string | number, zoneId?: string | number, type?: string }> = [];
  filters: ReportFiltersPayload = {};

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

  onApplyFilters(): void {
    this.loadEnergyReport();
    this.loadBatteryReport();
    this.loadSolarReport();
    this.loadGridReport();
    this.loadAlarmReport();
  }

  onExport(reportType: ReportType): void {
    if (this.isExporting) {
      return;
    }

    const payload = this.buildFilters(reportType);
    this.isExporting = true;
    this.statisticsService.downloadReport(payload).subscribe({
      next: (response) => {
        this.downloadBlob(response.body, response.headers.get('content-disposition'), payload);
        this.isExporting = false;
        toast.success('Report exported', 'Your report download has started.');
      },
      error: () => {
        this.isExporting = false;
        toast.error('Export failed', 'Unable to export report. Please try again.');
      }
    });
  }

  onRegionChange(): void {
    this.selectedSubRegion = null;
    this.selectedZone = null;
    this.selectedDevices = [];
    this.updateSubRegionOptions();
    this.zones = [];
    this.refreshFilteredDevices();
  }

  onSubRegionChange(): void {
    this.selectedZone = null;
    this.selectedDevices = [];
    this.updateZoneOptions();
    this.refreshFilteredDevices();
  }

  onZoneChange(): void {
    this.selectedDevices = [];
    this.refreshFilteredDevices();
  }

  onSiteTypeChange(): void {
    this.selectedDevices = [];
    this.refreshFilteredDevices();
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
    this.filters = this.buildFilters(ReportType.EnergyConsumption);
    this.energyLoading = true;
    this.statisticsService.getEnergyConsumptionReport(this.filters).subscribe({
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
    this.filters = this.buildFilters(ReportType.BatteryStatus);
    this.batteryLoading = true;
    this.statisticsService.getBatteryStatusReport(this.filters).subscribe({
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
    this.filters = this.buildFilters(ReportType.SolarStatus);
    this.solarLoading = true;
    this.statisticsService.getSolarStatusReport(this.filters).subscribe({
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
    this.filters = this.buildFilters(ReportType.GridStatus);
    this.gridLoading = true;
    this.statisticsService.getGridStatusReport(this.filters).subscribe({
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
    this.filters = this.buildFilters(ReportType.AlarmStatus);
    this.alarmLoading = true;
    this.statisticsService.getAlarmStatusReport(this.filters).subscribe({
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
        const treeData = response?.data ?? response ?? [];
        this.regions = Array.isArray(treeData) ? treeData : [];
        this.selectedRegion = null;
        this.selectedSubRegion = null;
        this.selectedZone = null;
        this.subRegions = [];
        this.zones = [];
        this.refreshFilteredDevices();
      },
      error: () => {
        this.regions = [];
        this.subRegions = [];
        this.zones = [];
        this.refreshFilteredDevices();
      },
    });
  }

  private loadDevices(): void {
    this.devicesService.getDevices().subscribe({
      next: (response) => {
        this.devices = response?.data?.pageData ?? response?.data ?? [];
        this.refreshFilteredDevices();
      },
      error: () => {
        this.devices = [];
        this.refreshFilteredDevices();
      },
    });
  }

  private loadTenants(): void {
    this.tenantService.getTenants().subscribe({
      next: (response) => {
        this.tenants = response?.data?.pageData ?? response?.data ?? [];
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

    if (Array.isArray(response?.data?.records)) {
      return response.data.records as T[];
    }

    if (Array.isArray(response?.data)) {
      return response.data as T[];
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

  private buildFilters(reportType: ReportType): ReportFiltersPayload {
    const now = Date.now();
    const defaultFrom = new Date(now - (24 * 60 * 60 * 1000)).toISOString();
    const defaultTo = new Date(now).toISOString();
    const deviceIds = (this.selectedDevices ?? [])
      .map((id) => this.toPositiveInt(id))
      .filter((id) => id > 0);
    const tenantIds = (this.selectedTenants ?? [])
      .map((id) => this.toPositiveInt(id))
      .filter((id) => id > 0);
    const regionId = this.toPositiveInt(this.selectedRegion);
    const subRegionId = this.toPositiveInt(this.selectedSubRegion);
    const zoneId = this.toPositiveInt(this.selectedZone);

    return {
      reportType,
      format: this.selectedFormat,
      deviceIds,
      tenantIds,
      siteType: this.selectedSiteType || undefined,
      regionId: regionId || undefined,
      subRegionId: subRegionId || undefined,
      zoneId: zoneId || undefined,
      fromUtc: this.filters.fromUtc ? new Date(this.filters.fromUtc).toISOString() : defaultFrom,
      toUtc: this.filters.toUtc ? new Date(this.filters.toUtc).toISOString() : defaultTo,
      timeRange: this.filters.timeRange ?? 0,
    };
  }

  private downloadBlob(blob: Blob | null, contentDisposition: string | null, payload: ReportFiltersPayload): void {
    if (!blob || !blob.size) {
      toast.warning('Empty export', 'No file content was returned by the server.');
      return;
    }

    const fileName = this.createReportFilename(payload);
    const objectUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = fileName;
    anchor.click();
    window.URL.revokeObjectURL(objectUrl);
  }

  private createReportFilename(payload: ReportFiltersPayload): string {
    const reportName = this.getReportName(payload.reportType);
    const extension = this.getFileExtension(payload.format);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${reportName}-${timestamp}.${extension}`;
  }

  private getReportName(reportType?: ReportType): string {
    switch (reportType) {
      case ReportType.BatteryStatus:
        return 'battery-status-report';
      case ReportType.SolarStatus:
        return 'solar-status-report';
      case ReportType.GridStatus:
        return 'grid-status-report';
      case ReportType.AlarmStatus:
        return 'alarm-status-report';
      case ReportType.EnergyConsumption:
      default:
        return 'energy-consumption-report';
    }
  }

  private getFileExtension(format?: ReportFileFormat): string {
    switch (format) {
      case ReportFileFormat.Excel:
        return 'xlsx';
      case ReportFileFormat.Json:
        return 'json';
      case ReportFileFormat.Csv:
        return 'csv';
      case ReportFileFormat.Pdf:
        return 'pdf';
      default:
        return 'bin';
    }
  }


  refreshFilteredDevices(): void {
    const devices = this.devices ?? [];
    this.filteredDevices = devices.filter((device) => {
      if (this.selectedRegion && !this.sameId(device.regionId, this.selectedRegion)) {
        return false;
      }
      if (this.selectedSubRegion && !this.sameId(device.subRegionId, this.selectedSubRegion)) {
        return false;
      }
      if (this.selectedZone && !this.sameId(device.zoneId, this.selectedZone)) {
        return false;
      }
      if (this.selectedSiteType && String(device.type ?? '') !== String(this.selectedSiteType)) {
        return false;
      }
      return true;
    });

    this.selectedDevices = this.selectedDevices.filter((id) =>
      this.filteredDevices.some((device) => this.sameId(device.id, id))
    );
  }

  private sameId(left: unknown, right: unknown): boolean {
    if (left === null || left === undefined || left === '' || right === null || right === undefined || right === '') {
      return false;
    }
    return String(left) === String(right);
  }

  private toPositiveInt(value: unknown): number {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return 0;
    }
    return parsed;
  }

}
