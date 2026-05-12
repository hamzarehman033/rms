import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';

interface Site {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'warning';
  type: string;
  location: string;
  battery: string;
  lastSeen: string;
}

@Component({
  selector: 'app-site-configuration',
  templateUrl: './site-configuration.component.html',
  styleUrl: './site-configuration.component.css',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputNumberModule,
    CalendarModule
  ],
})
export class SiteConfigurationComponent {
  @Input() site: Site | null = null;
  @Output() siteConfigured = new EventEmitter<any>();

  configForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.configForm = this.formBuilder.group({
      rectifier: this.formBuilder.group({
        brand: ['', Validators.required],
        quantity: ['', [Validators.required, Validators.min(0)]],
        capacity: ['', [Validators.required, Validators.min(0)]]
      }),
      battery: this.formBuilder.group({
        brand: ['', Validators.required],
        quantity: ['', [Validators.required, Validators.min(0)]],
        capacity: ['', [Validators.required, Validators.min(0)]]
      }),
      solar: this.formBuilder.group({
        brand: ['', Validators.required],
        quantity: ['', [Validators.required, Validators.min(0)]],
        capacity: ['', [Validators.required, Validators.min(0)]]
      }),
      generator: this.formBuilder.group({
        brand: ['', Validators.required],
        quantity: ['', [Validators.required, Validators.min(0)]],
        capacity: ['', [Validators.required, Validators.min(0)]]
      }),
      rmsDeviceSerialNumber: ['', Validators.required],
      simCardNumber: ['', Validators.required],
      aiEhsInstalled: [false],
      aiSecurityInstalled: [false],
      numberOfCamerasInstalled: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    if (this.site) {
      // Initialize form with site data if needed
    }
  }

  submitConfiguration() {
    if (this.configForm.valid) {
      this.siteConfigured.emit(this.configForm.value);
    }
  }

  closeConfiguration() {
    this.siteConfigured.emit(null);
  }
}
