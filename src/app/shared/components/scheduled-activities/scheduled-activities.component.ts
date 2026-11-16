import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Activity, ActivityService } from '../../../core/services/activity.service';
import { SiteAccessService } from '../../../core/services/site-access.service';
import { loadWorkOrderCatalog } from '../../../core/services/work-order-catalog';
import { startRestriction, workOrderWindow } from '../../../core/services/work-order-policy';

@Component({
  selector: 'app-scheduled-activities', standalone: true, imports: [CommonModule],
  templateUrl: './scheduled-activities.component.html', styleUrl: './scheduled-activities.component.css'
})
export class ScheduledActivitiesComponent implements OnChanges, OnDestroy {
  @Input() deviceId: number | null = null;
  @Input() deviceIds: number[] = [];
  @Input() siteKey = '';
  @Input() enableAccessSelection = false;
  @Input() canSelectAccess = false;
  @Output() accessRequested = new EventEmitter<Activity>();
  private request?: Subscription;
  private readonly subscriptions = new Subscription();
  private readonly timer: ReturnType<typeof setInterval>;
  private version = 0;
  private destroyed = false;
  private account = '';
  private refreshCounter = 0;
  isLoading = false;
  activities: Activity[] = [];
  warning = '';
  error = '';
  now = Date.now();

  constructor(private activityService: ActivityService, public access: SiteAccessService) {
    this.account = this.access.contextKey;
    this.subscriptions.add(this.access.changes$.subscribe(() => {
      this.now = Date.now();
      if (this.account !== this.access.contextKey) {
        this.account = this.access.contextKey; this.activities = []; this.version++; this.isLoading = false;
        if (this.enableAccessSelection) void this.reload();
      }
    }));
    this.timer = setInterval(() => {
      this.now = Date.now();
      if (this.enableAccessSelection && ++this.refreshCounter >= 12) { this.refreshCounter = 0; void this.reload(); }
    }, 5000);
  }
  ngOnDestroy(): void { this.destroyed = true; this.version++; clearInterval(this.timer); this.request?.unsubscribe(); this.subscriptions.unsubscribe(); }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['deviceId'] && !changes['deviceIds'] && !changes['siteKey'] && !changes['enableAccessSelection']) return;
    this.version++; this.request?.unsubscribe(); this.isLoading = false; this.activities = []; this.error = ''; this.warning = '';
    if (this.enableAccessSelection) { void this.reload(); return; }
    if (!this.deviceId) return;
    // Non-Security callers keep their existing read and layout.
    this.isLoading = true;
    this.request = this.activityService.getActivities({ pagesize: 10, pagenumber: 1,
      filters: [{ key: 'deviceId', value: this.deviceId, operator: 'equals' }] }).subscribe({
      next: response => { this.activities = response?.data?.pageData ?? []; this.isLoading = false; },
      error: () => { this.activities = []; this.isLoading = false; }
    });
  }
  async reload(): Promise<void> {
    if (this.isLoading || !this.enableAccessSelection || !this.siteKey) return;
    const ids = this.deviceIds.length ? [...this.deviceIds] : this.deviceId ? [this.deviceId] : [];
    if (!ids.length) return;
    const version = ++this.version, context = this.access.contextKey, key = this.siteKey;
    this.isLoading = true; this.error = ''; this.warning = '';
    try {
      const result = await loadWorkOrderCatalog(this.activityService, ids, () => this.destroyed || version !== this.version || context !== this.access.contextKey);
      if (this.destroyed || version !== this.version || context !== this.access.contextKey) return;
      this.activities = result.items; this.warning = result.warning;
      if (result.complete) await this.access.reconcile(key, result.items, ids, context);
    } catch (error) {
      if (version === this.version && !this.destroyed) this.error = error instanceof Error ? error.message : 'Unable to load scheduled work orders.';
    } finally { if (version === this.version && !this.destroyed) this.isLoading = false; }
  }
  get rankedActivities(): Activity[] {
    return [...this.activities].sort((a, b) => {
      const left = this.access.describeActivity(a), right = this.access.describeActivity(b);
      return left.rank - right.rank || left.sortAt - right.sortAt || Number(a.id) - Number(b.id);
    });
  }
  presentation(activity: Activity) { return this.access.describeActivity(activity); }
  startReason(activity: Activity): string {
    if (this.access.getByActivity(activity.deviceId, activity.id)) return '';
    return startRestriction(activity, this.now, this.access.canOverrideSchedule());
  }
  actionLabel(activity: Activity): string {
    const session = this.access.getByActivity(activity.deviceId, activity.id);
    if (session) return session.endedAt === null ? 'View work session' : 'View completed visit';
    const window = workOrderWindow(activity);
    return window && this.now < window.start ? 'Start Early' : window && this.now >= window.end ? 'Review Late Start' : 'Start Activity';
  }
  select(activity: Activity): void {
    if (this.isLoading || this.error || !this.canSelectAccess || this.startReason(activity)) return;
    this.accessRequested.emit(activity);
  }
  trackActivity(_index: number, activity: Activity): string { return `${activity.deviceId}:${activity.id}`; }
  getScheduleStatus(activity: Activity): string {
    const date = activity?.date ? String(activity.date).slice(0, 10) : '';
    const start = date ? new Date(`${date}T${String(activity.startTime || '00:00:00').slice(0, 8)}`) : null;
    const end = date ? new Date(`${date}T${String(activity.endTime || '23:59:59').slice(0, 8)}`) : null;
    if (end && !Number.isNaN(end.getTime()) && Date.now() > end.getTime()) return 'Past';
    if (start && !Number.isNaN(start.getTime()) && Date.now() >= start.getTime() && (!end || Date.now() <= end.getTime())) return 'In Progress';
    return 'Upcoming';
  }
}
