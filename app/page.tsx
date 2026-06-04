import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { HomeClient } from './home-client'
import { getMountainsForHub } from '@/lib/db/queries'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '둘레길고고 — 100대 명산 챌린지 도우미',
  description: '완등 챌린지의 다음 한 걸음을 고르는 곳. 코스 난이도·거리·들머리 교통을 비교해, 오늘의 나에게 맞는 산을 찾으세요.',
}

export default async function HomePage() {
  const mountains = await getMountainsForHub()

  return (
    <div id="top">
      <SiteHeader active="explore" />
      <HomeClient mountains={mountains} />
      <SiteFooter />
    </div>
  )
}
