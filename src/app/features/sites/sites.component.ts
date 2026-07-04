import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DevicesService, SignalrService, Site, ToastService } from '@app/core';

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
  private readonly activeStreamingDeviceIds = new Set<number>();
  private readonly streamActionInProgressIds = new Set<number>();

  constructor(
    private router: Router,
    private devicesService: DevicesService,
    private signalrService: SignalrService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadSites();
  }

  ngOnDestroy(): void {
    const activeIds = Array.from(this.activeStreamingDeviceIds);
    if (!activeIds.length) {
      return;
    }

    this.signalrService.unsubscribeFromDevices(activeIds).catch(() => {
      // No-op on destroy cleanup failure.
    });
    this.activeStreamingDeviceIds.clear();
  }

  private loadSites(): void {
    this.isLoading = true;
    this.devicesService.getDevices().subscribe({
      next: (response: any) => {
        const list = response?.data?.pageData || response?.data || response || [];
        const normalized = Array.isArray(list) ? list : [];
        this.allSites = normalized.map((item: any) => this.mapApiSite(item));
        this.sites = this.getFilteredSites();
        this.isLoading = false;
      },
      error: () => {
        this.allSites = [];
        this.sites = [];
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
      lastSeen: item.lastSeen || item.deviceInstallationDate || '-'
    };
  }
}
