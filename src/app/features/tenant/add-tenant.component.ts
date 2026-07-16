import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-tenant',
  standalone: false,
  templateUrl: './add-tenant.component.html',
  styleUrl: './add-tenant.component.css'
})
export class AddTenantComponent implements OnChanges {
  @Input() tenantData: any = null;
  @Output() tenantAdded = new EventEmitter<any>();
  @Output() tenantUpdated = new EventEmitter<any>();

  tenantForm: FormGroup;
  isEditMode = false;
  statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Disabled', value: 'Disabled' }
  ];

  constructor(private fb: FormBuilder) {
    this.tenantForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      code: ['', [Validators.required]],
      status: ['Active', Validators.required],
      description: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['tenantData']) {
      return;
    }

    if (this.tenantData) {
      this.isEditMode = true;
      this.tenantForm.patchValue({
        name: this.tenantData.name ?? '',
        code: this.tenantData.code ?? '',
        status: this.tenantData.status ?? 'Active',
        description: this.tenantData.description ?? ''
      });
      return;
    }

    this.isEditMode = false;
    this.resetForm();
  }

  onSubmit() {
    if (this.tenantForm.valid) {
      if (this.isEditMode) {
        this.tenantUpdated.emit(this.tenantForm.value);
      } else {
        this.tenantAdded.emit(this.tenantForm.value);
      }
    }
  }

  resetForm() {
    this.tenantForm.reset({
      name: '',
      code: '',
      status: 'Active',
      description: ''
    });
  }
}
