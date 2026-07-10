import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DevicesService, SignalrService, Site, ToastService } from '@app/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DecodedPayload, DeviceDataEvent } from '../../core/constants/device-message.model';
import { SitesStreamStateService } from './sites-stream-state.service';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrl: './sites.component.css',
  standalone: false,
})
export class SitesComponent implements OnInit, OnDestroy {
  displayAddSiteDialog = false;
  displayEditSiteDialog = false;
  displayConfigDialog = false;
  selectedSiteForConfig: Site | null = null;
  selectedSiteForEdit: Site | null = null;
  selectedTab = 0;
  isLoading = false;

  sites: Site[] = [];
  allSites: Site[] = [];
  private readonly destroy$ = new Subject<void>();
  private readonly powerSourceByDeviceId = new Map<number, string>();
  private readonly realtimeMetricsByDeviceId = new Map<number, { batteryPercent: number | null; loadKw: number | null }>();
  private readonly activeStreamingDeviceIds: Set<number>;
  private readonly streamActionInProgressIds: Set<number>;

  constructor(
    private router: Router,
    private devicesService: DevicesService,
    private signalrService: SignalrService,
    private toastService: ToastService,
    private sitesStreamStateService: SitesStreamStateService
  ) {
    this.activeStreamingDeviceIds = this.sitesStreamStateService.activeStreamingDeviceIds;
    this.streamActionInProgressIds = this.sitesStreamStateService.streamActionInProgressIds;
  }

  ngOnInit(): void {
    this.initializeRealtimeStream();
    this.loadSites();
  }

  ngOnDestroy(): void {
    this.powerSourceByDeviceId.clear();
    this.realtimeMetricsByDeviceId.clear();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSites(): void {
    this.isLoading = true;
    this.devicesService.getDevices().subscribe({
      next: (response: any) => {
        const list = response?.data?.pageData || response?.data || response || [];
        const normalized = Array.isArray(list) ? list : [];
        this.powerSourceByDeviceId.clear();
        for (const item of normalized) {
          const deviceId = this.toDeviceNumericIdFromAny(item);
          if (deviceId !== null) {
            this.powerSourceByDeviceId.set(deviceId, this.resolvePowerSourceLabel(item));
          }
        }
        this.allSites = normalized.map((item: any) => this.mapApiSite(item));
        this.sites = this.getFilteredSites();
        this.isLoading = false;
      },
      error: () => {
        this.allSites = [];
        this.sites = [];
        this.powerSourceByDeviceId.clear();
        this.isLoading = false;
        this.toastService.showError('Failed to load sites');
      }
    });
  }

  onTabChange(tab: number): void {
    this.selectedTab = tab;
    this.sites = this.getFilteredSites();
  }

  getAllCount(): number {
    return this.allSites.length;
  }

  getOnlineCount(): number {
    return this.allSites.filter(site => this.isOnlineStatus(site.status)).length;
  }

  getOfflineCount(): number {
    return this.allSites.filter(site => this.isOfflineStatus(site.status)).length;
  }

  getWarningCount(): number {
    return this.allSites.filter(site => {
      const normalized = String(site?.status ?? '').trim().toLowerCase();
      return normalized === 'warning';
    }).length;
  }

  getActiveAlarmsCount(): number {
    let total = 0;
    let hasExplicitAlarmData = false;

    for (const site of this.allSites) {
      const anySite = site as any;
      const rawAlarmValue = anySite.activeAlarms
        ?? anySite.activeAlerts
        ?? anySite.alarmCount
        ?? anySite.alarmsCount
        ?? anySite.warningCount;

      const parsedAlarmValue = Number(rawAlarmValue);
      if (Number.isFinite(parsedAlarmValue)) {
        total += parsedAlarmValue;
        hasExplicitAlarmData = true;
      }
    }

    if (hasExplicitAlarmData) {
      return total;
    }

    return this.allSites.filter(site => {
      const normalized = String(site?.status ?? '').trim().toLowerCase();
      return normalized === 'warning' || normalized === 'offline' || normalized === 'down';
    }).length;
  }

  getPowerSource(site: Site): string {
    const deviceId = this.toDeviceNumericId(site);
    if (deviceId === null) {
      return '-';
    }

    return this.powerSourceByDeviceId.get(deviceId) ?? '-';
  }

  getBatteryPercentage(site: Site): string {
    const deviceId = this.toDeviceNumericId(site);
    if (deviceId === null) {
      return '-';
    }

    const metric = this.realtimeMetricsByDeviceId.get(deviceId);
    const value = metric?.batteryPercent;
    if (!Number.isFinite(value)) {
      return '-';
    }

    const normalized = Math.max(0, Math.min(100, Math.round(value as number)));
    return `${normalized}%`;
  }

  getLoadKw(site: Site): string {
    const deviceId = this.toDeviceNumericId(site);
    if (deviceId === null) {
      return '-';
    }

    const metric = this.realtimeMetricsByDeviceId.get(deviceId);
    const value = metric?.loadKw;
    if (!Number.isFinite(value)) {
      return '-';
    }

    return `${(value as number).toFixed(2)} kW`;
  }

  private getFilteredSites(): Site[] {
    if (this.selectedTab === 1) {
      return this.allSites.filter(site => this.isOnlineStatus(site.status));
    }

    if (this.selectedTab === 2) {
      return this.allSites.filter(site => this.isOfflineStatus(site.status));
    }

    return this.allSites;
  }

  private isOnlineStatus(status: any): boolean {
    const normalized = String(status ?? '').trim().toLowerCase();
    return normalized === 'online' || normalized === 'active';
  }

  private isOfflineStatus(status: any): boolean {
    const normalized = String(status ?? '').trim().toLowerCase();
    return normalized === 'offline' || normalized === 'inactive' || normalized === 'down';
  }

  openAddSiteDialog() {
    this.displayAddSiteDialog = true;
  }

  onSiteAdded() {
    this.displayAddSiteDialog = false;
    this.loadSites();
  }

  onSiteEdited() {
    this.displayEditSiteDialog = false;
    this.selectedSiteForEdit = null;
    this.loadSites();
  }

  openEditSiteDialog(site: Site): void {
    this.selectedSiteForEdit = site;
    this.displayEditSiteDialog = true;
  }

  navigateToSiteDashboard(siteId: string | number) {
    this.router.navigate(['/site-dashboard', siteId]);
  }

  navigateToSiteDetail(siteId: string | number) {
    this.router.navigate(['/site-detail'], { queryParams: { id: siteId } });
  }

  openSiteConfiguration(site: Site) {
    this.selectedSiteForConfig = site;
    this.displayConfigDialog = true;
  }

  isDeviceStreaming(device: Site): boolean {
    const deviceId = this.toDeviceNumericId(device);
    return deviceId !== null && this.activeStreamingDeviceIds.has(deviceId);
  }

  isStreamActionInProgress(device: Site): boolean {
    const deviceId = this.toDeviceNumericId(device);
    return deviceId !== null && this.streamActionInProgressIds.has(deviceId);
  }

  async toggleDeviceStream(device: Site): Promise<void> {
    const deviceId = this.toDeviceNumericId(device);
    if (deviceId === null) {
      this.toastService.showError('Invalid device id');
      return;
    }

    if (this.streamActionInProgressIds.has(deviceId)) {
      return;
    }

    const isActive = this.activeStreamingDeviceIds.has(deviceId);
    this.streamActionInProgressIds.add(deviceId);

    if (!isActive) {
      this.devicesService.startDeviceListening(deviceId).subscribe({
        next: async (response: any) => {
          try {
            await this.signalrService.start();
            await this.signalrService.subscribeToDevice(deviceId);
            this.activeStreamingDeviceIds.add(deviceId);
            this.toastService.showSuccess(response.message || 'Stream started');
          } catch (error) {
            this.toastService.showError('Failed to open socket subscription');
          } finally {
            this.streamActionInProgressIds.delete(deviceId);
          }
        },
        error: (error: any) => {
          this.streamActionInProgressIds.delete(deviceId);
          this.toastService.showError(error?.error?.message || 'Failed to start MQTT listener');
        }
      });
      return;
    }

    this.devicesService.stopDeviceListening(deviceId).subscribe({
      next: async (response: any) => {
        try {
          await this.signalrService.unsubscribeFromDevice(deviceId);
          this.activeStreamingDeviceIds.delete(deviceId);
          this.toastService.showSuccess(response.message || 'Stream stopped');
        } catch (error) {
          this.toastService.showError('Failed to close socket subscription');
        } finally {
          this.streamActionInProgressIds.delete(deviceId);
        }
      },
      error: (error: any) => {
        this.streamActionInProgressIds.delete(deviceId);
        this.toastService.showError(error?.error?.message || 'Failed to stop MQTT listener');
      }
    });
  }

  onSiteConfigured() {
    this.displayConfigDialog = false;
    this.selectedSiteForConfig = null;
  }

  private initializeRealtimeStream(): void {
    this.signalrService.onDeviceData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: DeviceDataEvent | null) => {
        if (!event || !event.decodedPayload) {
          return;
        }

        this.applyRealtimeMetrics(event);
      });
  }

  private applyRealtimeMetrics(event: DeviceDataEvent): void {
    const payload: DecodedPayload = (event.decodedPayload ?? {}) as DecodedPayload;
    const eventDeviceId = this.toNumericValue(event.deviceId) ?? this.toNumericValue(payload?.deviceId);

    if (eventDeviceId === null) {
      return;
    }

    const hasMatchingSite = this.allSites.some(site => this.toDeviceNumericId(site) === eventDeviceId);
    if (!hasMatchingSite) {
      return;
    }

    const batteryPercent = this.toNumericValue(payload?.batteryRemainingPercent);
    const dcLoadPowerW = this.toNumericValue(payload?.dcLoadPowerW);
    const loadKw = dcLoadPowerW === null ? null : dcLoadPowerW / 1000;

    this.realtimeMetricsByDeviceId.set(eventDeviceId, {
      batteryPercent,
      loadKw
    });
  }

  private toDeviceNumericId(site: Site): number | null {
    const idValue = site?.deviceId ?? site?.siteId;
    const parsed = Number(idValue);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  private mapApiSite(item: Site ): Site {
    return {
      siteId: item.siteId || item.deviceId || (item as any).id,
      siteName: item.siteName || item.name || '',
      siteStatus: item.siteStatus || item.status || 'active',
      deviceId: item.deviceId || (item as any).id,
      deviceName: item.deviceName,
      deviceCode: item.deviceCode,
      deviceStatus: item.deviceStatus,
      deviceInstallationDate: item.deviceInstallationDate,
      siteCode: item.siteCode || item.code || '',
      regionId: item.regionId,
      regionName: item.regionName || '-',
      subRegionId: item.subRegionId,
      subRegionName: item.subRegionName || '-',
      zoneId: item.zoneId,
      zoneName: item.zoneName || '-',
      name: item.siteName || item.name || '',
      status: (item.siteStatus || item.status || 'active').toString().toLowerCase(),
      code: item.siteCode || item.code || '',
      address: item.address || '',
      coordinates: item.coordinates || '',
      mqttHost: item.mqttHost,
      mqttPort: item.mqttPort,
      mqttClientId: item.mqttClientId,
      useTls: item.useTls,
      keepAliveSeconds: item.keepAliveSeconds,
      rmsSubscribeTopic: item.rmsSubscribeTopic,
      aiSubscribeTopic: item.aiSubscribeTopic,
      type: item.type || 'Site',
      location: item.location || item.address || '-',
      battery: item.battery || '-',
      lastSeen: item.lastSeen || item.deviceInstallationDate || '-',
      ...(item as any).activeAlarms !== undefined ? { activeAlarms: (item as any).activeAlarms } : {},
      ...(item as any).activeAlerts !== undefined ? { activeAlerts: (item as any).activeAlerts } : {},
      ...(item as any).alarmCount !== undefined ? { alarmCount: (item as any).alarmCount } : {},
      ...(item as any).alarmsCount !== undefined ? { alarmsCount: (item as any).alarmsCount } : {},
      ...(item as any).warningCount !== undefined ? { warningCount: (item as any).warningCount } : {}
    };
  }

  private resolvePowerSourceLabel(item: any): string {
    const explicitValue = item?.powerSource
      ?? item?.powerSourceName
      ?? item?.powerSourceType
      ?? item?.powerConfiguration
      ?? item?.sourceConfiguration;

    if (explicitValue !== null && explicitValue !== undefined && String(explicitValue).trim() !== '') {
      return String(explicitValue).trim();
    }

    const source = item?.infrastructure ?? item?.deviceInfrastructure ?? item ?? {};
    const supportsCp = this.hasPositiveCapability(source?.rectifierQty ?? source?.rectifierInstalledCount);
    const supportsBattery = this.hasPositiveCapability(source?.batteryQty);
    const supportsSolar = this.hasPositiveCapability(source?.solarQty);
    const supportsGenerator = this.hasPositiveCapability(source?.generatorQty);

    if (supportsCp && supportsBattery && supportsSolar && supportsGenerator) {
      return 'CP + Bat + Gen + Solar';
    }
    if (supportsCp && supportsBattery && supportsSolar && !supportsGenerator) {
      return 'CP + Bat + Solar';
    }
    if (supportsCp && supportsBattery && !supportsSolar && supportsGenerator) {
      return 'CP + Bat + Gen';
    }
    if (supportsCp && supportsBattery && !supportsSolar && !supportsGenerator) {
      return 'CP + Battery';
    }
    if (supportsCp && !supportsBattery && !supportsSolar && !supportsGenerator) {
      return 'CP Only';
    }

    return '-';
  }

  private hasPositiveCapability(value: unknown): boolean {
    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric > 0;
  }

  private toDeviceNumericIdFromAny(item: any): number | null {
    const candidate = item?.deviceId ?? item?.siteId ?? item?.id;
    const parsed = Number(candidate);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  private toNumericValue(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
}
