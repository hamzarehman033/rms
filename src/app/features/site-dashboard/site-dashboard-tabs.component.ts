import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DevicesService, ToastService } from '@app/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, finalize, map, takeUntil } from 'rxjs/operators';

type SiteDashboardTab =
  | 'site-pulse'
  | 'equipment-view'
  | 'event-log'
  | 'analysis'
  | 'site-details';

@Component({
  selector: 'app-site-dashboard-tabs',
  standalone: false,
  templateUrl: './site-dashboard-tabs.component.html',
  styleUrl: './site-dashboard-tabs.component.css'
})
export class SiteDashboardTabsComponent implements OnInit, OnDestroy {
  activeTab: SiteDashboardTab = 'site-pulse';
  deviceId: string | null = null;
  deviceDetails: any = null;
  isLoadingDevice = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private devicesService: DevicesService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((id) => {
        this.deviceId = id;
        if (!id) {
          this.deviceDetails = null;
          this.isLoadingDevice = false;
          return;
        }

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
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoadingDevice = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          const payload = response?.data ?? response ?? null;
          this.deviceDetails = payload
            ? {
                ...payload,
                powerSource: this.calculatePowerSource(payload),
              }
            : null;
        },
        error: () => {
          this.deviceDetails = null;
          this.toastService.showError('Failed to load device details');
        }
      });
  }

  private calculatePowerSource(device: any): string {
    const source = device;
    const supportsCp = this.hasPositiveCapability(source?.rectifierQty ?? source?.rectifierInstalledCount);
    const supportsBattery = this.hasPositiveCapability(source?.batteryQty);
    const supportsSolar = this.hasPositiveCapability(source?.solarQty);
    const supportsGenerator = this.hasPositiveCapability(source?.generatorQty);

    if (supportsCp && !supportsBattery && !supportsSolar && !supportsGenerator) {
      return 'CP Only';
    }

    if (supportsCp && supportsBattery && !supportsSolar && !supportsGenerator) {
      return 'CP + Battery';
    }

    if (supportsCp && supportsBattery && supportsSolar && !supportsGenerator) {
      return 'CP + Battery + Solar';
    }

    if (supportsCp && supportsBattery && !supportsSolar && supportsGenerator) {
      return 'CP + Battery + Generator';
    }

    if (supportsCp && supportsBattery && supportsSolar && supportsGenerator) {
      return 'CP + Battery + Generator + Solar';
    }

    if (supportsSolar && !supportsCp && !supportsBattery && !supportsGenerator) {
      return 'Solar Only';
    }

    if (supportsGenerator && !supportsCp && !supportsBattery && !supportsSolar) {
      return 'Generator Only';
    }

    return 'Unknown';
  }

  private hasPositiveCapability(value: unknown): boolean {
    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric > 0;
  }
}
