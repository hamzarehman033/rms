import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { LocationsService, Location } from '@app/core';
import { ToastService } from '@app/core';

@Component({
  selector: 'app-locations',
  standalone: false,
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.css'
})
export class LocationsComponent implements OnInit {
  displayAddLocationDialog = false;
  displayAddRegionDialog = false;
  locationTree: TreeNode[] = [];
  selectedNode: any | undefined = undefined;
  locations: Location[] = [];
  loading = false;
  currentLevel = 1; // 1 for region, 2 for subregion, 3 for zone
  currentParentId = 0;
  selectedParentForSubitem: Location | undefined = undefined;  levelNames: { [key: number]: string } = {
    1: 'Region',
    2: 'SubRegion',
    3: 'Zone'
  };
  constructor(
    private locationsService: LocationsService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadLocations();
  }

  loadLocations() {
    this.loading = true;
    this.locationsService.getAllLocations().subscribe({
      next: (response: any) => {
        this.locations = response.data.pageData;
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
        devices: 0, // These would come from backend
        uptime: '100%',
        status: 'Operational'
      },
      children: children.length > 0 ? children.map(child => this.buildTreeNode(child)) : undefined
    };
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
}
