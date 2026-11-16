/** The existing API supplies local wall-clock times, not a timezone or end date. */
export const PRESENCE_INTERVAL_MS = 15 * 60_000;
export const PRESENCE_WARNING_MS = 5 * 60_000;
export const EARLY_START_MS = 60 * 60_000;
export const MAX_ACCESS_DURATION_MS = 24 * 60 * 60_000;
export const MIN_ACCESS_DURATION_MS = 60_000;

export interface ScheduledWorkOrder {
  id?: number | null;
  deviceId: number;
  name: string;
  team: string;
  persons: number;
  date: string;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}
export interface WorkOrderWindow { start: number; end: number; }

function wallClock(date: string, time: string): number {
  const day = String(date ?? '').slice(0, 10);
  const clock = String(time ?? '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !/^\d{2}:\d{2}(:\d{2}(\.\d{1,7})?)?$/.test(clock)) return NaN;
  const [year, month, d] = day.split('-').map(Number);
  const [hour, minute, second = 0] = clock.split(':').map(Number);
  if (month < 1 || month > 12 || d < 1 || d > 31 || hour > 23 || minute > 59 || second >= 60) return NaN;
  const result = new Date(year, month - 1, d, hour, minute, Math.floor(second));
  // Reject invalid calendar dates and nonexistent DST wall-clock times.
  if (result.getFullYear() !== year || result.getMonth() !== month - 1 || result.getDate() !== d ||
      result.getHours() !== hour || result.getMinutes() !== minute) return NaN;
  return result.getTime();
}
export function workOrderWindow(activity: ScheduledWorkOrder): WorkOrderWindow | null {
  const start = wallClock(activity.date, activity.startTime);
  const end = wallClock(activity.date, activity.endTime);
  return Number.isFinite(start) && Number.isFinite(end) && end > start ? { start, end } : null;
}
export function sameWorkOrder(a: ScheduledWorkOrder, b: ScheduledWorkOrder): boolean {
  const left = workOrderWindow(a), right = workOrderWindow(b);
  return !!left && !!right && left.start === right.start && left.end === right.end &&
    Number(a.id) === Number(b.id) && Number(a.deviceId) === Number(b.deviceId) &&
    Number(a.persons) === Number(b.persons) &&
    ['name', 'team'].every(key => String(a[key as keyof ScheduledWorkOrder] ?? '').trim() === String(b[key as keyof ScheduledWorkOrder] ?? '').trim());
}
export function startRestriction(activity: ScheduledWorkOrder, now: number, supervisor = false): string {
  if (!Number.isInteger(Number(activity.id)) || Number(activity.id) <= 0) return 'An existing work order is required.';
  if (activity.isActive === false) return 'This work order is disabled or cancelled.';
  const window = workOrderWindow(activity);
  if (!window) return 'Correct the work-order date/time first. Overnight work needs explicit dates in the backend.';
  if (now < window.start - EARLY_START_MS) return 'Start is available from one hour before the scheduled time.';
  if (now >= window.end && !supervisor) return 'The scheduled window ended. An Admin or SysAdmin must approve a revised deadline.';
  return '';
}
export function formatRemaining(until: number, now: number): string {
  const seconds = Math.max(0, Math.ceil((until - now) / 1000));
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
    .map(n => String(n).padStart(2, '0')).join(':');
}
