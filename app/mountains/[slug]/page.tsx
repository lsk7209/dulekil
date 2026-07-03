import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Icon } from '@/components/icon'
import { getMountainBySlug, getCoursesByMountainId, getMountainsForHub, getRegionGroup } from '@/lib/db/queries'
import { ridgeCover } from '@/lib/motif'
import { DIFF_META } from '@/lib/mountains-static'
import { getRelatedPosts } from '@/lib/mountain-blog-map'
import { CATS, getPostPath } from '@/lib/posts'
import {
  buildAccessNotes,
  buildFallbackRisks,
  buildFallbackRoutes,
  buildMountainDeepInfo,
  buildMountainFaqs,
  buildMountainFitNotes,
  buildMountainMetaDescription,
  buildMountainQuickFacts,
  buildMountainSummary,
  buildSafetyChecks,
  buildSeasonNotes,
  formatDistance,
  formatDuration,
  getCourseStats,
  normalizeDifficulty,
} from '@/lib/mountain-content'

export const revalidate = 86400

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  const rows = await getMountainsForHub()
  return rows.map(r => ({ slug: r.slug || r.name }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = decodeURIComponent(params.slug)
  const m = await getMountainBySlug(name)
  if (!m) return {}
  const courses = await getCoursesByMountainId(m.id)
  const description = buildMountainMetaDescription(m, courses)
  const ogSub = `${m.region ?? ''} · 해발 ${(m.elev ?? 0).toLocaleString()}m`
  const ogUrl = `/og?title=${encodeURIComponent(m.name)}&type=mountain&sub=${encodeURIComponent(ogSub)}`
  return {
    title: `${m.name} 등산 코스 — 난이도·거리·소요시간`,
    description,
    alternates: {
      canonical: `https://dullegilgogo.kr/mountains/${encodeURIComponent(m.name)}`,
    },
    openGraph: {
      title: `${m.name} 등산 코스`,
      description,
      type: 'article',
      url: `https://dullegilgogo.kr/mountains/${encodeURIComponent(m.name)}`,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: m.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${m.name} 등산 코스`,
      description,
      images: [ogUrl],
    },
  }
}

function minutesToHM(min: number | null): string {
  if (!min || min <= 0) return '?:??'
  return `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}`
}

function RidgeCoverImg({ name, pal, height }: { name: string; pal: string; height: number }) {
  const html = ridgeCover({ seed: name, palette: pal, w: 1200, h: height * 2 })
  return (
    <div role="img" aria-label={`${name} 능선 일러스트`} style={{ position: 'relative', height, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

export default async function MountainDetailPage({ params }: Props) {
  const name    = decodeURIComponent(params.slug)
  const mountain = await getMountainBySlug(name)
  if (!mountain) notFound()

  const courses       = await getCoursesByMountainId(mountain.id)
  const allMtns       = await getMountainsForHub()
  const group         = getRegionGroup(mountain.region)
  const nearby        = allMtns.filter(x => x.name !== mountain.name && x.group === group).slice(0, 3)
  const relatedPosts  = getRelatedPosts(mountain.name, group)
  const courseStats   = getCourseStats(courses)
  const summary       = buildMountainSummary(mountain, courses)
  const pageDescription = buildMountainMetaDescription(mountain, courses)
  const deepInfo      = buildMountainDeepInfo(mountain, courses)
  const fallbackRoutes = buildFallbackRoutes(mountain, courses)
  const faqs          = buildMountainFaqs(mountain, courses)
  const quickFacts    = buildMountainQuickFacts(mountain, courses)
  const fitNotes      = buildMountainFitNotes(mountain, courses)
  const accessNotes   = buildAccessNotes(mountain, courses)
  const seasonNotes   = buildSeasonNotes(mountain)
  const safetyChecks  = buildSafetyChecks(courses)
  const fallbackRisks = buildFallbackRisks(mountain, courses)

  const bestDiff  = courses.length > 0
    ? normalizeDifficulty(courseStats.shortest?.diff_norm ?? courseStats.hardest?.diff_norm)
    : '중'
  const cls       = DIFF_META[bestDiff]?.cls ?? 'mid'

  const hasTransit = courseStats.hasTransit
  const hasGpx     = courseStats.hasGpx
  const minDist    = courseStats.minDistance
  const maxDur     = courseStats.maxDuration

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristAttraction',
        name: mountain.name,
        description: pageDescription,
        image: `https://dullegilgogo.kr/og?title=${encodeURIComponent(mountain.name)}&type=mountain&sub=${encodeURIComponent(`${mountain.region ?? ''} · 해발 ${(mountain.elev ?? 0).toLocaleString()}m`)}`,
        address: { '@type': 'PostalAddress', addressRegion: mountain.region ?? '', addressCountry: 'KR' },
        ...(mountain.lat && mountain.lng ? {
          geo: { '@type': 'GeoCoordinates', latitude: mountain.lat, longitude: mountain.lng }
        } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: 'https://dullegilgogo.kr' },
          { '@type': 'ListItem', position: 2, name: '100대 명산', item: 'https://dullegilgogo.kr/mountains' },
          { '@type': 'ListItem', position: 3, name: mountain.name },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      },
    ],
  }

  return (
    <div id="top">
      <SiteHeader active="explore" />
      <main id="main-content">
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
            <section className="mountain-brief">
              <div>
                <div className="eyebrow" style={{ marginBottom: 8 }}>코스 선택 요약</div>
                <h2 className="h2" style={{ marginBottom: 12 }}>{mountain.name} 등산 전 핵심 판단</h2>
                <p className="body" style={{ marginBottom: 14 }}>
                  {mountain.description ?? summary[0]}
                </p>
                <ul>
                  {summary.map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div className="mountain-factbox">
                <strong>빠른 기준</strong>
                <dl>
                  <div><dt>추천 난이도</dt><dd>{quickFacts.difficultyLabel}</dd></div>
                  <div><dt>최단 코스</dt><dd>{quickFacts.distanceLabel}</dd></div>
                  <div><dt>상행 최대</dt><dd>{quickFacts.durationLabel}</dd></div>
                  <div><dt>접근성</dt><dd>{quickFacts.accessLabel}</dd></div>
                </dl>
              </div>
            </section>

            <nav className="mountain-toc" aria-label={`${mountain.name} 상세 목차`}>
              <a href="#mountain-info">산 정보</a>
              <a href="#mountain-fit">대상별 코스</a>
              <a href="#mountain-access">교통·들머리</a>
              <a href="#mountain-season">계절</a>
              <a href="#mountain-safety">안전</a>
              <a href="#mountain-faq">FAQ</a>
            </nav>

            <section id="mountain-info" className="mountain-deep">
              <div className="eyebrow" style={{ marginBottom: 8 }}>산 정보 깊이 보기</div>
              <h2 className="h2" style={{ marginBottom: 12 }}>{mountain.name} 산세·볼거리·산행 계획</h2>
              <p className="body mountain-deep__intro">{deepInfo.intro}</p>
              <div className="mountain-deep__grid">
                {deepInfo.highlights.map(item => (
                  <article key={item.title} className={`mountain-deep__item mountain-deep__item--${item.tone}`}>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>
              <p className="mountain-deep__source">{deepInfo.sourceNote}</p>
              {deepInfo.sources.length > 0 && (
                <div className="mountain-source-links" aria-label={`${mountain.name} 공식 확인 링크`}>
                  {deepInfo.sources.map(source => (
                    <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">
                      {source.label}
                    </a>
                  ))}
                </div>
              )}
            </section>

            <section id="mountain-fit">
              <h2 className="h2" style={{ marginBottom: 16 }}>{mountain.name} 추천 대상별 코스 선택</h2>
              <div className="mountain-info-grid">
                {fitNotes.map(note => (
                  <article key={note.title} className="card card--pad mountain-info-card">
                    <h3>{note.title}</h3>
                    <p>{note.body}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="mountain-access" className="card card--pad mountain-access">
              <h2 className="h2" style={{ marginBottom: 12 }}>{accessNotes.title}</h2>
              <p className="body">{accessNotes.body}</p>
              {accessNotes.trailheads.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <strong>확인된 들머리</strong>
                  <ul>
                    {accessNotes.trailheads.map(trailhead => <li key={trailhead}>{trailhead}</li>)}
                  </ul>
                </div>
              )}
            </section>

            <section id="mountain-season">
              <h2 className="h2" style={{ marginBottom: 16 }}>{mountain.name} 계절별 산행 포인트</h2>
              <div className="mountain-season-grid">
                {seasonNotes.map(note => (
                  <article key={note.season} className="card card--pad mountain-season-card">
                    <strong>{note.season}</strong>
                    <p>{note.body}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="mountain-safety" className="card card--pad mountain-checks">
              <h2 className="h2" style={{ marginBottom: 12 }}>{mountain.name} 안전 체크리스트</h2>
              <ul>
                {safetyChecks.checks.map(check => <li key={check}>{check}</li>)}
              </ul>
              {[...safetyChecks.risks, ...fallbackRisks].length > 0 && (
                <div className="mountain-risk-note">
                  <strong>코스 데이터에 표시된 주의 구간</strong>
                  <ul>
                    {[...safetyChecks.risks, ...fallbackRisks].map(risk => <li key={risk}>{risk}</li>)}
                  </ul>
                </div>
              )}
            </section>

            {/* 코스 비교표 */}
            {courses.length > 0 && (
              <section>
                <h2 className="h2" style={{ marginBottom: 16 }}>{mountain.name} 대표 코스 비교표</h2>
                <div className="article-table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>코스</th>
                        <th>거리</th>
                        <th>상행</th>
                        <th>난이도</th>
                        <th>접근</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.slice(0, 8).map(c => (
                        <tr key={c.id}>
                          <td>{c.name ?? '대표 코스'}</td>
                          <td>{formatDistance(c.distance)}</td>
                          <td>{formatDuration(c.duration_up)}</td>
                          <td>{normalizeDifficulty(c.diff_norm)}</td>
                          <td>{c.transit ? '대중교통' : '자가용 우선'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {fallbackRoutes.length > 0 && (
              <section>
                <h2 className="h2" style={{ marginBottom: 16 }}>{mountain.name} 대표 들머리 계획표</h2>
                <div className="article-table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>대표 들머리</th>
                        <th>추천 대상</th>
                        <th>계획 기준</th>
                        <th>주의</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fallbackRoutes.map(route => (
                        <tr key={route.name}>
                          <td>{route.name}</td>
                          <td>{route.target}</td>
                          <td>{route.plan}</td>
                          <td>{route.caution}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="cap" style={{ marginTop: -6 }}>
                  거리·시간 수치가 없는 산은 공식 탐방 안내와 현장 이정표 확인을 전제로 대표 들머리 중심으로 정리했습니다.
                </p>
              </section>
            )}

            {/* 등산로 목록 */}
            {courses.length > 0 && (
              <section>
                <h2 className="h2" style={{ marginBottom: 16 }}>등산로 목록 ({courses.length}개)</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {courses.slice(0, 20).map(c => (
                    <div key={c.id} className="card card--pad" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 140 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--forest)' }}>{c.name ?? '코스'}</div>
                        {c.surface && <div className="cap">{c.surface}</div>}
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        {c.diff_norm && (
                          <span className={`diff diff--${DIFF_META[normalizeDifficulty(c.diff_norm)]?.cls ?? 'mid'}`} style={{ fontSize: 12 }}>
                            난이도 {normalizeDifficulty(c.diff_norm)}
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
                          주의: {c.risk_note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {courses.length === 0 && fallbackRoutes.length === 0 && (
              <div className="card card--pad" style={{ textAlign: 'center', color: 'var(--ink-faint)', padding: 32 }}>
                <p>등산로 데이터를 준비 중입니다.</p>
              </div>
            )}

            {/* 관련 가이드 & 블로그 */}
            {relatedPosts.length > 0 && (
              <section>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h2 className="h2">{mountain.name} 관련 가이드</h2>
                  <Link href="/blog" className="seemore">전체 보기 <Icon name="chevron" size={15} /></Link>
                </div>
                <div className="card-grid">
                  {relatedPosts.map(post => {
                    const cat = CATS[post.cat]
                    return (
                      <Link
                        key={post.id}
                        href={getPostPath(post)}
                        className="card card--hover card--pad"
                        style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}
                      >
                        <span style={{ fontSize: 12, fontWeight: 700, color: cat?.c ?? 'var(--forest)', background: cat?.bg ?? 'var(--bg-warm)', borderRadius: 4, padding: '2px 7px', alignSelf: 'flex-start' }}>
                          {post.cat}
                        </span>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, lineHeight: 1.4, color: 'var(--ink)' }}>{post.title}</p>
                        <span className="cap">{post.read}분 읽기</span>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}

            {/* FAQ */}
            <section id="mountain-faq" className="card card--pad">
              <h2 className="h2" style={{ marginBottom: 20 }}>자주 묻는 질문</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {faqs.map(faq => (
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
                <p>본 페이지의 코스·소요시간은 <a href="https://www.data.go.kr" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>공공데이터포털</a>·<a href="https://www.forest.go.kr" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>산림청</a>을 가공한 참고치입니다. 실제 산행 전 <a href="https://www.weather.go.kr" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>기상청</a> 날씨와 <a href="https://www.knps.or.kr" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>국립공원공단</a> 통제정보를 반드시 확인하세요.</p>
              </div>
            </div>

            {/* 같은 지역 명산 */}
            {nearby.length > 0 && (
              <section>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h2 className="h2">{group} 다른 명산</h2>
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
