# Additive migration evidence — 2026-09-13

## Scope

The migration in `drizzle/additive/0001_validation_publication_control.sql` adds validation and publication-control structures to the restored production schema. It does not recreate, alter, delete, or populate the 11 existing application tables. The paired rollback file removes only the ten newly added tables.

This checkpoint used a disposable copy of the private authorized snapshot. No statement was sent to the remote Turso database.

## Fresh verification

- Command: `pnpm test:additive-migration -- --sqlite D:\private-backups\dullegilgogo\dullegilgogo-20260913T062917Z.db`
- Result: `ADDITIVE_MIGRATION_OK existing_tables=11 added_tables=10 schema_gaps=0`
- Existing-table row counts were identical before migration, after migration, and after rollback.
- After migration, all ten new tables existed, `PRAGMA integrity_check` returned `ok`, `PRAGMA foreign_key_check` returned zero rows, and the data audit returned zero `SCHEMA_GAP` findings.
- After rollback, all ten new tables were absent, existing-table counts remained identical, and integrity remained `ok`.
- The source snapshot SHA-256 remained `2ceb1ea5958572ad0f0ae9e38c7b50beb5f39127445d9a658e35858b31da802d`.
- TypeScript `--noEmit` and `pnpm lint` passed after the verifier repair.

## Remaining data findings

The migration fixes structure only. It does not validate or rewrite the 7,787 GPX flags and does not resolve the 658 short-segment review signals. Challenge memberships, hiking routes, evidence, reviews, approvals, runs, and outbox rows remain empty until source reconciliation and human review occur.

## Release boundary

Remote application requires separate explicit authority, a fresh remote backup, an exact migration target check, and a rehearsed rollback window. The full-schema `drizzle/0000` baseline must not be applied to this production schema.
