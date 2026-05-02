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
    { label: 'South 1A', value: 'south-1a' },
    { label: 'North 1B', value: 'north-1b' },
    { label: 'North 2A', value: 'north-2a' },
  ];
  cities = [
    { label: 'Karachi', value: 'karachi' },
    { label: 'Lahore', value: 'lahore' },
    { label: 'Islamabad', value: 'islamabad' },
    { label: 'Rawalpindi', value: 'rawalpindi' },
    { label: 'Faisalabad', value: 'faisalabad' },
    { label: 'Multan', value: 'multan' },
    { label: 'Peshawar', value: 'peshawar' },
    { label: 'Quetta', value: 'quetta' },
    { label: 'Hyderabad', value: 'hyderabad' },
    { label: 'Gujranwala', value: 'gujranwala' },
  ];

  constructor(private fb: FormBuilder) {
    this.locationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      region: ['', Validators.required],
      coordinates: ['']
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
