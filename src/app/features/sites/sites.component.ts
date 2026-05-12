import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Site {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'warning';
  type: string;
  location: string;
  battery: string;
  lastSeen: string;
}

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrl: './sites.component.css',
  standalone: false,
})
export class SitesComponent {
  displayAddSiteDialog = false;
  selectedTab = 0;

  sites: Site[] = [
    { id: 'ST-001', name: 'Plant A', status: 'online', type: 'Manufacturing', location: 'North Region', battery: '87%', lastSeen: '2s ago' },
    { id: 'ST-002', name: 'Warehouse A', status: 'online', type: 'Storage', location: 'Central Region', battery: '100%', lastSeen: '5s ago' },
    { id: 'ST-003', name: 'Warehouse B', status: 'warning', type: 'Storage', location: 'Central Region', battery: '22%', lastSeen: '1m ago' },
    { id: 'ST-004', name: 'Plant B', status: 'online', type: 'Manufacturing', location: 'West Region', battery: '100%', lastSeen: '3s ago' },
    { id: 'ST-005', name: 'DC East', status: 'online', type: 'Data Center', location: 'East Region', battery: '100%', lastSeen: '12s ago' },
    { id: 'ST-006', name: 'DC West', status: 'offline', type: 'Data Center', location: 'West Region', battery: '0%', lastSeen: '2h ago' },
    { id: 'ST-007', name: 'Office Tower', status: 'online', type: 'Office', location: 'Central Region', battery: '94%', lastSeen: '8s ago' },
    { id: 'ST-008', name: 'Distribution Center', status: 'online', type: 'Logistics', location: 'South Region', battery: '100%', lastSeen: '1s ago' },
    { id: 'ST-009', name: 'Research Lab', status: 'warning', type: 'Laboratory', location: 'North Region', battery: '28%', lastSeen: '45s ago' },
    { id: 'ST-010', name: 'Retail Hub', status: 'online', type: 'Retail', location: 'Central Region', battery: '100%', lastSeen: '2s ago' }
  ];

  constructor(private router: Router) {}

  openAddSiteDialog() {
    this.displayAddSiteDialog = true;
  }

  onSiteAdded(siteData: any) {
    this.displayAddSiteDialog = false;
  }

  navigateToSiteDashboard(siteId: string) {
    this.router.navigate(['/site-dashboard'], { queryParams: { id: siteId } });
  }

  navigateToSiteDetail(siteId: string) {
    this.router.navigate(['/site-detail'], { queryParams: { id: siteId } });
  }
}
