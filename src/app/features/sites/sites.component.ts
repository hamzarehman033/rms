import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DevicesService, Site, ToastService } from '@app/core';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrl: './sites.component.css',
  standalone: false,
})
export class SitesComponent implements OnInit {
  displayAddSiteDialog = false;
  displayEditSiteDialog = false;
  displayConfigDialog = false;
  selectedSiteForConfig: Site | null = null;
  selectedSiteForEdit: Site | null = null;
  selectedTab = 0;
  isLoading = false;

  sites: Site[] = [];

  constructor(
    private router: Router,
    private devicesService: DevicesService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadSites();
  }

  private loadSites(): void {
    this.isLoading = true;
    this.devicesService.getDevices().subscribe({
      next: (response: any) => {
        const list = response?.data?.pageData || response?.data || response || [];
        const normalized = Array.isArray(list) ? list : [];
        this.sites = normalized.map((item: any) => this.mapApiSite(item));
        this.isLoading = false;
      },
      error: () => {
        this.sites = [];
        this.isLoading = false;
        this.toastService.showError('Failed to load sites');
      }
    });
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
    this.router.navigate(['/site-dashboard'], { queryParams: { id: siteId } });
  }

  navigateToSiteDetail(siteId: string | number) {
    this.router.navigate(['/site-detail'], { queryParams: { id: siteId } });
  }

  openSiteConfiguration(site: Site) {
    this.selectedSiteForConfig = site;
    this.displayConfigDialog = true;
  }

  onSiteConfigured() {
    this.displayConfigDialog = false;
    this.selectedSiteForConfig = null;
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
