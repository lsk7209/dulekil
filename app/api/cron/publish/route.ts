/**
 * Vercel Cron — 매일 06:00 KST 드립피드
 * 품질 게이트 통과한 pages를 최대 20건 published로 전환
 * 발행 완료 후 IndexNow + Google Indexing API 자동 전송
 */
import { NextResponse } from 'next/server'
import { notifyIndexNow } from '@/lib/indexnow'
import { notifyGoogleIndexing } from '@/lib/gsc-indexing'
import { automaticPublicationBlockReason, pageSlugToPublicPath } from '@/lib/publication-policy'
import { isAuthorizedCronRequest } from '@/lib/cron-auth'

export const runtime    = 'nodejs'
export const maxDuration = 300

const BASE = 'https://dullegilgogo.kr'

export async function GET(req: Request) {
  if (!isAuthorizedCronRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { db }     = await import('@/lib/db/index')
    const { pages, publishLog }  = await import('@/lib/db/schema')
    const { eq, and } = await import('drizzle-orm')

    const toPublish = await db
      .select()
      .from(pages)
      .where(and(
        eq(pages.gate_passed, true),
        eq(pages.status, 'quality_passed')
      ))
      .limit(20)

    const eligible = toPublish.filter(page => automaticPublicationBlockReason(page) === null)
    if (toPublish.length > 0 && eligible.length === 0) {
      return NextResponse.json({
        published: 0,
        blocked: toPublish.length,
        reason: 'source and human-review fields are not present in the current publication record',
      }, { status: 409 })
    }

    if (toPublish.length === 0) {
      return NextResponse.json({ published: 0, message: '발행 대기 없음' })
    }

    const now = new Date()
    const publishedUrls: string[] = []

    const claimedPages = []
    for (const page of eligible) {
      const claimed = await db.transaction(async tx => {
        const rows = await tx
          .update(pages)
          .set({ status: 'published', published_at: now, updated_at: now })
          .where(and(
            eq(pages.id, page.id),
            eq(pages.status, 'quality_passed'),
            eq(pages.gate_passed, true),
          ))
          .returning({ id: pages.id })

        if (rows.length !== 1) return false
        await tx.insert(publishLog).values({ page_id: page.id, channel: 'vercel-cron' })
        return true
      })

      if (!claimed) continue
      claimedPages.push(page)

      const publicPath = page.slug ? pageSlugToPublicPath(page.slug) : null
      if (publicPath) publishedUrls.push(`${BASE}${publicPath}`)
    }

    // IndexNow + Google Indexing API 병렬 전송
    await Promise.allSettled([
      notifyIndexNow(publishedUrls),
      notifyGoogleIndexing(publishedUrls),
    ])

    return NextResponse.json({
      published: claimedPages.length,
      skippedConcurrent: eligible.length - claimedPages.length,
      slugs:     claimedPages.map(p => p.slug),
      indexnow:  publishedUrls.length,
    })
  } catch (e) {
    console.error('[cron/publish] 오류:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
