'use client'

declare const window: Window & { gtag?: (...args: unknown[]) => void }

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/icon'
import { ridgeCover, contour } from '@/lib/motif'
import { DIFF_META } from '@/lib/mountains-static'
import type { HubMountain } from '@/lib/db/queries'

const LS_KEY = 'dulle_done_v1'

function useDone() {
  const [done, setDone] = useState<Set<string>>(() => new Set())
  useEffect(() => {
    try { setDone(new Set(JSON.parse(localStorage.getItem(LS_KEY) ?? '[]'))) } catch { /* */ }
  }, [])
  const toggle = (name: string) => setDone(prev => {
    const n = new Set(prev)
    n.has(name) ? n.delete(name) : n.add(name)
    localStorage.setItem(LS_KEY, JSON.stringify([...n]))
    return n
  })
  return [done, toggle] as const
}

function RidgeCover({ seed, pal, height = 100 }: { seed: string; pal: string; height?: number }) {
  const html = ridgeCover({ seed, palette: pal, w: 400, h: height * 2 })
  return (
    <div style={{ position: 'relative', height, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

function DiffBadge({ level }: { level: string }) {
  const cls = DIFF_META[level]?.cls ?? 'mid'
  return (
    <span className={`diff diff--${cls}`} style={{ fontSize: 12 }}>
      난이도 {level}
    </span>
  )
}

const GROUP_ORDER = ['수도권', '강원', '충청', '영남', '호남', '제주', '기타']

export function TrackerClient({ mountains }: { mountains: HubMountain[] }) {
  const [done, toggle] = useDone()
  const total = mountains.length
  const count = [...done].filter(name => mountains.some(m => m.name === name)).length
  const pct   = total > 0 ? Math.round((count / total) * 100) : 0

  const contourSvg = contour({ seed: 'tracker-header', stroke: '#C4D1C7', opacity: 0.4, cx: 0.7, cy: 0.4, rings: 8, w: 1200, h: 320 })

  const grouped = GROUP_ORDER
    .map(label => ({ label, mountains: mountains.filter(m => m.group === label) }))
    .filter(g => g.mountains.length > 0)

  return (
    <main id="main-content">
      {/* 헤더 */}
      <section className="contour-bg" style={{ position: 'relative', overflow: 'hidden', paddingTop: 28, paddingBottom: 32, background: 'var(--forest-deep)' }}>
        <div className="contour-svg" dangerouslySetInnerHTML={{ __html: contourSvg }} />
        <div className="wrap" style={{ position: 'relative' }}>
          <div className="eyebrow eyebrow--sage" style={{ marginBottom: 10 }}>100대 명산</div>
          <h1 className="h1" style={{ color: '#fff', marginBottom: 16 }}>완등 트래커</h1>
          <p className="lead" style={{ color: '#C9D3CB', maxWidth: 480, marginBottom: 24 }}>
            로그인 없이 이 브라우저에 저장됩니다. 오른 산에 체크하고 나만의 능선을 채워가세요.
          </p>

          {/* 진행 카드 */}
          <div style={{
            display: 'inline-flex', gap: 28, flexWrap: 'wrap',
            background: 'rgba(255,255,255,.08)', borderRadius: 'var(--r-lg)',
            padding: '20px 28px', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,.14)',
          }}>
            <div>
              <div style={{ color: 'var(--sage-soft)', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>완등</div>
              <div className="tnum" style={{ fontSize: 42, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{count}</div>
            </div>
            <div>
              <div style={{ color: 'var(--sage-soft)', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>남은 산</div>
              <div className="tnum" style={{ fontSize: 42, fontWeight: 800, color: 'var(--mist)', lineHeight: 1 }}>{total - count}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, minWidth: 180 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--sage-soft)', fontWeight: 600 }}>
                <span>진행률</span><span className="tnum">{pct}%</span>
              </div>
              <div className="progress" style={{ background: 'rgba(255,255,255,.18)' }}>
                <div className="progress__fill" style={{ width: `${Math.max(2, pct)}%`, background: 'linear-gradient(90deg,var(--sage),#C4D1C7)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 지역별 그리드 */}
      {grouped.map(group => (
        <section key={group.label} className="wrap" style={{ paddingTop: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>지역별</div>
              <h2 className="h3" style={{ color: 'var(--forest)' }}>{group.label}</h2>
            </div>
            <span className="cap" style={{ fontWeight: 600 }}>
              {group.mountains.filter(m => done.has(m.name)).length}/{group.mountains.length}
            </span>
          </div>
          <div className="card-grid">
            {group.mountains.map(m => (
              <TrackerCard key={m.id} m={m} done={done.has(m.name)} onToggle={toggle} />
            ))}
          </div>
        </section>
      ))}

      {/* 안전 고지 */}
      <section className="wrap" style={{ paddingTop: 36, paddingBottom: 8 }}>
        <div className="safety">
          <div className="safety__icon"><Icon name="warn" size={21} stroke={2} /></div>
          <div>
            <h4>완등 기록은 참고용입니다</h4>
            <p>본 트래커의 기록은 이 브라우저의 localStorage에만 저장되며, 공식 완등 인증과 무관합니다. 공식 100대 명산 완등 인증은 한국산악회 또는 각 산악 단체를 통해 확인하세요.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

function TrackerCard({ m, done, onToggle }: { m: HubMountain; done: boolean; onToggle: (name: string) => void }) {
  return (
    <article
      className="card"
      style={{
        display: 'flex', flexDirection: 'column',
        outline: done ? '2px solid var(--forest)' : 'none',
        outlineOffset: 2,
      }}
    >
      <RidgeCover seed={m.name} pal={m.pal} height={88} />
      <div className="card--pad" style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <Link href={`/mountains/${encodeURIComponent(m.slug)}`} style={{ textDecoration: 'none' }}>
            <span className="h3" style={{ fontSize: 18, color: 'var(--forest)' }}>{m.name}</span>
          </Link>
          <span className="cap" style={{ fontWeight: 600 }}>{m.elev.toLocaleString()}m</span>
        </div>
        <p className="cap" style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Icon name="pin" size={12} stroke={1.8} />{m.region}
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <DiffBadge level={m.diff} />
          {m.transit && (
            <span className="tag" style={{ fontSize: 11.5 }}>
              <Icon name="bus" size={12} stroke={1.8} />대중교통
            </span>
          )}
        </div>
        <button
          className={'btn btn--sm ' + (done ? 'btn--forest' : 'btn--ghost')}
          style={{ width: '100%', marginTop: 'auto' }}
          onClick={() => {
            const next = !done
            onToggle(m.name)
            window.gtag?.('event', 'tracker_toggle', { mountain_name: m.name, completed: next })
          }}
          aria-pressed={done}
        >
          <Icon name="check" size={15} stroke={2.4} />
          {done ? '✓ 완등' : '완등 체크'}
        </button>
      </div>
    </article>
  )
}
