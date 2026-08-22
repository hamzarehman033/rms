import { Component } from '@angular/core';
import { Tenant, TenantService } from '../../core/services/tenant.service';
import { toast } from '../../utils/global-toast';
import { CustomerService } from '../../core/services/customer.service';

@Component({
  selector: 'app-tenant',
  standalone: false,
  templateUrl: './tenant.component.html',
  styleUrl: './tenant.component.css'
})
export class TenantComponent {
  displayAddTenantDialog = false;
  displayEditTenantDialog = false;
  displayDeleteTenantDialog = false;
  selectedTenantForEdit: Tenant | null = null;
  selectedTenantForDelete: Tenant | null = null;
  selectedTab = 0;
  isLoading = false;
  searchTerm = '';
  tenants: Tenant[] = [];

  constructor(
    private tenantService: TenantService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.loadTenants();
  }

  loadTenants(): void {
    this.isLoading = true;
    this.tenantService.getTenants().subscribe({
      next: (response: any) => {
        const tenants = response?.data?.pageData ?? response?.data ?? response ?? [];
        this.tenants = Array.isArray(tenants) ? tenants : [];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading tenants:', error);
        this.isLoading = false;
        toast.error('Error', 'Failed to load tenants. Please try again.');
      }
    });
  }

  openAddTenantDialog() {
    this.displayAddTenantDialog = true;
  }

  onTenantAdded(tenantData: any) {
    const payload = this.buildTenantPayload(tenantData);

    this.tenantService.createTenant(payload).subscribe({
      next: () => {
        toast.success('Tenant added successfully');
        this.displayAddTenantDialog = false;
        this.loadTenants();
      },
      error: (error: any) => {
        console.error('Error adding tenant:', error);
        toast.error('Error', 'Failed to add tenant. Please try again.');
      }
    });
  }

  closeAddTenantDialog(): void {
    this.displayAddTenantDialog = false;
  }

  closeEditTenantDialog(): void {
    this.displayEditTenantDialog = false;
    this.selectedTenantForEdit = null;
  }

  openEditTenantDialog(tenant: Tenant): void {
    this.selectedTenantForEdit = tenant;
    this.displayEditTenantDialog = true;
  }

  onTenantUpdated(tenantData: any): void {
    const tenantId = this.getTenantId(this.selectedTenantForEdit);
    if (!tenantId) {
      return;
    }

    const payload = this.buildTenantPayload(tenantData, tenantId);

    this.tenantService.updateTenant(tenantId, payload).subscribe({
      next: () => {
        toast.success('Tenant updated successfully');
        this.displayEditTenantDialog = false;
        this.selectedTenantForEdit = null;
        this.loadTenants();
      },
      error: (error: any) => {
        console.error('Error updating tenant:', error);
        toast.error('Error', 'Failed to update tenant. Please try again.');
      }
    });
  }

  openDeleteTenantDialog(tenant: Tenant): void {
    this.selectedTenantForDelete = tenant;
    this.displayDeleteTenantDialog = true;
  }

  confirmDeleteTenant(): void {
    const tenantId = this.getTenantId(this.selectedTenantForDelete);
    if (!tenantId) {
      return;
    }

    this.tenantService.deleteTenant(tenantId).subscribe({
      next: () => {
        toast.success('Tenant deleted successfully');
        this.displayDeleteTenantDialog = false;
        this.selectedTenantForDelete = null;
        this.loadTenants();
      },
      error: (error: any) => {
        console.error('Error deleting tenant:', error);
        toast.error('Error', 'Failed to delete tenant. Please try again.');
      }
    });
  }

  get totalTenants(): number {
    return this.tenants.length;
  }

  get activeTenants(): number {
    return this.tenants.filter(t => t?.status === 'Active').length;
  }

  get disabledTenants(): number {
    return this.tenants.filter(t => t?.status !== 'Active').length;
  }

 

  get filteredTenants(): Tenant[] {
    let filtered = this.tenants;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        t =>
          String(t.id).toLowerCase().includes(term) ||
          String(t.tenantId ?? '').toLowerCase().includes(term) ||
          String(t.name).toLowerCase().includes(term) ||
          String(t.code).toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  private buildTenantPayload(formData: any, id?: number | string): Tenant {
    return {
      ...(id ? { id } : {}),
      name: formData.name,
      code: formData.code,
      status: formData.status,
      description: formData.description,
      customerId: this.customerService.getActiveCustomerId()
    };
  }

  private getTenantId(tenant: Tenant | null): number | string | null {
    return tenant?.id ?? tenant?.tenantId ?? null;
  }

}
