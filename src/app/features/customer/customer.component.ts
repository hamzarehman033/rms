import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../core/services/customer.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-customer',
  standalone: false,
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements OnInit {
  displayAddCustomerDialog = false;
  selectedTab = 0;
  isLoading = false;
  searchTerm = '';
  customers: any[] = [];

  constructor(
    private customerService: CustomerService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.customerService.getCustomers().subscribe({
      next: (response: any) => {
        const customerList = response.data?.pageData || [];
        this.customers = customerList.map((customer: any) => ({
          id: customer.id || customer.Id || 'N/A',
          name: customer.name || customer.Name || 'Unknown',
          email: customer.email || customer.Email || 'N/A',
          description: customer.description || customer.Description || '',
          status: customer.status || 'Active',
          plan: customer.plan || 'Standard',
          joined: customer.joined || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          permissions: customer.permissions || []
        }));
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading customers:', error);
        this.isLoading = false;
      }
    });
  }

  openAddCustomerDialog() {
    this.displayAddCustomerDialog = true;
  }

  onCustomerAdded(response: any) {
    this.displayAddCustomerDialog = false;
    this.loadCustomers();
  }

  get totalCustomers(): number {
    return this.customers.length;
  }

  get activeCustomers(): number {
    return this.customers.filter(c => c.status === 'Active').length;
  }

  get inactiveCustomers(): number {
    return this.customers.filter(c => c.status === 'Inactive').length;
  }

  get pendingCustomers(): number {
    return this.customers.filter(c => c.status === 'Pending').length;
  }

  get filteredCustomers(): any[] {
    let filtered = this.customers;
    
    // Apply tab filter
    if (this.selectedTab === 1) {
      filtered = filtered.filter(c => c.status === 'Active');
    } else if (this.selectedTab === 2) {
      filtered = filtered.filter(c => c.status === 'Inactive');
    } else if (this.selectedTab === 3) {
      filtered = filtered.filter(c => c.status === 'Pending');
    }

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.id.toLowerCase().includes(term) || 
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term)
      );
    }

    return filtered;
  }
}
