import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { MountainsClient } from './mountains-client'
import { getMountainsForHubSnapshot } from '@/lib/db/queries'
import { DataSourceNotice } from '@/components/data-source-notice'
import { canPublishDatabaseDerivedData } from '@/lib/data-source-publication'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '등록 산 허브 — 지역·계절로 찾기',
  description: '현재 등록된 산 후보를 지역·대중교통·계절 정보로 살펴보세요. 명산 목록 소속과 산행 조건은 원문 출처 확인이 필요합니다.',
  alternates: { canonical: 'https://dullegilgogo.kr/mountains' },
}

export default async function MountainsPage() {
  const mountainSnapshot = await getMountainsForHubSnapshot()
  const mountains = mountainSnapshot.mountains

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: '등록 산 정보 허브',
        description: '현재 등록된 산 후보를 지역·대중교통·계절 정보로 살펴보는 목록.',
        url: 'https://dullegilgogo.kr/mountains',
        mainEntity: {
          '@type': 'ItemList',
          name: '현재 등록 산 후보 목록',
          numberOfItems: mountains.length,
          itemListElement: mountains.slice(0, 20).map((m, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: m.name,
            url: `https://dullegilgogo.kr/mountains/${encodeURIComponent(m.name)}`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: 'https://dullegilgogo.kr' },
          { '@type': 'ListItem', position: 2, name: '100대 명산', item: 'https://dullegilgogo.kr/mountains' },
        ],
      },
    ],
  }

  return (
    <div id="top">
      <SiteHeader active="explore" />
      <DataSourceNotice state={mountainSnapshot.state} />
      <MountainsClient mountains={mountains} />
      <SiteFooter />
      {canPublishDatabaseDerivedData(mountainSnapshot.state) && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
    </div>
  )
}
