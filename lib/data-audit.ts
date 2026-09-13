export interface AuditMountainRow {
  id: number
  name: string
  region: string | null
  sigun: string | null
  lat: number | null
  lng: number | null
  is_top100: number | boolean | null
}

export interface AuditCourseRow {
  id: number
  mountain_id: number | null
  name: string | null
  distance: number | null
  duration_up: number | null
  duration_down: number | null
  gpx_available: number | boolean | null
  gpx_url: string | null
}

export interface DataAuditFinding {
  rule_id: string
  severity: 'ERROR' | 'REVIEW' | 'SCHEMA_GAP'
  record_type: 'mountain' | 'course' | 'schema'
  record_id: number | null
  message: string
}

export interface DataAuditCapabilities {
  challengeMembershipSchema: boolean
  hikingRouteSchema: boolean
}

const NO_REVIEW_SCHEMA: DataAuditCapabilities = {
  challengeMembershipSchema: false,
  hikingRouteSchema: false,
}

export function auditMountainCourseRows(
  mountains: AuditMountainRow[],
  courses: AuditCourseRow[],
  capabilities: DataAuditCapabilities = NO_REVIEW_SCHEMA,
): DataAuditFinding[] {
  const findings: DataAuditFinding[] = []
  const mountainIds = new Set(mountains.map(row => row.id))
  const identityKeys = new Map<string, AuditMountainRow[]>()

  for (const mountain of mountains) {
    const key = `${mountain.name.trim()}|${mountain.region?.trim() ?? ''}|${mountain.sigun?.trim() ?? ''}`
    identityKeys.set(key, [...(identityKeys.get(key) ?? []), mountain])
    const oneCoordinateMissing = (mountain.lat == null) !== (mountain.lng == null)
    if (oneCoordinateMissing || (mountain.lat != null && (mountain.lat < 33 || mountain.lat > 39.5)) || (mountain.lng != null && (mountain.lng < 124 || mountain.lng > 132))) {
      findings.push({ rule_id: 'MOUNTAIN_COORDINATE_INVALID', severity: 'ERROR', record_type: 'mountain', record_id: mountain.id, message: 'coordinate pair is incomplete or outside the configured Korea review bounds' })
    }
  }

  for (const duplicates of identityKeys.values()) {
    if (duplicates.length > 1) {
      for (const mountain of duplicates) findings.push({ rule_id: 'MOUNTAIN_IDENTITY_DUPLICATE', severity: 'REVIEW', record_type: 'mountain', record_id: mountain.id, message: 'same name and administrative identity appears more than once' })
    }
  }

  for (const course of courses) {
    if (course.mountain_id == null || !mountainIds.has(course.mountain_id)) findings.push({ rule_id: 'COURSE_ORPHAN', severity: 'ERROR', record_type: 'course', record_id: course.id, message: 'course does not reference an existing mountain' })
    if (course.distance != null && (!Number.isFinite(course.distance) || course.distance < 0)) findings.push({ rule_id: 'COURSE_DISTANCE_INVALID', severity: 'ERROR', record_type: 'course', record_id: course.id, message: 'distance is negative or non-finite' })
    if ([course.duration_up, course.duration_down].some(value => value != null && (!Number.isFinite(value) || value < 0))) findings.push({ rule_id: 'COURSE_DURATION_INVALID', severity: 'ERROR', record_type: 'course', record_id: course.id, message: 'duration is negative or non-finite' })
    if (course.gpx_available && (!course.gpx_url || !/^https:\/\/[^\s]+\.gpx(?:[?#].*)?$/i.test(course.gpx_url))) findings.push({ rule_id: 'COURSE_GPX_UNVERIFIED', severity: 'ERROR', record_type: 'course', record_id: course.id, message: 'GPX flag lacks a direct HTTPS .gpx URL; payload and route identity still require separate validation' })
    if (course.distance != null && course.distance <= 0.3) findings.push({ rule_id: 'COURSE_SHORT_SEGMENT_REVIEW', severity: 'REVIEW', record_type: 'course', record_id: course.id, message: 'short value is retained but must not be promoted to a complete summit route without route evidence' })
  }

  if (!capabilities.challengeMembershipSchema) findings.push({ rule_id: 'CHALLENGE_MEMBERSHIP_SCHEMA_MISSING', severity: 'SCHEMA_GAP', record_type: 'schema', record_id: null, message: 'restored database lacks challenge_lists/challenge_memberships; is_top100 cannot distinguish list provenance' })
  if (!capabilities.hikingRouteSchema) findings.push({ rule_id: 'HIKING_ROUTE_SCHEMA_MISSING', severity: 'SCHEMA_GAP', record_type: 'schema', record_id: null, message: 'restored database lacks route/evidence/review tables required for public route claims' })
  return findings
}
