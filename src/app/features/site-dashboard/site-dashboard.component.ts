import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DevicesService, ToastService } from '@app/core';
import { LineChartOptions } from '../../shared/components/chart-components';
import { Subject, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-site-dashboard',
  standalone: false,
  templateUrl: './site-dashboard.component.html',
  styleUrl: './site-dashboard.component.css'
})
export class SiteDashboardComponent implements OnInit, OnDestroy {
  solarChartOptions: LineChartOptions;
  deviceId: string | null = null;
  isLoadingDevice = false;
  selectedDeviceDetails: any = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private devicesService: DevicesService,
    private toastService: ToastService,
  ) {
    this.solarChartOptions = this.initSolarChart();
  }

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(
        map(([params, queryParams]) => params.get('id') || queryParams.get('id')),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((id) => {
        if (!id) {
          this.deviceId = null;
          this.selectedDeviceDetails = null;
          return;
        }

        this.deviceId = id;
        this.loadDeviceDetails(id);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDeviceDetails(id: string): void {
    this.isLoadingDevice = true;
    this.devicesService.getDeviceById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          const payload = response?.data ?? response;
          this.selectedDeviceDetails = payload ?? null;
          this.isLoadingDevice = false;
        },
        error: () => {
          this.selectedDeviceDetails = null;
          this.isLoadingDevice = false;
          this.toastService.showError('Failed to load device details');
        }
      });
  }

  initSolarChart(): LineChartOptions {
    return {
      xAxisData: ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', 
                  '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'],
      seriesData: [
        {
          name: 'Solar Output (kW)',
          data: [0, 0, 0, 0, 0, 0.1, 0.3, 1.2, 2.4, 3.8, 4.5, 5.1, 5.2, 5.0, 4.8, 4.2, 3.5, 2.1, 0.8, 0.2, 0, 0, 0, 0],
          color: '#f59e0b'
        }
      ],
      height: '300px',
      showLegend: true,
      smooth: true,
      showSymbol: false
    };
  }
}
