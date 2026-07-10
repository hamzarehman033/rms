import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { GraphRequestPayload, GraphResponse, GraphSeries, GraphTimeframe, GraphService } from '@app/core';
import { LineChartOptions } from '../../../shared/components/chart-components';
import { Subject, debounceTime, takeUntil } from 'rxjs';

interface ChartViewState {
  loading: boolean;
  error: string | null;
  hasData: boolean;
}

interface LineChartMapConfig {
  seriesNameOrder?: string[];
  colorBySeriesName?: Record<string, string>;
  smooth?: boolean;
}

@Component({
  selector: 'app-analysis-view',
  standalone: false,
  templateUrl: './analysis-view.component.html',
  styleUrl: './analysis-view.component.css'
})
export class AnalysisViewComponent implements OnInit, OnChanges, OnDestroy {
  @Input() deviceDetails: any = null;

  selectedDeviceDetails: any = null;
  selectedTimeframe: GraphTimeframe = '24h';

  timeframeOptions: Array<{ label: string; value: GraphTimeframe }> = [
    { label: 'Last 24 Hours', value: '24h' },
    { label: 'Last 7 Days', value: '7days' },
    { label: 'Last 30 Days', value: '30days' },
  ];

  siteTotalLoadChartOptions: LineChartOptions = this.createEmptyLineChart();
  gridVoltageChartOptions: LineChartOptions = this.createEmptyLineChart();
  tenantLoadTrendsChartOptions: LineChartOptions = this.createEmptyLineChart();
  batterySocChartOptions: LineChartOptions = this.createEmptyLineChart();
  solarYieldChartOptions: LineChartOptions = this.createEmptyLineChart();

  siteTotalLoadState: ChartViewState = { loading: false, error: null, hasData: false };
  gridVoltageState: ChartViewState = { loading: false, error: null, hasData: false };
  tenantLoadTrendsState: ChartViewState = { loading: false, error: null, hasData: false };
  batterySocState: ChartViewState = { loading: false, error: null, hasData: false };
  solarYieldState: ChartViewState = { loading: false, error: null, hasData: false };

  private readonly destroy$ = new Subject<void>();
  private readonly filtersChanged$ = new Subject<void>();
  private siteTotalLoadRequestId = 0;
  private gridVoltageRequestId = 0;
  private tenantLoadRequestId = 0;
  private batterySocRequestId = 0;
  private solarYieldRequestId = 0;

  constructor(
    private readonly graphApi: GraphService,
  ) {}

  ngOnInit(): void {
    this.filtersChanged$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => {
        this.refetchAllCharts();
      });

    this.syncDeviceSelection(this.deviceDetails);
    this.refetchAllCharts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('deviceDetails' in changes) {
      this.syncDeviceSelection(this.deviceDetails);
      this.refetchAllCharts();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFiltersChanged(): void {
    this.filtersChanged$.next();
  }

  retrySiteTotalLoad(): void {
    this.loadSiteTotalLoad(true);
  }

  retryGridVoltage(): void {
    this.loadGridVoltage(true);
  }

  retryTenantLoadTrends(): void {
    this.loadTenantLoadTrends(true);
  }

  retryBatterySoc(): void {
    this.loadBatterySoc(true);
  }

  retrySolarYield(): void {
    this.loadSolarYield(true);
  }

  private syncDeviceSelection(details: any): void {
    this.selectedDeviceDetails = details ?? null;
  }

  private refetchAllCharts(): void {
    this.loadSiteTotalLoad();
    this.loadGridVoltage();
    this.loadTenantLoadTrends();
    this.loadBatterySoc();
    this.loadSolarYield();
  }

  private buildRequestPayload(): GraphRequestPayload {
    const payload: GraphRequestPayload = {
      timeframe: this.selectedTimeframe,
    };

    const deviceId = this.coerceOptionalNumber(this.selectedDeviceDetails?.id);
    if (deviceId !== null) {
      payload.deviceId = deviceId;
    }

    return payload;
  }

  private loadSiteTotalLoad(forceRefresh = false): void {
    const requestId = ++this.siteTotalLoadRequestId;
    this.siteTotalLoadState = { ...this.siteTotalLoadState, loading: true, error: null };

    this.graphApi
      .getSiteTotalLoad(this.buildRequestPayload(), forceRefresh ? { forceRefresh: true } : undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (requestId !== this.siteTotalLoadRequestId) {
            return;
          }

          const adapted = this.mapGraphToLineChart(response, {});
          this.siteTotalLoadChartOptions = adapted.options;
          this.siteTotalLoadState = { loading: false, error: null, hasData: !adapted.isEmpty };
        },
        error: (error: unknown) => {
          if (requestId !== this.siteTotalLoadRequestId) {
            return;
          }

          this.siteTotalLoadChartOptions = this.createEmptyLineChart();
          this.siteTotalLoadState = { loading: false, error: this.resolveErrorMessage(error), hasData: false };
        },
      });
  }

  private loadGridVoltage(forceRefresh = false): void {
    const requestId = ++this.gridVoltageRequestId;
    this.gridVoltageState = { ...this.gridVoltageState, loading: true, error: null };

    this.graphApi
      .getGridVoltage(this.buildRequestPayload(), forceRefresh ? { forceRefresh: true } : undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (requestId !== this.gridVoltageRequestId) {
            return;
          }

          const adapted = this.mapGraphToLineChart(response, {
            seriesNameOrder: ['L1', 'L2', 'L3'],
            colorBySeriesName: {
              L1: '#22c55e',
              L2: '#38bdf8',
              L3: '#f59e0b',
            },
          });
          this.gridVoltageChartOptions = adapted.options;
          this.gridVoltageState = { loading: false, error: null, hasData: !adapted.isEmpty };
        },
        error: (error: unknown) => {
          if (requestId !== this.gridVoltageRequestId) {
            return;
          }

          this.gridVoltageChartOptions = this.createEmptyLineChart();
          this.gridVoltageState = { loading: false, error: this.resolveErrorMessage(error), hasData: false };
        },
      });
  }

  private loadTenantLoadTrends(forceRefresh = false): void {
    const requestId = ++this.tenantLoadRequestId;
    this.tenantLoadTrendsState = { ...this.tenantLoadTrendsState, loading: true, error: null };

    this.graphApi
      .getTenantLoadTrends(this.buildRequestPayload(), forceRefresh ? { forceRefresh: true } : undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (requestId !== this.tenantLoadRequestId) {
            return;
          }

          const adapted = this.mapGraphToLineChart(response, {
            seriesNameOrder: ['Tenant1', 'Tenant2', 'Tenant3', 'Tenant4'],
          });
          this.tenantLoadTrendsChartOptions = adapted.options;
          this.tenantLoadTrendsState = { loading: false, error: null, hasData: !adapted.isEmpty };
        },
        error: (error: unknown) => {
          if (requestId !== this.tenantLoadRequestId) {
            return;
          }

          this.tenantLoadTrendsChartOptions = this.createEmptyLineChart();
          this.tenantLoadTrendsState = { loading: false, error: this.resolveErrorMessage(error), hasData: false };
        },
      });
  }

  private loadBatterySoc(forceRefresh = false): void {
    const requestId = ++this.batterySocRequestId;
    this.batterySocState = { ...this.batterySocState, loading: true, error: null };

    this.graphApi
      .getBatterySoc(this.buildRequestPayload(), forceRefresh ? { forceRefresh: true } : undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (requestId !== this.batterySocRequestId) {
            return;
          }

          const adapted = this.mapGraphToLineChart(response, {
            smooth: true,
          });
          this.batterySocChartOptions = adapted.options;
          this.batterySocState = { loading: false, error: null, hasData: !adapted.isEmpty };
        },
        error: (error: unknown) => {
          if (requestId !== this.batterySocRequestId) {
            return;
          }

          this.batterySocChartOptions = this.createEmptyLineChart();
          this.batterySocState = { loading: false, error: this.resolveErrorMessage(error), hasData: false };
        },
      });
  }

  private loadSolarYield(forceRefresh = false): void {
    const requestId = ++this.solarYieldRequestId;
    this.solarYieldState = { ...this.solarYieldState, loading: true, error: null };

    this.graphApi
      .getSolarYield(this.buildRequestPayload(), forceRefresh ? { forceRefresh: true } : undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (requestId !== this.solarYieldRequestId) {
            return;
          }

          const adapted = this.mapGraphToLineChart(response, {
            smooth: true,
          });
          this.solarYieldChartOptions = adapted.options;
          this.solarYieldState = { loading: false, error: null, hasData: !adapted.isEmpty };
        },
        error: (error: unknown) => {
          if (requestId !== this.solarYieldRequestId) {
            return;
          }

          this.solarYieldChartOptions = this.createEmptyLineChart();
          this.solarYieldState = { loading: false, error: this.resolveErrorMessage(error), hasData: false };
        },
      });
  }

  private createEmptyLineChart(): LineChartOptions {
    return {
      xAxisData: [],
      seriesData: [],
      showLegend: true,
      smooth: true,
      showSymbol: false,
    };
  }

  private coerceOptionalNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
  }

  private resolveErrorMessage(error: unknown): string {
    if (typeof error === 'string' && error.trim()) {
      return error;
    }

    if (error && typeof error === 'object' && 'error' in error) {
      const errorField = (error as { error?: unknown }).error;
      if (typeof errorField === 'string' && errorField.trim()) {
        return errorField;
      }
      if (errorField && typeof errorField === 'object' && 'message' in errorField) {
        const nestedMessage = (errorField as { message?: unknown }).message;
        if (typeof nestedMessage === 'string' && nestedMessage.trim()) {
          return nestedMessage;
        }
      }
    }

    if (error && typeof error === 'object' && 'message' in error) {
      const message = (error as { message?: unknown }).message;
      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }

    return 'Unable to load chart data at the moment.';
  }

  private mapGraphToLineChart(
    graph: GraphResponse,
    config: LineChartMapConfig,
  ): { options: LineChartOptions; isEmpty: boolean } {
    const aligned = this.alignSeries(graph.series, config.seriesNameOrder);
    const hasAnyValue = aligned.series.some((series) =>
      series.data.some((value) => value !== null),
    );

    return {
      options: {
        xAxisData: aligned.timestamps,
        seriesData: aligned.series.map((series) => ({
          name: series.name,
          data: series.data,
          color: config.colorBySeriesName?.[series.name],
        })),
        showLegend: true,
        smooth: config.smooth ?? true,
        showSymbol: false,
      },
      isEmpty: !hasAnyValue,
    };
  }

  private alignSeries(seriesList: GraphSeries[], preferredOrder?: string[]): {
    timestamps: string[];
    series: Array<{ name: string; data: Array<number | null> }>;
  } {
    const timestampSet = new Set<string>();

    seriesList.forEach((series) => {
      series.points.forEach((point) => {
        timestampSet.add(point.timestamp);
      });
    });

    const rawTimestamps = Array.from(timestampSet).sort((left, right) => {
      return new Date(left).getTime() - new Date(right).getTime();
    });

    const orderedSeries = this.orderSeries(seriesList, preferredOrder);

    return {
      timestamps: rawTimestamps.map((value) => this.formatTimestamp(value)),
      series: orderedSeries.map((series) => {
        const byTimestamp = new Map<string, number | null>();
        series.points.forEach((point) => {
          byTimestamp.set(point.timestamp, point.value);
        });

        return {
          name: series.name,
          data: rawTimestamps.map((timestamp) => byTimestamp.get(timestamp) ?? null),
        };
      }),
    };
  }

  private orderSeries(seriesList: GraphSeries[], preferredOrder?: string[]): GraphSeries[] {
    if (!preferredOrder || preferredOrder.length === 0) {
      return [...seriesList];
    }

    const orderLookup = new Map<string, number>();
    preferredOrder.forEach((name, index) => {
      orderLookup.set(name.toLowerCase(), index);
    });

    return [...seriesList].sort((left, right) => {
      const leftOrder = orderLookup.get(left.name.toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = orderLookup.get(right.name.toLowerCase()) ?? Number.MAX_SAFE_INTEGER;

      if (leftOrder === rightOrder) {
        return left.name.localeCompare(right.name);
      }

      return leftOrder - rightOrder;
    });
  }

  private formatTimestamp(timestamp: string): string {
    const parsed = new Date(timestamp);

    if (Number.isNaN(parsed.getTime())) {
      return timestamp;
    }

    return parsed.toLocaleString([], {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
