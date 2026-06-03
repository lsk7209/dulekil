/**
 * P2 — mountain.zip GeoJSON → Turso DB
 *
 * 전략: 2932개 GeoJSON zip을 순회. (MNTN_NM, PMNTN_NM) 단위로
 * 등산로 세그먼트를 집계해 mountains + courses 테이블에 적재.
 * 체크포인트로 중단/재개 지원.
 */
import AdmZip from 'adm-zip'
import path from 'path'
import { db, schema } from './db-client'
import { eq, and } from 'drizzle-orm'

const MOUNTAIN_ZIP = path.resolve(__dirname, '../../docs/mountain.zip')
const BATCH = 50   // 체크포인트 저장 간격 (처리된 zip 수)
const SOURCE = 'mountain_zip'

interface Segment {
  MNTN_NM: string
  PMNTN_NM: string
  PMNTN_SN: number
  PMNTN_DFFL: string
  PMNTN_LT: number
  PMNTN_UPPL: number
  PMNTN_GODN: number
  PMNTN_MTRQ: string
  PMNTN_RISK: string
}

type CourseAgg = {
  name: string
  pmntn_sn: number
  distance: number
  duration_up: number
  duration_down: number
  diff_counts: Record<string, number>
  surface: string
  risk: string
  has_gpx: boolean
}

function normalize(v: unknown): string { return String(v ?? '').trim() }
function toNum(v: unknown): number { const n = parseFloat(String(v ?? 0)); return isNaN(n) ? 0 : n }

function normalizeDiff(raw: string): string {
  const d = raw.trim()
  if (d === '쉬움'  || d === '하' || d === '1') return '하'
  if (d === '중간'  || d === '중' || d === '2') return '중'
  if (d === '어려움' || d === '상' || d === '3') return '상'
  if (d === '매우어려움' || d === '매우상' || d === '4') return '매우상'
  return d || '중'
}

function toSlug(name: string): string {
  return name.replace(/\s+/g, '').replace(/[^가-힣a-zA-Z0-9-]/g, '')
}

function modeKey(counts: Record<string, number>): string {
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? ''
}

/** JSON에서 세그먼트 배열 추출 */
function parseGeoJsonSegments(buf: Buffer): Segment[] {
  const json = JSON.parse(buf.toString('utf-8'))
  const features: unknown[] = json.features || []
  return features.map((f: unknown) => {
    const a = (f as { attributes: Record<string, unknown> }).attributes || {}
    return {
      MNTN_NM:    normalize(a['MNTN_NM']),
      PMNTN_NM:   normalize(a['PMNTN_NM']),
      PMNTN_SN:   toNum(a['PMNTN_SN']),
      PMNTN_DFFL: normalize(a['PMNTN_DFFL']),
      PMNTN_LT:   toNum(a['PMNTN_LT']),
      PMNTN_UPPL: toNum(a['PMNTN_UPPL']),
      PMNTN_GODN: toNum(a['PMNTN_GODN']),
      PMNTN_MTRQ: normalize(a['PMNTN_MTRQ']),
      PMNTN_RISK: normalize(a['PMNTN_RISK']),
    }
  }).filter(s => s.MNTN_NM && s.PMNTN_NM)
}

/** 세그먼트 배열 → (코스이름 → 집계) */
function aggregateCourses(segments: Segment[]): CourseAgg[] {
  const map = new Map<string, CourseAgg>()

  for (const s of segments) {
    const key = s.PMNTN_NM
    if (!map.has(key)) {
      map.set(key, {
        name: s.PMNTN_NM, pmntn_sn: s.PMNTN_SN,
        distance: 0, duration_up: 0, duration_down: 0,
        diff_counts: {}, surface: '', risk: '', has_gpx: false,
      })
    }
    const agg = map.get(key)!
    agg.distance     += s.PMNTN_LT
    agg.duration_up  += s.PMNTN_UPPL
    agg.duration_down += s.PMNTN_GODN
    if (s.PMNTN_DFFL) agg.diff_counts[s.PMNTN_DFFL] = (agg.diff_counts[s.PMNTN_DFFL] || 0) + 1
    if (!agg.surface && s.PMNTN_MTRQ) agg.surface = s.PMNTN_MTRQ
    if (!agg.risk    && s.PMNTN_RISK) agg.risk    = s.PMNTN_RISK
  }
  return [...map.values()]
}

async function getOrCreateMountain(name: string): Promise<number> {
  const existing = await db.query.mountains.findFirst({
    where: (t, { eq }) => eq(t.name, name),
  })
  if (existing) return existing.id

  const slug = toSlug(name)
  const rows = await db.insert(schema.mountains)
    .values({ name, slug, pal: 'forest' })
    .onConflictDoNothing()
    .returning({ id: schema.mountains.id })

  if (rows.length > 0) return rows[0].id

  // 동시 삽입 경쟁 → 다시 조회
  const retry = await db.query.mountains.findFirst({
    where: (t, { eq }) => eq(t.name, name),
  })
  return retry!.id
}

async function upsertCourses(mountainId: number, courses: CourseAgg[], hasGpx: boolean) {
  for (const c of courses) {
    const diffRaw  = modeKey(c.diff_counts)
    const diffNorm = normalizeDiff(diffRaw)

    // (mountain_id, name) 중복 시 통계 누적 업데이트
    await db.insert(schema.courses).values({
      mountain_id:   mountainId,
      pmntn_sn:      c.pmntn_sn,
      name:          c.name,
      distance:      parseFloat(c.distance.toFixed(2)),
      duration_up:   Math.round(c.duration_up),
      duration_down: Math.round(c.duration_down),
      diff_raw:      diffRaw,
      diff_norm:     diffNorm,
      surface:       c.surface,
      risk_note:     c.risk,
      gpx_available: hasGpx,
      tier:          hasGpx ? 'A' : 'B',
      source:        'mountain_zip',
    }).onConflictDoNothing()
  }
}

async function loadCheckpoint(): Promise<number> {
  const cp = await db.query.collectCheckpoints.findFirst({
    where: (t, { eq }) => eq(t.source, SOURCE),
  })
  return cp?.last_offset ?? 0
}

async function saveCheckpoint(offset: number, total: number) {
  await db.insert(schema.collectCheckpoints)
    .values({ source: SOURCE, last_offset: offset, total, status: 'running' })
    .onConflictDoUpdate({
      target: schema.collectCheckpoints.source,
      set: { last_offset: offset, total, status: 'running' },
    })
}

async function main() {
  console.log('[parse-mountain-zip] mountain.zip → DB 적재 시작...')

  const outer = new AdmZip(MOUNTAIN_ZIP)
  const geojsonEntries = outer.getEntries().filter(e => e.entryName.endsWith('_geojson.zip'))
  const gpxSet = new Set(
    outer.getEntries()
      .filter(e => e.entryName.endsWith('_gpx.zip'))
      .map(e => e.entryName.replace('_gpx.zip', '').replace('mountain/', ''))
  )
  const total = geojsonEntries.length

  const startOffset = await loadCheckpoint()
  console.log(`총 ${total}개 GeoJSON zip. 시작 오프셋: ${startOffset}`)

  let inserted = 0
  let skipped  = 0

  for (let i = startOffset; i < total; i++) {
    const ge = geojsonEntries[i]
    const code = ge.entryName.replace('mountain/', '').replace('_geojson.zip', '')
    const hasGpx = gpxSet.has(code)

    const gjBuf = outer.readFile(ge)
    if (!gjBuf) { skipped++; continue }

    const gjInner = new AdmZip(gjBuf)
    let allSegments: Segment[] = []

    for (const inner of gjInner.getEntries()) {
      if (inner.entryName.includes('SPOT') || !inner.entryName.endsWith('.json')) continue
      const content = gjInner.readFile(inner)
      if (!content) continue
      try { allSegments = allSegments.concat(parseGeoJsonSegments(content)) }
      catch { /* skip malformed */ }
    }

    if (allSegments.length === 0) { skipped++; continue }

    // 산별 그룹화
    const byMountain = new Map<string, Segment[]>()
    for (const s of allSegments) {
      if (!byMountain.has(s.MNTN_NM)) byMountain.set(s.MNTN_NM, [])
      byMountain.get(s.MNTN_NM)!.push(s)
    }

    for (const [mntnNm, segs] of byMountain) {
      const mountainId = await getOrCreateMountain(mntnNm)
      const courses = aggregateCourses(segs)
      await upsertCourses(mountainId, courses, hasGpx)
      inserted += courses.length
    }

    // 체크포인트 저장
    if ((i + 1) % BATCH === 0 || i === total - 1) {
      await saveCheckpoint(i + 1, total)
      process.stdout.write(`\r[${i + 1}/${total}] 코스 ${inserted}건 적재, 스킵 ${skipped}건`)
    }
  }

  // 완료 마킹
  await db.insert(schema.collectCheckpoints)
    .values({ source: SOURCE, last_offset: total, total, status: 'done' })
    .onConflictDoUpdate({
      target: schema.collectCheckpoints.source,
      set: { last_offset: total, total, status: 'done' },
    })

  console.log(`\n✅ 완료 — 코스 ${inserted}건 적재, 스킵 ${skipped}건`)
  process.exit(0)
}

main().catch(e => { console.error('\n[parse-mountain-zip] 오류:', e); process.exit(1) })
