import assert from 'node:assert/strict'
import { POSTS, getPostPath } from '../lib/posts'
import { CONTENT_RISK_CATEGORIES, rankContentRisk } from '../lib/content-review-risk'

const rows = rankContentRisk(POSTS, getPostPath)
const secondRun = rankContentRisk(POSTS, getPostPath)

assert.equal(rows.length, POSTS.length, 'every effective public post must be ranked')
assert.equal(new Set(rows.map(row => row.id)).size, POSTS.length, 'post IDs must be unique')
assert.deepEqual(rows, secondRun, 'ranking must be deterministic')
assert.ok(rows.every(row => row.review_status === 'UNREVIEWED' && row.source_verified === false), 'ranking must not imply human or source verification')
assert.ok(rows.every(row => row.risk_score >= 0 && Number.isInteger(row.risk_score)), 'risk scores must be non-negative integers')

for (let index = 1; index < rows.length; index += 1) {
  const previous = rows[index - 1]
  const current = rows[index]
  assert.ok(previous.risk_score >= current.risk_score, `ranking order broke at ${previous.id}/${current.id}`)
}

const observedCategories = new Set(rows.flatMap(row => row.categories.split('|')))
for (const category of CONTENT_RISK_CATEGORIES) {
  assert.ok(observedCategories.has(category), `missing risk category coverage: ${category}`)
}
assert.ok(rows.some(row => row.categories.includes('MEDICAL_TREATMENT') && row.risk_level !== 'LOW'), 'medical claims must receive actionable priority')
assert.ok(rows.some(row => row.categories.includes('EMERGENCY_RESCUE') && row.risk_level !== 'LOW'), 'rescue claims must receive actionable priority')
assert.ok(rows.some(row => row.official_source_link_count > 0), 'official links must be observable without treating them as verification')

console.log(`CONTENT_RISK_RANKING_OK posts=${rows.length} critical=${rows.filter(row => row.risk_level === 'CRITICAL').length} high=${rows.filter(row => row.risk_level === 'HIGH').length}`)
