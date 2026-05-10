import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ModalDialogComponent } from '@app/shared';
import { AddDeviceComponent } from './add-device.component';

interface Device {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'warning';
  type: string;
  location: string;
  battery: string;
  lastSeen: string;
}

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.css',
  standalone: false,
})
export class DevicesComponent {
  displayAddDeviceDialog = false;
  selectedTab = 0;

  devices: Device[] = [
    { id: 'DV-001', name: 'Sector 3', status: 'online', type: 'Sensor', location: 'Plant A · Sector 3', battery: '87%', lastSeen: '2s ago' },
    { id: 'DV-002', name: 'North Perimeter', status: 'online', type: 'Camera', location: 'Perimeter · North', battery: '100%', lastSeen: '5s ago' },
    { id: 'DV-003', name: 'Warehouse B', status: 'warning', type: 'Sensor', location: 'Warehouse B', battery: '22%', lastSeen: '1m ago' },
    { id: 'DV-004', name: 'Floor 2 East', status: 'online', type: 'Actuator', location: 'Floor 2 · East', battery: '100%', lastSeen: '3s ago' },
    { id: 'DV-005', name: 'Warehouse A', status: 'online', type: 'Gateway', location: 'Warehouse A', battery: '100%', lastSeen: '12s ago' },
    { id: 'DV-006', name: 'Sector 1', status: 'offline', type: 'Sensor', location: 'Plant A · Sector 1', battery: '0%', lastSeen: '2h ago' },
    { id: 'DV-007', name: 'Substation 4', status: 'online', type: 'Sensor', location: 'Substation 4', battery: '94%', lastSeen: '8s ago' },
    { id: 'DV-008', name: 'Line 2', status: 'online', type: 'Actuator', location: 'Plant B · Line 2', battery: '100%', lastSeen: '1s ago' },
    { id: 'DV-009', name: 'Office Tower', status: 'warning', type: 'Sensor', location: 'Office Tower', battery: '28%', lastSeen: '45s ago' },
    { id: 'DV-010', name: 'DC West', status: 'online', type: 'Gateway', location: 'DC West', battery: '100%', lastSeen: '2s ago' }
  ];

  constructor(private router: Router) {}

  openAddDeviceDialog() {
    this.displayAddDeviceDialog = true;
  }

  onDeviceAdded(deviceData: any) {
    this.displayAddDeviceDialog = false;
  }

  navigateToDeviceDashboard(deviceId: string) {
    this.router.navigate(['/site-dashboard'], { queryParams: { id: deviceId } });
  }

  navigateToDeviceDetail(deviceId: string) {
    this.router.navigate(['/device-detail'], { queryParams: { id: deviceId } });
  }
}
