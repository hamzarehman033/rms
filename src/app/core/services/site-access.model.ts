/** Manual work sessions are separate from scheduled activities and 10-minute reviews. */
export const MAX_ACCESS_DURATION_MS = 24 * 60 * 60 * 1000;
export const MIN_ACCESS_DURATION_MS = 60 * 1000;
export const ACCESS_HISTORY_LIMIT = 20;

export interface AccessOperator { id: string; name: string; }
export interface AccessActivity {
  id: number | null;
  deviceId: number;
  name: string;
  team: string;
  persons: number;
  date: string;
  startTime: string;
  endTime: string;
}
export interface AccessAuditEntry {
  action: 'granted' | 'extended' | 'ended';
  at: number;
  operator: AccessOperator;
  reason: string;
  previousExpiresAt?: number;
  expiresAt: number;
}
export interface SiteAccessSession {
  id: string;
  siteKey: string;
  siteLabel: string;
  activity: AccessActivity;
  startedAt: number;
  expiresAt: number;
  endedAt: number | null;
  revision: number;
  grantedBy: AccessOperator;
  audit: AccessAuditEntry[];
}
export interface SiteAccessStore {
  version: 1;
  sessions: Record<string, SiteAccessSession[]>;
}
export interface GrantSiteAccess {
  siteKey: string;
  siteLabel: string;
  activity: AccessActivity;
  expiresAt: number;
  reason: string;
  teamVerified: boolean;
}
export type AccessSessionState = 'active' | 'ended' | 'expired';

export function emptyAccessStore(): SiteAccessStore { return { version: 1, sessions: {} }; }
export function isValidSiteKey(value: string): boolean { return /^(site|device):[A-Za-z0-9_-]+$/.test(value); }
export function accessSessionState(session: SiteAccessSession, now: number): AccessSessionState {
  if (session.endedAt !== null) return 'ended';
  return session.startedAt <= now && session.expiresAt > now ? 'active' : 'expired';
}
export function activeAccessSession(store: SiteAccessStore, key: string, now: number): SiteAccessSession | null {
  return (store.sessions[key] ?? []).find(s => accessSessionState(s, now) === 'active') ?? null;
}
export function latestAccessSession(store: SiteAccessStore, key: string): SiteAccessSession | null {
  return (store.sessions[key] ?? [])[0] ?? null;
}
/** Older reviewed/authorized detections must not reopen an incident after End or expiry. */
export function accessRearmAfter(store: SiteAccessStore, key: string, now: number): number {
  return (store.sessions[key] ?? []).reduce((cutoff, s) => {
    const end = s.endedAt ?? s.expiresAt;
    return end <= now ? Math.max(cutoff, end) : cutoff;
  }, 0);
}

function requiredText(value: string, label: string, max: number): string {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) {
    throw new Error(`${label} is required and must be ${max} characters or fewer.`);
  }
  return value.trim();
}
function validateOperator(operator: AccessOperator): AccessOperator {
  return { id: requiredText(operator.id, 'Operator identity', 200), name: requiredText(operator.name, 'Operator name', 200) };
}
function validateExpiry(expiresAt: number, startedAt: number, now: number): void {
  if (!Number.isFinite(expiresAt) || expiresAt < now + MIN_ACCESS_DURATION_MS) {
    throw new Error('Choose an expiry at least one minute in the future.');
  }
  if (expiresAt > startedAt + MAX_ACCESS_DURATION_MS) {
    throw new Error('Access may last at most 24 hours from the actual start. End this session before granting another.');
  }
}
function replaceSession(store: SiteAccessStore, session: SiteAccessSession): SiteAccessStore {
  const sessions = [session, ...(store.sessions[session.siteKey] ?? []).filter(s => s.id !== session.id)];
  return { version: 1, sessions: { ...store.sessions, [session.siteKey]: sessions.slice(0, ACCESS_HISTORY_LIMIT) } };
}
export function grantAccess(
  store: SiteAccessStore, request: GrantSiteAccess, operator: AccessOperator, now: number, id: string
): SiteAccessStore {
  if (!isValidSiteKey(request.siteKey)) throw new Error('The site identity is not ready. Reload the site before granting access.');
  if (activeAccessSession(store, request.siteKey, now)) throw new Error('This site already has active access. Refresh and use Extend or End.');
  if (!request.teamVerified) throw new Error('Confirm that the team has been verified before granting access.');
  validateExpiry(request.expiresAt, now, now);
  const actor = validateOperator(operator);
  const reason = requiredText(request.reason, 'Reason', 500);
  const activity: AccessActivity = { ...request.activity,
    name: requiredText(request.activity.name, 'Activity name', 100),
    team: requiredText(request.activity.team, 'Team', 100)
  };
  if (!Number.isInteger(activity.deviceId) || activity.deviceId <= 0 ||
      (activity.id !== null && (!Number.isInteger(activity.id) || activity.id <= 0)) ||
      !Number.isInteger(activity.persons) || activity.persons < 1 || activity.persons > 999) {
    throw new Error('A valid device, activity and team size (1-999) are required.');
  }
  const session: SiteAccessSession = {
    id: requiredText(id, 'Session ID', 100), siteKey: request.siteKey,
    siteLabel: requiredText(request.siteLabel, 'Site name', 200), activity,
    startedAt: now, expiresAt: request.expiresAt, endedAt: null, revision: 1, grantedBy: actor,
    audit: [{ action: 'granted', at: now, operator: actor, reason, expiresAt: request.expiresAt }]
  };
  return replaceSession(store, session);
}
function currentSession(store: SiteAccessStore, key: string, id: string, revision: number): SiteAccessSession {
  const session = latestAccessSession(store, key);
  if (!session || session.id !== id || session.revision !== revision) {
    throw new Error('This session changed in another tab. Review the refreshed details and try again.');
  }
  return session;
}
export function extendAccess(
  store: SiteAccessStore, key: string, id: string, revision: number, expiresAt: number,
  reason: string, operator: AccessOperator, now: number
): SiteAccessStore {
  const session = currentSession(store, key, id, revision);
  if (accessSessionState(session, now) !== 'active') throw new Error('Access has ended or expired. Grant a new session instead.');
  validateExpiry(expiresAt, session.startedAt, now);
  if (expiresAt <= session.expiresAt) throw new Error('The new expiry must be later than the current expiry.');
  const entry: AccessAuditEntry = { action: 'extended', at: now, operator: validateOperator(operator),
    reason: requiredText(reason, 'Extension reason', 500), previousExpiresAt: session.expiresAt, expiresAt };
  return replaceSession(store, { ...session, expiresAt, revision: session.revision + 1,
    audit: [...session.audit, entry].slice(-100) });
}
export function endAccess(
  store: SiteAccessStore, key: string, id: string, revision: number, reason: string,
  operator: AccessOperator, now: number
): SiteAccessStore {
  const session = currentSession(store, key, id, revision);
  if (session.endedAt !== null) return store; // Idempotent end: never affect a newer session.
  if (accessSessionState(session, now) !== 'active') throw new Error('This session has already expired. Monitoring is re-armed.');
  const entry: AccessAuditEntry = { action: 'ended', at: now, operator: validateOperator(operator),
    reason: requiredText(reason, 'Closure reason', 500), expiresAt: session.expiresAt };
  return replaceSession(store, { ...session, endedAt: now, revision: session.revision + 1,
    audit: [...session.audit, entry].slice(-100) });
}

/** Reject malformed storage rather than silently overwriting or trusting it as authorization. */
export function parseAccessStore(raw: string | null): SiteAccessStore {
  if (raw === null) return emptyAccessStore();
  const value = JSON.parse(raw) as SiteAccessStore;
  if (!value || value.version !== 1 || !value.sessions || typeof value.sessions !== 'object' || Array.isArray(value.sessions)) {
    throw new Error('Stored access sessions are invalid. Do not grant access until storage has been recovered.');
  }
  for (const [key, sessions] of Object.entries(value.sessions)) {
    if (!isValidSiteKey(key) || !Array.isArray(sessions) || sessions.length > ACCESS_HISTORY_LIMIT) throw new Error('Invalid access history.');
    const ids = new Set<string>();
    for (const s of sessions) {
      if (!s || s.siteKey !== key || typeof s.id !== 'string' || !s.id || ids.has(s.id) ||
          !Number.isInteger(s.revision) || s.revision < 1 || !Number.isFinite(s.startedAt) || s.startedAt <= 0 ||
          !Number.isFinite(s.expiresAt) || s.expiresAt <= s.startedAt || s.expiresAt > s.startedAt + MAX_ACCESS_DURATION_MS ||
          (s.endedAt !== null && (!Number.isFinite(s.endedAt) || s.endedAt < s.startedAt)) ||
          !s.activity || !Array.isArray(s.audit) || s.audit.length < 1 || s.audit.length > 100) throw new Error('Invalid access session.');
      validateOperator(s.grantedBy);
      requiredText(s.siteLabel, 'Site name', 200);
      requiredText(s.activity.name, 'Activity name', 100);
      requiredText(s.activity.team, 'Team', 100);
      if (!Number.isInteger(s.activity.deviceId) || s.activity.deviceId <= 0 ||
          (s.activity.id !== null && (!Number.isInteger(s.activity.id) || s.activity.id <= 0)) ||
          !Number.isInteger(s.activity.persons) || s.activity.persons < 1 || s.activity.persons > 999) throw new Error('Invalid activity snapshot.');
      for (const a of s.audit) {
        if (!a || !['granted', 'extended', 'ended'].includes(a.action) || !Number.isFinite(a.at) ||
            !Number.isFinite(a.expiresAt)) throw new Error('Invalid access history entry.');
        validateOperator(a.operator); requiredText(a.reason, 'Reason', 500);
      }
      ids.add(s.id);
    }
  }
  return value;
}
