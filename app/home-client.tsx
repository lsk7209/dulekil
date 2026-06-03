'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/icon'
import { ridgeCover, contour } from '@/lib/motif'
import { MOUNTAINS, DIFF_META, SEASON_ICON, type StaticMountain } from '@/lib/mountains-static'

const LS_KEY = 'dulle_done_v1'

function useDone() {
  const [done, setDone] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) ?? '[]')
      setDone(new Set(saved))
    } catch { /* ignore */ }
  }, [])

  const toggle = (id: string) => setDone(prev => {
    const n = new Set(prev)
    n.has(id) ? n.delete(id) : n.add(id)
    localStorage.setItem(LS_KEY, JSON.stringify([...n]))
    return n
  })

  return [done, toggle] as const
}

/* ---- 난이도 배지 ---- */
function DiffBadge({ level, big }: { level: string; big?: boolean }) {
  const meta = DIFF_META[level]
  const cls = meta?.cls ?? 'mid'
  const peaks: Record<string, string> = {
    low: 'M3 19 L10 11 L13.5 14 L21 6',
    mid: 'M3 19 L9 10 L13 14 L21 5',
    high: 'M3 20 L8 9 L12.5 13.5 L21 4',
    max: 'M3 21 L8 7 L12.5 13 L21 3',
  }
  return (
    <span className={`diff diff--${cls}`} style={big ? { fontSize: 14, padding: '8px 14px' } : undefined}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d={peaks[cls]} />
      </svg>
      난이도 {level}
    </span>
  )
}

/* ---- 능선 커버 ---- */
function RidgeCover({ seed, pal, sun, height = 150, children }: {
  seed: string; pal: string; sun?: boolean; height?: number; children?: React.ReactNode
}) {
  const html = ridgeCover({ seed, palette: pal, sun: sun ? '#C9763D' : null, w: 560, h: height * 2 })
  return (
    <div style={{ position: 'relative', height, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }} dangerouslySetInnerHTML={{ __html: html }} />
      {children}
    </div>
  )
}

/* ---- 산 카드 ---- */
function MountainCard({ m, done, onToggle, compact }: {
  m: StaticMountain; done: boolean; onToggle: (id: string) => void; compact?: boolean
}) {
  return (
    <article className="card card--hover" style={{ display: 'flex', flexDirection: 'column', minWidth: compact ? 248 : 0 }}>
      <RidgeCover seed={m.name} pal={m.pal} sun={m.sun} height={compact ? 104 : 124}>
        <div style={{ position: 'absolute', left: 12, top: 12, display: 'flex', gap: 6 }}>
          <span className="tag tag--100" style={{ backdropFilter: 'blur(2px)' }}>100대 명산</span>
        </div>
        {m.gpx && (
          <div style={{ position: 'absolute', right: 12, top: 12 }}>
            <span className="tag tag--gpx"><Icon name="route" size={13} stroke={2.2} />GPX</span>
          </div>
        )}
      </RidgeCover>

      <div className="card--pad" style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <span className="h3" style={{ fontSize: compact ? 19 : 21, whiteSpace: 'nowrap' }}>{m.name}</span>
            <span className="cap" style={{ fontWeight: 600 }}>{m.peak}</span>
          </div>
          <p className="cap" style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
            <Icon name="pin" size={13} stroke={1.8} />{m.region}
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <DiffBadge level={m.diff} />
          {m.seasons.slice(0, 1).map(s => (
            <span key={s} className="tag tag--season">
              <Icon name={SEASON_ICON[s] ?? 'leaf'} size={13} stroke={1.8} />{s}
            </span>
          ))}
          {m.transit && (
            <span className="tag"><Icon name="bus" size={13} stroke={1.8} />대중교통</span>
          )}
        </div>

        <div className="statbar" style={{ border: '1px solid var(--line-soft)', borderRadius: 'var(--r)', marginTop: 'auto' }}>
          <div className="stat"><div className="stat__k">고도</div><div className="stat__v tnum">{m.elev.toLocaleString()}<span className="stat__u">m</span></div></div>
          <div className="stat"><div className="stat__k">거리</div><div className="stat__v tnum">{m.dist}<span className="stat__u">km</span></div></div>
          <div className="stat"><div className="stat__k">소요</div><div className="stat__v tnum">{m.time}</div></div>
        </div>

        <button
          className={'btn btn--sm ' + (done ? 'btn--forest' : 'btn--ghost')}
          style={{ width: '100%', marginTop: 2 }}
          onClick={() => onToggle(m.id)}
          aria-pressed={done}
        >
          <Icon name="check" size={16} stroke={2.4} />{done ? '완등함' : '완등 체크'}
        </button>
      </div>
    </article>
  )
}

/* ---- 검색창 ---- */
function SearchBar({ value, onChange, onSubmit }: {
  value: string; onChange: (v: string) => void; onSubmit: () => void
}) {
  return (
    <form
      onSubmit={e => { e.preventDefault(); onSubmit() }}
      style={{
        display: 'flex', gap: 8, background: '#fff',
        border: '1.5px solid var(--line)', borderRadius: 'var(--r-pill)',
        padding: 6, boxShadow: 'var(--sh-2)', alignItems: 'center',
      }}
    >
      <span style={{ paddingLeft: 12, color: 'var(--ink-faint)' }}>
        <Icon name="search" size={20} />
      </span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="산 이름이나 지역으로 찾기 — 예: 북한산, 강원"
        style={{
          flex: 1, border: 0, outline: 'none', background: 'transparent',
          fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--charcoal)', minWidth: 0,
        }}
      />
      <button type="submit" className="btn btn--primary" style={{ minHeight: 44, padding: '10px 18px' }}>
        <Icon name="target" size={17} /><span className="hide-xs">내게 맞는 산</span>
      </button>
    </form>
  )
}

/* ---- 히어로 ---- */
function Hero({ query, setQuery, goResults, doneCount, featured }: {
  query: string; setQuery: (v: string) => void
  goResults: () => void; doneCount: number; featured: StaticMountain
}) {
  const contourSvg = contour({ seed: 'hero', stroke: '#C4D1C7', opacity: 0.55, cx: 0.82, cy: 0.35, rings: 9, w: 1200, h: 520 })
  return (
    <section className="contour-bg" style={{ position: 'relative', overflow: 'hidden', paddingTop: 26, paddingBottom: 34 }}>
      <div className="contour-svg" dangerouslySetInnerHTML={{ __html: contourSvg }} />
      <div className="wrap" style={{ position: 'relative' }}>
        <div className="hero-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="eyebrow">이 달의 능선 · 6월</div>
            <h1 className="h1">100대 명산,<br />어디부터 오를까?</h1>
            <p className="lead" style={{ maxWidth: 440 }}>
              완등 챌린지의 다음 한 걸음을 고르는 곳. 코스 난이도·거리·들머리 교통을 비교해, 오늘의 나에게 맞는 산을 찾으세요.
            </p>
            <SearchBar value={query} onChange={setQuery} onSubmit={goResults} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-soft)', fontSize: 14 }}>
              <div style={{ display: 'flex' }}>
                {['#2F4A3C', '#8AA396', '#C9763D'].map((c, i) => (
                  <span key={i} style={{ width: 24, height: 24, borderRadius: '50%', background: c, border: '2px solid var(--bg)', marginLeft: i ? -8 : 0 }} />
                ))}
              </div>
              <span><b style={{ color: 'var(--forest)' }} className="tnum">{doneCount}/100</b> 함께 오르는 중 · 가입 없이 시작</span>
            </div>
          </div>

          {/* 커버 스토리 카드 */}
          <Link href="/mountains" className="card card--hover" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
            <RidgeCover seed={featured.name} pal={featured.pal} sun={featured.sun} height={208}>
              <div style={{ position: 'absolute', left: 16, top: 16 }}>
                <span className="tag tag--season" style={{ fontFamily: 'var(--serif)', fontWeight: 600, letterSpacing: '.1em' }}>COVER · 이 달의 산</span>
              </div>
            </RidgeCover>
            <div className="card--pad" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                  <span className="h2" style={{ fontSize: 30, whiteSpace: 'nowrap' }}>{featured.name}</span>
                  <span className="cap" style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{featured.peak} · {featured.elev.toLocaleString()}m</span>
                </div>
                <p className="body" style={{ marginTop: 6, fontSize: 15 }}>
                  무주 곤돌라로 향적봉 코앞까지. 겨울이면 능선 가득 상고대가 피는, 초보도 도전할 만한 1,600m급 설경 명산.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <DiffBadge level={featured.diff} />
                <span className="tag tag--season"><Icon name="snow" size={13} stroke={1.8} />겨울 눈꽃</span>
                <span className="tag tag--gpx"><Icon name="route" size={13} stroke={2.2} />GPX A</span>
              </div>
              <span className="btn btn--forest btn--sm" style={{ alignSelf: 'flex-start' }}>코스 비교 보기 <Icon name="chevron" size={15} /></span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ---- 섹션 헤더 ---- */
function SecHead({ kicker, title, more }: {
  kicker: string; title: string; more?: { href: string; label: string }
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: 6 }}>{kicker}</div>
        <h2 className="h2" style={{ whiteSpace: 'nowrap' }}>{title}</h2>
      </div>
      {more && (
        <Link href={more.href} className="seemore">{more.label} <Icon name="chevron" size={15} /></Link>
      )}
    </div>
  )
}

/* ---- 필터 데이터 ---- */
type FilterEntry = { type: string; label: string; val: string; icon?: string }
const FILTERS: FilterEntry[] = [
  { type: 'g', label: '수도권', val: '수도권' }, { type: 'g', label: '강원', val: '강원' },
  { type: 'g', label: '충청', val: '충청' },   { type: 'g', label: '영남', val: '영남' },
  { type: 'g', label: '호남', val: '호남' },   { type: 'g', label: '제주', val: '제주' },
  { type: 'd', label: '난이도 하', val: '하' }, { type: 'd', label: '난이도 중', val: '중' }, { type: 'd', label: '난이도 상', val: '상' },
  { type: 's', label: '겨울 눈꽃', val: '겨울', icon: 'snow' },
  { type: 's', label: '봄 꽃',    val: '봄',   icon: 'flower' },
  { type: 's', label: '여름 숲',  val: '여름', icon: 'sun' },
  { type: 's', label: '가을 단풍', val: '가을', icon: 'leaf' },
  { type: 't', label: '대중교통', val: '1',   icon: 'bus' },
]

/* ---- 탐색 섹션 ---- */
function Explore({ query, active, setActive, done, toggle }: {
  query: string; active: Set<string>; setActive: (fn: (p: Set<string>) => Set<string>) => void
  done: Set<string>; toggle: (id: string) => void
}) {
  const toggleChip = (key: string) =>
    setActive(p => { const n = new Set(p); n.has(key) ? n.delete(key) : n.add(key); return n })

  const list = useMemo(() => {
    const q = query.trim()
    return MOUNTAINS.filter(m => {
      if (q && !(m.name.includes(q) || m.region.includes(q) || m.peak.includes(q) || m.group.includes(q))) return false
      for (const key of active) {
        const [t, v] = key.split(':')
        if (t === 'g' && m.group !== v) return false
        if (t === 'd' && m.diff !== v && !(v === '상' && m.diff === '매우상')) return false
        if (t === 's' && !m.seasons.includes(v)) return false
        if (t === 't' && !m.transit) return false
      }
      return true
    })
  }, [query, active])

  return (
    <section id="explore" className="wrap" style={{ paddingTop: 40, paddingBottom: 8 }}>
      <SecHead kicker="빠른 진입" title="이렇게 찾아보세요" more={{ href: '/mountains', label: '허브 전체' }} />
      <div className="chiprow" style={{ marginBottom: 22, flexWrap: 'wrap' }}>
        {FILTERS.map(f => {
          const key = `${f.type}:${f.val}`
          const on = active.has(key)
          return (
            <button key={key} className={'chip' + (on ? ' is-on' : '')} aria-pressed={on} onClick={() => toggleChip(key)}>
              {f.icon && <Icon name={f.icon} size={15} stroke={1.9} />}{f.label}
            </button>
          )
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <p className="cap" style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
          {query.trim() ? `'${query.trim()}' 검색 · ` : ''}{list.length}개 산
        </p>
        {(active.size > 0 || query.trim()) && (
          <button className="seemore" onClick={() => setActive(() => new Set())} style={{ background: 'none', border: 0, cursor: 'pointer' }}>필터 초기화</button>
        )}
      </div>
      {list.length ? (
        <div className="card-grid">
          {list.slice(0, 6).map(m => <MountainCard key={m.id} m={m} done={done.has(m.id)} onToggle={toggle} />)}
        </div>
      ) : (
        <div className="card card--pad" style={{ textAlign: 'center', color: 'var(--ink-faint)' }}>
          조건에 맞는 산이 없어요. 필터를 줄여보세요.
        </div>
      )}
    </section>
  )
}

/* ---- 완등 트래커 미리보기 ---- */
function TrackerPreview({ done }: { done: Set<string> }) {
  const count = done.size
  const contourSvg = contour({ seed: 'trk', stroke: '#5E7E63', opacity: 0.5, cx: 0.5, cy: 0.5, rings: 8, w: 1000, h: 420 })
  const next = MOUNTAINS
    .filter(m => !done.has(m.id))
    .sort((a, b) => (DIFF_META[a.diff]?.order ?? 2) - (DIFF_META[b.diff]?.order ?? 2))[0]

  return (
    <section id="tracker" className="wrap" style={{ paddingTop: 44, paddingBottom: 8 }}>
      <div className="card tracker-card contour-bg" style={{ overflow: 'hidden', position: 'relative' }}>
        <div className="contour-svg" style={{ opacity: 0.35 }} dangerouslySetInnerHTML={{ __html: contourSvg }} />
        <div className="tracker-inner" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="eyebrow eyebrow--sage">완등 트래커</div>
            <h2 className="h2" style={{ color: '#fff' }}>몇 개의 능선을<br />넘었나요?</h2>
            <p style={{ color: '#D8E1D6', fontSize: 15.5, margin: 0, maxWidth: 360 }}>
              로그인 없이 이 브라우저에 진행 상황이 저장됩니다. 산을 완등 체크할 때마다 능선이 채워져요.
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span className="tnum" style={{ fontSize: 46, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{count}</span>
              <span style={{ color: 'var(--sage-soft)', fontWeight: 700, fontSize: 18, whiteSpace: 'nowrap' }}>/ 100 완등</span>
            </div>
            <div className="progress" style={{ background: 'rgba(255,255,255,.18)' }}>
              <div className="progress__fill" style={{ width: Math.max(2, count) + '%', background: 'linear-gradient(90deg,var(--sage),#fff)' }} />
            </div>
            {next && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#EAE6DC', fontSize: 14, flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--sage-soft)', whiteSpace: 'nowrap' }}>다음 추천</span>
                <span style={{ fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>{next.name}</span>
                <DiffBadge level={next.diff} />
              </div>
            )}
            <Link href="#explore" className="btn btn--primary btn--sm" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
              지금 완등 체크하기 <Icon name="chevron" size={15} />
            </Link>
          </div>
          <div className="tracker-grid" aria-hidden="true">
            {Array.from({ length: 100 }).map((_, i) => (
              <span key={i} style={{
                aspectRatio: '1', borderRadius: 3,
                background: i < count ? 'linear-gradient(135deg,var(--sage),var(--forest))' : 'rgba(255,255,255,.12)',
                boxShadow: i < count ? '0 0 0 1px rgba(255,255,255,.25)' : 'none',
              }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---- 가로 스크롤 산 줄 ---- */
function ScrollRow({ items, done, toggle }: {
  items: StaticMountain[]; done: Set<string>; toggle: (id: string) => void
}) {
  return (
    <div className="chiprow" style={{ gap: 16, paddingBottom: 8 }}>
      {items.map(m => (
        <div key={m.id} style={{ width: 260, flex: 'none' }}>
          <MountainCard m={m} done={done.has(m.id)} onToggle={toggle} compact />
        </div>
      ))}
    </div>
  )
}

/* ---- 가이드 섹션 ---- */
const GUIDES = [
  { icon: 'route', t: '초보의 첫 100대 명산',   d: '체력·코스·장비 — 시작 전 알아둘 것' },
  { icon: 'bus',   t: '대중교통으로 가는 명산',   d: '지하철·버스로 닿는 들머리 모음' },
  { icon: 'snow',  t: '겨울 눈꽃 산행 준비',     d: '아이젠·스패츠·보온 체크리스트' },
  { icon: 'warn',  t: '안전 산행 수칙',          d: '통제정보·일몰·조난 예방의 기본' },
]

function Guides() {
  return (
    <section id="guide" className="wrap" style={{ paddingTop: 44, paddingBottom: 8 }}>
      <SecHead kicker="가이드 · 안전 입문" title="오르기 전에 읽어두면 좋은 글" more={{ href: '/blog', label: '블로그 전체' }} />
      <div className="guide-grid">
        {GUIDES.map(g => (
          <Link key={g.t} href="/blog" className="card card--hover card--pad guide-card">
            <span className="guide-ic"><Icon name={g.icon} size={20} stroke={1.9} /></span>
            <div>
              <div className="h3" style={{ fontSize: 17, marginBottom: 3 }}>{g.t}</div>
              <p className="cap">{g.d}</p>
            </div>
            <Icon name="chevron" size={16} />
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ---- 안전 고지 ---- */
function SafetyBlock() {
  return (
    <section className="wrap" style={{ paddingTop: 36 }}>
      <div className="safety">
        <div className="safety__icon"><Icon name="warn" size={21} stroke={2} /></div>
        <div>
          <h4>산행 전 꼭 확인하세요</h4>
          <p>출발 전 날씨와 본인 체력·장비를 점검하고, 산림청·국립공원 공식 통제정보를 반드시 확인하세요. 해 지기 전 하산을 권장합니다. 본 사이트의 코스 정보는 참고용이며 현장 상황과 다를 수 있습니다.</p>
        </div>
      </div>
    </section>
  )
}

/* ---- 메인 앱 ---- */
export function HomeClient() {
  const [done, toggle] = useDone()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<Set<string>>(() => new Set())

  const featured = MOUNTAINS.find(m => m.id === 'deokyu') ?? MOUNTAINS[0]
  const beginners = MOUNTAINS.filter(m => m.beginner)
  const seasonal  = MOUNTAINS.filter(m => ['cheonggye', 'songni', 'gwanak', 'odae', 'naejang'].includes(m.id))

  const goResults = () => {
    const el = document.getElementById('explore')
    if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' })
  }

  return (
    <>
      <Hero query={query} setQuery={setQuery} goResults={goResults} doneCount={done.size} featured={featured} />
      <Explore query={query} active={active} setActive={setActive} done={done} toggle={toggle} />

      <section className="wrap" style={{ paddingTop: 20 }}>
        <div className="ad ad--infeed"><span className="ad__label">광고 · 본문 인피드</span></div>
      </section>

      <TrackerPreview done={done} />

      <section className="wrap" style={{ paddingTop: 44, paddingBottom: 8 }}>
        <SecHead kicker="초보 추천 코스 TOP" title="첫 산으로 좋아요" more={{ href: '/mountains', label: '더 보기' }} />
        <ScrollRow items={beginners} done={done} toggle={toggle} />
      </section>

      <section className="wrap" style={{ paddingTop: 40, paddingBottom: 8 }}>
        <SecHead kicker="계절 추천 · 6월" title="숲이 깊어지는 산" more={{ href: '/mountains', label: '더 보기' }} />
        <ScrollRow items={seasonal} done={done} toggle={toggle} />
      </section>

      <Guides />
      <SafetyBlock />
    </>
  )
}
