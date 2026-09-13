# ACCEPTANCE

## Feature Criteria

| Criteria | Status | Evidence |
|---|---|---|
| Known unsafe emergency number cannot pass the publication gate | PASS | `PUBLICATION_SAFETY_OK` |
| Short trail segment is not described as a verified whole/beginner route | PASS (local) | `PUBLICATION_POLICY_OK`; detail copy/labels |
| Unverified GPX does not receive a detail badge | PASS (local) | strict `canOfferGpx`; regression test |
| Full DB/list/route/content remediation is complete | FAIL/PENDING | no authorized consistent DB snapshot; 332 review signals |
| Production public pages reflect changes | FAIL/PENDING | no deployment performed |

## User Flow Criteria

| Criteria | Status | Evidence |
|---|---|---|
| Legal, tracker, and 404 screens do not load local monetization elements | PASS (local) | `MONETIZATION_POLICY_OK`; Playwright DOM checks |
| Safety guide renders without the known false rescue number | PASS (local) | Playwright safety-guide check |
| Missing URL returns 404 | PASS (local) | Playwright `/does-not-exist` returned HTTP 404 |
| Existing tracker storage contract survives malformed/denied/quota storage | PASS (local) | `COMPLETION_STORAGE_OK`; `dulle_done_v1` key and name-array format unchanged |

## Stability And Error Handling

| Criteria | Status | Evidence |
|---|---|---|
| Missing cron secret fails closed | PASS | `PUBLICATION_POLICY_OK` |
| Invalid route slug cannot become indexing URL | PASS | malformed and encoded traversal tests |
| Short positive segment is retained as review data | PASS | `DATA_AUDIT_OK` |
| Restored production data passes audit | PENDING | no authorized consistent snapshot |

## Documentation Criteria

- PASS: baseline, plan, inventory, backup/restore, readiness, next-actions, and durable handoff exist.
- PASS: unsafe full-schema Drizzle baseline is explicitly marked `DO NOT APPLY`.

## Final Report Requirements

- implementation summary
- changed files
- validation level
- commands run
- acceptance status
- known limitations
- how to run

Current final state remains pending because source/human review and restored-data proof are incomplete.
