# Database backup and restore procedure

This procedure is prepared but was not executed in this worktree. It requires an authorized Turso CLI session and creates a new isolated database for restore verification; it never restores over production.

The local audit executable is regression-tested with a disposable synthetic SQLite fixture via `pnpm test:restored-db-audit`. That test proves absolute-path enforcement, integrity/count reporting, schema-gap handling, report writing, and temporary-file cleanup. It does not prove any production row, backup consistency, or hosted restore.

## Preconditions

- Resolve the exact production database name from the authorized operator environment without copying credentials into the repository or logs.
- Create a private backup directory outside the repository and restrict access to the operator account.
- Record the baseline commit, UTC timestamp, schema table list, and row counts before any later write.

## Consistent logical dump

From an authorized shell, replace the placeholders locally:

```powershell
$DullegilDbName = '<authorized-database-name>'
$DullegilBackupDir = '<private-absolute-backup-directory>'
$DullegilStamp = Get-Date -AsUTC -Format 'yyyyMMddTHHmmssZ'
$DullegilDump = Join-Path $DullegilBackupDir "dullegilgogo-$DullegilStamp.sql"
turso db shell $DullegilDbName .dump > $DullegilDump
Get-FileHash -Algorithm SHA256 -LiteralPath $DullegilDump
```

Do not treat a remote SQLite file copy as a consistent backup. Turso documents `.dump` for rebuilding a database. `turso db export` may lag the latest changes, so it is not the preferred proof for this operation.

## Isolated restore proof

Creating a hosted test database is an external mutation and must only be run with explicit authority. The supported shape is:

```powershell
$DullegilRestoreDb = "dullegilgogo-restore-$DullegilStamp"
turso db create $DullegilRestoreDb --from-dump $DullegilDump --wait
turso db shell $DullegilRestoreDb "PRAGMA integrity_check;"
turso db shell $DullegilRestoreDb "SELECT name FROM sqlite_schema WHERE type='table' ORDER BY name;"
```

Compare table-by-table row counts against the source snapshot. `PRAGMA integrity_check` and matching counts are required before the snapshot can be called restore-verified.

## Application validation

- Point only an isolated local process at the restored database using temporary session-scoped environment variables.
- Run `npm run audit:remediation`, focused data audits, typecheck, build, and representative local browser flows.
- Never commit the restored URL/token or dump. Never place the dump under `public`, `.next`, `output`, or `reports`.

## Rollback design for later data repairs

- Every repair tool defaults to dry-run and requires explicit target record IDs plus `--apply`.
- Save before/after values and an inverse SQL file beside the private snapshot.
- Apply to the isolated restore first. Production application remains a separate authorized action.
- For a production error, stop writers and create a new database from the pre-change source/time or dump; do not destroy the old database during initial recovery.

## Local migration artifact warning

The repository had no prior Drizzle migration history. Therefore the locally generated `drizzle/0000_cultured_betty_brant.sql` is a full-schema baseline, not an additive production migration. It is explicitly marked `DO NOT APPLY` and is retained only for schema review. A deployable migration must be regenerated from the schema of the isolated restored snapshot and contain only the new challenge-list, route, claim-evidence, and editorial-review objects.

Official references: Turso CLI `db shell` dump/load, `db create --from-dump`, database export freshness warning, and point-in-time recovery documentation.
