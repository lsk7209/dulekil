# Authorized DB snapshot and restored audit evidence — 2026-09-13

- Credential material was read only from `D:\다운로드\111.txt` and was never printed or copied into the repository.
- A remote metadata probe used only `SELECT` and confirmed SQLite 3.47.0 with 11 application tables.
- A consistent remote read transaction was copied to `D:\private-backups\dullegilgogo\dullegilgogo-20260913T062917Z.db` outside the repository.
- Snapshot size: 2,019,328 bytes. SHA-256: `2ceb1ea5958572ad0f0ae9e38c7b50beb5f39127445d9a658e35858b31da802d`.
- Row counts matched inside the transaction: mountains 2,227; courses 7,787; trails 260; collect_checkpoints 2; the other seven application tables were empty.
- Local `PRAGMA integrity_check` returned `ok`, `foreign_key_check` returned no rows, and every table count matched. A manifest sits beside the private DB.
- The read-only restored audit wrote its private report beside the snapshot and exited 2 because it found 7,787 unverified GPX flags, 658 short-segment review signals, and two schema gaps (challenge membership and route/evidence/review).
- No remote write, hosted restore DB, migration, visibility change, deployment or account action occurred.
