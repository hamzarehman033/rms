import { Component } from '@angular/core';
import { TenantService } from '../../core/services/tenant.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-tenant',
  standalone: false,
  templateUrl: './tenant.component.html',
  styleUrl: './tenant.component.css'
})
export class TenantComponent {
  displayAddTenantDialog = false;
  selectedTab = 0;
  isLoading = false;
  searchTerm = '';
  tenants: any[] = [];

  constructor(
    private tenantService: TenantService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadTenants();
  }

  loadTenants(): void {
    this.isLoading = true;
    this.tenantService.getTenants().subscribe({
      next: (response: any) => {
        this.tenants = response?.data?.pageData ?? [];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading tenants:', error);
        this.isLoading = false;
        this.toastService.showError('Error', 'Failed to load tenants. Please try again.');
      }
    });
  }

  openAddTenantDialog() {
    this.displayAddTenantDialog = true;
  }

  onTenantAdded(tenantData: any) {
    console.log('Tenant added:', tenantData);
    this.displayAddTenantDialog = false;
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

 

  get filteredTenants(): any[] {
    let filtered = this.tenants;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        t =>
          String(t.id).toLowerCase().includes(term) ||
          String(t.name).toLowerCase().includes(term)
      );
    }

    return filtered;
  }

}
