import { NextResponse } from 'next/server'
import { POSTS, getPostPath } from '@/lib/posts'
import { notifyIndexNow } from '@/lib/indexnow'
import { notifyGoogleIndexing } from '@/lib/gsc-indexing'
import { submitAndVerifyGscSitemap } from '@/lib/gsc-sitemap'

export const runtime = 'nodejs'
export const maxDuration = 60

const BASE = 'https://dullegilgogo.kr'
const SITEMAP = `${BASE}/sitemap.xml`

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const windowMs = 5.5 * 60 * 60 * 1000
  const newlyPublished = POSTS.filter(p => {
    if (!p.publishAt) return false
    const pub = new Date(p.publishAt)
    return pub <= now && pub > new Date(now.getTime() - windowMs)
  })

  if (newlyPublished.length === 0) {
    return NextResponse.json({ notified: 0, message: 'No newly published posts' })
  }

  const urls = newlyPublished.map(p => `${BASE}${getPostPath(p)}`)

  const [indexnow, googleIndexing, gscSitemap] = await Promise.allSettled([
    notifyIndexNow(urls),
    notifyGoogleIndexing(urls),
    submitAndVerifyGscSitemap(),
  ])

  console.log(`[blog-notify] submitted ${urls.length} URLs:`, urls)

  return NextResponse.json({
    notified: urls.length,
    posts: newlyPublished.map(p => p.id),
    sitemap: SITEMAP,
    results: {
      indexnow,
      googleIndexing,
      gscSitemap,
    },
  })
}
