# Baseline — 2026-09-13

- Repository: `E:\web\dullegilgogo`, branch `master`, baseline commit `7f1689273f82991210c96cf0a59506eb5aa3756a`.
- Existing dirty work was present in guide/data-license/tracker/footer/posts/generated/build artifacts and is preserved. This task also modifies `app/guide/[slug]/page.tsx`, `app/mountains/[slug]/page.tsx`, `lib/mountain-content.ts`, `lib/quality-gate.ts`, `package.json`, and adds audit/policy/test/report files.
- Stack: Next.js 14.2, React 18, TypeScript, Drizzle ORM, libSQL/Turso-compatible schema. npm lockfile is canonical in Git; an untracked pnpm lockfile predates this task.
- Content: `lib/posts.ts` exports 344 currently eligible posts. Local no-credential DB fallback exposes 16 static mountains; the live home observed 93 mountains and 344 posts. These are environment-specific counts, not official-list truth.
- Data model: `mountains`, `courses`, `trails`, `pages`, `fillers`, `evergreens`, `hubs`, and publish/checkpoint tables in `lib/db/schema.ts`. The current `courses` table represents source trail rows but lacks complete route identity, ordered segments, endpoints/direction, claim evidence, source-check state, and human review state.
- Publishing: `/api/cron/publish` and `scripts/publish/drip-feed.ts` promote `quality_passed` pages. `lib/quality-gate.ts` was the shared prepublication gate but previously checked presentation/length rather than dangerous claims.
- Surfaces: home/mountain hub use `getMountainsForHub`; mountain detail uses raw course rows through `lib/mountain-content.ts`; tracker is localStorage-based; blog is code-backed; sitemap combines routes, posts, tags, categories, mountains, guides, and list pages.
- Live P0 reproduction: `/guide/safety-checklist` exposed `산악구조대 1588-3018` and unsupported fixed thresholds. `/mountains/지리산` treated a 0.8 km row named `고동산구간` as the easiest/beginner route for Jirisan. Home still says `이 달의 능선 · 6월` on 2026-09-13.
- Official safety evidence: 119 Safety Report Center describes 119 rescue and emergency medical activity. No official basis for presenting `1588-3018` as the mountain rescue emergency number was confirmed.
- Local inventory: `npm run audit:remediation` generated 1,292 sitemap-derived URLs, 344 content rows, and 332 conservative safety/volatile-fact review signals. A signal is not a factual error or deletion decision.
- Backup boundary: no production DB credentials were read and no DB write, migration, publish, deployment, indexing submission, or AdSense action ran. A consistent authorized DB snapshot is still required before data correction/backfill.

## Risk notice

This phase changes local display and prepublication behavior only. Production data mutation and bulk publication-state changes remain blocked without a consistent snapshot, dry-run diff, rollback artifact, and explicit authority. Rollback is a focused revert of task-owned files; pre-existing dirty files must not be reset.
