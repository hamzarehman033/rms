import { AfterViewInit, Component, DestroyRef, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { DevicesService } from '../../../core/services/devices.service';
import { LocationsService } from '../../../core/services/locations.service';
import { SignalrService } from '../../../core/services/signalr.service';
import { DecodedPayload, DeviceDataEvent } from '../../../core/constants/device-message.model';

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
  regionName?: string;
  subRegionName?: string;
  zoneName?: string;
}

@Component({
  selector: 'app-device-map',
  imports: [CommonModule],
  templateUrl: './device-map.component.html',
  styleUrl: './device-map.component.css'
})
export class DeviceMapComponent implements OnInit, AfterViewInit {
  @Input() devices: Device[] = [];
  @Input() showSidebar: boolean = false;
  @ViewChild('mapContainer') mapContainer?: ElementRef;

  selectedDeviceId = '';
  selectedRegion: any = null;
  selectedSubRegion: any = null;
  selectedZone: any = null;
  selectedBatteryLevel = 0;
  deviceOptions: Array<{ label: string; value: string }> = [];
  regionOptions: any[] = [];
  subRegionOptions: any[] = [];
  zoneOptions: any[] = [];

  private readonly destroyRef = inject(DestroyRef);
  private map?: L.Map;
  private markers = L.layerGroup();
  private allDevices: Device[] = [];
  private locationTree: any[] = [];

  constructor(
    private devicesService: DevicesService,
    private locationsService: LocationsService,
    private signalrService: SignalrService
  ) {}

  ngOnInit() {
    this.loadLocationFilters();

    if (!this.devices.length) {
      this.loadDevices();
    } else {
      this.allDevices = this.devices;
      this.setDeviceOptions();
      this.subscribeMapDevices();
    }

    this.signalrService.onDeviceData$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => this.updateDeviceFromSocket(event));
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private loadDevices(): void {
    this.devicesService.getDevices().subscribe((response: any) => {
      const list = response?.data?.pageData || response?.data || response || [];
      this.allDevices = (Array.isArray(list) ? list : [])
        .map(item => this.mapDevice(item))
        .filter((device): device is Device => !!device);
      this.devices = this.allDevices;
      this.setDeviceOptions();
      this.subscribeMapDevices();
      this.renderMarkers();
    });
  }

  private loadLocationFilters(): void {
    this.locationsService.getLocationTree().subscribe((response: any) => {
      this.locationTree = response?.data ?? [];
      this.regionOptions = response?.data ?? [];
    });
  }

  onFilterChange(fitBounds = true): void {
    this.devices = this.allDevices.filter(device => {
      const matchesRegion = !this.selectedRegion || device.regionName === this.selectedRegion;
      const matchesSubRegion = !this.selectedSubRegion || device.subRegionName === this.selectedSubRegion;
      const matchesZone = !this.selectedZone || device.zoneName === this.selectedZone;
      const matchesDevice = !this.selectedDeviceId || device.id === this.selectedDeviceId;
      const matchesBattery = !this.selectedBatteryLevel || Number(device.battery ?? 0) >= this.selectedBatteryLevel;
      return matchesRegion && matchesSubRegion && matchesZone && matchesDevice && matchesBattery;
    });

    this.renderMarkers(fitBounds);
  }

  onRegionChange(region: any): void {
    debugger
    this.selectedRegion = region;
    const ts = this.regionOptions.find(region => region.name === region.name);
    this.subRegionOptions = ts?.children ?? [];
    this.selectedSubRegion = null;
    this.selectedZone = null;
    this.onFilterChange();
  }

  onSubRegionChange(subRegion: any): void { 
    debugger
    this.selectedSubRegion = subRegion;
    this.zoneOptions = this.subRegionOptions.find(subRegion => subRegion.name === subRegion.name)?.children ?? [];
    this.selectedZone = null;
    this.onFilterChange();
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

    this.markers.addTo(this.map);
    this.renderMarkers();
  }

  private renderMarkers(fitBounds = true): void {
    if (!this.map) return;

    this.markers.clearLayers();
    this.devices.forEach(device => this.createMarker(device).addTo(this.markers));

    if (fitBounds && this.devices.length) {
      const bounds = L.latLngBounds(this.devices.map(d => [d.location.lat, d.location.lng]));
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
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

  private mapDevice(item: any): Device | null {
    const location = this.parseCoordinates(item?.coordinates);
    if (!location) {
      return null;
    }

    return {
      id: String(item?.deviceId ?? item?.siteId ?? item?.id ?? item?.code ?? ''),
      name: String(item?.name ?? item?.siteName ?? item?.deviceName ?? 'Device'),
      status: 'offline',
      location,
      type: item?.type,
      battery: Number(item?.batteryRemainingPercent ?? item?.battery ?? 0),
      regionName: item?.regionName,
      subRegionName: item?.subRegionName,
      zoneName: item?.zoneName,
    };
  }

  private setDeviceOptions(): void {
    this.deviceOptions = this.allDevices.map(device => ({
      label: device.name,
      value: device.id
    }));
  }

  private getLocationName(node: any): string {
    return String((node?.data || node)?.name ?? '').trim();
  }

  private getLocationChildren(node: any): any[] {
    if (!node) {
      return [];
    }

    const location = node?.data || node;
    return Array.isArray(node?.children) ? node.children : Array.isArray(location?.children) ? location.children : [];
  }

  private subscribeMapDevices(): void {
    const ids = this.devices
      .map(device => Number(device.id))
      .filter(id => Number.isFinite(id) && id > 0);

    if (ids.length) {
      void this.signalrService.subscribeToDevices(ids).catch(() => {});
    }
  }

  private updateDeviceFromSocket(event: DeviceDataEvent | null): void {
    if (!event?.decodedPayload) {
      return;
    }

    const payload = event.decodedPayload as DecodedPayload;
    const deviceId = String(event.deviceId ?? payload.deviceId ?? '');
    const device = this.allDevices.find(item => item.id === deviceId);
    if (!device) {
      return;
    }

    device.status = 'online';
    const battery = Number(payload.batteryRemainingPercent);
    if (Number.isFinite(battery)) {
      device.battery = battery;
    }

    this.onFilterChange(false);
  }

  private parseCoordinates(value: unknown): { lat: number; lng: number } | null {
    const [latRaw, lngRaw] = String(value ?? '').split(',').map(part => Number(part.trim()));
    if (!Number.isFinite(latRaw) || !Number.isFinite(lngRaw)) {
      return null;
    }
    return { lat: latRaw, lng: lngRaw };
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
