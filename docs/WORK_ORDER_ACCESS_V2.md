# MobiGence - Scheduled Work Order Access, Frontend Preview v2

## Reference and scope

Built against the uploaded `rms-main (1).zip` (including the space before `(1)`), SHA-256:
`e4642c8e169c7724a504d952eb326fd27a9f4b9967ede7d085e431af12e0e53c`.

This is an incremental Angular update, not edge-device firmware. It deliberately uses the existing Activities read API and browser persistence while the new workflow is evaluated. It does not introduce or call a backend work-session endpoint. No changes have been pushed or deployed.

The camera grid, radar component, alert/evidence layout, hardware command service, Siren, Flash, Door, Site Light, RMS navigation, connectivity calculation and offline blank-status rule are preserved. Activities creation/editing/deletion APIs are unchanged; successful local edits/deletions now recheck associated local work sessions. Work-order status labels and ranking are linked to actual NOC start state.

## Agreed policy

- Work orders must already exist. There is no free-text/unscheduled Grant Access path on the Security page.
- The old Mark Approved Access action is removed. Mark Guard remains a separate one-minute incident review; it does not start a work session.
- A scheduled clock time NEVER starts approval automatically.
- An eligible job can be started up to one hour early, including exactly the one-hour boundary. Starting even earlier is blocked.
- Early and late starts keep the original scheduled end unless an Admin/SysAdmin explicitly approves a revised initial deadline.
- An initial start after the scheduled end requires Admin/SysAdmin and an explicit deadline override. Managers cannot silently revive a past scheduled window.
- The NOC receives a presence reminder every 15 minutes after start or confirmation. Confirming the team resets the reminder. Missing it leaves approval in effect.
- Extension changes the work deadline. The next presence reminder stays on its existing schedule.
- Multiple work orders can run at one physical site. Each work order has its own team, session, timer, audit and controls. One existing work order cannot be used to create multiple visits; a new visit needs a new work order.
- The existing 24-hour maximum per actual visit is retained, including all extensions.

The current roles remain Manager, Admin and SysAdmin with Security-module access (SysAdmin is exempt from the module check). The backend must enforce its own permissions later; browser checks are not a security boundary.

## Multiple-team rule

A site has Approved Access while any eligible visit is active. A visit starts with NOC authorization and ends its coverage at departure, the work deadline, explicit suspension, or invalidation of the linked work order. The latest eligible deadline determines how long overlapping visits cover the site.

Each team has its own controls. Ending, expiring or suspending one visit leaves other eligible visits active. Without an eligible visit, a new qualifying camera or radar detection can raise an intrusion.

Approval is site-wide, NOT person recognition. A site with authorized teams can still contain an unauthorized person; keep cameras, evidence and NOC review operational.

## Page workflow

The existing right-hand order is retained:

Radar -> Alerts -> Scheduled Activities -> Work Order Access.

### Scheduled Activities

The card loads the site-mapped devices' work orders using the existing `GET /Activity` pagination. It ranks attention-required sessions first, then NOC-started sessions, current windows awaiting NOC start, nearest upcoming work and history. The most relevant item is highlighted. A clock-only window is labeled Awaiting NOC start, never automatically In Progress.

An active work session remains visible in the Work Order Access panel even when an API record is unavailable or disabled. A complete catalog is refreshed approximately once per minute while this Security page is open. Incomplete or failed reads are identified; they are not used to conclude that unseen work orders were deleted.

Start Activity / Start Early opens a confirmation form referencing the existing order. Team and work-order identity cannot be entered as an instant new visit. The original schedule is displayed, not overwritten.

### Per-team controls

| Control | Effect |
| --- | --- |
| Confirm Team Still On Site | Requires verification note and checked confirmation; resets that team's check to now + 15 minutes. |
| Extend | Requires a reason; +30, +60, +120 minutes or explicit end. Does not renew the presence check. |
| Suspend Approval | Immediately suspends that team's approval. The visit remains open for review or closure. |
| Review / Resume | For suspended or expired approval. Revalidates the linked work order and requires fresh team/site review. Resumes NOW; no backdating. |
| End This Team Visit | Requires departure confirmation and note. Can close an active, expired or suspended session. Never closes another team's visit. |

The UI reads the selected work order again before Start, Confirm, Extend or Resume. A deleted, disabled or changed work order cannot be blindly reused. A changed team or schedule requires reconciliation of that original record, or closure and a new work order for a different visit.

## Early departure without a call

The frontend relies on NOC to confirm departure and end the visit. An unreported departure can leave approval active until the work deadline. Presence reminders prompt verification and do not grant an extension.

## Existing incident behavior

Outside work approval, a qualifying intrusion lasts one minute from the latest qualifying detection. Mark Guard lasts one minute from review. Work-order eligibility follows the approved visit deadline. Camera and radar detections during authorized intervals remain available as evidence.

A deliberate NOC team/site review acknowledges earlier site classification. Authorization intervals are recorded. A delayed event known to have occurred inside an authorized interval does not reopen the old incident. An event during an unapproved gap is not retrospectively authorized by a later extension or resume. Missing live timestamps are treated conservatively as new arrivals; exact ordering still needs a trustworthy backend/device timestamp.

Summary cards use the same aggregate site classification. Multiple teams do not create multiple sites. The Security list still hides Status when Connectivity is Offline. Attention appears in the status tooltip and the site's work-order panel without adding a new security category or modifying Connectivity.

## Storage and migration

The existing per-customer key `mobigence.security.site-access.v1.<customer>` is retained; the data envelope becomes version 2. This allows the old data to be read rather than discarded.

Open v2 visits that previously capped their latest interval at the presence reminder use the approved work deadline for that interval. Earlier suspended or expired gaps and closed visit history are preserved.

Legacy v1 linked sessions are preserved but suspended until reviewed under the new policy. Old unlinked sessions remain visible for closure/history but cannot be reauthorized; use a valid scheduled work order. Previously saved standalone Approved Access incident classifications no longer bypass the work-order requirement. Guard is preserved.

Reload or close older tabs before testing. Do not clear site storage to simulate deployment: that would erase local history. When storage is corrupt/unavailable or cannot save, the page reports failure and does not claim approval. Existing stored records are not silently overwritten with an empty store.

Same-origin tabs use a browser lock and optimistic session revision checks. A stale form cannot overwrite a newer End/Extend action. Tenant/account changes and page destruction cancel in-flight approval submissions.

This remains same-browser, same-origin state. It is not shared between laptops, browser profiles, incognito windows, or localhost and Azure. It is editable by the browser owner and is not a secure backend audit. Expiry is derived from absolute timestamps, so an elapsed session is expired when the page reopens; no notification is delivered while the application is closed. Browser timers can be throttled, and local clock accuracy matters. Central reminders and trusted expiry require the backend.

## Date/time limitation

The existing Activities API provides a date plus wall-clock start/end, without an explicit timezone/end date. This preview preserves the application's local-browser interpretation. Use the same timezone on demonstration machines (for the current NOC deployment, Asia/Karachi).

Invalid calendar times and ambiguous cross-midnight original schedules are rejected instead of guessing an end date. Split such a scheduled job or extend the backend contract with explicit start/end instants and a site timezone. A work-session extension may cross midnight, provided it stays within 24 hours of actual start.

## Installation (Windows PowerShell)

Use either the patch OR changed-files ZIP, never both. The patch is recommended. The package is based on the exact latest ZIP, not an older enhancement patch.

Start with prior edits committed and a clean working tree on `main`:

```powershell
cd "C:\Users\DELL 2 in 1\Documents\Python_Programs\MOBIGENCE\rms"
git status
git branch --show-current
git pull --ff-only origin main

git apply --check --index "$HOME\Downloads\MobiGence_Work_Order_Access_V2.patch"
git apply --index "$HOME\Downloads\MobiGence_Work_Order_Access_V2.patch"

node tools/work-order-access-checks.cjs
npm run build
npm start
```

`git apply --check` should produce no errors. Stop on a patch mismatch; do not force it, add schema suppressions, or overwrite a newer repository. The patch stages only its changes. There are no new npm dependencies. The test script uses the project's existing TypeScript dependency; install existing dependencies with `npm ci` when needed.

After local acceptance testing and a successful production build, stop the development server with Ctrl+C:

```powershell
git diff --cached --check
git diff --cached --stat
git commit -m "Require scheduled work orders for NOC access with team confirmation"
git push origin main
```

Your existing deployment workflow is not changed. A push to main may deploy the site; test before pushing. Do not use `git add .` to gather unrelated work.

For ZIP application, copy the included `src`, `tools` and `docs` paths into the project root, preserving folder structure and reviewing differences first. Do not replace the entire repository or delete files not in the ZIP. For a committed rollback, use `git revert <this-feature-commit>` rather than a destructive hard reset. Restoring an older implementation while new browser storage exists may require an explicit migration plan; do not casually downgrade an active NOC session.

## Manual acceptance test

1. Create two existing work orders for this site with different teams in the ordinary Activities page. Do not operate physical outputs for this test.
2. Before start, confirm that the schedule alone leaves the site unapproved. More than one hour early must be disabled; within one hour Start Early must be available.
3. Start Team A after NOC verification. The site/summary becomes Approved Access and the radar has no intrusion indication. Start Team B independently.
4. Confirm Team A only; check that Team B's countdown is unchanged. Extend a work deadline and verify the presence-check deadline is unchanged.
5. Allow one presence reminder to pass. The site should still show Approved Access and the affected team should have a reminder.
6. Let one team's work deadline pass. Verify its visit needs review while the other authorized team still covers the site.
7. End one team with departure confirmation: the other valid team's session remains. End the final team and then deliver a fresh intrusion: it must be classified normally.
8. Refresh the browser, open a second same-origin tab, test a stale form, and confirm the Offline list row still has a blank Status cell.
9. Edit/delete a linked work order from Activities and verify that team’s approval pauses. A suspended session must still permit explicit closure.
10. Confirm cameras, radar location, alert/evidence history and the four hardware buttons have not moved or changed.

## Verification performed

- 66 focused offline lifecycle/integration checks passed using the actual TypeScript model, adapter, incident service and control component with mocked Angular/RxJS/API/browser dependencies.
- 64 Chromium layout-fixture combinations passed: eight states, light/dark themes, widths 1600/1280/390/320. Fixtures use the actual updated templates/styles and source-computed view data, with a static surrounding page shell. They are not an authenticated Angular application.
- Strict TypeScript checking passed for the pure policy/model. Additional service/component adapter checks passed against explicit dependency type facades. These are not a substitute for Angular's template compiler.
- The packaged patch is checked against a freshly extracted copy of the uploaded source, and the functional suite is rerun there.
- A full Angular production build and real backend/device integration were NOT performed: the container could not resolve the npm registry. `npm run build` on your installed project remains mandatory.

## Engineering references

The source preserves Angular standalone imports rather than suppressing unknown-element errors. Local concurrency uses browser Web Locks; tab updates use the storage event. Relevant official documentation:

- Angular NgModules/imports: https://angular.dev/guide/ngmodules
- Web Locks: https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API
- Storage event: https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event

See `WORK_ORDER_ACCESS_V2_BACKEND.md` for the next implementation phase.
