/**
 * Vercel Cron — 5시간마다 실행 (0 0,5,10,15,20 * * *)
 * 새로 공개된 블로그 포스트를 IndexNow(Bing/Naver) + Google Indexing API로 알림
 */
import { NextResponse } from 'next/server'
import { POSTS } from '@/lib/posts'
import { notifyIndexNow } from '@/lib/indexnow'
import { notifyGoogleIndexing } from '@/lib/gsc-indexing'

export const runtime     = 'nodejs'
export const maxDuration = 60

const BASE = 'https://dullegilgogo.kr'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now      = new Date()
  const windowMs = 5.5 * 60 * 60 * 1000  // 5.5시간 윈도우

  const newlyPublished = POSTS.filter(p => {
    if (!p.publishAt) return false
    const pub = new Date(p.publishAt)
    return pub <= now && pub > new Date(now.getTime() - windowMs)
  })

  if (newlyPublished.length === 0) {
    return NextResponse.json({ notified: 0, message: '새로 공개된 글 없음' })
  }

  const urls = newlyPublished.map(p => `${BASE}/blog/${p.id}`)

  // IndexNow (Bing/Naver) + Google Indexing API 병렬 전송
  await Promise.allSettled([
    notifyIndexNow(urls),
    notifyGoogleIndexing(urls),
  ])

  console.log(`[blog-notify] ${urls.length}개 전송:`, urls)

  return NextResponse.json({
    notified: urls.length,
    posts:    newlyPublished.map(p => p.id),
  })
}
