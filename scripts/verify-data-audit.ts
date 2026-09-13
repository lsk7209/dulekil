import assert from 'node:assert/strict'
import { auditMountainCourseRows } from '../lib/data-audit'

const findings = auditMountainCourseRows([
  { id: 1, name: '감악산', region: '경기', sigun: '파주', lat: 37.9, lng: 126.9, is_top100: 1 },
  { id: 2, name: '감악산', region: '경기', sigun: '파주', lat: 126.9, lng: 37.9, is_top100: 1 },
], [
  { id: 10, mountain_id: 999, name: '짧은구간', distance: 0.1, duration_up: -1, duration_down: null, gpx_available: 1, gpx_url: 'https://example.test/error.html' },
])
const ids = new Set(findings.map(finding => finding.rule_id))
for (const expected of ['MOUNTAIN_COORDINATE_INVALID', 'MOUNTAIN_IDENTITY_DUPLICATE', 'COURSE_ORPHAN', 'COURSE_DURATION_INVALID', 'COURSE_GPX_UNVERIFIED', 'COURSE_SHORT_SEGMENT_REVIEW', 'CHALLENGE_MEMBERSHIP_SCHEMA_MISSING', 'HIKING_ROUTE_SCHEMA_MISSING']) assert(ids.has(expected), expected)
assert.equal(ids.has('COURSE_DISTANCE_INVALID'), false, 'short positive segments are review signals, not auto-deletion errors')
const schemaReady = auditMountainCourseRows([], [], { challengeMembershipSchema: true, hikingRouteSchema: true })
assert.equal(schemaReady.some(finding => finding.severity === 'SCHEMA_GAP'), false)
console.log('DATA_AUDIT_OK')
