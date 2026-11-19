/* Geometry checks against the actual radar component, using mocked Angular adapters.
 * These checks do not render templates or replace the production build/browser checks. */
const assert = require('node:assert/strict');
const { environment } = require('./work-order-access-checks.cjs');

const e = environment();
const { SecurityRadarComponent } = e.load('src/app/features/security-details/security-radar/security-radar.component.ts');
const tests = [];
const test = (name, body) => tests.push([name, body]);
const target = (overrides = {}) => ({ radarId: 1, slot: 1, angleDeg: 90, distanceMm: 4000, speedCmps: 12, ...overrides });
const frame = (targets, overrides = {}) => ({
  deviceId: 1, topic: 'telecom/test/site/device/ai', receivedAt: new Date(e.now).toISOString(),
  packetSignature: 0xA156, protocolVersion: 1, messageType: 3, radarStatus: 3,
  sequence: 42, radarAOnline: true, radarBOnline: true, targets, ...overrides
});
function plot(targets, overrides) {
  const component = new SecurityRadarComponent();
  component.frame = frame(targets, overrides);
  return component;
}
function near(actual, expected, label) {
  assert.ok(Number.isFinite(actual) && Math.abs(actual - expected) <= 1e-8,
    `${label}: expected ${expected}, received ${actual}`);
}
function position(dot, x, y) {
  assert.ok(dot, 'Expected one plotted target');
  near(dot.x, x, 'x coordinate');
  near(dot.y, y, 'y coordinate');
}

for (const [radarId, angleDeg, x, y] of [
  [1, 0, 340, 180], [1, 90, 180, 20], [1, 180, 20, 180],
  [2, 0, 340, 180], [2, 90, 180, 340], [2, 180, 20, 180]
]) {
  test(`Radar ${radarId === 1 ? 'A' : 'B'} at ${angleDeg} degrees lands on the correct full-range axis`, () => {
    position(plot([target({ radarId, angleDeg, distanceMm: 8000 })]).dots[0], x, y);
  });
}

test('Intermediate Radar A bearings follow measured polar coordinates in the upper half', () => {
  const component = plot([target({ angleDeg: 30 }), target({ slot: 2, angleDeg: 135 })]);
  position(component.dots[0], 249.2820323027551, 140);
  position(component.dots[1], 123.4314575050762, 123.4314575050762);
});
test('Intermediate Radar B bearings are reflected below the same centre', () => {
  const component = plot([target({ radarId: 2, angleDeg: 30 }), target({ radarId: 2, slot: 2, angleDeg: 135 })]);
  position(component.dots[0], 249.2820323027551, 220);
  position(component.dots[1], 123.4314575050762, 236.5685424949238);
});
test('Protocol example targets retain their individual range and bearing', () => {
  const component = plot([
    target({ radarId: 1, angleDeg: 123, distanceMm: 350, speedCmps: 17 }),
    target({ radarId: 2, angleDeg: 52, distanceMm: 1594, speedCmps: 102 })
  ]);
  position(component.dots[0], 176.1875267548948, 174.12930602438203);
  position(component.dots[1], 199.62728783338198, 205.1217828249823);
  assert.equal(component.dots[0].speedCmps, 17);
  assert.equal(component.dots[1].speedCmps, 102);
});
test('Doubling distance doubles displacement without changing bearing', () => {
  for (const radarId of [1, 2]) {
    const component = plot([
      target({ radarId, slot: 1, angleDeg: 37, distanceMm: 2000 }),
      target({ radarId, slot: 2, angleDeg: 37, distanceMm: 4000 })
    ]);
    near(component.dots[1].x - 180, 2 * (component.dots[0].x - 180), 'horizontal scale');
    near(component.dots[1].y - 180, 2 * (component.dots[0].y - 180), 'vertical scale');
  }
});
test('Zero-distance targets from either radar share the exact origin', () => {
  const component = plot([target({ distanceMm: 0 }), target({ radarId: 2, angleDeg: 123, distanceMm: 0 })]);
  assert.equal(component.dots.length, 2);
  component.dots.forEach(dot => position(dot, 180, 180));
});
test('All supported bearings stay inside their hemisphere and the range boundary', () => {
  for (const radarId of [1, 2]) {
    for (let angleDeg = 0; angleDeg <= 180; angleDeg += 5) {
      for (const distanceMm of [0, 1000, 4000, 8000]) {
        const dot = plot([target({ radarId, angleDeg, distanceMm })]).dots[0];
        assert.ok(dot.x >= 20 - 1e-8 && dot.x <= 340 + 1e-8);
        assert.ok(radarId === 1 ? dot.y <= 180 + 1e-8 : dot.y >= 180 - 1e-8);
        assert.ok(Math.hypot(dot.x - 180, dot.y - 180) <= 160 + 1e-8);
      }
    }
  }
});
test('All six radar slots retain separate target identities and positions', () => {
  const source = [
    target({ slot: 1, angleDeg: 20, distanceMm: 2000 }),
    target({ slot: 2, angleDeg: 90, distanceMm: 4000 }),
    target({ slot: 3, angleDeg: 140, distanceMm: 6000 }),
    target({ radarId: 2, slot: 1, angleDeg: 40, distanceMm: 2500 }),
    target({ radarId: 2, slot: 2, angleDeg: 100, distanceMm: 4500 }),
    target({ radarId: 2, slot: 3, angleDeg: 160, distanceMm: 6500 })
  ];
  const component = plot(source);
  assert.equal(component.dots.length, 6);
  assert.equal(new Set(component.dots.map(dot => `${dot.radarId}:${dot.slot}`)).size, 6);
  assert.equal(new Set(component.dots.map(dot => `${dot.x}:${dot.y}`)).size, 6);
  component.dots.forEach((dot, index) => {
    for (const key of ['radarId', 'slot', 'angleDeg', 'distanceMm', 'speedCmps']) assert.equal(dot[key], source[index][key]);
  });
});
test('Offline Radar A targets are removed while online Radar B targets remain', () => {
  const component = plot([target(), target({ radarId: 2 })], { radarAOnline: false });
  assert.equal(component.dots.length, 1);
  assert.equal(component.dots[0].radarId, 2);
});
test('Both radars offline produce no plotted targets', () => {
  assert.equal(plot([target(), target({ radarId: 2 })], { radarAOnline: false, radarBOnline: false }).dots.length, 0);
});
test('Invalid target IDs, slots, ranges and angles cannot produce plotted targets', () => {
  for (const change of [
    { radarId: 0 }, { radarId: 3 }, { slot: 0 }, { slot: 4 }, { slot: '1' },
    { angleDeg: -1 }, { angleDeg: 181 }, { angleDeg: NaN }, { angleDeg: '90' },
    { distanceMm: -1 }, { distanceMm: 8001 }, { distanceMm: Infinity }, { distanceMm: '2000' }
  ]) assert.equal(plot([target(change)]).dots.length, 0);
  assert.equal(plot([null, undefined, {}]).dots.length, 0);
});
test('Only the first valid target in a repeated radar slot is displayed', () => {
  const component = plot([target(), target({ angleDeg: 20 }), target({ radarId: 2 })]);
  assert.equal(component.dots.length, 2);
  assert.equal(component.dots[0].angleDeg, 90);
  assert.equal(component.dots[1].radarId, 2);
});
test('A new frame replaces the old target list instead of accumulating ghost dots', () => {
  const component = plot([target(), target({ radarId: 2 })]);
  component.frame = frame([target({ radarId: 2, slot: 3, angleDeg: 60 })]);
  assert.equal(component.dots.length, 1);
  assert.equal(component.dots[0].radarId, 2);
  assert.equal(component.dots[0].slot, 3);
});
test('Null and empty frames clear previous plotted targets', () => {
  const component = plot([target()]);
  component.frame = null;
  assert.equal(component.dots.length, 0);
  component.frame = frame([target()]);
  component.frame = frame([]);
  assert.equal(component.dots.length, 0);
});
test('Invalid frame envelopes clear dots and never reuse the previous target list', () => {
  for (const change of [{ messageType: 1 }, { deviceId: 0 }, { deviceId: '1' }, { radarAOnline: 'true' }, { targets: null }]) {
    const component = plot([target()]);
    component.frame = frame([target()], change);
    assert.equal(component.dots.length, 0);
  }
});
test('Intrusion styling is enabled only by the active Intruder classification', () => {
  const component = plot([target()]);
  assert.equal(component.hasActiveIntrusion, false);
  for (const [category, expected] of [['intruder', true], ['guard', false], ['approved-access', false]]) {
    component.incident = { category };
    assert.equal(component.hasActiveIntrusion, expected);
    assert.equal(component.dots.length, 1, 'A review changes alarm state, not measured target geometry');
  }
  component.incident = null;
  assert.equal(component.hasActiveIntrusion, false);
});
test('Separate radar component instances have independent stable gradient identities', () => {
  const first = new SecurityRadarComponent(), second = new SecurityRadarComponent();
  assert.notEqual(first.gradientId, second.gradientId);
  const id = first.gradientId;
  first.frame = frame([target()]);
  first.frame = null;
  assert.equal(first.gradientId, id);
  assert.ok(first.gradientId.length && second.gradientId.length);
});
test('Projection does not mutate frozen incoming packet or target data', () => {
  const originalTarget = Object.freeze(target());
  const packet = Object.freeze(frame(Object.freeze([originalTarget])));
  const component = new SecurityRadarComponent();
  component.frame = packet;
  assert.equal(component.dots.length, 1);
  assert.equal(originalTarget.x, undefined);
  assert.equal(originalTarget.y, undefined);
  assert.equal(originalTarget.angleDeg, 90);
});

let passed = 0;
try {
  for (const [name, body] of tests) {
    try { body(); console.log(`PASS ${name}`); passed++; }
    catch (error) { console.error(`FAIL ${name}\n${error.stack}`); }
  }
  console.log(`\n${passed}/${tests.length} radar display checks passed`);
  if (passed !== tests.length) process.exitCode = 1;
} finally { e.close(); }
