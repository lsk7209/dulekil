import type { MetadataRoute } from 'next'
import { POSTS } from '@/lib/posts'

const BASE = 'https://dulekil.vercel.app'
const NOW  = new Date().toISOString()

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,              lastModified: NOW, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/blog`,    lastModified: NOW, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/mountains`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/tracker`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`,   lastModified: NOW, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/data-license`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.2 },
  ]

  const blogPages: MetadataRoute.Sitemap = POSTS.map(p => ({
    url:             `${BASE}/blog/${p.id}`,
    lastModified:    p.date.replace(/\./g, '-'),
    changeFrequency: 'monthly' as const,
    priority:        0.8,
  }))

  // DB에서 100대 명산 목록 가져오기
  let mountainPages: MetadataRoute.Sitemap = []
  try {
    const { getMountainsForHub } = await import('@/lib/db/queries')
    const mountains = await getMountainsForHub()
    mountainPages = mountains.map(m => ({
      url:             `${BASE}/mountains/${encodeURIComponent(m.name)}`,
      lastModified:    NOW,
      changeFrequency: 'weekly' as const,
      priority:        0.85,
    }))
  } catch {
    // DB 연결 실패 시 빈 목록
  }

  return [...staticPages, ...blogPages, ...mountainPages]
}
