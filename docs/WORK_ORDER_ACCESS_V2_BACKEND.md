# Backend handoff - scheduled work-order access v2

This document is a proposed contract, not an implemented endpoint list. The frontend preview calls existing Activity reads and existing event integrations only. Do not configure MQTT/door/siren commands from these UI actions without a separate hardware-control design.

## Authoritative records

Use a physical site ID and tenant ID, not a browser-derived device fallback. Keep the original work order separate from its actual visit. A visit references a single existing work order/team; multiple visits for different work orders may coexist at a site.

Minimum session fields: session ID, work order ID/version, tenant/site/device identities, team/roster snapshot, actual start, authorized end, last positive confirmation, confirmation deadline, explicit suspension timestamp/reason, actual departure/closure timestamp, revision, actor audit, authorization intervals.

Keep the planned start/end and site timezone as explicit instants. Add an end date for overnight schedules. Preserve old planned dates when early start, late start or extension happens.

## Commands

Start, ConfirmPresence, ExtendWork, SuspendApproval, ResumeAfterReview, EndVisit. Each must include a server-recognized actor, expected session/work-order revision, idempotency key, and reason. Start/Resume/Confirm require affirmative team/site verification; End requires affirmative departure confirmation. Suspend never means work completed.

Server checks include tenant/site/work-order ownership, active/cancelled state, changed team/schedule, user permissions, valid deadline, early-start limit, initial late-start supervisor policy, and duplicate visit protection. Do not trust identities, roles, clocks or 'teamVerified' booleans alone from browser storage. Authenticate, authorize and audit each request.

Use transactional updates. A stale extension must not revive a closed visit. Lock or version the site aggregate as well as the session when two teams change concurrently.

## Timers and aggregate classification

- Team confirmation: 15 minutes after last positive verification. Reminder at five minutes remaining.
- Ordinary early start: at most one hour before planned start; no auto-start at scheduled time.
- Initial after-end start: explicit supervisor authorization and deadline.
- Extension updates authorized end only. Confirmation updates confirmation deadline only.
- Current authorization ends at min(work end, confirmation deadline).
- Site approval requires at least one unfinished visit AND every unfinished visit authorized.
- Any overdue, expired or suspended unfinished visit pauses site approval. Do not let a second valid team mask it.
- End one team without touching other teams. End the final team and restore normal intrusion processing immediately.
- A timeout is an operational exception, not evidence of departure and not a fabricated intrusion.

Use server time and durable expiry/reminder jobs. Broadcast both session and site aggregate state to connected NOC clients. A disconnected browser must not keep a device/server approval alive.

## Events, re-arming, and evidence

Continue detection and evidence collection while authorized. Store event occurrence time separately from receipt time and deduplicate with a durable event identifier. Keep authorization intervals so delayed events are evaluated against the state at occurrence; a later resume must not retroactively authorize a gap.

Preserve the existing ten-minute intrusion/Guard review rules where applicable. Remove the independent work-team Approved Access action from all client/server entry points, not just its visible button. Guard review must not create work authorization; define its allowed use independently.

A healthy work authorization is site-level operational approval, not identification of every person. Future unexpected-entry/restricted-zone rules and verified exit telemetry should not be silently suppressed.

## Integration with existing scheduling and firmware

Check whether current server/firmware logic already suppresses alarms by scheduled time. The new requirement forbids automatic approval just because the work order is in its planned window. A frontend change alone cannot correct independent server/device schedule suppression.

Do not translate Start/Confirm/Extend/End directly into siren, door, or digital-output changes. Define any device-side suppression separately with bounded lease/expiry, sequence, acknowledgement, offline behavior and physical feedback. Camera, alarm and access states must remain distinguishable.

## Suggested API shape (not called in this preview)

A read endpoint should return unfinished sessions, next eligible work orders, site aggregate approval, next effective deadline, authoritative server time and revisions. Mutations should return the updated session and aggregate so Security Details, Security Summary and Activities share one state.

The browser adapter methods in `SiteAccessService` provide a boundary to replace with authenticated server calls. Replace local storage authority, local locking and local reminders; do not run competing local and server timers. Read-only browser caching can remain, but stale cached approval must never overrule the server.

## Migration

Import only vetted test records, or begin fresh server sessions through explicit review. Never treat editable localStorage audit entries as signed authorization. Legacy unlinked visits cannot grant access under the new work-order-only policy. Retain evidence/history for audit without silently reactivating old approvals.

## Server acceptance cases

Test concurrent start/end/extend across operators, duplicate requests, wrong tenant/site, deleted/edited work orders, old form revisions, server time/clock skew, cross-midnight windows, browser closure, hub disconnection, missed confirmation, late event delivery, one overdue team among several valid teams, empty-site final departure, and backend/edge independence from planned-time auto-start logic.
