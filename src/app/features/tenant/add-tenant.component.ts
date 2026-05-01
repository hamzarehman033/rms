import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-tenant',
  standalone: false,
  templateUrl: './add-tenant.component.html',
  styleUrl: './add-tenant.component.css'
})
export class AddTenantComponent {
  @Output() tenantAdded = new EventEmitter<any>();

  tenantForm: FormGroup;
  tenantTypes = [
    { label: 'Standard', value: 'standard' },
    { label: 'Premium', value: 'premium' },
    { label: 'Enterprise', value: 'enterprise' }
  ];

  constructor(private fb: FormBuilder) {
    this.tenantForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      domain: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      tenantType: ['', Validators.required],
      description: [''],
      active: [true]
    });
  }

  onSubmit() {
    if (this.tenantForm.valid) {
      this.tenantAdded.emit(this.tenantForm.value);
      this.tenantForm.reset({ active: true });
    }
  }

  resetForm() {
    this.tenantForm.reset({ active: true });
  }
}
