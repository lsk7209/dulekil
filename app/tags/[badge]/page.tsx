import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { POSTS, CATS, type CatKey } from '@/lib/posts'
import { ridgeCover } from '@/lib/motif'

export const revalidate = 3600

interface Props { params: { badge: string } }

function getAllBadges(): string[] {
  const freq: Record<string, number> = {}
  for (const p of POSTS) for (const b of (p.badges ?? [])) freq[b] = (freq[b] ?? 0) + 1
  return Object.keys(freq)
}

export async function generateStaticParams() {
  return getAllBadges().map(b => ({ badge: b }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const badge = decodeURIComponent(params.badge)
  const ogUrl = `/og?title=${encodeURIComponent('#' + badge + ' 등산 글 모음')}&type=default&sub=둘레길고고+매거진`
  return {
    title: `#${badge} 등산 관련 글 모음 | 둘레길고고`,
    description: `${badge} 관련 100대 명산 등산 가이드, 코스 추천, 안전 정보를 한곳에서 확인하세요.`,
    openGraph: {
      title: `#${badge} 등산 글 모음`,
      description: `${badge} 관련 등산 가이드 모음`,
      type: 'website',
      url: `https://dullegilgogo.kr/tags/${encodeURIComponent(badge)}`,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: `#${badge} 등산 글` }],
    },
    twitter: { card: 'summary_large_image', images: [ogUrl] },
    alternates: { canonical: `https://dullegilgogo.kr/tags/${encodeURIComponent(badge)}` },
  }
}

export default function TagPage({ params }: Props) {
  const badge = decodeURIComponent(params.badge)
  const now = new Date()
  const posts = POSTS.filter(p =>
    (!p.publishAt || new Date(p.publishAt) <= now) &&
    (p.badges ?? []).includes(badge)
  )

  if (posts.length === 0) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: `#${badge} 등산 관련 글 모음`,
        description: `${badge} 관련 100대 명산 등산 가이드 모음`,
        url: `https://dullegilgogo.kr/tags/${encodeURIComponent(badge)}`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: posts.length,
          itemListElement: posts.slice(0, 10).map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: p.title,
            url: `https://dullegilgogo.kr/blog/${p.id}`,
            description: p.excerpt,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: 'https://dullegilgogo.kr' },
          { '@type': 'ListItem', position: 2, name: '블로그', item: 'https://dullegilgogo.kr/blog' },
          { '@type': 'ListItem', position: 3, name: `#${badge}`, item: `https://dullegilgogo.kr/tags/${encodeURIComponent(badge)}` },
        ],
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader active="blog" />
      <main id="main-content">
        {/* 브레드크럼 */}
        <nav className="breadcrumb" aria-label="breadcrumb">
          <ol>
            <li><Link href="/">홈</Link></li>
            <li><Link href="/blog">블로그</Link></li>
            <li aria-current="page">#{badge}</li>
          </ol>
        </nav>

        {/* 헤더 */}
        <section className="wrap" style={{ paddingTop: 32, paddingBottom: 8 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>태그 모음</div>
          <h1 className="h1" style={{ marginBottom: 12 }}>#{badge}</h1>
          <p className="lead" style={{ marginBottom: 8 }}>
            {badge} 관련 등산 가이드 · 코스 추천 · 안전 정보 모음입니다.
          </p>
          <span style={{ fontSize: 13, color: 'var(--ink-faint)', fontWeight: 600 }}>{posts.length}편</span>
        </section>

        {/* 포스트 그리드 */}
        <section className="wrap" style={{ paddingTop: 24, paddingBottom: 48 }}>
          <div className="post-grid">
            {posts.map(p => {
              const cat = CATS[p.cat as CatKey]
              const coverHtml = ridgeCover({ seed: p.title, palette: p.pal, sun: p.pal === 'winter' ? '#C9763D' : null, w: 560, h: 256 })
              return (
                <Link key={p.id} href={`/blog/${p.id}`} className="card card--hover" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                  {/* 능선 커버 */}
                  <div style={{ position: 'relative', height: 128, overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0 }} dangerouslySetInnerHTML={{ __html: coverHtml }} />
                    <div style={{ position: 'absolute', left: 12, top: 12 }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        fontWeight: 700, fontSize: 12, letterSpacing: '.02em', lineHeight: 1,
                        padding: '6px 11px', borderRadius: 'var(--r-pill)',
                        background: cat.c, color: '#fff', whiteSpace: 'nowrap',
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                        {cat.label}
                      </span>
                    </div>
                  </div>
                  {/* 본문 */}
                  <div className="card--pad" style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                    <h2 className="h3" style={{ fontSize: 18, lineHeight: 1.4 }}>{p.title}</h2>
                    <p className="body" style={{ fontSize: 14, flex: 1, lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: 'var(--ink-soft)' }}>{p.excerpt}</p>
                    {p.badges && p.badges.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {p.badges.slice(0, 3).map(b => (
                          <Link key={b} href={`/tags/${encodeURIComponent(b)}`} className="tag" style={{ fontSize: 11 }} onClick={e => e.stopPropagation()}>
                            {b}
                          </Link>
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-faint)', fontSize: 13, fontWeight: 600 }}>
                      <span className="tnum">{p.date}</span>
                      <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-faint)' }} />
                      <span>{p.read}분 읽기</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* 관련 태그 */}
        <section className="wrap" style={{ paddingBottom: 48 }}>
          <h2 className="h3" style={{ marginBottom: 14, color: 'var(--forest)' }}>관련 글 보기</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link href="/blog" className="btn btn--outline btn--sm">전체 블로그</Link>
            <Link href="/list/beginner" className="btn btn--outline btn--sm">초보자 명산</Link>
            <Link href="/list/transit-accessible" className="btn btn--outline btn--sm">대중교통 명산</Link>
            <Link href="/mountains" className="btn btn--outline btn--sm">100대 명산 목록</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
