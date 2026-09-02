import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityService } from '../../../core/services/activity.service';

@Component({
  selector: 'app-scheduled-activities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scheduled-activities.component.html',
  styleUrl: './scheduled-activities.component.css'
})
export class ScheduledActivitiesComponent implements OnChanges {
  @Input() deviceId: number | null = null;

  isLoading = false;
  activities: any[] = [];

  constructor(private activityService: ActivityService) {}

  ngOnChanges(): void {
    if (!this.deviceId) {
      this.activities = [];
      return;
    }

    this.isLoading = true;
    this.activityService.getActivities({
      pagesize: 10,
      pagenumber: 1,
      filters: [{ key: 'deviceId', value: this.deviceId, operator: 'equals' }]
    }).subscribe({
      next: (response: any) => {
        this.activities = response?.data?.pageData ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.activities = [];
        this.isLoading = false;
      }
    });
  }

  getScheduleStatus(activity: any): string {
    const date = activity?.date ? String(activity.date).slice(0, 10) : '';
    const start = date ? new Date(`${date}T${String(activity.startTime || '00:00:00').slice(0, 8)}`) : null;
    const end = date ? new Date(`${date}T${String(activity.endTime || '23:59:59').slice(0, 8)}`) : null;
    const now = Date.now();

    if (end && !Number.isNaN(end.getTime()) && now > end.getTime()) {
      return 'Past';
    }
    if (start && !Number.isNaN(start.getTime()) && now >= start.getTime() && (!end || now <= end.getTime())) {
      return 'In Progress';
    }
    return 'Upcoming';
  }
}
