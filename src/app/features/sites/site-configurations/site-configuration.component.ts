import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DeviceCameraPayload, DeviceInfrastructurePayload, DevicesService, Site } from '@app/core';
import { toast } from '../../../utils/global-toast';

type InfrastructureSection = 'Battery' | 'Solar' | 'Generator';

@Component({
  selector: 'app-site-configuration',
  templateUrl: './site-configuration.component.html',
  styleUrl: './site-configuration.component.css',
  standalone: false,
})
export class SiteConfigurationComponent {
  private static readonly maxCameras = 2;
  private static readonly cameraIndexes = [1, 2] as const;
  @Input() site: Site | null = null;
  @Input() deviceId: string | number | null = null;
  @Output() siteConfigured = new EventEmitter<any>();

  configForm: FormGroup;
  isLoadingConfiguration = false;
  isSaving = false;
  sectionEnabled: InfrastructureSection[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private devices: DevicesService
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
      cameras: this.formBuilder.array([])
    });
  }

  get cameras(): FormArray {
    return this.configForm.get('cameras') as FormArray;
  }

  get canAddCamera(): boolean {
    return this.cameras.length < SiteConfigurationComponent.maxCameras;
  }

  cameraLabel(index: number): string {
    return `Camera ${this.cameras.at(index).get('cameraIndex')?.value}`;
  }

  addCamera(): void {
    if (!this.canAddCamera) {
      return;
    }

    this.cameras.push(this.createCameraGroup());
  }

  removeCamera(index: number): void {
    this.cameras.removeAt(index);
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
      toast.error('Device ID is required to update infrastructure');
      return;
    }

    this.isSaving = true;
    this.devices.updateDeviceInfrastructure(resolvedDeviceId, this.buildPayload()).subscribe({
      next: (response: any) => {
        toast.success('Site configuration updated successfully');
        this.siteConfigured.emit(response);
      },
      error: () => {
        toast.error('Failed to update site configuration');
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
        toast.error('Failed to load existing site configuration');
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
      aiSecurityInstalled: !!payload?.aiSecurityInstalled
    });

    this.patchCameras(payload?.cameras);
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
      cameras: this.buildCamerasPayload(formValue.cameras),
      camerasInstalledCount: this.cameras.length,
      aiEhsInstalled: !!formValue.aiEhsInstalled,
      aiSecurityInstalled: !!formValue.aiSecurityInstalled,
      powerSources: this.sectionEnabled
    };
  }

  private createCameraGroup(camera?: Partial<DeviceCameraPayload>): FormGroup {
    return this.formBuilder.group({
      cameraIndex: [this.resolveCameraIndex(camera?.cameraIndex)],
      name: [camera?.name ?? '', Validators.required],
      isEnabled: [camera?.isEnabled ?? true]
    });
  }

  private patchCameras(cameras: unknown): void {
    this.cameras.clear();

    const rows = (Array.isArray(cameras) ? cameras : []) as Partial<DeviceCameraPayload>[];
    rows
      .slice()
      .sort((left, right) => Number(left?.cameraIndex ?? 0) - Number(right?.cameraIndex ?? 0))
      .slice(0, SiteConfigurationComponent.maxCameras)
      .forEach((camera) => {
        this.cameras.push(this.createCameraGroup({
          cameraIndex: this.resolveCameraIndex(camera?.cameraIndex),
          name: camera?.name ?? '',
          isEnabled: camera?.isEnabled ?? true
        }));
      });
  }

  private buildCamerasPayload(cameras: unknown): DeviceCameraPayload[] {
    if (!Array.isArray(cameras)) {
      return [];
    }

    return (cameras as Partial<DeviceCameraPayload>[]).map((camera) => ({
      cameraIndex: Number(camera.cameraIndex),
      name: (camera?.name ?? '').trim(),
      isEnabled: !!camera?.isEnabled
    }));
  }

  private resolveCameraIndex(value?: number): number {
    const parsed = Number(value);
    if ((parsed === 1 || parsed === 2) && !this.isCameraIndexUsed(parsed)) {
      return parsed;
    }

    return this.nextCameraIndex();
  }

  private nextCameraIndex(): number {
    const used = this.usedCameraIndexes();
    return SiteConfigurationComponent.cameraIndexes.find((index) => !used.has(index)) ?? 2;
  }

  private isCameraIndexUsed(index: number): boolean {
    return this.usedCameraIndexes().has(index);
  }

  private usedCameraIndexes(): Set<number> {
    return new Set(
      this.cameras.controls.map((control) => Number(control.get('cameraIndex')?.value))
    );
  }

  private toNumberOrBlank(value: any): number | '' {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : '';
  }

}
