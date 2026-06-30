import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { CustomerService } from '../../core/services/customer.service';
import { LocationsService } from '../../core/services/locations.service';
import { StatisticsService } from '../../core/services/statistics.service';

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

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  hasActiveCustomer = false;
  private readonly destroyRef = inject(DestroyRef);
  private pendingStatsRequests = 0;
  isLoadingDashboardStats = false;

  dashboardSummary: any = null;
  dashboardSummaryView: DashboardSummary | null = null;
  telemetryEnvironmentCounts: any = null;
  telemetryHourlyTempHumidityStats: any = null;
  top5DevicesByActivityInLastHour: any = null;
  recentAnomalies: any = null;
  recentAlerts: RecentAnomaly[] = [];
  private locationTree: LocationTreeNode[] = [];
  locationsOverviewRows: LocationOverviewRow[] = [];

  constructor(
    private customerService: CustomerService,
    private locationsService: LocationsService,
    private statisticsService: StatisticsService
  ) {}
  // Live Telemetry Chart Data
  telemetryChartOptions = {
    xAxisData: ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm', '12am'],
    seriesData: [
      { 
        name: 'Temperature °C', 
        data: [65, 62, 60, 68, 75, 78, 72, 68, 65],
        color: '#5b6cff'
      },
      { 
        name: 'Humidity %', 
        data: [55, 58, 62, 65, 60, 55, 58, 62, 60],
        color: '#38bdf8'
      }
    ],
    height: '250px',
    showLegend: false,
    showSymbol: false
  };

  // Device Breakdown Chart Data
  siteBreakdownOptions = {
    data: [
      { name: 'Sensors', value: 86, color: '#5b6cff' },
      { name: 'Gateways', value: 24, color: '#8a7bff' },
      { name: 'Actuators', value: 28, color: '#38bdf8' },
      { name: 'Cameras', value: 12, color: '#22c55e' }
    ],
    height: '280px',
    donut: true,
    showLegend: false
  };

  // Weekly Activity Chart Data
  weeklyActivityOptions = {
    xAxisData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    seriesData: [
      { 
        name: 'Online', 
        data: [140, 150, 135, 160, 148, 130, 155],
        color: '#22c55e'
      },
      { 
        name: 'Offline', 
        data: [6, 4, 8, 3, 5, 10, 4],
        color: '#ef4444'
      }
    ],
    height: '250px',
    showLegend: false
  };

  // Filter Properties
  searchTerm = '';
  selectedRegions: string[] = [];
  selectedSubRegions: string[] = [];
  selectedStatuses: string[] = [];
  selectedSiteTypes: string[] = [];
  selectedTimeframe = '24h';

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

  timeframeOptions = [
    { label: '24h', value: '24h' },
    { label: '7d', value: '7d' },
    { label: '30d', value: '30d' },
    { label: '90d', value: '90d' }
  ];

  timeframeMenuItems: any[] = [];

  ngOnInit(): void {
    this.customerService.activeCustomer$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(activeCustomer => {
        this.hasActiveCustomer = !!activeCustomer?.id;

        if (this.hasActiveCustomer) {
          this.loadLocationTree();
          this.loadDashboardStatistics();
        }
      });
    this.initializeTimeframeMenu();
  }

  private loadDashboardStatistics(): void {
    this.loadDashboardSummary();
    this.loadTelemetryEnvironmentCounts();
    this.loadTelemetryHourlyTempHumidityStats();
    this.loadTop5DevicesByActivityInLastHour();
    this.loadRecentAnomalies();
    this.loadLocationsOverview();
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
          this.selectedRegions = [];
          this.selectedSubRegions = [];
        }
      });
  }

  onRegionFilterChange(): void {
    this.syncSubRegionOptions();
    this.onFilterChange();
  }

  private syncSubRegionOptions(): void {
    const selectedRegionSet = new Set(this.selectedRegions.map(value => String(value)));
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
    this.selectedSubRegions = this.selectedSubRegions.filter(value =>
      validSubRegionValues.has(String(value))
    );
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
        },
        error: () => {
          this.top5DevicesByActivityInLastHour = null;
        }
      });
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

  private extractDashboardSummary(response: any): DashboardSummary | null {
    const source = response?.data?.pageData ?? response?.data ?? response;

    if (!source || typeof source !== 'object') {
      return null;
    }

    const toMetric = (value: any): DashboardMetric => ({
      current: Number(value?.current ?? 0),
      previous: Number(value?.previous ?? 0),
      difference: Number(value?.difference ?? 0),
      percentage: Number(value?.percentage ?? 0)
    });

    return {
      totalSites: toMetric(source.totalSites),
      onlineOnce: toMetric(source.onlineOnce),
      activeAlerts: toMetric(source.activeAlerts),
      messagesPerMinute: toMetric(source.messagesPerMinute)
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

  initializeTimeframeMenu() {
    this.timeframeMenuItems = this.timeframeOptions.map(option => ({
      label: option.label,
      command: () => {
        this.selectedTimeframe = option.value;
        this.onFilterChange();
      }
    }));
  }

  onFilterChange() {
    // TODO: Implement filter logic to update dashboard data
    console.log('Filters changed:', {
      searchTerm: this.searchTerm,
      regions: this.selectedRegions,
      subRegions: this.selectedSubRegions,
      statuses: this.selectedStatuses,
      siteTypes: this.selectedSiteTypes,
      timeframe: this.selectedTimeframe
    });
  }
}
