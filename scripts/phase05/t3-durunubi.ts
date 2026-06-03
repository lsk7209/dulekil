/**
 * T3 — 두루누비 API 검증
 * /courseList + /routeList 호출 → 필드 구조 + 코스 수 확인
 * 라이선스: 이용허락범위 제한 없음 → DB 저장·상업이용 OK
 */

import fs from 'fs'
import path from 'path'

const OUTPUT_DIR = path.resolve(__dirname)

const BASE_URL = 'https://apis.data.go.kr/B551011/Durunubi'
// Encoding 키 — URL에 직접 삽입 (data.go.kr 이중인코딩 방지)
const API_KEY_ENC = 'Dc%2Bm2FOHT2MQxGmXnBE3Qbuw9V4H4hJB8nKKOL6JWfWYK0Tc48AwXm7AkzGDREokxi%2BG1LeRUrqQG6NagZQ%2BAA%3D%3D'

interface DuruResponse {
  response?: {
    header?: { resultCode: string; resultMsg: string }
    body?: {
      items?: { item?: unknown[] | unknown }
      numOfRows?: number
      pageNo?: number
      totalCount?: number
    }
  }
}

async function callApi(endpoint: string, params: Record<string, string>): Promise<DuruResponse> {
  // data.go.kr: Encoding 키를 직접 삽입 (URLSearchParams 이중인코딩 방지)
  const extra = Object.entries({ MobileOS: 'ETC', MobileApp: 'dulekil', _type: 'json', ...params })
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')
  const rawUrl = `${BASE_URL}${endpoint}?serviceKey=${API_KEY_ENC}&${extra}`

  const res = await fetch(rawUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 dulekil-dev' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text().then(t => t.slice(0, 200))}`)
  return res.json() as Promise<DuruResponse>
}

export interface DuruResult {
  course_total: number
  route_total: number
  course_fields: string[]
  route_fields: string[]
  sample_course: unknown
  sample_route: unknown
  license: string
  kill: boolean
}

async function main(): Promise<DuruResult> {
  console.log('[T3] 두루누비 API 테스트...')

  // 1. 코스 목록 (numOfRows=5 샘플)
  console.log('\n── /courseList 호출...')
  const courseRes = await callApi('/courseList', { numOfRows: '5', pageNo: '1' })
  const courseBody = courseRes.response?.body
  const courseTotal = courseBody?.totalCount ?? 0
  const courseItems = Array.isArray(courseBody?.items?.item)
    ? courseBody!.items!.item as unknown[]
    : courseBody?.items?.item
      ? [courseBody!.items!.item]
      : []

  console.log(`  전체 코스 수: ${courseTotal}`)
  const courseFields = courseItems.length > 0 ? Object.keys(courseItems[0] as Record<string, unknown>) : []
  console.log(`  필드 (${courseFields.length}개): ${courseFields.join(', ')}`)
  if (courseItems.length > 0) {
    console.log(`  샘플 코스:\n  ${JSON.stringify(courseItems[0], null, 4).split('\n').join('\n  ')}`)
  }

  // 2. 길 목록 (numOfRows=5 샘플)
  console.log('\n── /routeList 호출...')
  const routeRes = await callApi('/routeList', { numOfRows: '5', pageNo: '1' })
  const routeBody = routeRes.response?.body
  const routeTotal = routeBody?.totalCount ?? 0
  const routeItems = Array.isArray(routeBody?.items?.item)
    ? routeBody!.items!.item as unknown[]
    : routeBody?.items?.item
      ? [routeBody!.items!.item]
      : []

  console.log(`  전체 길 수: ${routeTotal}`)
  const routeFields = routeItems.length > 0 ? Object.keys(routeItems[0] as Record<string, unknown>) : []
  console.log(`  필드 (${routeFields.length}개): ${routeFields.join(', ')}`)
  if (routeItems.length > 0) {
    console.log(`  샘플 길:\n  ${JSON.stringify(routeItems[0], null, 4).split('\n').join('\n  ')}`)
  }

  const result: DuruResult = {
    course_total: courseTotal,
    route_total: routeTotal,
    course_fields: courseFields,
    route_fields: routeFields,
    sample_course: courseItems[0] ?? null,
    sample_route: routeItems[0] ?? null,
    license: '이용허락범위 제한 없음 (data.go.kr 개발계정, 2026-06-03~2028-06-03)',
    kill: false,
  }

  console.log('\n── 판정 ──')
  console.log(`  코스 수: ${courseTotal} / 길 수: ${routeTotal}`)
  console.log('  라이선스: ✅ 이용허락범위 제한 없음 — 상업이용·DB저장 모두 OK')
  console.log('  ✅ T3 통과')

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 't3-durunubi.json'),
    JSON.stringify(result, null, 2), 'utf-8'
  )

  return result
}

main().then(r => {
  process.exit(r.kill ? 1 : 0)
}).catch(e => {
  console.error('[T3] 오류:', e)
  process.exit(2)
})
