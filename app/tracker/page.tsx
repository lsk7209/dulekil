import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { TrackerClient } from './tracker-client'

export const metadata: Metadata = {
  title: '완등 트래커 — 100대 명산 진행 현황',
  description: '로그인 없이 브라우저에 완등 기록이 저장됩니다. 100대 명산 중 내가 오른 산을 체크하세요.',
}

export default function TrackerPage() {
  return (
    <div id="top">
      <SiteHeader active="tracker" />
      <TrackerClient />
      <SiteFooter />
    </div>
  )
}
