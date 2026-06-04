import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Icon } from '@/components/icon'

interface GuideContent {
  title: string
  description: string
  sections: { heading: string; body: string }[]
  faq: { q: string; a: string }[]
}

const GUIDES: Record<string, GuideContent> = {
  'beginner-100': {
    title: '초보자를 위한 100대 명산 시작 가이드',
    description: '100대 명산 챌린지를 처음 시작하는 분을 위한 완전 입문서. 산 선택부터 준비, 안전까지.',
    sections: [
      {
        heading: '100대 명산이란?',
        body: '산림청이 2002년 선정한 한국의 대표 명산 100곳입니다. 경관·역사·문화적 가치를 기준으로 선정됐으며, 전국 각 지역에 고르게 분포해 있습니다. 완등에 특별한 자격이나 등록은 필요 없습니다.',
      },
      {
        heading: '어느 산부터 시작할까?',
        body: '처음에는 난이도 \'하\' 또는 \'중\'으로 분류된 산을 선택하세요. 관악산(632m), 청계산(618m), 계룡산(845m) 등 대중교통으로 접근 가능한 수도권·충청 산이 입문에 적합합니다. 고산(1,400m 이상)은 체력이 쌓인 후 도전하세요.',
      },
      {
        heading: '필수 준비물',
        body: '등산화(발목 보호), 배낭(20~30L), 물 1.5L 이상, 간식, 우비, 비상 연락처. 겨울에는 아이젠·장갑·보온 의류를 추가합니다. 등산 스틱은 하산 시 무릎 보호에 효과적입니다.',
      },
      {
        heading: '안전 수칙',
        body: '출발 전 기상청 산악날씨와 산림청·국립공원 통제정보를 확인하세요. 일몰 1~2시간 전 하산을 시작하고, 혼자 산행 시 지인에게 행선지를 알리세요. 무리한 코스 변경은 피하고 계획한 루트를 지켜주세요.',
      },
    ],
    faq: [
      { q: '100대 명산 완등 인증을 받을 수 있나요?', a: '한국산악회, 블랙야크 등 민간 단체에서 인증 프로그램을 운영합니다. 각 단체 홈페이지를 통해 신청할 수 있습니다.' },
      { q: '초보자도 100대 명산에 오를 수 있나요?', a: '네, 100대 명산 중에는 난이도가 낮고 거리가 짧은 산이 많습니다. 체력에 맞게 선택하면 초보자도 충분히 도전할 수 있습니다.' },
      { q: '100대 명산을 다 오르는 데 얼마나 걸리나요?', a: '개인 페이스에 따라 다르지만, 연간 10~20개씩 오른다면 5~10년 내에 완등이 가능합니다. 매주 1회 꾸준히 산행하는 분들은 3~5년에 완주하기도 합니다.' },
    ],
  },
  'transit-mountains': {
    title: '대중교통으로 가는 명산 — 지하철·버스 들머리 모음',
    description: '차 없이도 오를 수 있는 100대 명산. 역에서 도보 30분 이내 들머리 정보를 정리했습니다.',
    sections: [
      {
        heading: '수도권 대중교통 명산',
        body: '관악산(서울대입구역), 청계산(청계산입구역), 북한산(구파발역), 도봉산(도봉산역), 수락산(당고개역), 불암산(별내역)은 지하철역에서 도보 10~15분 내로 들머리에 닿을 수 있는 대표적인 대중교통 산행지입니다.',
      },
      {
        heading: '지방 대중교통 명산',
        body: '계룡산(대전 시내버스), 금정산(부산 도시철도), 무등산(광주 시내버스), 내장산(정읍역 버스)처럼 지방 광역시에서도 대중교통으로 접근 가능한 명산들이 있습니다.',
      },
      {
        heading: '당일치기 주의사항',
        body: '대중교통 이용 시 막차 시간을 반드시 확인하세요. 특히 지방 노선은 주말 막차가 이른 경우가 있습니다. 하산 후 최소 30분의 여유를 두고 이동 계획을 세우는 것이 좋습니다.',
      },
    ],
    faq: [
      { q: '가장 접근성 좋은 대중교통 명산은?', a: '관악산(2호선 서울대입구역 도보 12분), 청계산(신분당선 청계산입구역 도보 8분)이 가장 접근하기 쉽습니다.' },
      { q: '설악산도 대중교통으로 갈 수 있나요?', a: '속초시외버스터미널에서 설악동행 시내버스를 이용할 수 있습니다. 서울에서 속초까지는 고속버스 약 2시간 30분 소요됩니다.' },
    ],
  },
}

export function generateStaticParams() {
  return Object.keys(GUIDES).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const guide = GUIDES[params.slug]
  if (!guide) return {}
  return {
    title: guide.title,
    description: guide.description,
  }
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = GUIDES[params.slug]
  if (!guide) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    publisher: { '@type': 'Organization', name: '둘레길고고' },
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: guide.faq.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  }

  return (
    <div id="top">
      <SiteHeader />
      <main>
        <section style={{ background: 'var(--bg-warm)', paddingTop: 36, paddingBottom: 32 }}>
          <div className="wrap wrap--narrow">
            <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ink-faint)', marginBottom: 20 }}>
              <Link href="/" style={{ color: 'var(--ink-faint)', textDecoration: 'none' }}>홈</Link>
              <Icon name="chevron" size={13} />
              <Link href="/blog" style={{ color: 'var(--ink-faint)', textDecoration: 'none' }}>가이드</Link>
            </nav>
            <div className="eyebrow" style={{ marginBottom: 12 }}>가이드</div>
            <h1 className="h1" style={{ marginBottom: 16 }}>{guide.title}</h1>
            <p className="lead">{guide.description}</p>
          </div>
        </section>

        <div className="wrap wrap--narrow" style={{ paddingTop: 16, paddingBottom: 8 }}>
          <div className="ad ad--leaderboard"><span className="ad__label">광고 · 리더보드</span></div>
        </div>

        <article className="wrap wrap--narrow" style={{ paddingTop: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {guide.sections.map(s => (
              <section key={s.heading}>
                <h2 className="h3" style={{ marginBottom: 12, color: 'var(--forest)' }}>{s.heading}</h2>
                <p className="body">{s.body}</p>
              </section>
            ))}

            <div className="ad ad--infeed"><span className="ad__label">광고 · 본문 인피드</span></div>

            <section>
              <h2 className="h3" style={{ marginBottom: 20 }}>자주 묻는 질문</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {guide.faq.map(f => (
                  <div key={f.q} style={{ borderBottom: '1px solid var(--line-soft)', paddingBottom: 16 }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: 'var(--forest)' }}>Q. {f.q}</h3>
                    <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: 'var(--ink-soft)' }}>{f.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="safety">
              <div className="safety__icon"><Icon name="warn" size={21} stroke={2} /></div>
              <div>
                <h4>산행 전 공식 정보를 확인하세요</h4>
                <p>본 가이드의 코스 정보는 공공데이터를 가공한 참고 자료입니다. 실제 산행 전 산림청·국립공원 공식 통제정보를 반드시 확인하세요.</p>
              </div>
            </div>
          </div>
        </article>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteFooter />
    </div>
  )
}
