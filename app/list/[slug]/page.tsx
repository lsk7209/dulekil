import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getMountainsForHub } from '@/lib/db/queries'
import { FILLERS, getFillerBySlug } from '@/lib/fillers-static'
import { DIFF_META } from '@/lib/mountains-static'

export const revalidate = 86400

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return FILLERS.map(f => ({ slug: f.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const filler = getFillerBySlug(params.slug)
  if (!filler) return {}
  const ogUrl = `/og?title=${encodeURIComponent(filler.title)}&type=mountain&sub=100대+명산+모음`
  return {
    title: `${filler.title} | 둘레길고고`,
    description: filler.description,
    openGraph: {
      title: filler.title,
      description: filler.description,
      type: 'website',
      url: `https://dullegilgogo.kr/list/${params.slug}`,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: filler.title }],
    },
    twitter: { card: 'summary_large_image', images: [ogUrl] },
    alternates: { canonical: `https://dullegilgogo.kr/list/${params.slug}` },
  }
}

export default async function FillerPage({ params }: Props) {
  const filler = getFillerBySlug(params.slug)
  if (!filler) notFound()

  const all = await getMountainsForHub()
  const mountains = filler.sortBy
    ? all.filter(filler.filter).sort(filler.sortBy)
    : all.filter(filler.filter)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: filler.h1,
        description: filler.description,
        numberOfItems: mountains.length,
        itemListElement: mountains.slice(0, 10).map((m, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: m.name,
          url: `https://dullegilgogo.kr/mountains/${encodeURIComponent(m.name)}`,
          description: m.description ?? `${m.region} 해발 ${m.elev}m`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: 'https://dullegilgogo.kr' },
          { '@type': 'ListItem', position: 2, name: '100대 명산', item: 'https://dullegilgogo.kr/mountains' },
          { '@type': 'ListItem', position: 3, name: filler.h1, item: `https://dullegilgogo.kr/list/${params.slug}` },
        ],
      },
    ],
  }

  // 관련 filler 목록 (자신 제외, 최대 5개)
  const related = FILLERS.filter(f => f.slug !== params.slug).slice(0, 5)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main id="main-content" className="filler-page">
        {/* ── 브레드크럼 ── */}
        <nav className="breadcrumb" aria-label="breadcrumb">
          <ol>
            <li><Link href="/">홈</Link></li>
            <li><Link href="/mountains">100대 명산</Link></li>
            <li aria-current="page">{filler.h1}</li>
          </ol>
        </nav>

        {/* ── 헤더 ── */}
        <header className="filler-header">
          <h1>{filler.h1}</h1>
          <p className="filler-intro">{filler.intro}</p>
          <span className="filler-count">{mountains.length}개 산</span>
        </header>

        {/* ── 산 목록 ── */}
        <section className="filler-list" aria-label="명산 목록">
          {mountains.length === 0 ? (
            <p className="filler-empty">해당하는 산이 없습니다.</p>
          ) : (
            <ol className="filler-mountain-list">
              {mountains.map((m, i) => {
                const diff = m.diff
                const diffCls = DIFF_META[diff]?.cls ?? 'mid'
                return (
                  <li key={m.slug} className="filler-mountain-item">
                    <span className="filler-rank">{i + 1}</span>
                    <Link href={`/mountains/${encodeURIComponent(m.name)}`} className="filler-mountain-link">
                      <div className="filler-mountain-info">
                        <strong className="filler-mountain-name">{m.name}</strong>
                        <span className="filler-mountain-meta">
                          {m.region} · {m.elev.toLocaleString()}m
                        </span>
                      </div>
                      <div className="filler-mountain-tags">
                        <span className={`chip chip--diff chip--${diffCls}`}>{diff}</span>
                        {m.transit && <span className="chip chip--transit">대중교통</span>}
                        {m.gpx && <span className="chip chip--gpx">GPX</span>}
                      </div>
                      <span className="filler-mountain-dist">{m.dist}km · {m.time}</span>
                    </Link>
                  </li>
                )
              })}
            </ol>
          )}
        </section>

        {/* ── 안전 고지 ── */}
        <div className="safety" role="note">
          <div className="safety__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div>
            <h4>안전 산행 안내</h4>
            <p>입산 전 <a href="https://www.weather.go.kr" target="_blank" rel="noopener noreferrer">기상청</a> 날씨와 <a href="https://www.forest.go.kr" target="_blank" rel="noopener noreferrer">산림청</a> 통제 여부를 반드시 확인하세요. 일몰 1~2시간 전 하산을 시작하고, 단독 산행 시 행선지를 지인에게 알려두세요.</p>
          </div>
        </div>

        {/* ── 데이터 출처 ── */}
        <p className="data-source">
          데이터 출처:{' '}
          <a href="https://www.data.go.kr" target="_blank" rel="noopener noreferrer">공공데이터포털</a>{' · '}
          <a href="https://www.forest.go.kr" target="_blank" rel="noopener noreferrer">산림청</a>{' · '}
          <a href="https://www.visitkorea.or.kr" target="_blank" rel="noopener noreferrer">한국관광공사</a>
          {' '}(공공누리 제1유형)
        </p>

        {/* ── 관련 모음 ── */}
        <section className="filler-related">
          <h2>다른 명산 모음</h2>
          <ul className="filler-related-list">
            {related.map(f => (
              <li key={f.slug}>
                <Link href={`/list/${f.slug}`}>{f.h1}</Link>
              </li>
            ))}
            <li><Link href="/mountains">전체 100대 명산 보기</Link></li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
