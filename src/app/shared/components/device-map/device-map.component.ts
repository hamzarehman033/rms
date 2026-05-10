import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

export interface Device {
  id: string;
  name: string;
  status: 'online' | 'warning' | 'offline';
  location: {
    lat: number;
    lng: number;
  };
  type?: string;
  battery?: number;
}

@Component({
  selector: 'app-device-map',
  imports: [CommonModule],
  templateUrl: './device-map.component.html',
  styleUrl: './device-map.component.css'
})
export class DeviceMapComponent implements OnInit {
  @Input() devices: Device[] = [];
  @Input() showSidebar: boolean = false;
  @ViewChild('mapContainer') mapContainer?: ElementRef;

  private map?: L.Map;

  ngOnInit() {
    // Set default devices if none provided
    if (this.devices.length === 0) {
      this.devices = [
        {
          id: 'DV-001',
          name: 'Sector 3',
          status: 'online',
          location: { lat: 24.8607, lng: 67.0011 },
          type: 'Sensor',
          battery: 87
        },
        {
          id: 'DV-002',
          name: 'North Perimeter',
          status: 'offline',
          location: { lat: 31.5204, lng: 74.3587 },
          type: 'Camera',
          battery: 100
        },
        {
          id: 'DV-003',
          name: 'Warehouse B',
          status: 'warning',
          location: { lat: 33.6844, lng: 73.0479 },
          type: 'Actuator',
          battery: 22
        }
      ];
    }
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap() {
    if (!this.mapContainer) return;

    // Initialize map
    this.map = L.map(this.mapContainer.nativeElement).setView([30.3753, 69.3451], 6);

    // Add tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    // Add device markers
    this.devices.forEach(device => {
      const marker = this.createMarker(device);
      marker.addTo(this.map!);
    });

    // Fit bounds to show all markers
    const bounds = L.latLngBounds(this.devices.map(d => [d.location.lat, d.location.lng]));
    this.map.fitBounds(bounds, { padding: [50, 50] });
  }

  private createMarker(device: Device): L.Marker {
    const color = this.getColorForStatus(device.status);
    const markerIcon = L.divIcon({
      html: `
        <div class="device-marker ${device.status}" style="color: ${this.getBorderColor(device.status)};">
          <i class="pi pi-map-marker"></i>
        </div>
      `,
      iconSize: [40, 40],
      className: 'device-marker-wrapper',
      popupAnchor: [0, -20]
    });

    const marker = L.marker([device.location.lat, device.location.lng], {
      icon: markerIcon
    });

    const popupContent = `
      <div class="device-popup">
        <div style="font-weight: 600; margin-bottom: 6px;">${device.name}</div>
        <div style="font-size: 12px; color: #666; margin-bottom: 8px;">${device.id}</div>
        <div style="font-size: 12px;">
          <div><strong>Type:</strong> ${device.type || 'Unknown'}</div>
          <div><strong>Status:</strong> ${device.status}</div>
          <div><strong>Battery:</strong> ${device.battery}%</div>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);
    return marker;
  }

  private getColorForStatus(status: string): string {
    switch (status) {
      case 'online':
        return '#22c55e'; // green
      case 'warning':
        return '#eab308'; // yellow
      case 'offline':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  }

  private getBorderColor(status: string): string {
    switch (status) {
      case 'online':
        return '#16a34a';
      case 'warning':
        return '#ca8a04';
      case 'offline':
        return '#dc2626';
      default:
        return '#4b5563';
    }
  }
}
