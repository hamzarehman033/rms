import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ActivityService } from '../../core/services/activity.service';
import { DevicesService } from '../../core/services/devices.service';
import { toast } from '../../utils/global-toast';

@Component({
  selector: 'app-activities',
  standalone: false,
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css'
})
export class ActivitiesComponent implements OnInit {
  displayAddActivityDialog = false;
  selectedTab = 0;
  isLoading = false;
  searchTerm = '';
  activities: any[] = [];
  selectedActivityId: number | string | null = null;
  dialogHeader = 'Schedule Activity';
  private deviceNameById = new Map<number, string>();

  constructor(
    private activityService: ActivityService,
    private devicesService: DevicesService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadDevices();
    this.loadActivities();
  }

  loadActivities(): void {
    this.isLoading = true;
    this.activityService.getActivities({
      pagesize: 1000,
      pagenumber: 1,
      filters: [{ key: 'isActive', value: true, operator: 'equals' }]
    }).subscribe({
      next: (response: any) => {
        const activityList = response?.data?.pageData || [];
        const items = Array.isArray(activityList) ? activityList : [];
        this.activities = items.map((activity: any) => this.mapActivity(activity));
        this.isLoading = false;
      },
      error: () => {
        this.activities = [];
        this.isLoading = false;
      }
    });
  }

  openAddActivityDialog(): void {
    this.selectedActivityId = null;
    this.dialogHeader = 'Schedule Activity';
    this.displayAddActivityDialog = true;
  }

  openEditActivityDialog(activity: any): void {
    this.selectedActivityId = activity?.id ?? null;
    this.dialogHeader = 'Edit Activity';
    this.displayAddActivityDialog = true;
  }

  deleteActivity(activity: any): void {
    this.confirmationService.confirm({
      header: 'Delete Activity',
      message: `Are you sure you want to delete ${activity?.name || 'this activity'}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.isLoading = true;
        this.activityService.deleteActivity(activity.id).subscribe({
          next: () => {
            this.isLoading = false;
            toast.success('Success', 'Activity deleted successfully.');
            this.loadActivities();
          },
          error: () => {
            this.isLoading = false;
          }
        });
      }
    });
  }

  onActivityAdded(): void {
    this.displayAddActivityDialog = false;
    this.selectedActivityId = null;
    this.loadActivities();
  }

  onActivityUpdated(): void {
    this.displayAddActivityDialog = false;
    this.selectedActivityId = null;
    this.loadActivities();
  }

  get totalActivities(): number {
    return this.activities.length;
  }

  get upcomingActivities(): number {
    return this.activities.filter(activity => this.getScheduleStatus(activity) === 'Upcoming').length;
  }

  get todayActivities(): number {
    return this.activities.filter(activity => this.isToday(activity.date)).length;
  }

  get pastActivities(): number {
    return this.activities.filter(activity => this.getScheduleStatus(activity) === 'Past').length;
  }

  get filteredActivities(): any[] {
    let filtered = this.activities;

    if (this.selectedTab === 1) {
      filtered = filtered.filter(activity => this.getScheduleStatus(activity) === 'Upcoming');
    } else if (this.selectedTab === 2) {
      filtered = filtered.filter(activity => this.isToday(activity.date));
    } else if (this.selectedTab === 3) {
      filtered = filtered.filter(activity => this.getScheduleStatus(activity) === 'Past');
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(activity =>
        String(activity.name ?? '').toLowerCase().includes(term) ||
        String(activity.team ?? '').toLowerCase().includes(term) ||
        String(activity.deviceName ?? '').toLowerCase().includes(term) ||
        String(activity.description ?? '').toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  getScheduleStatus(activity: any): string {
    const start = this.toDateTime(activity.date, activity.startTime);
    const end = this.toDateTime(activity.date, activity.endTime);
    if (!start) {
      return 'Upcoming';
    }

    const now = Date.now();
    if (end && now > end.getTime()) {
      return 'Past';
    }
    if (now >= start.getTime() && (!end || now <= end.getTime())) {
      return 'In Progress';
    }
    return 'Upcoming';
  }

  formatTime(value: string): string {
    return value ? String(value).slice(0, 5) : '-';
  }

  private loadDevices(): void {
    this.devicesService.getDevices().subscribe({
      next: (response: any) => {
        const list = response?.data?.pageData || response?.data || response || [];
        const items = Array.isArray(list) ? list : [];
        this.deviceNameById.clear();
        items.forEach((item: any) => {
          const id = Number(item?.id ?? item?.deviceId ?? item?.siteId);
          if (!Number.isFinite(id) || id <= 0) {
            return;
          }
          const name = String(item?.siteName ?? item?.name ?? item?.deviceName ?? `Site ${id}`).trim();
          this.deviceNameById.set(id, name);
        });
        this.activities = this.activities.map(activity => ({
          ...activity,
          deviceName: this.deviceNameById.get(Number(activity.deviceId)) || activity.deviceName
        }));
      }
    });
  }

  private mapActivity(activity: any): any {
    const deviceId = Number(activity.deviceId) || 0;
    return {
      id: activity.id,
      deviceId,
      deviceName: this.deviceNameById.get(deviceId) || `Device ${deviceId}`,
      name: activity.name || 'Unknown',
      description: activity.description || '',
      date: activity.date ? String(activity.date).slice(0, 10) : '',
      startTime: activity.startTime || '',
      endTime: activity.endTime || '',
      team: activity.team || '-',
      persons: activity.persons ?? 0,
      isActive: activity.isActive ?? true
    };
  }

  private isToday(dateValue: string): boolean {
    if (!dateValue) {
      return false;
    }
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) {
      return false;
    }
    const today = new Date();
    return parsed.getFullYear() === today.getFullYear()
      && parsed.getMonth() === today.getMonth()
      && parsed.getDate() === today.getDate();
  }

  private toDateTime(dateValue: string, timeValue: string): Date | null {
    if (!dateValue) {
      return null;
    }
    const datePart = String(dateValue).slice(0, 10);
    const timePart = timeValue ? String(timeValue).slice(0, 8) : '00:00:00';
    const parsed = new Date(`${datePart}T${timePart}`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
}
