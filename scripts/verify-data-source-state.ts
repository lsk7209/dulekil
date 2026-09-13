import assert from 'node:assert/strict'
import fs from 'node:fs'
import { resolveHubDataState } from '../lib/data-source-state'

assert.equal(resolveHubDataState({ configured: false }), 'static-no-config')
assert.equal(resolveHubDataState({ configured: true, rowCount: 0 }), 'static-empty')
assert.equal(resolveHubDataState({ configured: true, failed: true }), 'static-unavailable')
assert.equal(resolveHubDataState({ configured: true, rowCount: 93 }), 'database')

const queries = fs.readFileSync('lib/db/queries.ts', 'utf8')
assert.match(queries, /noStore\(\)/)
assert.match(queries, /getMountainsForHubSnapshot/)
assert.match(queries, /getMountainDetailSnapshot/)
assert.match(queries, /loadHubDataFromReader/)
assert.doesNotMatch(queries, /export async function getMountainBySlug|export async function getCoursesByMountainId|export async function getSiteStats/)
assert.match(queries, /mountain: staticMountainBySlug\(slug\),\s*courses: \[\]/)
const notice = fs.readFileSync('components/data-source-notice.tsx', 'utf8')
for (const state of ['database-partial', 'static-no-config', 'static-empty', 'static-missing-record', 'static-unavailable']) {
  assert.match(notice, new RegExp(`'${state}'`))
}
for (const page of ['app/page.tsx', 'app/mountains/page.tsx', 'app/tracker/page.tsx', 'app/list/[slug]/page.tsx']) {
  const source = fs.readFileSync(page, 'utf8')
  assert.match(source, /getMountainsForHubSnapshot/)
  assert.match(source, /<DataSourceNotice state=\{mountainSnapshot\.state\}/)
}
const detail = fs.readFileSync('app/mountains/[slug]/page.tsx', 'utf8')
assert.match(detail, /cache\(getMountainDetailSnapshot\)/)
assert.doesNotMatch(detail, /getCoursesByMountainId/)
assert.match(detail, /<DataSourceNotice state=\{canPublishDatabaseDerivedData\(mountainSnapshot\.state\) \? allMountainSnapshot\.state : mountainSnapshot\.state\}/)
assert.match(fs.readFileSync('lib/mountain-data-loader.ts', 'utf8'), /mountain, courses: \[\], state: 'database-partial'/)
for (const page of ['app/mountains/page.tsx', 'app/list/[slug]/page.tsx', 'app/mountains/[slug]/page.tsx']) {
  assert.match(fs.readFileSync(page, 'utf8'), /canPublishDatabaseDerivedData\(mountainSnapshot\.state\) && \([\s\S]*application\/ld\+json/)
}
const sitemap = fs.readFileSync('app/sitemap.ts', 'utf8')
assert.match(sitemap, /getMountainsForHubSnapshot/)
assert.match(sitemap, /canPublishDatabaseDerivedData\(snapshot\.state\)/)
const mountainAudit = fs.readFileSync('scripts/audit-mountain-content.ts', 'utf8')
assert.match(mountainAudit, /snapshot\.state !== 'database'/)
assert.match(mountainAudit, /getMountainDetailSnapshot/)
assert.doesNotMatch(mountainAudit, /getCoursesByMountainId/)
console.log('DATA_SOURCE_STATE_OK')
