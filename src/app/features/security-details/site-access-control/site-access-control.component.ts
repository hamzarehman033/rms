import { Component, ElementRef, Input, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, firstValueFrom, timeout } from 'rxjs';
import { Activity, ActivityService } from '../../../core/services/activity.service';
import { SiteAccessService } from '../../../core/services/site-access.service';
import { AccessActivity, SiteAccessSession, accessSessionState, MAX_ACCESS_DURATION_MS } from '../../../core/services/site-access.model';
import { toast } from '../../../utils/global-toast';

@Component({
  selector: 'app-site-access-control', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './site-access-control.component.html', styleUrl: './site-access-control.component.css'
})
export class SiteAccessControlComponent implements OnChanges, OnDestroy {
  @Input() deviceId: number | null = null;
  @Input() siteKey = '';
  @Input() siteLabel = '';
  session: SiteAccessSession | null = null;
  now = Date.now();
  action: 'none' | 'grant' | 'extend' | 'end' = 'none';
  busy = false;
  error = '';
  activityError = '';
  activities: Activity[] = [];
  loadingActivities = false;
  moreActivities = false;
  private page = 0;
  private contextVersion = 0;
  private destroyed = false;
  private readonly subscriptions = new Subscription();
  private activitiesRequest?: Subscription;
  private readonly timer: ReturnType<typeof setInterval>;
  private readonly notices = new Set<string>();
  selectedActivityId = 'manual';
  activityName = '';
  team = '';
  persons = 1;
  expiresLocal = '';
  reason = '';
  teamVerified = false;
  departureConfirmed = false;
  extensionMinutes = 30;
  extensionCustom = false;
  private operationSession: SiteAccessSession | null = null;

  constructor(public readonly access: SiteAccessService, private readonly activityApi: ActivityService,
    private readonly host: ElementRef<HTMLElement>) {
    this.subscriptions.add(this.access.changes$.subscribe(() => this.sync()));
    this.timer = setInterval(() => this.sync(), 1000);
  }
  ngOnChanges(): void {
    this.contextVersion++;
    this.activitiesRequest?.unsubscribe();
    this.activities = []; this.page = 0; this.moreActivities = false;
    this.loadingActivities = false; this.activityError = ''; this.error = '';
    this.action = 'none'; this.busy = false; this.selectedActivityId = 'manual';
    this.operationSession = null; this.sync();
    if (this.deviceId) this.loadActivities(true);
  }
  ngOnDestroy(): void {
    this.destroyed = true; this.contextVersion++;
    clearInterval(this.timer); this.activitiesRequest?.unsubscribe(); this.subscriptions.unsubscribe();
  }
  get active(): boolean { return !this.access.storageError && !!this.session && accessSessionState(this.session, this.now) === 'active'; }
  get canManage(): boolean { return !!this.siteKey && this.access.canManage() && !this.access.storageError; }
  get remainingMs(): number { return this.active && this.session ? Math.max(0, this.session.expiresAt - this.now) : 0; }
  get timeRemaining(): string {
    const seconds = Math.max(0, Math.ceil(this.remainingMs / 1000));
    return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(n => String(n).padStart(2, '0')).join(':');
  }
  get warning(): string {
    if (!this.active || this.remainingMs > 600_000) return '';
    return this.remainingMs <= 300_000 ? 'Less than 5 minutes left. Extend or confirm departure.' : 'Access expires soon. Check with the team.';
  }
  get stateLabel(): string {
    if (this.active) return 'ACTIVE';
    if (!this.session) return 'NOT ACTIVE';
    return this.session.endedAt !== null ? 'ENDED' : 'EXPIRED';
  }
  get selectedActivity(): Activity | null {
    return this.activities.find(a => String(a.id) === this.selectedActivityId) ?? null;
  }
  get extensionExpiry(): number {
    return this.extensionCustom ? this.parseLocal(this.expiresLocal) : (this.operationSession?.expiresAt ?? this.now) + Number(this.extensionMinutes) * 60_000;
  }
  get validExtensionExpiry(): number | null {
    return Number.isFinite(this.extensionExpiry) ? this.extensionExpiry : null;
  }
  get maxExpiryLocal(): string {
    return this.toLocal((this.action === 'extend' ? this.operationSession?.startedAt ?? this.now : this.now) + MAX_ACCESS_DURATION_MS);
  }
  get recentAudit() { return [...(this.session?.audit ?? [])].reverse().slice(0, 8); }

  loadActivities(reset = false): void {
    if (!this.deviceId || this.loadingActivities) return;
    const version = this.contextVersion;
    const deviceId = this.deviceId;
    const accountContext = this.access.contextKey;
    const page = reset ? 1 : this.page + 1;
    this.loadingActivities = true; this.activityError = '';
    this.activitiesRequest = this.activityApi.getActivities({ pagesize: 50, pagenumber: page,
      filters: [{ key: 'deviceId', value: deviceId, operator: 'equals' }] }).pipe(timeout(15_000)).subscribe({
      next: response => {
        if (version !== this.contextVersion) return;
        if (accountContext !== this.access.contextKey) { this.activities = []; this.loadingActivities = false; return; }
        const rows = response?.data?.pageData;
        if (!Array.isArray(rows)) { this.activityError = 'The activity response could not be read. Retry before linking a scheduled visit.'; this.loadingActivities = false; return; }
        const valid = rows.filter((a: Activity) => Number(a.deviceId) === deviceId && Number(a.id) > 0);
        const previousIds = new Set(this.activities.map(a => a.id));
        const combined = reset ? valid : [...this.activities, ...valid.filter((a: Activity) => !previousIds.has(a.id))];
        this.activities = combined; this.page = page;
        this.moreActivities = rows.length === 50 && (reset || combined.length > previousIds.size);
        this.loadingActivities = false;
      },
      error: () => { if (version === this.contextVersion) { this.loadingActivities = false; this.activityError = 'Scheduled activities could not be loaded. Retry, or explicitly create an unscheduled visit.'; } }
    });
  }
  /** Called only by the optional action on this site's Scheduled Activities card. */
  selectActivity(activity: Activity): void {
    if (this.active || this.busy || !this.canManage || Number(activity.deviceId) !== this.deviceId || !activity.id || activity.isActive === false) return;
    if (!this.activities.some(a => a.id === activity.id)) this.activities = [activity, ...this.activities];
    this.openGrant(); this.selectedActivityId = String(activity.id); this.onActivityChange();
    this.host.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  openGrant(): void {
    if (!this.canManage || this.active || this.busy) return;
    this.action = 'grant'; this.error = ''; this.teamVerified = false;
    this.selectedActivityId = 'manual'; this.activityName = ''; this.team = ''; this.persons = 1;
    this.reason = ''; this.setDuration(60);
  }
  onActivityChange(): void {
    const activity = this.selectedActivity;
    this.activityName = activity?.name ?? ''; this.team = activity?.team ?? '';
    this.persons = Math.max(1, Number(activity?.persons) || 1);
    this.reason = String(activity?.description ?? '').slice(0, 500);
    this.teamVerified = false; this.setDuration(60);
    // The existing activity API has a local date + wall-clock time, not a timezone.
    // Suggest the scheduled end only if it is still future and within this session's cap.
    const date = String(activity?.date ?? '').slice(0, 10);
    const time = String(activity?.endTime ?? '').slice(0, 8);
    const end = Date.parse(`${date}T${time}`);
    if (Number.isFinite(end) && end >= Date.now() + 60_000 && end <= Date.now() + MAX_ACCESS_DURATION_MS) this.expiresLocal = this.toLocal(end);
  }
  setDuration(minutes: number): void { this.expiresLocal = this.toLocal(Date.now() + minutes * 60_000); }
  openExtend(): void {
    if (!this.active || !this.session || !this.canManage || this.busy) return;
    this.operationSession = this.session; this.action = 'extend'; this.error = ''; this.reason = '';
    this.extensionMinutes = 30; this.extensionCustom = false;
    this.expiresLocal = this.toLocal(this.session.expiresAt + 30 * 60_000);
  }
  openEnd(): void {
    if (!this.active || !this.session || !this.canManage || this.busy) return;
    this.operationSession = this.session; this.action = 'end'; this.error = '';
    this.reason = 'Team departed; site checked.'; this.departureConfirmed = false;
  }
  cancel(): void { if (!this.busy) { this.action = 'none'; this.error = ''; this.operationSession = null; } }

  async submitGrant(): Promise<void> {
    if (this.busy || this.action !== 'grant') return;
    const version = this.contextVersion;
    const key = this.siteKey;
    const accountContext = this.access.contextKey;
    const deviceId = this.deviceId;
    this.error = '';
    if (!this.canManage || !key || !deviceId) { this.error = 'The site or your permission is not ready. Reload the site.'; return; }
    if (!this.teamVerified) { this.error = 'Confirm the team and whole-site authorization before granting access.'; return; }
    const expiresAt = this.parseLocal(this.expiresLocal);
    const persons = Number(this.persons), reason = this.reason;
    const siteLabel = this.siteLabel || `Device ${deviceId}`;
    const selectedId = this.selectedActivityId;
    let activity: AccessActivity = { id: null, deviceId, name: this.activityName.trim(), team: this.team.trim(),
      persons, date: '', startTime: '', endTime: '' };
    if (!activity.name || !activity.team || !reason.trim() || !Number.isInteger(persons) || persons < 1 || persons > 999) {
      this.error = 'Enter the activity, team, actual team size (1-999), and authorization reason.'; return;
    }
    if (!Number.isFinite(expiresAt) || expiresAt < Date.now() + 60_000 || expiresAt > Date.now() + MAX_ACCESS_DURATION_MS) {
      this.error = 'Choose an expiry between one minute and 24 hours from now.'; return;
    }
    this.busy = true;
    try {
      if (selectedId !== 'manual') {
        // Re-read the selected activity before granting, so deleted/changed records are not blindly reused.
        const response = await firstValueFrom(this.activityApi.getActivityById(selectedId).pipe(timeout(15_000)));
        const current: Activity = response?.data ?? response;
        if (!current || Number(current.id) !== Number(selectedId) || Number(current.deviceId) !== deviceId || current.isActive === false) {
          throw new Error('The scheduled activity is no longer available for this device. Refresh the list.');
        }
        if (String(current.name).trim() !== activity.name || String(current.team).trim() !== activity.team) {
          throw new Error('The activity or team changed. Refresh and verify the updated activity before granting access.');
        }
        activity = { ...activity, id: Number(current.id), date: current.date, startTime: current.startTime, endTime: current.endTime };
      }
      if (this.destroyed || version !== this.contextVersion || key !== this.siteKey) return;
      if (accountContext !== this.access.contextKey) throw new Error('The account or customer changed. Reload the site before granting access.');
      await this.access.grant({ siteKey: key, siteLabel, activity, expiresAt, reason, teamVerified: true });
      if (version !== this.contextVersion || this.destroyed) return;
      this.action = 'none'; toast.success('Activity access granted', 'The site is Approved Access until the authorization deadline.');
    } catch (error) { if (version === this.contextVersion && !this.destroyed) this.error = this.message(error); }
    finally { if (version === this.contextVersion && !this.destroyed) { this.busy = false; this.sync(); } }
  }
  async submitExtend(): Promise<void> {
    if (this.busy || this.action !== 'extend' || !this.operationSession) return;
    await this.saveOperation(() => this.access.extend(this.operationSession!, this.extensionExpiry, this.reason), 'Activity access extended');
  }
  async submitEnd(): Promise<void> {
    if (this.busy || this.action !== 'end' || !this.operationSession) return;
    if (!this.departureConfirmed) { this.error = 'Confirm that the team has left before ending access.'; return; }
    await this.saveOperation(() => this.access.end(this.operationSession!, this.reason), 'Access ended; intrusion monitoring re-armed');
  }
  private async saveOperation(save: () => Promise<SiteAccessSession>, success: string): Promise<void> {
    const version = this.contextVersion; this.busy = true; this.error = '';
    try { await save(); if (version === this.contextVersion && !this.destroyed) { this.action = 'none'; toast.success(success); } }
    catch (error) { if (version === this.contextVersion && !this.destroyed) this.error = this.message(error); }
    finally { if (version === this.contextVersion && !this.destroyed) { this.busy = false; this.sync(); } }
  }
  private sync(): void {
    const previouslyActive = this.active;
    this.now = Date.now(); this.session = this.access.getLatest(this.siteKey);
    if (!this.active && !this.busy && (this.action === 'extend' || this.action === 'end')) {
      this.action = 'none'; this.error = 'Access has ended or expired. Monitoring is re-armed.';
    }
    if (this.active && this.session && this.warning) {
      const level = this.remainingMs <= 300_000 ? '5' : '10';
      const key = `${this.session.id}:${this.session.revision}:${level}`;
      if (!this.notices.has(key)) { this.notices.add(key); toast.warning('Activity access expiring', this.warning); }
    }
    if (previouslyActive && !this.active && this.session && this.session.endedAt === null) {
      toast.warning('Activity access expired', 'New detections will be treated as intrusions.');
    }
  }
  private toLocal(ms: number): string {
    const d = new Date(ms);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  private parseLocal(value: string): number { return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) ? new Date(value).getTime() : NaN; }
  private message(error: unknown): string { return error instanceof Error ? error.message : 'The action could not be completed. No access change was confirmed.'; }
}
