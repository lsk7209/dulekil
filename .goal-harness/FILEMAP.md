# FILEMAP

## Existing Files

| File | Role | Notes |
|---|---|---|
| `app/guide/[slug]/page.tsx` | public safety/guide content | fixed unsupported numeric claims |
| `app/mountains/[slug]/page.tsx` | mountain detail and metadata | segment-not-route containment |
| `app/api/cron/*`, `scripts/publish/drip-feed.ts` | automated operations | fail-closed auth/publication |
| `app/sitemap.ts`, `app/robots.ts`, `app/layout.tsx` | SEO and monetization boundaries | visibility integration still pending DB evidence |
| `lib/db/schema.ts`, `lib/db/queries.ts` | data model/query layer | additive evidence design; existing IDs preserved |
| `lib/posts.ts` | 344 code-backed posts | pre-existing dirty/generated content preserved |

## New Files

| File | Role | Notes |
|---|---|---|
| `lib/publication-policy.ts` | shared evidence/publication predicates | route and page gates separated |
| `lib/data-audit.ts` | pure restored-data validation | no writes |
| `lib/monetization-policy.ts` | route-level ad eligibility | utility/trust screens excluded |
| `components/monetization-layer.tsx` | client route-aware monetization | no script on excluded paths |
| `scripts/audit-adsense-remediation.ts` | repeatable inventories/findings | structural audit, not human source review |
| `scripts/audit-restored-db.ts` | read-only isolated SQLite audit | authorized snapshot required |
| `docs/adsense-remediation/*` | baseline/plan/recovery | no secrets |
