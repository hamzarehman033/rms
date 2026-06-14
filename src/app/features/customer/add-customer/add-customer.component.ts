import { Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../../core/services/customer.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-add-customer',
  standalone: false,
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent implements OnInit, OnChanges {
  @Input() customerData: any = null;
  @Output() customerAdded = new EventEmitter<any>();
  @Output() customerUpdated = new EventEmitter<any>();

  customerForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  customerTypes = [
    { label: 'Individual', value: 'individual' },
    { label: 'Business', value: 'business' },
    { label: 'Enterprise', value: 'enterprise' }
  ];
  
  // modules = [
  //   { label: 'Dashboard', value: 'dashboard', icon: 'pi pi-chart-bar' },
  //   { label: 'Devices', value: 'devices', icon: 'pi pi-server' },
  //   { label: 'Locations', value: 'locations', icon: 'pi pi-map-marker' },
  //   { label: 'Users', value: 'users', icon: 'pi pi-users' },
  //   { label: 'Rules', value: 'rules', icon: 'pi pi-list' },
  //   { label: 'Alarms', value: 'alarms', icon: 'pi pi-bell' },
  //   { label: 'Reports', value: 'reports', icon: 'pi pi-file-pdf' },
  //   { label: 'Settings', value: 'settings', icon: 'pi pi-cog' }
  // ];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private toastService: ToastService
  ) {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      logo: [''],
      slug: [''],
      subscriptionActive: [true],
      email: ['', [Validators.required, Validators.email]],
      description: [''],
    });
  }

  ngOnInit(): void {
    if (this.customerData) {
      this.isEditMode = true;
      this.fetchAndPopulateCustomerData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customerData'] && !changes['customerData'].firstChange) {
      if (this.customerData) {
        this.isEditMode = true;
        this.fetchAndPopulateCustomerData();
      } else {
        this.isEditMode = false;
        this.resetForm();
      }
    }
  }

  private fetchAndPopulateCustomerData(): void {
    if (this.customerData && this.customerData.id) {
      this.isLoading = true;
      this.customerService.getCustomerById(this.customerData.id).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          const customer = response.data || response;
          this.populateFormWithCustomerData(customer);
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Error fetching customer details:', error);
          // Fallback to using the passed customer data
          this.populateFormWithCustomerData(this.customerData);
        }
      });
    }
  }

  private populateFormWithCustomerData(customer: any): void {
    if (customer) {
      // Extract name and logo from the combined name field if in edit mode
      const fullName = customer.name || '';
      const nameParts = fullName.split(' ');
      const name = nameParts.slice(0, -1).join(' ') || '';
      const logo = nameParts[nameParts.length - 1] || '';

      this.customerForm.patchValue({
        name: name,
        logo: logo,
        slug: customer.slug || '',
        email: customer.email || '',
        subscriptionActive: customer.subscriptionActive,
        description: customer.description || ''
      });
    }
  }

  onSubmit() {
    if (this.customerForm.invalid) {
      this.toastService.showError('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    this.isLoading = true;
    const formValue = this.customerForm.value;

    const payload = {
      id: this.isEditMode ? this.customerData.id : 0,
      name: `${formValue.name} ${formValue.logo}`,
      description: formValue.description || `${formValue.name} ${formValue.logo}`,
      slug: formValue.slug,
      subscriptionActive: formValue.subscriptionActive,
      email: formValue.email
    };

    if (this.isEditMode) {
      this.customerService.updateCustomer(this.customerData.id, payload).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.toastService.showSuccess('Success', 'Customer updated successfully.');
          this.customerUpdated.emit(response);
          this.customerForm.reset();
          this.isEditMode = false;
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Error updating customer:', error);
          this.toastService.showError('Error', 'Failed to update customer. Please try again.');
        }
      });
    } else {
      this.customerService.createCustomer(payload).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.toastService.showSuccess('Success', 'Customer created successfully.');
          this.customerAdded.emit(response);
          this.customerForm.reset();
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Error creating customer:', error);
          this.toastService.showError('Error', 'Failed to create customer. Please try again.');
        }
      });
    }
  }

  // getSelectedPermissions(): string[] {
  //   const checked = document.querySelectorAll('input[name="module"]:checked');
  //   return Array.from(checked).map((checkbox: any) => checkbox.value);
  // }

  resetForm() {
    if (!this.isLoading) {
      this.customerForm.reset();
      this.isEditMode = false;
      this.customerData = null;
    }
  }
}
