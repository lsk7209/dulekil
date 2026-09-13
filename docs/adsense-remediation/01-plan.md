# Remediation Plan

1. P0 containment: remove unsupported emergency/safety claims, block their re-entry at the shared quality gate, label source rows as trail segments, and suppress GPX unless a strict file/evidence contract is met.
2. Data evidence: acquire an authorized consistent DB snapshot; dry-run identity/list/coordinate/route validation; design the minimum additive evidence and review-state migration; never join by name alone.
3. Surface consistency: apply the central policy to home, hub, detail, list, tracker, metadata, JSON-LD, sitemap, and ads eligibility with regression tests.
4. Content review: work through `content-inventory.csv`, prioritizing safety and volatile claims. KEEP/REVISE/MERGE_CANDIDATE/HOLD_FOR_REVIEW/RETIRE_CANDIDATE decisions require URL-level evidence and never trigger automatic deletion/noindex.
5. Trust and technical verification: reconcile privacy/analytics/affiliate behavior, current-month copy, navigation, 404/canonical/robots/ads.txt, mobile and accessibility. Separate local proof from live deployment proof.
6. Release preparation: build, browser-smoke representative routes, prepare exact apply/rollback steps, then stop before production DB/deployment/account mutations unless separately authorized.
