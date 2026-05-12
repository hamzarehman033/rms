import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  // Live Telemetry Chart Data
  telemetryChartOptions = {
    xAxisData: ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm', '12am'],
    seriesData: [
      { 
        name: 'Temperature °F', 
        data: [65, 62, 60, 68, 75, 78, 72, 68, 65],
        color: '#5b6cff'
      },
      { 
        name: 'Humidity %', 
        data: [55, 58, 62, 65, 60, 55, 58, 62, 60],
        color: '#38bdf8'
      }
    ],
    height: '250px',
    showLegend: false,
    showSymbol: false
  };

  // Device Breakdown Chart Data
  siteBreakdownOptions = {
    data: [
      { name: 'Sensors', value: 86, color: '#5b6cff' },
      { name: 'Gateways', value: 24, color: '#8a7bff' },
      { name: 'Actuators', value: 28, color: '#38bdf8' },
      { name: 'Cameras', value: 12, color: '#22c55e' }
    ],
    height: '280px',
    donut: true,
    showLegend: false
  };

  // Weekly Activity Chart Data
  weeklyActivityOptions = {
    xAxisData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    seriesData: [
      { 
        name: 'Online', 
        data: [140, 150, 135, 160, 148, 130, 155],
        color: '#22c55e'
      },
      { 
        name: 'Offline', 
        data: [6, 4, 8, 3, 5, 10, 4],
        color: '#ef4444'
      }
    ],
    height: '250px',
    showLegend: false
  };

  // Filter Properties
  searchTerm = '';
  selectedRegions: string[] = [];
  selectedSubRegions: string[] = [];
  selectedStatuses: string[] = [];
  selectedSiteTypes: string[] = [];
  selectedTimeframe = '24h';

  // Filter Options
  regionOptions = [
    { label: 'North', value: 'north' },
    { label: 'Central', value: 'central' },
    { label: 'South', value: 'south' },
    { label: 'East', value: 'east' },
    { label: 'West', value: 'west' }
  ];

  subRegionOptions = [
    { label: 'Plant A', value: 'plant-a' },
    { label: 'Plant B', value: 'plant-b' },
    { label: 'Warehouse A', value: 'warehouse-a' },
    { label: 'Warehouse B', value: 'warehouse-b' },
    { label: 'DC West', value: 'dc-west' },
    { label: 'DC East', value: 'dc-east' }
  ];

  statusOptions = [
    { label: 'Online', value: 'online' },
    { label: 'Offline', value: 'offline' },
    { label: 'Warning', value: 'warning' },
    { label: 'Error', value: 'error' }
  ];

  siteTypeOptions = [
    { label: 'Manufacturing', value: 'manufacturing' },
    { label: 'Storage', value: 'storage' },
    { label: 'Data Center', value: 'datacenter' },
    { label: 'Office', value: 'office' }
  ];

  timeframeOptions = [
    { label: '24h', value: '24h' },
    { label: '7d', value: '7d' },
    { label: '30d', value: '30d' },
    { label: '90d', value: '90d' }
  ];

  timeframeMenuItems: any[] = [];

  constructor() {
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
    // TODO: Implement filter logic to update dashboard data
    console.log('Filters changed:', {
      searchTerm: this.searchTerm,
      regions: this.selectedRegions,
      subRegions: this.selectedSubRegions,
      statuses: this.selectedStatuses,
      siteTypes: this.selectedSiteTypes,
      timeframe: this.selectedTimeframe
    });
  }
}
