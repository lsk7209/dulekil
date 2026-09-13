/**
 * IndexNow — 신규/업데이트 URL을 Bing·Naver에 즉시 알림
 * POST /api/indexnow with { urls: string[] }
 */
import { NextResponse } from 'next/server'
import { isAuthorizedCronRequest } from '@/lib/cron-auth'
import { normalizeIndexNowUrls } from '@/lib/indexing-policy'

const INDEXNOW_KEY = '0d7b842a4db14d0ea1650b0d99a4a7be6c81213f2a48d4c2a6b0f3e7d9a5c1b0'
const HOST         = 'dullegilgogo.kr'

export async function POST(req: Request) {
  if (!isAuthorizedCronRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!INDEXNOW_KEY) {
    return NextResponse.json({ error: 'INDEXNOW_KEY not set' }, { status: 500 })
  }

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'invalid JSON' }, { status: 400 }) }
  const urls = normalizeIndexNowUrls((body as { urls?: unknown })?.urls)
  if (!urls) return NextResponse.json({ error: '1-100 dullegilgogo.kr HTTPS URLs required' }, { status: 400 })

  const payload = {
    host:    HOST,
    key:     INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  }

  // Bing에 전송
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  })

  return NextResponse.json({ status: res.status, urls: urls.length })
}
