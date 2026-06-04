/**
 * P5 — 드립피드 발행
 * 품질 게이트 통과(quality_passed) 페이지를 최대 20건/일 published로 전환
 * 발행 완료 후 IndexNow 자동 전송 (Bing/Naver)
 */
import { db, schema } from '../collect/db-client'
import { eq, and } from 'drizzle-orm'
import { notifyIndexNow } from '../../lib/indexnow'

const DAILY_LIMIT = 20
const BASE        = 'https://dullegilgogo.kr'

async function main() {
  console.log('[drip-feed] 발행 대기 확인...')

  const toPublish = await db
    .select()
    .from(schema.pages)
    .where(and(
      eq(schema.pages.gate_passed, true),
      eq(schema.pages.status, 'quality_passed'),
    ))
    .limit(DAILY_LIMIT)

  if (toPublish.length === 0) {
    console.log('발행 대기 없음 — 종료')
    process.exit(0)
  }

  console.log(`발행 대기: ${toPublish.length}건`)
  const now = new Date()
  const publishedUrls: string[] = []

  for (const page of toPublish) {
    await db
      .update(schema.pages)
      .set({ status: 'published', published_at: now })
      .where(eq(schema.pages.id, page.id))

    await db.insert(schema.publishLog).values({ page_id: page.id, channel: 'actions' })
    console.log(`  ✓ ${page.slug}`)

    if (page.slug) {
      publishedUrls.push(`${BASE}/mountains/${encodeURIComponent(page.slug)}`)
    }
  }

  console.log(`\n✅ ${toPublish.length}건 발행 완료`)

  // IndexNow 자동 전송
  if (publishedUrls.length > 0) {
    await notifyIndexNow(publishedUrls)
  }

  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
