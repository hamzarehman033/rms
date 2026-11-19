/* Deterministic offline checks of the actual radar/incident/connectivity services.
 * Angular/browser adapters are mocked; a production build and live MQTT test are separate. */
const assert = require('node:assert/strict');
const { environment: workOrderEnvironment } = require('./work-order-access-checks.cjs');
const tests = [];
const MINUTE = 60_000;
const STORAGE_KEY = 'mobigence.security.incidents.v1.7';
function test(name, body) { tests.push([name, body]); }

function environment(sharedStorage) {
  const e = workOrderEnvironment(sharedStorage);
  const pending = new Map();
  let timerId = 0, sequence = 0, writes = 0;
  const originalWrite = e.globals.localStorage.setItem;
  e.globals.localStorage.setItem = (key, value) => { if (key.includes('security.incidents')) writes++; originalWrite(key, value); };
  e.globals.setTimeout = (fn, delay = 0) => { const id = ++timerId; pending.set(id, { fn, at: e.now + delay }); return id; };
  e.globals.clearTimeout = id => pending.delete(id);
  const setNow = e.setNow.bind(e);
  e.setNow = now => {
    setNow(now);
    for (const [id, timer] of [...pending]) if (timer.at <= e.now) { pending.delete(id); timer.fn(); }
  };
  e.signalr.isConnected$ = new e.customer.constructor(true);
  e.connectivity = new (e.load('src/app/core/services/security-connectivity.service.ts').SecurityConnectivityService)(e.signalr, e.customers);
  e.helpers = e.load('src/app/core/services/radar-frame.ts');
  e.frame = (overrides = {}) => ({
    deviceId: 1, topic: 'telecom/test/site/device/ai', receivedAt: new Date(e.now).toISOString(),
    packetSignature: 0xA156, protocolVersion: 1, messageType: 3, radarStatus: 3,
    sequence: sequence++ & 0xFF, radarAOnline: true, radarBOnline: true,
    targets: [{ radarId: 1, slot: 1, angleDeg: 90, distanceMm: 2000, speedCmps: 12 }], ...overrides
  });
  e.emitRadar = (overrides = {}) => { const frame = e.frame(overrides); e.signalr.onRadarDetection$.next(frame); return frame; };
  e.writeCount = () => writes;
  const close = e.close.bind(e);
  e.close = () => { e.connectivity.ngOnDestroy(); close(); };
  return e;
}
const run = body => async () => { const e = environment(); try { await body(e); } finally { e.close(); } };

test('Radar A target immediately creates a ten-minute Intruder incident', run(e => {
  e.emitRadar(); const incident = e.incidents.getIncident(1);
  assert.equal(e.incidents.getCategory(1), 'intruder');
  assert.equal(incident.firstDetectedAt, e.now); assert.equal(incident.lastDetectedAt, e.now);
  assert.equal(incident.expiresAt, e.now + 10 * MINUTE);
  assert.deepEqual([...incident.cameraIds], []); assert.ok(e.storage.has(STORAGE_KEY));
}));
test('Radar B also creates an intrusion with no Radar A target', run(e => {
  e.emitRadar({ targets: [{ radarId: 2, slot: 3, angleDeg: 123, distanceMm: 8000, speedCmps: 0 }] });
  assert.equal(e.incidents.getCategory(1), 'intruder');
}));
test('An empty target frame does not create an intrusion', run(e => {
  e.emitRadar({ targets: [] }); assert.equal(e.incidents.getCategory(1), 'healthy');
}));
test('Targets belonging to offline radars are ignored', run(e => {
  e.emitRadar({ radarAOnline: false }); assert.equal(e.incidents.getCategory(1), 'healthy');
}));
test('Invalid packet types, device identifiers and online flags are rejected', run(e => {
  for (const change of [{ messageType: 1 }, { deviceId: -1 }, { deviceId: '1' }, { radarAOnline: 'true' }, { targets: null }]) {
    const frame = e.frame(change); assert.equal(e.helpers.isValidRadarFrame(frame), false);
    e.signalr.onRadarDetection$.next(frame);
  }
  assert.equal(e.incidents.getCategory(1), 'healthy');
}));
test('Out-of-range, missing and nonnumeric coordinates never count as targets', run(e => {
  const valid = e.frame().targets[0];
  for (const change of [{ radarId: 3 }, { slot: 0 }, { slot: 4 }, { angleDeg: -1 }, { angleDeg: 181 },
    { angleDeg: NaN }, { angleDeg: '90' }, { distanceMm: -1 }, { distanceMm: 8001 }, { distanceMm: Infinity }]) {
    e.emitRadar({ targets: [{ ...valid, ...change }] });
  }
  e.emitRadar({ targets: [null, {}] }); assert.equal(e.incidents.getCategory(1), 'healthy');
}));
test('Zero distance, edge bearings and maximum range are valid; slots are unique', run(e => {
  const frame = e.frame({ targets: [
    { radarId: 1, slot: 1, angleDeg: 0, distanceMm: 0, speedCmps: 0 },
    { radarId: 1, slot: 1, angleDeg: 90, distanceMm: 2000, speedCmps: 0 },
    { radarId: 2, slot: 3, angleDeg: 180, distanceMm: 8000, speedCmps: 255 }
  ] });
  assert.equal(e.helpers.getValidRadarTargets(frame).length, 2);
  e.signalr.onRadarDetection$.next(frame); assert.equal(e.incidents.getCategory(1), 'intruder');
}));
test('The last fresh radar target renews the complete ten-minute incident window', run(e => {
  e.emitRadar(); e.advance(9 * MINUTE); e.emitRadar();
  assert.equal(e.incidents.getIncident(1).expiresAt, e.now + 10 * MINUTE);
  e.advance(9 * MINUTE); assert.equal(e.incidents.getCategory(1), 'intruder');
  e.advance(MINUTE); assert.equal(e.incidents.getCategory(1), 'healthy');
}));
test('No-target and offline-radar frames do not clear or prolong the retained intrusion', run(e => {
  e.emitRadar(); const expiresAt = e.incidents.getIncident(1).expiresAt;
  e.advance(MINUTE); e.emitRadar({ targets: [] }); e.advance(MINUTE); e.emitRadar({ radarAOnline: false });
  assert.equal(e.incidents.getIncident(1).expiresAt, expiresAt);
  e.setNow(expiresAt); assert.equal(e.incidents.getCategory(1), 'healthy');
}));
test('Duplicate delivery does not renew the intrusion window', run(e => {
  const frame = e.emitRadar(); const end = e.incidents.getIncident(1).expiresAt;
  e.advance(MINUTE); e.signalr.onRadarDetection$.next(frame);
  assert.equal(e.incidents.getIncident(1).expiresAt, end);
}));
test('Eight-bit sequence wrap does not suppress a later real detection', run(e => {
  e.emitRadar({ sequence: 0 }); e.advance(52_000); e.emitRadar({ sequence: 0 });
  assert.equal(e.incidents.getIncident(1).lastDetectedAt, e.now);
}));
test('Out-of-order target frames are ignored after a newer empty frame', run(e => {
  const old = e.frame(); e.advance(1000); e.emitRadar({ targets: [] });
  e.signalr.onRadarDetection$.next(old); assert.equal(e.incidents.getCategory(1), 'healthy');
}));
test('Stale and far-future radar receipts do not create alarms', run(e => {
  e.emitRadar({ receivedAt: new Date(e.now - 10 * MINUTE - 1).toISOString() });
  e.emitRadar({ receivedAt: new Date(e.now + MINUTE + 1).toISOString() });
  assert.equal(e.incidents.getCategory(1), 'healthy');
}));
test('Missing live timestamps use receipt time instead of hiding a real target', run(e => {
  e.emitRadar({ receivedAt: '' }); assert.equal(e.incidents.getCategory(1), 'intruder');
}));
test('Camera and radar detections share a site window without fabricating camera IDs', run(e => {
  e.emit({ cameraId: 2 }); e.advance(1000); e.emitRadar();
  const incident = e.incidents.getIncident(1); assert.deepEqual([...incident.cameraIds], [2]);
  assert.equal(incident.lastDetectedAt, e.now); assert.equal(incident.eventKeys.length, 2);
}));
test('High-rate radar updates keep one deduplication key and preserve camera evidence', run(e => {
  e.emit(); const cameraKey = e.incidents.getIncident(1).eventKeys[0];
  for (let i = 0; i < 600; i++) { e.advance(200); e.emitRadar(); }
  assert.equal(e.incidents.getIncident(1).eventKeys.length, 2);
  assert.ok(e.incidents.getIncident(1).eventKeys.includes(cameraKey));
}));
test('Different gateway IDs at one site share the same intrusion', run(e => {
  e.emitRadar({ deviceId: 2 }); assert.equal(e.incidents.getCategory(1), 'intruder');
  assert.equal(e.incidents.getIncident(1).siteKey, 'site:100');
  assert.equal(e.incidents.getCategory(3), 'healthy');
}));
test('Detection before site registration migrates to the physical site', run(e => {
  e.emitRadar({ deviceId: 9 }); e.incidents.registerDevices([{ id: 9, siteId: 200 }]);
  assert.equal(e.incidents.getCategory(3), 'intruder'); assert.equal(e.incidents.getCategory(1), 'healthy');
}));
test('Valid work-order access suppresses radar intrusion classification', run(async e => {
  await e.access.grant(e.request(), [1]); e.advance(1000); e.emitRadar();
  assert.equal(e.incidents.getCategory(1), 'approved-access'); assert.equal(e.incidents.getIncident(1), null);
}));
test('A radar target after the final team departure re-arms immediately', run(async e => {
  const visit = await e.access.grant(e.request(), [1]); e.advance(MINUTE);
  await e.access.end(visit, 'Departure verified'); e.advance(1000); e.emitRadar();
  assert.equal(e.incidents.getCategory(1), 'intruder');
}));
test('A delayed radar receipt from the authorized visit cannot reopen it', run(async e => {
  const visit = await e.access.grant(e.request(), [1]); e.advance(MINUTE); const delayed = e.frame();
  e.advance(MINUTE); await e.access.end(visit, 'Departure verified'); e.advance(1000);
  e.signalr.onRadarDetection$.next(delayed); assert.equal(e.incidents.getCategory(1), 'healthy');
}));
test('One overdue team permits a radar alarm even with another valid team present', run(async e => {
  const first = await e.access.grant(e.request(), [1]); e.advance(MINUTE);
  await e.access.grant(e.request({ activity: e.rows.get(18), expiresAt: first.expiresAt }), [1]); e.advance(14 * MINUTE); e.emitRadar();
  assert.equal(e.incidents.getCategory(1), 'intruder');
}));
test('Guard review is preserved until its original expiry despite more radar targets', run(e => {
  e.emitRadar(); const expiry = e.incidents.getIncident(1).expiresAt;
  e.incidents.classifySite(1, 'guard'); e.advance(9 * MINUTE); e.emitRadar();
  assert.equal(e.incidents.getCategory(1), 'guard'); assert.equal(e.incidents.getIncident(1).expiresAt, expiry);
  e.setNow(expiry); assert.equal(e.incidents.getCategory(1), 'healthy'); e.emitRadar();
  assert.equal(e.incidents.getCategory(1), 'intruder');
}));
test('Persisted radar incidents restore and reject replayed older target frames', run(e => {
  e.emitRadar(); e.advance(1000); const latest = e.emitRadar(); e.advance(1000);
  const other = environment(e.storage);
  try {
    other.setNow(e.now); assert.equal(other.incidents.getCategory(1), 'intruder');
    const expiry = other.incidents.getIncident(1).expiresAt;
    other.signalr.onRadarDetection$.next(latest); assert.equal(other.incidents.getIncident(1).expiresAt, expiry);
    other.emitRadar({ receivedAt: new Date(e.now - 1500).toISOString() });
    assert.equal(other.incidents.getIncident(1).expiresAt, expiry);
  } finally { other.close(); }
}));
test('Radar persistence batches updates but keeps exact last detection in memory', run(e => {
  e.emitRadar(); assert.equal(e.writeCount(), 1);
  for (let i = 0; i < 5; i++) { e.advance(100); e.emitRadar(); }
  assert.equal(e.writeCount(), 1); assert.equal(e.incidents.getIncident(1).lastDetectedAt, e.now);
  e.advance(600); assert.equal(e.writeCount(), 2);
  assert.equal(JSON.parse(e.storage.get(STORAGE_KEY))['site:100'].lastDetectedAt, e.now - 600);
}));
test('Guard classification immediately flushes the newest pending radar state', run(e => {
  e.emitRadar(); e.advance(200); e.emitRadar(); e.incidents.classifySite(1, 'guard');
  assert.equal(JSON.parse(e.storage.get(STORAGE_KEY))['site:100'].category, 'guard');
  assert.equal(e.writeCount(), 2); e.advance(2000); assert.equal(e.writeCount(), 2);
}));
test('Customer switch flushes the previous scope without moving alarms to another tenant', run(e => {
  e.emitRadar(); e.advance(200); e.emitRadar(); e.customer.next({ id: 8 });
  assert.equal(JSON.parse(e.storage.get(STORAGE_KEY))['site:100'].lastDetectedAt, e.now);
  assert.equal(e.incidents.getCategory(1), 'healthy'); assert.equal(e.storage.has('mobigence.security.incidents.v1.8'), false);
}));
test('Blocked localStorage does not suppress live radar monitoring', run(e => {
  e.denyWrites(); e.emitRadar(); assert.equal(e.incidents.getCategory(1), 'intruder');
}));
test('A target frame supplies independent security connectivity evidence', run(e => {
  assert.equal(e.connectivity.getDeviceStatus(1), 'offline'); e.emitRadar();
  assert.equal(e.connectivity.getDeviceStatus(1), 'online');
}));
test('Empty and all-sensors-offline frames still prove gateway connectivity', run(e => {
  e.emitRadar({ targets: [], radarAOnline: false, radarBOnline: false });
  assert.equal(e.connectivity.getDeviceStatus(1), 'online'); assert.equal(e.incidents.getCategory(1), 'healthy');
}));
test('Radar-only connectivity uses the existing 120-second fallback then expires', run(e => {
  e.emitRadar(); e.advance(120_000); assert.equal(e.connectivity.getDeviceStatus(1), 'online');
  e.advance(1); assert.equal(e.connectivity.getDeviceStatus(1), 'offline');
}));
test('Radar frames refresh life evidence without changing an observed heartbeat timeout', run(e => {
  e.emit({ messageType: 2, heartbeatIntervalSec: 20 }); e.advance(30_000); e.emitRadar({ targets: [] });
  e.advance(60_000); assert.equal(e.connectivity.getDeviceStatus(1), 'online');
  e.advance(1); assert.equal(e.connectivity.getDeviceStatus(1), 'offline');
}));
test('Old radar receipts cannot move connectivity lastSeen backwards', run(e => {
  e.emitRadar(); e.advance(30_000); e.emitRadar({ receivedAt: new Date(e.now - 50_000).toISOString() });
  e.advance(90_000); assert.equal(e.connectivity.getDeviceStatus(1), 'online');
}));
test('A disconnected SignalR hub remains offline despite a cached radar frame', run(e => {
  e.emitRadar(); e.signalr.isConnected$.next(false); assert.equal(e.connectivity.getDeviceStatus(1), 'offline');
}));
test('Invalid and stale radar frames cannot mark an unknown device online', run(e => {
  e.emitRadar({ messageType: 1 }); e.emitRadar({ receivedAt: new Date(e.now - 6 * MINUTE).toISOString() });
  assert.equal(e.connectivity.getDeviceStatus(1), 'offline');
}));
test('High-rate connectivity frames notify once on first online transition', run(e => {
  let updates = 0; const sub = e.connectivity.updates$.subscribe(() => updates++);
  const before = updates; for (let i = 0; i < 100; i++) e.emitRadar({ targets: [] });
  assert.equal(updates - before, 1); sub.unsubscribe();
}));

if (require.main === module) (async () => {
  let passed = 0;
  for (const [name, fn] of tests) {
    try { await fn(); console.log(`PASS ${name}`); passed++; }
    catch (error) { console.error(`FAIL ${name}\n${error.stack}`); }
  }
  console.log(`\n${passed}/${tests.length} radar checks passed`);
  if (passed !== tests.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { environment };
