# TESTS

## Required Checks

- Run/start: local Next dev server on `127.0.0.1:3213` (PASS in latest checkpoint).
- Lint: Next build integrated lint/type validation (PASS); standalone `next lint` is not configured non-interactively.
- Typecheck: `npx tsc --noEmit`.
- Unit tests: publication safety/policy, monetization policy, data audit, hub metrics/SQL/render checks.
- Build: `npm run build`.
- Smoke test: Playwright CLI on privacy, safety guide, tracker, mountain detail, and missing URL.
- Domain-specific validation: `npm run audit:remediation`; restored DB audit remains pending an authorized snapshot.

## Error And Edge Cases

- missing cron secret and `Bearer undefined`
- malformed/encoded traversal publication slugs
- fixed safety formulas and unverified emergency numbers
- unverified/expired/disputed/non-human review evidence
- legal/tracker/404 monetization exclusion
- invalid coordinates, orphan courses, negative metrics, short positive segments, bad GPX URLs

## User Scenario Tests

- Safety guide shows 119-oriented official-check guidance without the known false number.
- Jirisan does not show a GPX badge or promote a segment as a whole beginner route.
- Privacy/tracker/404 render without AdSense or affiliate elements; content guide retains the monetization layer.

## Completion Checklist

- [x] Available local checks have been run or marked N/A with reasons.
- [x] Failed checks have been fixed or documented as blocked.
- [x] Acceptance criteria have matching evidence.
