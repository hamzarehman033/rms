import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, firstValueFrom, timeout } from 'rxjs';
import { AuthService } from './auth.service';
import { CustomerService } from './customer.service';
import { Activity, ActivityService } from './activity.service';
import { AppRole } from '../constants/roles';
import { Menu } from '../constants/sideMenu';
import { toast } from '../../utils/global-toast';
import { PRESENCE_WARNING_MS, sameWorkOrder } from './work-order-policy';
import { AccessOperator, GrantSiteAccess, SiteAccessSession, SiteAccessStore, SiteAccessSummary,
  activeAccessSession, latestAccessSession, accessRearmAfter, emptyAccessStore, parseAccessStore, grantAccess,
  extendAccess, endAccess, confirmAccess, resumeAccess, suspendAccess, siteAccessSummary,
  accessSessionState, wasSiteAuthorized, invalidateWorkOrders, workOrderPresentation } from './site-access.model';

/** Local preview adapter. Never sends a hardware command or a work-session backend write. */
@Injectable({ providedIn: 'root' })
export class SiteAccessService implements OnDestroy {
  private store = emptyAccessStore();
  private scope: string | null = null;
  private lastSignature = '';
  private readonly changes = new BehaviorSubject<number>(0);
  readonly changes$ = this.changes.asObservable();
  private readonly subscriptions = new Subscription();
  private readonly timer: ReturnType<typeof setInterval>;
  private readonly notices = new Set<string>();
  storageError = '';
  // Keep the old key so v1 sessions are safely migrated to suspended, not lost.
  private readonly storagePrefix = 'mobigence.security.site-access.v1.';
  private readonly onStorage = (event: StorageEvent): void => {
    if (event.key === null || event.key === this.storageKey()) this.restore();
  };
  private readonly onFocus = (): void => this.restore();

  constructor(private readonly customers: CustomerService, private readonly auth: AuthService,
    private readonly activityApi: ActivityService) {
    this.subscriptions.add(this.customers.activeCustomer$.subscribe(customer => {
      const next = customer?.id == null ? null : String(customer.id);
      if (this.scope !== next) { this.scope = next; this.notices.clear(); this.restore(); }
    }));
    window.addEventListener('storage', this.onStorage);
    window.addEventListener('focus', this.onFocus);
    this.timer = setInterval(() => {
      const signature = this.signature();
      if (signature !== this.lastSignature) { this.lastSignature = signature; this.notify(); }
      this.remind();
    }, 1000);
  }
  ngOnDestroy(): void {
    clearInterval(this.timer); this.subscriptions.unsubscribe();
    window.removeEventListener('storage', this.onStorage); window.removeEventListener('focus', this.onFocus);
  }
  canManage(): boolean {
    try {
      const roles = this.roles();
      return !!this.scope && this.auth.isAuthenticated() &&
        [AppRole.SysAdmin, AppRole.Admin, AppRole.Manager].some(role => roles.includes(role)) &&
        (roles.includes(AppRole.SysAdmin) || this.auth.getCurrentUserModules().map(Number).includes(Menu.Security));
    } catch { return false; }
  }
  canOverrideSchedule(): boolean {
    return this.canManage() && this.roles().some(role => role === AppRole.Admin || role === AppRole.SysAdmin);
  }
  get contextKey(): string {
    try { return `${this.scope ?? ''}:${String(this.auth.getCurrentUser()?.id ?? '')}`; } catch { return ''; }
  }
  getActive(key: string): SiteAccessSession | null { return this.storageError ? null : activeAccessSession(this.store, key, Date.now()); }
  getLatest(key: string): SiteAccessSession | null { return latestAccessSession(this.store, key); }
  getAll(key: string): SiteAccessSession[] { return [...(this.store.sessions[key] ?? [])]; }
  getSummary(key: string): SiteAccessSummary {
    const result = siteAccessSummary(this.store, key, Date.now());
    return this.storageError ? { ...result, authorized: [], attention: result.sessions, approved: false, validUntil: null } : result;
  }
  getByActivity(deviceId: number, activityId: number | null | undefined): SiteAccessSession | null {
    if (!activityId) return null;
    return Object.values(this.store.sessions).flat().find(s => s.activity.deviceId === Number(deviceId) && s.activity.id === Number(activityId)) ?? null;
  }
  describeActivity(activity: Activity) {
    const session = this.getByActivity(activity.deviceId, activity.id);
    if (this.storageError && session?.endedAt === null) return { label: 'Approval paused: storage error', tone: 'warning', rank: 0, sortAt: 0 };
    return workOrderPresentation(activity, session, Date.now());
  }
  rearmAfter(key: string): number { return accessRearmAfter(this.store, key, Date.now()); }
  wasAuthorized(key: string, at: number): boolean { return !this.storageError && wasSiteAuthorized(this.store, key, at); }
  refresh(): void { this.restore(); }

  async grant(request: GrantSiteAccess, allowedDeviceIds: number[], valid: () => boolean = () => true): Promise<SiteAccessSession> {
    const context = this.contextKey;
    if (!allowedDeviceIds.includes(request.activity.deviceId)) throw new Error('This work order is not linked to the current site.');
    await this.validateOrder(request.activity, undefined, valid);
    return this.changeSession(request.siteKey, context, (store, actor, now) =>
      grantAccess(store, request, actor, now, crypto.randomUUID(), this.canOverrideSchedule()), valid);
  }
  async confirm(session: SiteAccessSession, reason: string, valid: () => boolean = () => true): Promise<SiteAccessSession> {
    const context = this.contextKey; await this.validateOrder(session.activity, session, valid);
    return this.changeSession(session.siteKey, context, (store, actor, now) =>
      confirmAccess(store, session.siteKey, session.id, session.revision, reason, actor, now), valid);
  }
  async extend(session: SiteAccessSession, expiresAt: number, reason: string, valid: () => boolean = () => true): Promise<SiteAccessSession> {
    const context = this.contextKey; await this.validateOrder(session.activity, session, valid);
    return this.changeSession(session.siteKey, context, (store, actor, now) =>
      extendAccess(store, session.siteKey, session.id, session.revision, expiresAt, reason, actor, now), valid);
  }
  async resume(session: SiteAccessSession, expiresAt: number, reason: string, valid: () => boolean = () => true): Promise<SiteAccessSession> {
    const context = this.contextKey; await this.validateOrder(session.activity, session, valid);
    return this.changeSession(session.siteKey, context, (store, actor, now) =>
      resumeAccess(store, session.siteKey, session.id, session.revision, expiresAt, reason, actor, now), valid);
  }
  async suspend(session: SiteAccessSession, reason: string, valid: () => boolean = () => true): Promise<SiteAccessSession> {
    return this.changeSession(session.siteKey, this.contextKey, (store, actor, now) =>
      suspendAccess(store, session.siteKey, session.id, session.revision, reason, actor, now), valid);
  }
  async end(session: SiteAccessSession, reason: string, valid: () => boolean = () => true): Promise<SiteAccessSession> {
    return this.changeSession(session.siteKey, this.contextKey, (store, actor, now) =>
      endAccess(store, session.siteKey, session.id, session.revision, reason, actor, now), valid);
  }
  /** Only call after a COMPLETE successful, device-scoped catalog read. */
  async reconcile(key: string, rows: Activity[], deviceIds: number[], context: string): Promise<void> {
    if (!key || context !== this.contextKey || !this.getAll(key).some(s => s.endedAt === null)) return;
    await this.mutate(context, store => invalidateWorkOrders(store, key, rows, deviceIds, Date.now()), false);
  }
  /** Called after a successful existing Activities edit/delete. No backend write is added. */
  async recheckActivity(activityId: number, confirmedDeleted = false): Promise<void> {
    const context = this.contextKey;
    if (!Object.values(this.store.sessions).flat().some(s => s.endedAt === null && s.activity.id === activityId)) return;
    let fresh: Activity | null = null;
    if (!confirmedDeleted) {
      try {
        const response = await firstValueFrom(this.activityApi.getActivityById(activityId).pipe(timeout(15_000)));
        fresh = response?.data ?? response;
      } catch (error: any) {
        if (error?.status !== 404) throw new Error('Work-order changes could not be rechecked. Review its approval before continuing.');
      }
    }
    if (context !== this.contextKey) return;
    await this.mutate(context, store => {
      let next = store;
      for (const s of Object.values(store.sessions).flat()) {
        if (s.endedAt !== null || s.suspendedAt !== null || s.activity.id !== activityId) continue;
        if (!fresh || fresh.isActive === false || !sameWorkOrder(fresh, s.activity)) {
          next = suspendAccess(next, s.siteKey, s.id, s.revision,
            'The linked work order was edited, disabled, or deleted. Reconcile it before resuming.',
            { id: 'system:work-order-check', name: 'Work-order validation' }, Date.now());
        }
      }
      return next;
    }, false);
  }
  private async validateOrder(snapshot: SiteAccessSession['activity'], session?: SiteAccessSession, valid: () => boolean = () => true): Promise<void> {
    if (!this.canManage()) throw new Error('An Admin, Manager or SysAdmin with Security permission must perform this action.');
    if (!snapshot.id) throw new Error('An existing scheduled work order is mandatory.');
    const context = this.contextKey;
    let response: any;
    try { response = await firstValueFrom(this.activityApi.getActivityById(snapshot.id).pipe(timeout(15_000))); }
    catch (error: any) {
      if (valid() && session && error?.status === 404 && context === this.contextKey) await this.suspend(session, 'Linked work order no longer exists.');
      throw new Error('Unable to verify this work order. No new approval was saved. Refresh and try again.');
    }
    if (!valid() || context !== this.contextKey) throw new Error('The page context, customer or account changed. Reopen this site.');
    const fresh: Activity = response?.data ?? response;
    if (!fresh || fresh.isActive === false || !sameWorkOrder(fresh, snapshot)) {
      if (session) await this.suspend(session, 'Work order changed or was disabled. Reconcile the original work order before resuming.');
      throw new Error('The work order changed, was disabled, or no longer belongs to this device. Refresh and review it.');
    }
  }
  private async changeSession(key: string, context: string,
    change: (store: SiteAccessStore, actor: AccessOperator, now: number) => SiteAccessStore, valid: () => boolean = () => true): Promise<SiteAccessSession> {
    const next = await this.mutate(context, store => change(store, this.operator(), Date.now()), true, valid);
    // Pure operations move the affected session to the front, even for concurrent teams.
    return next.sessions[key][0];
  }
  private async mutate(context: string, change: (store: SiteAccessStore) => SiteAccessStore, requirePermission = true, valid: () => boolean = () => true): Promise<SiteAccessStore> {
    if (!valid() || context !== this.contextKey || !this.scope || (requirePermission && !this.canManage())) throw new Error('Your site context or permissions changed.');
    if (!navigator.locks || !crypto.randomUUID) throw new Error('Use HTTPS (or localhost) in a current browser for access controls.');
    const storageKey = this.storageKey();
    return navigator.locks.request(storageKey, { mode: 'exclusive' }, () => {
      if (!valid() || context !== this.contextKey || (requirePermission && !this.canManage())) throw new Error('The account or customer changed.');
      let saved: SiteAccessStore;
      try { saved = parseAccessStore(localStorage.getItem(storageKey)); }
      catch { this.storageError = 'Access storage is unavailable or invalid. No change was saved.'; this.notify(); throw new Error(this.storageError); }
      this.store = saved; this.storageError = ''; this.notify();
      const next = change(saved);
      try { localStorage.setItem(storageKey, JSON.stringify(next)); }
      catch { this.storageError = 'The browser could not save this change. Access has not been confirmed.'; this.notify(); throw new Error(this.storageError); }
      this.store = next; this.lastSignature = this.signature(); this.notify(); return next;
    });
  }
  private roles(): string[] {
    const roles = this.auth.getCurrentUser()?.roles;
    return Array.isArray(roles) ? roles : typeof roles === 'string' ? [roles] : [];
  }
  private operator(): AccessOperator {
    const user = this.auth.getCurrentUser();
    if (!user?.id) throw new Error('Your operator identity is missing. Sign in again.');
    return { id: String(user.id), name: String(user.name || user.email || user.id) };
  }
  private storageKey(): string { return this.storagePrefix + encodeURIComponent(this.scope ?? 'none'); }
  private restore(): void {
    if (!this.scope) { this.store = emptyAccessStore(); this.storageError = ''; this.lastSignature = ''; this.notify(); return; }
    try { this.store = parseAccessStore(localStorage.getItem(this.storageKey())); this.storageError = ''; }
    catch { this.store = emptyAccessStore(); this.storageError = 'Access storage is unavailable or invalid. Recover the stored history before starting a work order.'; }
    this.lastSignature = this.signature(); this.notify();
  }
  private signature(): string {
    const now = Date.now();
    return Object.values(this.store.sessions).flat().map(s => `${s.id}:${s.revision}:${accessSessionState(s, now)}`).sort().join('|');
  }
  private remind(): void {
    if (this.storageError || !this.canManage()) return;
    const now = Date.now();
    for (const s of Object.values(this.store.sessions).flat()) {
      if (s.endedAt !== null) continue;
      const state = accessSessionState(s, now);
      const due = Math.min(s.confirmationDueAt, s.expiresAt);
      if (state === 'active' && due - now > PRESENCE_WARNING_MS) continue;
      const token = `${this.scope}:${s.id}:${due}:${state}`;
      if (this.notices.has(token)) continue;
      this.notices.add(token);
      if (state === 'active') toast.warning('Work-order check due soon', `${s.siteLabel} / ${s.activity.team}: verify presence or review the work deadline within 5 minutes.`);
      else toast.warning('Site approval paused', `${s.siteLabel} / ${s.activity.team}: ${state.replace(/-/g, ' ')}. Intrusion classification is enabled.`);
    }
  }
  private notify(): void { this.changes.next(this.changes.value + 1); }
}
