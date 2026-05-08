import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map-dashboard',
  standalone: false,
  templateUrl: './map-dashboard.component.html',
  styleUrl: './map-dashboard.component.css'
})
export class MapDashboardComponent {
  // Filter Properties
  searchTerm = '';
  selectedRegions: string[] = [];
  selectedStatuses: string[] = [];
  selectedDeviceTypes: string[] = [];
  selectedTimeframe = '24h';

  // Filter Options
  regionOptions = [
    { label: 'North', value: 'north' },
    { label: 'Central', value: 'central' },
    { label: 'South', value: 'south' },
    { label: 'East', value: 'east' },
    { label: 'West', value: 'west' }
  ];

  statusOptions = [
    { label: 'Online', value: 'online' },
    { label: 'Offline', value: 'offline' },
    { label: 'Warning', value: 'warning' },
    { label: 'Error', value: 'error' }
  ];

  deviceTypeOptions = [
    { label: 'Sensors', value: 'sensors' },
    { label: 'Gateways', value: 'gateways' },
    { label: 'Actuators', value: 'actuators' },
    { label: 'Cameras', value: 'cameras' }
  ];

  timeframeOptions = [
    { label: '24h', value: '24h' },
    { label: '7d', value: '7d' },
    { label: '30d', value: '30d' },
    { label: '90d', value: '90d' }
  ];

  timeframeMenuItems: any[] = [];

  constructor(private router: Router) {
    this.initializeTimeframeMenu();
  }

  initializeTimeframeMenu() {
    this.timeframeMenuItems = this.timeframeOptions.map(option => ({
      label: option.label,
      command: () => {
        this.selectedTimeframe = option.value;
        this.onFilterChange();
      }
    }));
  }

  onFilterChange() {
    // TODO: Implement filter logic to update map view data
    console.log('Filters changed:', {
      searchTerm: this.searchTerm,
      regions: this.selectedRegions,
      statuses: this.selectedStatuses,
      deviceTypes: this.selectedDeviceTypes,
      timeframe: this.selectedTimeframe
    });
  }

  backToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
