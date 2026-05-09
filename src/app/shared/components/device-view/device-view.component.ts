import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-device-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-view.component.html',
  styleUrl: './device-view.component.css',
})
export class DeviceViewComponent {
  // Popover state
  showPopover = false;
  popoverX = 0;
  popoverY = 0;
  selectedDeviceName = '';
  selectedDevice: any = null;

  // Device data by ID/type
  devicesMap: { [key: string]: any } = {
    'tower': {
      name: 'Tower A-1',
      type: 'Communication Tower',
      id: 'DEV-2024-00147',
      status: 'online',
      location: 'North Building',
      firmware: 'v2.3.1',
      temperature: 42,
      power: 850,
      cpu: 65,
      uptime: 156,
      signal: 95,
      lastUpdated: new Date().toLocaleTimeString()
    },
    'generator': {
      name: 'Generator B-2',
      type: 'Backup Generator',
      id: 'GEN-2024-00201',
      status: 'online',
      location: 'Power House',
      firmware: 'v1.8.5',
      temperature: 55,
      power: 2500,
      cpu: 40,
      uptime: 2080,
      signal: 88,
      lastUpdated: new Date().toLocaleTimeString()
    },
    'solar': {
      name: 'Solar Panel Array C-3',
      type: 'Solar Power System',
      id: 'SOL-2024-00302',
      status: 'online',
      location: 'Rooftop',
      firmware: 'v2.1.0',
      temperature: 78,
      power: 5000,
      cpu: 25,
      uptime: 4320,
      signal: 92,
      lastUpdated: new Date().toLocaleTimeString()
    },
    'device1': {
      name: 'Sensors',
      type: 'IoT Controller',
      id: 'IOT-2024-00403',
      status: 'online',
      location: 'Central Server',
      firmware: 'v1.5.2',
      temperature: 38,
      power: 120,
      cpu: 45,
      uptime: 720,
      signal: 100,
      lastUpdated: new Date().toLocaleTimeString()
    },
    'computer': {
      name: 'Computer E-5',
      type: 'Control Station',
      id: 'CPU-2024-00504',
      status: 'online',
      location: 'Main Office',
      firmware: 'v3.0.1',
      temperature: 48,
      power: 300,
      cpu: 75,
      uptime: 336,
      signal: 98,
      lastUpdated: new Date().toLocaleTimeString()
    },
    'battery': {
      name: 'Battery F-6',
      type: 'Energy Storage System',
      id: 'BAT-2024-00605',
      status: 'online',
      location: 'Storage Room',
      firmware: 'v1.9.3',
      temperature: 35,
      power: 1200,
      cpu: 30,
      uptime: 5040,
      signal: 85,
      lastUpdated: new Date().toLocaleTimeString()
    },
    'rectifier': {
      name: 'Rectifier G-7',
      type: 'Power Rectification Unit',
      id: 'REC-2024-00706',
      status: 'online',
      location: 'Power Room',
      firmware: 'v2.0.4',
      temperature: 52,
      power: 3500,
      cpu: 55,
      uptime: 3360,
      signal: 90,
      lastUpdated: new Date().toLocaleTimeString()
    }
  };

  showTooltip(event: MouseEvent, deviceId: string) {
    const device = this.devicesMap[deviceId];
    
    if (device) {
      this.selectedDeviceName = device.name;
      this.selectedDevice = device;
      
      // Position popover at click location with offset
      this.popoverX = event.clientX - 20;
      this.popoverY = event.clientY + 10;
      
      this.showPopover = true;
    }
  }

  closePopover() {
    this.showPopover = false;
  }
}
