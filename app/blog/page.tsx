import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BlogClient } from './blog-client'
import { POSTS } from '@/lib/posts'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '둘레길고고 매거진 · 다음 산을 고르는 안목',
  description: '코스 추천부터 장비·안전·계절 가이드까지. 완등 챌린지에 필요한 판단을 데이터 위에서 정리한 글 모음입니다.',
}

export default function BlogPage() {
  const now = new Date()
  const published = POSTS.filter(p =>
    !p.publishAt || new Date(p.publishAt) <= now
  )

  return (
    <div id="top">
      <SiteHeader active="blog" />
      <BlogClient posts={published} />
      <SiteFooter />
    </div>
  )
}
