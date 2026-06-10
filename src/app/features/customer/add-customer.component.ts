import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../core/services/customer.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-add-customer',
  standalone: false,
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent {
  @Output() customerAdded = new EventEmitter<any>();

  customerForm: FormGroup;
  isLoading = false;
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
      logo: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      description: [''],
      // phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-()]+$/)]],
      // customerType: ['', Validators.required],
      // address: [''],
      // city: [''],
      // country: [''],
      // permissions: [[]]
    });
  }

  onSubmit() {
    if (this.customerForm.invalid) {
      this.toastService.showError('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    this.isLoading = true;
    const formValue = this.customerForm.value;

    const payload = {
      id: 0,
      name: `${formValue.name} ${formValue.logo}`,
      description: formValue.description || `${formValue.name} ${formValue.logo}`,
      email: formValue.email
    };

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

  // getSelectedPermissions(): string[] {
  //   const checked = document.querySelectorAll('input[name="module"]:checked');
  //   return Array.from(checked).map((checkbox: any) => checkbox.value);
  // }

  resetForm() {
    if (!this.isLoading) {
      this.customerForm.reset();
    }
  }
}
