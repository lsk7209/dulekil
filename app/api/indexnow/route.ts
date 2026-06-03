/**
 * IndexNow — 신규/업데이트 URL을 Bing·Naver에 즉시 알림
 * POST /api/indexnow with { urls: string[] }
 */
import { NextResponse } from 'next/server'

const INDEXNOW_KEY = process.env.INDEXNOW_KEY
const HOST         = 'dulekil.vercel.app'

export async function POST(req: Request) {
  if (!INDEXNOW_KEY) {
    return NextResponse.json({ error: 'INDEXNOW_KEY not set' }, { status: 500 })
  }

  const { urls } = await req.json() as { urls: string[] }
  if (!urls?.length) return NextResponse.json({ error: 'urls required' }, { status: 400 })

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
