import { Component } from '@angular/core';

@Component({
  selector: 'app-tenant',
  standalone: false,
  templateUrl: './tenant.component.html',
  styleUrl: './tenant.component.css'
})
export class TenantComponent {
  displayAddTenantDialog = false;

  openAddTenantDialog() {
    this.displayAddTenantDialog = true;
  }

  onTenantAdded(tenantData: any) {
    console.log('Tenant added:', tenantData);
    this.displayAddTenantDialog = false;
  }
}
