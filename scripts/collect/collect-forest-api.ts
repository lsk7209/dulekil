/**
 * 산림청_명산등산로 API → mountains + courses 보강
 * Endpoint: https://api.forest.go.kr/openapi/service/cultureInfoService
 * 주의: 국내 IP에서만 접근 가능 → Vercel 배포 또는 VPN 환경에서 실행
 *
 * 1. mentrailSearchList: 산 이름으로 기본정보 검색
 * 2. mentrailList: 등산로 상세 조회
 */
import { db, schema } from './db-client'
import { config } from 'dotenv'
import { eq } from 'drizzle-orm'
import { parseStringPromise } from 'xml2js'

config({ path: '.env.local' })

const BASE = process.env.FOREST_API_BASE ?? 'https://api.forest.go.kr/openapi/service/cultureInfoService'
const KEY_ENC = process.env.FOREST_API_KEY_ENC!
const SOURCE = 'forest_api'

async function callXml(operation: string, params: Record<string, string>): Promise<unknown> {
  const extra = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
  const url = `${BASE}/${operation}?serviceKey=${KEY_ENC}&${extra}`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 dulekil' },
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${operation}`)
  const xml = await res.text()
  return parseStringPromise(xml, { explicitArray: false })
}

function extractItems(parsed: unknown): unknown[] {
  const body = (parsed as Record<string, unknown>)?.response?.body
  if (!body) return []
  const items = (body as Record<string, unknown>)?.items?.item
  if (!items) return []
  return Array.isArray(items) ? items : [items]
}

export async function collectForestMountain(mntnNm: string): Promise<number> {
  // 산 이름으로 등산로 목록 검색
  const parsed = await callXml('mentrailSearchList', {
    mntnNm,
    numOfRows: '20',
    pageNo: '1',
  })
  const items = extractItems(parsed) as Record<string, string>[]

  let upserted = 0
  for (const item of items) {
    // mountain upsert
    const nm = item.mntnNm ?? mntnNm
    let mtn = await db.query.mountains.findFirst({ where: (t, { eq }) => eq(t.name, nm) })
    if (!mtn) {
      const rows = await db.insert(schema.mountains).values({
        name: nm, slug: nm.replace(/\s+/g, ''), pal: 'forest',
      }).returning({ id: schema.mountains.id })
      mtn = { id: rows[0].id } as typeof mtn
    }

    // course upsert
    if (item.trailNm) {
      await db.insert(schema.courses).values({
        mountain_id:   mtn!.id,
        name:          item.trailNm,
        distance:      item.length  ? parseFloat(item.length)  : null,
        duration_up:   item.uptime  ? parseInt(item.uptime, 10) : null,
        duration_down: item.dntime  ? parseInt(item.dntime, 10) : null,
        diff_raw:      item.difficultyLevel ?? '',
        diff_norm:     normalizeDiff(item.difficultyLevel ?? ''),
        trailhead:     item.trailhead ?? '',
        source:        SOURCE,
      }).onConflictDoNothing()
      upserted++
    }
  }
  return upserted
}

function normalizeDiff(raw: string): string {
  if (raw === '하' || raw === '1' || raw === '쉬움') return '하'
  if (raw === '중' || raw === '2' || raw === '중간') return '중'
  if (raw === '상' || raw === '3' || raw === '어려움') return '상'
  return raw || '중'
}

async function main() {
  console.log('[collect-forest-api] 산림청 명산등산로 수집...')
  console.log('⚠️  이 스크립트는 국내 IP(Vercel/KR 서버)에서만 동작합니다.')

  // 100대 명산 목록 로드
  const top100 = await db.query.mountains.findMany({
    where: (t, { eq }) => eq(t.is_top100, true),
    columns: { name: true },
  })
  console.log(`100대 명산 ${top100.length}개 대상`)

  let total = 0
  for (const m of top100) {
    try {
      const n = await collectForestMountain(m.name)
      total += n
      process.stdout.write(`\r${m.name}: +${n}건 (합계 ${total})`)
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'TimeoutError') {
        console.log(`\n⚠️  ${m.name} 타임아웃 — 국내 IP 확인 필요`)
        break
      }
      console.error(`\n[${m.name}] 오류:`, e)
    }
    await new Promise(r => setTimeout(r, 200)) // rate guard
  }

  console.log(`\n✅ 완료 — ${total}건 보강`)
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
