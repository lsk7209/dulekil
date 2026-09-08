import type { MetadataRoute } from 'next'
import { CATS, POSTS, getPostModifiedDate, getPostPath } from '@/lib/posts'
import { FILLERS } from '@/lib/fillers-static'

const GUIDE_SLUGS = [
  'beginner-100',
  'transit-mountains',
  'gear-basics',
  'seasonal-hiking',
  'safety-checklist',
  'one-day-plan',
]

const BASE = 'https://dullegilgogo.kr'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,              changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/blog`,    changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/guide`,   changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/mountains`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/tracker`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`,        changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/contact`,      changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/data-license`, changeFrequency: 'monthly', priority: 0.2 },
    { url: `${BASE}/privacy`,      changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${BASE}/terms`,        changeFrequency: 'yearly',  priority: 0.2 },
  ]

  const now = new Date()
  const blogPages: MetadataRoute.Sitemap = POSTS
    .filter(p => !p.publishAt || new Date(p.publishAt) <= now)
    .map(p => ({
      url:             `${BASE}${getPostPath(p)}`,
      lastModified:    getPostModifiedDate(p),
      changeFrequency: 'monthly' as const,
      priority:        0.8,
    }))

  const tagCounts = new Map<string, number>()
  for (const post of POSTS.filter(p => !p.publishAt || new Date(p.publishAt) <= now)) {
    for (const badge of post.badges ?? []) tagCounts.set(badge, (tagCounts.get(badge) ?? 0) + 1)
  }

  const tagPages: MetadataRoute.Sitemap = [...tagCounts]
    .filter(([, count]) => count > 0)
    .map(([badge, count]) => ({
      url:             `${BASE}/tags/${encodeURIComponent(badge)}`,
      changeFrequency: 'weekly' as const,
      priority:        Math.min(0.65, 0.35 + count * 0.02),
    }))

  // DB에서 100대 명산 목록 가져오기
  let mountainPages: MetadataRoute.Sitemap = []
  try {
    const { getMountainsForHub } = await import('@/lib/db/queries')
    const mountains = await getMountainsForHub()
    mountainPages = mountains.map(m => ({
      url:             `${BASE}/mountains/${encodeURIComponent(m.name)}`,
      changeFrequency: 'weekly' as const,
      priority:        0.85,
    }))
  } catch {
    // DB 연결 실패 시 빈 목록
  }

  const guidePages: MetadataRoute.Sitemap = GUIDE_SLUGS.map(slug => ({
    url:             `${BASE}/guide/${slug}`,
    changeFrequency: 'monthly' as const,
    priority:        0.7,
  }))

  const categoryPages: MetadataRoute.Sitemap = Object.keys(CATS).map(cat => ({
    url:             `${BASE}/blog/category/${encodeURIComponent(cat)}`,
    changeFrequency: 'weekly' as const,
    priority:        0.7,
  }))

  const fillerPages: MetadataRoute.Sitemap = FILLERS.map(f => ({
    url:             `${BASE}/list/${f.slug}`,
    changeFrequency: 'monthly' as const,
    priority:        0.75,
  }))

  return [...staticPages, ...blogPages, ...tagPages, ...categoryPages, ...mountainPages, ...guidePages, ...fillerPages]
}
