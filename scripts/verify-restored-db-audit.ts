import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dullegilgogo-restored-audit-'))
const databasePath = path.join(tempDir, 'restored-fixture.db')
const reportPath = path.join(tempDir, 'audit-report.json')

function runAudit(...args: string[]) {
  const tsxCli = path.join(process.cwd(), 'node_modules', 'tsx', 'dist', 'cli.mjs')
  return spawnSync(
    process.execPath,
    [tsxCli, 'scripts/audit-restored-db.ts', ...args],
    { cwd: process.cwd(), encoding: 'utf8' },
  )
}

async function main() {
  const fixtureSql = [
    'CREATE TABLE mountains (id INTEGER PRIMARY KEY, name TEXT NOT NULL, region TEXT, sigun TEXT, lat REAL, lng REAL, is_top100 INTEGER)',
    'CREATE TABLE courses (id INTEGER PRIMARY KEY, mountain_id INTEGER, name TEXT, distance REAL, duration_up REAL, duration_down REAL, gpx_available INTEGER, gpx_url TEXT)',
    'CREATE TABLE challenge_lists (id INTEGER PRIMARY KEY)',
    'CREATE TABLE challenge_memberships (id INTEGER PRIMARY KEY)',
    'CREATE TABLE hiking_routes (id INTEGER PRIMARY KEY)',
    'CREATE TABLE hiking_route_mountains (id INTEGER PRIMARY KEY)',
    'CREATE TABLE hiking_route_segments (id INTEGER PRIMARY KEY)',
    'CREATE TABLE claim_evidence (id INTEGER PRIMARY KEY)',
    'CREATE TABLE editorial_reviews (id INTEGER PRIMARY KEY)',
    "INSERT INTO mountains VALUES (1, '검증산', '경기', '가평', 37.8, 127.5, 0)",
    "INSERT INTO courses VALUES (1, 1, '검증 구간', 2.5, 1.2, 1.0, 0, NULL)",
  ]
  const fixture = spawnSync(process.execPath, [
    '-e',
    "const { DatabaseSync } = require('node:sqlite'); const db = new DatabaseSync(process.argv[1]); for (const sql of JSON.parse(process.argv[2])) db.exec(sql); db.close()",
    databasePath,
    JSON.stringify(fixtureSql),
  ], { encoding: 'utf8' })
  if (fixture.error) throw fixture.error
  assert.equal(fixture.status, 0, fixture.stderr || fixture.stdout)

  const valid = runAudit('--sqlite', databasePath, '--out', reportPath)
  if (valid.error) throw valid.error
  assert.equal(valid.status, 0, valid.stderr || valid.stdout)
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
  assert.equal(report.mode, 'read-only-restored-snapshot')
  assert.deepEqual(report.counts, { mountains: 1, courses: 1 })
  assert.equal(report.integrity[0]?.integrity_check, 'ok')
  assert.deepEqual(report.findings, [])

  const relative = runAudit('--sqlite', 'restored-fixture.db')
  if (relative.error) throw relative.error
  assert.equal(relative.status, 1)
  assert.match(relative.stderr, /existing absolute path/)

  console.log('RESTORED_DB_AUDIT_OK')
}

main()
  .finally(() => fs.rmSync(tempDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }))
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
