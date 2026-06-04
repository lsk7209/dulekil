'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/icon'
import { ridgeCover, contour } from '@/lib/motif'
import { CATS, type Post, type CatKey } from '@/lib/posts'

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
    <Link href={`/blog/${p.id}`} className="card card--hover featured-post" style={{ textDecoration: 'none' }}>
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
    <Link href={`/blog/${p.id}`} className="card card--hover" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
      <RidgeCover seed={p.title} pal={p.pal} sun={p.pal === 'winter'} height={128}>
        <div style={{ position: 'absolute', left: 12, top: 12 }}>
          <CatTag cat={p.cat} solid />
        </div>
      </RidgeCover>
      <div className="card--pad" style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <h3 className="h3" style={{ fontSize: 19 }}>{p.title}</h3>
        <p className="body" style={{ fontSize:14.5, flex:1, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.excerpt}</p>
        <Meta p={p} />
      </div>
    </Link>
  )
}

/* ---- 메인 클라이언트 컴포넌트 ---- */
export function BlogClient({ posts }: { posts: Post[] }) {
  const [cat, setCat] = useState<FilterCat>('전체')

  const featured = posts.find((p) => p.featured) ?? posts[0]
  const rest = posts.filter((p) => p.id !== featured?.id)
  if (!featured) return null
  const filtered = cat === '전체' ? rest : rest.filter((p) => p.cat === cat)
  const showFeatured = cat === '전체'

  const contourSvg = contour({ seed: 'mag', stroke: '#C4D1C7', opacity: 0.5, cx: 0.8, cy: 0.4, rings: 9, w: 1200, h: 360 })

  return (
    <main>
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

      {/* 카테고리 필터 */}
      <div className="wrap" style={{ paddingTop: 22 }}>
        <div className="chiprow" style={{ flexWrap: 'wrap' }}>
          {ALL_CATS.map((c) => (
            <button
              key={c}
              className={'chip' + (cat === c ? ' is-on' : '')}
              aria-pressed={cat === c}
              onClick={() => setCat(c as FilterCat)}
            >
              {c === '전체' ? '전체' : CATS[c as CatKey].label}
            </button>
          ))}
        </div>
      </div>

      {/* 피처드 글 (전체 탭만) */}
      {showFeatured && (
        <section className="wrap" style={{ paddingTop: 24 }}>
          <Featured p={featured} />
        </section>
      )}

      {/* 글 목록 상단 3편 */}
      <section className="wrap" style={{ paddingTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 className="h3" style={{ color: 'var(--forest)', whiteSpace: 'nowrap' }}>
            {cat === '전체' ? '최신 글' : CATS[cat as CatKey].label + ' 글'}
          </h2>
          <span className="cap" style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{filtered.length}편</span>
        </div>
        <div className="post-grid">
          {filtered.slice(0, 3).map((p) => <PostCard key={p.id} p={p} />)}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'48px 0', color:'var(--ink-faint)' }}>
            <p>이 카테고리의 글이 없습니다.</p>
          </div>
        )}
      </section>

      {/* 글 목록 나머지 */}
      {filtered.length > 3 && (
        <section className="wrap" style={{ paddingTop: 24 }}>
          <div className="post-grid">
            {filtered.slice(3).map((p) => <PostCard key={p.id} p={p} />)}
          </div>
        </section>
      )}

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
              산행 전 날씨·체력·장비를 점검하고 산림청·국립공원 공식 통제정보를 반드시 확인하세요.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
