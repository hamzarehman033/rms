import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
  standalone: false,
})
export class ReportsComponent {
  activeTab = 'energy-consumption';

  regions = [
    { label: 'North', value: 'north' },
    { label: 'South', value: 'south' },
    { label: 'East', value: 'east' },
    { label: 'West', value: 'west' },
  ];

  subRegions = [
    { label: 'North-1', value: 'north-1' },
    { label: 'North-2', value: 'north-2' },
    { label: 'South-1', value: 'south-1' },
    { label: 'West-1', value: 'west-1' },
  ];

  zones = [
    { label: 'Zone A', value: 'zone-a' },
    { label: 'Zone B', value: 'zone-b' },
    { label: 'Zone C', value: 'zone-c' },
  ];

  devices = [
    { label: 'Gateway A1', value: 'gateway-a1' },
    { label: 'Pump Ctrl 03', value: 'pump-ctrl-03' },
    { label: 'Sensor T-12', value: 'sensor-t-12' },
    { label: 'Meter L2', value: 'meter-l2' },
  ];

  tenants = [
    { label: 'Tenant Alpha', value: 'tenant-alpha' },
    { label: 'Tenant Beta', value: 'tenant-beta' },
    { label: 'Tenant Gamma', value: 'tenant-gamma' },
  ];

  selectedRegion: string | null = null;
  selectedSubRegion: string | null = null;
  selectedZone: string | null = null;
  selectedDevice: string | null = null;
  selectedTenant: string | null = null;

  constructor() {}

  onExport(): void {
  }

  private tableToCSV(table: HTMLTableElement): void {
  }
}
