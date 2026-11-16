import { ScheduledWorkOrder, workOrderWindow, sameWorkOrder, startRestriction,
  PRESENCE_INTERVAL_MS, MAX_ACCESS_DURATION_MS, MIN_ACCESS_DURATION_MS } from './work-order-policy';
export { MAX_ACCESS_DURATION_MS, MIN_ACCESS_DURATION_MS } from './work-order-policy';
export const ACCESS_HISTORY_LIMIT = 200;
export interface AccessOperator { id: string; name: string; }
export interface AccessActivity extends ScheduledWorkOrder { id: number | null; }
export type AccessAction = 'granted' | 'confirmed' | 'extended' | 'suspended' | 'resumed' | 'ended' | 'migrated';
export interface AccessAuditEntry {
  action: AccessAction; at: number; operator: AccessOperator; reason: string;
  expiresAt: number; previousExpiresAt?: number;
}
export interface AuthorizationWindow { from: number; until: number; }
export interface SiteAccessSession {
  id: string; siteKey: string; siteLabel: string; activity: AccessActivity;
  startedAt: number; expiresAt: number; endedAt: number | null; revision: number;
  grantedBy: AccessOperator; audit: AccessAuditEntry[];
  confirmationDueAt: number; lastConfirmedAt: number | null;
  suspendedAt: number | null; suspensionReason: string;
  windows: AuthorizationWindow[]; legacy?: boolean;
}
export interface SiteAccessStore {
  version: 2; sessions: Record<string, SiteAccessSession[]>;
  /** A deliberate whole-site review, never an automatically advancing expiry watermark. */
  reviews: Record<string, number>;
}
export interface GrantSiteAccess {
  siteKey: string; siteLabel: string; activity: AccessActivity; expiresAt: number;
  reason: string; teamVerified: boolean; scheduleOverride?: boolean;
}
export type AccessSessionState = 'active' | 'ended' | 'expired' | 'confirmation-overdue' | 'suspended';
export interface SiteAccessSummary {
  sessions: SiteAccessSession[]; authorized: SiteAccessSession[]; attention: SiteAccessSession[];
  approved: boolean; validUntil: number | null;
}
export function emptyAccessStore(): SiteAccessStore { return { version: 2, sessions: {}, reviews: {} }; }
export function isValidSiteKey(value: string): boolean { return /^(site|device):[A-Za-z0-9_-]+$/.test(value); }
export function accessSessionState(s: SiteAccessSession, now: number): AccessSessionState {
  if (s.endedAt !== null) return 'ended';
  if (s.suspendedAt !== null || s.legacy || s.startedAt > now) return 'suspended';
  if (s.expiresAt <= now) return 'expired';
  if (s.confirmationDueAt <= now) return 'confirmation-overdue';
  return 'active';
}
export function siteAccessSummary(store: SiteAccessStore, key: string, now: number): SiteAccessSummary {
  const sessions = (store.sessions[key] ?? []).filter(s => s.endedAt === null);
  const authorized = sessions.filter(s => accessSessionState(s, now) === 'active');
  const attention = sessions.filter(s => accessSessionState(s, now) !== 'active');
  const approved = authorized.length > 0 && attention.length === 0;
  return { sessions, authorized, attention, approved,
    validUntil: approved ? Math.min(...authorized.map(s => Math.min(s.expiresAt, s.confirmationDueAt))) : null };
}
/** Compatibility accessor: only return a session when the WHOLE site is authorized. */
export function activeAccessSession(store: SiteAccessStore, key: string, now: number): SiteAccessSession | null {
  const summary = siteAccessSummary(store, key, now);
  return summary.approved ? [...summary.authorized].sort((a, b) =>
    Math.min(a.expiresAt, a.confirmationDueAt) - Math.min(b.expiresAt, b.confirmationDueAt))[0] : null;
}
export function latestAccessSession(store: SiteAccessStore, key: string): SiteAccessSession | null {
  return [...(store.sessions[key] ?? [])].sort((a, b) => b.startedAt - a.startedAt)[0] ?? null;
}
export function accessRearmAfter(store: SiteAccessStore, key: string, _now: number): number {
  return store.reviews[key] ?? 0;
}
/** Check recorded authorization at the event time. Gaps are NOT covered retroactively. */
export function wasSiteAuthorized(store: SiteAccessStore, key: string, at: number): boolean {
  const relevant = (store.sessions[key] ?? []).filter(s => s.startedAt <= at && (s.endedAt === null || at < s.endedAt));
  return relevant.length > 0 && relevant.every(s => s.windows.some(w => w.from <= at && at < w.until));
}
function text(value: string, label: string, max: number): string {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw new Error(`${label} is required (maximum ${max} characters).`);
  return value.trim();
}
function actor(operator: AccessOperator): AccessOperator {
  return { id: text(operator.id, 'Operator identity', 200), name: text(operator.name, 'Operator name', 200) };
}
function validateExpiry(end: number, start: number, now: number): void {
  if (!Number.isFinite(end) || end < now + MIN_ACCESS_DURATION_MS) throw new Error('Choose a deadline at least one minute in the future.');
  if (end > start + MAX_ACCESS_DURATION_MS) throw new Error('One visit is limited to 24 hours from its actual start. Close it and schedule a new work order.');
}
function replace(store: SiteAccessStore, s: SiteAccessSession, now: number, review = false): SiteAccessStore {
  const existing = (store.sessions[s.siteKey] ?? []).filter(x => x.id !== s.id);
  if (existing.length >= ACCESS_HISTORY_LIMIT) throw new Error('Local history limit reached. Export the history and move to backend storage.');
  const result: SiteAccessStore = { version: 2, reviews: { ...store.reviews },
    sessions: { ...store.sessions, [s.siteKey]: [s, ...existing] } };
  if (review && siteAccessSummary(result, s.siteKey, now).approved) result.reviews[s.siteKey] = now;
  return result;
}
function current(store: SiteAccessStore, key: string, id: string, revision: number): SiteAccessSession {
  const s = (store.sessions[key] ?? []).find(x => x.id === id);
  if (!s || s.revision !== revision) throw new Error('This work session changed in another tab. Review the refreshed state and try again.');
  if (s.endedAt !== null) throw new Error('This visit is already closed. It cannot be reopened.');
  return s;
}
function record(s: SiteAccessSession, action: AccessAction, reason: string, operator: AccessOperator, now: number,
  updates: Partial<SiteAccessSession> = {}): SiteAccessSession {
  if (now < s.startedAt || now < (s.audit[s.audit.length - 1]?.at ?? 0)) throw new Error('The system clock moved backwards. Correct it before changing access.');
  const updated = { ...s, ...updates, revision: s.revision + 1 };
  if (s.audit.length >= 500) throw new Error('Local audit limit reached. Close the visit and export its history.');
  return { ...updated, audit: [...s.audit, { action, at: now, operator: actor(operator),
    reason: text(reason, 'Reason', 500), previousExpiresAt: s.expiresAt, expiresAt: updated.expiresAt }] };
}
function cutoff(windows: AuthorizationWindow[], now: number): AuthorizationWindow[] {
  return windows.map(w => ({ ...w, until: Math.min(w.until, now) })).filter(w => w.until > w.from);
}
function renewed(s: SiteAccessSession, now: number, end = s.expiresAt): AuthorizationWindow[] {
  return [...cutoff(s.windows, now), { from: now, until: Math.min(end, now + PRESENCE_INTERVAL_MS) }];
}
export function grantAccess(store: SiteAccessStore, request: GrantSiteAccess, operator: AccessOperator, now: number, id: string,
  supervisor = false): SiteAccessStore {
  if (!isValidSiteKey(request.siteKey)) throw new Error('Resolve the physical site before starting a work order.');
  const a: AccessActivity = { ...request.activity, name: text(request.activity.name, 'Work-order name', 100), team: text(request.activity.team, 'Team', 100) };
  if (!Number.isInteger(a.deviceId) || a.deviceId <= 0 || !Number.isInteger(a.persons) || a.persons < 1 || a.persons > 999)
    throw new Error('The work order needs a valid device and team size (1-999).');
  const restriction = startRestriction(a, now, supervisor);
  if (restriction) throw new Error(restriction);
  if (Object.values(store.sessions).flat().some(s => s.activity.id === a.id && s.activity.deviceId === a.deviceId))
    throw new Error('This work order already has a visit. Use its existing controls, or create a new work order for a new visit.');
  if (!request.teamVerified) throw new Error('Verify the arriving team and review the current site alarms first.');
  validateExpiry(request.expiresAt, now, now);
  const schedule = workOrderWindow(a)!;
  if ((now >= schedule.end || request.expiresAt > schedule.end) && !(supervisor && request.scheduleOverride))
    throw new Error('Starting beyond the original deadline requires explicit Admin/SysAdmin approval.');
  const owner = actor(operator);
  const session: SiteAccessSession = { id: text(id, 'Session ID', 100), siteKey: request.siteKey,
    siteLabel: text(request.siteLabel, 'Site name', 200), activity: a, startedAt: now, expiresAt: request.expiresAt,
    endedAt: null, revision: 1, grantedBy: owner, confirmationDueAt: now + PRESENCE_INTERVAL_MS, lastConfirmedAt: now,
    suspendedAt: null, suspensionReason: '', windows: [{ from: now, until: Math.min(request.expiresAt, now + PRESENCE_INTERVAL_MS) }],
    audit: [{ action: 'granted', at: now, operator: owner, reason: text(request.reason, 'Start reason', 500), expiresAt: request.expiresAt }] };
  return replace(store, session, now, true);
}
export function confirmAccess(store: SiteAccessStore, key: string, id: string, revision: number, reason: string,
  operator: AccessOperator, now: number): SiteAccessStore {
  const s = current(store, key, id, revision);
  if (accessSessionState(s, now) !== 'active') throw new Error('Approval has lapsed. Use Review / Resume and verify the team again.');
  return replace(store, record(s, 'confirmed', reason, operator, now, {
    lastConfirmedAt: now, confirmationDueAt: now + PRESENCE_INTERVAL_MS, windows: renewed(s, now)
  }), now, true);
}
export function extendAccess(store: SiteAccessStore, key: string, id: string, revision: number, end: number,
  reason: string, operator: AccessOperator, now: number): SiteAccessStore {
  const s = current(store, key, id, revision);
  if (accessSessionState(s, now) !== 'active') throw new Error('Approval has lapsed. Use Review / Resume instead of an extension.');
  validateExpiry(end, s.startedAt, now);
  if (end <= s.expiresAt) throw new Error('The new deadline must be later than the current deadline.');
  const windows = s.windows.map((w, i) => i === s.windows.length - 1 ? { ...w, until: Math.min(end, s.confirmationDueAt) } : w);
  // An extension never renews the 15-minute presence confirmation.
  return replace(store, record(s, 'extended', reason, operator, now, { expiresAt: end, windows }), now);
}
export function suspendAccess(store: SiteAccessStore, key: string, id: string, revision: number, reason: string,
  operator: AccessOperator, now: number): SiteAccessStore {
  const s = current(store, key, id, revision);
  return replace(store, record(s, 'suspended', reason, operator, now, {
    suspendedAt: now, suspensionReason: text(reason, 'Suspension reason', 500), windows: cutoff(s.windows, now)
  }), now);
}
export function resumeAccess(store: SiteAccessStore, key: string, id: string, revision: number, end: number,
  reason: string, operator: AccessOperator, now: number): SiteAccessStore {
  const s = current(store, key, id, revision);
  if (!s.activity.id || !workOrderWindow(s.activity)) throw new Error('This legacy visit cannot be authorized. Close it and use a valid scheduled work order.');
  if (accessSessionState(s, now) === 'active') throw new Error('This work session is already authorized.');
  validateExpiry(end, s.startedAt, now);
  return replace(store, record(s, 'resumed', reason, operator, now, {
    legacy: false, expiresAt: end, suspendedAt: null, suspensionReason: '', lastConfirmedAt: now,
    confirmationDueAt: now + PRESENCE_INTERVAL_MS, windows: renewed(s, now, end)
  }), now, true);
}
export function endAccess(store: SiteAccessStore, key: string, id: string, revision: number, reason: string,
  operator: AccessOperator, now: number): SiteAccessStore {
  const s = current(store, key, id, revision);
  // Expired and suspended work is still unresolved and must be explicitly closed.
  return replace(store, record(s, 'ended', reason, operator, now, { endedAt: now, windows: cutoff(s.windows, now) }), now, true);
}
export function invalidateWorkOrders(store: SiteAccessStore, key: string, activities: ScheduledWorkOrder[], deviceIds: number[],
  now: number): SiteAccessStore {
  let result = store;
  for (const s of store.sessions[key] ?? []) {
    if (s.endedAt !== null || s.suspendedAt !== null || !deviceIds.includes(s.activity.deviceId)) continue;
    const a = activities.find(a => Number(a.id) === s.activity.id && Number(a.deviceId) === s.activity.deviceId);
    if (!a || a.isActive === false || !sameWorkOrder(a, s.activity)) {
      result = suspendAccess(result, key, s.id, s.revision, 'Work order was removed, disabled, or changed. Reconcile the order before authorizing again.',
        { id: 'system:work-order-check', name: 'Work-order validation' }, now);
    }
  }
  return result;
}
/** Legacy approvals are imported as SUSPENDED, never silently grandfathered in. */
export function parseAccessStore(raw: string | null, now = Date.now()): SiteAccessStore {
  if (raw === null) return emptyAccessStore();
  const parsed = JSON.parse(raw);
  if (!parsed || ![1, 2].includes(parsed.version) || !parsed.sessions || typeof parsed.sessions !== 'object' || Array.isArray(parsed.sessions))
    throw new Error('Stored work sessions are invalid. Recover storage before making access changes.');
  const legacy = parsed.version === 1;
  const result: SiteAccessStore = { version: 2, reviews: legacy ? {} : parsed.reviews, sessions: {} };
  if (!result.reviews || typeof result.reviews !== 'object' || Array.isArray(result.reviews)) throw new Error('Invalid review history.');
  for (const [key, value] of Object.entries(result.reviews)) {
    if (!isValidSiteKey(key) || !Number.isFinite(value) || value < 0) throw new Error('Invalid review time.');
  }
  for (const [key, rows] of Object.entries(parsed.sessions)) {
    if (!isValidSiteKey(key) || !Array.isArray(rows) || rows.length > ACCESS_HISTORY_LIMIT) throw new Error('Invalid work-session history.');
    const ids = new Set<string>();
    result.sessions[key] = rows.map((row: any) => {
      const s: SiteAccessSession = legacy ? { ...row, legacy: true, confirmationDueAt: 0, lastConfirmedAt: null,
        suspendedAt: row.endedAt === null ? now : null, suspensionReason: 'Policy updated: verify this existing work order before resuming.', windows: [] } : row;
      if (!s || s.siteKey !== key || !s.id || ids.has(s.id) || !Number.isInteger(s.revision) || s.revision < 1 ||
          !Number.isFinite(s.startedAt) || !Number.isFinite(s.expiresAt) || s.expiresAt <= s.startedAt ||
          s.expiresAt > s.startedAt + MAX_ACCESS_DURATION_MS ||
          (s.endedAt !== null && (!Number.isFinite(s.endedAt) || s.endedAt < s.startedAt)) ||
          !Number.isFinite(s.confirmationDueAt) || (s.lastConfirmedAt !== null && !Number.isFinite(s.lastConfirmedAt)) ||
          (s.suspendedAt !== null && !Number.isFinite(s.suspendedAt)) || !Array.isArray(s.windows) || !Array.isArray(s.audit) || s.audit.length > 500)
        throw new Error('Invalid work-session record.');
      actor(s.grantedBy); text(s.siteLabel, 'Site', 200);
      if (!s.activity || !Number.isInteger(s.activity.deviceId) || s.activity.deviceId <= 0 ||
          (s.activity.id !== null && (!Number.isInteger(s.activity.id) || s.activity.id <= 0)) ||
          !Number.isInteger(s.activity.persons) || s.activity.persons < 1 || s.activity.persons > 999) throw new Error('Invalid work-order snapshot.');
      text(s.activity.name, 'Work order', 100); text(s.activity.team, 'Team', 100);
      if (!s.legacy && (!s.activity.id || !workOrderWindow(s.activity))) throw new Error('A scheduled work order is required.');
      for (const w of s.windows) if (!Number.isFinite(w.from) || !Number.isFinite(w.until) || w.from < s.startedAt ||
        w.until <= w.from || w.until > s.expiresAt || (s.endedAt !== null && w.until > s.endedAt)) throw new Error('Invalid authorization window.');
      for (const a of s.audit) {
        if (!a || !['granted','confirmed','extended','suspended','resumed','ended','migrated'].includes(a.action) || !Number.isFinite(a.at) || !Number.isFinite(a.expiresAt)) throw new Error('Invalid audit entry.');
        actor(a.operator); text(a.reason, 'Reason', 500);
      }
      ids.add(s.id); return s;
    });
  }
  return result;
}
export function workOrderPresentation(a: ScheduledWorkOrder, session: SiteAccessSession | null, now: number): { label: string; tone: string; rank: number; sortAt: number } {
  const window = workOrderWindow(a);
  if (session) {
    const state = accessSessionState(session, now);
    if (state === 'ended') return { label: 'Completed', tone: 'info', rank: 5, sortAt: -(session.endedAt ?? 0) };
    if (state !== 'active') return { label: state === 'confirmation-overdue' ? 'Confirmation overdue' : state === 'expired' ? 'Deadline reached' : 'Approval suspended', tone: 'warning', rank: 0, sortAt: Math.min(session.expiresAt, session.confirmationDueAt) };
    return { label: 'NOC started', tone: 'online', rank: 1, sortAt: Math.min(session.expiresAt, session.confirmationDueAt) };
  }
  if (a.isActive === false) return { label: 'Disabled', tone: 'offline', rank: 5, sortAt: -(window?.end ?? 0) };
  if (!window) return { label: 'Invalid schedule', tone: 'warning', rank: 5, sortAt: 0 };
  if (now >= window.end) return { label: 'Schedule ended', tone: 'warning', rank: 5, sortAt: -window.end };
  if (now >= window.start) return { label: 'Awaiting NOC start', tone: 'warning', rank: 2, sortAt: window.start };
  return { label: 'Upcoming', tone: 'info', rank: 3, sortAt: window.start };
}
