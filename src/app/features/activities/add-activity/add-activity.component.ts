import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Activity, ActivityService } from '../../../core/services/activity.service';
import { DevicesService } from '../../../core/services/devices.service';
import { toast } from '../../../utils/global-toast';

@Component({
  selector: 'app-add-activity',
  standalone: false,
  templateUrl: './add-activity.component.html',
  styleUrl: './add-activity.component.css'
})
export class AddActivityComponent implements OnInit, OnChanges {
  @Input() activityId: number | string | null = null;
  @Output() activityAdded = new EventEmitter<any>();
  @Output() activityUpdated = new EventEmitter<any>();

  activityForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  devices: Array<{ label: string; value: number }> = [];

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private devicesService: DevicesService
  ) {
    this.activityForm = this.fb.group({
      deviceId: [null, [Validators.required, Validators.min(1)]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      team: ['', [Validators.required, Validators.maxLength(100)]],
      persons: [0, [Validators.required, Validators.min(0)]],
    }, { validators: AddActivityComponent.timeRangeValidator });
  }

  ngOnInit(): void {
    this.loadDevices();
    if (this.activityId !== null && this.activityId !== undefined) {
      this.isEditMode = true;
      this.fetchAndPopulateActivity();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['activityId'] || changes['activityId'].firstChange) {
      return;
    }

    if (this.activityId !== null && this.activityId !== undefined) {
      this.isEditMode = true;
      this.fetchAndPopulateActivity();
      return;
    }

    this.isEditMode = false;
    this.resetForm();
  }

  onSubmit(): void {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      toast.error('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    this.isLoading = true;
    const formValue = this.activityForm.value;
    const payload: Activity = {
      deviceId: Number(formValue.deviceId),
      name: formValue.name,
      description: formValue.description,
      date: formValue.date,
      startTime: AddActivityComponent.toApiTime(formValue.startTime),
      endTime: AddActivityComponent.toApiTime(formValue.endTime),
      team: formValue.team,
      persons: Number(formValue.persons)
    };

    if (this.isEditMode) {
      const id = Number(this.activityId);
      this.activityService.updateActivity(id, { ...payload, id }).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          toast.success('Success', 'Activity updated successfully.');
          this.activityUpdated.emit(response);
          this.resetForm();
        },
        error: () => {
          this.isLoading = false;
        }
      });
      return;
    }

    this.activityService.createActivity(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        toast.success('Success', 'Activity scheduled successfully.');
        this.activityAdded.emit(response);
        this.resetForm();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  resetForm(): void {
    if (this.isLoading) {
      return;
    }

    this.activityForm.reset({
      deviceId: null,
      name: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      team: '',
      persons: 0
    });
    this.isEditMode = false;
    this.activityId = null;
  }

  private fetchAndPopulateActivity(): void {
    if (this.activityId === null || this.activityId === undefined) {
      return;
    }

    this.isLoading = true;
    this.activityService.getActivityById(this.activityId).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        const activity = response?.data || response;
        this.populateForm(activity);
      },
      error: () => {
        this.isLoading = false;
        toast.error('Error', 'Failed to load activity details. Please try again.');
      }
    });
  }

  private populateForm(activity: any): void {
    if (!activity) {
      return;
    }

    this.activityForm.patchValue({
      deviceId: Number(activity.deviceId) || null,
      name: activity.name || '',
      description: activity.description || '',
      date: AddActivityComponent.toInputDate(activity.date),
      startTime: AddActivityComponent.toInputTime(activity.startTime),
      endTime: AddActivityComponent.toInputTime(activity.endTime),
      team: activity.team || '',
      persons: activity.persons ?? 0
    });
  }

  private loadDevices(): void {
    this.devicesService.getDevices().subscribe({
      next: (response: any) => {
        const list = response?.data?.pageData || response?.data || response || [];
        const items = Array.isArray(list) ? list : [];
        this.devices = items
          .map((item: any) => {
            const id = Number(item?.id ?? item?.deviceId ?? item?.siteId);
            if (!Number.isFinite(id) || id <= 0) {
              return null;
            }

            const name = String(item?.siteName ?? item?.name ?? item?.deviceName ?? `Site ${id}`).trim();
            const code = String(item?.siteCode ?? item?.code ?? item?.deviceCode ?? '').trim();
            return { label: code ? `${name} (${code})` : name, value: id };
          })
          .filter((item: { label: string; value: number } | null): item is { label: string; value: number } => !!item);
      },
      error: () => {
        this.devices = [];
      }
    });
  }

  private static toApiTime(value: string): string {
    if (!value) {
      return value;
    }
    const normalized = String(value).trim();
    return normalized.length === 5 ? `${normalized}:00` : normalized.slice(0, 8);
  }

  private static toInputTime(value: string): string {
    return value ? String(value).slice(0, 5) : '';
  }

  private static toInputDate(value: string): string {
    return value ? String(value).slice(0, 10) : '';
  }

  private static timeRangeValidator(group: AbstractControl): ValidationErrors | null {
    const startTime = group.get('startTime')?.value;
    const endTime = group.get('endTime')?.value;
    if (!startTime || !endTime) {
      return null;
    }
    return AddActivityComponent.toApiTime(startTime) < AddActivityComponent.toApiTime(endTime)
      ? null
      : { timeRange: true };
  }
}
