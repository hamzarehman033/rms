import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DevicesService, RealtimeDataSourceService, SignalrService, Site, ToastService } from '@app/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SitesStreamStateService } from './sites-stream-state.service';

type SiteFilterTab = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

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
  selectedTab: SiteFilterTab = 0;
  searchTerm = '';
  isLoading = false;
  private selectedPowerSourceFilter = '';

  sites: Site[] = [];
  allSites: Site[] = [];
  private readonly destroy$ = new Subject<void>();
  private readonly powerSourceByDeviceId = new Map<number, string>();
  private readonly realtimeMetricsByDeviceId = new Map<number, {
    batteryPercent: number | null;
    loadKw: number | null;
    dcBusVoltage: number | null;
    gridVoltage: number | null;
    activeAlarmCount: number;
    alarmSeverity: string | null;
  }>();
  private readonly activeStreamingDeviceIds: Set<number>;
  private readonly streamActionInProgressIds: Set<number>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private devicesService: DevicesService,
    private signalrService: SignalrService,
    private toastService: ToastService,
    private sitesStreamStateService: SitesStreamStateService,
    private realtimeDataSourceService: RealtimeDataSourceService
  ) {
    this.activeStreamingDeviceIds = this.sitesStreamStateService.activeStreamingDeviceIds;
    this.streamActionInProgressIds = this.sitesStreamStateService.streamActionInProgressIds;
  }

  ngOnInit(): void {
    this.initializeRouteFilters();
    this.initializeRealtimeMetrics();
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

  onTabChange(tab: SiteFilterTab): void {
    this.selectedTab = tab;
    this.sites = this.getFilteredSites();
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.sites = this.getFilteredSites();
  }

  getAllCount(): number {
    return this.allSites.length;
  }

  getOnlineCount(): number {
    return this.allSites.filter(site => this.isOnlineStatus(this.getSiteStatus(site))).length;
  }

  getOfflineCount(): number {
    return this.allSites.filter(site => this.isOfflineStatus(this.getSiteStatus(site))).length;
  }

  getHealthyCount(): number {
    return this.allSites.filter(site => this.isHealthySite(site)).length;
  }

  getOutageCount(): number {
    return this.allSites.filter(site => this.isOutageSite(site)).length;
  }

  getCriticalCount(): number {
    return this.allSites.filter(site => this.getRealtimeMetric(site)?.alarmSeverity === 'critical').length;
  }

  getMajorCount(): number {
    return this.allSites.filter(site => this.getRealtimeMetric(site)?.alarmSeverity === 'major').length;
  }

  getMinorCount(): number {
    return this.allSites.filter(site => this.getRealtimeMetric(site)?.alarmSeverity === 'minor').length;
  }

  getWarningCount(): number {
    return this.allSites.filter(site => {
      const normalized = String(site?.status ?? '').trim().toLowerCase();
      return normalized === 'warning';
    }).length;
  }

  getActiveAlarmsCount(): number {
    if (this.realtimeMetricsByDeviceId.size > 0) {
      return Array.from(this.realtimeMetricsByDeviceId.values())
        .reduce((total, metric) => total + metric.activeAlarmCount, 0);
    }

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

  getSiteStatus(site: Site): string {
    const deviceId = this.toDeviceNumericId(site);
    return deviceId !== null && this.realtimeMetricsByDeviceId.has(deviceId) ? 'active' : 'offline';
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

  getRectDcVoltage(site: Site): string {
    const deviceId = this.toDeviceNumericId(site);
    if (deviceId === null) {
      return '-';
    }

    const value = this.realtimeMetricsByDeviceId.get(deviceId)?.dcBusVoltage;
    return Number.isFinite(value) ? `${(value as number).toFixed(1)} V` : '-';
  }

  getGridVoltage(site: Site): string {
    const deviceId = this.toDeviceNumericId(site);
    if (deviceId === null) {
      return '-';
    }

    const value = this.realtimeMetricsByDeviceId.get(deviceId)?.gridVoltage;
    return Number.isFinite(value) ? `${(value as number).toFixed(1)} V` : '-';
  }

  private getFilteredSites(): Site[] {
    let filteredSites = this.allSites;

    if (this.selectedTab === 1) {
      filteredSites = filteredSites.filter(site => this.isOnlineStatus(this.getSiteStatus(site)));
    }

    if (this.selectedTab === 2) {
      filteredSites = filteredSites.filter(site => this.isOfflineStatus(this.getSiteStatus(site)));
    }

    if (this.selectedTab === 3) {
      filteredSites = filteredSites.filter(site => this.isHealthySite(site));
    }

    if (this.selectedTab === 4) {
      filteredSites = filteredSites.filter(site => this.isOutageSite(site));
    }

    if (this.selectedTab === 5) {
      filteredSites = filteredSites.filter(site => this.getRealtimeMetric(site)?.alarmSeverity === 'critical');
    }

    if (this.selectedTab === 6) {
      filteredSites = filteredSites.filter(site => this.getRealtimeMetric(site)?.alarmSeverity === 'major');
    }

    if (this.selectedTab === 7) {
      filteredSites = filteredSites.filter(site => this.getRealtimeMetric(site)?.alarmSeverity === 'minor');
    }

    if (this.selectedPowerSourceFilter === 'generator') {
      filteredSites = filteredSites.filter(site => this.siteHasGenerator(site));
    }

    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return filteredSites;
    }

    return filteredSites.filter(site =>
      String(site.name ?? '').toLowerCase().includes(term) ||
      String(site.code ?? '').toLowerCase().includes(term)
    );
  }

  private isOnlineStatus(status: any): boolean {
    const normalized = String(status ?? '').trim().toLowerCase();
    return normalized === 'online' || normalized === 'active';
  }

  private isOfflineStatus(status: any): boolean {
    const normalized = String(status ?? '').trim().toLowerCase();
    return normalized === 'offline' || normalized === 'inactive' || normalized === 'down';
  }

  private isHealthySite(site: Site): boolean {
    const metric = this.getRealtimeMetric(site);
    return !!metric && metric.activeAlarmCount === 0;
  }

  private isOutageSite(site: Site): boolean {
    const dcBusVoltage = this.getRealtimeMetric(site)?.dcBusVoltage;
    return Number.isFinite(dcBusVoltage) && (dcBusVoltage as number) < 40;
  }

  private getRealtimeMetric(site: Site) {
    const deviceId = this.toDeviceNumericId(site);
    return deviceId === null ? null : this.realtimeMetricsByDeviceId.get(deviceId) ?? null;
  }

  private initializeRouteFilters(): void {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.selectedTab = this.getTabFromStatusParam(params.get('status'));
        this.selectedPowerSourceFilter = this.getPowerSourceFilterFromParam(params.get('powerSource'));
        this.sites = this.getFilteredSites();
      });
  }

  private getTabFromStatusParam(value: string | null): SiteFilterTab {
    switch (String(value ?? '').trim().toLowerCase()) {
      case 'online':
        return 1;
      case 'offline':
        return 2;
      case 'healthy':
        return 3;
      case 'outage':
      case 'power-outage':
        return 4;
      case 'critical':
        return 5;
      case 'major':
      case 'major-alarm':
        return 6;
      case 'minor':
      case 'minor-alarm':
        return 7;
      default:
        return 0;
    }
  }

  private getPowerSourceFilterFromParam(value: string | null): string {
    const normalized = String(value ?? '').trim().toLowerCase();
    return normalized === 'generator' || normalized === 'dg' ? 'generator' : '';
  }

  private siteHasGenerator(site: Site): boolean {
    const powerSource = this.getPowerSource(site).toLowerCase();
    return powerSource.includes('generator') || powerSource.includes('gen');
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

  private initializeRealtimeMetrics(): void {
    this.realtimeDataSourceService.devices$
      .pipe(takeUntil(this.destroy$))
      .subscribe(devicesById => {
        this.realtimeMetricsByDeviceId.clear();

        Object.values(devicesById ?? {}).forEach(device => {
          this.realtimeMetricsByDeviceId.set(Number(device.deviceId), {
            batteryPercent: device.batteryRemainingPercent,
            loadKw: device.dcLoadPowerW === null ? null : device.dcLoadPowerW / 1000,
            dcBusVoltage: device.dcBusVoltage,
            gridVoltage: device.lineAVoltage,
            activeAlarmCount: device.activeAlarmCount,
            alarmSeverity: device.alarmSeverity
          });
        });

        this.sites = this.getFilteredSites();
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
    const powerSources = item?.powerSources;
    if (!Array.isArray(powerSources) || powerSources.length === 0) {
      return '-';
    }

    return powerSources
      .map(source => String(source ?? '').trim())
      .filter(Boolean)
      .join(', ');
  }

  private toDeviceNumericIdFromAny(item: any): number | null {
    const candidate = item?.deviceId ?? item?.siteId ?? item?.id;
    const parsed = Number(candidate);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

}
