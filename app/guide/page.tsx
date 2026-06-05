import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Icon } from '@/components/icon'

export const metadata: Metadata = {
  title: '등산 가이드 — 100대 명산 완등 가이드 모음 | 둘레길고고',
  description: '초보 입문부터 계절별 산행, 장비, 안전, 당일치기 계획까지. 100대 명산 챌린지에 필요한 가이드를 모았습니다.',
  alternates: { canonical: 'https://dullegilgogo.kr/guide' },
  openGraph: {
    title: '등산 가이드 모음 | 둘레길고고',
    description: '초보 입문부터 계절별 산행, 장비, 안전, 당일치기 계획까지.',
    type: 'website',
    url: 'https://dullegilgogo.kr/guide',
  },
}

const GUIDE_LIST = [
  {
    slug: 'beginner-100',
    title: '초보자를 위한 100대 명산 시작 가이드',
    desc: '100대 명산 챌린지를 처음 시작하는 분을 위한 완전 입문서. 산 선택부터 준비, 안전까지.',
    badges: ['초보', '입문', '필독'],
    icon: '🏔️',
  },
  {
    slug: 'gear-basics',
    title: '등산 장비 기초 가이드 — 초보자 필수 구비 목록',
    desc: '처음 등산을 시작하는 분을 위한 장비 선택 가이드. 등산화·배낭·의류 기준과 예산별 추천.',
    badges: ['장비', '등산화', '배낭'],
    icon: '🎒',
  },
  {
    slug: 'seasonal-hiking',
    title: '계절별 등산 준비 가이드 — 봄·여름·가을·겨울',
    desc: '계절마다 달라지는 등산 준비 사항. 봄 진달래부터 겨울 설경까지, 시즌별 핵심 포인트.',
    badges: ['봄', '여름', '가을', '겨울'],
    icon: '🍂',
  },
  {
    slug: 'safety-checklist',
    title: '산행 안전 체크리스트 — 출발 전 10분 점검',
    desc: '등산 사고의 대부분은 출발 전 확인으로 예방할 수 있습니다. 기상·장비·통제 정보 점검 순서.',
    badges: ['안전', '체크리스트'],
    icon: '✅',
  },
  {
    slug: 'one-day-plan',
    title: '당일치기 산행 계획법 — 코스 선택부터 귀가까지',
    desc: '당일 산행을 성공시키는 계획 수립 방법. 거리·고도·교통·식사 계획을 한 번에 잡는 법.',
    badges: ['당일치기', '계획'],
    icon: '🗓️',
  },
  {
    slug: 'transit-mountains',
    title: '대중교통으로 가는 명산 — 지하철·버스 들머리',
    desc: '차 없이도 오를 수 있는 100대 명산. 역에서 도보 30분 이내 들머리 정보를 정리했습니다.',
    badges: ['대중교통', '무차'],
    icon: '🚌',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      name: '등산 가이드 모음',
      description: '초보 입문부터 계절별 산행, 장비, 안전까지. 100대 명산 챌린지 가이드.',
      url: 'https://dullegilgogo.kr/guide',
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: GUIDE_LIST.length,
        itemListElement: GUIDE_LIST.map((g, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: g.title,
          url: `https://dullegilgogo.kr/guide/${g.slug}`,
          description: g.desc,
        })),
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '홈', item: 'https://dullegilgogo.kr' },
        { '@type': 'ListItem', position: 2, name: '가이드', item: 'https://dullegilgogo.kr/guide' },
      ],
    },
  ],
}

export default function GuidePage() {
  return (
    <div id="top">
      <SiteHeader />
      <main id="main-content">
        <section style={{ background: 'var(--bg-warm)', paddingTop: 36, paddingBottom: 32 }}>
          <div className="wrap wrap--narrow">
            <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ink-faint)', marginBottom: 20 }}>
              <Link href="/" style={{ color: 'var(--ink-faint)', textDecoration: 'none' }}>홈</Link>
              <Icon name="chevron" size={13} />
              <span style={{ color: 'var(--forest)', fontWeight: 600 }}>가이드</span>
            </nav>
            <div className="eyebrow" style={{ marginBottom: 12 }}>등산 가이드</div>
            <h1 className="h1" style={{ marginBottom: 16 }}>100대 명산 완등 가이드</h1>
            <p className="lead">초보 입문부터 계절별 산행, 장비 선택, 안전, 당일치기 계획까지 — 완등 챌린지에 필요한 가이드를 모았습니다.</p>
          </div>
        </section>

        <section className="wrap wrap--narrow" style={{ paddingTop: 32, paddingBottom: 64 }}>
          <div className="guide-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
            {GUIDE_LIST.map((g) => (
              <Link
                key={g.slug}
                href={`/guide/${g.slug}`}
                className="card card--hover card--pad"
                style={{ textDecoration: 'none', display: 'flex', gap: 16, alignItems: 'flex-start' }}
              >
                <div style={{
                  fontSize: 28, lineHeight: 1, flexShrink: 0,
                  width: 52, height: 52, display: 'grid', placeItems: 'center',
                  background: 'var(--bg-warm)', borderRadius: 'var(--r)',
                }}>
                  {g.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 className="h2" style={{ marginBottom: 8, fontSize: 18 }}>{g.title}</h2>
                  <p className="body" style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 10, lineHeight: 1.6 }}>{g.desc}</p>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {g.badges.map(b => <span key={b} className="tag" style={{ fontSize: 12 }}>{b}</span>)}
                  </div>
                </div>
                <span style={{ flexShrink: 0, color: 'var(--sage)', marginTop: 4, display: 'flex' }}><Icon name="arrow" size={18} /></span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteFooter />
    </div>
  )
}
