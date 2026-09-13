import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createClient } from '@libsql/client'
import { auditMountainCourseRows, type AuditCourseRow, type AuditMountainRow } from '../lib/data-audit'

const valueAfter = (flag: string) => {
  const index = process.argv.indexOf(flag)
  return index >= 0 ? process.argv[index + 1] : undefined
}
const quote = (value: string) => `"${value.replaceAll('"', '""')}"`

async function verifyCopy(copy: string) {
  const client = createClient({ url: `file:${copy.replaceAll('\\', '/')}` })
  const existingTables = ['collect_checkpoints','courses','data_sources','evergreens','fillers','hubs','mountains','pages','personas','publish_log','trails']
  const addedTables = ['challenge_lists','challenge_memberships','hiking_routes','hiking_route_mountains','hiking_route_segments','claim_evidence','editorial_reviews','publication_approvals','publication_runs','indexing_outbox']
  try {
    const before: Record<string, number> = {}
    for (const table of existingTables) before[table] = Number((await client.execute(`SELECT COUNT(*) AS n FROM ${quote(table)}`)).rows[0]?.n)
    const migration = fs.readFileSync('drizzle/additive/0001_validation_publication_control.sql', 'utf8')
    await client.executeMultiple(migration)
    const schema = new Set((await client.execute("SELECT name FROM sqlite_schema WHERE type='table'")).rows.map(row => String(row.name)))
    for (const table of addedTables) assert(schema.has(table), `missing added table ${table}`)
    for (const table of existingTables) assert.equal(Number((await client.execute(`SELECT COUNT(*) AS n FROM ${quote(table)}`)).rows[0]?.n), before[table], `row count changed: ${table}`)
    assert.equal(String((await client.execute('PRAGMA integrity_check')).rows[0]?.integrity_check), 'ok')
    assert.equal((await client.execute('PRAGMA foreign_key_check')).rows.length, 0)
    const [mountainResult, courseResult] = await Promise.all([
      client.execute('SELECT id, name, region, sigun, lat, lng, is_top100 FROM mountains ORDER BY id'),
      client.execute('SELECT id, mountain_id, name, distance, duration_up, duration_down, gpx_available, gpx_url FROM courses ORDER BY id'),
    ])
    const findings = auditMountainCourseRows(
      mountainResult.rows as unknown as AuditMountainRow[],
      courseResult.rows as unknown as AuditCourseRow[],
      { challengeMembershipSchema: true, hikingRouteSchema: true },
    )
    assert.equal(findings.filter(finding => finding.severity === 'SCHEMA_GAP').length, 0, 'schema-gap audit findings remain after migration')

    const rollback = fs.readFileSync('drizzle/additive/0001_validation_publication_control.rollback.sql', 'utf8')
    await client.executeMultiple(rollback)
    const afterRollback = new Set((await client.execute("SELECT name FROM sqlite_schema WHERE type='table'")).rows.map(row => String(row.name)))
    for (const table of addedTables) assert(!afterRollback.has(table), `rollback retained ${table}`)
    for (const table of existingTables) assert.equal(Number((await client.execute(`SELECT COUNT(*) AS n FROM ${quote(table)}`)).rows[0]?.n), before[table], `rollback changed rows: ${table}`)
    assert.equal(String((await client.execute('PRAGMA integrity_check')).rows[0]?.integrity_check), 'ok')
    console.log(`ADDITIVE_MIGRATION_OK existing_tables=${existingTables.length} added_tables=${addedTables.length} schema_gaps=0`)
  } finally {
    client.close()
  }
}

async function main() {
  const workerCopy = valueAfter('--worker-copy')
  if (workerCopy) return verifyCopy(workerCopy)

  const source = valueAfter('--sqlite')
  if (!source || !path.isAbsolute(source) || !fs.existsSync(source)) throw new Error('--sqlite must be an existing absolute snapshot path')
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dullegilgogo-migration-'))
  const copy = path.join(tempDir, 'migration-test.db')
  fs.copyFileSync(source, copy)
  try {
    const child = spawnSync(process.execPath, [...process.execArgv, process.argv[1], '--worker-copy', copy], { encoding: 'utf8' })
    if (child.stdout) process.stdout.write(child.stdout)
    if (child.stderr) process.stderr.write(child.stderr)
    if (child.status !== 0) throw new Error(`migration verification worker exited with ${child.status ?? 'no status'}`)
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 })
  }
}

main().catch(error => { console.error(error); process.exitCode = 1 })
