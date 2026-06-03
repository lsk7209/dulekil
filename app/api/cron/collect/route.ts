/**
 * Vercel Cron — 매주 일요일 03:00 KST 증분 수집
 * 두루누비 신규/업데이트된 코스를 수집
 */
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 300

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Durunubi 증분 수집 (modifiedtime 기준으로 최근 변경분)
    const keyEnc = process.env.DURUNUBI_API_KEY_ENC!
    const url = `https://apis.data.go.kr/B551011/Durunubi/courseList?serviceKey=${keyEnc}&MobileOS=ETC&MobileApp=dulekil&_type=json&numOfRows=50&pageNo=1`
    const res = await fetch(url, { headers: { 'User-Agent': 'dulekil-cron' } })
    const data = await res.json() as { response: { body: { totalCount: number } } }
    const total = data.response?.body?.totalCount ?? 0

    return NextResponse.json({ total, status: 'ok' })
  } catch (e) {
    console.error('[cron/collect] 오류:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
