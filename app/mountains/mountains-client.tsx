'use client'

declare const window: Window & { gtag?: (...args: unknown[]) => void }

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/icon'
import { ridgeCover, contour } from '@/lib/motif'
import { DIFF_META, SEASON_ICON } from '@/lib/mountains-static'
import type { HubMountain } from '@/lib/db/queries'

const LS_KEY = 'dulle_done_v1'

function useDone() {
  const [done, setDone] = useState<Set<string>>(() => new Set())
  useEffect(() => {
    try { setDone(new Set(JSON.parse(localStorage.getItem(LS_KEY) ?? '[]'))) } catch { /* */ }
  }, [])
  const toggle = (key: string) => setDone(prev => {
    const n = new Set(prev)
    n.has(key) ? n.delete(key) : n.add(key)
    localStorage.setItem(LS_KEY, JSON.stringify([...n]))
    return n
  })
  return [done, toggle] as const
}

function DiffBadge({ level }: { level: string }) {
  const cls = DIFF_META[level]?.cls ?? 'mid'
  const peaks: Record<string, string> = {
    low: 'M3 19 L10 11 L13.5 14 L21 6',
    mid: 'M3 19 L9 10 L13 14 L21 5',
    high: 'M3 20 L8 9 L12.5 13.5 L21 4',
    max: 'M3 21 L8 7 L12.5 13 L21 3',
  }
  return (
    <span className={`diff diff--${cls}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d={peaks[cls]} />
      </svg>
      난이도 {level}
    </span>
  )
}

function RidgeCover({ seed, pal, height = 120 }: { seed: string; pal: string; height?: number }) {
  const html = ridgeCover({ seed, palette: pal, w: 560, h: height * 2 })
  return (
    <div style={{ position: 'relative', height, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

const GROUPS   = ['전체', '수도권', '강원', '충청', '영남', '호남', '제주']
const DIFFS    = ['전체', '하', '중', '상', '매우상']
const SORTS    = [
  { val: 'pop',       label: '인기순 (고도)' },
  { val: 'elev_desc', label: '고도 높은 순' },
  { val: 'elev_asc',  label: '고도 낮은 순' },
  { val: 'dist_asc',  label: '거리 짧은 순' },
]

interface Props { mountains: HubMountain[] }

export function MountainsClient({ mountains }: Props) {
  const [done, toggle] = useDone()
  const [group,   setGroup]   = useState('전체')
  const [diff,    setDiff]    = useState('전체')
  const [transit, setTransit] = useState(false)
  const [sort,    setSort]    = useState('pop')
  const [query,   setQuery]   = useState('')

  const contourSvg = contour({ seed: 'hub', stroke: '#C4D1C7', opacity: 0.45, cx: 0.75, cy: 0.35, rings: 8, w: 1200, h: 300 })

  const list = useMemo(() => {
    let arr = mountains.filter(m => {
      if (query.trim() && !(m.name.includes(query) || m.region.includes(query))) return false
      if (group !== '전체' && m.group !== group) return false
      if (diff  !== '전체' && m.diff  !== diff)  return false
      if (transit && !m.transit) return false
      return true
    })
    if (sort === 'pop')       arr = [...arr].sort((a, b) => b.pop - a.pop)
    if (sort === 'elev_desc') arr = [...arr].sort((a, b) => b.elev - a.elev)
    if (sort === 'elev_asc')  arr = [...arr].sort((a, b) => a.elev - b.elev)
    if (sort === 'dist_asc')  arr = [...arr].sort((a, b) => a.dist - b.dist)
    return arr
  }, [mountains, group, diff, transit, sort, query])

  return (
    <main id="main-content">
      {/* 헤더 */}
      <section className="contour-bg" style={{ position: 'relative', overflow: 'hidden', paddingTop: 28, paddingBottom: 26 }}>
        <div className="contour-svg" dangerouslySetInnerHTML={{ __html: contourSvg }} />
        <div className="wrap" style={{ position: 'relative' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>100대 명산 허브</div>
          <h1 className="h1" style={{ maxWidth: 720, marginBottom: 14 }}>어느 산이 나에게 맞을까?</h1>
          <p className="lead" style={{ maxWidth: 540 }}>
            산림청이 선정한 {mountains.length}개 명산. 난이도·지역·대중교통으로 필터링하고, 오른 산은 완등 체크.
          </p>
          <div style={{ marginTop: 20, maxWidth: 480 }}>
            <div style={{
              display: 'flex', gap: 8, background: '#fff',
              border: '1.5px solid var(--line)', borderRadius: 'var(--r-pill)',
              padding: '6px 6px 6px 16px', boxShadow: 'var(--sh-1)', alignItems: 'center',
            }}>
              <Icon name="search" size={18} />
              <input
                value={query}
                onChange={e => {
                  setQuery(e.target.value)
                  window.gtag?.('event', 'search', { search_term: e.target.value })
                }}
                placeholder="산 이름 또는 지역으로 검색"
                aria-label="산 이름 또는 지역 검색"
                style={{ flex: 1, border: 0, outline: 'none', background: 'transparent', fontFamily: 'var(--sans)', fontSize: 15, minWidth: 0 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 필터 */}
      <div className="wrap" style={{ paddingTop: 20 }}>
        <div className="chiprow" style={{ marginBottom: 10, flexWrap: 'wrap' }}>
          {GROUPS.map(g => (
            <button key={g} className={'chip' + (group === g ? ' is-on' : '')} aria-pressed={group === g} onClick={() => {
              setGroup(g)
              window.gtag?.('event', 'filter_apply', { filter_type: 'region', filter_value: g })
            }}>{g}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div className="chiprow" style={{ flexWrap: 'wrap' }}>
            {DIFFS.map(d => (
              <button key={d} className={'chip' + (diff === d ? ' is-on' : '')} aria-pressed={diff === d} onClick={() => {
                setDiff(d)
                window.gtag?.('event', 'filter_apply', { filter_type: 'difficulty', filter_value: d })
              }}
                style={{ minHeight: 38, fontSize: 14, padding: '8px 14px' }}>
                {d === '전체' ? '전체 난이도' : `난이도 ${d}`}
              </button>
            ))}
            <button
              className={'chip' + (transit ? ' is-on' : '')}
              aria-pressed={transit}
              onClick={() => {
                const next = !transit
                setTransit(next)
                window.gtag?.('event', 'filter_apply', { filter_type: 'transit', filter_value: String(next) })
              }}
              style={{ minHeight: 38, fontSize: 14, padding: '8px 14px' }}
            >
              <Icon name="bus" size={14} stroke={1.9} />대중교통
            </button>
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              marginLeft: 'auto', fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600,
              border: '1.5px solid var(--line)', borderRadius: 'var(--r-pill)',
              padding: '8px 14px', background: '#fff', color: 'var(--ink-soft)',
              cursor: 'pointer', outline: 'none',
            }}
          >
            {SORTS.map(s => <option key={s.val} value={s.val}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* 결과 */}
      <section className="wrap" style={{ paddingTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <p className="cap" style={{ fontWeight: 600 }}>
            {list.length}개 산 · {done.size}/{mountains.length} 완등
          </p>
          <div
            className="progress"
            role="progressbar"
            aria-valuenow={done.size}
            aria-valuemin={0}
            aria-valuemax={mountains.length}
            aria-label="완등 진행률"
            style={{ width: 140 }}
          >
            <div className="progress__fill" style={{ width: `${Math.max(2, Math.round(done.size / mountains.length * 100))}%` }} />
          </div>
        </div>

        {list.length > 0 ? (
          <div className="card-grid">
            {list.map(m => <HubCard key={m.id} m={m} done={done.has(m.name)} onToggle={toggle} />)}
          </div>
        ) : (
          <div className="card card--pad" style={{ textAlign: 'center', color: 'var(--ink-faint)', padding: 40 }}>
            조건에 맞는 산이 없어요. 필터를 조절해보세요.
          </div>
        )}
      </section>

      {/* 안전 고지 */}
      <section className="wrap" style={{ paddingTop: 36, paddingBottom: 8 }}>
        <div className="safety">
          <div className="safety__icon"><Icon name="warn" size={21} stroke={2} /></div>
          <div>
            <h4>산행 전 공식 통제정보를 확인하세요</h4>
            <p>코스 정보는 공공데이터(data.go.kr, 산림청)를 가공한 참고치입니다. 출처: data.go.kr · 산림청 (공공누리 제1유형). 현장 상황과 다를 수 있으니 공식 기관 고지를 우선 확인하세요.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

function HubCard({ m, done, onToggle }: { m: HubMountain; done: boolean; onToggle: (key: string) => void }) {
  return (
    <article
      className="card card--hover"
      style={{ display: 'flex', flexDirection: 'column', outline: done ? '2px solid var(--forest)' : 'none', outlineOffset: 2 }}
    >
      <RidgeCover seed={m.name} pal={m.pal} height={120} />
      <div className="card--pad" style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <Link href={`/mountains/${encodeURIComponent(m.name)}`} className="h3" style={{ fontSize: 20, textDecoration: 'none' }}>{m.name}</Link>
            <span className="cap" style={{ fontWeight: 600 }}>{m.peak !== m.name ? m.peak : ''}</span>
          </div>
          <p className="cap" style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
            <Icon name="pin" size={13} stroke={1.8} />{m.region}{m.sigun ? ` ${m.sigun}` : ''}
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <DiffBadge level={m.diff} />
          {m.seasons.slice(0, 1).map(s => (
            <span key={s} className="tag tag--season">
              <Icon name={SEASON_ICON[s] ?? 'leaf'} size={13} stroke={1.8} />{s}
            </span>
          ))}
          {m.transit && <span className="tag"><Icon name="bus" size={13} stroke={1.8} />대중교통</span>}
        </div>
        <div className="statbar" style={{ border: '1px solid var(--line-soft)', borderRadius: 'var(--r)', marginTop: 'auto' }}>
          <div className="stat"><div className="stat__k">고도</div><div className="stat__v tnum">{m.elev.toLocaleString()}<span className="stat__u">m</span></div></div>
          <div className="stat"><div className="stat__k">거리</div><div className="stat__v tnum">{m.dist}<span className="stat__u">km</span></div></div>
          <div className="stat"><div className="stat__k">소요</div><div className="stat__v tnum">{m.time}</div></div>
        </div>
        <button
          className={'btn btn--sm ' + (done ? 'btn--forest' : 'btn--ghost')}
          style={{ width: '100%', marginTop: 2 }}
          onClick={() => {
            onToggle(m.name)
            window.gtag?.('event', 'mountain_toggle', { mountain_name: m.name, completed: !done })
          }}
          aria-pressed={done}
        >
          <Icon name="check" size={16} stroke={2.4} />{done ? '완등함' : '완등 체크'}
        </button>
      </div>
    </article>
  )
}
