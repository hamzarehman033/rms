import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-site',
  standalone: false,
  templateUrl: './add-site.component.html',
  styleUrl: './add-site.component.css'
})
export class AddSiteComponent {
  @Output() siteAdded = new EventEmitter<any>();

  siteForm: FormGroup;
  subscriptionTypes = [
    { label: 'Basic', value: 'basic' },
    { label: 'Standard', value: 'standard' },
    { label: 'Enterprise', value: 'enterprise' }
  ];

  locations = [
    { label: 'Plant A', value: 'plant-a' },
    { label: 'Plant B', value: 'plant-b' },
    { label: 'Warehouse A', value: 'warehouse-a' },
    { label: 'Warehouse B', value: 'warehouse-b' },
    { label: 'DC West', value: 'dc-west' },
    { label: 'DC East', value: 'dc-east' }
  ];

  constructor(private fb: FormBuilder) {
    this.siteForm = this.fb.group({
      siteName: ['', [Validators.required, Validators.minLength(3)]],
      siteId: ['', Validators.required],
      subscriptionType: ['', Validators.required],
      location: ['', Validators.required],
      installationDate: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.siteForm.valid) {
      this.siteAdded.emit(this.siteForm.value);
      this.siteForm.reset();
    }
  }

  resetForm() {
    this.siteForm.reset();
  }
}

