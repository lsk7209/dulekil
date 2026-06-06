'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/icon'
import { ridgeCover, contour } from '@/lib/motif'
import { CATS, getPostPath, type Post, type CatKey } from '@/lib/posts'

const ALL_CATS = ['전체', ...Object.keys(CATS)] as const
type FilterCat = '전체' | CatKey

/* ---- 카테고리 색 태그 ---- */
function CatTag({ cat, solid }: { cat: CatKey; solid?: boolean }) {
  const c = CATS[cat]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontWeight: 700, fontSize: 12, letterSpacing: '.02em', lineHeight: 1,
      padding: '6px 11px', borderRadius: 'var(--r-pill)', whiteSpace: 'nowrap',
      background: solid ? c.c : c.bg,
      color: solid ? '#fff' : c.c,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: solid ? '#fff' : c.c }} />
      {c.label}
    </span>
  )
}

/* ---- 날짜·읽기시간 메타 ---- */
function Meta({ p }: { p: Post }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-faint)', fontSize: 13, fontWeight: 600 }}>
      <span className="tnum">{p.date}</span>
      <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-faint)' }} />
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
        <Icon name="clock" size={13} stroke={1.8} />{p.read}분 읽기
      </span>
    </div>
  )
}

/* ---- 능선 커버 SVG ---- */
function RidgeCover({ seed, pal, sun, height = 150, children }: {
  seed: string
  pal: string
  sun?: boolean
  height?: number
  children?: React.ReactNode
}) {
  const html = ridgeCover({ seed, palette: pal, sun: sun ? '#C9763D' : null, w: 560, h: height * 2 })
  return (
    <div style={{ position: 'relative', height, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }} dangerouslySetInnerHTML={{ __html: html }} />
      {children}
    </div>
  )
}

/* ---- 추천 글 (피처드) ---- */
function Featured({ p }: { p: Post }) {
  return (
    <Link href={getPostPath(p)} className="card card--hover featured-post" style={{ textDecoration: 'none' }}>
      <div className="featured-cover">
        <RidgeCover seed={p.title} pal={p.pal} sun={p.pal === 'winter' || p.pal === 'autumn'} height={320}>
          <div style={{ position: 'absolute', left: 18, top: 18 }}>
            <CatTag cat={p.cat} solid />
          </div>
        </RidgeCover>
      </div>
      <div className="featured-body">
        <div className="eyebrow" style={{ marginBottom: 12 }}>이 주의 추천 글</div>
        <h2 className="h2" style={{ marginBottom: 14 }}>{p.title}</h2>
        <p className="lead" style={{ marginBottom: 18 }}>{p.excerpt}</p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {p.badges.map((b) => <span key={b} className="tag">{b}</span>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <Meta p={p} />
          <span className="btn btn--forest btn--sm">글 읽기 <Icon name="arrow" size={16} /></span>
        </div>
      </div>
    </Link>
  )
}

/* ---- 글 카드 ---- */
function PostCard({ p }: { p: Post }) {
  return (
    <Link href={getPostPath(p)} className="card card--hover" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
      <RidgeCover seed={p.title} pal={p.pal} sun={p.pal === 'winter'} height={128}>
        <div style={{ position: 'absolute', left: 12, top: 12 }}>
          <CatTag cat={p.cat} solid />
        </div>
      </RidgeCover>
      <div className="card--pad" style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <h3 className="h3" style={{ fontSize: 18, lineHeight: 1.4 }}>{p.title}</h3>
        <p className="body" style={{ fontSize: 14, flex: 1, lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: 'var(--ink-soft)' }}>{p.excerpt}</p>
        {p.badges && p.badges.length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {p.badges.slice(0, 3).map(b => <span key={b} className="tag" style={{ fontSize: 11 }}>{b}</span>)}
          </div>
        )}
        <Meta p={p} />
      </div>
    </Link>
  )
}

// 모든 배지 집계 (빈도순 상위 12개)
function topBadges(posts: Post[]): string[] {
  const freq: Record<string, number> = {}
  for (const p of posts) for (const b of (p.badges ?? [])) freq[b] = (freq[b] ?? 0) + 1
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([b]) => b)
}

/* ---- 메인 클라이언트 컴포넌트 ---- */
export function BlogClient({ posts }: { posts: Post[] }) {
  const [cat,   setCat]   = useState<FilterCat>('전체')
  const [query, setQuery] = useState('')
  const [badge, setBadge] = useState('')
  const [visibleCount, setVisibleCount] = useState(60)

  const featured = posts.find((p) => p.featured) ?? posts[0]
  const rest = posts.filter((p) => p.id !== featured?.id)
  if (!featured) return null

  const q = query.trim().toLowerCase()
  const filtered = rest.filter((p) => {
    if (cat !== '전체' && p.cat !== cat) return false
    if (badge && !(p.badges ?? []).includes(badge)) return false
    if (q && !p.title.toLowerCase().includes(q) && !p.excerpt.toLowerCase().includes(q)) return false
    return true
  })
  const showFeatured = cat === '전체' && !q && !badge
  const visiblePosts = filtered.slice(0, visibleCount)

  useEffect(() => {
    setVisibleCount(60)
  }, [cat, q, badge])

  const badges = topBadges(posts)
  const contourSvg = contour({ seed: 'mag', stroke: '#C4D1C7', opacity: 0.5, cx: 0.8, cy: 0.4, rings: 9, w: 1200, h: 360 })

  return (
    <main id="main-content">
      {/* 매스트헤드 */}
      <section
        className="contour-bg"
        style={{ position: 'relative', overflow: 'hidden', paddingTop: 30, paddingBottom: 26 }}
      >
        <div className="contour-svg" dangerouslySetInnerHTML={{ __html: contourSvg }} />
        <div className="wrap" style={{ position: 'relative' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>둘레길고고 매거진</div>
          <h1 className="h1" style={{ maxWidth: 720, marginBottom: 16 }}>다음 산을 고르는 안목</h1>
          <p className="lead" style={{ maxWidth: 540 }}>
            코스 추천부터 장비·안전·계절 가이드까지. 완등 챌린지에 필요한 판단을 데이터 위에서 정리한 글 모음입니다.
          </p>
        </div>
      </section>

      {/* 검색 + 필터 영역 */}
      <div className="wrap" style={{ paddingTop: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* 검색창 */}
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-faint)', pointerEvents: 'none', display: 'flex' }}>
            <Icon name="search" size={16} stroke={1.8} />
          </span>
          <input
            type="search"
            placeholder="제목 검색 (예: 설악산, 지리산)"
            value={query}
            onChange={e => { setQuery(e.target.value); setBadge('') }}
            style={{
              width: '100%', padding: '9px 12px 9px 36px',
              border: '1px solid var(--line)', borderRadius: 'var(--r)',
              fontSize: 14, background: '#fff', outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 카테고리 칩 */}
        <div className="chiprow" style={{ flexWrap: 'wrap' }}>
          {ALL_CATS.map((c) => (
            <button
              key={c}
              className={'chip' + (cat === c ? ' is-on' : '')}
              aria-pressed={cat === c}
              onClick={() => { setCat(c as FilterCat); setBadge('') }}
            >
              {c === '전체' ? '전체' : CATS[c as CatKey].label}
            </button>
          ))}
        </div>

        {/* 배지 필터 칩 */}
        <div className="chiprow" style={{ flexWrap: 'wrap', gap: 6 }}>
          {badges.map((b) => (
            <button
              key={b}
              className={'chip chip--sm' + (badge === b ? ' is-on' : '')}
              aria-pressed={badge === b}
              onClick={() => setBadge(prev => prev === b ? '' : b)}
              style={{ fontSize: 12 }}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* 피처드 글 (전체 탭 + 검색·배지 없을 때만) */}
      {showFeatured && (
        <section className="wrap" style={{ paddingTop: 24 }}>
          <Featured p={featured} />
        </section>
      )}

      {/* 글 목록 */}
      <section className="wrap" style={{ paddingTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 className="h2" style={{ color: 'var(--forest)', whiteSpace: 'nowrap' }}>
            {q ? `"${q}" 검색 결과` : badge ? `#${badge}` : cat === '전체' ? '최신 글' : CATS[cat as CatKey].label + ' 글'}
          </h2>
          <span className="cap" style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{filtered.length}편</span>
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px 0', color:'var(--ink-faint)' }}>
            <p>{q ? `"${q}"에 해당하는 글이 없습니다.` : '이 조건의 글이 없습니다.'}</p>
          </div>
        ) : (
          <>
            <div className="post-grid">
              {visiblePosts.map((p) => <PostCard key={p.id} p={p} />)}
            </div>
            {visiblePosts.length < filtered.length && (
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 24 }}>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => setVisibleCount(count => count + 60)}
                  type="button"
                >
                  더 보기 <span className="tnum">{visiblePosts.length}/{filtered.length}</span>
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* 안전 고지 */}
      <section className="wrap" style={{ paddingTop: 36, paddingBottom: 8 }}>
        <div className="safety">
          <div className="safety__icon">
            <Icon name="warn" size={21} stroke={2} />
          </div>
          <div>
            <h4>글의 코스 정보는 참고용입니다</h4>
            <p>
              본 매거진의 코스·소요시간은 공공데이터를 가공한 추정치이며 일부는 AI 보조로 작성되었습니다.
              산행 전 날씨·체력·장비를 점검하고{' '}
              <a href="https://www.forest.go.kr" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>산림청</a>·
              <a href="https://www.knps.or.kr" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>국립공원공단</a>{' '}
              공식 통제정보를 반드시 확인하세요.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
