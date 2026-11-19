/* Focused offline regression checks. Angular/browser adapters are mocked; production build is separate. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const cp = require('node:child_process');
process.env.TZ = 'Asia/Karachi';
let ts;
try { ts = require('typescript'); } catch { ts = require(path.join(cp.execSync('npm root -g', { encoding:'utf8' }).trim(), 'typescript')); }
const root = path.resolve(__dirname, '..');
const modelFile = 'src/app/core/services/site-access.model.ts';
const serviceFile = 'src/app/core/services/site-access.service.ts';
const componentFile = 'src/app/features/security-details/site-access-control/site-access-control.component.ts';
const incidentFile = 'src/app/core/services/security-incident.service.ts';
const catalogFile = 'src/app/core/services/work-order-catalog.ts';
const tests = [];
function test(name, body) { tests.push([name, body]); }
function observable(value) {
  return { pipe() { return this; }, promise() { return typeof value === 'function' ? value() : Promise.resolve(value); },
    subscribe(observer) { const fn = typeof observer === 'function' ? observer : observer.next?.bind(observer);
      if (typeof value === 'function') value().then(v => fn?.(v), e => observer.error?.(e)); else fn?.(value);
      return { unsubscribe() {} }; } };
}
function environment(sharedStorage) {
  let now = new Date('2026-11-16T10:00:00+05:00').getTime(), sequence = 0, writeFail = false;
  class Clock extends Date { constructor(...args) { super(...(args.length ? args : [now])); } static now() { return now; } }
  class Subject { constructor(value) { this.value = value; this.handlers = new Set(); }
    next(value) { this.value = value; for (const fn of [...this.handlers]) fn(value); }
    subscribe(observer) { const fn = typeof observer === 'function' ? observer : observer.next.bind(observer); this.handlers.add(fn); if (this.constructor === BehaviorSubject) fn(this.value); return {unsubscribe: () => this.handlers.delete(fn)}; }
    asObservable() { return this; } pipe() { return this; } complete() { this.handlers.clear(); } }
  class BehaviorSubject extends Subject {}
  class Subscription { constructor() { this.items = []; } add(s) { this.items.push(s); } unsubscribe() { this.items.forEach(s => s?.unsubscribe()); } }
  const storage = sharedStorage || new Map(), timers = new Map(), events = new Map(), messages = [], cache = new Map();
  const localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => { if (writeFail) throw new Error('Quota'); storage.set(key, value); }, removeItem: key => storage.delete(key) };
  const decorator = () => () => {};
  const core = { Injectable: decorator, Component: metadata => ctor => { ctor.metadata = metadata; }, Input: decorator, Output: decorator,
    EventEmitter: class extends Subject { emit(value) { this.next(value); } }, ElementRef: class {} };
  const rxjs = { BehaviorSubject, Subject, Subscription, timeout: () => x => x, takeUntil: () => x => x,
    firstValueFrom: value => value.promise() };
  let locks = Promise.resolve();
  const globals = { console, Date: Clock, Map, Set, Object, Array, Number, String, JSON, Math, Promise, Error, Intl,
    localStorage, crypto: { randomUUID: () => `session-${++sequence}` }, navigator: { locks: { request(_key, _opts, fn) { const job = locks.then(fn); locks = job.catch(() => {}); return job; } } },
    window: { addEventListener(type, fn) { if (!events.has(type)) events.set(type, new Set()); events.get(type).add(fn); }, removeEventListener(type, fn) { events.get(type)?.delete(fn); } },
    setInterval(fn) { const id = ++sequence; timers.set(id, fn); return id; }, clearInterval(id) { timers.delete(id); },
    setTimeout(fn) { fn(); return 0; }, clearTimeout() {} };
  function load(relative) {
    const file = path.isAbsolute(relative) ? relative : path.join(root, relative);
    if (cache.has(file)) return cache.get(file).exports;
    const source = fs.readFileSync(file, 'utf8');
    const result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, experimentalDecorators: true, useDefineForClassFields:true }, reportDiagnostics:true, fileName:file });
    const errors = (result.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error);
    assert.equal(errors.length, 0, `Syntax diagnostics in ${relative}`);
    const module = { exports:{} }; cache.set(file, module);
    function req(name) {
      if (name === '@angular/core') return core;
      if (name === '@angular/common') return { CommonModule: class{}, NgIf:class{} };
      if (name === '@angular/forms') return { FormsModule: class{} };
      if (name === 'rxjs' || name === 'rxjs/operators') return rxjs;
      if (name.includes('global-toast')) return { toast:Object.fromEntries(['success','error','info','warning'].map(k => [k,(...args) => messages.push([k,...args])])) };
      if (name.startsWith('.')) { let target = path.resolve(path.dirname(file), name); if (!target.endsWith('.ts')) target += '.ts'; return load(target); }
      throw new Error(`Unexpected dependency ${name}`);
    }
    vm.runInNewContext(`(function(require,module,exports){${result.outputText}\n})`, globals, {filename:file})(req, module, module.exports);
    return module.exports;
  }
  const model = load(modelFile), policy = load('src/app/core/services/work-order-policy.ts');
  const customer = new BehaviorSubject({id:7});
  const customers = { activeCustomer$:customer, getActiveCustomerId:() => customer.value?.id };
  const user = { id:1, name:'NOC Operator', roles:['Manager'] }, auth = { getCurrentUser:() => user, isAuthenticated:() => true, getCurrentUserModules:() => Array.from({length:100},(_,i)=>i+1) };
  const rows = new Map();
  const activity = (overrides = {}) => ({ id:17, deviceId:1, name:'Generator maintenance', description:'Test job', team:'Team A', persons:2, date:'2026-11-16', startTime:'10:00:00', endTime:'12:00:00', isActive:true, ...overrides });
  rows.set(17, activity()); rows.set(18, activity({id:18,team:'Team B',name:'Battery inspection'}));
  const api = { getActivityById(id) { const value=rows.get(Number(id)); return value ? observable({data:value}) : observable(() => Promise.reject({status:404})); },
    getActivities(query) { const values=[...rows.values()].filter(a => a.deviceId === query.filters[0].value); const offset=(query.pagenumber-1)*query.pagesize; return observable({data:{pageData:values.slice(offset,offset+query.pagesize)}}); } };
  const access = new (load(serviceFile).SiteAccessService)(customers, auth, api);
  const signalr = {onVisionDetection$: new Subject(), onRadarDetection$: new Subject()};
  const incidents = new (load(incidentFile).SecurityIncidentService)(signalr, customers, access);
  incidents.registerDevices([{id:1,siteId:100},{id:2,siteId:100},{id:3,siteId:200}]);
  const request = (overrides = {}) => ({ siteKey:'site:100',siteLabel:'G7 ISB',activity:rows.get(17),expiresAt:now+2*60*60_000,reason:'Team verified by phone and camera; site alarms reviewed',teamVerified:true,...overrides });
  const actor = {id:'1',name:'NOC Operator'};
  const comp = new (load(componentFile).SiteAccessControlComponent)(access, {nativeElement:{scrollIntoView(){},querySelector(){return null;}}});
  comp.siteKey='site:100';comp.siteLabel='G7 ISB';comp.deviceId=1;comp.deviceIds=[1,2];comp.ngOnChanges();
  return {load,model,policy,customers,customer,user,auth,access,incidents,signalr,api,rows,activity,request,actor,comp,storage,messages,globals,
    get now(){return now;}, setNow(n){now=n;for(const fn of [...timers.values()]) fn();}, advance(ms){this.setNow(now+ms);},
    packet(overrides={}) {return {deviceId:1,messageType:1,eventType:4,snapshotReasonCode:5,cameraId:1,timestampUtc:Math.floor(now/1000),receivedAt:new Clock().toISOString(),messageIdHash:++sequence,isHeaderCrcValid:true,...overrides};},
    emit(overrides={}) {signalr.onVisionDetection$.next(this.packet(overrides));},
    denyWrites(){writeFail=true;},storageEvent(){for(const fn of events.get('storage')||[]) fn({key:null});},
    close(){comp.ngOnDestroy();incidents.ngOnDestroy();access.ngOnDestroy();} };
}
const run = (body) => async () => { const e=environment();try {await body(e);} finally {e.close();} };

test('Schedule time never auto-starts or approves a site',run(e=>{e.advance(60_000);assert.equal(e.incidents.getCategory(1),'healthy');assert.equal(e.access.getAll('site:100').length,0);}));
test('No work order / unscheduled access is rejected',run(async e=>{await assert.rejects(e.access.grant(e.request({activity:{...e.rows.get(17),id:null}}),[1]),/work order/i);}));
test('Missing arrival confirmation is rejected',run(async e=>{await assert.rejects(e.access.grant(e.request({teamVerified:false}),[1]),/verify/i);}));
test('A start at exactly one hour early is allowed',run(async e=>{e.advance(-60*60_000);await e.access.grant(e.request({expiresAt:new Date('2026-11-16T12:00:00+05:00').getTime()}),[1]);assert.equal(e.incidents.getCategory(1),'approved-access');}));
test('A start more than one hour early is rejected',run(async e=>{e.advance(-60*60_000-1);await assert.rejects(e.access.grant(e.request(),[1]),/one hour/);}));
test('Late arrival retains the original end',run(async e=>{e.advance(60*60_000);const end=new Date('2026-11-16T12:00:00+05:00').getTime();const s=await e.access.grant(e.request({expiresAt:end}),[1]);assert.equal(s.expiresAt,end);}));
test('Manager cannot start after scheduled end',run(async e=>{e.advance(121*60_000);await assert.rejects(e.access.grant(e.request(),[1]),/Admin/);}));
test('Supervisor late start requires explicit override',run(async e=>{e.user.roles=['Admin'];e.advance(121*60_000);await assert.rejects(e.access.grant(e.request(),[1]),/explicit/);await e.access.grant(e.request({scheduleOverride:true}),[1]);}));
test('Wrong-site work orders are rejected',run(async e=>{await assert.rejects(e.access.grant(e.request(),[2]),/current site/);}));
test('Cancelled order is rejected before a new approval',run(async e=>{const request=e.request();e.rows.set(17,{...e.rows.get(17),isActive:false});await assert.rejects(e.access.grant(request,[1]),/disabled/);}));
test('Changed team is not silently accepted',run(async e=>{const request=e.request();e.rows.set(17,{...e.rows.get(17),team:'Another team'});await assert.rejects(e.access.grant(request,[1]),/changed/);}));
test('Equivalent timestamp formatting does not invalidate a work order',run(e=>{assert.equal(e.policy.sameWorkOrder(e.rows.get(17),{...e.rows.get(17),date:'2026-11-16T00:00:00',startTime:'10:00:00.0000000'}),true);}));
test('Work order cannot have duplicate concurrent visits',run(async e=>{await e.access.grant(e.request(),[1]);await assert.rejects(e.access.grant(e.request(),[1]),/already has a visit/);}));
test('Two different work orders may run concurrently at one site',run(async e=>{await e.access.grant(e.request(),[1]);await e.access.grant(e.request({activity:e.rows.get(18)}),[1]);assert.equal(e.access.getSummary('site:100').authorized.length,2);assert.equal(e.incidents.getCategory(2),'approved-access');}));
test('End one team keeps another valid team approved',run(async e=>{const a=await e.access.grant(e.request(),[1]);await e.access.grant(e.request({activity:e.rows.get(18)}),[1]);await e.access.end(a,'Team A departed; Team B checked');assert.equal(e.access.getSummary('site:100').authorized.length,1);assert.equal(e.incidents.getCategory(1),'approved-access');}));
test('A completed work order cannot be reused for a new visit',run(async e=>{const a=await e.access.grant(e.request(),[1]);await e.access.end(a,'Team departed');await assert.rejects(e.access.grant(e.request(),[1]),/already has a visit/);}));
test('15-minute confirmation boundary is exclusive',run(async e=>{await e.access.grant(e.request(),[1]);e.advance(15*60_000-1);assert.ok(e.access.getSummary('site:100').approved);e.advance(1);assert.equal(e.access.getSummary('site:100').approved,false);assert.equal(e.access.getSummary('site:100').attention.length,1);}));
test('One overdue team pauses whole-site approval even with another valid team',run(async e=>{await e.access.grant(e.request(),[1]);e.advance(10*60_000);await e.access.grant(e.request({activity:e.rows.get(18),expiresAt:new Date('2026-11-16T12:00:00+05:00').getTime()}),[1]);e.advance(5*60_000);assert.equal(e.access.getSummary('site:100').approved,false);assert.equal(e.access.getSummary('site:100').authorized.length,1);e.emit();assert.equal(e.incidents.getCategory(1),'intruder');}));
test('A presence confirmation renews only that team',run(async e=>{const a=await e.access.grant(e.request(),[1]);await e.access.grant(e.request({activity:e.rows.get(18)}),[1]);e.advance(10*60_000);await e.access.confirm(a,'Camera and phone verification');e.advance(5*60_000);assert.equal(e.access.getSummary('site:100').approved,false);}));
test('Confirmation does not extend the work deadline',run(async e=>{const a=await e.access.grant(e.request({expiresAt:e.now+12*60_000}),[1]);e.advance(10*60_000);const b=await e.access.confirm(a,'Team checked');assert.equal(b.expiresAt,a.expiresAt);e.advance(2*60_000);assert.equal(e.access.getSummary('site:100').approved,false);}));
test('Extension does not reset the confirmation clock',run(async e=>{const a=await e.access.grant(e.request(),[1]);e.advance(10*60_000);const b=await e.access.extend(a,a.expiresAt+30*60_000,'Additional repair time');assert.equal(b.confirmationDueAt,a.confirmationDueAt);e.advance(5*60_000);assert.equal(e.access.getSummary('site:100').approved,false);}));
test('Expired confirmation cannot be fixed by Extend',run(async e=>{const a=await e.access.grant(e.request(),[1]);e.advance(15*60_000);await assert.rejects(e.access.extend(a,a.expiresAt+60_000,'More work'),/Resume/);}));
test('Resume requires fresh verification and restores approval now',run(async e=>{const a=await e.access.grant(e.request(),[1]);e.advance(16*60_000);e.emit();assert.equal(e.incidents.getCategory(1),'intruder');const b=await e.access.resume(a,a.expiresAt,'NOC reverified team and all alarms');assert.equal(b.lastConfirmedAt,e.now);assert.equal(e.incidents.getCategory(1),'approved-access');}));
test('Resume preserves the historical unauthorized gap',run(async e=>{const a=await e.access.grant(e.request(),[1]);const gap=e.now+15*60_000+1000;e.advance(16*60_000);await e.access.resume(a,a.expiresAt,'Team reverified');assert.equal(e.access.wasAuthorized('site:100',gap),false);assert.equal(e.access.wasAuthorized('site:100',e.now),true);}));
test('Suspend does not claim completion or departure',run(async e=>{const a=await e.access.grant(e.request(),[1]);const b=await e.access.suspend(a,'Unexpected movement');assert.equal(b.endedAt,null);assert.equal(e.model.accessSessionState(b,e.now),'suspended');}));
test('Suspended/expired sessions can still be explicitly closed',run(async e=>{const a=await e.access.grant(e.request(),[1]);e.advance(3*60*60_000);const b=await e.access.end(a,'Team departure independently confirmed');assert.equal(b.endedAt,e.now);}));
test('New detection after the final departure immediately becomes Intruder',run(async e=>{const a=await e.access.grant(e.request(),[1]);e.advance(60_000);await e.access.end(a,'Team departed');e.advance(1000);e.emit();assert.equal(e.incidents.getCategory(1),'intruder');}));
test('Delayed alert from an authorized interval does not reopen an intrusion',run(async e=>{const a=await e.access.grant(e.request(),[1]);e.advance(60_000);const at=e.now;e.advance(60_000);await e.access.end(a,'Team departed');e.advance(1000);e.emit({timestampUtc:at/1000});assert.equal(e.incidents.getCategory(1),'healthy');}));
test('Detection during a missed-confirmation gap is not ignored',run(async e=>{await e.access.grant(e.request(),[1]);e.advance(15*60_000+1000);e.emit();assert.equal(e.incidents.getCategory(1),'intruder');}));
test('Guard review remains available; ad hoc Approved Access is rejected',run(e=>{e.emit();assert.equal(e.incidents.classifySite(1,'approved-access'),false);assert.equal(e.incidents.classifySite(1,'guard'),true);assert.equal(e.incidents.getCategory(1),'guard');}));
test('A new work-order start clears old reviewed incidents when all teams are valid',run(async e=>{e.emit();await e.access.grant(e.request(),[1]);e.advance(60_000);await e.access.end(e.access.getAll('site:100')[0],'Departure checked');assert.equal(e.incidents.getCategory(1),'healthy');}));
test('Alarm deduplication remains unchanged outside work sessions',run(e=>{const packet=e.packet();e.signalr.onVisionDetection$.next(packet);const expiry=e.incidents.getIncident(1).expiresAt;e.advance(1000);e.signalr.onVisionDetection$.next(packet);assert.equal(e.incidents.getIncident(1).expiresAt,expiry);}));
test('Different physical sites remain isolated',run(async e=>{await e.access.grant(e.request(),[1]);e.emit({deviceId:3});assert.equal(e.incidents.getCategory(3),'intruder');assert.equal(e.incidents.getCategory(1),'approved-access');}));
test('Stale form cannot overwrite a newer extension',run(async e=>{const a=await e.access.grant(e.request(),[1]);await e.access.extend(a,a.expiresAt+30*60_000,'Extra work');await assert.rejects(e.access.end(a,'Departed'),/another tab/);}));
test('Same-origin lock rejects duplicate simultaneous starts',run(async e=>{const results=await Promise.allSettled([e.access.grant(e.request(),[1]),e.access.grant(e.request(),[1])]);assert.equal(results.filter(r=>r.status==='fulfilled').length,1);}));
test('Storage write failure never produces false approval',run(async e=>{e.denyWrites();await assert.rejects(e.access.grant(e.request(),[1]),/could not save/);assert.equal(e.incidents.getCategory(1),'healthy');}));
test('Missing operator identity cannot authorize a visit',run(async e=>{e.user.id=null;await assert.rejects(e.access.grant(e.request(),[1]),/identity/);}));
test('Viewer role cannot authorize or extend access',run(async e=>{e.user.roles=['Viewer'];await assert.rejects(e.access.grant(e.request(),[1]),/permission/);}));
test('Cancelled navigation cannot commit an approval after the API returns',run(async e=>{let release;let valid=true;e.api.getActivityById=()=>observable(()=>new Promise(r=>{release=r;}));const result=e.access.grant(e.request(),[1],()=>valid);await Promise.resolve();valid=false;release({data:e.rows.get(17)});await assert.rejects(result,/context/);assert.equal(e.access.getAll('site:100').length,0);}));
test('Customer switch during API verification cannot write to either tenant',run(async e=>{let release;e.api.getActivityById=()=>observable(()=>new Promise(r=>{release=r;}));const result=e.access.grant(e.request(),[1]);await Promise.resolve();e.customer.next({id:8});release({data:e.rows.get(17)});await assert.rejects(result,/customer/);assert.equal(e.storage.size,0);}));
test('Successful complete catalog detects deleted active work orders',run(async e=>{await e.access.grant(e.request(),[1]);await e.access.reconcile('site:100',[],[1],e.access.contextKey);assert.equal(e.access.getSummary('site:100').approved,false);}));
test('Changed work order suspends before any extension',run(async e=>{const a=await e.access.grant(e.request(),[1]);e.rows.set(17,{...e.rows.get(17),team:'Changed'});await assert.rejects(e.access.extend(a,a.expiresAt+60_000,'More time'),/changed/);assert.equal(e.access.getSummary('site:100').approved,false);}));
test('Catalog reconciliation does not close another device at the same site',run(async e=>{await e.access.grant(e.request(),[1]);await e.access.reconcile('site:100',[],[2],e.access.contextKey);assert.ok(e.access.getSummary('site:100').approved);}));
test('Catalog pagination reads past a server-clamped page size',run(async e=>{const values=Array.from({length:12},(_,i)=>e.activity({id:i+1}));const api={getActivities:q=>observable({data:{pageData:values.slice((q.pagenumber-1)*5,q.pagenumber*5)}})};const catalog=await e.load(catalogFile).loadWorkOrderCatalog(api,[1]);assert.equal(catalog.items.length,12);assert.equal(catalog.complete,true);}));
test('Repeated pagination is reported as incomplete, not authoritative',run(async e=>{const catalog=await e.load(catalogFile).loadWorkOrderCatalog({getActivities:()=>observable({data:{pageData:[e.activity()]}})},[1]);assert.equal(catalog.complete,false);}));
test('Activities priority is attention, started, awaiting start, upcoming, history',run(async e=>{const a=await e.access.grant(e.request(),[1]);e.advance(16*60_000);assert.equal(e.access.describeActivity(e.activity()).rank,0);assert.equal(e.access.describeActivity(e.activity({id:99})).label,'Awaiting NOC start');assert.equal(e.access.describeActivity(e.activity({id:100,startTime:'11:00:00'})).rank,3);}));
test('Legacy active approvals import as suspended, including unscheduled visits',run(e=>{const row={id:'old',siteKey:'site:100',siteLabel:'Old site',activity:{...e.activity(),id:null},startedAt:e.now-60_000,expiresAt:e.now+60_000,endedAt:null,revision:1,grantedBy:e.actor,audit:[{action:'granted',at:e.now-60_000,operator:e.actor,reason:'Old',expiresAt:e.now+60_000}]};const store=e.model.parseAccessStore(JSON.stringify({version:1,sessions:{'site:100':[row]}}),e.now);assert.equal(e.model.siteAccessSummary(store,'site:100',e.now).approved,false);assert.equal(store.sessions['site:100'][0].activity.id,null);}));
test('Malformed storage is rejected instead of overwriting it',run(e=>{assert.throws(()=>e.model.parseAccessStore('{broken'),/JSON|property|Expected/);assert.throws(()=>e.model.parseAccessStore('{"version":9,"sessions":{}}'),/invalid/);}));
test('24-hour cap applies across extensions',run(async e=>{const a=await e.access.grant(e.request(),[1]);await assert.rejects(e.access.extend(a,a.startedAt+24*60*60_000+1,'Long work'),/24 hours/);}));
test('Invalid dates and ambiguous overnight schedules cannot authorize',run(e=>{assert.equal(e.policy.workOrderWindow(e.activity({date:'2026-02-30'})),null);assert.equal(e.policy.workOrderWindow(e.activity({startTime:'23:00:00',endTime:'02:00:00'})),null);}));
test('Presence warning is emitted once in the last five minutes',run(async e=>{await e.access.grant(e.request(),[1]);e.advance(10*60_000);const count=e.messages.filter(m=>m[1]==='Work-order check due soon').length;e.advance(1000);assert.equal(e.messages.filter(m=>m[1]==='Work-order check due soon').length,count);assert.equal(count,1);}));
test('Missed confirmation emits a distinct approval-paused warning',run(async e=>{await e.access.grant(e.request(),[1]);e.advance(15*60_000);assert.ok(e.messages.some(m=>m[1]==='Site approval paused'));}));
test('Component cannot submit a free-text instant work order',run(async e=>{assert.equal(typeof e.comp.openGrant,'undefined');e.comp.action='start';e.comp.reason='Test';e.comp.teamVerified=true;await e.comp.submit();assert.match(e.comp.error,/existing work order/);assert.equal(e.access.getAll('site:100').length,0);}));
test('Component starts an existing selected work order',run(async e=>{e.comp.selectActivity(e.rows.get(17));e.comp.reason='Verified arrival';e.comp.teamVerified=true;await e.comp.submit();assert.equal(e.comp.summary.approved,true);assert.equal(e.comp.action,'none');}));
test('Component requires departure confirmation before End',run(async e=>{const a=await e.access.grant(e.request(),[1]);e.comp.openAction('end',a);e.comp.reason='Test';await e.comp.submit();assert.match(e.comp.error,/departed/);assert.equal(e.access.getSummary('site:100').sessions.length,1);}));
test('Component can select a second order while the first is active',run(async e=>{await e.access.grant(e.request(),[1]);e.comp.selectActivity(e.rows.get(18));assert.equal(e.comp.action,'start');assert.equal(e.comp.selectedActivity.id,18);}));
test('Page destruction cancels an in-flight component start',run(async e=>{e.comp.selectActivity(e.rows.get(17));e.comp.reason='Verified';e.comp.teamVerified=true;let release;e.api.getActivityById=()=>observable(()=>new Promise(r=>{release=r;}));const action=e.comp.submit();await Promise.resolve();e.comp.ngOnDestroy();release({data:e.rows.get(17)});await action;assert.equal(e.access.getAll('site:100').length,0);}));

test('Local Activities deletion immediately suspends linked access',run(async e=>{await e.access.grant(e.request(),[1]);await e.access.recheckActivity(17,true);assert.equal(e.access.getSummary('site:100').approved,false);assert.equal(e.access.getAll('site:100')[0].endedAt,null);}));
test('Local Activities edit revalidates and suspends changed team',run(async e=>{await e.access.grant(e.request(),[1]);e.rows.set(17,{...e.rows.get(17),team:'Changed crew'});await e.access.recheckActivity(17);assert.equal(e.access.getSummary('site:100').approved,false);}));
test('An unrelated Activities edit does not affect another visit',run(async e=>{await e.access.grant(e.request(),[1]);await e.access.recheckActivity(18,true);assert.ok(e.access.getSummary('site:100').approved);}));
test('Storage failure during extension also pauses the displayed approval',run(async e=>{const a=await e.access.grant(e.request(),[1]);e.denyWrites();await assert.rejects(e.access.extend(a,a.expiresAt+60_000,'Extra time'));assert.equal(e.access.getSummary('site:100').authorized.length,0);assert.equal(e.comp.label(a),'Suspended');}));
test('Presence expiry is recomputed after reload, without an open page timer',run(async e=>{await e.access.grant(e.request(),[1]);const second=environment(e.storage);try{second.advance(16*60_000);assert.equal(second.access.getSummary('site:100').approved,false);}finally{second.close();}}));
test('Same-profile storage refresh propagates another tab ending a session',run(async e=>{const a=await e.access.grant(e.request(),[1]);const second=environment(e.storage);try{assert.ok(second.access.getSummary('site:100').approved);await e.access.end(a,'Departure verified');second.storageEvent();assert.equal(second.access.getSummary('site:100').sessions.length,0);}finally{second.close();}}));
test('Stored old Mark Approved Access cannot bypass the work-order rule',run(e=>{e.emit();const key='mobigence.security.incidents.v1.7';const state=JSON.parse(e.storage.get(key));state['site:100'].category='approved-access';state['site:100'].reviewedAt=e.now;e.storage.set(key,JSON.stringify(state));const other=environment(e.storage);try{assert.equal(other.incidents.getCategory(1),'intruder');}finally{other.close();}}));
test('Expiration alone does not fabricate a camera intrusion',run(async e=>{await e.access.grant(e.request(),[1]);e.advance(15*60_000);assert.equal(e.incidents.getIncident(1),null);assert.equal(e.incidents.getCategory(1),'healthy');}));

// Source boundaries: do not hide errors using schemas or remove the offline blank-status rule.
test('Templates retain known Angular component registration and offline blank status',()=>{
 const module=fs.readFileSync(path.join(root,'src/app/features/security-details/security-details.module.ts'),'utf8');assert.match(module,/SiteAccessControlComponent,/);
 const summary=fs.readFileSync(path.join(root,'src/app/features/security/security.component.html'),'utf8');assert.match(summary,/\*ngIf="getAiDeviceStatus\(device\) === 'online'"/);
 const detail=fs.readFileSync(path.join(root,'src/app/features/security-details/device-detail/security-device-detail.component.html'),'utf8');assert.ok(!detail.includes('Mark Approved Access'));assert.ok(detail.includes('Mark Guard'));assert.ok(!detail.includes('!activeAccessSession'));
 const control=fs.readFileSync(path.join(root,'src/app/features/security-details/site-access-control/site-access-control.component.html'),'utf8');assert.ok(!control.includes('Unscheduled / emergency'));assert.ok(!control.includes('Grant Access'));
});
module.exports = { environment, observable };
if (require.main === module) (async()=>{let passed=0;for(const [name,fn] of tests){try{await fn();console.log(`PASS ${name}`);passed++;}catch(error){console.error(`FAIL ${name}\n${error.stack}`);}}console.log(`\n${passed}/${tests.length} checks passed`);if(passed!==tests.length)process.exitCode=1;})().catch(error=>{console.error(error);process.exitCode=1;});
