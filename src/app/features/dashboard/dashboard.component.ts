import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { CustomerService } from '../../core/services/customer.service';
import { DevicesService } from '../../core/services/devices.service';
import { LocationsService } from '../../core/services/locations.service';
import {
  DeviceRealtimeData,
  FleetRealtimeMetrics,
  RealtimeDataSourceService
} from '../../core/services/realtime-data-source.service';
import { TenantService } from '../../core/services/tenant.service';
import { RecentSitesFilterRequest, StatisticsService } from '../../core/services/statistics.service';

interface RecentAnomaly {
  title: string;
  deviceId: string;
  timeAgo: string;
  eventTime: string;
}

interface TelemetryHourlyStat {
  hour: string;
  avgTemperature: number;
  avgHumidity: number;
}

interface DashboardMetric {
  current: number;
  previous: number;
  difference: number;
  percentage: number;
}

interface DashboardSummary {
  totalSites: DashboardMetric;
  onlineOnce: DashboardMetric;
  activeAlerts: DashboardMetric;
  messagesPerMinute: DashboardMetric;
}

interface WeeklyAlert {
  day: string;
  value: number;
}

interface RecentSite {
  id: string;
  name: string;
  code: string;
  status: string;
  location: string;
  battery: string;
  lastSeen: string;
}

interface RecentDeviceActivity {
  id: string;
  name: string;
  messageCount: number;
  lastSeen: string;
}

interface FilterOption {
  label: string;
  value: string;
}

interface LocationTreeNode {
  id?: number | string;
  name?: string;
  children?: LocationTreeNode[];
}

interface LocationOverviewRow {
  id: string;
  name: string;
  code: string;
  region: string;
  sites: number;
  status: string;
  utilization: number | null;
}

interface FleetDistributionSummary {
  totalDevices: number;
  cpCount: number;
  batteryCount: number;
  solarCount: number;
  generatorCount: number;
  configCounts: Record<string, number>;
}

interface DistributionDonutPoint {
  name: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private readonly weekDayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  hasActiveCustomer = false;
  private readonly destroyRef = inject(DestroyRef);
  private pendingStatsRequests = 0;
  isLoadingDashboardStats = false;

  dashboardSummary: any = null;
  dashboardSummaryView: DashboardSummary | null = null;
  telemetryEnvironmentCounts: any = null;
  telemetryHourlyTempHumidityStats: any = null;
  top5DevicesByActivityInLastHour: any = null;
  recentDevices: RecentDeviceActivity[] = [];
  recentAnomalies: any = null;
  recentAlerts: RecentAnomaly[] = [];
  weeklyAlerts: WeeklyAlert[] = this.weekDayOrder.map(day => ({ day, value: 0 }));
  recentSites: RecentSite[] = [];
  realtimeFleetMetrics: FleetRealtimeMetrics | null = null;
  realtimeDevices: DeviceRealtimeData[] = [];
  fleetDistribution: FleetDistributionSummary = {
    totalDevices: 0,
    cpCount: 0,
    batteryCount: 0,
    solarCount: 0,
    generatorCount: 0,
    configCounts: {
      cpOnly: 0,
      cpBattery: 0,
      cpBatterySolar: 0,
      cpBatteryGen: 0,
      allSources: 0
    }
  };
  distributionDonutData: DistributionDonutPoint[] = [];
  private locationTree: LocationTreeNode[] = [];
  locationsOverviewRows: LocationOverviewRow[] = [];

  constructor(
    private customerService: CustomerService,
    private devicesService: DevicesService,
    private locationsService: LocationsService,
    private statisticsService: StatisticsService,
    private realtimeDataSourceService: RealtimeDataSourceService,
    private tenantService: TenantService
  ) {}
  // Live Telemetry Chart Data
  telemetryChartOptions = {
    xAxisData: [] as string[],
    seriesData: [
      {
        name: 'Temperature °C',
        data: [] as number[],
        color: '#5b6cff'
      },
      {
        name: 'Humidity %',
        data: [] as number[],
        color: '#38bdf8'
      }
    ],
    height: '250px',
    showLegend: false,
    showSymbol: false
  };

  // Weekly Activity Chart Data
  weeklyActivityOptions = {
    xAxisData: [...this.weekDayOrder],
    seriesData: [
      {
        name: 'Online',
        data: [] as number[],
        color: '#22c55e'
      },
      {
        name: 'Offline',
        data: [] as number[],
        color: '#ef4444'
      }
    ],
    height: '250px',
    showLegend: false
  };

  // Filter Properties
  searchTerm = '';
  selectedRegions: string = '';
  selectedSubRegions: string = '';
  selectedStatuses: string = '';
  selectedSiteTypes: string = '';
  selectedPowerSource = '';
  selectedTenant = '';

  // Filter Options
  regionOptions: FilterOption[] = [];

  subRegionOptions: FilterOption[] = [];

  statusOptions = [
    { label: 'Online', value: 'online' },
    { label: 'Offline', value: 'offline' },
    { label: 'Warning', value: 'warning' },
    { label: 'Error', value: 'error' }
  ];

  siteTypeOptions = [
    { label: 'Manufacturing', value: 'manufacturing' },
    { label: 'Storage', value: 'storage' },
    { label: 'Data Center', value: 'datacenter' },
    { label: 'Office', value: 'office' }
  ];

  powerSourceOptions = [
    { label: 'CP Only', value: 'cp-only' },
    { label: 'CP + Battery', value: 'cp-battery' },
    { label: 'CP + Bat + Solar', value: 'cp-battery-solar' },
    { label: 'CP + Bat + Gen', value: 'cp-battery-gen' },
    { label: 'CP + Bat + Gen + Solar', value: 'all' }
  ];

  tenantOptions: FilterOption[] = [];

  ngOnInit(): void {
    this.initializeRealtimeDataSource();

    this.customerService.activeCustomer$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(activeCustomer => {
        this.hasActiveCustomer = !!activeCustomer?.id;

        if (this.hasActiveCustomer) {
          this.loadLocationTree();
          this.loadTenantOptions();
          this.loadDashboardStatistics();
        }
      });
  }

  private initializeRealtimeDataSource(): void {
    this.realtimeDataSourceService.fleetMetrics$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(metrics => {
        this.realtimeFleetMetrics = metrics;
      });

    this.realtimeDataSourceService.devices$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(devicesMap => {
        this.realtimeDevices = Object.values(devicesMap ?? {});
      });
  }

  private loadDashboardStatistics(): void {
    this.loadDashboardSummary();
    this.loadTelemetryEnvironmentCounts();
    this.loadTelemetryHourlyTempHumidityStats();
    this.loadTop5DevicesByActivityInLastHour();
    this.loadRecentAnomalies();
    this.loadWeeklyAlerts();
    this.loadRecentSites();
    this.loadFleetDistribution();
    this.loadLocationsOverview();
  }

  private loadFleetDistribution(): void {
    this.startStatsRequest();
    this.devicesService
      .getDevices()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.endStatsRequest();
        })
      )
      .subscribe({
        next: response => {
          const list = response?.data?.pageData ?? response?.data ?? response ?? [];
          const devices = Array.isArray(list) ? list : [];
          this.fleetDistribution = this.buildFleetDistribution(devices);
          this.distributionDonutData = this.buildFleetDistributionDonutData(this.fleetDistribution);
        },
        error: () => {
          this.fleetDistribution = {
            totalDevices: 0,
            cpCount: 0,
            batteryCount: 0,
            solarCount: 0,
            generatorCount: 0,
            configCounts: {
              cpOnly: 0,
              cpBattery: 0,
              cpBatterySolar: 0,
              cpBatteryGen: 0,
              allSources: 0
            }
          };
          this.distributionDonutData = [];
        }
      });
  }

  private buildFleetDistribution(devices: any[]): FleetDistributionSummary {
    const summary: FleetDistributionSummary = {
      totalDevices: devices.length,
      cpCount: 0,
      batteryCount: 0,
      solarCount: 0,
      generatorCount: 0,
      configCounts: {
        cpOnly: 0,
        cpBattery: 0,
        cpBatterySolar: 0,
        cpBatteryGen: 0,
        allSources: 0
      }
    };

    devices.forEach(device => {
      const source = device?.infrastructure ?? device?.deviceInfrastructure ?? device ?? {};
      const supportsCp = this.hasPositiveCapability(source?.rectifierQty ?? source?.rectifierInstalledCount);
      const supportsBattery = this.hasPositiveCapability(source?.batteryQty);
      const supportsSolar = this.hasPositiveCapability(source?.solarQty);
      const supportsGenerator = this.hasPositiveCapability(source?.generatorQty);

      if (supportsCp) summary.cpCount += 1;
      if (supportsBattery) summary.batteryCount += 1;
      if (supportsSolar) summary.solarCount += 1;
      if (supportsGenerator) summary.generatorCount += 1;

      if (supportsCp && !supportsBattery && !supportsSolar && !supportsGenerator) {
        summary.configCounts['cpOnly'] += 1;
      } else if (supportsCp && supportsBattery && !supportsSolar && !supportsGenerator) {
        summary.configCounts['cpBattery'] += 1;
      } else if (supportsCp && supportsBattery && supportsSolar && !supportsGenerator) {
        summary.configCounts['cpBatterySolar'] += 1;
      } else if (supportsCp && supportsBattery && !supportsSolar && supportsGenerator) {
        summary.configCounts['cpBatteryGen'] += 1;
      } else if (supportsCp && supportsBattery && supportsSolar && supportsGenerator) {
        summary.configCounts['allSources'] += 1;
      }
    });

    return summary;
  }

  private hasPositiveCapability(value: unknown): boolean {
    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric > 0;
  }

  private buildFleetDistributionDonutData(summary: FleetDistributionSummary): DistributionDonutPoint[] {
    return [
      { name: 'CP (Grid)', value: summary.cpCount, color: '#0ea5e9' },
      { name: 'Battery', value: summary.batteryCount, color: '#3fb950' },
      { name: 'Solar', value: summary.solarCount, color: '#d29922' },
      { name: 'Generator', value: summary.generatorCount, color: '#f78166' }
    ];
  }

  private loadTenantOptions(): void {
    this.tenantService
      .getTenants()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.tenantOptions = response?.data?.pageData
        },
        error: () => {
          this.tenantOptions = [];
          this.selectedTenant = '';
        }
      });
  }

  private loadWeeklyAlerts(): void {
    this.startStatsRequest();
    this.statisticsService
      .getWeeklyAlerts()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.endStatsRequest();
        })
      )
      .subscribe({
        next: result => {
          this.weeklyAlerts = this.extractWeeklyAlerts(result);
        },
        error: () => {
          this.weeklyAlerts = this.weekDayOrder.map(day => ({ day, value: 0 }));
        }
      });
  }

  private loadRecentSites(): void {
    const filters = this.buildRecentSitesFilters();

    this.startStatsRequest();
    this.statisticsService
      .getRecentSites(filters as RecentSitesFilterRequest)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.endStatsRequest();
        })
      )
      .subscribe({
        next: result => {
          this.recentSites = this.extractRecentSites(result);
        },
        error: () => {
          this.recentSites = [];
        }
      });
  }

  private buildRecentSitesFilters(): RecentSitesFilterRequest {
    const regionId = this.toPositiveInt(this.selectedRegions);
    const subRegionId = this.toPositiveInt(this.selectedSubRegions);
    const status = this.mapStatusToCode(this.selectedStatuses);

    return {
      regionId,
      subRegionId,
      zoneId: 0,
      status,
      deviceId: 0,
      timeRange: 0
    };
  }


  private loadLocationsOverview(): void {
    this.startStatsRequest();
    this.locationsService
      .getAllLocations()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.endStatsRequest();
        })
      )
      .subscribe({
        next: result => {
          this.locationsOverviewRows = this.extractLocationsOverviewRows(result);
        },
        error: () => {
          this.locationsOverviewRows = [];
        }
      });
  }

  private loadLocationTree(): void {
    this.locationsService
      .getLocationTree()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          const treeData = response?.data ?? response ?? [];
          this.locationTree = Array.isArray(treeData) ? treeData : [];

          this.regionOptions = this.locationTree
            .filter(region => region?.id !== undefined && region?.id !== null)
            .map(region => ({
              label: String(region?.name ?? ''),
              value: String(region.id)
            }));

          this.syncSubRegionOptions();
        },
        error: () => {
          this.locationTree = [];
          this.regionOptions = [];
          this.subRegionOptions = [];
          this.selectedRegions = '';
          this.selectedSubRegions = '';
        }
      });
  }

  onRegionFilterChange(): void {
    this.syncSubRegionOptions();
    this.onFilterChange();
  }

  private syncSubRegionOptions(): void {
    const selectedRegionSet = new Set([String(this.selectedRegions)]);
    const selectedRegions = selectedRegionSet.size
      ? this.locationTree.filter(region => selectedRegionSet.has(String(region?.id ?? '')))
      : this.locationTree;

    const subRegions = selectedRegions.flatMap(region =>
      Array.isArray(region?.children) ? region.children : []
    );

    const subRegionMap = new Map<string, string>();
    subRegions.forEach(subRegion => {
      const id = subRegion?.id;
      if (id === undefined || id === null) {
        return;
      }

      const value = String(id);
      if (!subRegionMap.has(value)) {
        subRegionMap.set(value, String(subRegion?.name ?? ''));
      }
    });

    this.subRegionOptions = Array.from(subRegionMap.entries()).map(([value, label]) => ({
      label,
      value
    }));

    const validSubRegionValues = new Set(this.subRegionOptions.map(option => option.value));
    this.selectedSubRegions = validSubRegionValues.has(String(this.selectedSubRegions))
      ? this.selectedSubRegions
      : '';
  }

  private loadDashboardSummary(): void {
    this.startStatsRequest();
    this.statisticsService
      .getDashboardSummary({})
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.endStatsRequest();
        })
      )
      .subscribe({
        next: result => {
          this.dashboardSummary = result;
          this.dashboardSummaryView = this.extractDashboardSummary(result);
        },
        error: () => {
          this.dashboardSummary = null;
          this.dashboardSummaryView = null;
        }
      });
  }

  private loadTelemetryEnvironmentCounts(): void {
    this.startStatsRequest();
    this.statisticsService
      .getTelemetryEnvironmentCounts({})
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.endStatsRequest();
        })
      )
      .subscribe({
        next: result => {
          this.telemetryEnvironmentCounts = result;
        },
        error: () => {
          this.telemetryEnvironmentCounts = null;
        }
      });
  }

  private loadTelemetryHourlyTempHumidityStats(): void {
    this.startStatsRequest();
    this.statisticsService
      .getTelemetryHourlyTempHumidityStats({})
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.endStatsRequest();
        })
      )
      .subscribe({
        next: result => {
          this.telemetryHourlyTempHumidityStats = result;
          this.patchTelemetryChart(result);
        },
        error: () => {
          this.telemetryHourlyTempHumidityStats = null;
        }
      });
  }

  private loadTop5DevicesByActivityInLastHour(): void {
    this.startStatsRequest();
    this.statisticsService
      .getTop5DevicesByActivityInLastHour()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.endStatsRequest();
        })
      )
      .subscribe({
        next: result => {
          this.top5DevicesByActivityInLastHour = result;
          this.recentDevices = this.extractRecentDevices(result);
        },
        error: () => {
          this.top5DevicesByActivityInLastHour = null;
          this.recentDevices = [];
        }
      });
  }

  private extractRecentDevices(response: any): RecentDeviceActivity[] {
    const payload = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.pageData)
      ? response.data.pageData
      : [];

    return payload
      .filter((item: any) => !!item && typeof item === 'object')
      .map((item: any, index: number) => {
        const id = String(item?.id ?? item?.deviceId ?? item?.code ?? `DEVICE-${index + 1}`);
        const name = String(item?.name ?? item?.deviceName ?? item?.title ?? item?.deviceId ?? '-');
        const messageCount = Number(item?.reads ?? item?.messageCount ?? item?.count ?? item?.messages ?? 0);
        const lastSeenValue = item?.lastSeen ?? item?.eventTime ?? item?.updatedAt;
        const avgTemperature = Number(item?.avgTemperature);
        const avgTempText = Number.isFinite(avgTemperature) ? `Avg ${avgTemperature.toFixed(2)} C` : '-';
        const lastSeenText =
          lastSeenValue !== undefined && lastSeenValue !== null
            ? this.formatLastSeen(lastSeenValue)
            : avgTempText;

        return {
          id,
          name,
          messageCount: Number.isFinite(messageCount) ? Math.max(0, Math.round(messageCount)) : 0,
          lastSeen: lastSeenText
        };
      })
      .slice(0, 5);
  }

  private loadRecentAnomalies(): void {
    this.startStatsRequest();
    this.statisticsService
      .getRecentAnomalies()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.endStatsRequest();
        })
      )
      .subscribe({
        next: result => {
          this.recentAnomalies = result;
          this.recentAlerts = this.extractRecentAlerts(result);
        },
        error: () => {
          this.recentAnomalies = null;
          this.recentAlerts = [];
        }
      });
  }

  private startStatsRequest(): void {
    this.pendingStatsRequests += 1;
    this.isLoadingDashboardStats = true;
  }

  private endStatsRequest(): void {
    this.pendingStatsRequests = Math.max(0, this.pendingStatsRequests - 1);
    this.isLoadingDashboardStats = this.pendingStatsRequests > 0;
  }

  private extractRecentAlerts(response: any): RecentAnomaly[] {
    const payload = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.pageData)
      ? response.data.pageData
      : [];

    return payload.map((item: any) => ({
      title: String(item?.title ?? ''),
      deviceId: String(item?.deviceId ?? ''),
      timeAgo: String(item?.timeAgo ?? ''),
      eventTime: String(item?.eventTime ?? '')
    }));
  }

  private extractWeeklyAlerts(response: any): WeeklyAlert[] {
    const payload = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.pageData)
      ? response.data.pageData
      : response?.data?.pageData && typeof response.data.pageData === 'object'
      ? [response.data.pageData]
      : response?.data && typeof response.data === 'object'
      ? [response.data]
      : response && typeof response === 'object'
      ? [response]
      : [];

    const valuesByDay = new Map<string, number>();

    payload.forEach((item: any) => {
      if (!item || typeof item !== 'object') {
        return;
      }

      const day =
        this.normalizeWeekDay(item?.day ?? item?.label ?? item?.name) ??
        this.getWeekDayFromDate(item?.date);
      const value = Number(item?.value ?? item?.count ?? item?.alerts ?? item?.total ?? 0);

      if (day) {
        const previous = valuesByDay.get(day) ?? 0;
        valuesByDay.set(day, previous + (Number.isFinite(value) ? value : 0));
        return;
      }

      this.weekDayOrder.forEach(weekDay => {
        const key = this.getWeekDayKey(weekDay);
        const matchedKey = Object.keys(item).find(k => this.getWeekDayKey(k) === key);

        if (matchedKey) {
          const dayValue = Number(item[matchedKey]);
          valuesByDay.set(weekDay, Number.isFinite(dayValue) ? dayValue : 0);
        }
      });
    });

    return this.weekDayOrder.map(day => ({
      day,
      value: Math.max(0, valuesByDay.get(day) ?? 0)
    }));
  }

  private extractRecentSites(response: any): RecentSite[] {
    const payload = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.pageData)
      ? response.data.pageData
      : [];

    return payload
      .filter((item: any) => !!item && typeof item === 'object')
      .map((item: any, index: number) => {
        const siteId = String(item?.id ?? item?.siteId ?? item?.code ?? `SITE-${index + 1}`);
        const lastSeenValue = item?.lastSeen ?? item?.lastSeenAt ?? item?.updatedAt ?? item?.eventTime;
        const lastSeenText = item?.lastSeenText ?? item?.timeAgo;
        const batteryNumeric = Number(item?.battery ?? item?.batteryLevel ?? item?.batteryPercentage);
        const battery = Number.isFinite(batteryNumeric)
          ? `${Math.max(0, Math.min(100, Math.round(batteryNumeric)))}%`
          : String(item?.battery ?? item?.batteryLevel ?? '-');

        return {
          id: siteId,
          name: String(item?.name ?? item?.siteName ?? item?.title ?? '-'),
          code: String(item?.code ?? item?.deviceCode ?? item?.deviceId ?? siteId),
          status: String(item?.status ?? item?.siteStatus ?? 'Unknown'),
          location: String(item?.location ?? item?.region ?? item?.address ?? '-'),
          battery,
          lastSeen: String(lastSeenText ?? this.formatLastSeen(lastSeenValue))
        };
      });
  }

  private extractDashboardSummary(response: any): DashboardSummary | null {
    const source = response?.data?.pageData ?? response?.data ?? response;

    if (!source || typeof source !== 'object') {
      return null;
    }

    const toMetric = (value: any): DashboardMetric => {
      if (typeof value === 'number') {
        return {
          current: Number.isFinite(value) ? value : 0,
          previous: 0,
          difference: 0,
          percentage: 0
        };
      }

      return {
        current: Number(value?.current ?? 0),
        previous: Number(value?.previous ?? 0),
        difference: Number(value?.difference ?? 0),
        percentage: Number(value?.percentage ?? 0)
      };
    };

    return {
      totalSites: toMetric(source.totalSites ?? source.activeDevices),
      onlineOnce: toMetric(source.onlineOnce),
      activeAlerts: toMetric(source.activeAlerts),
      messagesPerMinute: toMetric(source.messagesPerMinute ?? source.packetsPerMinute)
    };
  }

  private extractLocationsOverviewRows(response: any): LocationOverviewRow[] {
    const payload = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.pageData)
      ? response.data.pageData
      : [];

    const locations = payload.filter((item: any) => !!item && typeof item === 'object');
    const locationById = new Map<string, any>();
    const childrenByParentId = new Map<string, any[]>();

    locations.forEach((item: any) => {
      if (item?.id !== undefined && item?.id !== null) {
        locationById.set(String(item.id), item);
      }

      if (item?.parentId !== undefined && item?.parentId !== null) {
        const parentId = String(item.parentId);
        if (!childrenByParentId.has(parentId)) {
          childrenByParentId.set(parentId, []);
        }
        childrenByParentId.get(parentId)?.push(item);
      }
    });

    const resolveRegion = (item: any): string => {
      if (item?.regionId !== undefined && item?.regionId !== null) {
        const region = locationById.get(String(item.regionId));
        if (region?.name) {
          return String(region.name);
        }
      }

      if (item?.level === 1 && item?.name) {
        return String(item.name);
      }

      let current = item;
      const visited = new Set<string>();
      while (current?.parentId !== undefined && current?.parentId !== null) {
        const parentId = String(current.parentId);
        if (visited.has(parentId)) {
          break;
        }

        visited.add(parentId);
        const parent = locationById.get(parentId);
        if (!parent) {
          break;
        }

        if ((parent?.level === 1 || String(parent?.type ?? '').toLowerCase() === 'region') && parent?.name) {
          return String(parent.name);
        }

        current = parent;
      }

      return '-';
    };

    return locations
      .filter((item: any) => String(item?.type ?? '').toLowerCase() !== 'region')
      .map((item: any) => {
        const utilizationValue = Number(item?.utilization);
        const id = String(item?.id ?? item?.code ?? item?.name ?? '');
        const children = childrenByParentId.get(id) ?? [];
        const siteChildrenCount = children.filter(
          child => String(child?.type ?? '').toLowerCase() === 'site'
        ).length;
        const defaultChildrenCount = children.length;
        const statusFromIsActive =
          typeof item?.isActive === 'boolean'
            ? item.isActive
              ? 'Active'
              : 'Inactive'
            : String(item?.status ?? 'Unknown');

        return {
          id,
          name: String(item?.name ?? '-'),
          code: String(item?.code ?? '-'),
          region: resolveRegion(item),
          sites: Number(item?.siteCount ?? (siteChildrenCount || defaultChildrenCount || 0)),
          status: statusFromIsActive,
          utilization: Number.isFinite(utilizationValue)
            ? Math.max(0, Math.min(100, utilizationValue))
            : null
        };
      })
        .sort((a: LocationOverviewRow, b: LocationOverviewRow) => a.name.localeCompare(b.name));
  }

  getSignedValue(value: number): string {
    return value > 0 ? `+${value}` : `${value}`;
  }

  getWeeklyAlertBarHeight(alertValue: number): number {
    const values = this.weeklyAlerts.map(item => item.value);
    const maxValue = Math.max(1, ...values);
    const normalized = (Math.max(0, alertValue) / maxValue) * 150;

    if (alertValue <= 0) {
      return 0;
    }

    return Math.max(8, Math.round(normalized));
  }

  hasWeeklyAlertsData(): boolean {
    return this.weeklyAlerts.some(item => item.value > 0);
  }

  hasTelemetryData(): boolean {
    return this.telemetryChartOptions.seriesData.some(series =>
      series.data.some(value => Number.isFinite(value))
    );
  }

  hasRecentDevicesData(): boolean {
    return this.recentDevices.length > 0;
  }

  hasWeeklyActivityData(): boolean {
    return this.weeklyActivityOptions.seriesData.some(series =>
      series.data.some(value => Number(value) > 0)
    );
  }

  getStatusBadgeClass(status: string): string {
    const normalized = String(status ?? '').trim().toLowerCase();

    if (normalized.includes('online') || normalized.includes('active')) {
      return 'online';
    }

    if (normalized.includes('offline') || normalized.includes('inactive') || normalized.includes('down')) {
      return 'offline';
    }

    return 'warning';
  }

  private normalizeWeekDay(value: any): string | null {
    const key = this.getWeekDayKey(value);
    const byKey = new Map<string, string>([
      ['mon', 'Mon'],
      ['monday', 'Mon'],
      ['tue', 'Tue'],
      ['tues', 'Tue'],
      ['tuesday', 'Tue'],
      ['wed', 'Wed'],
      ['wednesday', 'Wed'],
      ['thu', 'Thu'],
      ['thur', 'Thu'],
      ['thurs', 'Thu'],
      ['thursday', 'Thu'],
      ['fri', 'Fri'],
      ['friday', 'Fri'],
      ['sat', 'Sat'],
      ['saturday', 'Sat'],
      ['sun', 'Sun'],
      ['sunday', 'Sun']
    ]);

    return byKey.get(key) ?? null;
  }

  private getWeekDayFromDate(value: any): string | null {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return null;
    }

    const byIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return byIndex[date.getUTCDay()] ?? null;
  }

  private getWeekDayKey(value: any): string {
    return String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z]/g, '');
  }

  private formatLastSeen(value: any): string {
    if (!value) {
      return '-';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  private patchTelemetryChart(response: any): void {
    const stats = this.extractTelemetryStats(response);
    if (!stats.length) {
      return;
    }

    this.telemetryChartOptions = {
      ...this.telemetryChartOptions,
      xAxisData: stats.map(item => this.formatHourLabel(item.hour)),
      seriesData: [
        {
          name: 'Temperature °C',
          data: stats.map(item => this.toFixedNumber(item.avgTemperature)),
          color: '#5b6cff'
        },
        {
          name: 'Humidity %',
          data: stats.map(item => this.toFixedNumber(item.avgHumidity)),
          color: '#38bdf8'
        }
      ]
    };
  }

  private extractTelemetryStats(response: any): TelemetryHourlyStat[] {
    const payload = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.pageData)
      ? response.data.pageData
      : [];

    return payload
      .map((item: any) => ({
        hour: String(item?.hour ?? ''),
        avgTemperature: Number(item?.avgTemperature ?? 0),
        avgHumidity: Number(item?.avgHumidity ?? 0)
      }))
      .filter((item: TelemetryHourlyStat) => !!item.hour)
      .sort(
        (a: TelemetryHourlyStat, b: TelemetryHourlyStat) =>
          new Date(a.hour).getTime() - new Date(b.hour).getTime()
      );
  }

  private formatHourLabel(hourIsoString: string): string {
    const date = new Date(hourIsoString);
    if (Number.isNaN(date.getTime())) {
      return hourIsoString;
    }

    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  private toFixedNumber(value: number): number {
    return Number(value.toFixed(2));
  }

  onFilterChange() {
    if (!this.hasActiveCustomer) {
      return;
    }

    this.loadRecentSites();
  }

  setRegionFilter(value: string): void {
    this.selectedRegions = value ? value : '';
    this.onRegionFilterChange();
  }

  setSubRegionFilter(value: string): void {
    this.selectedSubRegions = value ? value : '';
  }

  setStatusFilter(value: string): void {
    this.selectedStatuses = value ? value : '';
  }

  setSiteTypeFilter(value: string): void {
    this.selectedSiteTypes = value ? value : '';
  }

  setTenantFilter(value: string): void {
    this.selectedTenant = String(value ?? '').trim();
  }

  applyFilters(): void {
    this.onFilterChange();
  }

  getTotalSitesCount(): number {
    const realtimeTotal = Number(this.realtimeFleetMetrics?.totalDevices ?? 0);
    if (realtimeTotal > 0) {
      return realtimeTotal;
    }

    return Number(this.dashboardSummaryView?.totalSites?.current ?? 0);
  }

  getOnlineSitesCount(): number {
    const realtimeTotal = Number(this.realtimeFleetMetrics?.totalDevices ?? 0);
    const realtimeOnline = Number(this.realtimeFleetMetrics?.onlineDevices ?? 0);
    if (realtimeTotal > 0) {
      return Math.max(realtimeOnline, 0);
    }

    return Number(this.dashboardSummaryView?.onlineOnce?.current ?? 0);
  }

  getOfflineSitesCount(): number {
    const total = this.getTotalSitesCount();
    const online = this.getOnlineSitesCount();
    return Math.max(total - online, 0);
  }

  getActiveAlertsCount(): number {
    const realtimeTotal = Number(this.realtimeFleetMetrics?.totalDevices ?? 0);
    if (realtimeTotal > 0) {
      return Number(this.realtimeFleetMetrics?.devicesWithAlarms ?? 0);
    }

    return Number(this.dashboardSummaryView?.activeAlerts?.current ?? 0);
  }

  getPacketsPerMinute(): number {
    return Number(this.realtimeFleetMetrics?.packetsPerMinute ?? 0);
  }

  getAverageTemperatureText(): string {
    const value = this.realtimeFleetMetrics?.avgTemperatureC;
    return Number.isFinite(value) ? `${Number(value).toFixed(1)} C` : '-';
  }

  getAverageHumidityText(): string {
    const value = this.realtimeFleetMetrics?.avgHumidityPercent;
    return Number.isFinite(value) ? `${Number(value).toFixed(1)}%` : '-';
  }

  getTotalPowerText(): string {
    const value = this.realtimeFleetMetrics?.totalPowerKw;
    return Number.isFinite(value) ? `${Number(value).toFixed(2)} kW` : '-';
  }

  getCriticalAlarmCount(): number | string {
    if (!this.realtimeDevices.length) {
      return '-';
    }

    return this.realtimeDevices.filter(device => device.activeAlarmCount >= 3).length;
  }

  getMajorAlarmCount(): number | string {
    if (!this.realtimeDevices.length) {
      return '-';
    }

    return this.realtimeDevices.filter(device => device.activeAlarmCount === 2).length;
  }

  getMinorAlarmCount(): number | string {
    if (!this.realtimeDevices.length) {
      return '-';
    }

    return this.realtimeDevices.filter(device => device.activeAlarmCount === 1).length;
  }

  getFleetPercentageText(count: number): string {
    const total = this.getTotalSitesCount();
    if (total <= 0 || count <= 0) {
      return '-';
    }

    const percentage = (count / total) * 100;
    return `${percentage.toFixed(1)}%`;
  }

  getFleetDistributionCategoryCount(category: 'cp' | 'battery' | 'solar' | 'generator'): number | string {
    const total = this.fleetDistribution.totalDevices;
    if (total <= 0) {
      return '-';
    }

    if (category === 'cp') return this.fleetDistribution.cpCount;
    if (category === 'battery') return this.fleetDistribution.batteryCount;
    if (category === 'solar') return this.fleetDistribution.solarCount;
    return this.fleetDistribution.generatorCount;
  }

  getFleetDistributionDonutOptions(): any {
    const donutData = this.distributionDonutData;
    const total = donutData.reduce((sum, item) => sum + item.value, 0);

    if (total <= 0) {
      return {
        donut: true,
        showLegend: false,
        height: '180px',
        data: [{ name: 'No Data', value: 1, color: '#cbd5e1' }]
      };
    }

    return {
      donut: true,
      showLegend: false,
      height: '180px',
      data: donutData
    };
  }

  getFleetDistributionConfigCount(configKey: 'cpOnly' | 'cpBattery' | 'cpBatterySolar' | 'cpBatteryGen' | 'allSources'): number | string {
    const total = this.fleetDistribution.totalDevices;
    if (total <= 0) {
      return '-';
    }

    return this.fleetDistribution.configCounts[configKey] ?? 0;
  }

  getFleetDistributionConfigShare(configKey: 'cpOnly' | 'cpBattery' | 'cpBatterySolar' | 'cpBatteryGen' | 'allSources'): number {
    const total = this.fleetDistribution.totalDevices;
    if (total <= 0) {
      return 0;
    }

    const count = this.fleetDistribution.configCounts[configKey] ?? 0;
    return Math.max(0, Math.min(100, (count / total) * 100));
  }

  private toPositiveInt(value: any): number {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      return 0;
    }

    return parsed;
  }

  private mapStatusToCode(value: string): number {
    const numeric = this.toPositiveInt(value);
    if (numeric > 0) {
      return numeric;
    }

    const lookup = new Map<string, number>([
      ['online', 1],
      ['offline', 2],
      ['warning', 3],
      ['error', 4]
    ]);

    return lookup.get(String(value ?? '').trim().toLowerCase()) ?? 0;
  }
}
