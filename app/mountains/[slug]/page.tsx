import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Icon } from '@/components/icon'
import { MOUNTAINS, DIFF_META, SEASON_ICON } from '@/lib/mountains-static'
import { ridgeCover } from '@/lib/motif'

// ISR — 허브 사전빌드, 신규는 on-demand
export const revalidate = 86400

interface Props { params: { slug: string } }

export function generateStaticParams() {
  return MOUNTAINS.map(m => ({ slug: m.name }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = MOUNTAINS.find(x => x.name === decodeURIComponent(params.slug))
  if (!m) return {}
  return {
    title: `${m.name} 등산 코스 — 난이도·거리·소요시간`,
    description: `${m.name}(${m.region}) 코스 정보. 난이도 ${m.diff}, 거리 ${m.dist}km, 소요 ${m.time}. ${m.transit ? '대중교통 접근 가능.' : '자가용 권장.'}`,
    openGraph: {
      title: `${m.name} 등산 코스`,
      description: `${m.region} · 해발 ${m.elev.toLocaleString()}m · 난이도 ${m.diff}`,
      type: 'article',
    },
  }
}

function RidgeCoverImg({ seed, pal, sun, height }: { seed: string; pal: string; sun?: boolean; height: number }) {
  const html = ridgeCover({ seed, palette: pal, sun: sun ? '#C9763D' : null, w: 1200, h: height * 2 })
  return (
    <div style={{ position: 'relative', height, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

export default function MountainDetailPage({ params }: Props) {
  const m = MOUNTAINS.find(x => x.name === decodeURIComponent(params.slug))
  if (!m) notFound()

  const diff = DIFF_META[m.diff]

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristAttraction',
        name: m.name,
        description: `${m.region}에 위치한 해발 ${m.elev}m의 산. 난이도 ${m.diff}.`,
        address: { '@type': 'PostalAddress', addressRegion: m.region, addressCountry: 'KR' },
        geo: m.name === '북한산' ? { '@type': 'GeoCoordinates', latitude: 37.66, longitude: 126.97 } : undefined,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: 'https://dulekil.com' },
          { '@type': 'ListItem', position: 2, name: '100대 명산', item: 'https://dulekil.com/mountains' },
          { '@type': 'ListItem', position: 3, name: m.name },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: `${m.name} 난이도는?`, acceptedAnswer: { '@type': 'Answer', text: `${m.name}의 난이도는 '${m.diff}'입니다. 총 거리 ${m.dist}km, 소요시간 약 ${m.time}이 기준입니다.` } },
          { '@type': 'Question', name: `${m.name} 대중교통으로 갈 수 있나요?`, acceptedAnswer: { '@type': 'Answer', text: m.transit ? `네, 대중교통 접근이 가능합니다. ${m.transitNote}` : `대중교통 접근이 어렵습니다. ${m.transitNote}` } },
          { '@type': 'Question', name: `${m.name} 등산 소요시간은?`, acceptedAnswer: { '@type': 'Answer', text: `${m.name} 완주 소요시간은 약 ${m.time}입니다. 코스와 개인 체력에 따라 다를 수 있습니다.` } },
        ],
      },
    ],
  }

  const nearby = MOUNTAINS
    .filter(x => x.id !== m.id && x.group === m.group)
    .sort((a, b) => b.pop - a.pop)
    .slice(0, 3)

  return (
    <div id="top">
      <SiteHeader active="explore" />
      <main>
        {/* 히어로 커버 */}
        <div style={{ position: 'relative' }}>
          <RidgeCoverImg seed={m.name} pal={m.pal} sun={m.sun} height={260} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,.55))',
            padding: '40px 20px 20px',
          }}>
            <div style={{ maxWidth: 1140, margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                <span className="tag tag--100">100대 명산</span>
                {m.gpx && <span className="tag tag--gpx"><Icon name="route" size={13} stroke={2.2} />GPX</span>}
              </div>
              <h1 style={{ margin: 0, fontSize: 'clamp(28px,6vw,48px)', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-.02em' }}>
                {m.name}
              </h1>
              <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,.8)', fontSize: 16 }}>
                {m.peak} · {m.region} · 해발 {m.elev.toLocaleString()}m
              </p>
            </div>
          </div>
        </div>

        {/* 스탯 바 */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--line)' }}>
          <div className="wrap">
            <div className="statbar" style={{ maxWidth: 640 }}>
              <div className="stat"><div className="stat__k">고도</div><div className="stat__v tnum">{m.elev.toLocaleString()}<span className="stat__u">m</span></div></div>
              <div className="stat"><div className="stat__k">거리</div><div className="stat__v tnum">{m.dist}<span className="stat__u">km</span></div></div>
              <div className="stat"><div className="stat__k">소요</div><div className="stat__v tnum">{m.time}</div></div>
              <div className="stat">
                <div className="stat__k">난이도</div>
                <div><span className={`diff diff--${diff?.cls ?? 'mid'}`} style={{ fontSize: 12 }}>난이도 {m.diff}</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="wrap" style={{ paddingTop: 32, paddingBottom: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 28 }}>

            {/* 교통·접근 정보 */}
            <section className="card card--pad">
              <h2 className="h3" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="bus" size={18} stroke={1.9} />
                교통·접근 정보
              </h2>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span className={`tag ${m.transit ? '' : 'tag--season'}`} style={{ flexShrink: 0 }}>
                  <Icon name="bus" size={13} stroke={1.8} />
                  {m.transit ? '대중교통 가능' : '자가용 권장'}
                </span>
                <p className="body" style={{ margin: 0, fontSize: 15 }}>{m.transitNote}</p>
              </div>
            </section>

            {/* 추천 계절 */}
            <section className="card card--pad">
              <h2 className="h3" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="leaf" size={18} stroke={1.9} />
                추천 계절
              </h2>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {m.seasons.map(s => (
                  <span key={s} className="tag tag--season" style={{ fontSize: 14, padding: '8px 14px' }}>
                    <Icon name={SEASON_ICON[s] ?? 'leaf'} size={14} stroke={1.8} />{s}
                  </span>
                ))}
                {m.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </section>

            {/* 인피드 광고 */}
            <div className="ad ad--infeed"><span className="ad__label">광고 · 본문 인피드</span></div>

            {/* FAQ */}
            <section className="card card--pad">
              <h2 className="h3" style={{ marginBottom: 20 }}>자주 묻는 질문</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { q: `${m.name} 난이도는?`, a: `${m.name}의 난이도는 '${m.diff}'입니다. 총 거리 ${m.dist}km, 소요시간 약 ${m.time} 기준입니다. 개인 체력과 코스에 따라 다를 수 있으니 사전에 충분한 준비가 필요합니다.` },
                  { q: `${m.name} 대중교통으로 갈 수 있나요?`, a: m.transit ? `대중교통 접근이 가능합니다. ${m.transitNote}` : `대중교통 접근이 어렵습니다. ${m.transitNote}` },
                  { q: `${m.name} 등산 소요시간은?`, a: `${m.name} 완주 소요시간은 약 ${m.time}입니다. 코스, 체력, 휴식 시간에 따라 개인차가 크므로 여유 있는 계획이 중요합니다.` },
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
                <p>본 페이지의 코스·소요시간은 공공데이터를 가공한 추정치입니다. 실제 산행 전 날씨·체력·장비를 점검하고, 산림청·국립공원 공식 통제정보를 반드시 확인하세요. 해 지기 전 하산을 권장합니다.</p>
              </div>
            </div>

            {/* 같은 지역 산 */}
            {nearby.length > 0 && (
              <section>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h2 className="h3">{m.group} 다른 명산</h2>
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteFooter />
    </div>
  )
}
