import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { HomeClient } from './home-client'
import { getMountainsForHub } from '@/lib/db/queries'
import { POSTS } from '@/lib/posts'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '둘레길고고 — 100대 명산 챌린지 도우미',
  description: '완등 챌린지의 다음 한 걸음을 고르는 곳. 코스 난이도·거리·들머리 교통을 비교해, 오늘의 나에게 맞는 산을 찾으세요.',
  alternates: { canonical: 'https://dullegilgogo.kr' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://dullegilgogo.kr/#website',
      url: 'https://dullegilgogo.kr',
      name: '둘레길고고',
      description: '한국 100대 명산 완등 챌린지를 위한 코스·둘레길 정보 사이트',
      inLanguage: 'ko',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://dullegilgogo.kr/mountains?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://dullegilgogo.kr/#organization',
      name: '둘레길고고',
      url: 'https://dullegilgogo.kr',
      description: '산림청 선정 한국 100대 명산 정보 제공 사이트',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'lsk7209@gmail.com',
        contactType: 'customer support',
        availableLanguage: 'Korean',
      },
    },
  ],
}

export default async function HomePage() {
  const mountains = await getMountainsForHub()
  const now = new Date()
  const publishedPosts = POSTS.filter(p => !p.publishAt || new Date(p.publishAt) <= now)
  const latestPosts    = publishedPosts.slice(0, 4)
  const postCount      = publishedPosts.length

  return (
    <div id="top">
      <SiteHeader active="explore" />
      <HomeClient mountains={mountains} latestPosts={latestPosts} postCount={postCount} />
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  )
}
