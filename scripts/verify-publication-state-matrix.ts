import assert from 'node:assert/strict'
import {
  automaticPublicationBlockReason,
  canDisplayFact,
  canIndexPage,
  canOfferGpx,
  canRecommendRoute,
  canServeAds,
  type PublicationEvidence,
} from '../lib/publication-policy'

const approvedPage: PublicationEvidence = {
  schema_valid: true,
  source_checked: true,
  conflict_status: 'none',
  review_status: 'approved',
  reviewer_type: 'human',
  human_reviewed_at: '2026-09-13T00:00:00Z',
  page_status: 'published',
  has_substantive_content: true,
  index_flag: true,
}

assert.equal(canIndexPage(approvedPage), true, 'reviewed non-route article can be indexed')
assert.equal(canRecommendRoute(approvedPage), false, 'article approval is not route approval')
assert.equal(canRecommendRoute({ ...approvedPage, route_complete: true }), true)
assert.equal(canDisplayFact({ ...approvedPage, source_checked: false }), false)
assert.equal(canDisplayFact({ ...approvedPage, conflict_status: 'disputed' }), false)
assert.equal(canIndexPage({ ...approvedPage, reviewer_type: 'automated' }), false)
assert.equal(canIndexPage({ ...approvedPage, page_status: 'draft' }), false)
assert.equal(canIndexPage({ ...approvedPage, index_flag: false }), false)
assert.equal(canServeAds({ ...approvedPage, index_flag: false }), false)

const gpx = { gpx_available: true, gpx_url: 'https://example.test/route.gpx', tier: 'A' }
assert.equal(canOfferGpx(gpx, approvedPage), false)
assert.equal(canOfferGpx(gpx, { ...approvedPage, route_complete: true }), true)
assert.equal(canOfferGpx({ ...gpx, gpx_url: 'http://example.test/route.gpx' }, { ...approvedPage, route_complete: true }), false)

const candidate = {
  status: 'quality_passed',
  gate_passed: true,
  source_checked: true,
  review_status: 'approved',
  reviewer_type: 'human',
  human_reviewed_at: '2026-09-13T00:00:00Z',
  source_snapshot_hash: 'sha256:current',
  approved_source_snapshot_hash: 'sha256:current',
  approval_revision: 1,
}
assert.equal(automaticPublicationBlockReason(candidate), null)
assert.equal(automaticPublicationBlockReason({ ...candidate, approved_source_snapshot_hash: 'sha256:old' }), 'source-changed-after-review')
assert.equal(automaticPublicationBlockReason({ ...candidate, source_snapshot_hash: null }), 'source-snapshot-missing')
assert.equal(automaticPublicationBlockReason({ ...candidate, approval_revision: 0 }), 'approval-revision-missing')
assert.equal(automaticPublicationBlockReason({ ...candidate, reviewer_type: 'automated' }), 'human-reviewer-required')

console.log('PUBLICATION_STATE_MATRIX_OK')
