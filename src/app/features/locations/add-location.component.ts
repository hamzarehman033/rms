import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-location',
  standalone: false,
  templateUrl: './add-location.component.html',
  styleUrl: './add-location.component.css'
})
export class AddLocationComponent {
  @Output() locationAdded = new EventEmitter<any>();

  locationForm: FormGroup;
  regions = [
    { label: 'North', value: 'north' },
    { label: 'Central', value: 'central' },
    { label: 'South', value: 'south' },
    { label: 'East', value: 'east' },
    { label: 'West', value: 'west' }
  ];

  subRegions = [
    { label: 'Plant A', value: 'plant-a' },
    { label: 'Plant B', value: 'plant-b' },
    { label: 'Warehouse A', value: 'warehouse-a' },
    { label: 'Warehouse B', value: 'warehouse-b' },
    { label: 'DC West', value: 'dc-west' },
    { label: 'DC East', value: 'dc-east' }
  ];

  timeZones = [
    { label: 'UTC', value: 'UTC' },
    { label: 'GMT+1', value: 'GMT+1' },
    { label: 'GMT+2', value: 'GMT+2' },
    { label: 'GMT+3', value: 'GMT+3' },
    { label: 'GMT+4', value: 'GMT+4' },
    { label: 'GMT+5', value: 'GMT+5' },
    { label: 'GMT+5:30', value: 'GMT+5:30' },
    { label: 'GMT+6', value: 'GMT+6' },
    { label: 'EST', value: 'EST' },
    { label: 'CST', value: 'CST' },
    { label: 'PST', value: 'PST' }
  ];

  constructor(private fb: FormBuilder) {
    this.locationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      region: ['', Validators.required],
      subRegion: ['', Validators.required],
      address: ['', Validators.required],
      coordinates: ['', Validators.required],
      timeZone: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.locationForm.valid) {
      this.locationAdded.emit(this.locationForm.value);
      this.locationForm.reset();
    }
  }

  resetForm() {
    this.locationForm.reset();
  }
}

