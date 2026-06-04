/**
 * Vercel Cron — 매일 06:00 KST 드립피드
 * 품질 게이트 통과한 pages를 최대 20건 published로 전환
 * 발행 완료 후 IndexNow 자동 전송
 */
import { NextResponse } from 'next/server'
import { notifyIndexNow } from '@/lib/indexnow'

export const runtime    = 'nodejs'
export const maxDuration = 300

const BASE = 'https://dullegilgogo.kr'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { db }     = await import('@/lib/db/index')
    const { pages }  = await import('@/lib/db/schema')
    const { eq, and } = await import('drizzle-orm')

    const toPublish = await db
      .select()
      .from(pages)
      .where(and(
        eq(pages.gate_passed, true),
        eq(pages.status, 'quality_passed')
      ))
      .limit(20)

    if (toPublish.length === 0) {
      return NextResponse.json({ published: 0, message: '발행 대기 없음' })
    }

    const now = new Date()
    const publishedUrls: string[] = []

    for (const page of toPublish) {
      await db
        .update(pages)
        .set({ status: 'published', published_at: now })
        .where(eq(pages.id, page.id))

      if (page.slug) {
        publishedUrls.push(`${BASE}/mountains/${encodeURIComponent(page.slug)}`)
      }
    }

    // IndexNow 자동 전송
    await notifyIndexNow(publishedUrls)

    return NextResponse.json({
      published: toPublish.length,
      slugs:     toPublish.map(p => p.slug),
      indexnow:  publishedUrls.length,
    })
  } catch (e) {
    console.error('[cron/publish] 오류:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
