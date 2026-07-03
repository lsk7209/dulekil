/**
 * DB 쿼리 함수 — 서버 컴포넌트 / generateStaticParams에서 사용
 * 동적 import로 빌드 타임 DB 연결 충돌 방지
 */
import { eq, inArray, sql, isNotNull } from 'drizzle-orm'
import * as schema from './schema'
import { MOUNTAINS } from '../mountains-static'

// ── 지역 → 그룹 매핑 ──────────────────────────────
export function getRegionGroup(region: string | null): string {
  if (!region) return '기타'
  if (/서울|경기|인천|강화/.test(region)) return '수도권'
  if (/강원/.test(region))              return '강원'
  if (/충북|충남|대전|세종/.test(region)) return '충청'
  if (/경북|경남|대구|부산|울산/.test(region)) return '영남'
  if (/전북|전남|광주/.test(region))    return '호남'
  if (/제주/.test(region))              return '제주'
  return '기타'
}

// 소요시간 (분 → "H:MM" 형식)
function minutesToHM(min: number | null): string {
  if (!min || min <= 0) return '?:??'
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h}:${String(m).padStart(2, '0')}`
}

// 난이도 정규화
function normDiff(raw: string | null): '하' | '중' | '상' | '매우상' {
  if (raw === '하' || raw === '1' || raw === '쉬움') return '하'
  if (raw === '상' || raw === '3' || raw === '어려움') return '상'
  if (raw === '매우상' || raw === '4') return '매우상'
  return '중'
}

// ── 명산 허브용 타입 ──────────────────────────────
export interface HubMountain {
  id:          number
  name:        string
  peak:        string      // 코스 이름 또는 산명
  region:      string
  sigun:       string
  group:       string
  elev:        number
  dist:        number
  diff:        '하' | '중' | '상' | '매우상'
  time:        string
  gpx:         boolean
  transit:     boolean
  transitNote: string
  beginner:    boolean
  sun:         boolean
  pal:         string
  slug:        string
  description: string | null
  seasons:     string[]
  tags:        string[]
  pop:         number      // elev 기반 proxy
}

function staticMountainsForHub(): HubMountain[] {
  return MOUNTAINS.map((m, index) => ({
    id:          index + 1,
    name:        m.name,
    peak:        m.peak,
    region:      m.region,
    sigun:       '',
    group:       m.group,
    elev:        m.elev,
    dist:        m.dist,
    diff:        m.diff as HubMountain['diff'],
    time:        m.time,
    gpx:         m.gpx,
    transit:     m.transit,
    transitNote: m.transitNote,
    beginner:    m.beginner,
    sun:         m.sun,
    pal:         m.pal,
    slug:        m.name,
    description: null,
    seasons:     m.seasons,
    tags:        m.tags,
    pop:         m.pop,
  }))
}

function staticMountainBySlug(slug: string) {
  const decoded = decodeURIComponent(slug)
  const found = MOUNTAINS.find(m => m.name === decoded || m.id === decoded)
  if (!found) return null

  return {
    id:          MOUNTAINS.findIndex(m => m === found) + 1,
    mntn_code:   null,
    name:        found.name,
    name_eng:    null,
    region:      found.region,
    sigun:       '',
    elev:        found.elev,
    lat:         null,
    lng:         null,
    is_top100:   true,
    pal:         found.pal,
    slug:        found.name,
    description: null,
    created_at:  null,
    updated_at:  null,
  }
}

// ── 100대 명산 허브 데이터 ──────────────────────────
export async function getMountainsForHub(): Promise<HubMountain[]> {
  try {
  const { db } = await import('./index')

  const mountains = await db.select().from(schema.mountains)
    .where(eq(schema.mountains.is_top100, true))
    .orderBy(schema.mountains.name)

  if (mountains.length === 0) return staticMountainsForHub()

  const ids = mountains.map(m => m.id)

  // 코스 집계 (2번째 쿼리)
  const stats = await db.select({
    mountain_id: schema.courses.mountain_id,
    min_dist:    sql<number>`MIN(distance)`,
    dur_up:      sql<number>`MAX(duration_up)`,
    has_transit: sql<number>`MAX(CAST(transit AS INTEGER))`,
    gpx_count:   sql<number>`SUM(CAST(gpx_available AS INTEGER))`,
    course_count: sql<number>`COUNT(*)`,
    // 가장 많은 난이도
    top_diff:    sql<string>`(
      SELECT diff_norm FROM courses ci
      WHERE ci.mountain_id = courses.mountain_id
      AND ci.diff_norm IS NOT NULL
      GROUP BY diff_norm ORDER BY COUNT(*) DESC LIMIT 1
    )`,
    sample_name: sql<string>`MAX(name)`,
  }).from(schema.courses)
    .where(inArray(schema.courses.mountain_id, ids))
    .groupBy(schema.courses.mountain_id)

  const statsMap = new Map(stats.map(s => [s.mountain_id, s]))

  return mountains.map(m => {
    const s      = statsMap.get(m.id)
    const diff   = normDiff(s?.top_diff ?? null)
    const elev   = m.elev ?? 0

    // 계절 추정 (고도 기반)
    const seasons: string[] = elev >= 1400 ? ['겨울', '가을']
                            : elev >= 800  ? ['가을', '봄']
                            : ['봄', '여름']

    return {
      id:          m.id,
      name:        m.name,
      peak:        s?.sample_name ?? m.name,
      region:      m.region ?? '',
      sigun:       m.sigun ?? '',
      group:       getRegionGroup(m.region),
      elev,
      dist:        parseFloat(((s?.min_dist ?? 5) * 1).toFixed(1)),
      diff,
      time:        minutesToHM(s?.dur_up ?? null),
      gpx:         (s?.gpx_count ?? 0) > 0,
      transit:     s?.has_transit === 1,
      transitNote: s?.has_transit === 1 ? '대중교통 접근 가능' : '자가용 권장',
      beginner:    diff === '하',
      sun:         elev >= 1500,
      pal:         m.pal ?? 'forest',
      slug:        m.slug ?? m.name,
      description: m.description,
      seasons,
      tags:        [
        elev >= 1500 ? '고산' : '',
        s?.has_transit === 1 ? '대중교통' : '',
        (s?.gpx_count ?? 0) > 0 ? 'GPX' : '',
      ].filter(Boolean),
      pop:         elev, // proxy
    }
  })
  } catch {
    return staticMountainsForHub()
  }
}

// ── 산 상세 페이지용 ──────────────────────────────
export interface MountainDetail {
  mountain: NonNullable<Awaited<ReturnType<typeof getMountainBySlug>>>
  courses:  Awaited<ReturnType<typeof getCoursesByMountainId>>
}

export async function getMountainBySlug(slug: string) {
  try {
  const { db } = await import('./index')
  const mountain = await db.query.mountains.findFirst({
    where: (t, { or, eq }) => or(
      eq(t.slug, slug),
      eq(t.name, slug),
    ),
  })
  return mountain ?? staticMountainBySlug(slug)
  } catch {
    return staticMountainBySlug(slug)
  }
}

export async function getCoursesByMountainId(mountainId: number) {
  try {
  const { db } = await import('./index')
  return db.select().from(schema.courses)
    .where(eq(schema.courses.mountain_id, mountainId))
    .orderBy(schema.courses.distance)
    .limit(20)
  } catch {
    return []
  }
}

// ── 스탯 (for homepage) ──────────────────────────────
export async function getSiteStats() {
  try {
  const { db } = await import('./index')
  const [mCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(schema.mountains)
    .where(eq(schema.mountains.is_top100, true))
  const [cCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(schema.courses)
  return { mountains: mCount?.count ?? 0, courses: cCount?.count ?? 0 }
  } catch {
    return { mountains: MOUNTAINS.length, courses: 0 }
  }
}
