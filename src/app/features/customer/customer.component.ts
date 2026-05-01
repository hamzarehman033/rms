import { Component } from '@angular/core';

@Component({
  selector: 'app-customer',
  standalone: false,
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent {
  displayAddCustomerDialog = false;
  customers = [
    {
      id: 'CUST-001',
      name: 'John Smith',
      email: 'john@example.com',
      status: 'Active',
      plan: 'Premium',
      joined: 'Jan 15, 2025',
      permissions: ['dashboard', 'devices', 'locations', 'alarms', 'reports']
    },
    {
      id: 'CUST-002',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      status: 'Active',
      plan: 'Standard',
      joined: 'Feb 22, 2025',
      permissions: ['dashboard', 'devices', 'locations']
    },
    {
      id: 'CUST-003',
      name: 'Michael Chen',
      email: 'michael@example.com',
      status: 'Active',
      plan: 'Enterprise',
      joined: 'Mar 10, 2025',
      permissions: ['dashboard', 'devices', 'locations', 'users', 'rules', 'alarms', 'reports', 'settings']
    }
  ];

  openAddCustomerDialog() {
    this.displayAddCustomerDialog = true;
  }

  onCustomerAdded(customerData: any) {
    console.log('Customer added:', customerData);
    this.displayAddCustomerDialog = false;
  }

  getPermissionBadges(permissions: string[]): string {
    if (!permissions || permissions.length === 0) return 'No access';
    if (permissions.length === 8) return 'Full access';
    return `${permissions.length} modules`;
  }
}
