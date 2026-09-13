# PLAN

## Classification

- Size: large
- Domain Profile: adsense-audit

## Phase 1

- Objective: Establish a reproducible baseline without modifying production or discarding dirty work.
- Tasks: inspect repository/handoff, map data and publication paths, reproduce current public P0s, create URL/content/data inventories.
- Expected Files: `docs/adsense-remediation/00-baseline.md`, `reports/adsense-remediation/*`.
- Completion Criteria: repository/stack/counts/limitations and issue dispositions are evidence-backed.
- Test Point: `npm run audit:remediation` and live read-only samples.
- Rollback/Recovery: reports are local artifacts; regenerate rather than mutate source data.

## Phase 2

- Objective: Contain unsafe and unverified public claims and prevent automated recurrence.
- Tasks: repair safety copy, label source segments honestly, suppress route-level/GPX promotion, fail-close cron/publication/auth, scope monetization to content screens.
- Expected Files: guide/mountain/publisher/layout policies plus focused verification scripts.
- Completion Criteria: known unsafe numbers/formulas and unreviewed whole-route claims fail policy tests and representative local rendering.
- Test Point: publication safety/policy, monetization, data-audit, TypeScript, browser smoke.
- Rollback/Recovery: revert only task-owned files; preserve original data, URLs, and `dulle_done_v1` records.

## Phase 3

- Objective: Prepare evidence-backed data remediation and an auditable continuation path.
- Tasks: add read-only restored-DB audit, additive schema design, backup/restore procedure, readiness and next-action reports; baseline a restored snapshot before any deployable migration.
- Expected Files: `lib/data-audit.ts`, `scripts/audit-restored-db.ts`, schema review artifacts, final reports and handoff.
- Completion Criteria: safe local work is verified; external/production/human-review dependencies are explicitly blocked with exact next commands.
- Test Point: data fixtures, final production build, diff check, restored snapshot audit when authorized data exists.
- Rollback/Recovery: never apply the generated full-schema baseline; restore into a new isolated database and retain the old database.
