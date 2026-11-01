import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { CustomerService } from './customer.service';
import { AppRole } from '../constants/roles';
import { Menu } from '../constants/sideMenu';
import { AccessOperator, GrantSiteAccess, SiteAccessSession, SiteAccessStore, activeAccessSession,
  latestAccessSession, accessRearmAfter, emptyAccessStore, parseAccessStore, grantAccess,
  extendAccess, endAccess } from './site-access.model';

/** Browser adapter only. This is NOT a server authorization or a hardware command. */
@Injectable({ providedIn: 'root' })
export class SiteAccessService implements OnDestroy {
  private store = emptyAccessStore();
  private scope: string | null = null;
  private lastSignature = '';
  private readonly changes = new BehaviorSubject<number>(0);
  readonly changes$ = this.changes.asObservable();
  private readonly subscriptions = new Subscription();
  private readonly timer: ReturnType<typeof setInterval>;
  storageError = '';
  private readonly storagePrefix = 'mobigence.security.site-access.v1.';
  private readonly onStorage = (event: StorageEvent): void => {
    if (event.key === null || event.key === this.storageKey()) this.restore();
  };
  private readonly onFocus = (): void => this.restore();

  constructor(private readonly customers: CustomerService, private readonly auth: AuthService) {
    this.subscriptions.add(this.customers.activeCustomer$.subscribe(customer => {
      const next = customer?.id == null ? null : String(customer.id);
      if (this.scope !== next) { this.scope = next; this.restore(); }
    }));
    window.addEventListener('storage', this.onStorage);
    window.addEventListener('focus', this.onFocus);
    this.timer = setInterval(() => {
      const signature = this.signature();
      if (signature !== this.lastSignature) { this.lastSignature = signature; this.notify(); }
    }, 1000);
  }
  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.subscriptions.unsubscribe();
    window.removeEventListener('storage', this.onStorage);
    window.removeEventListener('focus', this.onFocus);
  }
  /** Existing roles, restricted to supervisors. Enforce this again in the future backend. */
  canManage(): boolean {
    try {
      const roles = this.auth.getCurrentUser()?.roles;
      const userRoles: string[] = Array.isArray(roles) ? roles : typeof roles === 'string' ? [roles] : [];
      const supervisor = [AppRole.SysAdmin, AppRole.Admin, AppRole.Manager].some(role => userRoles.includes(role));
      const securityModule = userRoles.includes(AppRole.SysAdmin) ||
        this.auth.getCurrentUserModules().map(Number).includes(Menu.Security);
      return !!this.scope && this.auth.isAuthenticated() && supervisor && securityModule;
    } catch { return false; }
  }
  get contextKey(): string {
    try { return `${this.scope ?? ''}:${String(this.auth.getCurrentUser()?.id ?? '')}`; } catch { return ''; }
  }
  getActive(key: string): SiteAccessSession | null {
    return this.storageError ? null : activeAccessSession(this.store, key, Date.now());
  }
  getLatest(key: string): SiteAccessSession | null { return latestAccessSession(this.store, key); }
  rearmAfter(key: string): number { return accessRearmAfter(this.store, key, Date.now()); }
  refresh(): void { this.restore(); }

  async grant(request: GrantSiteAccess): Promise<SiteAccessSession> {
    return this.mutate(request.siteKey, (store, actor, now) => grantAccess(store, request, actor, now, crypto.randomUUID()));
  }
  async extend(session: SiteAccessSession, expiresAt: number, reason: string): Promise<SiteAccessSession> {
    return this.mutate(session.siteKey, (store, actor, now) =>
      extendAccess(store, session.siteKey, session.id, session.revision, expiresAt, reason, actor, now));
  }
  async end(session: SiteAccessSession, reason: string): Promise<SiteAccessSession> {
    return this.mutate(session.siteKey, (store, actor, now) =>
      endAccess(store, session.siteKey, session.id, session.revision, reason, actor, now));
  }
  private async mutate(key: string, change: (store: SiteAccessStore, actor: AccessOperator, now: number) => SiteAccessStore): Promise<SiteAccessSession> {
    if (!this.canManage()) throw new Error('An Admin, Manager or SysAdmin with Security access must perform this action.');
    if (!navigator.locks || !crypto.randomUUID) throw new Error('Open the platform over HTTPS (or localhost) in a current browser to manage access.');
    const scope = this.scope;
    const actor = this.operator();
    const storageKey = this.storageKey();
    // Serializes same-origin tabs; it does NOT synchronize different computers.
    return navigator.locks.request(storageKey, { mode: 'exclusive' }, () => {
      if (this.scope !== scope || !this.canManage() || this.operator().id !== actor.id) {
        throw new Error('The account or customer changed. Open the correct site and try again.');
      }
      let saved: SiteAccessStore;
      try { saved = parseAccessStore(localStorage.getItem(storageKey)); }
      catch {
        this.storageError = 'Access storage is unavailable or invalid. No authorization was saved.';
        this.notify(); throw new Error(this.storageError);
      }
      // Refresh first so a rejected duplicate/stale request still updates this tab.
      this.store = saved; this.storageError = ''; this.notify();
      const next = change(saved, actor, Date.now());
      try { localStorage.setItem(storageKey, JSON.stringify(next)); }
      catch {
        this.storageError = 'The browser could not save access. No authorization change was accepted.';
        this.notify(); throw new Error(this.storageError);
      }
      this.store = next; this.lastSignature = this.signature(); this.notify();
      return latestAccessSession(next, key)!;
    });
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
    catch { this.store = emptyAccessStore(); this.storageError = 'Access storage is unavailable or invalid. Contact your administrator before granting access.'; }
    this.lastSignature = this.signature(); this.notify();
  }
  private signature(): string {
    return Object.keys(this.store.sessions).sort().map(key => {
      const session = this.getActive(key);
      return `${key}:${session?.id ?? '-'}:${session?.revision ?? 0}`;
    }).join('|');
  }
  private notify(): void { this.changes.next(this.changes.value + 1); }
}
