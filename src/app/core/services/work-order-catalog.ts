import { firstValueFrom, timeout } from 'rxjs';
import { Activity, ActivityService } from './activity.service';
export interface WorkOrderCatalog { items: Activity[]; complete: boolean; warning: string; }
/** Read all available pages before ranking. Never label a partial fetch as complete. */
export async function loadWorkOrderCatalog(api: ActivityService, deviceIds: number[], cancelled: () => boolean = () => false): Promise<WorkOrderCatalog> {
  const items = new Map<string, Activity>();
  for (const deviceId of [...new Set(deviceIds)].filter(id => Number.isInteger(id) && id > 0)) {
    let finished = false;
    for (let page = 1; page <= 100; page++) {
      if (cancelled()) throw new Error('Work-order loading was cancelled.');
      const response = await firstValueFrom(api.getActivities({ pagesize: 50, pagenumber: page,
        filters: [{ key: 'deviceId', value: deviceId, operator: 'equals' }] }).pipe(timeout(15_000)));
      const rows = response?.data?.pageData;
      if (!Array.isArray(rows)) throw new Error('The work-order response could not be read.');
      if (!rows.length) { finished = true; break; }
      let added = 0;
      for (const raw of rows) {
        if (Number(raw.deviceId) !== deviceId || !Number.isInteger(Number(raw.id)) || Number(raw.id) <= 0) continue;
        const key = `${deviceId}:${Number(raw.id)}`;
        if (!items.has(key)) added++;
        items.set(key, { ...raw, id: Number(raw.id), deviceId, persons: Number(raw.persons) });
      }
      // Some servers clamp page size. Continue until empty instead of assuming 50.
      if (!added) return { items: [...items.values()], complete: false,
        warning: 'The API repeated a page. This list may be incomplete; active sessions remain visible below.' };
    }
    if (!finished) return { items: [...items.values()], complete: false,
      warning: 'The activity catalog exceeded the preview page limit. Some older records may not be shown.' };
  }
  return { items: [...items.values()], complete: true, warning: '' };
}
