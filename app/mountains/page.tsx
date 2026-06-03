import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { MountainsClient } from './mountains-client'
import { getMountainsForHub } from '@/lib/db/queries'

export const revalidate = 3600  // 1시간 ISR

export const metadata: Metadata = {
  title: '100대 명산 허브 — 난이도·지역·계절로 찾기',
  description: '산림청이 선정한 한국 100대 명산을 난이도·지역·대중교통·계절로 필터링해 내게 맞는 산을 찾아보세요.',
}

export default async function MountainsPage() {
  const mountains = await getMountainsForHub()

  return (
    <div id="top">
      <SiteHeader active="explore" />
      <MountainsClient mountains={mountains} />
      <SiteFooter />
    </div>
  )
}
