import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DevicesService, LocationsService, SitesService, ToastService } from '@app/core';

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
        siteId: siteValue.code || siteValue.siteId,
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
}
