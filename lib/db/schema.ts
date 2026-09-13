import { sql } from 'drizzle-orm'
import {
  text, integer, real, index, uniqueIndex,
  sqliteTable as table,
} from 'drizzle-orm/sqlite-core'

// ──────────────────────────────────────────────
// 데이터 소스 관리
// ──────────────────────────────────────────────
export const dataSources = table('data_sources', {
  id:           integer('id').primaryKey({ autoIncrement: true }),
  name:         text('name').notNull().unique(),
  description:  text('description'),
  license_type: text('license_type').notNull(), // 공공누리1 / 제한없음 / 별도약관
  source_url:   text('source_url'),
  last_sync:    integer('last_sync', { mode: 'timestamp' }),
  created_at:   integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

// ──────────────────────────────────────────────
// 산 마스터 (100대명산 중심)
// ──────────────────────────────────────────────
export const mountains = table('mountains', {
  id:           integer('id').primaryKey({ autoIncrement: true }),
  mntn_code:    text('mntn_code').unique(),         // 전국등산로 코드 (e.g. 111100101)
  name:         text('name').notNull(),             // 산 이름
  name_eng:     text('name_eng'),
  region:       text('region'),                     // 시/도
  sigun:        text('sigun'),                      // 시/군
  elev:         integer('elev'),                    // 최고 고도(m)
  lat:          real('lat'),                        // 위도 (WGS84)
  lng:          real('lng'),                        // 경도 (WGS84)
  is_top100:    integer('is_top100', { mode: 'boolean' }).default(false),
  pal:          text('pal').default('forest'),      // 디자인 팔레트 (motif.ts)
  slug:         text('slug').unique(),              // URL slug
  description:  text('description'),               // Gemini 보강 설명
  created_at:   integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updated_at:   integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, t => ({
  idxTop100:  index('idx_mountains_top100').on(t.is_top100),
  idxRegion:  index('idx_mountains_region').on(t.region),
  idxSlug:    index('idx_mountains_slug').on(t.slug),
}))

// ──────────────────────────────────────────────
// 코스/등산로 (전국등산로표준데이터 + vworld API)
// ──────────────────────────────────────────────
export const courses = table('courses', {
  id:           integer('id').primaryKey({ autoIncrement: true }),
  mountain_id:  integer('mountain_id').references(() => mountains.id, { onDelete: 'cascade' }),
  pmntn_sn:     integer('pmntn_sn'),               // 등산로 일련번호
  name:         text('name'),                      // 등산로 이름 (PMNTN_NM)
  distance:     real('distance'),                  // 총 거리(km)
  duration_up:  integer('duration_up'),            // 상행 소요시간(분)
  duration_down: integer('duration_down'),         // 하행 소요시간(분)
  diff_raw:     text('diff_raw'),                  // 원본 난이도 (쉬움/중간/어려움)
  diff_calc:    text('diff_calc'),                 // 계산 난이도 (GPX 있을 때만)
  diff_norm:    text('diff_norm'),                 // 정규화 난이도 (하/중/상/매우상)
  surface:      text('surface'),                   // 노면 재질 (PMNTN_MTRQ)
  risk_note:    text('risk_note'),                 // 위험 구간 (PMNTN_RISK)
  trailhead:    text('trailhead'),                 // 들머리 위치
  transit:      integer('transit', { mode: 'boolean' }).default(false), // 대중교통 접근
  gpx_available: integer('gpx_available', { mode: 'boolean' }).default(false),
  gpx_url:      text('gpx_url'),                  // GPX 파일 URL
  tier:         text('tier').default('B'),         // A=GPX정밀 / B=표준기본
  source:       text('source').default('mountain_zip'), // 데이터 출처
  created_at:   integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, t => ({
  idxMtnId:    index('idx_courses_mountain_id').on(t.mountain_id),
  idxTier:     index('idx_courses_tier').on(t.tier),
  idxDiff:     index('idx_courses_diff_norm').on(t.diff_norm),
}))

// ──────────────────────────────────────────────
// 둘레길/숲길 (두루누비 API)
// ──────────────────────────────────────────────
export const trails = table('trails', {
  id:           integer('id').primaryKey({ autoIncrement: true }),
  crs_idx:      text('crs_idx').unique(),          // 두루누비 코스 ID
  route_idx:    text('route_idx'),                 // 두루누비 길 ID (남파랑길 등)
  route_name:   text('route_name'),                // 길 이름 (남파랑길, 서해랑길 등)
  name:         text('name').notNull(),            // 코스 이름
  distance:     integer('distance'),               // 거리(km)
  duration:     integer('duration'),               // 소요시간(분)
  level:        text('level'),                     // 난이도 (1/2/3)
  cycle_type:   text('cycle_type'),                // 순환형/비순환형
  sigun:        text('sigun'),                     // 지역
  slug:         text('slug').unique(),
  contents:     text('contents'),                  // 코스 설명
  summary:      text('summary'),
  tour_info:    text('tour_info'),
  traveler_info: text('traveler_info'),
  gpx_url:      text('gpx_url'),                  // GPX 다운로드 URL
  brd_div:      text('brd_div'),
  source_modified: text('source_modified'),
  created_at:   integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, t => ({
  idxRouteIdx: index('idx_trails_route_idx').on(t.route_idx),
  idxSigun:    index('idx_trails_sigun').on(t.sigun),
}))

// ──────────────────────────────────────────────
// 프로그래매틱 페이지 레지스트리 (품질 게이트)
// ──────────────────────────────────────────────
export const pages = table('pages', {
  id:             integer('id').primaryKey({ autoIncrement: true }),
  entity_type:    text('entity_type').notNull(),   // mountain / course / trail / filler / guide
  entity_id:      integer('entity_id'),
  slug:           text('slug').notNull().unique(),
  title:          text('title'),
  status:         text('status').default('draft'), // draft/enriched/quality_passed/published/demoted
  quality_score:  real('quality_score'),
  gate_passed:    integer('gate_passed', { mode: 'boolean' }).default(false),
  active_sections: text('active_sections'),        // JSON array: ["계절","교통","조망"]
  unique_points:  text('unique_points'),           // JSON array: 3개 이상 필수
  index_flag:     integer('index_flag', { mode: 'boolean' }).default(false),
  persona:        text('persona'),                 // traveler / hiker
  published_at:   integer('published_at', { mode: 'timestamp' }),
  created_at:     integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updated_at:     integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, t => ({
  idxStatus:     index('idx_pages_status').on(t.status),
  idxIndexFlag:  index('idx_pages_index_flag').on(t.index_flag),
  idxEntityType: index('idx_pages_entity_type').on(t.entity_type),
}))

// ──────────────────────────────────────────────
// L2 비교·모음 (fillers)
// ──────────────────────────────────────────────
export const fillers = table('fillers', {
  id:         integer('id').primaryKey({ autoIncrement: true }),
  topic:      text('topic').notNull(),             // e.g. "seoul_easy", "subway_accessible"
  slug:       text('slug').notNull().unique(),
  title:      text('title'),
  status:     text('status').default('draft'),
  body:       text('body'),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

// ──────────────────────────────────────────────
// L3 에버그린 가이드 (evergreens)
// ──────────────────────────────────────────────
export const evergreens = table('evergreens', {
  id:         integer('id').primaryKey({ autoIncrement: true }),
  slug:       text('slug').notNull().unique(),
  title:      text('title'),
  persona:    text('persona'),                     // hiker / traveler
  status:     text('status').default('draft'),
  body:       text('body'),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

// ──────────────────────────────────────────────
// 허브 (카테고리/지역/100대명산)
// ──────────────────────────────────────────────
export const hubs = table('hubs', {
  id:         integer('id').primaryKey({ autoIncrement: true }),
  type:       text('type').notNull(),              // region / top100 / difficulty / season
  slug:       text('slug').notNull().unique(),
  title:      text('title'),
  description: text('description'),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

// ──────────────────────────────────────────────
// 페르소나
// ──────────────────────────────────────────────
export const personas = table('personas', {
  id:         integer('id').primaryKey({ autoIncrement: true }),
  key:        text('key').notNull().unique(),      // traveler / hiker
  name:       text('name'),
  style:      text('style'),                       // 감성·풍경 / 실용·안전
  prompt_prefix: text('prompt_prefix'),
})

// ──────────────────────────────────────────────
// 드립피드 발행 로그
// ──────────────────────────────────────────────
export const publishLog = table('publish_log', {
  id:           integer('id').primaryKey({ autoIncrement: true }),
  page_id:      integer('page_id').references(() => pages.id),
  published_at: integer('published_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  channel:      text('channel').default('cron'),
})

// ──────────────────────────────────────────────
// 수집 체크포인트 (대량 작업 중단/재개)
// ──────────────────────────────────────────────
export const collectCheckpoints = table('collect_checkpoints', {
  id:          integer('id').primaryKey({ autoIncrement: true }),
  source:      text('source').notNull().unique(),  // mountain_zip / durunubi / vworld
  last_offset: integer('last_offset').default(0),
  last_key:    text('last_key'),
  total:       integer('total'),
  status:      text('status').default('pending'),  // pending / running / done / failed
  updated_at:  integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

// ──────────────────────────────────────────────
// 검증 레이어 (기존 원천/URL/트래커 식별자는 변경하지 않음)
// ──────────────────────────────────────────────
export const challengeLists = table('challenge_lists', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  name: text('name').notNull(),
  publisher: text('publisher').notNull(),
  version_label: text('version_label'),
  source_url: text('source_url').notNull(),
  source_checked_at: integer('source_checked_at', { mode: 'timestamp' }),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

export const challengeMemberships = table('challenge_memberships', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  challenge_list_id: integer('challenge_list_id').notNull().references(() => challengeLists.id, { onDelete: 'cascade' }),
  mountain_id: integer('mountain_id').notNull().references(() => mountains.id, { onDelete: 'restrict' }),
  source_item_name: text('source_item_name').notNull(),
  source_record_id: text('source_record_id'),
  match_status: text('match_status').notNull().default('candidate'), // candidate/matched/disputed/rejected
  match_basis: text('match_basis'),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, t => ({
  uniqMembership: uniqueIndex('uq_challenge_membership').on(t.challenge_list_id, t.mountain_id),
  idxMembershipStatus: index('idx_challenge_membership_status').on(t.match_status),
}))

export const hikingRoutes = table('hiking_routes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  route_key: text('route_key').notNull().unique(),
  name: text('name').notNull(),
  route_type: text('route_type').notNull(), // one_way/round_trip/loop/traverse
  trailhead: text('trailhead').notNull(),
  endpoint: text('endpoint').notNull(),
  trailhead_id: text('trailhead_id'),
  endpoint_id: text('endpoint_id'),
  distance_km: real('distance_km'),
  duration_minutes: integer('duration_minutes'),
  duration_scope: text('duration_scope'), // ascent/descent/total/estimated
  elevation_gain_m: integer('elevation_gain_m'),
  difficulty: text('difficulty'),
  difficulty_source: text('difficulty_source'),
  source_ids: text('source_ids'), // JSON array; populated only from retained source records
  source_updated_at: integer('source_updated_at', { mode: 'timestamp' }),
  review_status: text('review_status').notNull().default('unverified'),
  source_checked_at: integer('source_checked_at', { mode: 'timestamp' }),
  last_human_reviewed_at: integer('last_human_reviewed_at', { mode: 'timestamp' }),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, t => ({
  idxRouteReview: index('idx_hiking_route_review').on(t.review_status),
}))

export const hikingRouteMountains = table('hiking_route_mountains', {
  route_id: integer('route_id').notNull().references(() => hikingRoutes.id, { onDelete: 'cascade' }),
  mountain_id: integer('mountain_id').notNull().references(() => mountains.id, { onDelete: 'restrict' }),
  sequence: integer('sequence').notNull().default(0),
}, t => ({
  uniqRouteMountain: uniqueIndex('uq_hiking_route_mountain').on(t.route_id, t.mountain_id),
}))

export const hikingRouteSegments = table('hiking_route_segments', {
  route_id: integer('route_id').notNull().references(() => hikingRoutes.id, { onDelete: 'cascade' }),
  course_id: integer('course_id').notNull().references(() => courses.id, { onDelete: 'restrict' }),
  sequence: integer('sequence').notNull(),
  direction: text('direction').notNull(),
}, t => ({
  uniqRouteSequence: uniqueIndex('uq_hiking_route_segment_sequence').on(t.route_id, t.sequence),
  uniqRouteCourseDirection: uniqueIndex('uq_hiking_route_course_direction').on(t.route_id, t.course_id, t.direction),
}))

export const claimEvidence = table('claim_evidence', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  entity_type: text('entity_type').notNull(),
  entity_id: text('entity_id').notNull(),
  field_name: text('field_name').notNull(),
  normalized_value: text('normalized_value'),
  source_url: text('source_url').notNull(),
  source_title: text('source_title'),
  source_authority: text('source_authority'),
  source_updated_at: integer('source_updated_at', { mode: 'timestamp' }),
  retrieved_at: integer('retrieved_at', { mode: 'timestamp' }).notNull(),
  source_checked_at: integer('source_checked_at', { mode: 'timestamp' }),
  checked_by_type: text('checked_by_type').notNull().default('unverified'), // unverified/automated/human
  conflict_status: text('conflict_status').notNull().default('none'),
  valid_until: integer('valid_until', { mode: 'timestamp' }),
}, t => ({
  idxClaimEntity: index('idx_claim_evidence_entity').on(t.entity_type, t.entity_id, t.field_name),
  idxClaimValidity: index('idx_claim_evidence_validity').on(t.valid_until),
}))

export const editorialReviews = table('editorial_reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  entity_type: text('entity_type').notNull(),
  entity_id: text('entity_id').notNull(),
  review_status: text('review_status').notNull(), // approved/rejected/needs_source/disputed
  reviewer_type: text('reviewer_type').notNull(), // human only authorizes publication
  reviewed_at: integer('reviewed_at', { mode: 'timestamp' }).notNull(),
  source_snapshot_hash: text('source_snapshot_hash'),
  notes: text('notes'),
}, t => ({
  uniqCurrentReview: uniqueIndex('uq_editorial_review_snapshot').on(t.entity_type, t.entity_id, t.source_snapshot_hash),
  idxReviewStatus: index('idx_editorial_review_status').on(t.review_status, t.reviewer_type),
}))

// Publication-control additions are schema design only until an isolated
// restored database proves an additive migration. Do not apply the generated
// full-schema 0000 baseline to an existing database.
export const publicationApprovals = table('publication_approvals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  page_id: integer('page_id').notNull().references(() => pages.id, { onDelete: 'restrict' }),
  revision: integer('revision').notNull(),
  source_snapshot_hash: text('source_snapshot_hash').notNull(),
  reviewer_type: text('reviewer_type').notNull(),
  review_status: text('review_status').notNull(),
  reviewed_at: integer('reviewed_at', { mode: 'timestamp' }).notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
}, t => ({
  uniqApprovalRevision: uniqueIndex('uq_publication_approval_revision').on(t.page_id, t.revision),
  idxApprovalSnapshot: index('idx_publication_approval_snapshot').on(t.page_id, t.source_snapshot_hash),
}))

export const publicationRuns = table('publication_runs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  run_key_kst: text('run_key_kst').notNull().unique(), // YYYY-MM-DD; one allocation per KST day
  status: text('status').notNull().default('started'), // started/completed/failed
  requested_limit: integer('requested_limit').notNull(),
  claimed_count: integer('claimed_count').notNull().default(0),
  started_at: integer('started_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  completed_at: integer('completed_at', { mode: 'timestamp' }),
})

export const indexingOutbox = table('indexing_outbox', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  page_id: integer('page_id').notNull().references(() => pages.id, { onDelete: 'restrict' }),
  approval_revision: integer('approval_revision').notNull(),
  provider: text('provider').notNull(), // indexnow/google
  url: text('url').notNull(),
  status: text('status').notNull().default('pending'), // pending/sending/sent/failed
  attempt_count: integer('attempt_count').notNull().default(0),
  next_attempt_at: integer('next_attempt_at', { mode: 'timestamp' }),
  last_error: text('last_error'),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  sent_at: integer('sent_at', { mode: 'timestamp' }),
}, t => ({
  uniqOutboxDelivery: uniqueIndex('uq_indexing_outbox_delivery').on(t.page_id, t.approval_revision, t.provider, t.url),
  idxOutboxRetry: index('idx_indexing_outbox_retry').on(t.status, t.next_attempt_at),
}))

// ──────────────────────────────────────────────
// 타입 exports
// ──────────────────────────────────────────────
export type Mountain = typeof mountains.$inferSelect
export type Course   = typeof courses.$inferSelect
export type Trail    = typeof trails.$inferSelect
export type Page     = typeof pages.$inferSelect
export type HikingRoute = typeof hikingRoutes.$inferSelect
export type ClaimEvidence = typeof claimEvidence.$inferSelect
