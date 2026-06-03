import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Icon } from '@/components/icon'
import { POSTS, CATS } from '@/lib/posts'

interface Props { params: { id: string } }

export function generateStaticParams() {
  return POSTS.map(p => ({ id: p.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = POSTS.find(p => p.id === params.id)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: 'article' },
  }
}

export default function BlogDetailPage({ params }: Props) {
  const post = POSTS.find(p => p.id === params.id)
  if (!post) notFound()

  const cat = CATS[post.cat]
  const relatedPosts = POSTS.filter(p => p.id !== post.id && p.cat === post.cat).slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date.replace(/\./g, '-'),
    publisher: { '@type': 'Organization', name: '둘레길', url: 'https://dulekil.com' },
  }

  return (
    <div id="top">
      <SiteHeader active="blog" />
      <main>
        {/* 아티클 헤더 */}
        <section style={{ background: 'var(--bg-warm)', paddingTop: 36, paddingBottom: 32 }}>
          <div className="wrap wrap--narrow">
            {/* 브레드크럼 */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ink-faint)', marginBottom: 20 }}>
              <Link href="/" style={{ color: 'var(--ink-faint)', textDecoration: 'none' }}>홈</Link>
              <Icon name="chevron" size={13} />
              <Link href="/blog" style={{ color: 'var(--ink-faint)', textDecoration: 'none' }}>블로그</Link>
              <Icon name="chevron" size={13} />
              <span style={{ color: cat.c, fontWeight: 600 }}>{cat.label}</span>
            </nav>

            <div style={{ marginBottom: 14 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontWeight: 700, fontSize: 12, letterSpacing: '.02em',
                padding: '6px 11px', borderRadius: 'var(--r-pill)',
                background: cat.bg, color: cat.c,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: cat.c }} />
                {cat.label}
              </span>
            </div>
            <h1 className="h1" style={{ marginBottom: 16 }}>{post.title}</h1>
            <p className="lead" style={{ marginBottom: 20, maxWidth: 680 }}>{post.excerpt}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-faint)', fontSize: 13, fontWeight: 600 }}>
              <span className="tnum">{post.date}</span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-faint)' }} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Icon name="clock" size={13} stroke={1.8} />{post.read}분 읽기
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
              {post.badges.map(b => <span key={b} className="tag">{b}</span>)}
            </div>
          </div>
        </section>

        {/* 광고 슬롯 — 리더보드 */}
        <div className="wrap wrap--narrow" style={{ paddingTop: 16, paddingBottom: 4 }}>
          <div className="ad ad--leaderboard"><span className="ad__label">광고 · 리더보드</span></div>
        </div>

        {/* 아티클 본문 (현재는 요약 표시, P3 Gemini 보강 후 교체) */}
        <article className="wrap wrap--narrow" style={{ paddingTop: 28, paddingBottom: 12 }}>
          <div style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--ink-soft)' }}>
            <p style={{ marginTop: 0 }}>{post.excerpt}</p>
            <div className="safety" style={{ margin: '28px 0' }}>
              <div className="safety__icon"><Icon name="warn" size={21} stroke={2} /></div>
              <div>
                <h4>코스 정보는 참고용입니다</h4>
                <p>본 글의 코스·소요시간은 공공데이터를 가공한 추정치이며 일부는 AI 보조로 작성되었습니다. 산행 전 날씨·체력·장비를 점검하고 산림청·국립공원 공식 통제정보를 반드시 확인하세요.</p>
              </div>
            </div>
          </div>
        </article>

        {/* 광고 슬롯 — 인피드 */}
        <div className="wrap wrap--narrow" style={{ paddingTop: 4, paddingBottom: 28 }}>
          <div className="ad ad--infeed"><span className="ad__label">광고 · 본문 인피드</span></div>
        </div>

        {/* 관련 글 */}
        {relatedPosts.length > 0 && (
          <section className="wrap" style={{ paddingTop: 8, paddingBottom: 8 }}>
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 32, marginBottom: 20 }}>
              <h2 className="h3" style={{ color: 'var(--forest)' }}>같은 카테고리 글</h2>
            </div>
            <div className="post-grid">
              {relatedPosts.map(p => (
                <Link
                  key={p.id}
                  href={`/blog/${p.id}`}
                  className="card card--hover card--pad"
                  style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  <span className="h3" style={{ fontSize: 17 }}>{p.title}</span>
                  <p className="body" style={{ fontSize: 14 }}>{p.excerpt}</p>
                  <span className="cap tnum">{p.date}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteFooter />
    </div>
  )
}
