import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivityService } from '../../../core/services/activity.service';
import { DevicesService } from '../../../core/services/devices.service';
import { toast } from '../../../utils/global-toast';

@Component({
  selector: 'app-add-activity',
  standalone: false,
  templateUrl: './add-activity.component.html',
  styleUrl: './add-activity.component.css'
})
export class AddActivityComponent implements OnInit {
  @Output() activityAdded = new EventEmitter<any>();

  activityForm: FormGroup;
  isLoading = false;
  sites: Array<{ label: string; value: number }> = [];

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private devicesService: DevicesService
  ) {
    this.activityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      siteId: [null, Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      company: ['', [Validators.required, Validators.minLength(2)]],
      technicians: [1, [Validators.required, Validators.min(1)]],
    }, { validators: AddActivityComponent.timeRangeValidator });
  }

  ngOnInit(): void {
    this.loadSites();
  }

  onSubmit(): void {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      toast.error('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    this.isLoading = true;
    const formValue = this.activityForm.value;
    const selectedSite = this.sites.find(site => site.value === formValue.siteId);

    const payload = {
      id: 0,
      name: formValue.name,
      date: formValue.date,
      startTime: formValue.startTime,
      endTime: formValue.endTime,
      company: formValue.company,
      technicians: Number(formValue.technicians),
      siteId: formValue.siteId,
      siteName: selectedSite?.label || ''
    };

    this.activityService.createActivity(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        toast.success('Success', 'Activity scheduled successfully.');
        this.activityAdded.emit(response);
        this.resetForm();
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error creating activity:', error);
        toast.error('Error', 'Failed to schedule activity. Please try again.');
      }
    });
  }

  resetForm(): void {
    if (!this.isLoading) {
      this.activityForm.reset({
        name: '',
        siteId: null,
        date: '',
        startTime: '',
        endTime: '',
        company: '',
        technicians: 1
      });
    }
  }

  private loadSites(): void {
    this.devicesService.getDevices().subscribe({
      next: (response: any) => {
        const list = response?.data?.pageData || response?.data || response || [];
        const items = Array.isArray(list) ? list : [];
        this.sites = items
          .map((item: any) => {
            const id = Number(item?.siteId ?? item?.deviceId ?? item?.id);
            if (!Number.isFinite(id) || id <= 0) {
              return null;
            }
            const label = String(item?.siteName ?? item?.name ?? item?.deviceName ?? `Site ${id}`).trim();
            return { label, value: id };
          })
          .filter((item: { label: string; value: number } | null): item is { label: string; value: number } => !!item);
      },
      error: () => {
        this.sites = [];
      }
    });
  }

  private static timeRangeValidator(group: AbstractControl): ValidationErrors | null {
    const startTime = group.get('startTime')?.value;
    const endTime = group.get('endTime')?.value;
    if (!startTime || !endTime) {
      return null;
    }
    return startTime < endTime ? null : { timeRange: true };
  }
}
