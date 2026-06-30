import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { StatisticsService } from '../../core/services/statistics.service';

interface TelemetryHourlyStat {
  hour: string;
  avgTemperature: number;
  avgHumidity: number;
}

interface TopDeviceActivity {
  deviceLabel: string;
  reads: number;
  avg: string;
}

interface AnomalyEvent {
  title: string;
  deviceId: string;
  timeAgo: string;
  eventTime: string;
}

@Component({
  selector: 'app-telemetry',
  standalone: false,
  templateUrl: './telemetry.component.html',
  styleUrl: './telemetry.component.css'
})
export class TelemetryComponent implements OnInit {
  selectedTab = 0;
  private readonly destroyRef = inject(DestroyRef);
  isLoading = false;

  avgTemperature = 0;
  avgHumidity = 0;
  anomalyCount = 0;

  topDeviceActivities: TopDeviceActivity[] = [];
  anomalyEvents: AnomalyEvent[] = [];

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadTelemetryData();
  }

  telemetryChartOptions = {
    xAxisData: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    seriesData: [
      { 
        name: 'Temperature °C', 
        data: [68, 65, 62, 70, 75, 72, 68],
        color: '#5b6cff'
      },
      { 
        name: 'Humidity', 
        data: [42, 45, 48, 40, 35, 42, 40],
        color: '#38bdf8'
      }
    ],
    height: '340px',
    showLegend: false,
    smooth: true,
    showSymbol: false
  };

  private loadTelemetryData(): void {
    this.isLoading = true;

    this.statisticsService
      .getTelemetryHourlyTempHumidityStats({})
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: result => {
          const stats = this.extractTelemetryStats(result);
          this.patchTelemetryChart(stats);
          this.patchAverageCards(stats);
        }
      });

    this.statisticsService
      .getTop5DevicesByActivityInLastHour()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: result => {
          this.topDeviceActivities = this.extractTopDeviceActivities(result);
        },
        error: () => {
          this.topDeviceActivities = [];
        }
      });

    this.statisticsService
      .getRecentAnomalies()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: result => {
          this.anomalyEvents = this.extractAnomalyEvents(result);
          this.anomalyCount = this.anomalyEvents.length;
        },
        error: () => {
          this.anomalyEvents = [];
          this.anomalyCount = 0;
        }
      });
  }

  private extractPayloadArray(response: any): any[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.data?.pageData)) {
      return response.data.pageData;
    }

    return [];
  }

  private extractTelemetryStats(response: any): TelemetryHourlyStat[] {
    return this.extractPayloadArray(response)
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

  private patchTelemetryChart(stats: TelemetryHourlyStat[]): void {
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

  private patchAverageCards(stats: TelemetryHourlyStat[]): void {
    if (!stats.length) {
      this.avgTemperature = 0;
      this.avgHumidity = 0;
      return;
    }

    const tempSum = stats.reduce((sum, item) => sum + item.avgTemperature, 0);
    const humiditySum = stats.reduce((sum, item) => sum + item.avgHumidity, 0);
    this.avgTemperature = this.toFixedNumber(tempSum / stats.length);
    this.avgHumidity = this.toFixedNumber(humiditySum / stats.length);
  }

  private extractTopDeviceActivities(response: any): TopDeviceActivity[] {
    return this.extractPayloadArray(response).map((item: any) => ({
      deviceLabel: String(item?.deviceName ?? item?.name ?? item?.deviceId ?? '-'),
      reads: Number(item?.reads ?? item?.activityCount ?? item?.count ?? 0),
      avg: this.extractDeviceAverage(item)
    }));
  }

  private extractDeviceAverage(item: any): string {
    if (item?.avgTemperature !== undefined && item?.avgTemperature !== null) {
      return `${this.toFixedNumber(Number(item.avgTemperature))} °C`;
    }

    if (item?.avgHumidity !== undefined && item?.avgHumidity !== null) {
      return `${this.toFixedNumber(Number(item.avgHumidity))} %`;
    }

    if (item?.avgValue !== undefined && item?.avgValue !== null) {
      const unit = String(item?.unit ?? '').trim();
      return unit
        ? `${this.toFixedNumber(Number(item.avgValue))} ${unit}`
        : `${this.toFixedNumber(Number(item.avgValue))}`;
    }

    return '-';
  }

  private extractAnomalyEvents(response: any): AnomalyEvent[] {
    return this.extractPayloadArray(response).map((item: any) => ({
      title: String(item?.title ?? ''),
      deviceId: String(item?.deviceId ?? ''),
      timeAgo: String(item?.timeAgo ?? ''),
      eventTime: String(item?.eventTime ?? '')
    }));
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
}
