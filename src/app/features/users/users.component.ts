import { Component } from '@angular/core';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  displayAddUserDialog = false;
  users = [
    {
      id: 'USR-001',
      firstName: 'Anna',
      lastName: 'Smith',
      email: 'anna@pulse.io',
      role: 'admin',
      status: 'Active',
      lastActive: '2m ago',
      permissions: [
        { module: 'dashboard', view: true, edit: true },
        { module: 'devices', view: true, edit: true },
        { module: 'locations', view: true, edit: true },
        { module: 'users', view: true, edit: true },
        { module: 'rules', view: true, edit: true },
        { module: 'alarms', view: true, edit: true },
        { module: 'reports', view: true, edit: true },
        { module: 'settings', view: true, edit: true }
      ]
    },
    {
      id: 'USR-002',
      firstName: 'Marcus',
      lastName: 'Lee',
      email: 'marcus@pulse.io',
      role: 'operator',
      status: 'Active',
      lastActive: '15m ago',
      permissions: [
        { module: 'dashboard', view: true, edit: false },
        { module: 'devices', view: true, edit: true },
        { module: 'locations', view: true, edit: false },
        { module: 'alarms', view: true, edit: true },
        { module: 'reports', view: true, edit: false }
      ]
    },
    {
      id: 'USR-003',
      firstName: 'Priya',
      lastName: 'Patel',
      email: 'priya@pulse.io',
      role: 'operator',
      status: 'Active',
      lastActive: '1h ago',
      permissions: [
        { module: 'dashboard', view: true, edit: false },
        { module: 'devices', view: true, edit: true },
        { module: 'locations', view: true, edit: true },
        { module: 'alarms', view: true, edit: false }
      ]
    },
    {
      id: 'USR-004',
      firstName: 'Diego',
      lastName: 'Ruiz',
      email: 'diego@pulse.io',
      role: 'viewer',
      status: 'Invited',
      lastActive: '—',
      permissions: [
        { module: 'dashboard', view: true, edit: false },
        { module: 'devices', view: true, edit: false },
        { module: 'locations', view: true, edit: false }
      ]
    },
    {
      id: 'USR-005',
      firstName: 'Sara',
      lastName: 'Chen',
      email: 'sara@pulse.io',
      role: 'viewer',
      status: 'Active',
      lastActive: '3h ago',
      permissions: [
        { module: 'dashboard', view: true, edit: false },
        { module: 'reports', view: true, edit: false }
      ]
    }
  ];

  openAddUserDialog() {
    this.displayAddUserDialog = true;
  }

  onUserAdded(userData: any) {
    console.log('User added:', userData);
    this.displayAddUserDialog = false;
  }

  getPermissionSummary(permissions: any[]): string {
    if (!permissions || permissions.length === 0) return 'No access';
    
    const viewCount = permissions.filter(p => p.view).length;
    const editCount = permissions.filter(p => p.edit).length;
    
    return `${viewCount}V, ${editCount}E`;
  }

  hasEdit(permissions: any[]): boolean {
    return permissions.some(p => p.edit);
  }
}
