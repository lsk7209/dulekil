# Content risk ranking evidence — 2026-09-13

## Scope and boundary

- Ranked all 344 effective public `POSTS` locally; no publication state, source body, database, index, deployment, or account was changed.
- The report is triage, not source verification or human editorial approval. Every row remains `UNREVIEWED` and `source_verified=false`; an official-domain link count is only an observable signal.

## Implementation

- `lib/content-review-risk.ts` defines deterministic categories and weighted claim patterns for medical/treatment, emergency/rescue, legal/regulatory, price/fee, reservation/transport, volatile operations, and numeric route/safety claims.
- `scripts/audit-adsense-remediation.ts` now writes `reports/adsense-remediation/content-risk-ranking.csv` with score, level, categories, evidence excerpt, matched-rule count, and official-link count.
- `scripts/verify-content-risk-ranking.ts` locks full 344-row coverage, unique identities, deterministic ordering, review-state honesty, category coverage, and actionable medical/rescue detection.

## Fresh validation

- `pnpm test:content-risk-ranking` — PASS: `CONTENT_RISK_RANKING_OK posts=344 critical=47 high=171`.
- `pnpm audit:remediation` — PASS: 1,276 URLs, 344 posts, 329 legacy signals, 18 findings; generated the ranked CSV and top-candidate summary.
- `pnpm exec tsc -- --noEmit` — PASS.
- `git diff --check -- ...` — PASS for the ranking implementation and generated report; only the repository's existing `package.json` LF-to-CRLF warning appeared.

## Independent review and disposition

- A Luna(max) read-only reviewer independently ranked remaining effective posts after excluding already corrected IDs.
- The mechanical score ranks broad multi-category p84 first, while the reviewer ranks p78 first because it directly prescribes fixed water/electrolyte volumes and uses an unsafe heatstroke threshold. The next correction target is therefore p78; scores support triage but do not replace claim-level judgment.
