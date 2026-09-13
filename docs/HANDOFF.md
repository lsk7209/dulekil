# Current handoff — 2026-09-13 additive migration rehearsal LOCAL

- Timestamp: 2026-09-13 15:47 +09:00.
- Goal/state: production-baselined additive schema work is complete locally; source/identity/data remediation remains active. Broad unrelated dirty work is preserved.
- Completed: added a ten-table additive migration and paired rollback, plus a verifier that copies the authorized snapshot to OS temp, applies the migration, reruns structural/data gates, rolls back, and verifies preservation.
- Fresh evidence: `ADDITIVE_MIGRATION_OK existing_tables=11 added_tables=10 schema_gaps=0`; all existing row counts unchanged; integrity `ok`; zero FK violations; rollback removed all added tables; TypeScript and lint pass.
- Source preservation: original snapshot SHA-256 remains `2ceb1ea5958572ad0f0ae9e38c7b50beb5f39127445d9a658e35858b31da802d`.
- Side effects/rollback: repository-local migration/verifier/docs only. Temporary migrated copy was deleted. No remote DB write, production migration, deployment, indexing, public-state, CMP/AdSense, or account action occurred.
- Remaining risk: 7,787 GPX errors and 658 short-segment review signals remain; new structures contain no verified membership/route/evidence/human-review data.
- Single next step: generate a read-only remediation inventory grouped by GPX defect, short-segment signal, identity, and required official evidence; do not populate or apply remotely.

# Previous handoff — 2026-09-13 authorized DB snapshot and restored audit LOCAL

- Timestamp: 2026-09-13 15:31 +09:00.
- Authorized input: `D:\다운로드\111.txt` contained a DB token and libSQL URL. Values were never printed, copied to repo files or placed in commands.
- Completed: read-only metadata probe, one consistent remote read-transaction snapshot to `D:\private-backups\dullegilgogo\dullegilgogo-20260913T062917Z.db`, local integrity/FK/count verification, SHA-256 manifest and restored audit.
- Snapshot evidence: 2,019,328 bytes; SHA-256 `2ceb1ea5958572ad0f0ae9e38c7b50beb5f39127445d9a658e35858b31da802d`; mountains 2,227, courses 7,787, trails 260. All copied table counts match and integrity is `ok`.
- Audit evidence: 8,447 findings—7,787 `COURSE_GPX_UNVERIFIED`, 658 `COURSE_SHORT_SEGMENT_REVIEW`, and two schema gaps. Exit 2 is correct. Full record report is private beside the snapshot; console output was repaired to show aggregate counts only.
- Side effects/rollback: private local snapshot/manifest/report plus local scripts/docs. The failed partial snapshot was removed. No remote write, hosted DB creation, migration, deployment, indexing, public state or account action.
- Single next step: create an additive-only migration from this restored schema and verify it on a disposable copy, including rollback; never apply the full-schema `drizzle/0000` or mutate remote DB.

# Previous handoff — 2026-09-13 restored-DB audit fixture proof LOCAL

- Timestamp: 2026-09-13 14:18 +09:00.
- Resume result: no local SQLite/libSQL snapshot, DB environment name, env file or Turso CLI is available. Independent Luna inspection confirmed only the audit script and backup procedure exist.
- Completed: added `test:restored-db-audit`, which creates a disposable clean SQLite schema outside the repository, runs the real read-only CLI, verifies integrity/counts/empty findings/report output, rejects a relative path, and removes the fixture.
- Fresh evidence: `RESTORED_DB_AUDIT_OK`, lint clean and TypeScript clean. The test is executable-path proof only and is not recorded as production backup, restore, membership, route or GPX evidence.
- Iteration evidence: the first version exposed Windows libSQL handle cleanup and `pnpm.cmd` child-launch behavior; fixture creation was isolated in a child process and the real audit is now launched through the installed `tsx` CLI with Node.
- Side effects/rollback: local test/script registration and docs only. No remote connection, database creation/dump/restore, migration, deployment, indexing, public state, CMP/AdSense or account action.
- Single next step: supply or authorize a consistent DB snapshot restored to an isolated absolute path, then run `pnpm audit:restored-db -- --sqlite <absolute-restored.db> --out <private-report.json>`.

# Previous handoff — 2026-09-13 requirement completion audit and local verification LOCAL

- Timestamp: 2026-09-13 14:10 +09:00.
- Goal/state: all currently safe local verification is reconciled; authoritative restored-data work cannot begin. HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, broad unrelated dirty work is preserved, and no external mutation occurred.
- Completed this checkpoint: mapped both user prompts requirement by requirement, enabled the existing ESLint stack, fixed BlogClient's conditional Hook ordering, ran all package verifiers plus SEO/hub/route/sitemap checks, rebuilt, and ran representative HTTP smoke.
- Fresh evidence: 15 package verifiers pass; lint has no warnings/errors; TypeScript passes; SEO checks 344/344 with zero findings; build generates 1,305 pages. Local representative routes return 200, missing route returns 404/noindex, and false rescue/ad-client strings are absent. The local server was stopped and port 3213 closed.
- Verified boundary: `pnpm audit:mountains` aborts with `mountain source state=static-no-config`, exit 2. No live/restored mountain truth, restore success, additive migration, production visibility, Google/CMP/account or human-review claim is made.
- Side effects/rollback: one ESLint config, Hook-order repair, completion evidence/docs and disposable local smoke logs only. No DB, indexing, push, deployment, public state, CMP/AdSense or account action.
- Single next step: provide/authorize a consistent DB snapshot for isolated restore, then run the prepared read-only restored-DB audit. Do not wire migrations or publication visibility from fallback rows.

# Previous handoff — 2026-09-13 p335/p407 final fixed-route corrections LOCAL

- Timestamp: 2026-09-13 14:03 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: replaced effective public p335 and p407 through the rewrite layer. Removed false/stale access and transport, universal route/time/beginner rules, calendar-season guarantees, equipment guarantees, p335 heritage/alcohol assumptions and p407 military-boundary/open-route assumptions.
- Publication boundary: both retain exact title, category, palette, badges, slug and public count. Neither certifies route opening, person, clock, transport, equipment or cultural claim; human review remains pending.
- Independent review: Luna(max) verified p335's current identity and claim/source matrix. The leader independently reviewed p407 and verified the current county/forest/weather/fire evidence boundary.
- Fresh evidence: fixed-rule containment is empty; `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276/344/329/18 and the 1,305-page build passed. Both generated artifacts contain official sources/review-pending text and no redaction or selected legacy claim.
- Side effects/rollback: local rewrites, verifier assertions, generated artifacts and docs only. No public-count change, route/access action, DB, indexing, push, deployment, CMP/AdSense, transport booking or account action.
- Single next step: run the full objective and requirement-by-requirement completion audit; the authorized restored-DB proof and production-baselined additive migration remain deliberately unrun.

# Previous handoff — 2026-09-13 p449 late-start and shared generator correction LOCAL

- Timestamp: 2026-09-13 13:56 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: fully replaced effective public p449. Removed universal sunset margins, fixed afternoon summit/ridge clocks and return buffer, 10:00/sunset equality, three-step clock formula and unverified nearby-forest substitution. The replacement evaluates actual trailhead entry against managing-agency control, real sunset/current conditions, reversible exits and day-of transport.
- Shared repair: the p449 gate exposed fixed 13:00, 14:00, 15:00, 90-minute, rain-percentage and one-hour sunset formulas in the common generator. Those templates were corrected, removing the repeated unsafe clock logic from 21 additional public posts instead of adding new redactions.
- Publication boundary: p449 retains exact title, category, `guide` palette, badges, slug and public count. The body explicitly rejects 10:00 as a universal danger line; human review remains pending.
- Independent review: the initial Luna mapping named the wrong effective post. After authoritative `POSTS` evidence, the same reviewer corrected its mapping and confirmed the actual fixed-rule/source matrix used here.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276/344/329/18 and the 1,305-page build passed. p449 has official sources/actual sunset/review-pending with no redaction; p425 proves the shared 15:00 text is gone.
- Side effects/rollback: local p449 rewrite, shared generator text, gates, tests, generated artifacts and docs only. No public-count change, DB, indexing, push, deployment, CMP/AdSense, transport booking or account action.
- Single next step: fully correct p335 and p407's remaining beginner distance/time promises; then rerun the completion audit against the full objective and current artifacts.

# Previous handoff — 2026-09-13 p417 winter-beginner public correction LOCAL

- Timestamp: 2026-09-13 13:50 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: fully replaced public p417 through the rewrite layer. Removed universal sunset/noon/afternoon cutoffs, fixed three-hour and 30-minute rules, low-mountain exit guarantees and blanket beginner permission. The replacement uses official controls, actual sunset, current snow/ice/wind/wetness, functional turnaround and symptom-based cold response.
- Publication boundary: p417 retains exact title, category, `winter` palette, badges, slug and public count. It does not approve a route, person, time window or traction device; human review remains pending.
- Recurrence/control repair: five winter-specific rules cover fixed turn clocks, duration/delay, low-mountain guarantee, sunset margin and beginner permission. p417 now renders without redaction, reducing fixed-rule containment to p335/p407/p449.
- Independent review: Luna(max) confirmed visible and generator-variant fixed rules plus source gaps; all are absent from the effective rewrite and locked by assertions.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276/344/329/18 and the 1,305-page build passed. Generated p417 HTML contains KNPS, KMA cold-wave, KDCA cold-health, actual-sunset and review-pending text with no redaction.
- Side effects/rollback: local p417 rewrite, gates, tests, generated artifacts and docs only. No route control, public-count change, DB, indexing, push, deployment, CMP/AdSense, medical action or account action.
- Single next step: fully correct p449's fixed sunset and adjacent duration/transport/route/safety claims; p335/p407 remain separately contained.

# Previous handoff — 2026-09-13 p414 capital-ridge public correction LOCAL

- Timestamp: 2026-09-13 13:45 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: fully replaced public p414 through the rewrite layer. Removed universal sunset, first-train, checkpoint, summit and buffer times, dawn-safety ranking and blanket beginner permission. The replacement separates the management and transit evidence for three example ridge groups, uses actual daylight/current controls and requires a reversible decision before each connection.
- Publication boundary: p414 retains exact title, category, `forest` palette, badges, slug and public count. It does not certify any route connection or timetable; human review remains pending.
- Recurrence/control repair: six rules cover fixed sunset/checkpoint/summit-buffer, dawn ranking, beginner and transit-plan patterns. p414 now renders without redaction, reducing fixed-rule containment to p335/p407/p417/p449.
- Independent review: Luna(max) confirmed the generator's hidden fixed summit/buffer variants as well as route/source risks; all are removed from the effective rewrite and locked by assertions.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276/344/329/18 and the 1,305-page build passed. Generated p414 HTML contains KNPS, Seoul Metro, TOPIS, actual-sunset and review-pending text with no redaction.
- Side effects/rollback: local p414 rewrite, gates, tests, generated artifacts and docs only. No transit booking, route control, public-count change, DB, indexing, push, deployment, CMP/AdSense or account action.
- Single next step: fully correct p417's fixed sunset and adjacent dawn/transport/route/safety claims, then p449; p335/p407 remain separately contained.

# Previous handoff — 2026-09-13 p401 Palbongsan public correction LOCAL

- Timestamp: 2026-09-13 13:40 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: fully replaced public p401 through the rewrite layer. Removed late-start safety, unsupported route/slope/beginner claims, fixed rain-drying and branded-footwear guarantees, stale admission/parking/transit details, and seasonal/age/campsite guarantees. The replacement uses Hongcheon County's dated A/B/C references, current provisional opening/entry rules, actual conditions and early 119.
- Publication boundary: p401 retains exact title, category, `valley` palette, badges, slug and public count. The current free admission and operating information is explicitly dated 2026-09-13 and requires visit-day confirmation; human review remains pending.
- Recurrence/control repair: eight p401-specific rules plus the generic branded-footwear rule cover the removed claim families. p401 now renders without redaction, reducing fixed-rule containment from six to five source-preserved posts: p335/p407/p414/p417/p449.
- Independent review: Luna(max) confirmed the route, equipment, transport, fee, facility and seasonal matrix and the Hongcheon/KMA/NFA/KDCA source boundary.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276/344/329/18 and the 1,305-page build passed. Generated p401 HTML contains the official Hongcheon guide, current free-admission statement and review-pending notice with no redaction.
- Side effects/rollback: local p401 rewrite, gates, tests, generated artifacts and docs only. No public-count change, booking, DB, indexing, push, deployment, CMP/AdSense or account action.
- Single next step: fully correct p414's fixed sunset and adjacent route/access/transport/seasonal claims, then p417/p449; p335/p407 remain separately contained.

# Previous handoff — 2026-09-13 p349 Manisan public correction LOCAL

- Timestamp: 2026-09-13 13:36 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: fully replaced public p349 through the existing rewrite layer. Separated the northern tourist-site entrance from Hamheodongcheon and Jeongsusa approaches; removed fixed transit, taxi, parking, course, sunset, terrain, footwear and crampon claims; and replaced them with current official-source checks, actual sunset/current conditions and early-119 guidance.
- Publication boundary: p349 retains exact title, category, `dawn` palette, badges, slug and public count. Current operating, admission and parking information is dated 2026-09-13 and explicitly requires a day-of recheck; human review remains pending.
- Recurrence/control repair: eight Manisan/footwear rules cover the removed claim families. The common course enhancement's fixed `일몰 2시간 전` instruction was also corrected after artifact inspection exposed it; the completed p349 render has no redaction. The widened footwear rule newly contains p401 without changing its source or public state.
- Independent review: Luna(max) confirmed trailhead conflation and the volatile transport, price, route, sunset and equipment matrix against the current Ganghwa/NFA/KMA boundary.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276/344/329/18 and the 1,305-page build passed. Generated p349 HTML contains the Ganghwa official source and no redaction; generated p401 remains redacted as intended.
- Side effects/rollback: local p349 rewrite, shared course-enhancement sentence, gates, tests, generated artifacts and docs only. No public-count change, DB, indexing, push, deployment, CMP/AdSense, transport booking or account action.
- Single next step: fully correct p401's branded-footwear safety guarantee and adjacent route/transport/seasonal claims, then p414/p417/p449 individually; p335/p407 remain separately contained.

# Previous handoff — 2026-09-13 p86 course-risk decision public correction LOCAL

- Timestamp: 2026-09-13 13:26 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: fully replaced public p86 through the existing rewrite layer. Removed unsupported accident/exertion/calorie figures, elevation-to-experience classes, fixed time and sunset multipliers, rock-ridge share/delay, rain/wind approval thresholds, predicted rescue delays and vehicle-access scoring. The replacement uses five non-compensating filters: current official route state, full-route demands, the slowest party member's function, actual sunset/current weather, and emergency/retreat limitations.
- Publication boundary: p86 retains exact title, category, `valley` palette, badges, slug and public count. It remains explicitly human-unreviewed; it does not certify fitness, route safety or rescue access.
- Recurrence/control repair: eight new rules cover accident share, elevation calories/experience, beginner time, rock-ridge share/delay, weather approval, rescue delay and vehicle access. Existing fixed sunset rules also apply. p86 now renders without redaction; the fixed-rule containment set fell from seven to six source-preserved posts.
- Independent review: Luna(max) confirmed the full threshold matrix and KNPS/KMA/NFA/CDC boundary; the implementation uses the Korean managing-agency/weather/fire subset relevant to the final claims.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276/344/329/18 and the 1,305-page build passed. Generated p86 HTML contains five official source families, stop-filter and early-119 language with no legacy threshold/redaction.
- Side effects/rollback: local p86 rewrite, gate, tests, generated artifacts and docs only. No public-count change, emergency report, DB, indexing, push, deployment, CMP/AdSense or account action.
- Single next step: fully correct p349's fixed sunset rule plus volatile route, facility, price and seasonal claims, then p414/p417/p449 individually without bulk state changes.

# Previous handoff — 2026-09-13 p75 hike-time planning public correction LOCAL

- Timestamp: 2026-09-13 13:22 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: fully replaced public p75 through the existing rewrite layer. Removed universal walking speeds, an unsupported dark-descent statistic, fixed Naismith distance/elevation output, pack/fitness adjustments, descent ratio, official-time agreement, first-visit margin, fixed sunset completion window and wind/time/exertion multipliers. The replacement uses current managing-agency data, comparable personal records, baseline/conservative ranges, actual local sunset, route-specific turnaround points and cancellation conditions.
- Publication boundary: p75 retains exact title, category, `valley` palette, badges, slug and public count. It remains explicitly human-unreviewed; estimates are not completion or safety guarantees.
- Recurrence/control repair: seven new rules cover portal/mountain speed, dark-descent statistic, Naismith adjustments, descent ratio, official-time agreement, fixed sunset completion margin and weather multiplier. Existing fixed hiking-time/sunset rules also apply. p75 now renders without redaction; the fixed-rule containment set fell from eight to seven source-preserved posts.
- Independent review: Luna(max) confirmed that p75 is a planning/calculation post rather than a winter-equipment article and verified the full formula matrix plus KNPS/KMA/NFA/CDC boundary.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276/344/329/18 and the 1,305-page build passed. Generated p75 HTML contains official sources, range planning and actual-sunset guidance with no legacy formula/redaction.
- Side effects/rollback: local p75 rewrite, gate, tests, generated artifacts and docs only. No public-count change, DB, indexing, push, deployment, CMP/AdSense or account action.
- Single next step: fully correct p86's fixed sunset and rescue-access scoring plus adjacent go/no-go thresholds, then p349/p414/p417/p449 individually without bulk state changes.

# Previous handoff — 2026-09-13 p72 lost-hiker response public correction LOCAL

- Timestamp: 2026-09-13 13:17 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: fully replaced public p72 through the existing rewrite layer. Removed unverified accident/rescue statistics, the first-five-minute rescue guarantee, fixed marker spacing, GPS/offline-map and SMS success assumptions, obsolete named 119/Forest-service app guarantees, fixed battery capacity and whistle/light discovery guarantees. The replacement uses stop-and-assess, current-hazard escape only, last-confirmed-location plus multiple clues, early 119, receipt/callback confirmation, conditional device aids and direct person-to-person trip sharing.
- Publication boundary: p72 retains exact title, category, `dawn` palette, badges, slug and public count. It remains explicitly human-unreviewed and does not promise rescue time or device/service availability.
- Recurrence/control repair: seven new gate rules cover lost-hiker statistics, first-five-minute claims, marker spacing, SMS success, obsolete automatic-return service, fixed battery capacity and light/air discovery signals. Existing named-119-app/location/whistle rules also apply. p72 now renders without redaction; the fixed-rule containment set fell from nine to eight source-preserved posts.
- Independent review: Luna(max) confirmed the full risk matrix and NFA/119/MOIS/KNPS/KMA source boundary.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276/344/329/18 and the 1,305-page build passed. Generated p72 HTML contains five official source families, early 119, callback and review-pending language with no legacy guarantee/redaction.
- Side effects/rollback: local p72 rewrite, gate, tests, generated artifacts and docs only. No public-count change, emergency report, DB, indexing, push, deployment, CMP/AdSense or account action.
- Single next step: fully correct p75's fixed sunset rule and adjacent unsupported winter-equipment/safety claims, then p86/p349/p414/p417/p449 individually without bulk state changes.

# Previous handoff — 2026-09-13 p84 general mountain-safety public correction LOCAL

- Timestamp: 2026-09-13 13:13 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: fully replaced public p84 through the existing rewrite layer. Removed unsupported accident/cause/preventability and rescue-delay statistics, fixed sunset/water/food/fitness formulas, direction-based weather prediction, categorical backtracking, location-accuracy and equipment/app guarantees. The replacement uses current official closure/weather checks, shared route/return plan, actual condition-based turnaround, individualized supplies without forced intake, stop-and-assess navigation, multiple location clues, early 119 and function/risk-based retreat.
- Shared-guide correction: the common safety guide's fixed `1~2 hours before sunset` rule was replaced with actual sunset, route, terrain, party pace, escape and current-danger guidance.
- Publication boundary: p84 retains exact title, category, `sage` palette, badges, slug and public count. It remains explicitly human-unreviewed and does not promise prevention.
- Recurrence/control repair: eight new rules cover accident statistics, preventability, solo delay, sunset timetable, food schedule, cardinal-cloud signal, lost-route percentage and fitness formula. The sunset rule initially overmatched transport times and was narrowed to explicit sunset context. It still correctly finds p75/p86/p349/p414/p417/p449; with p72/p335/p407, nine source-preserved posts now have affected blocks contained pending full correction.
- Independent review: Luna(max) confirmed the high-risk matrix and the NFA/MOIS/KMA/KNPS/KDCA source boundary.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276/344/329/18 and the 1,305-page build passed. Generated p84 HTML contains seven source families, early 119, no forced intake and functional turnaround guidance with no legacy formula/redaction.
- Side effects/rollback: local p84 rewrite, shared-guide sentence, gate, tests, generated artifacts and docs only. No public-count change, DB, indexing, push, deployment, CMP/AdSense or account action.
- Single next step: fully correct p72's obsolete named 119-app guarantee and other fixed GPS/battery/rescue claims, then work through the six newly contained sunset-rule posts without bulk state changes.

# Previous handoff — 2026-09-13 p88 119 call and location public correction LOCAL

- Timestamp: 2026-09-13 13:06 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: fully replaced public p88 through the existing rewrite layer. Removed move-before-call and injured-person relocation instructions, unsupported response/accuracy figures, fixed whistle range, named-app/device-button guarantees and prescriptive helicopter positioning. The replacement avoids only continuing immediate danger before an early 119 call, limits injured-person movement, combines location clues, follows dispatcher first-aid/callback guidance, updates unavoidable movement, treats device features as conditional and preserves battery without cutting off callbacks.
- Publication boundary: p88 retains exact title, category, `autumn` palette, badges, slug and public count. It remains explicitly human-unreviewed and does not replace 119 instructions.
- Recurrence/control repair: eight new gate rules reject move-before-call, injured-person destination, response-time, coordinate-accuracy, whistle, named-app, fixed-button and helicopter-position claims. The first regression rejected a legacy destination repeated in negative prose; wording was repaired without weakening the rule. The next run newly exposed p72's named-app guarantee, which remains source-preserved but render-contained. Current containment set is p72/p84/p335/p407.
- Independent review: Luna(max) confirmed the source risks and supplied exact current NFA/119/MOIS links used in the final rewrite.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276/344/329/18 and the 1,305-page build passed. Generated p88 HTML contains five official/medical source links, early call, no-move and movement-update boundaries with no legacy guarantee or redaction marker.
- Side effects/rollback: local rewrite, gate, tests, generated artifacts and docs only. No public-count change, emergency report, DB, indexing, push, deployment, CMP/AdSense or account action.
- Single next step: correct public p84's unsupported accident statistics, fixed water minimum and rescue-delay claims; then address newly contained p72's obsolete reporting-app guarantee.

# Previous handoff — 2026-09-13 p90 flash-flood public correction LOCAL

- Timestamp: 2026-09-13 13:00 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: fully replaced public p90 through the existing rewrite layer. Removed unsupported rainfall-to-rise, velocity/depth, fixed-height and post-rain wait formulas, universal cancellation thresholds, unsupported accident counts, ridge/rock safety absolutes and implied timer-based crossing. The replacement uses KMA alerts plus current local/KNPS closures, immediate channel evacuation, no entry into moving/rising/muddy water, stable designated high ground, immediate 119 for isolation/injury/rising water/uncertain escape, and official reopening before return.
- Publication boundary: p90 retains exact title, category, `sage` palette, badges, slug and public count. It remains explicitly human-unreviewed and does not override current authorities or responders.
- Recurrence control: eight new safety-gate rules reject fixed stream-rise, velocity, vertical-distance, rainfall-go/no-go, water-monitoring, post-rain wait, ridge-safety and warning-equals-stream-threshold claims. Identity/source/removal assertions cover the effective public post.
- Independent review: Luna(max) confirmed the high-risk claims and Korean primary-source replacement boundary. The leader corrected its one inaccurate palette observation against authoritative repository source; no palette mutation occurred.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276/344/329/18, and the 1,305-page build passed. Generated p90 HTML contains KMA/SafeKorea/NFA/KNPS sources, immediate 119, no-timed-return and ridge-warning text, with no legacy threshold or redaction placeholder.
- Side effects/rollback: local rewrite, gate, tests, generated artifacts and docs only. No public-count change, DB, indexing, push, deployment, CMP/AdSense, rescue dispatch or account action.
- Single next step: correct public p88 move-before-call and injured-person relocation guidance against current NFA/119 primary guidance while preserving identity and state.

# Previous handoff — 2026-09-13 p78 hydration and heat-illness public correction LOCAL

- Timestamp: 2026-09-13 12:56 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: fully replaced public p78 through the existing rewrite layer. Removed universal hourly/hot-weather/pre-load/total water formulas, unsupported dehydration percentages, mandatory electrolyte timing, urine/thirst diagnosis, the low-temperature reduced-sweat heatstroke test, and beverage-response restart logic. The replacement uses individualized route planning, thirst/comfort without forced intake, altered-mental-status emergency recognition, immediate 119 and cooling, safe swallowing, overdrinking/hyponatremia and rhabdomyolysis safeguards, and clinician-led return after serious illness.
- Publication boundary: p78 retains exact title, category, badges, slug and public count. It remains explicitly human-unreviewed; this is not diagnosis, treatment or individualized fluid advice.
- Recurrence/control repair: eight new gate rules reject fixed general/hot-weather/pre-load/total fluid formulas, unsupported dehydration percentages, false heatstroke criteria and duration-triggered electrolytes. The first regression run showed safe p78 negative prose matching the older mandatory-electrolyte rule and exposed p84's fixed six-hour minimum-water claim. The p78 wording was made non-triggering without weakening the gate; p84 remains newly contained, so the formula-render set is now p84/p335/p407.
- Independent review: Luna(max) independently confirmed the dangerous source claims and the KDCA/CDC replacement boundary.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276/344/329/18, and the 1,305-page build passed. Generated p78 HTML contains all three health-source families, immediate 119, safe swallowing, overdrinking and review-pending language, with no legacy formula, false threshold or redaction placeholder.
- Side effects/rollback: local rewrite, gate, tests, generated artifacts and docs only. No public-count change, DB, indexing, push, deployment, CMP/AdSense, treatment or account action.
- Single next step: correct public p90 flash-flood/valley evacuation thresholds and rescue guidance against current Korean weather/fire/park primary sources while preserving identity and state.

# Previous handoff — 2026-09-13 deterministic content-risk reranking LOCAL

- Timestamp: 2026-09-13 12:49 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: added a deterministic 344-post risk-ranking layer and generated `reports/adsense-remediation/content-risk-ranking.csv`. It separates medical/treatment, emergency/rescue, legal/regulatory, price/fee, reservation/transport, volatile operational and numeric route/safety signals, with evidence excerpts and official-link counts that never imply verification.
- Independent review: the Luna(max) read-only reviewer independently inspected remaining effective posts. Mechanical breadth puts p84 first, but claim-level severity puts p78 first because it gives fixed hydration/electrolyte volumes and an unsafe heatstroke threshold; p90 and p88 follow.
- Fresh evidence: `CONTENT_RISK_RANKING_OK posts=344 critical=47 high=171`; audit 1,276 URLs/344 posts/329 legacy signals/18 findings; TypeScript `--noEmit`; scoped `git diff --check` passed apart from the existing line-ending warning.
- Side effects/rollback: local analysis code, verifier, generated report and durable documentation only. No content/public-count, DB, indexing, push, deployment, CMP/AdSense or account change.
- Residual: this is triage rather than source/human review. Ranking patterns intentionally favor recall, so category breadth can outscore direct harm; every row remains `UNREVIEWED` and `source_verified=false`.
- Single next step: fully correct public p78 hydration, electrolyte and heat-illness guidance against current primary sources while preserving title, slug, badges, public count and explicit unreviewed state.

# Previous handoff — 2026-09-13 p180 exertional-exhaustion food public correction LOCAL

- Timestamp: 2026-09-13 12:45 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: fully replaced public p180 through the existing rewrite layer. Removed universal sugar-first/bonking diagnosis, fixed product absorption/effect durations, the 200 kcal kit and product counts, fixed water/protein/food schedules, the 20-plus-30-minute rescue delay, and the claim that ordinary water requires mandatory sugar pairing. The replacement screens heat/cold, cardiac, neurologic, hypoglycemia and hyponatremia risks before food; requires safe swallowing; adds heatstroke cooling and rhabdomyolysis evaluation; and makes restart and snack planning contextual.
- Publication boundary: p180 remains public with exact title and badges; its existing slug remains generated. This is an automated official-source correction, not diagnosis, treatment, individualized nutrition advice, or human editorial approval.
- Recurrence control: the gate rejects sugar-first diagnosis, fixed product response tables, fixed emergency-food calories, fixed food/water schedules, delayed rescue, mandatory sugar/water pairing, and fixed trail-snack schedules. The regression locks p180 identity, KDCA/CDC/MedlinePlus/AHA sources, immediate 119, safe swallowing, rhabdomyolysis and overdrinking safeguards, non-timed restart, and legacy-pattern absence.
- Independent review: the Luna(max) read-only reviewer independently confirmed all removed high-risk claims and recommended the implemented heatstroke, safe-swallowing, rhabdomyolysis, individualized hydration and no-timed-restart boundaries.
- Repair history: the first publication-safety run correctly found the blocked “물만 … 저나트륨혈증” phrase repeated in a negative FAQ. The FAQ was rewritten without retaining the dangerous shortcut; the rule was not weakened, and the rerun passed.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276 URLs/344 public posts/329 signals/18 findings, and the 1,305-page build passed. Generated p180 HTML contains all seven required source links, explicit unfinished-human-review notice, 119/safe-swallowing/rhabdomyolysis/overdrinking/non-timed-restart guidance, no removed pattern, and no redaction placeholder.
- Side effects/rollback: local rewrite, gate, tests, evidence and docs only. No public-count change, DB, indexing, push, deployment, CMP/AdSense, nutrition prescription, treatment, or account action.
- Residual: p180 remains human-unreviewed. The previously ranked p175/p77/p81/p89/p180 high-risk queue is now source-backed, but 329 broader review signals and restored-DB evidence remain unresolved.
- Single next step: rerank the remaining public review inventory for direct medical, rescue, legal, reservation, price and volatile operational claims, then correct the highest-risk source-backed slice without bulk publication-state changes.

# Previous handoff — 2026-09-13 p89 post-hike red-flags public correction LOCAL

- Timestamp: 2026-09-13 12:39 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: fully replaced public p89 through the existing rewrite layer. Removed dark urine as a standalone rhabdomyolysis discriminator, fixed 12/24/48/72-hour care gates, named-disease guessing, fixed DOMS/protein/RICE/sprain-return prescriptions, a water-plus-30-minute headache test, and a fixed tick fever/eschar gate. The replacement separates immediate cardiac/stroke/systemic 119 signals, prompt rhabdomyolysis evaluation, injury neurovascular red flags, symptom-based tick-exposure disclosure, safe swallowing, and function/clinician-led return.
- Publication boundary: p89 remains public with exact title and badges; its existing slug remains generated. This is an automated official-source correction, not diagnosis, treatment, medication advice, or human editorial approval.
- Recurrence control: the gate rejects urine-only rhabdomyolysis framing, fixed care delays, fixed protein/recovery and sprain schedules, hydration-response headache diagnosis, and rigid tick fever/eschar gates. The regression locks p89 identity, CDC/NIOSH/AHA/CDC-stroke/KDCA sources, immediate 119, safe swallowing, non-diagnostic framing, and legacy-pattern absence.
- Independent review: the Luna(max) read-only reviewer independently confirmed all removed high-risk claims and replacement boundaries against current CDC/NIOSH, CDC stroke, cardiac, tick and musculoskeletal public guidance.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276 URLs/344 public posts/329 signals/18 findings, and the 1,305-page build passed. Generated p89 HTML contains all five required source families, explicit unfinished-human-review notice, immediate-119/safe-swallowing/non-diagnostic guidance, no removed pattern, and no redaction placeholder.
- Side effects/rollback: local rewrite, gate, tests, evidence and docs only. No public-count change, DB, indexing, push, deployment, CMP/AdSense, medication, treatment, or account action.
- Residual: p89 remains human-unreviewed. Public p180 remains the next high-priority safety rewrite. 329 review signals and restored-DB evidence remain unresolved.
- Single next step: correct public p180 exertional-exhaustion recognition, nutrition, safe-swallowing and escalation guidance while preserving title, slug, badges, public count, and explicit unreviewed state.

# Previous handoff — 2026-09-13 p81 hypothermia public correction LOCAL

- Timestamp: 2026-09-13 12:33 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: fully replaced public p81 through the existing rewrite layer. Removed the unattributed fatality share, clinical temperature staging as field triage, delayed 119 split, overbroad no-movement instruction, unsupported ventricular-fibrillation explanation, and fixed layer/foil/drink performance prescriptions. The replacement uses symptom-based recognition, immediate 119, gentle shelter movement, exposure-aware wet-clothing removal, ground insulation, central warming, safe-swallowing and no-alcohol/direct-heat safeguards.
- Publication boundary: p81 remains public with exact title and badges; its existing slug remains generated. This is an automated official-source correction, not field diagnosis, treatment authorization, or human editorial approval.
- Recurrence control: the gate rejects unsupported hypothermia statistics, clinical field staging, delayed emergency calls, foil-blanket performance claims, and fixed drink/layer rules. The regression locks p81 identity, CDC/NIOSH/MedlinePlus/Red Cross sources, 119, safe swallowing, central warming, gentle movement, and legacy-pattern absence.
- Independent review: the Luna(max) read-only reviewer independently confirmed all removed claims and replacement boundaries against current CDC, CDC/NIOSH, MedlinePlus and Red Cross public guidance.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276 URLs/344 public posts/329 signals/18 findings, and the 1,305-page build passed. Generated p81 HTML contains all six required official/operational sources, explicit unfinished-human-review notice, 119/safe-swallowing/central-warming/gentle-movement guidance, no removed pattern, and no redaction placeholder.
- Side effects/rollback: local rewrite, gate, tests, evidence and docs only. No public-count change, DB, indexing, push, deployment, CMP/AdSense, treatment, or account action.
- Residual: p81 remains human-unreviewed. Public p89 and p180 remain high-priority safety rewrites. 329 review signals and restored-DB evidence remain unresolved.
- Single next step: correct public p89 post-hike red-flag and care-escalation guidance while preserving title, slug, badges, public count, and explicit unreviewed state.

# Previous handoff — 2026-09-13 p77 frostbite public correction LOCAL

- Timestamp: 2026-09-13 12:31 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: fully replaced public p77 through the existing rewrite layer. Removed fixed weather and finger-temperature thresholds, the unsupported wet-glove multiplier, field 1–4 grading, rigid rewarming temperature/time instructions, and categorical equipment rules. The replacement uses exposure-based risk, hypothermia-first assessment, medical evaluation, no-rub/no-direct-heat/no-unnecessary-walking safeguards, and rewarming only when sustained thawing without refreezing is possible.
- Publication boundary: p77 remains public with exact title and badges; its existing slug remains generated. This is an automated official-source correction, not field diagnosis, treatment authorization, or human editorial approval.
- Recurrence control: the gate rejects fixed frostbite thresholds, the wet-glove multiplier, field grading, rigid rewarming recipes, and categorical layering rules. The regression locks p77 identity, CDC/MedlinePlus/Yellow Book sources, hypothermia-first and refreezing safeguards, and removed-pattern absence.
- Independent review: the Luna(max) read-only reviewer independently confirmed the removed claims and replacement boundaries against current CDC, CDC/NIOSH, CDC Yellow Book, and CDC public guidance.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276 URLs/344 public posts/329 signals/18 findings, and the 1,305-page build passed. Generated p77 HTML contains CDC/MedlinePlus/Yellow Book/Weather/KNPS sources, the explicit unfinished-human-review notice, hypothermia-first/refreezing/no-rubbing guidance, no removed pattern, and no redaction placeholder.
- Side effects/rollback: local rewrite, gate, tests, evidence and docs only. No public-count change, DB, indexing, push, deployment, CMP/AdSense, treatment, or account action.
- Residual: p77 remains human-unreviewed. Public p81, p89 and p180 remain high-priority safety rewrites. 329 review signals and restored-DB evidence remain unresolved.
- Single next step: correct public p81 hypothermia recognition, movement, warming and evacuation guidance while preserving title, slug, badges, public count, and explicit unreviewed state.

# Previous handoff — 2026-09-13 p175 heatstroke-response public correction LOCAL

- Timestamp: 2026-09-13 12:30 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: fully replaced public p175 through the existing rewrite layer. Removed the false no-sweat heatstroke test, a universal 38°C emergency threshold, delayed 119 after a 30-minute cooling trial, categorical ice-cooling avoidance, fixed two-to-four-week return, and fixed 06:00/11:00/two-litre prescriptions. The replacement uses central nervous system changes for emergency escalation, simultaneous 119 and rapid cooling, cold/ice-water immersion when feasible, safe-swallowing restrictions, and contextual prevention/return decisions.
- Publication boundary: p175 remains public with exact title and badges; its existing slug remains generated. This is an automated official-source correction, not diagnosis, treatment, individualized hydration advice, or human editorial approval.
- Recurrence control: the gate rejects no-sweat diagnosis, fixed temperature trigger, delayed heat-illness emergency call, fixed post-heatstroke return ban, and universal summer start-time/water rules. The regression locks p175 identity, KDCA/CDC sources, sweating-can-occur, immediate 119, active cooling, safe swallowing, and removed-pattern absence. The first regression correctly found the false no-sweat wording repeated in negative prose; it was replaced with a non-repeating description and the rerun passed.
- Independent review: the existing Luna(max) read-only reviewer independently inspected p175 and current KDCA/CDC/OSHA guidance, confirming every removed high-risk pattern and the replacement emergency/cooling boundaries.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276 URLs/344 public posts/329 signals/18 findings, and the 1,305-page build passed. Generated p175 HTML contains KDCA/CDC/Yellow Book/Weather sources, sweating-can-occur, immediate 119, active cold-water cooling and the review notice, with no removed pattern or redaction placeholder.
- Side effects/rollback: local rewrite, gate, tests, evidence and docs only. No public-count change, DB, indexing, push, deployment, CMP/AdSense, hydration prescription, treatment, or account action.
- Residual: p175 remains human-unreviewed. Public p77 still includes unsupported frostbite thresholds, field grading, fixed rewarming protocol, and categorical equipment rules; p81, p89 and p180 remain high-priority safety rewrites. 329 review signals and restored-DB evidence remain unresolved.
- Single next step: correct public p77 frostbite recognition and rewarming/evacuation guidance while preserving title, slug, badges, public count, and explicit unreviewed state.

# Previous handoff — 2026-09-13 p473 hiking-headache public correction LOCAL

- Timestamp: 2026-09-13 12:21 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: fully replaced public p473 through the existing rewrite layer. Removed dehydration-first diagnosis, water-first response, the fixed 15:00 rule, delayed heat response, domestic-altitude assumptions, and SEO/itinerary filler. The replacement begins with activity stop and neurologic/head-injury screening, separates heat illness, excessive-water/hyponatremia overlap and true recent high-altitude exposure, and includes safe-swallowing and 119 rules.
- Publication boundary: p473 remains public with exact title and badges; its existing slug remains generated. This is an automated official-source correction, not diagnosis, treatment, medication advice, or human editorial approval.
- Recurrence control: the gate now also rejects headache hydration-first and fixed headache/descent-clock claims. The regression locks p473 identity, MedlinePlus and three CDC source families, 119/safe-swallowing language, and legacy filler absence. Because the complete rewrite no longer triggers the dehydration-first rule, the generic safety-redaction affected set decreased from p78/p335/p407/p473 to p78/p335/p407.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276 URLs/344 public posts/329 signals/18 findings, and the 1,305-page build passed. Generated p473 HTML contains all required sources plus review and 119 guidance, and contains no legacy patterns or redaction placeholder.
- Side effects/rollback: local rewrite, gate, tests, evidence and docs only. No public-count change, DB, indexing, push, deployment, CMP/AdSense, medication, treatment, or account action.
- Residual: p473 remains human-unreviewed. A fresh direct-treatment scan ranks p175 next because it incorrectly treats absent sweat as a defining heatstroke sign, delays 119 for some heat illness, and imposes fixed recovery/water/time rules; p77, p81, p89 and p180 also remain high-priority safety rewrites. 329 review signals and restored-DB evidence remain unresolved.
- Single next step: correct public p175 heatstroke recognition and cooling/119 guidance while preserving title, slug, badges, public count, and explicit unreviewed state.

# Previous handoff — 2026-09-13 p71 post-hike recovery public correction LOCAL

- Timestamp: 2026-09-13 12:13 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: replaced public p71 through the existing rewrite layer. Removed the universal 30-minute anabolic window, body-weight-derived and per-serving protein prescriptions, fixed contrast-bath temperatures/times/repetitions, waste/lactate-clearance claims, prescribed stretching intensity, fixed heat switching, and universal symptom-free return delay. The replacement distinguishes ordinary post-exercise soreness from injury and CDC rhabdomyolysis warning signs, uses ordinary meals and individual context, and bases return on symptoms and function.
- Publication boundary: p71 remains public with exact title and badges; its existing slug remains generated. This is an automated official-source correction, not diagnosis, treatment, individualized nutrition advice, or human editorial approval.
- Recurrence control: the gate rejects fixed post-hike anabolic-window dosing, fixed contrast-bath protocols, numeric lactate-clearance claims, and fixed soreness return delays. The regression locks p71 identity, four official source families, urgent evaluation language, and removed-pattern absence. The first regression correctly found a removed stretching percentage repeated in negative prose; that literal phrase was removed and the rerun passed.
- Independent review: the required Spark review lane failed to start because its usage quota was exhausted; the exact read-only assignment was retried once with Luna(max), which independently supported removing mandatory timing/supplement rules and adding red-flag escalation. Repository identity remained locally verified by the leader.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276 URLs/344 public posts/329 signals/18 findings, and the 1,305-page build passed. Generated p71 HTML contains CDC/NIAMS/HHS/AIS sources, the review-pending notice, and dark-urine escalation, with none of the removed formulas and no safety-redaction placeholder.
- Side effects/rollback: local rewrite, gate, tests, evidence and docs only. No public-count change, DB, indexing, push, deployment, CMP/AdSense, supplement, treatment, or account action.
- Residual: p71 remains human-unreviewed; p473 is render-contained but still needs a complete rewrite. 329 review signals and restored-DB evidence remain unresolved.
- Single next step: fully rewrite public p473's headache/dehydration guidance while preserving title, slug, badges, public count, and explicit unreviewed state.

# Previous handoff — 2026-09-13 p462 heat-illness public correction LOCAL

- Timestamp: 2026-09-13 12:04:27 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: replaced public p462 through the existing rewrite layer. Removed urine-colour go/no-go diagnosis, dehydration-first headache logic, fixed 13:00 summit and 90-minute margins, and delayed descent framing. The replacement uses KDCA/CDC guidance for immediate activity stop, shade and rapid cooling, 119 escalation for altered mental state/seizure/loss of consciousness, and no oral fluids when swallowing is unsafe.
- Publication boundary: p462 remains public with exact title and badges; its existing slug remains generated. This is an automated official-source correction, not diagnosis, treatment, or human editorial approval.
- Recurrence control: the gate rejects urine-colour hike decisions, dehydration-first headache diagnosis, and heat-illness delayed-descent patterns. The same rule now render-redacts the known p473 dehydration-first paragraph pending its complete rewrite. An initial over-broad rule crossed HTML blocks and then matched a harmless question; it was narrowed to the actual block-local `탈수 ... 먼저 보` claim and the full regression passed.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276 URLs/344 public posts/330 signals/18 findings, and the fresh 1,305-page build passed. Generated p462 HTML contains KDCA/CDC/Weather sources and the review-pending notice, with none of the removed patterns; generated p473 HTML contains the safety redaction and no blocked post-render claim.
- Side effects/rollback: local rewrite, gate, tests, evidence and docs only. No public-count change, DB, indexing, push, deployment, CMP/AdSense, treatment, or account action.
- Residual: p462 remains human-unreviewed; p473 is only render-contained and still needs a complete rewrite. 330 review signals and restored-DB evidence remain unresolved.
- Single next step: correct public p71's fixed recovery/nutrition timing while preserving title, slug, badges, public count, and explicit unreviewed state; then fully rewrite p473.

# Previous handoff — 2026-09-13 p274 backpack/back-pain public correction LOCAL

- Timestamp: 2026-09-13 11:55:05 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: replaced public p274 through the existing rewrite layer. Removed unsupported pain statistics and biomechanics multipliers, rigid pack/body-weight ratios, universal strap/position angles, fixed return-to-hiking conditions, scheduled cold-to-heat switching, fixed ibuprofen dosing, and guaranteed recovery timing. The replacement uses KDCA/NIAMS red flags, NPS capacity-based planning, product-specific fit, and symptom-led medical escalation.
- Publication boundary: p274 remains public with exact title and badges; its existing slug remains generated. This is an automated official-source correction, not treatment or human editorial approval.
- Recurrence control: the gate rejects universal pack/body-weight rules, fixed back-pain heat transitions, prescriptive ibuprofen doses, and unsupported backpack-pain prevalence claims. The regression locks p274 identity, official links, 119 guidance, and removed-claim absence.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276 URLs/344 public posts/330 signals/18 findings, and the 1,305-page build passed. Generated p274 HTML contains KDCA/NIAMS/NPS sources, the review-pending notice, and none of the removed patterns.
- Side effects/rollback: local rewrite, gate, tests, evidence and docs only. No public-count change, DB, indexing, push, deployment, CMP/AdSense, treatment, or account action.
- Residual: p274 remains human-unreviewed; 330 review signals and restored-DB evidence remain unresolved. A fresh effective-POSTS scan found no remaining explicit public medication dose, but ranked p462's urine-color/heat-illness self-diagnosis as the next highest risk, followed by p71 and p473.
- Single next step: correct public p462's heat-illness decision logic while preserving its title, slug, badges, public count, and explicit unreviewed state.

# Previous handoff — 2026-09-13 p173 hyponatremia public correction LOCAL

- Timestamp: 2026-09-13 11:50:55 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: replaced public p173 through the existing rewrite layer. Removed urine-color/skin-pinch field diagnosis, fixed fluid and electrolyte quantities, salt-water preparation, mandatory electrolyte replacement, and salt/electrolyte self-treatment followed by timed observation. The replacement explains symptom overlap, avoids forced fluids, and routes neurologic deterioration to 119.
- Publication boundary: p173 remains public with exact title and badges; its existing slug remains generated. This is an automated official-source correction, not a field diagnosis protocol or human editorial approval.
- Recurrence control: the gate rejects field salt-treatment trials, fixed salt-water mixtures, and urine/skin hydration self-diagnosis. The p173 rewrite no longer needs the generic fixed-formula render redaction; the publication-safety affected set decreased from four posts to three.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276 URLs/344 public posts/330 signals/18 findings, and the 1,305-page build passed. Generated p173 HTML contains CDC/WMS/KDCA sources, no redaction placeholder, the review-pending notice, and none of the removed dose/diagnosis patterns.
- Side effects/rollback: local rewrite, gate, tests, evidence and docs only. No public-count change, DB, indexing, push, deployment, CMP/AdSense, treatment, or account action.
- Residual: p173 remains human-unreviewed. Public p274 still contains a fixed ibuprofen dose and fixed cold-to-heat timing; 330 review signals and restored-DB evidence remain unresolved.
- Single next step: correct public p274 while preserving its title, slug, badges, public count, and explicit unreviewed state.

# Previous handoff — 2026-09-13 p82 cardiovascular-hiking public correction LOCAL

- Timestamp: 2026-09-13 11:47:17 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: replaced public p82 through the existing rewrite layer. Removed unsupported cardiac-event statistics, fixed MET/blood-pressure/elevation/distance/temperature clearance tables, scheduled hydration, and general nitroglycerin administration. The replacement uses AHA/CDC guidance for clinician-planned gradual activity, symptom-triggered stopping, and immediate 119 response.
- Publication boundary: p82 remains public with exact title and badges; its existing slug remains generated. This is an automated official-source correction, not medical clearance or human editorial approval.
- Recurrence control: the quality gate rejects fixed blood-pressure hiking clearance, generic hiking nitroglycerin administration, and fixed hydration schedules for blood-pressure/diuretic users. The regression locks p82 identity, official links, and removed-claim absence.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276 URLs/344 public posts/331 signals/18 findings, and the 1,305-page build passed. Generated p82 HTML contains AHA/CDC sources, the review-pending notice, and no removed dose/threshold pattern.
- Side effects/rollback: local rewrite, gate, tests, evidence and docs only. No public-count change, DB, indexing, push, deployment, CMP/AdSense, medication, or account action.
- Residual: p82 remains human-unreviewed. Independent review ranked public p173's salt/electrolyte self-treatment instructions as the next highest direct treatment risk; 331 review signals and restored-DB evidence remain unresolved.
- Single next step: correct public p173 using KDCA/official clinical guidance while preserving its title, slug, badges, public count, and explicit unreviewed state.

# Previous handoff — 2026-09-13 p172 altitude-illness public correction LOCAL

- Timestamp: 2026-09-13 11:42:31 +09:00.
- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: replaced public p172 through the existing rewrite layer. Removed fixed ibuprofen prevention/treatment timing, fixed descent and hydration quantities, unsupported domestic-mountain acclimatization, and domestic self-medication guidance. The replacement separates international high-altitude travel from ordinary domestic day-hike symptoms and prioritizes no further ascent, descent on worsening, and urgent response to confusion, ataxia, or rest dyspnea.
- Publication boundary: p172 remains public with its exact title and badges; its existing slug remains generated. This is an automated official-source correction, not human editorial approval.
- Recurrence control: the quality gate now rejects prescriptive altitude-illness ibuprofen schedules, domestic-hiking self-medication, and fixed high-altitude water quantities. The regression locks p172 identity, CDC links, and removed-claim absence.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276 URLs/344 public posts/331 signals/18 findings, and the 1,305-page build passed. Generated p172 HTML contains the CDC high-altitude source and no removed dose pattern.
- Side effects/rollback: local rewrite, gate, tests, evidence and docs only. No public-state count change, DB, indexing, push, deployment, CMP/AdSense, medication, or account action.
- Residual: p172 remains human-unreviewed; 331 review signals and restored-DB evidence remain unresolved.
- Single next step: continue the highest-risk public medication/treatment-timing row while preserving title, slug, badges, public count, and explicit unreviewed state.

# Previous handoff — 2026-09-13 p269 fall-response draft correction LOCAL

- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: added a conservative p269 rewrite that removes invented accident rates, fixed gait/pole angles, pole self-arrest, deliberate tree/rock collision, numeric pain thresholds, improvised knee compression, product-lifetime claims, and ibuprofen timing. The replacement emphasizes turnaround decisions, post-fall assessment, minimal movement for suspected head/spine injury, warmth, location reporting, buddy help-seeking, and 119 instructions.
- Publication boundary: p269 was non-public before this checkpoint and remains excluded from `POSTS`; title, slug source fields, category, and badges are unchanged. A dedicated assertion and artifact scan prevent accidental publication by the generic quality filter.
- Recurrence control: the gate now rejects deliberate obstacle-collision advice and forceful trekking-pole slide-arrest directions, in addition to the prior numeric pain-score rule.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276 URLs/344 public posts/331 signals/18 findings, and the 1,305-page build passed. Artifact scan: p269=0, p270=0, p261=1.
- Side effects/rollback: local draft rewrite, gate, tests, evidence and docs only. No public-state change, DB, indexing, push, deployment, CMP/AdSense, medication, or account action.
- Residual: p269/p270 are improved but human-unreviewed and non-public. The public queue still contains 331 review signals; restored DB evidence remains unavailable.
- Single next step: return to the public queue and correct the highest-risk published drug-dose/medical-treatment article while preserving all existing URLs and publication counts.

# Previous handoff — 2026-09-13 p270 ankle-injury draft correction LOCAL

- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: added a source-backed p270 rewrite that removes pain-score self-evacuation, improvised taping, universal heat-switch timing, fixed recovery claims, and unqualified drug suggestions. The replacement prioritizes protection, circulation/fracture warning signs, skin-safe cold use, cautious compression, 119 escalation, medication contraindications, and professional evaluation.
- Publication-state repair: independent review established that p270 was excluded from public `POSTS` before this checkpoint. The first long rewrite could have crossed the generic quality threshold, so its heading structure and regression were corrected to keep p270 excluded. No new article URL or generated page was created.
- Recurrence control: the quality gate now rejects fixed 48-hour cold-to-heat switches and numeric pain-score evacuation rules. The regression checks the corrected rewrite content and proves `POSTS` still excludes p270.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, audit 1,276 URLs/344 public posts/331 signals/18 findings, and the 1,305-page build passed. Artifact scan found p270GeneratedCount=0 and p261GeneratedCount=1.
- Side effects/rollback: local draft rewrite, gate, tests, evidence, and docs only. No publication-state change, DB, indexing, push, deployment, CMP/AdSense, medication, or account action.
- Residual: p270 remains human-unreviewed and non-public; p269 and other medical/safety drafts still contain unsafe instructions; 331 public signals remain.
- Single next step: correct p269's fall-response and medication guidance while preserving its current non-public state, then resume the public high-risk queue.

# Previous handoff — 2026-09-13 p261 electrolyte-prescription correction LOCAL

- Goal/state: remediation remains active and `REVIEWING`; HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, unrelated dirty work is preserved, and no external mutation occurred.
- Completed: replaced the public p261 electrolyte article through the existing `POST_REWRITES` layer. Removed unsupported sweat-loss/product/price figures, invented field-test results, universal hourly water/sodium targets, and scheduled salt-capsule dosing. The new article uses KDCA and CDC/NIOSH guidance, warns against salt-tablet self-dosing and forced overhydration, preserves the title/slug/badges, and retains the visible human-review-pending state.
- Recurrence control: the shared gate now rejects scheduled salt-capsule doses and mandatory universal electrolyte targets. The regression proves p261 remains in public `POSTS`, contains the official sources, and omits the removed prescription patterns.
- URL/inventory evidence: an initial badge change produced two additional tag URLs; it was reverted. Final audit returned to 1,276 URLs while content review signals decreased from 332 to 331. Public post count remains 344.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, remediation audit (1,276/344/331/18), and the 1,305-page production build passed. Generated p261 HTML contains KDCA/NIOSH links, no old dose pattern, and the unreviewed notice.
- Side effects/rollback: local rewrite, gate, test, evidence, and docs only. No source-row deletion, DB, indexing, push, deployment, CMP/AdSense, purchase, or account action. Revert this checkpoint's p261 rewrite/rules/tests/evidence/docs only.
- Residual: automated source correction is not human approval; 331 signaled public articles and restored-DB evidence remain unresolved.
- Single next step: continue with the next public medical article containing drug dosage or treatment-timing instructions, preserving URLs and explicit review state.

# Previous handoff — 2026-09-13 p275 emergency-transport correction LOCAL

- Goal/state: remediation remains active and `REVIEWING`; HEAD is still `7f1689273f82991210c96cf0a59506eb5aa3756a`, broad unrelated dirty work is preserved, and no external system was mutated.
- Completed: rewrote raw post `p275` to remove a false 119 ambulance fee/insurance statement plus unsupported helicopter prices, insurance premiums, rescue totals, percentages, and categorical helicopter-cost claims. The replacement distinguishes fire-service 119 transport from private ambulances, prioritizes emergency reporting, and links primary government/fire-agency guidance.
- Publication boundary: `p275` remains excluded from the public `POSTS` collection by the existing quality threshold. This is an automated official-source correction, not human approval or publication authorization.
- Recurrence control: the quality gate now blocks the removed 119 base/per-kilometre fee pattern; the regression reads raw `lib/posts.ts` as well as public posts so filtered drafts cannot bypass the check.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript `--noEmit`, remediation audit (1,276 URLs/344 public posts/332 signals/18 findings), and the 1,305-page production build passed.
- Side effects/rollback: local source, gate, test, evidence, and handoff changes only. No DB, publishing, indexing, push, deployment, CMP/AdSense, insurance, or account action. Revert only this checkpoint's p275/gate/test/evidence/doc changes.
- Residual: p275 and the other 332 signaled content rows still require human editorial disposition. Production remains unchanged; restored database truth remains unavailable.
- Single next step: continue official-source correction of the next high-risk medical/safety row, while retaining the separate restored-snapshot migration gate.

# Previous handoff — 2026-09-13 static safety-formula containment LOCAL

- Goal/state: remediation goal remains active and `REVIEWING`; HEAD still `7f1689273f82991210c96cf0a59506eb5aa3756a`, with source bodies/URLs/unrelated dirty work preserved and no external mutation.
- Completed: connected the existing blocked safety-claim rules to static blog rendering. `p78`, `p173`, `p335`, and `p407` no longer render fixed hydration formulas or source-unreviewed beginner distance/time promises. The smallest matching block is replaced before FAQ/JSON-LD extraction.
- Integrity: the sanitizer retains the original `p`, `li`, `td`, or `div` tag, preserves every href from affected source blocks, and never edits `lib/posts.ts`. Contact filtering stays separate so normal inquiries and the wildfire channel remain unaffected.
- Fresh evidence: `PUBLICATION_SAFETY_OK`, `CONTENT_SAFETY_RENDER_OK affected_posts=7`, TypeScript, and final 1,305-page build passed. Generated HTML for all four IDs contains `data-safety-claim-redacted=true`. Audit now reports 1,276 URLs/344 posts/332 signals/18 findings.
- Side effects/rollback: local render/test/report changes only; no content deletion, source rewrite, noindex, DB, indexing, push, deployment, or account action. Revert the safety sanitizer integration/tests/docs only.
- Residual: redaction prevents local public use but is not source correction or human review. Hundreds of volatile medical, transport, price, reservation, control and ordinary-contact claims remain queued and visibly unreviewed.
- Single next step: prioritize the remaining structural high-risk claims into reproducible rule groups, then verify official sources/human dispositions per URL; separately audit an authorized restored DB snapshot when available.

# Previous handoff — 2026-09-13 static blog emergency-contact containment LOCAL

- Goal/state: full remediation remains active in `REVIEWING`; no production or account mutation. `master` remains `7f1689273f82991210c96cf0a59506eb5aa3756a`; source bodies, URLs, and unrelated dirty work are preserved.
- Completed locally: added bounded semantic detection for non-119 emergency/rescue alternatives and incomplete phone placeholders. The quality gate rejects them and static blog rendering replaces only the unsafe claim block with 119/official-site guidance. All 344 posts display an honest source/human-review-pending notice.
- Scope evidence: seven current posts are affected. The original `lib/posts.ts` bodies are unchanged. Ordinary office/customer-service inquiries remain, including p201; the p268 `119 또는 ...1588-3650 신고` alternative is absent from generated HTML. Wildfire `1588-9119` is intentionally not blanket-blocked pending source review.
- Fresh validation: `CONTENT_SAFETY_RENDER_OK affected_posts=7`, `PUBLICATION_SAFETY_OK`, `PUBLICATION_POLICY_OK`, TypeScript, and final 1,305-page build passed. Generated HTML contains 344 review notices. Audit is now 1,276 URLs/344 posts/332 signals/17 findings.
- Repair evidence: first tests caught missing 4-4/placeholder formats and an unbounded whole-document context false positive; both were fixed with format alternatives and a per-number 80-character context window.
- Side effects/rollback: local render/policy/test/report changes only. No source-body edits, deletions, noindex changes, secret access, DB action, indexing, push, deployment, or account action. Revert the content-safety helper, blog integration, gate integration, verifier and docs only.
- Residual: the remaining volatile facts and ordinary contacts are not verified or corrected; the visible notice does not constitute review. Production still serves the old bundle until separately authorized deployment.
- Single next step: work through the 332-row source-review queue with official URL-level evidence, prioritizing medical/safety, transport, control, price, reservation, and contact claims; separately obtain an authorized restored DB snapshot for data/schema work.

# Previous handoff — 2026-09-13 source-snapshot-bound publication contract LOCAL

- Goal/state: full remediation goal remains active and `REVIEWING`; production/data/human-review requirements remain incomplete. `master` HEAD remains `7f1689273f82991210c96cf0a59506eb5aa3756a`, with unrelated dirty work preserved.
- Completed this checkpoint: automatic publication now requires a positive approval revision and exact current/approved source snapshot hash equality in addition to source check and real human approval. A behavioral matrix covers route/non-route visibility, disputed/stale/non-human evidence, status/index/ad separation, GPX, changed source, and missing revision.
- Prepared but not applied: review-only schema definitions for route source IDs/timestamps, immutable page approval revisions, a unique KST daily run ledger, and provider-specific retryable indexing outbox. No migration was generated because the existing `drizzle/0000` is an unsafe full-schema baseline.
- Fresh evidence: `PUBLICATION_STATE_MATRIX_OK`, `PUBLICATION_POLICY_OK`, `PUBLICATION_CLAIM_OK`, `npx tsc --noEmit`, and a 1,305-page `next build` passed. The first typecheck caught one closing-token typo; it was repaired before the successful rerun.
- Side effects/rollback: local code/test/docs only; no secrets, database reads/writes, migration generation/application, publishing, indexing, push, deployment, or account action. Revert this checkpoint's policy/schema/test/doc diff only; never reset the dirty worktree.
- Residual: current production schema has none of these new fields/tables and both publishers remain fail-closed. Atomic daily allocation/outbox retry integration needs an authorized restored snapshot. Content review remains 0/344 human-verified with 332 signals.
- Single next step: obtain an authorized consistent isolated snapshot and run the read-only restored audit, then create and prove only an additive migration against that snapshot.

# Previous handoff — 2026-09-13 10:39 KST executable data-source state proof LOCAL

- Goal: continue the supplied remediation prompt without production, database, indexing, deployment, or account mutation.
- Exact state: `master` remains at `7f1689273f82991210c96cf0a59506eb5aa3756a`; broad pre-existing and task dirty work remains preserved. Goal Harness remains `REVIEWING`, not done.
- Completed this checkpoint: extracted dependency-injected hub loading and a shared database-only crawler-publication predicate. Hub behavior now has executable coverage for no configuration/no DB calls, legitimate empty/no stats call, mountain-query failure, stats-query failure, and successful DB mapping. Detail success/miss/outage/partial behavior remains executable too.
- Changed files this checkpoint: `lib/hub-data-loader.ts`, `lib/data-source-publication.ts`, `lib/db/queries.ts`, sitemap and three structured-data pages, two new verification scripts, `package.json`, and local evidence/handoff reports.
- Fresh evidence: `HUB_DATA_LOADER_OK`, `DATA_SOURCE_PUBLICATION_OK`, `DATA_SOURCE_STATE_OK`, `MOUNTAIN_DATA_LOADER_OK`; eight existing focused suites passed; `npx tsc --noEmit` passed; audit remains 1,276 URLs/344 posts/332 signals/16 findings; final `next build` compiled, linted/typechecked, and generated 1,305 pages.
- Side effects/rollback: local code/report changes only. No secret read, DB write/migration, publish/index request, push/deployment, CMP/AdSense/account action. Roll back only this checkpoint's listed files; do not reset the dirty worktree.
- Residual risks: fallback detail URLs intentionally retain 200/canonical pending record-level review. Configured hub query failure still displays explicit uncached static fallback rather than throwing, preserving availability but not ISR last-known-good. Production truth and additive migration remain unproven without an authorized consistent restored snapshot.
- Single next step: run `npm run audit:restored-db -- --sqlite <absolute-restored.db> --out <private-report.json>` on an authorized isolated restored snapshot, then baseline an additive-only migration; do not apply the generated full-schema `0000` baseline.

# Previous handoff — 2026-09-13 P0 safety, route exposure, and auto-publish containment LOCAL

- Goal: execute the supplied remediation master prompt while preserving URLs, tracker records, source data, and existing dirty work.
- Baseline: `master` at `7f1689273f82991210c96cf0a59506eb5aa3756a`; live 93 mountains/344 posts, local no-credential fallback 16 mountains/344 posts. Production and local counts are deliberately separated.
- Confirmed P0: live safety guide exposes unverified `1588-3018` plus fixed safety thresholds; live Jirisan detail turns a 0.8 km `고동산구간` source row into easiest/beginner whole-route guidance and GPX badges.
- Completed locally: safety copy and fixed-formula repair; shared safety/publication/route/index/ad predicates; raw route promotion and misleading mountain metadata suppressed; cron and IndexNow auth fail closed; IndexNow URLs are same-host/bounded; one scheduled publisher owner plus transactional conditional per-page claims/logs; a 344-row review worksheet with explicit unreviewed/evidence fields; monetization excludes utility/noindex/404 screens; crawler, title, structured-date, SearchAction, guide navigation, llms count, and ambiguous list-count defects repaired; restored-DB audit and additive evidence-schema definitions added; `dulle_done_v1` read/write is centralized and storage failures no longer break toggles.
- Fresh evidence: latest audit covers 1,276 URLs, 344 posts, 332 review signals, and 16 findings. The URL count dropped by exactly the 16 static fallback mountains because the current run did not establish database source state and sitemap discovery now fails closed for those entries. Nine focused policy/audit/storage/claim/inventory/data-source suites plus existing hub tests and `npx tsc --noEmit` pass. Source-state snapshots distinguish DB, no-config, empty, outage, missing-record, and partial-course states; synthetic fallback IDs cannot attach unrelated DB courses. Fallback/partial screens omit data-derived JSON-LD. Final build generated 1,305 pages.
- Changed task files include guide/mountain/home/publish surfaces, `lib/db/queries.ts`, `lib/quality-gate.ts`, `lib/publication-policy.ts`, `lib/mountain-content.ts`, audit/test scripts, package scripts, reports/docs/harness files. Pre-existing dirty files remain preserved.
- Side effects: no secrets read, no DB write or applied migration, no publish/index notification, no deployment/push, no AdSense/CMP/account action. Reports and Drizzle output are local review artifacts only.
- Risk/rollback: production still exposes P0 until a reviewed isolated release is deployed. The generated Drizzle `0000` is a full-schema baseline and explicitly must not be applied to an existing DB. Revert only task-owned diff; do not reset the dirty worktree.
- Single next step: run `audit:restored-db` on an authorized isolated restored snapshot, then baseline that schema and generate an additive-only migration for page-state wiring, a unique KST daily-run ledger, approval revisions, atomic batch allocation, and a retryable indexing outbox. Current per-page claim proof does not establish daily/batch idempotency.
- The legacy mountain-content audit now aborts on fallback, partial, or mismatched detail provenance instead of combining synthetic fallback IDs with live course rows.

# Previous handoff — 2026-09-08 truthful sitemap freshness LOCAL

- Post-release: focused commit `7f1689273f82991210c96cf0a59506eb5aa3756a` is on remote `master`; same-SHA Vercel Production deployment `6320187744` succeeded at `2026-09-08T03:43:05Z`.
- Public serialized sitemap is HTTP 200 with 1,369 URLs: 344 real post dates retained and 1,025 non-post URLs omit `lastmod`. Sample home/blog/mountains/data-license entries have no synthetic date; sampled articles retain their dated values.
- This post-release note is local-only and intentionally does not trigger a documentation-only deployment. Existing unrelated dirty work remains preserved.
- Goal: continue the DAU-ranked non-READY AdSense improvement workflow with a source-backed SEO correction; no approval prediction or account action.
- Source gate: primary `master` and `origin/master` both equal `d1fc68f63f97f595364d9d6ab0a999c34edd5b99`. Existing dirty content, package, UI, generated, browser, and build-info files are preserved and excluded.
- Defect: `app/sitemap.ts` assigned the sitemap generation timestamp to every static, tag, mountain, guide, category, and filler URL, representing unchanged pages as freshly modified.
- Repair: those URLs omit optional `lastModified`; published blog entries retain the actual `getPostModifiedDate(p)` value derived from updated/published/source dates.
- Intended release files: `app/sitemap.ts`, `scripts/verify-sitemap-lastmod.mjs`, and this handoff only.
- Tests-first evidence: the new regression failed on `const NOW` before repair, then passed. Existing route-metric, distance-SQL, and rendered-card regressions pass; TypeScript passes; final local build compiles and renders 1,305 pages; diff check passes. The build includes pre-existing dirty content, so exact hosted build remains the release gate.
- Independent review: GO. Next 14 sitemap types make `lastModified` optional; narrow compatibility risk only. Test is source-text based, so public serialized XML must be checked after deployment.
- Side effects: no database, collection, content publishing, account/CMP, AdSense submission, indexing notification, dependency, or direct Vercel mutation. Attempted isolated worktree creation was denied twice by the repository hook and created nothing; work continued in non-overlapping clean files.
- Rollback: revert the focused release commit; no data/account rollback is required.
- Single next step: exact-three-file commit and push, then same-SHA CI/deployment and public sitemap serialization checks.

# Current handoff — 2026-09-07 route summary clarity LOCAL

- Goal: ten-site AdSense quality improvement; selected Dullegilgogo defect is misleading route summaries, not a proven Google rejection reason.
- Canonical lsk7209/dulekil master d635d287fb07a5be0be79dd3b757d8cb498c1804 equals localHEAD, GitHub Vercel success. Primary has prior dirty guide/data-license/tracker/footer/posts/buildinfo plus generated phase6j/pnpm lock; preserve all. No new checkout.
- Independent Luna sampled home, Garisan detail, tracker, data-license (last extraction unavailable). Confirmed home ?:?? and missing-route mismatch with detail. Main found SQL MIN(distance)/MAX(duration_up) paired as generic distance/time and null distance default5km. Short0.1km is not proven corrupt; may be source segment.
- Selected local implementation: hub-route-metrics.ts + test; queries nullable distance/no invented5; two card surfaces label minimum recorded distance/maximum ascent time with whole-trip warning, unknown sorts last. No DB write/backfill or source value correction.
- Fresh test HUB_ROUTE_METRICS_OK. Typecheck cannot yet run: local TypeScript dependency absent; npx --no-install tsc found wrong cached command. No typecheck/build/runtime claim. package-lock.json exists; dependency restore is next safe prerequisite.
- Pending design review: static fallback metrics are editorial estimates, not SQL aggregates; current generic aggregate labels must distinguish fallback provenance before release. Also check positive-only aggregate semantics and all nullable consumers. No commit/push/deployment.
- Update: npm ci declared lock dependencies completed391packages; pure tests and actual tsc noEmit passed. Terra identified filler sort/list consumers; fixed lib/fillers-static.ts and app/list/[slug]/page.tsx too. Static fallback now has explicit provenance and reference labels; DB cards retain aggregate labels. Real0/0.1 distance preserved; negative/nonfinite rejected.
- Update2026-09-07: first no-DB build passed1305pages, but it includes pre-existing dirty content and compiled before the final negative-distance SQL correction. It is not clean-release/current-final-build proof. npm lint prompted for missing config, so not counted as lint success; explicit scoped ESLint check follows.
- Terra found MIN(distance) could let negative row hide valid3km; now SQL excludes negative before MIN. In-memory SQLite test imports the exact expression from queries and passes mixednegative/valid, allmissing, zero/short cases. HUB_DISTANCE_SQL_OK, HUB_ROUTE_METRICS_OK, HUB_CARD_RENDER_OK all pass; rendered home/mountain fixtures prove missing labels and static provenance, no nullkm/?:??.
- Additional task test files: scripts/verify-hub-card-render.tsx and scripts/verify-hub-distance-sql.mjs. No DB credentials used; in-memory database only. Final browser/build/release-source isolation remain pending. No commit/push.
- Scoped lint resolved without config mutation: ESLint8 Node API useEslintrc:false + overrideConfig extends next/core-web-vitals on six changed runtime files passed0errors/0warnings. Earlier unsupported CLI extend/extends attempts failed and were superseded. Final tsc noEmit also passed.
- Final local build25826 passed1305pages with final SQL correction and no DB credentials.390/1280 production browser /mountains displays reference labels with no overflow; missing DB states covered by React render + in-memory SQL tests, not production data manipulation.
- Terra base comparison confirms ten-file allowlist is self-contained against d635d28; no dependency on prior dirty content. Local full build includes prior dirty content, so exact commit hosting build remains an independent required release check.
- Risk notice: confirmed site-fix normal Git push only of five existing runtime files, helper, three tests, and this handoff. Exclude prior dirty files and browser output. Targeted commit revert is rollback. No database, review submission or Vercel mutation.
- Next: normal exact-file commit/push then verify hosting exact-SHA build and live DB-backed labels. Owned server23276 port3243 and browser adsense-dulle close after public proof.
