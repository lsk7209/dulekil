import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Icon } from '@/components/icon'
import { getMountainBySlug, getCoursesByMountainId, getMountainsForHub, getRegionGroup } from '@/lib/db/queries'
import { ridgeCover } from '@/lib/motif'
import { DIFF_META } from '@/lib/mountains-static'

export const revalidate = 86400

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  const { db } = await import('@/lib/db/index')
  const { mountains } = await import('@/lib/db/schema')
  const { eq } = await import('drizzle-orm')
  const rows = await db.select({ name: mountains.name }).from(mountains)
    .where(eq(mountains.is_top100, true))
  return rows.map(r => ({ slug: r.name }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = decodeURIComponent(params.slug)
  const m = await getMountainBySlug(name)
  if (!m) return {}
  return {
    title: `${m.name} 등산 코스 — 난이도·거리·소요시간`,
    description: m.description ??
      `${m.name}(${m.region ?? ''}) 등산 코스 정보. 해발 ${m.elev ?? '?'}m. 공공데이터 기반.`,
    openGraph: {
      title: `${m.name} 등산 코스`,
      description: `${m.region} · 해발 ${(m.elev ?? 0).toLocaleString()}m`,
      type: 'article',
    },
  }
}

function normDiff(raw: string | null): string {
  if (raw === '하' || raw === '쉬움') return '하'
  if (raw === '상' || raw === '어려움') return '상'
  if (raw === '매우상') return '매우상'
  return '중'
}

function minutesToHM(min: number | null): string {
  if (!min || min <= 0) return '?:??'
  return `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}`
}

function RidgeCoverImg({ name, pal, height }: { name: string; pal: string; height: number }) {
  const html = ridgeCover({ seed: name, palette: pal, w: 1200, h: height * 2 })
  return (
    <div style={{ position: 'relative', height, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

export default async function MountainDetailPage({ params }: Props) {
  const name    = decodeURIComponent(params.slug)
  const mountain = await getMountainBySlug(name)
  if (!mountain) notFound()

  const courses   = await getCoursesByMountainId(mountain.id)
  const allMtns   = await getMountainsForHub()
  const group     = getRegionGroup(mountain.region)
  const nearby    = allMtns.filter(x => x.name !== mountain.name && x.group === group).slice(0, 3)

  const bestDiff  = courses.length > 0
    ? normDiff(courses.sort((a, b) => (a.distance ?? 99) - (b.distance ?? 99))[0]?.diff_norm)
    : '중'
  const cls       = DIFF_META[bestDiff]?.cls ?? 'mid'

  const hasTransit = courses.some(c => c.transit)
  const hasGpx     = courses.some(c => c.gpx_available)
  const minDist    = courses.length > 0
    ? Math.min(...courses.map(c => c.distance ?? 99).filter(d => d < 99))
    : null
  const maxDur     = courses.length > 0
    ? Math.max(...courses.map(c => c.duration_up ?? 0))
    : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristAttraction',
        name: mountain.name,
        description: mountain.description ?? `${mountain.region}에 위치한 해발 ${mountain.elev}m의 명산.`,
        address: { '@type': 'PostalAddress', addressRegion: mountain.region ?? '', addressCountry: 'KR' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: 'https://dulekil.vercel.app' },
          { '@type': 'ListItem', position: 2, name: '100대 명산', item: 'https://dulekil.vercel.app/mountains' },
          { '@type': 'ListItem', position: 3, name: mountain.name },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `${mountain.name} 등산 코스 난이도는?`,
            acceptedAnswer: { '@type': 'Answer', text: `${mountain.name}에는 ${courses.length}개 등산로가 있으며 주요 난이도는 '${bestDiff}'입니다.` },
          },
          {
            '@type': 'Question',
            name: `${mountain.name} 대중교통 접근이 가능한가요?`,
            acceptedAnswer: { '@type': 'Answer', text: hasTransit ? '대중교통 접근 가능한 코스가 있습니다.' : '대중교통 접근이 어렵습니다. 자가용을 권장합니다.' },
          },
          ...(minDist !== null ? [{
            '@type': 'Question',
            name: `${mountain.name} 등산 소요시간은?`,
            acceptedAnswer: { '@type': 'Answer', text: `최단 거리 ${minDist.toFixed(1)}km 기준 약 ${minutesToHM(maxDur)} 소요됩니다.` },
          }] : []),
        ],
      },
    ],
  }

  return (
    <div id="top">
      <SiteHeader active="explore" />
      <main>
        {/* 히어로 커버 */}
        <div style={{ position: 'relative' }}>
          <RidgeCoverImg name={mountain.name} pal={mountain.pal ?? 'forest'} height={260} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,.55))',
            padding: '40px 20px 20px',
          }}>
            <div style={{ maxWidth: 1140, margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                {mountain.is_top100 && <span className="tag tag--100">100대 명산</span>}
                {hasGpx && <span className="tag tag--gpx"><Icon name="route" size={13} stroke={2.2} />GPX</span>}
              </div>
              <h1 style={{ margin: 0, fontSize: 'clamp(28px,6vw,48px)', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-.02em' }}>
                {mountain.name}
              </h1>
              <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,.8)', fontSize: 16 }}>
                {mountain.region}{mountain.sigun ? ` ${mountain.sigun}` : ''} · 해발 {(mountain.elev ?? 0).toLocaleString()}m
              </p>
            </div>
          </div>
        </div>

        {/* 스탯 바 */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--line)' }}>
          <div className="wrap">
            <div className="statbar" style={{ maxWidth: 640 }}>
              <div className="stat">
                <div className="stat__k">고도</div>
                <div className="stat__v tnum">{(mountain.elev ?? 0).toLocaleString()}<span className="stat__u">m</span></div>
              </div>
              {minDist !== null && (
                <div className="stat">
                  <div className="stat__k">최단 거리</div>
                  <div className="stat__v tnum">{minDist.toFixed(1)}<span className="stat__u">km</span></div>
                </div>
              )}
              {maxDur !== null && maxDur > 0 && (
                <div className="stat">
                  <div className="stat__k">소요</div>
                  <div className="stat__v tnum">{minutesToHM(maxDur)}</div>
                </div>
              )}
              <div className="stat">
                <div className="stat__k">난이도</div>
                <div><span className={`diff diff--${cls}`} style={{ fontSize: 12 }}>난이도 {bestDiff}</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="wrap" style={{ paddingTop: 32, paddingBottom: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* 설명 */}
            {mountain.description && (
              <section className="card card--pad">
                <p className="body" style={{ margin: 0, fontSize: 16.5, lineHeight: 1.75 }}>{mountain.description}</p>
              </section>
            )}

            {/* 등산로 목록 */}
            {courses.length > 0 && (
              <section>
                <h2 className="h3" style={{ marginBottom: 16 }}>등산로 목록 ({courses.length}개)</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {courses.slice(0, 10).map(c => (
                    <div key={c.id} className="card card--pad" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 140 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--forest)' }}>{c.name ?? '코스'}</div>
                        {c.surface && <div className="cap">{c.surface}</div>}
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        {c.diff_norm && (
                          <span className={`diff diff--${DIFF_META[normDiff(c.diff_norm)]?.cls ?? 'mid'}`} style={{ fontSize: 12 }}>
                            난이도 {normDiff(c.diff_norm)}
                          </span>
                        )}
                        {c.distance != null && c.distance > 0 && (
                          <span className="tag">{c.distance.toFixed(1)}km</span>
                        )}
                        {c.duration_up != null && c.duration_up > 0 && (
                          <span className="tag"><Icon name="clock" size={12} stroke={1.8} />{minutesToHM(c.duration_up)}</span>
                        )}
                        {c.transit && <span className="tag"><Icon name="bus" size={12} stroke={1.8} />대중교통</span>}
                        {c.gpx_available && <span className="tag tag--gpx" style={{ fontSize: 11 }}>GPX</span>}
                      </div>
                      {c.risk_note && (
                        <div className="cap" style={{ width: '100%', color: '#8C4E22' }}>
                          ⚠️ {c.risk_note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 인피드 광고 */}
            <div className="ad ad--infeed"><span className="ad__label">광고 · 본문 인피드</span></div>

            {/* FAQ */}
            <section className="card card--pad">
              <h2 className="h3" style={{ marginBottom: 20 }}>자주 묻는 질문</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { q: `${mountain.name} 등산 난이도는?`, a: `${mountain.name}에는 총 ${courses.length}개의 등산로가 있으며, 주요 난이도는 '${bestDiff}'입니다. 가장 짧은 코스는 ${minDist ? minDist.toFixed(1) + 'km' : '?km'}입니다.` },
                  { q: `${mountain.name} 대중교통으로 갈 수 있나요?`, a: hasTransit ? '대중교통 접근이 가능한 등산로가 있습니다. 상세 교통편은 최신 시간표를 확인하세요.' : '대중교통 접근이 어렵습니다. 자가용을 이용하거나 관광버스 투어를 알아보세요.' },
                  { q: `${mountain.name} 등산 소요시간은?`, a: maxDur != null && maxDur > 0 ? `코스에 따라 다르며 상행 기준 약 ${minutesToHM(maxDur)} 소요됩니다. 개인 체력과 휴식 시간에 따라 차이가 있습니다.` : '코스마다 소요시간이 다릅니다. 출발 전 코스별 상세 정보를 확인하세요.' },
                ].map(faq => (
                  <div key={faq.q} style={{ borderBottom: '1px solid var(--line-soft)', paddingBottom: 16 }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: 'var(--forest)' }}>Q. {faq.q}</h3>
                    <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: 'var(--ink-soft)' }}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 안전 고지 */}
            <div className="safety">
              <div className="safety__icon"><Icon name="warn" size={21} stroke={2} /></div>
              <div>
                <h4>산행 전 꼭 확인하세요</h4>
                <p>본 페이지의 코스·소요시간은 공공데이터(data.go.kr, 산림청)를 가공한 참고치입니다. 실제 산행 전 날씨·체력·장비를 점검하고, 산림청·국립공원 공식 통제정보를 반드시 확인하세요.</p>
              </div>
            </div>

            {/* 같은 지역 명산 */}
            {nearby.length > 0 && (
              <section>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h2 className="h3">{group} 다른 명산</h2>
                  <Link href="/mountains" className="seemore">전체 보기 <Icon name="chevron" size={15} /></Link>
                </div>
                <div className="card-grid">
                  {nearby.map(n => (
                    <Link
                      key={n.id}
                      href={`/mountains/${encodeURIComponent(n.name)}`}
                      className="card card--hover card--pad"
                      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                        <span className="h3" style={{ fontSize: 18 }}>{n.name}</span>
                        <span className="cap">{n.elev.toLocaleString()}m</span>
                      </div>
                      <p className="cap">{n.region}</p>
                      <span className={`diff diff--${DIFF_META[n.diff]?.cls ?? 'mid'}`} style={{ fontSize: 12, alignSelf: 'flex-start' }}>
                        난이도 {n.diff}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteFooter />
    </div>
  )
}
