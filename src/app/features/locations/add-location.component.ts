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

  constructor(private fb: FormBuilder) {
    this.locationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
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
