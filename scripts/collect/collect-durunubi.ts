/**
 * P2 — 두루누비 API → Turso trails 테이블
 * /courseList 전체 수집 (260개 코스, 일일 1000 트래픽 제한)
 * 라이선스: 이용허락범위 제한 없음
 */
import { db, schema } from './db-client'
import { config } from 'dotenv'

config({ path: '.env.local' })

const BASE_URL = 'https://apis.data.go.kr/B551011/Durunubi'
const API_KEY_ENC = process.env.DURUNUBI_API_KEY_ENC!
const PAGE_SIZE  = 100
const SOURCE     = 'durunubi'

function toSlug(name: string, idx: string): string {
  const base = name.replace(/\s+/g, '-').replace(/[^가-힣a-zA-Z0-9-]/g, '')
  return `${base}-${idx.slice(-6)}`
}

async function fetchPage(page: number): Promise<{ items: unknown[]; total: number }> {
  const url = `${BASE_URL}/courseList?serviceKey=${API_KEY_ENC}&MobileOS=ETC&MobileApp=dulekil&_type=json&numOfRows=${PAGE_SIZE}&pageNo=${page}`
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 dulekil' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json() as {
    response: {
      header: { resultCode: string }
      body: { items: { item: unknown[] | unknown }; totalCount: number }
    }
  }
  const body = json.response.body
  const items = Array.isArray(body.items.item) ? body.items.item : body.items.item ? [body.items.item] : []
  return { items, total: body.totalCount }
}

async function main() {
  console.log('[collect-durunubi] 두루누비 코스 수집 시작...')

  // 체크포인트 확인
  const cp = await db.query.collectCheckpoints.findFirst({
    where: (t, { eq }) => eq(t.source, SOURCE),
  })
  if (cp?.status === 'done') {
    console.log('✅ 이미 완료됨. 재수집하려면 체크포인트를 수동으로 reset하세요.')
    process.exit(0)
  }

  // 1페이지로 totalCount 확인
  const { total } = await fetchPage(1)
  const pages = Math.ceil(total / PAGE_SIZE)
  console.log(`총 ${total}건, ${pages}페이지`)

  let upserted = 0

  for (let p = 1; p <= pages; p++) {
    const { items } = await fetchPage(p)

    for (const item of items) {
      const i = item as Record<string, string>
      await db.insert(schema.trails).values({
        crs_idx:       i.crsIdx,
        route_idx:     i.routeIdx,
        name:          i.crsKorNm,
        distance:      parseInt(i.crsDstnc ?? '0', 10) || null,
        duration:      parseInt(i.crsTotlRqrmHour ?? '0', 10) || null,
        level:         i.crsLevel,
        cycle_type:    i.crsCycle,
        sigun:         i.sigun,
        slug:          toSlug(i.crsKorNm, i.crsIdx),
        contents:      i.crsContents,
        summary:       i.crsSummary,
        tour_info:     i.crsTourInfo,
        traveler_info: i.travelerinfo,
        gpx_url:       i.gpxpath,
        brd_div:       i.brdDiv,
        source_modified: i.modifiedtime,
      }).onConflictDoUpdate({
        target: schema.trails.crs_idx,
        set: {
          name:            i.crsKorNm,
          distance:        parseInt(i.crsDstnc ?? '0', 10) || null,
          duration:        parseInt(i.crsTotlRqrmHour ?? '0', 10) || null,
          level:           i.crsLevel,
          sigun:           i.sigun,
          contents:        i.crsContents,
          gpx_url:         i.gpxpath,
          source_modified: i.modifiedtime,
        },
      })
      upserted++
    }

    process.stdout.write(`\r[${p}/${pages}] ${upserted}건 완료`)
    if (p < pages) await new Promise(r => setTimeout(r, 300)) // rate guard
  }

  await db.insert(schema.collectCheckpoints)
    .values({ source: SOURCE, last_offset: total, total, status: 'done' })
    .onConflictDoUpdate({
      target: schema.collectCheckpoints.source,
      set: { last_offset: total, total, status: 'done' },
    })

  console.log(`\n✅ 두루누비 ${upserted}건 수집 완료`)
  process.exit(0)
}

main().catch(e => { console.error('\n[collect-durunubi] 오류:', e); process.exit(1) })
