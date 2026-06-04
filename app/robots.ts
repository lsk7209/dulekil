import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      // AI 크롤러 허용 (GEO 전략)
      { userAgent: 'GPTBot',        allow: '/' },
      { userAgent: 'ClaudeBot',     allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Googlebot',     allow: '/' },
    ],
    sitemap: 'https://dullegilgogo.kr/sitemap.xml',
  }
}
