import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@libsql/client'
import { auditMountainCourseRows, type AuditCourseRow, type AuditMountainRow } from '../lib/data-audit'

function valueAfter(flag: string) {
  const index = process.argv.indexOf(flag)
  return index >= 0 ? process.argv[index + 1] : undefined
}

async function main() {
  const sqlitePath = valueAfter('--sqlite')
  if (!sqlitePath) throw new Error('Usage: npm run audit:restored-db -- --sqlite <absolute-restored.db> [--out <report.json>]')
  const resolved = path.resolve(sqlitePath)
  if (!path.isAbsolute(sqlitePath) || !fs.existsSync(resolved)) throw new Error('The restored SQLite path must be an existing absolute path')
  if (resolved.startsWith(path.resolve(process.cwd(), 'public'))) throw new Error('Refusing to read a database from the public deployment directory')

  const client = createClient({ url: `file:${resolved.replaceAll('\\', '/')}` })
  try {
    const [mountainResult, courseResult, integrityResult, schemaResult] = await Promise.all([
      client.execute('SELECT id, name, region, sigun, lat, lng, is_top100 FROM mountains ORDER BY id'),
      client.execute('SELECT id, mountain_id, name, distance, duration_up, duration_down, gpx_available, gpx_url FROM courses ORDER BY id'),
      client.execute('PRAGMA integrity_check'),
      client.execute("SELECT name FROM sqlite_master WHERE type = 'table'"),
    ])
    const mountains = mountainResult.rows as unknown as AuditMountainRow[]
    const courses = courseResult.rows as unknown as AuditCourseRow[]
    const tableNames = new Set(schemaResult.rows.map(row => String(row.name)))
    const findings = auditMountainCourseRows(mountains, courses, {
      challengeMembershipSchema: tableNames.has('challenge_lists') && tableNames.has('challenge_memberships'),
      hikingRouteSchema: ['hiking_routes', 'hiking_route_mountains', 'hiking_route_segments', 'claim_evidence', 'editorial_reviews'].every(name => tableNames.has(name)),
    })
    const report = {
      observed_at: new Date().toISOString(), source: resolved, mode: 'read-only-restored-snapshot',
      integrity: integrityResult.rows, counts: { mountains: mountains.length, courses: courses.length }, findings,
    }
    const out = valueAfter('--out')
    if (out) fs.writeFileSync(path.resolve(out), JSON.stringify(report, null, 2))
    const severityCounts = Object.fromEntries(
      Object.entries(Object.groupBy(findings, finding => finding.severity)).map(([severity, rows]) => [severity, rows?.length ?? 0]),
    )
    const ruleCounts = Object.fromEntries(
      Object.entries(Object.groupBy(findings, finding => finding.rule_id)).map(([rule, rows]) => [rule, rows?.length ?? 0]),
    )
    console.log(JSON.stringify({ counts: report.counts, findingCount: findings.length, severityCounts, ruleCounts }, null, 2))
    if (findings.some(finding => finding.severity === 'ERROR')) process.exitCode = 2
  } finally {
    client.close()
  }
}

main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1 })
