import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Icon } from '@/components/icon'
import { POSTS, CATS, findPostBySlugOrId, getPostPath, getPostSlug, rewriteBlogLinks } from '@/lib/posts'
import { linkMountainNames } from '@/lib/mountain-link'
import { ShareButton } from '@/components/share-button'

interface Props { params: { id: string } }

const EXTERNAL_REFS: Record<string, { label: string; url: string }[]> = {
  '코스추천': [
    { label: '국립공원 탐방예약시스템', url: 'https://reservation.knps.or.kr' },
    { label: '산림청 공식 사이트', url: 'https://www.forest.go.kr' },
    { label: '기상청 날씨 예보', url: 'https://www.weather.go.kr' },
  ],
  '장비': [
    { label: '기상청 날씨 예보', url: 'https://www.weather.go.kr' },
    { label: '산림청 공식 사이트', url: 'https://www.forest.go.kr' },
    { label: '국립공원공단', url: 'https://www.knps.or.kr' },
  ],
  '안전': [
    { label: '국립공원공단 안전산행', url: 'https://www.knps.or.kr' },
    { label: '기상청 날씨 예보', url: 'https://www.weather.go.kr' },
    { label: '소방청 119 안전신고센터', url: 'https://www.nfa.go.kr' },
  ],
  '계절': [
    { label: '기상청 날씨 예보', url: 'https://www.weather.go.kr' },
    { label: '국립공원 탐방예약시스템', url: 'https://reservation.knps.or.kr' },
    { label: '산림청 공식 사이트', url: 'https://www.forest.go.kr' },
  ],
  '가이드': [
    { label: '산림청 공식 사이트', url: 'https://www.forest.go.kr' },
    { label: '두루누비 (국가 트레일 정보)', url: 'https://www.durunubi.kr' },
    { label: '국립공원공단', url: 'https://www.knps.or.kr' },
  ],
  '후기': [
    { label: '국립공원 탐방예약시스템', url: 'https://reservation.knps.or.kr' },
    { label: '기상청 날씨 예보', url: 'https://www.weather.go.kr' },
    { label: '산림청 공식 사이트', url: 'https://www.forest.go.kr' },
  ],
}

export function generateStaticParams() {
  const now = new Date()
  return POSTS
    .filter(p => !p.publishAt || new Date(p.publishAt) <= now)
    .map(p => ({ id: getPostSlug(p) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = findPostBySlugOrId(params.id)
  if (!post) return {}
  const ogUrl = `/og?title=${encodeURIComponent(post.title)}&type=blog&sub=${encodeURIComponent(post.cat)}`
  const path = getPostPath(post)
  return {
    title: post.title,
    description: post.excerpt,
    keywords: [...(post.badges ?? []), post.cat, '등산', '100대명산', '둘레길'],
    alternates: {
      canonical: `https://dullegilgogo.kr${path}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://dullegilgogo.kr${path}`,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogUrl],
    },
  }
}

function extractFaqPairs(body: string): { q: string; a: string }[] {
  const pairs: { q: string; a: string }[] = []
  const detailRe = /<details[^>]*>([\s\S]*?)<\/details>/gi
  let m: RegExpExecArray | null
  while ((m = detailRe.exec(body)) !== null) {
    const inner = m[1]
    const sumMatch = inner.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i)
    if (!sumMatch) continue
    const q = sumMatch[1].replace(/<[^>]+>/g, '').trim()
    const a = inner.replace(/<summary[^>]*>[\s\S]*?<\/summary>/i, '').replace(/<[^>]+>/g, '').trim()
    if (q && a) pairs.push({ q, a })
  }
  return pairs
}

export default function BlogDetailPage({ params }: Props) {
  const post = findPostBySlugOrId(params.id)
  if (!post) notFound()
  if (post.publishAt && new Date(post.publishAt) > new Date()) notFound()
  if (decodeURIComponent(params.id) !== getPostSlug(post)) {
    permanentRedirect(encodeURI(getPostPath(post)))
  }

  const cat = CATS[post.cat]
  const relatedPosts = POSTS.filter(p => p.id !== post.id && p.cat === post.cat).slice(0, 3)

  const now = new Date()
  const published = POSTS.filter(p => !p.publishAt || new Date(p.publishAt) <= now)
  const idx  = published.findIndex(p => p.id === post.id)
  const prev = idx > 0 ? published[idx - 1] : null
  const next = idx < published.length - 1 ? published[idx + 1] : null

  const postUrl = `https://dullegilgogo.kr${getPostPath(post)}`
  const faqPairs = post.body ? extractFaqPairs(post.body) : []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date.replace(/\./g, '-'),
        dateModified:  post.date.replace(/\./g, '-'),
        author: { '@type': 'Organization', name: '둘레길고고', url: 'https://dullegilgogo.kr' },
        publisher: { '@type': 'Organization', name: '둘레길고고', url: 'https://dullegilgogo.kr' },
        image: `https://dullegilgogo.kr/og?title=${encodeURIComponent(post.title)}&type=blog&sub=${encodeURIComponent(post.cat)}`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: 'https://dullegilgogo.kr' },
          { '@type': 'ListItem', position: 2, name: '블로그', item: 'https://dullegilgogo.kr/blog' },
          { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
        ],
      },
      ...(faqPairs.length > 0 ? [{
        '@type': 'FAQPage',
        mainEntity: faqPairs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      }] : []),
    ],
  }

  return (
    <div id="top">
      <SiteHeader active="blog" />
      <main id="main-content">
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

        {/* 아티클 본문 */}
        <article className="wrap wrap--narrow" style={{ paddingTop: 28, paddingBottom: 12 }}>
          {post.body && (() => {
            const toId = (t: string) => t.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w가-힣-]/g, '')
            const matches = [...post.body!.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)]
            if (matches.length < 2) return null
            return (
              <nav style={{ background:'var(--bg-warm)', border:'1px solid var(--line)', borderRadius:'var(--r)', padding:'20px 24px', marginBottom:28 }}>
                <div style={{ fontWeight:700, fontSize:14, color:'var(--forest)', marginBottom:12, letterSpacing:'.02em' }}>목차</div>
                <ol style={{ margin:0, padding:'0 0 0 20px', display:'flex', flexDirection:'column', gap:8 }}>
                  {matches.map((m, i) => (
                    <li key={i} style={{ fontSize:14.5, lineHeight:1.4 }}>
                      <a href={`#${toId(m[1])}`} style={{ color:'var(--ink-soft)', textDecoration:'none' }}>{m[1]}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            )
          })()}
          {post.body ? (
            <div className="prose" dangerouslySetInnerHTML={{ __html: linkMountainNames(
              rewriteBlogLinks(post.body).replace(/<h2([^>]*)>([^<]+)<\/h2>/g, (_, attrs, text) => {
                const id = text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w가-힣-]/g, '')
                return `<h2${attrs} id="${id}">${text}</h2>`
              })
            ) }} />
          ) : (
            <div style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--ink-soft)' }}>
              <p style={{ marginTop: 0 }}>{post.excerpt}</p>
              <div className="safety" style={{ margin: '28px 0' }}>
                <div className="safety__icon"><Icon name="warn" size={21} stroke={2} /></div>
                <div>
                  <h4>코스 정보는 참고용입니다</h4>
                  <p>본 글의 코스·소요시간은 공공데이터를 가공한 추정치이며 일부는 AI 보조로 작성되었습니다. 산행 전 <a href="https://www.weather.go.kr" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>기상청</a> 날씨와 <a href="https://www.forest.go.kr" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>산림청</a>·<a href="https://www.knps.or.kr" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>국립공원공단</a> 공식 통제정보를 반드시 확인하세요.</p>
                </div>
              </div>
            </div>
          )}
        </article>

        {/* 참고 자료 */}
        {(() => {
          const refs = EXTERNAL_REFS[post.cat] ?? EXTERNAL_REFS['가이드']
          return (
            <aside className="wrap wrap--narrow" style={{ paddingBottom: 4 }}>
              <div style={{ padding: '16px 20px', background: 'var(--bg-warm)', borderRadius: 'var(--r)', border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--forest)', marginBottom: 10 }}>참고 자료</div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
                  {refs.map(r => (
                    <li key={r.url}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer"
                        style={{ color: 'var(--forest)', fontSize: 13, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                        {r.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )
        })()}

        {/* 공유 + 이전/다음 */}
        <div className="wrap wrap--narrow" style={{ paddingTop: 32, paddingBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, paddingBottom: 24, borderBottom: '1px solid var(--line)' }}>
            <ShareButton title={post.title} url={postUrl} />
          </div>
          {(prev || next) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 24 }}>
              {prev ? (
                <Link href={getPostPath(prev)} className="card card--hover card--pad" style={{ textDecoration: 'none' }}>
                  <span className="cap" style={{ fontSize: 11 }}>← 이전 글</span>
                  <p style={{ margin: '6px 0 0', fontSize: 14, fontWeight: 700, color: 'var(--forest)', lineHeight: 1.4 }}>{prev.title}</p>
                </Link>
              ) : <div />}
              {next ? (
                <Link href={getPostPath(next)} className="card card--hover card--pad" style={{ textDecoration: 'none', textAlign: 'right' }}>
                  <span className="cap" style={{ fontSize: 11 }}>다음 글 →</span>
                  <p style={{ margin: '6px 0 0', fontSize: 14, fontWeight: 700, color: 'var(--forest)', lineHeight: 1.4 }}>{next.title}</p>
                </Link>
              ) : <div />}
            </div>
          )}
        </div>

        {/* 관련 글 */}
        {relatedPosts.length > 0 && (
          <section className="wrap" style={{ paddingTop: 8, paddingBottom: 8 }}>
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 32, marginBottom: 20 }}>
              <h2 className="h2" style={{ color: 'var(--forest)' }}>같은 카테고리 글</h2>
            </div>
            <div className="post-grid">
              {relatedPosts.map(p => (
                <Link
                  key={p.id}
                  href={getPostPath(p)}
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
