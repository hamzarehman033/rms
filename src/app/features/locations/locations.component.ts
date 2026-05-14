import { Component, OnInit } from '@angular/core';
import { TreeNode, TreeTableNode } from 'primeng/api';

@Component({
  selector: 'app-locations',
  standalone: false,
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.css'
})
export class LocationsComponent implements OnInit {
  displayAddLocationDialog = false;
  locationTree: TreeNode[] = [];
  displayAddRegionDialog = false;
  selectedNode: any | undefined = undefined;
  ngOnInit() {
    this.initializeLocationTree();
  }

  initializeLocationTree() {
    this.locationTree = [
      {
        key: '0',
        data: {
          name: 'North Region',
          devices: 92,
          uptime: '97.5%',
          status: 'Operational'
        },
        children: [
          {
            key: '0-0',
            data: {
              name: 'North 1B (Lahore)',
              devices: 70,
              uptime: '98.0%',
              status: 'Operational'
            },
            children: [
              {
                key: '0-0-0',
                data: {
                  name: 'Zone A',
                  devices: 42,
                  uptime: '98.2%',
                  status: 'Operational',
                  id: 'LOC-001'
                }
              },
              {
                key: '0-0-1',
                data: {
                  name: 'Warehouse A',
                  devices: 28,
                  uptime: '99.1%',
                  status: 'Operational',
                  id: 'LOC-003'
                }
              }
            ]
          },
          {
            key: '0-1',
            data: {
              name: 'North 2A (Islamabad)',
              devices: 22,
              uptime: '96.7%',
              status: 'Operational'
            },
            children: [
              {
                key: '0-1-0',
                data: {
                  name: 'Warehouse B',
                  devices: 22,
                  uptime: '96.7%',
                  status: 'Operational',
                  id: 'LOC-004'
                }
              }
            ]
          }
        ]
      },
      {
        key: '1',
        data: {
          name: 'South Region',
          devices: 58,
          uptime: '88.0%',
          status: 'Degraded'
        },
        children: [
          {
            key: '1-0',
            data: {
              name: 'South 1A (Karachi)',
              devices: 36,
              uptime: '87.4%',
              status: 'Degraded'
            },
            children: [
              {
                key: '1-0-0',
                data: {
                  name: 'Zone B',
                  devices: 36,
                  uptime: '87.4%',
                  status: 'Degraded',
                  id: 'LOC-002'
                }
              }
            ]
          },
          {
            key: '1-1',
            data: {
              name: 'South 1A (Multan)',
              devices: 22,
              uptime: '99.8%',
              status: 'Operational'
            },
            children: [
              {
                key: '1-1-0',
                data: {
                  name: 'DC West',
                  devices: 18,
                  uptime: '99.8%',
                  status: 'Operational',
                  id: 'LOC-005'
                }
              }
            ]
          }
        ]
      },
      {
        key: '2',
        data: {
          name: 'East Region',
          devices: 4,
          uptime: '82.0%',
          status: 'Degraded'
        },
        children: [
          {
            key: '2-0',
            data: {
              name: 'North 2A (Peshawar)',
              devices: 4,
              uptime: '82.0%',
              status: 'Degraded'
            },
            children: [
              {
                key: '2-0-0',
                data: {
                  name: 'Substation 4',
                  devices: 4,
                  uptime: '82.0%',
                  status: 'Degraded',
                  id: 'LOC-006'
                }
              }
            ]
          }
        ]
      }
    ];
  }

  openAddRegionDialog(rowNode?: TreeTableNode) {
    this.selectedNode = rowNode;
    this.displayAddRegionDialog = true;
  }

  onLocationAdded(locationData: any) {
    console.log('Location added:', locationData);
    this.displayAddLocationDialog = false;
    // Refresh tree data
    this.initializeLocationTree();
  }
}
