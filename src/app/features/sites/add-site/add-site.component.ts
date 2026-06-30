import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DevicePayload, DevicesService, LocationsService, Site, SitesService, ToastService } from '@app/core';

interface OptionItem {
  label: string;
  value: number;
}

@Component({
  selector: 'app-add-site',
  standalone: false,
  templateUrl: './add-site.component.html',
  styleUrl: './add-site.component.css'
})
export class AddSiteComponent implements OnInit {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() site: Site | null = null;
  @Output() siteAdded = new EventEmitter<any>();
  isLoading = false;
  activeStep = 1;

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

  // Location section
  locationForm: FormGroup;
  regions: OptionItem[] = [];
  subRegions: OptionItem[] = [];
  zones: OptionItem[] = [];
  private locationTree: any[] = [];

  // timeZones = [
  //   { label: 'UTC', value: 'UTC' },
  //   { label: 'GMT+1', value: 'GMT+1' },
  //   { label: 'GMT+2', value: 'GMT+2' },
  //   { label: 'GMT+3', value: 'GMT+3' },
  //   { label: 'GMT+4', value: 'GMT+4' },
  //   { label: 'GMT+5', value: 'GMT+5' },
  //   { label: 'GMT+5:30', value: 'GMT+5:30' },
  //   { label: 'GMT+6', value: 'GMT+6' },
  //   { label: 'EST', value: 'EST' },
  //   { label: 'CST', value: 'CST' },
  //   { label: 'PST', value: 'PST' }
  // ];

  // MQTT section
  mqttForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private locationsService: LocationsService,
    private sitesService: SitesService,
    private devicesService: DevicesService,
    private toastService: ToastService
  ) {
    this.siteForm = this.fb.group({
      siteName: ['', [Validators.required, Validators.minLength(3)]],
      code: ['', Validators.required],
      status: ['Active', Validators.required],
      subscriptionType: ['', Validators.required],
      installationDate: ['', Validators.required]
    });
    
    this.locationForm = this.fb.group({
      regionId: [null, Validators.required],
      subRegionId: [null, Validators.required],
      zoneId: [null, Validators.required],
      address: ['', Validators.required],
      coordinates: ['', Validators.required],
      // timeZone: ['', Validators.required]
    });

    this.mqttForm = this.fb.group({
      mqttBrokerUrl: ['', Validators.required],
      mqttPort: ['', Validators.required],
      mqttUsername: ['', Validators.required],
      mqttPassword: ['', Validators.required],
      clientId: ['', Validators.required],
      publishTopic: ['', Validators.required],
      rmsSubscribeTopic: ['', Validators.required],
      aiSubscribeTopic: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadLocationTree();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['mode'] || changes['site']) && this.mode === 'edit' && this.site) {
      this.prefillForEdit();
    }
  }

  onRegionChange(): void {
    const selectedRegionId = this.locationForm.get('regionId')?.value;
    const regionNode = this.locationTree.find((region: any) => region.id === selectedRegionId);
    const subRegionNodes = Array.isArray(regionNode?.children) ? regionNode.children : [];

    this.subRegions = subRegionNodes.map((subRegion: any) => ({
      label: subRegion.name,
      value: subRegion.id
    }));
    this.zones = [];
    this.locationForm.patchValue({ subRegionId: null, zoneId: null });
  }

  onSubRegionChange(): void {
    const selectedRegionId = this.locationForm.get('regionId')?.value;
    const selectedSubRegionId = this.locationForm.get('subRegionId')?.value;

    const regionNode = this.locationTree.find((region: any) => region.id === selectedRegionId);
    const subRegionNodes = Array.isArray(regionNode?.children) ? regionNode.children : [];
    const selectedSubRegion = subRegionNodes.find((subRegion: any) => subRegion.id === selectedSubRegionId);
    const zoneNodes = Array.isArray(selectedSubRegion?.children) ? selectedSubRegion.children : [];

    this.zones = zoneNodes.map((zone: any) => ({
      label: zone.name,
      value: zone.id
    }));
    this.locationForm.patchValue({ zoneId: null });
  }

  onSubmit() {
    if (this.siteForm.valid && this.locationForm.valid && this.mqttForm.valid) {
      const siteValue = this.siteForm.value;
      const locationValue = this.locationForm.value;
      const mqttValue = this.mqttForm.value;

      const sitePayload = {
        regionId: Number(locationValue.regionId) || 0,
        subRegionId: Number(locationValue.subRegionId) || 0,
        zoneId: Number(locationValue.zoneId) || 0,
        name: siteValue.siteName,
        code: siteValue.code,
        status: siteValue.status,
        address: locationValue.address,
        coordinates: locationValue.coordinates
      };

      const devicePayload = {
        siteId: siteValue.siteId || this.site?.siteId,
        id: siteValue.siteId || this.site?.siteId,
        name: siteValue.siteName,
        code: siteValue.code,
        status: siteValue.status,
        installationDate: new Date(siteValue.installationDate).toISOString(),
        mqttHost: mqttValue.mqttBrokerUrl,
        mqttPort: Number(mqttValue.mqttPort) || 0,
        mqttClientId: mqttValue.clientId,
        mqttUsername: mqttValue.mqttUsername,
        mqttPassword: mqttValue.mqttPassword,
        useTls: true,
        keepAliveSeconds: 30,
        rmsSubscribeTopic: mqttValue.rmsSubscribeTopic,
        aiSubscribeTopic: mqttValue.aiSubscribeTopic
      };

      if (this.mode === 'edit' && this.site) {
        this.updateSiteAndDevice(sitePayload, devicePayload);
        return;
      }

      this.isLoading = true;
      this.sitesService.createSiteDetails(sitePayload).subscribe({
        next: (response: any) => {
          const siteId = response?.data?.id;
          devicePayload.siteId = siteId;
          this.devicesService.createDevice(devicePayload).subscribe({
            next: (response: any) => {
              this.isLoading = false;
              this.toastService.showSuccess('Site and device created successfully');
              this.siteAdded.emit(response);
              this.resetForm();
            },
            error: () => {
              this.isLoading = false;
              this.toastService.showError('Site created but device creation failed');
            }
          });
        },
        error: () => {
          this.isLoading = false;
          this.toastService.showError('Failed to create site');
        }
      });
    }
  }

  resetForm() {
    this.siteForm.reset();
    this.locationForm.reset({
      status: 'Active'
    });
    this.mqttForm.reset();
    this.subRegions = [];
    this.zones = [];
  }

  private loadLocationTree(): void {
    this.locationsService.getLocationTree().subscribe({
      next: (response: any) => {
        const treeData = response?.data || response || [];
        this.locationTree = Array.isArray(treeData) ? treeData : [];
        this.regions = this.locationTree.map((region: any) => ({
          label: region.name,
          value: region.id
        }));
      },
      error: () => {
        this.locationTree = [];
        this.regions = [];
      }
    });
  }

  get submitLabel(): string {
    return this.mode === 'edit' ? 'Update Site' : 'Submit';
  }

  private prefillForEdit(): void {
    if (!this.site) {
      return;
    }

    const siteId = this.site.siteId;
    if (siteId !== undefined && siteId !== null && siteId !== '') {
      this.loadSiteDetailsForEdit(siteId);
      return;
    }
  }

  private loadSiteDetailsForEdit(siteId: string | number): void {
    this.sitesService.getSiteById(siteId).subscribe({
      next: (response: any) => {
        const details = this.extractCombinedDetails(response);
        this.patchEditFormsFromCombinedDetails(details);
      },
      error: () => {
        // Fallback to current table payload if details call fails.
        this.patchEditFormsFromCombinedDetails(this.site);
      }
    });
  }

  private patchEditFormsFromCombinedDetails(details: any): void {
    if (!details) {
      return;
    }

    this.activeStep = 1;
    const siteData = details?.site ?? details;
    const deviceData = this.resolveDeviceData(details);

    const regionId = this.toNumberOrNull(siteData?.regionId ?? details?.regionId);
    const subRegionId = this.toNumberOrNull(siteData?.subRegionId ?? details?.subRegionId);
    const zoneId = this.toNumberOrNull(siteData?.zoneId ?? details?.zoneId);

    this.setDependentLocationOptions(regionId, subRegionId);

    this.siteForm.patchValue({
      siteName: siteData?.siteName || siteData?.name || this.site?.name || '',
      code: siteData?.siteCode || siteData?.code || this.site?.code || this.site?.siteCode || '',
      status: (siteData?.siteStatus || siteData?.status || this.site?.status || 'active').toString().toLowerCase(),
      subscriptionType: 'basic',
      installationDate: this.toDateInput(
        deviceData?.deviceInstallationDate || deviceData?.installationDate || new Date().toISOString()
      )
    });

    this.locationForm.patchValue({
      regionId,
      subRegionId,
      zoneId,
      address: siteData?.address || this.site?.address || '',
      coordinates: siteData?.coordinates || this.site?.coordinates || ''
    });

    this.mqttForm.patchValue({
      mqttBrokerUrl: deviceData?.mqttHost ?? '',
      mqttPort: deviceData?.mqttPort ?? '',
      mqttUsername: deviceData?.mqttUsername ?? '',
      mqttPassword: deviceData?.mqttPassword ?? '',
      clientId: deviceData?.mqttClientId ?? '',
      publishTopic: deviceData?.publishTopic ?? '',
      rmsSubscribeTopic: deviceData?.rmsSubscribeTopic ?? '',
      aiSubscribeTopic: deviceData?.aiSubscribeTopic ?? ''
    });

    const resolvedDeviceId =
      deviceData?.deviceId ??
      siteData?.deviceId ??
      this.site?.deviceId;

    this.site = {
      ...(this.site ?? ({} as Site)),
      siteId: this.site?.siteId ?? siteData?.siteId,
      deviceId: resolvedDeviceId
    } as Site;
  }

  private updateSiteAndDevice(sitePayload: any, devicePayload: Partial<DevicePayload>): void {
    const siteId = this.site?.siteId;
    if (!siteId) {
      this.toastService.showError('Site id is missing, cannot update site');
      return;
    }

    this.isLoading = true;
    this.sitesService.updateSite(siteId, sitePayload).subscribe({
      next: () => {
        const deviceId = this.site?.deviceId;
        if (!deviceId) {
          this.isLoading = false;
          this.toastService.showSuccess('Site updated successfully');
          this.siteAdded.emit({ mode: 'edit' });
          return;
        }

        this.devicesService.updateDevice(deviceId, devicePayload).subscribe({
          next: () => {
            this.isLoading = false;
            this.toastService.showSuccess('Site updated successfully');
            this.siteAdded.emit({ mode: 'edit' });
          },
          error: () => {
            this.isLoading = false;
            this.toastService.showError('Site updated but device update failed');
          }
        });
      },
      error: () => {
        this.isLoading = false;
        this.toastService.showError('Failed to update site');
      }
    });
  }

  private extractCombinedDetails(response: any): any {
    return response?.data?.pageData ?? response?.data ?? response ?? null;
  }

  private resolveDeviceData(details: any): any {
    return details?.device ?? details?.deviceData ?? details;
  }

  private setDependentLocationOptions(regionId: number | null, subRegionId: number | null): void {
    if (regionId === null) {
      this.subRegions = [];
      this.zones = [];
      return;
    }

    const regionNode = this.locationTree.find((region: any) => region.id === regionId);
    const subRegionNodes = Array.isArray(regionNode?.children) ? regionNode.children : [];
    this.subRegions = subRegionNodes.map((subRegion: any) => ({
      label: subRegion.name,
      value: subRegion.id
    }));

    if (subRegionId === null) {
      this.zones = [];
      return;
    }

    const selectedSubRegion = subRegionNodes.find((subRegion: any) => subRegion.id === subRegionId);
    const zoneNodes = Array.isArray(selectedSubRegion?.children) ? selectedSubRegion.children : [];
    this.zones = zoneNodes.map((zone: any) => ({
      label: zone.name,
      value: zone.id
    }));
  }

  private toNumberOrNull(value: unknown): number | null {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  }

  private toDateInput(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
