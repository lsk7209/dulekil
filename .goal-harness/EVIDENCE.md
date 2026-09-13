# EVIDENCE

### 2026-09-13 production-baselined additive migration rehearsal

| Check | Result | Evidence |
|---|---|---|
| additive apply | PASS | disposable snapshot copy gained ten validation/publication-control tables |
| preservation | PASS | all 11 existing-table row counts unchanged; integrity ok; zero FK violations |
| schema audit | PASS | `schema_gaps=0` after apply; GPX and short-segment findings deliberately remain data-review work |
| rollback | PASS | ten added tables removed; original counts and integrity preserved |
| source immutability | PASS | snapshot SHA-256 remains `2ceb1ea5958572ad0f0ae9e38c7b50beb5f39127445d9a658e35858b31da802d` |
| static checks | PASS | TypeScript `--noEmit`; `pnpm lint` |
| remote mutation | NONE | migration executed only against an OS-temp copy |

### 2026-09-13 authorized read-transaction snapshot and restored audit

| Check | Result | Evidence |
|---|---|---|
| authorized DB probe | PASS | read-only metadata connection; SQLite 3.47.0; 11 application tables; no credential output |
| private snapshot | PASS | 2,019,328 bytes; SHA-256 `2ceb1ea5958572ad0f0ae9e38c7b50beb5f39127445d9a658e35858b31da802d`; outside repository |
| consistency | PASS | 2,227 mountains, 7,787 courses, 260 trails; integrity ok, zero FK violations, all table counts match |
| restored audit | FINDINGS | 8,447 total: 7,787 GPX errors, 658 short-segment reviews, two schema gaps; exit 2 is expected |
| audit output contract | PASS | console now emits counts only; full record detail remains in the private JSON report |
| remote mutation | NONE | remote statements were schema/row SELECTs inside one read transaction |

### 2026-09-13 restored-DB audit executable regression

| Check | Result | Evidence |
|---|---|---|
| local snapshot discovery | NONE | no `.db`, `.sqlite`, or `.sqlite3` snapshot; no DB env names/files; independent Luna review agrees |
| Turso CLI availability | UNAVAILABLE | `Get-Command turso` returned `TURSO_CLI_MISSING` |
| `pnpm test:restored-db-audit` | PASS | `RESTORED_DB_AUDIT_OK`; disposable SQLite schema, real CLI report, integrity/counts, absolute-path rejection, cleanup |
| `pnpm lint`; TypeScript | PASS | no lint warnings/errors; no TypeScript diagnostics |
| production/restored truth | BLOCKED | no authorized consistent snapshot; synthetic fixture is explicitly not production evidence |

### 2026-09-13 requirement completion audit and fresh full local verification

| Check | Result | Evidence |
|---|---|---|
| 15 package verifier scripts | PASS | publication safety/policy/claim, data audit/source/publication/state, content inventory/ranking/render, mountain/hub loaders, indexing, monetization and completion storage all passed freshly |
| `pnpm lint` | PASS after repair | added existing-dependency ESLint config; moved BlogClient `useEffect` before an early return; no warnings/errors |
| SEO and auxiliary data checks | PASS | SEO 344/344 with 0 findings/warnings; hub card/distance/route metrics and sitemap lastmod checks passed |
| `pnpm exec tsc --noEmit`; `pnpm build` | PASS | no diagnostics; build compiled and generated 1,305 pages |
| local HTTP smoke | PASS | representative routes 200; missing route 404/noindex; false rescue and ad client absent; local server stopped and port closed |
| `pnpm audit:mountains` | BLOCKED as designed | aborted `mountain source state=static-no-config`, exit 2; no restored/live data claim |
| completion matrix | RECORDED | `docs/adsense-remediation/36-completion-audit.md` maps prompt requirements to proof and remaining authority/data boundaries |

### 2026-09-13 p335/p407 final fixed-route containment corrections

| Check | Result | Evidence |
|---|---|---|
| Independent review | PASS | Luna(max) confirmed p335 identity and transport/time/heritage/equipment risks; leader independently reviewed p407 access/route/transport/seasonal risks |
| `pnpm test:publication-safety` | PASS | `PUBLICATION_SAFETY_OK`; both identities and official-source boundaries locked; fixed-rule redaction set is empty |
| `pnpm test:content-safety-render` | PASS | `CONTENT_SAFETY_RENDER_OK affected_posts=7` (separate emergency-contact containment) |
| `pnpm exec tsc --noEmit` | PASS | no diagnostics |
| `pnpm audit:remediation` | PASS | 1,276 URLs, 344 public posts, 329 review signals, 18 findings; risk levels 53 critical/144 high/133 medium/14 low remain triage-only |
| `pnpm build` | PASS | compiled, typechecked and generated 1,305 pages |
| generated p335/p407 HTML | PASS | official sources and human-review-pending text present; no safety redaction or selected legacy claims |

### 2026-09-13 p449 and shared generated-time correction

| Check | Result | Evidence |
|---|---|---|
| Independent review correction | PASS | initial Luna generator index conflicted with authoritative effective POSTS; rerun confirmed actual p449 identity and fixed clock/source matrix |
| First/second regression discoveries | PASS | numeric negative prose was removed without weakening the gate; shared 15:00 rule across 21 posts was repaired in the generator rather than added to containment |
| `pnpm test:publication-safety` | PASS | `PUBLICATION_SAFETY_OK`; p449 identity/multi-source/actual-daylight/enhanced-body safety locked; containment fell to p335/p407 |
| `pnpm test:content-safety-render` | PASS | `CONTENT_SAFETY_RENDER_OK affected_posts=7` |
| `pnpm exec tsc --noEmit` | PASS | no diagnostics |
| `pnpm audit:remediation` | PASS | 1,276 URLs, 344 public posts, 329 review signals, 18 findings; risk levels 52 critical/144 high/134 medium/14 low remain triage-only |
| `pnpm build` | PASS | compiled, typechecked and generated 1,305 pages |
| generated p449/p425 HTML | PASS | p449 has multi-source/actual sunset/review pending and no redaction; p425 has safe shared replacement, no old 15:00 text and no redaction |

### 2026-09-13 p417 winter-beginner public correction

| Check | Result | Evidence |
|---|---|---|
| Independent official-source review | PASS | Luna(max) confirmed fixed sunset/noon/afternoon/duration/delay variants, low-mountain guarantee and insufficient source scope |
| `pnpm test:publication-safety` | PASS | `PUBLICATION_SAFETY_OK`; p417 identity, official sources, actual daylight and enhanced-body safety are locked; containment fell to p335/p407/p449 |
| `pnpm test:content-safety-render` | PASS | `CONTENT_SAFETY_RENDER_OK affected_posts=7` |
| `pnpm exec tsc --noEmit` | PASS | no diagnostics |
| `pnpm audit:remediation` | PASS | 1,276 URLs, 344 public posts, 329 review signals, 18 findings; risk levels 54 critical/166 high/110 medium/14 low are triage-only |
| `pnpm build` | PASS | compiled, typechecked and generated 1,305 pages |
| generated p417 HTML | PASS | KNPS, KMA cold-wave, KDCA cold-health, actual-sunset and human-review-pending text present; no safety-redaction marker |

### 2026-09-13 p414 capital-ridge public correction

| Check | Result | Evidence |
|---|---|---|
| Independent official-source review | PASS | Luna(max) confirmed fixed sunset/checkpoint/summit/buffer variants, route conflation and inadequate source scope |
| `pnpm test:publication-safety` | PASS | `PUBLICATION_SAFETY_OK`; p414 identity, multi-authority sources, actual daylight and enhanced-body safety are locked; containment fell to p335/p407/p417/p449 |
| `pnpm test:content-safety-render` | PASS | `CONTENT_SAFETY_RENDER_OK affected_posts=7` |
| `pnpm exec tsc --noEmit` | PASS | no diagnostics |
| `pnpm audit:remediation` | PASS | 1,276 URLs, 344 public posts, 329 review signals, 18 findings; risk levels 53 critical/166 high/111 medium/14 low are triage-only |
| `pnpm build` | PASS | compiled, typechecked and generated 1,305 pages |
| generated p414 HTML | PASS | KNPS, Seoul Metro, TOPIS, actual-sunset and human-review-pending text present; no safety-redaction marker |

### 2026-09-13 p401 Palbongsan public correction

| Check | Result | Evidence |
|---|---|---|
| Independent official-source review | PASS | Luna(max) confirmed the branded-footwear, route, transport, fee, facility and seasonal claim matrix |
| `pnpm test:publication-safety` | PASS | `PUBLICATION_SAFETY_OK`; p401 identity, official source, dated operating facts and enhanced-body safety are locked; containment fell to p335/p407/p414/p417/p449 |
| `pnpm test:content-safety-render` | PASS | `CONTENT_SAFETY_RENDER_OK affected_posts=7` |
| `pnpm exec tsc --noEmit` | PASS | no diagnostics |
| `pnpm audit:remediation` | PASS | 1,276 URLs, 344 public posts, 329 review signals, 18 findings; risk levels 52 critical/166 high/112 medium/14 low remain triage-only |
| `pnpm build` | PASS | compiled, typechecked and generated 1,305 pages |
| generated p401 HTML | PASS | official Hongcheon guide, current free admission and human-review-pending text present; no safety-redaction marker |

### 2026-09-13 p349 Manisan public correction

| Check | Result | Evidence |
|---|---|---|
| Independent official-source review | PASS | Luna(max) confirmed trailhead conflation and volatile transit, price, route, sunset and equipment claims against Ganghwa/KMA/NFA sources |
| `pnpm test:publication-safety` | PASS | `PUBLICATION_SAFETY_OK`; p349 identity, official sources, dated recheck and fully enhanced-body safety are locked; p401 is newly contained |
| `pnpm test:content-safety-render` | PASS | `CONTENT_SAFETY_RENDER_OK affected_posts=7` |
| `pnpm exec tsc --noEmit` | PASS | no diagnostics |
| `pnpm audit:remediation` | PASS | 1,276 URLs, 344 public posts, 329 review signals, 18 findings |
| `pnpm build` | PASS | compiled, typechecked and generated 1,305 pages |
| generated p349/p401 HTML | PASS | p349 contains the official Ganghwa source and no safety-redaction marker; p401 still contains a redaction marker as intended |

## Validation Level

Level: 4 (local browser and API smoke; no production or restored-real-data proof)

## Commands Run

| Command | Result | Notes |
|---|---|---|
| pnpm test:publication-safety | PASS | p86 identity/five source families/stop filters/early 119/removal matrix locked; containment now p335,p349,p407,p414,p417,p449 |
| pnpm test:content-safety-render | PASS | CONTENT_SAFETY_RENDER_OK affected_posts=7 |
| pnpm exec tsc --noEmit | PASS | no diagnostics after p86 rewrite and recurrence rules |
| pnpm audit:remediation | PASS | 1276 URLs, 344 posts, 329 legacy signals, 18 findings after p86 correction |
| pnpm build | PASS | compiled, typechecked and generated 1305 pages after p86 correction |
| generated p86 HTML inspection | PASS | KNPS/reservation/Forest/KMA/NFA, non-compensating stop filters and review notice present; legacy thresholds/redaction absent |
| pnpm test:publication-safety | PASS | p75 identity/five source families/range planning/actual sunset/removal matrix locked; containment now p86,p335,p349,p407,p414,p417,p449 |
| pnpm test:content-safety-render | PASS | CONTENT_SAFETY_RENDER_OK affected_posts=7 |
| pnpm exec tsc --noEmit | PASS | no diagnostics after p75 rewrite and recurrence rules |
| pnpm audit:remediation | PASS | 1276 URLs, 344 posts, 329 legacy signals, 18 findings after p75 correction |
| pnpm build | PASS | compiled, typechecked and generated 1305 pages after p75 correction |
| generated p75 HTML inspection | PASS | KNPS/reservation/KMA/NFA/CDC, ranges, actual sunset and review notice present; legacy formulas/redaction absent |
| pnpm exec tsx scripts/verify-publication-safety.ts | PASS | p72 identity/five source families/early 119/callback and removal matrix locked; containment now p75,p86,p335,p349,p407,p414,p417,p449 |
| pnpm exec tsx scripts/verify-content-safety-render.ts | PASS | CONTENT_SAFETY_RENDER_OK affected_posts=7 |
| pnpm exec tsc --noEmit | PASS | no diagnostics after p72 rewrite and recurrence rules |
| pnpm audit:remediation | PASS | 1276 URLs, 344 posts, 329 legacy signals, 18 findings after p72 correction |
| pnpm build | PASS | compiled, typechecked and generated 1305 pages after p72 correction |
| generated p72 HTML inspection | PASS | NFA/119/MOIS/KNPS/KMA, early 119, callback and review notice present; legacy guarantees/redaction absent |
| pnpm test:publication-safety | PASS | p84 identity/seven source families/early 119/no forced intake/functional return locked; containment p72,p75,p86,p335,p349,p407,p414,p417,p449 |
| pnpm test:content-safety-render | PASS | CONTENT_SAFETY_RENDER_OK affected_posts=7 |
| pnpm audit:remediation | PASS | 1276 URLs, 344 posts, 329 legacy signals, 18 findings after p84/shared-guide correction |
| pnpm build | PASS | compiled, typechecked and generated 1305 pages after p84/shared-guide correction |
| generated p84 HTML inspection | PASS | NFA/MOIS/KMA/KNPS/Forest/KDCA/CDC and review notice present; legacy statistics/formulas/redaction absent |
| pnpm test:publication-safety | PASS | p88 identity, five source families, early call/no move/location update and removed guarantees locked; containment p72,p84,p335,p407 |
| pnpm test:content-safety-render | PASS | CONTENT_SAFETY_RENDER_OK affected_posts=7 |
| pnpm audit:remediation | PASS | 1276 URLs, 344 posts, 329 legacy signals, 18 findings after p88 rewrite |
| pnpm build | PASS | compiled, typechecked and generated 1305 pages after p88 rewrite |
| generated p88 HTML inspection | PASS | NFA/119/MOIS/KNPS/MedlinePlus, early call, no move, location update and review notice present; legacy/redaction absent |
| pnpm test:publication-safety | PASS | p90 identity, four official source families, immediate 119/no-crossing/no-timed-return and removed thresholds locked |
| pnpm test:content-safety-render | PASS | CONTENT_SAFETY_RENDER_OK affected_posts=7 |
| pnpm audit:remediation | PASS | 1276 URLs, 344 posts, 329 legacy signals, 18 findings after p90 rewrite |
| pnpm build | PASS | compiled, typechecked and generated 1305 pages after p90 rewrite |
| generated p90 HTML inspection | PASS | KMA/SafeKorea/NFA/KNPS, immediate 119, ridge warning and official return condition present; thresholds/redaction absent |
| pnpm test:publication-safety | PASS | p78 identity/sources/emergency/safe-swallowing/overdrinking locked; formula containment now p84,p335,p407 |
| pnpm test:content-safety-render | PASS | CONTENT_SAFETY_RENDER_OK affected_posts=7 |
| pnpm audit:remediation | PASS | 1276 URLs, 344 posts, 329 legacy signals, 18 findings; p78 removed from top-risk candidates |
| pnpm build | PASS | compiled, typechecked and generated 1305 pages after p78 rewrite |
| generated p78 HTML inspection | PASS | official links, review notice, immediate 119, safe swallowing and overdrinking present; legacy formulas/threshold and redaction absent |
| pnpm test:content-risk-ranking | PASS | CONTENT_RISK_RANKING_OK; all 344 effective posts ranked deterministically, 47 CRITICAL and 171 HIGH |
| pnpm audit:remediation | PASS | 1276 URLs, 344 posts, 329 legacy signals, 18 findings; generated content-risk-ranking.csv |
| pnpm exec tsc -- --noEmit | PASS | no diagnostics after ranking implementation |
| harness-init.py | PASS | size=large, domain=adsense-audit, created=2026-09-13T08:42:32+09:00 |
| npm run audit:remediation | PASS | 1292 sitemap-derived URLs, 344 posts, 332 review signals, 4 findings |
| npm run test:publication-safety | PASS | PUBLICATION_SAFETY_OK |
| npm run test:publication-policy | PASS | PUBLICATION_POLICY_OK |
| npx tsc --noEmit | PASS | no diagnostics |
| existing hub regression commands | PASS | HUB_ROUTE_METRICS_OK, HUB_DISTANCE_SQL_OK, HUB_CARD_RENDER_OK |
| npm run build | PASS | compiled, typechecked, generated 1305 static pages |
| npm run test:data-audit | PASS | DATA_AUDIT_OK; includes short-positive-segment retention and structural error fixtures |
| npm run build | PASS | final post-auth/URL-policy build compiled and generated 1305 pages |
| npm run test:monetization-policy | PASS | MONETIZATION_POLICY_OK; content-only/noindex-aware policy |
| npm run test:indexing-boundaries | PASS | INDEXING_BOUNDARIES_OK; auth, URL, robots, metadata, navigation, llms contracts |
| Playwright CLI against local next dev | PASS | privacy/tracker/404/unknown tag excluded ads; guide retained ads; safety/Jirisan/title checks passed |
| unauthenticated local POST /api/indexnow | PASS | HTTP 401 and no external request path reached |
| local GET /robots.txt | PASS | HTTP 200; Googlebot and ad crawlers explicitly disallow /api/ |
| npm run audit:remediation | PASS | refreshed 1292 URLs, 344 posts, 332 signals, 15 findings |
| npm run build | PASS | latest final build compiled, linted/typechecked, generated 1305 pages |
| git diff --check | PASS | no whitespace errors; CRLF conversion warnings only |
| pnpm test:publication-safety | PASS | p172 remains public with exact title/badges, two official CDC links, and no removed medication/hydration patterns |
| pnpm test:content-safety-render | PASS | CONTENT_SAFETY_RENDER_OK affected_posts=7; bounded sanitizer set unchanged |
| pnpm exec tsc -- --noEmit | PASS | p172 rewrite, rules, and regression have no diagnostics |
| pnpm audit:remediation | PASS | 1276 sitemap URLs, 344 public posts, 331 conservative signals, 18 findings |
| pnpm build | PASS | compiled, typechecked, generated 1305 pages; p172 artifact contains CDC source and no removed dose pattern |
| pnpm test:publication-safety | PASS | p82 remains public with exact title/badges, AHA/CDC links, and no removed clearance/dose patterns |
| pnpm test:content-safety-render | PASS | CONTENT_SAFETY_RENDER_OK affected_posts=7 after p82 rewrite |
| pnpm exec tsc -- --noEmit | PASS | p82 rewrite, rules, and regression have no diagnostics |
| pnpm audit:remediation | PASS | 1276 sitemap URLs, 344 public posts, 331 conservative signals, 18 findings |
| pnpm build | PASS | compiled, typechecked, and generated 1305 pages; p82 artifact contains AHA/CDC sources and review-pending notice |
| pnpm test:publication-safety | PASS | p173 identity/sources/119 response locked; fixed-formula redaction set decreased to p78/p335/p407 |
| pnpm test:content-safety-render | PASS | CONTENT_SAFETY_RENDER_OK affected_posts=7; contact sanitizer behavior unchanged |
| pnpm exec tsc -- --noEmit | PASS | p173 rewrite, rules, and regression have no diagnostics |
| pnpm audit:remediation | PASS | 1276 sitemap URLs, 344 public posts, 330 conservative signals, 18 findings |
| pnpm build | PASS | generated 1305 pages; p173 artifact has CDC/WMS/KDCA sources, no removed patterns or redaction placeholder, and review-pending notice |
| pnpm test:publication-safety | PASS | p274 exact identity, KDCA/NIAMS/NPS links, 119 escalation, and removed-claim absence locked |
| pnpm test:content-safety-render | PASS | CONTENT_SAFETY_RENDER_OK affected_posts=7 after p274 rewrite |
| pnpm exec tsc -- --noEmit | PASS | p274 rewrite, rules, and regression have no diagnostics |
| pnpm audit:remediation | PASS | 1276 sitemap URLs, 344 public posts, 330 conservative signals, 18 findings |
| pnpm build | PASS | generated 1305 pages; p274 artifact has all official sources, no removed patterns, and review-pending notice |
| effective POSTS medication/treatment scan | PASS | no remaining explicit public medication dose; next risk order is p462, p71, p473 based on self-diagnosis and fixed treatment timing |
| pnpm test:publication-safety | PASS after repair | p462 identity/sources/119 response locked; p473 dehydration-first paragraph redacts; initial cross-block and harmless-question matches were narrowed to the actual block-local claim |
| pnpm test:content-safety-render | PASS | CONTENT_SAFETY_RENDER_OK affected_posts=7 after p462 rewrite |
| pnpm exec tsc -- --noEmit | PASS | p462 rewrite, rules, and regression have no diagnostics |
| pnpm audit:remediation | PASS | 1276 sitemap URLs, 344 public posts, 330 conservative signals, 18 findings |
| pnpm build and artifact inspection | PASS | generated 1305 pages; p462 has KDCA/CDC/Weather sources and no legacy patterns; p473 has a redaction marker and no blocked post-render claim |
| p71 independent review lane | PASS with model fallback | Spark failed from usage quota; the identical read-only assignment ran once on Luna(max) and supported removing mandatory timing/supplement rules plus adding red-flag escalation |
| pnpm test:publication-safety | PASS after repair | p71 identity, four official source families, urgent evaluation, and removed formulas locked; first run exposed a legacy percentage repeated in negative prose and the literal was removed |
| pnpm test:content-safety-render | PASS | CONTENT_SAFETY_RENDER_OK affected_posts=7 after p71 rewrite |
| pnpm exec tsc -- --noEmit | PASS | p71 rewrite, rules, and regression have no diagnostics |
| pnpm audit:remediation | PASS | 1276 sitemap URLs, 344 public posts, 329 conservative signals, 18 findings |
| pnpm build and p71 artifact inspection | PASS | generated 1305 pages; CDC/NIAMS/HHS/AIS sources, dark-urine escalation, and review notice present; legacy formulas and redaction placeholder absent |
| pnpm test:publication-safety | PASS | p473 identity, MedlinePlus/CDC sources, 119/safe-swallowing response, and removed-pattern absence locked; generic redaction set decreased to p78/p335/p407 |
| pnpm test:content-safety-render | PASS | CONTENT_SAFETY_RENDER_OK affected_posts=7 after p473 rewrite |
| pnpm exec tsc -- --noEmit | PASS | p473 rewrite, rules, and regression have no diagnostics |
| pnpm audit:remediation | PASS | 1276 sitemap URLs, 344 public posts, 329 conservative signals, 18 findings |
| pnpm build and p473 artifact inspection | PASS | generated 1305 pages; all required sources, 119, and review notice present; dehydration-first/fixed-clock/SEO patterns and redaction placeholder absent |
| effective POSTS direct-treatment scan | PASS | p175 ranked next for false no-sweat heatstroke recognition, delayed emergency response, and fixed recovery/water/time prescriptions; p77/p81/p89/p180 remain queued |
| p175 independent official-source review | PASS | Luna(max) confirmed the false no-sweat/38 C/delayed-call/cooling-avoidance/fixed-return/prevention patterns and immediate 119 plus active-cooling replacement boundaries |
| pnpm test:publication-safety | PASS after repair | p175 identity, KDCA/CDC sources, sweating-can-occur, immediate 119, active cooling, safe swallowing, and removed patterns locked; first run removed a false rule repeated in negative prose |
| pnpm test:content-safety-render | PASS | CONTENT_SAFETY_RENDER_OK affected_posts=7 after p175 rewrite |
| pnpm exec tsc -- --noEmit | PASS | p175 rewrite, rules, and regression have no diagnostics |
| pnpm audit:remediation | PASS | 1276 sitemap URLs, 344 public posts, 329 conservative signals, 18 findings |
| pnpm build and p175 artifact inspection | PASS | generated 1305 pages; KDCA/CDC/Yellow Book/Weather, sweating-can-occur, immediate 119, active cold-water cooling and review notice present; legacy patterns and redaction absent |
| pnpm test:publication-safety | PASS | p261 remains public with KDCA/NIOSH sources and without old salt-capsule/hourly sodium prescriptions; recurrence patterns reject representative unsafe claims |
| pnpm test:content-safety-render | PASS | CONTENT_SAFETY_RENDER_OK affected_posts=7; existing emergency-contact containment remains intact |
| pnpm exec tsc -- --noEmit | PASS | p261 rewrite, gate, and verifier have no TypeScript diagnostics |
| pnpm audit:remediation | PASS | 1276 URLs and 344 posts preserved; review signals reduced from 332 to 331; findings remain 18 |
| pnpm build | PASS | electrolyte-correction build compiled, typechecked, and generated 1305 pages |
| generated p261 HTML inspection | PASS | KDCA and NIOSH links present; removed dose patterns absent; visible unreviewed notice present |
| pnpm test:publication-safety | PASS | p270 rewrite contains NIAMS/NHS sources, omits old pain-score/heat-switch/drug instructions, and remains excluded from public POSTS |
| pnpm audit:remediation | PASS | publication inventory unchanged at 1276 URLs/344 posts/331 signals/18 findings |
| pnpm build and artifact scan | PASS | 1305 pages generated; p270GeneratedCount=0 and p261GeneratedCount=1 |
| pnpm test:publication-safety | PASS | p269 rewrite contains NPS/NHS evidence, omits collision/pole-arrest/pain-score/drug instructions, and remains outside public POSTS |
| pnpm build and artifact scan | PASS | 1305 pages generated; p269=0, p270=0, p261=1; public inventory unchanged |
| npm run test:hub-data-loader | PASS | HUB_DATA_LOADER_OK; no-config performs no DB reads, empty skips stats, list/stats failures are uncached fallback, success stays database-backed |
| npm run test:data-source-publication | PASS | DATA_SOURCE_PUBLICATION_OK; only the database state permits data-derived JSON-LD and sitemap discovery |
| npm run test:data-source-state; npm run test:mountain-data-loader; npx tsc --noEmit | PASS | DATA_SOURCE_STATE_OK, MOUNTAIN_DATA_LOADER_OK, no TypeScript diagnostics |
| focused safety/publication/data/monetization/indexing/storage/claim/inventory suites | PASS | all eight existing suites rerun after hub-loader extraction |
| npm run audit:remediation | PASS | 1276 URLs, 344 posts, 332 review signals, 16 findings |
| npm run build | PASS | 2026-09-13 10:39 KST final build compiled, linted/typechecked, and generated 1305 pages |
| npm run test:publication-state-matrix | PASS | PUBLICATION_STATE_MATRIX_OK; route/non-route, stale/disputed/non-human, status/index/ad, GPX, snapshot mismatch, and approval revision states exercised |
| npm run test:publication-policy; npm run test:publication-claim | PASS | strengthened approval snapshot contract retains prior safety and per-page atomic claim coverage |
| npx tsc --noEmit | PASS | initial run exposed and repaired one schema-table closing-token typo; rerun completed with no diagnostics |
| npm run build | PASS | 2026-09-13 post-publication-contract build compiled, linted/typechecked, and generated 1305 pages |
| npm run test:content-safety-render | PASS after repair | CONTENT_SAFETY_RENDER_OK affected_posts=7; first two runs exposed unsupported 4-4/placeholder formats and an unbounded-context false positive, both repaired |
| npm run test:publication-safety; npm run test:publication-policy; npx tsc --noEmit | PASS | render-time contact policy also protects new publication inputs; no diagnostics |
| npm run build | PASS | post-content-safety build compiled, linted/typechecked, and generated 1305 pages |
| generated blog HTML inspection | PASS | all 344 HTML files contain unreviewed notice; p268 omits unsafe 1588-3650 alternative and contains redaction notice; p201 ordinary customer-service inquiry remains |
| npm run test:publication-safety | PASS | all four current static fixed-formula/beginner-claim posts sanitize to zero blocked rules; source bodies and all href values remain unchanged |
| npm run test:content-safety-render; npx tsc --noEmit | PASS | contact containment remains intact and no TypeScript diagnostics |
| npm run build plus p78/p173/p335/p407 artifact inspection | PASS | final 1305-page build; all four generated HTML files contain tag-valid safety-redaction markers before FAQ extraction |
| npm run test:indexing-boundaries | PASS | missing dynamic tags now emit noindex/nofollow and clear inherited canonical metadata |
| npm run build | PASS | final post-tag-metadata build compiled, typechecked, and generated 1305 pages |
| npm run test:monetization-policy | PASS | Google loaders require explicit CMP-ready flag and service IDs; privacy names verified affiliate measurement fields |
| consent diagnose JSON parse | PASS | version-3 local readiness report is valid JSON and keeps account/CMP state unknown |
| generated HTML loader sample | PASS | home, safety guide, and privacy HTML contain neither GA nor AdSense loader URL with current default environment |
| npm run build | PASS | final consent-gated build compiled, typechecked, and generated 1305 pages |
| npm run test:data-source-state | PASS | distinguishes fallback/partial states, requires uncached fallback notices, and prevents detail pages from independently loading courses by synthetic fallback ID |
| npx tsc --noEmit | PASS | post-data-source changes have no diagnostics |
| npm run build | PASS | post-source-state/structured-data/sitemap build compiled, typechecked, and generated 1305 pages |
| npm run audit:remediation | PASS | latest run: 1276 URLs, 344 posts, 332 signals, 16 findings; 16 fallback mountain sitemap entries correctly absent without database state |
| npm run test:data-source-state; npx tsc --noEmit | PASS | audit path also rejects non-database or cross-identity detail state; no diagnostics |
| npm run test:completion-storage | PASS | COMPLETION_STORAGE_OK; exact key/format, malformed reads, denied/quota writes |
| npm run build | PASS | post-storage final build compiled and generated 1305 pages |
| npm run test:publication-claim | PASS | PUBLICATION_CLAIM_OK; one raw conditional update wins and both publisher paths use transactional conditional claims/logs; does not prove daily-run idempotency |
| npm run test:content-review-inventory | PASS | CONTENT_REVIEW_INVENTORY_OK; 344 rows remain explicitly unreviewed with empty evidence/reviewer fields |
| npm run build | PASS | post-claim/review-inventory build compiled, typechecked, and generated 1305 pages |
| git diff --check | PASS | no whitespace errors; CRLF conversion warnings only |

## Test Results

| Test | Result | Notes |
|---|---|---|

## Failed Checks

- Initial `audit:remediation` failed because top-level await was incompatible with the CJS transform; wrapped execution in `main()` and reran successfully.
- First local `next start` smoke launch failed at Windows process creation before the server started; no runtime smoke claim is made. Build and static-render tests are the strongest current substitutes.
- First TypeScript run after adding the review-only publication tables found `TS1005` at the `publication_runs` declaration; the extra closing token was removed and the full typecheck/build then passed.
- Initial contact-render verifier failed twice: the detector missed 4-4/placeholder phone formats, then whole-document context incorrectly associated ordinary office numbers with distant emergency text. Format alternatives and an 80-character per-number context window repaired both defects.
- The first p261 rewrite changed badges and increased the URL inventory from 1276 to 1278 by creating two tag URLs. Original badges were restored; the final audit returned to 1276 URLs.
- The first p270 rewrite was long enough to risk crossing the generic publication-quality threshold even though p270 was previously non-public. Heading structure and the verifier were corrected before final validation; p270 remains absent from `POSTS` and build artifacts.
- The first p172 regression matched a negative example explaining that a prior acclimatization claim was invalid. The legacy phrase was removed entirely and the full focused verification then passed.

## Fixes Applied

## Completion Evidence

### 2026-09-13 p180 exertional-exhaustion food public correction

| Check | Result | Evidence |
|---|---|---|
| Independent official-source review | PASS | Luna(max) confirmed removal of sugar-first/bonking assumptions, product/calorie/water timers and delayed restart; heatstroke, safe-swallowing, rhabdomyolysis and individualized hydration guardrails matched implementation |
| first `pnpm test:publication-safety` | EXPECTED FAIL, REPAIRED | gate found the blocked water/hyponatremia shortcut retained in a negative FAQ; FAQ was rewritten and the rule was preserved |
| final `pnpm test:publication-safety` | PASS | `PUBLICATION_SAFETY_OK`; p180 identity, sources, emergency/differential/safe-swallowing guidance and legacy-pattern absence are locked |
| `pnpm test:content-safety-render` | PASS | `CONTENT_SAFETY_RENDER_OK affected_posts=7` |
| `pnpm exec tsc -- --noEmit` | PASS | no diagnostics |
| `pnpm audit:remediation` | PASS | 1,276 URLs, 344 public posts, 329 review signals, 18 findings |
| `pnpm build` | PASS | compiled, typechecked and generated 1,305 pages |
| generated p180 HTML | PASS | KDCA, CDC/NIOSH, Yellow Book, MedlinePlus, AHA and CDC stroke links; unfinished-human-review notice; 119/safe-swallowing/rhabdomyolysis/overdrinking/non-timed-restart guidance; no legacy patterns or redaction marker |

### 2026-09-13 p89 post-hike red-flags public correction

| Check | Result | Evidence |
|---|---|---|
| Independent official-source review | PASS | Luna(max) confirmed removal of diagnostic shortcuts, fixed care timers, nutrition/recovery formulas and hydration-response testing; action-first official guardrails matched implementation |
| `pnpm test:publication-safety` | PASS | `PUBLICATION_SAFETY_OK`; p89 identity, sources, emergency/rhabdomyolysis/safe-swallowing guidance and legacy-pattern absence are locked |
| `pnpm test:content-safety-render` | PASS | `CONTENT_SAFETY_RENDER_OK affected_posts=7` |
| `pnpm exec tsc -- --noEmit` | PASS | no diagnostics |
| `pnpm audit:remediation` | PASS | 1,276 URLs, 344 public posts, 329 review signals, 18 findings |
| `pnpm build` | PASS | compiled, typechecked and generated 1,305 pages |
| generated p89 HTML | PASS | CDC/NIOSH rhabdo, AHA, CDC stroke and KDCA sources; unfinished-human-review notice; immediate-119/safe-swallowing/non-diagnostic guidance; no legacy patterns or redaction marker |

### 2026-09-13 p81 hypothermia public correction

| Check | Result | Evidence |
|---|---|---|
| Independent official-source review | PASS | Luna(max) confirmed removal of field staging, delayed escalation and unsupported equipment/warming figures; CDC/NIOSH/MedlinePlus/Red Cross replacement guardrails matched implementation |
| `pnpm test:publication-safety` | PASS | `PUBLICATION_SAFETY_OK`; p81 identity, sources, 119, safe swallowing, central warming, gentle movement and legacy-pattern absence are locked |
| `pnpm test:content-safety-render` | PASS | `CONTENT_SAFETY_RENDER_OK affected_posts=7` |
| `pnpm exec tsc -- --noEmit` | PASS | no diagnostics |
| `pnpm audit:remediation` | PASS | 1,276 URLs, 344 public posts, 329 review signals, 18 findings |
| `pnpm build` | PASS | compiled, typechecked and generated 1,305 pages |
| generated p81 HTML | PASS | CDC, NIOSH, MedlinePlus, Red Cross, Weather and KNPS sources; unfinished-human-review notice; 119/safe-swallowing/central-warming/gentle-movement guidance; no legacy patterns or redaction marker |

### 2026-09-13 p77 frostbite public correction

| Check | Result | Evidence |
|---|---|---|
| Independent official-source review | PASS | Luna(max) confirmed removal of fixed thresholds, multiplier, field grading and rigid rewarming; CDC/NIOSH/Yellow Book replacement guardrails matched the implementation |
| `pnpm test:publication-safety` | PASS | `PUBLICATION_SAFETY_OK`; p77 identity, sources, hypothermia/refreezing/no-rubbing guidance and legacy-pattern removal are locked |
| `pnpm test:content-safety-render` | PASS | `CONTENT_SAFETY_RENDER_OK affected_posts=7` |
| `pnpm exec tsc -- --noEmit` | PASS | no diagnostics |
| `pnpm audit:remediation` | PASS | 1,276 URLs, 344 public posts, 329 review signals, 18 findings |
| `pnpm build` | PASS | compiled, typechecked and generated 1,305 pages |
| generated p77 HTML | PASS | CDC, MedlinePlus, Yellow Book, Weather and KNPS sources; unfinished-human-review notice; hypothermia-first/refreezing/no-rubbing guidance; no legacy patterns or redaction marker |
