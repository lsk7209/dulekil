'use client'

declare const window: Window & { gtag?: (...args: unknown[]) => void }

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/icon'
import { ridgeCover, contour } from '@/lib/motif'
import { DIFF_META } from '@/lib/mountains-static'
import type { HubMountain } from '@/lib/db/queries'
import { readCompletionNames, writeCompletionNames } from '@/lib/completion-storage'

function useDone() {
  const [done, setDone] = useState<Set<string>>(() => new Set())
  useEffect(() => {
    setDone(readCompletionNames(localStorage))
  }, [])
  const toggle = (name: string) => setDone(prev => {
    const n = new Set(prev)
    n.has(name) ? n.delete(name) : n.add(name)
    writeCompletionNames(localStorage, n)
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

const TRACKER_SOURCES = [
  ['산림청', 'https://www.forest.go.kr/'],
  ['국립공원공단', 'https://www.knps.or.kr/'],
  ['기상청', 'https://www.weather.go.kr/'],
] as const

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
            <p>본 트래커의 기록은 이 브라우저의 localStorage에만 저장되며, 공식 완등 인증과 무관합니다. 공식 인증 여부와 절차는 참여하려는 챌린지 운영 주체의 최신 안내에서 확인하세요.</p>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <div className="card card--pad">
          <div className="eyebrow" style={{ marginBottom: 10 }}>기록 전 확인</div>
          <h2 className="h2" style={{ marginBottom: 14, fontSize: 22 }}>완등 체크 전에 확인할 공식 정보</h2>
          <div className="body" style={{ display: 'flex', flexDirection: 'column', gap: 12, color: 'var(--ink-soft)' }}>
            <p>
              완등 트래커는 내가 오른 산을 잊지 않도록 표시하는 개인 기록 도구입니다. 로그인 계정이나 서버 저장을 사용하지 않기 때문에 브라우저를 바꾸거나 저장 데이터를 삭제하면 기록이 사라질 수 있습니다. 공식 인증서, 산악회 기록, 탐방 예약 내역을 대체하지 않습니다.
            </p>
            <p>
              산을 체크하기 전에는 실제 산행일의 탐방로 개방 여부, 산불조심기간 통제, 기상 특보, 대중교통 막차 시간을 따로 확인하세요. 계절과 들머리에 따라 현장 조건이 달라질 수 있으므로 관리 기관의 최신 안내를 우선하세요.
            </p>
            <p>
              둘레길고고의 산 목록과 등록 구간 표시는 후보 정리를 돕기 위한 참고 자료입니다. 가족 동반, 초보 동행, 야간 하산 가능성이 있는 일정이라면 공식 예상 시간만으로 빠듯하게 계획하지 말고 중간 반환 지점과 비상 여유를 정하세요. 통신이 약한 구간에 대비해 오프라인에서 확인 가능한 지도와 보조 배터리를 준비하세요.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 4 }}>
              {TRACKER_SOURCES.map(([label, href]) => (
                <a key={href} className="tag" href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--forest)', textDecoration: 'none' }}>
                  {label}
                </a>
              ))}
            </div>
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
