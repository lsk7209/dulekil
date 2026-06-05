import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BlogClient } from './blog-client'
import { POSTS } from '@/lib/posts'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '둘레길고고 매거진 · 다음 산을 고르는 안목',
  description: '코스 추천부터 장비·안전·계절 가이드까지. 완등 챌린지에 필요한 판단을 데이터 위에서 정리한 글 모음입니다.',
  alternates: { canonical: 'https://dullegilgogo.kr/blog' },
}

export default function BlogPage() {
  const now = new Date()
  const published = POSTS.filter(p =>
    !p.publishAt || new Date(p.publishAt) <= now
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: '둘레길고고 매거진',
        description: '코스 추천부터 장비·안전·계절 가이드까지. 완등 챌린지에 필요한 판단을 데이터 위에서 정리한 글 모음입니다.',
        url: 'https://dullegilgogo.kr/blog',
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: published.length,
          itemListElement: published.slice(0, 10).map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: p.title,
            url: `https://dullegilgogo.kr/blog/${p.id}`,
            description: p.excerpt,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: 'https://dullegilgogo.kr' },
          { '@type': 'ListItem', position: 2, name: '블로그', item: 'https://dullegilgogo.kr/blog' },
        ],
      },
    ],
  }

  return (
    <div id="top">
      <SiteHeader active="blog" />
      <BlogClient posts={published} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteFooter />
    </div>
  )
}
