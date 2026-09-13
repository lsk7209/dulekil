/**
 * P5 — 드립피드 발행
 * 품질 게이트 통과(quality_passed) 페이지를 최대 20건/일 published로 전환
 * 발행 완료 후 IndexNow 자동 전송 (Bing/Naver)
 */
import { db, schema } from '../collect/db-client'
import { eq, and } from 'drizzle-orm'
import { notifyIndexNow } from '../../lib/indexnow'
import { automaticPublicationBlockReason, pageSlugToPublicPath } from '../../lib/publication-policy'

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
  const eligible = toPublish.filter(page => automaticPublicationBlockReason(page) === null)
  if (eligible.length === 0) {
    console.error('발행 차단: 현재 pages 레코드에는 출처 확인 및 사람 승인 필드가 없습니다.')
    console.error('DB 쓰기와 IndexNow 전송 없이 종료합니다.')
    process.exit(2)
  }
  const now = new Date()
  const publishedUrls: string[] = []

  let publishedCount = 0
  for (const page of eligible) {
    const claimed = await db.transaction(async tx => {
      const rows = await tx
        .update(schema.pages)
        .set({ status: 'published', published_at: now, updated_at: now })
        .where(and(
          eq(schema.pages.id, page.id),
          eq(schema.pages.status, 'quality_passed'),
          eq(schema.pages.gate_passed, true),
        ))
        .returning({ id: schema.pages.id })

      if (rows.length !== 1) return false
      await tx.insert(schema.publishLog).values({ page_id: page.id, channel: 'actions' })
      return true
    })

    if (!claimed) {
      console.log(`  - 건너뜀(다른 실행기가 선점): ${page.slug}`)
      continue
    }

    publishedCount += 1
    console.log(`  ✓ ${page.slug}`)

    const publicPath = page.slug ? pageSlugToPublicPath(page.slug) : null
    if (publicPath) publishedUrls.push(`${BASE}${publicPath}`)
  }

  console.log(`\n✅ ${publishedCount}건 발행 완료`)

  // IndexNow 자동 전송
  if (publishedUrls.length > 0) {
    await notifyIndexNow(publishedUrls)
  }

  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
