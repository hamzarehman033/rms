import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Site, SitesService, ToastService } from '@app/core';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrl: './sites.component.css',
  standalone: false,
})
export class SitesComponent implements OnInit {
  displayAddSiteDialog = false;
  displayConfigDialog = false;
  selectedSiteForConfig: Site | null = null;
  selectedTab = 0;
  isLoading = false;

  sites: Site[] = [];

  constructor(
    private router: Router,
    private sitesService: SitesService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadSites();
  }

  private loadSites(): void {
    this.isLoading = true;
    this.sitesService.getCombinedSites().subscribe({
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

  private mapApiSite(item: any): Site {
    return {
      id: item.id || item.code || '',
      deviceId: item.deviceId || item.device?.id || item.device?.deviceId,
      siteCode: item.siteCode || item.code || '',
      regionId: item.regionId,
      regionName: item.regionName || item.region?.name || '-',
      subRegionId: item.subRegionId,
      subRegionName: item.subRegionName || item.subRegion?.name || '-',
      zoneId: item.zoneId,
      zoneName: item.zoneName || item.zone?.name || '-',
      name: item.name || item.siteName || '',
      status: (item.status || 'active').toString().toLowerCase(),
      code: item.code || '',
      address: item.address || '',
      coordinates: item.coordinates || '',
      type: item.type || 'Site',
      location: item.location || item.address || '-',
      battery: item.battery || '-',
      lastSeen: item.lastSeen || '-'
    };
  }
}
