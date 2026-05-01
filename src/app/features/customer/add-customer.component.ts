import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-customer',
  standalone: false,
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent {
  @Output() customerAdded = new EventEmitter<any>();

  customerForm: FormGroup;
  customerTypes = [
    { label: 'Individual', value: 'individual' },
    { label: 'Business', value: 'business' },
    { label: 'Enterprise', value: 'enterprise' }
  ];

  constructor(private fb: FormBuilder) {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-()]+$/)]],
      customerType: ['', Validators.required],
      address: [''],
      city: [''],
      country: ['']
    });
  }

  onSubmit() {
    if (this.customerForm.valid) {
      this.customerAdded.emit(this.customerForm.value);
      this.customerForm.reset();
    }
  }

  resetForm() {
    this.customerForm.reset();
  }
}
