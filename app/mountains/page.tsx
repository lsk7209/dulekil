import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { MountainsClient } from './mountains-client'
import { getMountainsForHub } from '@/lib/db/queries'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '100대 명산 허브 — 난이도·지역·계절로 찾기',
  description: '산림청이 선정한 한국 100대 명산을 난이도·지역·대중교통·계절로 필터링해 내게 맞는 산을 찾아보세요.',
  alternates: { canonical: 'https://dullegilgogo.kr/mountains' },
}

export default async function MountainsPage() {
  const mountains = await getMountainsForHub()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: '한국 100대 명산 허브',
        description: '산림청 선정 한국 100대 명산 전체 목록. 난이도·지역·대중교통·계절별로 필터링 가능.',
        url: 'https://dullegilgogo.kr/mountains',
        mainEntity: {
          '@type': 'ItemList',
          name: '100대 명산 목록',
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
      <MountainsClient mountains={mountains} />
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  )
}
