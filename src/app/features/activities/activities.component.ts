import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../../core/services/activity.service';
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

  constructor(private activityService: ActivityService) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.isLoading = true;
    this.activityService.getActivities().subscribe({
      next: (response: any) => {
        const activityList = response?.data?.pageData || response?.data || response || [];
        const items = Array.isArray(activityList) ? activityList : [];
        this.activities = items.map((activity: any) => this.mapActivity(activity));
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading activities:', error);
        this.activities = [];
        this.isLoading = false;
        toast.error('Error', 'Failed to load activities. Please try again.');
      }
    });
  }

  openAddActivityDialog(): void {
    this.displayAddActivityDialog = true;
  }

  onActivityAdded(): void {
    this.displayAddActivityDialog = false;
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
        String(activity.company ?? '').toLowerCase().includes(term) ||
        String(activity.siteName ?? '').toLowerCase().includes(term)
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

  private mapActivity(activity: any): any {
    const dateValue = activity.date || activity.Date || '';
    return {
      id: activity.id || activity.Id || 'N/A',
      name: activity.name || activity.Name || activity.activityName || 'Unknown',
      date: dateValue,
      startTime: activity.startTime || activity.StartTime || '',
      endTime: activity.endTime || activity.EndTime || '',
      company: activity.company || activity.Company || activity.companyName || '-',
      technicians: activity.technicians ?? activity.Technicians ?? activity.technicianCount ?? 0,
      siteId: activity.siteId || activity.SiteId || activity.deviceId || '',
      siteName: activity.siteName || activity.SiteName || activity.site?.name || activity.site?.siteName || '-'
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
    const timePart = timeValue ? String(timeValue).slice(0, 5) : '00:00';
    const parsed = new Date(`${datePart}T${timePart}`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
}
