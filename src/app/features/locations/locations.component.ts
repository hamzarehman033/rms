import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { LocationsService, Location, CustomerService, DevicesService } from '@app/core';
import { ToastService } from '@app/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-locations',
  standalone: false,
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.css'
})
export class LocationsComponent implements OnInit {
  displayAddLocationDialog = false;
  displayAddRegionDialog = false;
  displayEditLocationDialog = false;
  displayDeleteLocationDialog = false;
  editingLocation: Location | null = null;
  deleteLocation: Location | null = null;
  locationTree: TreeNode[] = [];
  selectedNode: any | undefined = undefined;
  locations: Location[] = [];
  loading = false;
  currentLevel = 1; // 1 for region, 2 for subregion, 3 for zone
  currentParentId = 0;
  selectedParentForSubitem: Location | undefined = undefined;
  devices: any[] = [];
  private readonly deviceCountsByLocation = new Map<number, number>();
  levelNames: { [key: number]: string } = {
    1: 'Region',
    2: 'SubRegion',
    3: 'Zone'
  };
  constructor(
    private locationsService: LocationsService,
    private devicesService: DevicesService,
    private customerService: CustomerService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadLocations();
  }

  get totalRegions(): number {
    return this.locations.filter(loc => Number(loc.level) === 1).length;
  }

  get totalSubRegions(): number {
    return this.locations.filter(loc => Number(loc.level) === 2).length;
  }

  get totalZones(): number {
    let zoneCount = 0;
    zoneCount = this.locations.filter(loc => Number(loc.level) === 3).length;
    return zoneCount;
  } 

  get totalDevices(): number {
    return this.devices.length;
  }

  loadLocations() {
    this.loading = true;
    forkJoin({
      locationsResponse: this.locationsService.getAllLocations(),
      devicesResponse: this.devicesService.getDevices()
    }).subscribe({
      next: ({ locationsResponse, devicesResponse }) => {
        this.locations = locationsResponse?.data?.pageData;
        this.devices = devicesResponse?.data?.pageData as any[];
        this.rebuildDeviceCounts();
        this.buildLocationTree();
        this.loading = false;
      },
      error: (error) => {
        this.toastService.showError('Failed to load locations');
        this.loading = false;
      }
    });
  }

  buildLocationTree() {
    // Get root locations (level 1 - regions)
    const rootLocations = this.locations.filter(loc => loc.level === 1);
    this.locationTree = rootLocations.map(root => this.buildTreeNode(root));
  }

  buildTreeNode(location: Location): TreeNode {
    // Find children for this location
    const children = this.locations.filter(loc => loc.parentId === location.id);
    
    return {
      key: location.id?.toString() || '',
      data: {
        ...location,
        devices: this.getDeviceCountByLocation(location),
        uptime: '100%',
        status: 'Operational'
      },
      children: children.length > 0 ? children.map(child => this.buildTreeNode(child)) : undefined
    };
  }

  private rebuildDeviceCounts(): void {
    this.deviceCountsByLocation.clear();

    this.devices.forEach(device => {
      const regionId = device?.regionId || 0;
      const subRegionId = device?.subRegionId || 0;
      const zoneId = device?.zoneId || 0;

      if (regionId !== 0) {
        this.incrementDeviceCount(regionId);
      }

      if (subRegionId !== 0) {
        this.incrementDeviceCount(subRegionId);
      }

      if (zoneId !== 0) {
        this.incrementDeviceCount(zoneId);
      }
    });
  }

  private getDeviceCountByLocation(location: Location): number {
    const locationId =  location?.id || 0;
    if (locationId === 0) {
      return 0;
    }

    return this.deviceCountsByLocation.get(locationId) ?? 0;
  }

  private incrementDeviceCount(locationId: number): void {
    const currentCount = this.deviceCountsByLocation.get(locationId) ?? 0;
    this.deviceCountsByLocation.set(locationId, currentCount + 1);
  }


  openAddRegionDialog() {
    this.displayAddRegionDialog = true;
    this.currentLevel = 1;
    this.currentParentId = 0;
  }

  openAddSubLocationDialog(node: any) {
    const location = node.node.data as Location;
    this.selectedParentForSubitem = location;
    this.displayAddLocationDialog = true;
    // Next level after current level (1->2, 2->3, max 3)
    this.currentLevel = location.level >= 3 ? 3 : location.level + 1;
    this.currentParentId = location.id || 0;
  }

  onLocationAdded(formData: any) {
    const level = this.displayAddLocationDialog ? this.currentLevel : 1;
    const parentId = this.displayAddLocationDialog ? this.currentParentId : 0;

    const location: any = {
      name: formData.name,
      code: formData.code,
      customerId: this.customerService.getActiveCustomerId(), // Assuming you want to set the active customer ID
      level
    };

    // Only include parentId for non-region levels
    if (level > 1) {
      location.parentId = parentId;
    }

    this.locationsService.createLocation(location).subscribe({
      next: (response) => {
        const levelNames = {1: 'Region', 2: 'SubRegion', 3: 'Zone'};
        this.toastService.showSuccess(`${levelNames[location.level as keyof typeof levelNames]} added successfully`);
        this.displayAddLocationDialog = false;
        this.displayAddRegionDialog = false;
        this.loadLocations();
      },
      error: (error) => {
        this.toastService.showError('Failed to add location');
      }
    });
  }

  openEditLocationDialog(node: any) {
    const location = node.node.data as Location;
    this.editingLocation = location;
    this.displayEditLocationDialog = true;
  }

  onLocationUpdated(formData: any) {
    if (!this.editingLocation || !this.editingLocation.id) {
      return;
    }

    const updateData: Location = {
      id: this.editingLocation.id,
      name: formData.name,
      code: formData.code,
      parentId: formData.parentId,
      level: formData.level,
      customerId: this.customerService.getActiveCustomerId() || '' // Assuming you want to set the active customer ID
    };

    this.locationsService.updateLocation(this.editingLocation.id, updateData).subscribe({
      next: (response) => {
        const levelNames = {1: 'Region', 2: 'SubRegion', 3: 'Zone'};
        this.toastService.showSuccess(`${levelNames[updateData.level as keyof typeof levelNames]} updated successfully`);
        this.displayEditLocationDialog = false;
        this.editingLocation = null;
        this.loadLocations();
      },
      error: (error) => {
        this.toastService.showError('Failed to update location');
      }
    });
  }

  openDeleteLocationDialog(node: any) {
    const location = node.node.data as Location;
    this.deleteLocation = location;
    this.displayDeleteLocationDialog = true;
  }

  confirmDeleteLocation() {
    if (!this.deleteLocation || !this.deleteLocation.id) {
      return;
    }

    const locationId = this.deleteLocation.id;
    const locationName = this.deleteLocation.name;

    this.locationsService.deleteLocation(locationId).subscribe({
      next: (response) => {
        this.toastService.showSuccess(`Location "${locationName}" deleted successfully`);
        this.displayDeleteLocationDialog = false;
        this.deleteLocation = null;
        this.loadLocations();
      },
      error: (error) => {
        this.toastService.showError('Failed to delete location');
      }
    });
  }
}
