import type { Course } from './db/schema'

export interface PublicationEvidence {
  schema_valid: boolean
  source_checked: boolean
  conflict_status?: 'none' | 'disputed' | 'stale'
  review_status?: 'approved' | 'rejected' | 'needs_source' | 'disputed'
  reviewer_type?: 'human' | 'automated' | 'unverified'
  human_reviewed_at?: Date | string | null
  route_complete?: boolean
  page_status?: 'published' | 'draft' | 'review' | 'error'
  has_substantive_content?: boolean
  index_flag?: boolean
  valid_until?: Date | string | null
}

export function canDisplayFact(evidence?: PublicationEvidence): boolean {
  return Boolean(evidence?.schema_valid && evidence.source_checked && (evidence.conflict_status ?? 'none') === 'none')
}

export function canOfferGpx(course: Pick<Course, 'gpx_available' | 'gpx_url' | 'tier'>, evidence?: PublicationEvidence): boolean {
  if (!course.gpx_available || course.tier !== 'A' || !course.gpx_url) return false
  try {
    const url = new URL(course.gpx_url)
    return url.protocol === 'https:' && /\.gpx(?:$|[?#])/i.test(url.pathname + url.search) && canRecommendRoute(evidence)
  } catch {
    return false
  }
}

export function canRecommendRoute(evidence?: PublicationEvidence): boolean {
  return Boolean(
    canDisplayFact(evidence) && evidence?.route_complete && evidence.review_status === 'approved' &&
    evidence.reviewer_type === 'human' && evidence.human_reviewed_at,
  )
}

export function canIndexPage(evidence?: PublicationEvidence): boolean {
  const validUntil = evidence?.valid_until ? new Date(evidence.valid_until).getTime() : null
  const evidenceCurrent = validUntil == null || (Number.isFinite(validUntil) && validUntil > Date.now())
  return Boolean(
    canDisplayFact(evidence) && evidence?.page_status === 'published' && evidence.has_substantive_content &&
    evidence.index_flag === true && evidence.review_status === 'approved' && evidence.reviewer_type === 'human' &&
    evidence.human_reviewed_at && evidenceCurrent,
  )
}

export function canServeAds(evidence?: PublicationEvidence): boolean {
  return canIndexPage(evidence)
}

export interface AutomaticPublicationCandidate {
  status: string | null
  gate_passed: boolean | null
  source_checked?: boolean | null
  human_reviewed_at?: Date | string | null
  review_status?: string | null
  reviewer_type?: string | null
  source_snapshot_hash?: string | null
  approved_source_snapshot_hash?: string | null
  approval_revision?: number | null
}

export function automaticPublicationBlockReason(candidate: AutomaticPublicationCandidate): string | null {
  if (candidate.status !== 'quality_passed' || candidate.gate_passed !== true) return 'quality-gate-not-passed'
  if (candidate.source_checked !== true) return 'source-not-checked'
  if (candidate.review_status !== 'approved') return 'editorial-review-not-approved'
  if (candidate.reviewer_type !== 'human') return 'human-reviewer-required'
  if (!candidate.human_reviewed_at) return 'human-review-record-missing'
  if (!candidate.source_snapshot_hash || !candidate.approved_source_snapshot_hash) return 'source-snapshot-missing'
  if (candidate.source_snapshot_hash !== candidate.approved_source_snapshot_hash) return 'source-changed-after-review'
  if (!Number.isInteger(candidate.approval_revision) || (candidate.approval_revision ?? 0) < 1) return 'approval-revision-missing'
  return null
}

export function pageSlugToPublicPath(slug: string): string | null {
  const normalized = slug.trim().replace(/^\/+/, '')
  if (!normalized || normalized.includes('..') || /[?#\\]/.test(normalized)) return null
  try {
    const decoded = normalized.split('/').map(part => decodeURIComponent(part))
    const mountainSlug = decoded.length === 1 ? decoded[0] : decoded.length === 2 && decoded[0] === 'mountains' ? decoded[1] : null
    if (!mountainSlug || mountainSlug === '.' || mountainSlug === '..' || mountainSlug.includes('/')) return null
    return `/mountains/${encodeURIComponent(mountainSlug)}`
  } catch {
    return null
  }
}
