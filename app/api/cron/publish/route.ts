/**
 * Vercel Cron — 매일 06:00 KST 드립피드
 * 품질 게이트 통과한 pages를 최대 20건 published로 전환
 */
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 300

export async function GET(req: Request) {
  // Vercel Cron 인증 확인
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 동적 import — 빌드 시 DB 연결 방지
    const { db } = await import('@/lib/db/index')
    const { pages } = await import('@/lib/db/schema')
    const { eq, and, lte, isNull } = await import('drizzle-orm')
    const { sql } = await import('drizzle-orm')

    // quality_passed이면서 아직 published 아닌 것 최대 20건
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
    for (const page of toPublish) {
      await db
        .update(pages)
        .set({ status: 'published', published_at: now })
        .where(eq(pages.id, page.id))
    }

    return NextResponse.json({
      published: toPublish.length,
      slugs: toPublish.map(p => p.slug),
    })
  } catch (e) {
    console.error('[cron/publish] 오류:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
