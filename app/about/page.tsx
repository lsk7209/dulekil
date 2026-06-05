import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

const OG_URL = '/og?title=둘레길고고+소개&type=default&sub=100대+명산+정보+사이트'

export const metadata: Metadata = {
  title: '사이트 소개 | 둘레길고고',
  description: '둘레길고고 — 한국 100대 명산 완등 챌린지를 위한 코스·둘레길 정보 사이트 소개',
  alternates: { canonical: 'https://dullegilgogo.kr/about' },
  openGraph: {
    title: '둘레길고고 소개',
    description: '한국 100대 명산 완등 챌린지를 위한 코스·둘레길 정보 사이트',
    type: 'website',
    url: 'https://dullegilgogo.kr/about',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: '둘레길고고 소개' }],
  },
  twitter: { card: 'summary_large_image', images: [OG_URL] },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://dullegilgogo.kr/#organization',
      name: '둘레길고고',
      url: 'https://dullegilgogo.kr',
      description: '한국 산림청 선정 100대 명산 완등 챌린지를 위한 코스·둘레길 정보 사이트',
      foundingDate: '2025',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'lsk7209@gmail.com',
        contactType: 'customer support',
        availableLanguage: 'Korean',
      },
    },
    {
      '@type': 'WebPage',
      name: '둘레길고고 소개',
      url: 'https://dullegilgogo.kr/about',
      description: '둘레길고고 — 한국 100대 명산 완등 챌린지를 위한 코스·둘레길 정보 사이트 소개',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '홈', item: 'https://dullegilgogo.kr' },
        { '@type': 'ListItem', position: 2, name: '소개', item: 'https://dullegilgogo.kr/about' },
      ],
    },
  ],
}

export default function AboutPage() {
  return (
    <div id="top">
      <SiteHeader />
      <main id="main-content" className="wrap wrap--narrow" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>소개</div>
        <h1 className="h1" style={{ marginBottom: 24 }}>둘레길고고 소개</h1>

        <div className="body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <p>
            <b>둘레길고고</b>는 <a href="https://www.forest.go.kr" target="_blank" rel="noopener noreferrer">한국 산림청</a>이 선정한 100대 명산 완등 챌린지에 도전하는 등산객을 위한 정보 사이트입니다.
            &ldquo;집에서 다음에 어느 산을 갈지 계획하는 단계&rdquo;를 돕습니다.
          </p>
          <p>
            코스 난이도·거리·소요시간·들머리 대중교통 정보를 한 곳에서 비교하고,
            가입 없이 완등 기록을 브라우저에 저장할 수 있습니다.
          </p>
          <p>
            모든 코스 정보는 공공데이터(<a href="https://www.data.go.kr" target="_blank" rel="noopener noreferrer">data.go.kr</a>, <a href="https://www.forest.go.kr" target="_blank" rel="noopener noreferrer">산림청</a>, <a href="https://www.visitkorea.or.kr" target="_blank" rel="noopener noreferrer">한국관광공사</a>)를 가공해 제공합니다.
            일부 설명은 AI가 보조 작성한 데이터 가공물입니다.
          </p>

          <div className="safety" style={{ marginTop: 8 }}>
            <div>
              <h4>데이터 출처</h4>
              <p>
                <a href="https://www.data.go.kr/data/15029184/fileData.do" target="_blank" rel="noopener noreferrer">전국등산로표준데이터</a> (data.go.kr ID: 15029184, 공공누리 제1유형) ·{' '}
                <a href="https://www.durunubi.kr" target="_blank" rel="noopener noreferrer">한국관광공사 두루누비</a> ·{' '}
                <a href="https://www.forest.go.kr" target="_blank" rel="noopener noreferrer">산림청 명산등산로</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteFooter />
    </div>
  )
}
