import { Component, ElementRef, Input, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Activity } from '../../../core/services/activity.service';
import { SiteAccessService } from '../../../core/services/site-access.service';
import { SiteAccessSession, SiteAccessSummary, accessSessionState } from '../../../core/services/site-access.model';
import { MAX_ACCESS_DURATION_MS, PRESENCE_WARNING_MS, formatRemaining, startRestriction, workOrderWindow } from '../../../core/services/work-order-policy';
import { toast } from '../../../utils/global-toast';

type WorkAction = 'none' | 'start' | 'confirm' | 'extend' | 'resume' | 'suspend' | 'end';
@Component({
  selector: 'app-site-access-control', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './site-access-control.component.html', styleUrl: './site-access-control.component.css'
})
export class SiteAccessControlComponent implements OnChanges, OnDestroy {
  @Input() deviceId: number | null = null;
  @Input() deviceIds: number[] = [];
  @Input() siteKey = '';
  @Input() siteLabel = '';
  now = Date.now();
  sessions: SiteAccessSession[] = [];
  summary: SiteAccessSummary = { sessions: [], authorized: [], attention: [], approved: false, validUntil: null };
  action: WorkAction = 'none';
  busy = false;
  error = '';
  reason = '';
  teamVerified = false;
  departureConfirmed = false;
  scheduleOverride = false;
  expiresLocal = '';
  extensionMinutes = 30;
  extensionCustom = false;
  selectedActivity: Activity | null = null;
  selectedSessionId = '';
  operationSession: SiteAccessSession | null = null;
  private contextVersion = 0;
  private account = '';
  private destroyed = false;
  private readonly subscriptions = new Subscription();
  private readonly timer: ReturnType<typeof setInterval>;

  constructor(public readonly access: SiteAccessService, private readonly host: ElementRef<HTMLElement>) {
    this.account = this.access.contextKey;
    this.subscriptions.add(this.access.changes$.subscribe(() => this.sync()));
    this.timer = setInterval(() => this.sync(), 1000);
  }
  ngOnChanges(): void { this.contextVersion++; this.resetForm(); this.sync(); }
  ngOnDestroy(): void { this.destroyed = true; this.contextVersion++; clearInterval(this.timer); this.subscriptions.unsubscribe(); }
  get canManage(): boolean { return !!this.siteKey && this.access.canManage() && !this.access.storageError; }
  get allowedDeviceIds(): number[] { return this.deviceIds.length ? this.deviceIds : this.deviceId ? [this.deviceId] : []; }
  get openSessions(): SiteAccessSession[] {
    return this.sessions.filter(s => s.endedAt === null).sort((a, b) =>
      Number(accessSessionState(a, this.now) === 'active') - Number(accessSessionState(b, this.now) === 'active') ||
      a.expiresAt - b.expiresAt);
  }
  get closedSessions(): SiteAccessSession[] { return this.sessions.filter(s => s.endedAt !== null).sort((a, b) => (b.endedAt ?? 0) - (a.endedAt ?? 0)); }
  get selectedVisitClosed(): boolean { return this.closedSessions.some(s => s.id === this.selectedSessionId); }
  get stateLabel(): string { return this.summary.approved ? 'APPROVED ACCESS' : this.summary.attention.length ? 'REVIEW REQUIRED' : 'NO ACTIVE VISIT'; }
  state(s: SiteAccessSession) { return this.access.storageError && s.endedAt === null ? 'suspended' as const : accessSessionState(s, this.now); }
  label(s: SiteAccessSession): string {
    const state = this.state(s);
    return state === 'active' ? 'Authorized' : state === 'ended' ? 'Completed' : state === 'expired' ? 'Deadline reached' : 'Suspended';
  }
  remaining(s: SiteAccessSession): string { return formatRemaining(s.expiresAt, this.now); }
  warning(s: SiteAccessSession): string {
    if (this.access.storageError) return this.access.storageError;
    if (this.state(s) !== 'active') return s.suspensionReason || (this.state(s) === 'expired' ? 'Work deadline reached. Review / Resume or confirm departure.' : 'Approval suspended. Verify this team before resuming.');
    if (s.expiresAt - this.now <= PRESENCE_WARNING_MS) return 'The work deadline is close. Extend or confirm departure.';
    if (s.confirmationDueAt <= this.now) return 'Presence reminder due. Confirm when available.';
    return s.confirmationDueAt - this.now <= PRESENCE_WARNING_MS ? 'Presence reminder due within 5 minutes.' : '';
  }
  trackSession(_index: number, session: SiteAccessSession): string { return session.id; }
  recentAudit(s: SiteAccessSession) { return [...s.audit].reverse(); }
  get formTitle(): string {
    return { none: '', start: 'Start scheduled work order', confirm: 'Confirm this team is still on site',
      extend: 'Extend this work order', resume: 'Review and resume approval', suspend: 'Suspend this team approval', end: 'End this team visit' }[this.action];
  }
  get submitLabel(): string {
    return { none: '', start: 'Confirm Start', confirm: 'Confirm Presence', extend: 'Confirm Extension', resume: 'Reauthorize Now', suspend: 'Suspend Approval', end: 'Confirm Departure & End' }[this.action];
  }
  get needsTeamCheck(): boolean { return ['start', 'confirm', 'resume'].includes(this.action); }
  get formActivity(): Activity | SiteAccessSession['activity'] | null { return this.selectedActivity ?? this.operationSession?.activity ?? null; }
  get startBeyondSchedule(): boolean {
    const window = this.selectedActivity ? workOrderWindow(this.selectedActivity) : null;
    return !!window && (this.now >= window.end || this.parseLocal(this.expiresLocal) > window.end);
  }
  get maxExpiryLocal(): string { return this.toLocal((this.operationSession?.startedAt ?? this.now) + MAX_ACCESS_DURATION_MS); }
  get extensionExpiry(): number {
    return this.extensionCustom ? this.parseLocal(this.expiresLocal) : (this.operationSession?.expiresAt ?? this.now) + Number(this.extensionMinutes) * 60_000;
  }
  get validExtensionExpiry(): number | null { return Number.isFinite(this.extensionExpiry) ? this.extensionExpiry : null; }

  /** Only scheduled work orders can open the Start form. No free-text creation path. */
  selectActivity(activity: Activity): void {
    if (this.busy || !this.canManage || !this.allowedDeviceIds.includes(Number(activity.deviceId)) || !activity.id) return;
    const existing = this.access.getByActivity(activity.deviceId, activity.id);
    this.resetForm();
    if (existing) { this.selectedSessionId = existing.id; this.scrollToPanel(); return; }
    const restriction = startRestriction(activity, Date.now(), this.access.canOverrideSchedule());
    if (restriction) { this.error = restriction; return; }
    this.selectedActivity = { ...activity }; this.action = 'start';
    const window = workOrderWindow(activity)!;
    this.expiresLocal = this.toLocal(window.end > this.now ? Math.min(window.end, this.now + MAX_ACCESS_DURATION_MS) : this.now + 60 * 60_000);
    this.scrollToPanel();
  }
  openAction(action: Exclude<WorkAction, 'none' | 'start'>, session: SiteAccessSession): void {
    if (!this.canManage || this.busy || session.endedAt !== null) return;
    this.resetForm(); this.operationSession = session; this.selectedSessionId = session.id; this.action = action;
    this.extensionMinutes = 30; this.extensionCustom = false;
    this.expiresLocal = this.toLocal(action === 'extend' ? session.expiresAt + 30 * 60_000 : Math.max(session.expiresAt, this.now + 60 * 60_000));
    this.scrollToForm();
  }
  cancel(): void { if (!this.busy) this.resetForm(); }
  async submit(): Promise<void> {
    if (this.busy || this.action === 'none') return;
    this.error = '';
    if (!this.canManage) { this.error = 'Site identity or permission is unavailable.'; return; }
    if (!this.reason.trim() || this.reason.trim().length > 500) { this.error = 'Enter a reason or verification note (maximum 500 characters).'; return; }
    if (this.needsTeamCheck && !this.teamVerified) { this.error = 'Verify the team and review the site alarms before authorizing.'; return; }
    if (this.action === 'end' && !this.departureConfirmed) { this.error = 'Confirm this team has departed before closing its visit.'; return; }
    const version = this.contextVersion, account = this.access.contextKey, action = this.action;
    const session = this.operationSession;
    const valid = () => !this.destroyed && version === this.contextVersion && account === this.access.contextKey;
    this.busy = true;
    try {
      if (action === 'start') {
        const activity = this.selectedActivity;
        if (!activity?.id) throw new Error('Choose an existing work order from Scheduled Activities.');
        await this.access.grant({ siteKey: this.siteKey, siteLabel: this.siteLabel || `Device ${this.deviceId}`,
          activity: { ...activity, id: Number(activity.id) }, expiresAt: this.parseLocal(this.expiresLocal),
          reason: this.reason, teamVerified: this.teamVerified, scheduleOverride: this.scheduleOverride }, this.allowedDeviceIds, valid);
      } else {
        if (!session) throw new Error('Select the current work session first.');
        if (action === 'confirm') await this.access.confirm(session, this.reason, valid);
        else if (action === 'extend') await this.access.extend(session, this.extensionExpiry, this.reason, valid);
        else if (action === 'resume') await this.access.resume(session, this.parseLocal(this.expiresLocal), this.reason, valid);
        else if (action === 'suspend') await this.access.suspend(session, this.reason, valid);
        else await this.access.end(session, this.reason, valid);
      }
      if (version !== this.contextVersion || this.destroyed || account !== this.access.contextKey) return;
      const title = action === 'start' ? 'Work order started' : action === 'confirm' ? 'Team presence confirmed' :
        action === 'extend' ? 'Work deadline extended; presence check unchanged' : action === 'resume' ? 'Team approval resumed' :
        action === 'suspend' ? 'Team approval suspended' : 'Team visit closed';
      this.resetForm(); this.sync(); toast.success(title);
    } catch (error) {
      if (version === this.contextVersion && !this.destroyed && account === this.access.contextKey)
        this.error = error instanceof Error ? error.message : 'The action failed. No approval change was confirmed.';
    } finally { if (version === this.contextVersion && !this.destroyed) { this.busy = false; this.sync(); } }
  }
  private sync(): void {
    if (this.destroyed) return;
    this.now = Date.now();
    if (this.account !== this.access.contextKey) { this.account = this.access.contextKey; this.contextVersion++; this.resetForm(); }
    this.sessions = this.siteKey ? this.access.getAll(this.siteKey) : [];
    this.summary = this.access.getSummary(this.siteKey);
  }
  private resetForm(): void {
    this.action = 'none'; this.selectedActivity = null; this.operationSession = null; this.error = ''; this.reason = '';
    this.teamVerified = false; this.departureConfirmed = false; this.scheduleOverride = false; this.busy = false;
  }
  private scrollToPanel(): void {
    this.host.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  private scrollToForm(): void {
    setTimeout(() => { if (!this.destroyed) this.host.nativeElement.querySelector<HTMLElement>('.access-form')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
  }
  private toLocal(ms: number): string {
    const date = new Date(ms); return new Date(ms - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
  }
  private parseLocal(value: string): number { return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) ? new Date(value).getTime() : NaN; }
}
