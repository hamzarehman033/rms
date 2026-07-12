import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DeviceInfrastructurePayload, DevicesService, Site, ToastService } from '@app/core';

type InfrastructureSection = 'Battery' | 'Solar' | 'Generator';

@Component({
  selector: 'app-site-configuration',
  templateUrl: './site-configuration.component.html',
  styleUrl: './site-configuration.component.css',
  standalone: false,
})
export class SiteConfigurationComponent {
  @Input() site: Site | null = null;
  @Input() deviceId: string | number | null = null;
  @Output() siteConfigured = new EventEmitter<any>();

  configForm: FormGroup;
  isLoadingConfiguration = false;
  isSaving = false;
  sectionEnabled: InfrastructureSection[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private devices: DevicesService,
    private toastService: ToastService
  ) {
    this.configForm = this.formBuilder.group({
      rectifier: this.formBuilder.group({
        brand: ['', Validators.required],
        qty: ['', Validators.required],
        capacity: ['', Validators.required]
      }),
      battery: this.formBuilder.group({
        brand: [''],
        qty: [''],
        capacity: ['']
      }),
      solar: this.formBuilder.group({
        brand: [''],
        qty: [''],
        capacity: ['']
      }),
      generator: this.formBuilder.group({
        brand: [''],
        qty: [''],
        capacity: ['']
      }),
      rmsSerialNumber: [''],
      simCardNumber: [''],
      aiEhsInstalled: [false],
      aiSecurityInstalled: [false],
      camerasInstalledCount: ['']
    });
  }

  ngOnInit(): void {
    this.loadInfrastructure();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['site'] || changes['deviceId']) {
      this.loadInfrastructure();
    }
  }

  submitConfiguration() {
    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();
      return;
    }

    const resolvedDeviceId = this.resolveDeviceId();
    if (!resolvedDeviceId) {
      this.toastService.showError('Device ID is required to update infrastructure');
      return;
    }

    this.isSaving = true;
    this.devices.updateDeviceInfrastructure(resolvedDeviceId, this.buildPayload()).subscribe({
      next: (response: any) => {
        this.toastService.showSuccess('Site configuration updated successfully');
        this.siteConfigured.emit(response);
      },
      error: () => {
        this.toastService.showError('Failed to update site configuration');
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  closeConfiguration() {
    this.siteConfigured.emit(null);
  }

  isSectionEnabled(section: InfrastructureSection): boolean {
    return this.sectionEnabled.includes(section);
  }

  setSectionEnabled(section: InfrastructureSection, isEnabled: boolean): void {
    if (isEnabled && !this.isSectionEnabled(section)) {
      this.sectionEnabled = [...this.sectionEnabled, section];
      return;
    }

    if (!isEnabled) {
      this.sectionEnabled = this.sectionEnabled.filter(item => item !== section);
    }
  }

  private loadInfrastructure(): void {
    const resolvedDeviceId = this.resolveDeviceId();
    if (!resolvedDeviceId) {
      return;
    }

    this.isLoadingConfiguration = true;
    this.devices.getDeviceById(resolvedDeviceId).subscribe({
      next: (response: any) => {
        const payload = this.extractInfrastructurePayload(response);
        this.patchInfrastructureForm(payload);
      },
      error: () => {
        this.toastService.showError('Failed to load existing site configuration');
      },
      complete: () => {
        this.isLoadingConfiguration = false;
      }
    });
  }

  private resolveDeviceId(): string | number | null {
    return this.deviceId ?? this.site?.deviceId ?? null;
  }

  private extractInfrastructurePayload(response: any): any {
    const responseData = response?.data ?? response ?? {};
    return responseData.infrastructure ?? responseData.deviceInfrastructure ?? responseData;
  }

  private patchInfrastructureForm(payload: any): void {
    this.configForm.patchValue({
      rectifier: {
        brand: payload?.rectifierBrand ?? '',
        qty: this.toNumberOrBlank(payload?.rectifierQty),
        capacity: payload?.rectifierCapacity ?? ''
      },
      battery: {
        brand: payload?.batteryBrand ?? '',
        qty: this.toNumberOrBlank(payload?.batteryQty),
        capacity: payload?.batteryCapacity ?? ''
      },
      solar: {
        brand: payload?.solarBrand ?? '',
        qty: this.toNumberOrBlank(payload?.solarQty),
        capacity: payload?.solarCapacity ?? ''
      },
      generator: {
        brand: payload?.generatorBrand ?? '',
        qty: this.toNumberOrBlank(payload?.generatorQty),
        capacity: payload?.generatorCapacity ?? ''
      },
      rmsSerialNumber: payload?.rmsSerialNumber ?? '',
      simCardNumber: payload?.simCardNumber ?? '',
      aiEhsInstalled: !!payload?.aiEhsInstalled,
      aiSecurityInstalled: !!payload?.aiSecurityInstalled,
      camerasInstalledCount: this.toNumberOrBlank(payload?.camerasInstalledCount)
    });

    this.sectionEnabled = payload.powerSources ?? [];
  }

  private buildPayload(): DeviceInfrastructurePayload {
    const formValue = this.configForm.value;
    return {
      rectifierBrand: formValue.rectifier?.brand ?? '',
      rectifierQty: Number(formValue.rectifier?.qty) || 0,
      rectifierCapacity: formValue.rectifier?.capacity ?? '',
      batteryBrand: this.isSectionEnabled('Battery') ? formValue.battery?.brand ?? '' : '',
      batteryQty: this.isSectionEnabled('Battery') ? Number(formValue.battery?.qty) || 0 : 0,
      batteryCapacity: this.isSectionEnabled('Battery') ? formValue.battery?.capacity ?? '' : '',
      solarBrand: this.isSectionEnabled('Solar') ? formValue.solar?.brand ?? '' : '',
      solarQty: this.isSectionEnabled('Solar') ? Number(formValue.solar?.qty) || 0 : 0,
      solarCapacity: this.isSectionEnabled('Solar') ? formValue.solar?.capacity ?? '' : '',
      generatorBrand: this.isSectionEnabled('Generator') ? formValue.generator?.brand ?? '' : '',
      generatorQty: this.isSectionEnabled('Generator') ? Number(formValue.generator?.qty) || 0 : 0,
      generatorCapacity: this.isSectionEnabled('Generator') ? formValue.generator?.capacity ?? '' : '',
      rmsSerialNumber: formValue.rmsSerialNumber ?? '',
      simCardNumber: formValue.simCardNumber ?? '',
      camerasInstalledCount: Number(formValue.camerasInstalledCount) || 0,
      aiEhsInstalled: !!formValue.aiEhsInstalled,
      aiSecurityInstalled: !!formValue.aiSecurityInstalled,
      powerSources: this.sectionEnabled
    };
  }

  private toNumberOrBlank(value: any): number | '' {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : '';
  }

}
