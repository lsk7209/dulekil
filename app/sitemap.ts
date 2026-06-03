import type { MetadataRoute } from 'next'
import { POSTS } from '@/lib/posts'
import { MOUNTAINS } from '@/lib/mountains-static'

const BASE = 'https://dulekil.com'
const NOW  = new Date().toISOString()

export default function sitemap(): MetadataRoute.Sitemap {
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
    changeFrequency: 'monthly',
    priority:        0.8,
  }))

  const mountainPages: MetadataRoute.Sitemap = MOUNTAINS.map(m => ({
    url:             `${BASE}/mountains/${encodeURIComponent(m.region.split(' ')[0])}/${encodeURIComponent(m.name)}`,
    lastModified:    NOW,
    changeFrequency: 'weekly',
    priority:        0.85,
  }))

  return [...staticPages, ...blogPages, ...mountainPages]
}
