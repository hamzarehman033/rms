import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-add-device',
  standalone: false,
  templateUrl: './add-device.component.html',
  styleUrl: './add-device.component.css'
})
export class AddDeviceComponent {
  @Output() deviceAdded = new EventEmitter<any>();

  deviceForm: FormGroup;
  deviceTypes = [
    { label: 'Sensor', value: 'sensor' },
    { label: 'Camera', value: 'camera' },
    { label: 'Actuator', value: 'actuator' },
    { label: 'Gateway', value: 'gateway' }
  ];

  constructor(private fb: FormBuilder) {
    this.deviceForm = this.fb.group({
      deviceName: ['', [Validators.required, Validators.minLength(3)]],
      deviceId: ['', Validators.required],
      deviceType: ['', Validators.required],
      location: ['', Validators.required],
      battery: [100, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  onSubmit() {
    if (this.deviceForm.valid) {
      this.deviceAdded.emit(this.deviceForm.value);
      this.deviceForm.reset({ battery: 100 });
    }
  }

  resetForm() {
    this.deviceForm.reset({ battery: 100 });
  }
}
