import assert from 'node:assert/strict'
import { automaticPublicationBlockReason, canDisplayFact, canIndexPage, canOfferGpx, canRecommendRoute, canServeAds, pageSlugToPublicPath } from '../lib/publication-policy'
import { isAuthorizedCronRequest } from '../lib/cron-auth'
import { buildMountainFaqs, buildMountainFitNotes, buildMountainMetaDescription, buildMountainQuickFacts, buildMountainSummary } from '../lib/mountain-content'
import fs from 'node:fs'

const course = {
  id: 1, mountain_id: 3, pmntn_sn: 1, name: '고동산구간', distance: 0.8,
  duration_up: 15, duration_down: null, diff_raw: '쉬움', diff_calc: null,
  diff_norm: '하', surface: null, risk_note: null, trailhead: null, transit: false,
  gpx_available: true, gpx_url: 'https://example.test/not-a-route.zip', tier: 'A',
  source: 'mountain_zip', created_at: null,
}
const mountain = {
  id: 3, mntn_code: 'x', name: '지리산', name_eng: null, region: '전남', sigun: '구례',
  elev: 1915, lat: null, lng: null, is_top100: true, pal: 'forest', slug: '지리산',
  description: null, created_at: null, updated_at: null,
}

assert.equal(canRecommendRoute(), false)
assert.equal(canOfferGpx(course), false)
const approved = { schema_valid: true, source_checked: true, conflict_status: 'none' as const, review_status: 'approved' as const, reviewer_type: 'human' as const, human_reviewed_at: '2026-09-13T00:00:00Z', route_complete: true, page_status: 'published' as const, has_substantive_content: true, index_flag: true }
assert.equal(canDisplayFact(approved), true)
assert.equal(canRecommendRoute(approved), true)
assert.equal(canOfferGpx({ ...course, gpx_url: 'https://example.test/route.gpx' }, approved), true)
assert.equal(canIndexPage(approved), true)
assert.equal(canServeAds(approved), true)
assert.equal(canRecommendRoute({ ...approved, route_complete: false }), false)
assert.equal(canIndexPage({ ...approved, route_complete: false }), true, 'reviewed non-route pages do not require route completeness')
assert.equal(canServeAds({ ...approved, reviewer_type: 'automated' }), false)
assert.equal(canIndexPage({ ...approved, index_flag: false }), false)
assert.equal(canIndexPage({ ...approved, conflict_status: 'disputed' }), false)
assert.equal(canIndexPage({ ...approved, valid_until: '2020-01-01T00:00:00Z' }), false)
assert.equal(automaticPublicationBlockReason({ status: 'quality_passed', gate_passed: true }), 'source-not-checked')
assert.equal(automaticPublicationBlockReason({
  status: 'quality_passed', gate_passed: true, source_checked: true,
  review_status: 'approved', reviewer_type: 'human', human_reviewed_at: '2026-09-13T00:00:00Z',
  source_snapshot_hash: 'sha256:current', approved_source_snapshot_hash: 'sha256:current', approval_revision: 1,
}), null)
assert.equal(automaticPublicationBlockReason({ status: 'quality_passed', gate_passed: true, source_checked: true, review_status: 'approved', reviewer_type: 'automated', human_reviewed_at: '2026-09-13T00:00:00Z' }), 'human-reviewer-required')
assert.equal(pageSlugToPublicPath('mountains/%EC%A7%80%EB%A6%AC%EC%82%B0'), '/mountains/%EC%A7%80%EB%A6%AC%EC%82%B0')
assert.equal(pageSlugToPublicPath('지리산'), '/mountains/%EC%A7%80%EB%A6%AC%EC%82%B0')
assert.equal(pageSlugToPublicPath('mountains/%E0%A4%A'), null)
assert.equal(pageSlugToPublicPath('mountains/%2E%2E'), null)
assert.equal(pageSlugToPublicPath('guide/safety-checklist'), null)
assert.equal(pageSlugToPublicPath('../admin'), null)
assert.equal(isAuthorizedCronRequest(new Request('https://example.test', { headers: { authorization: 'Bearer undefined' } }), undefined), false)
assert.equal(isAuthorizedCronRequest(new Request('https://example.test', { headers: { authorization: 'Bearer secret' } }), 'secret'), true)
assert.match(buildMountainSummary(mountain, [course]).join(' '), /전체 정상 코스 거리로 사용하지 않습니다/)
assert.match(buildMountainFitNotes(mountain, [course])[0].body, /추천하지 않으며/)
assert.doesNotMatch(buildMountainMetaDescription(mountain, [course]), /0\.8km|난이도\s*하/)
assert.match(buildMountainQuickFacts(mountain, [course]).distanceLabel, /구간 최솟값/)
assert.match(buildMountainFaqs(mountain, [course])[0].a, /산 전체 난이도를 단정하지 않습니다/)
const querySource = fs.readFileSync('lib/db/queries.ts', 'utf8')
assert.doesNotMatch(querySource, /beginner:\s+diff\s*===\s*'하'/)
assert.doesNotMatch(querySource, /gpx:\s+\(s\?\.gpx_count/)
const cronSource = fs.readFileSync('app/api/cron/publish/route.ts', 'utf8')
assert.match(cronSource, /automaticPublicationBlockReason/)
const mountainPageSource = fs.readFileSync('app/mountains/[slug]/page.tsx', 'utf8')
assert.doesNotMatch(mountainPageSource, /등산 코스 — 난이도·거리·소요시간/)
console.log('PUBLICATION_POLICY_OK')
