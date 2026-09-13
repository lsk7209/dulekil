import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

const OG_URL = '/og?title=데이터+출처·라이선스&type=default&sub=공공데이터+공공누리+제1유형'

const SOURCE_LINKS = [
  ['공공데이터포털', 'https://www.data.go.kr/'],
  ['산림청', 'https://www.forest.go.kr/'],
  ['한국관광공사', 'https://knto.or.kr/'],
  ['두루누비', 'https://www.durunubi.kr/'],
] as const

export const metadata: Metadata = {
  title: '데이터 출처·라이선스',
  description: '둘레길고고 사이트에서 사용하는 공공데이터 출처 및 라이선스 정보',
  alternates: { canonical: 'https://dullegilgogo.kr/data-license' },
  openGraph: {
    title: '데이터 출처·라이선스',
    description: '산림청·한국관광공사·data.go.kr 공공데이터 출처 및 공공누리 라이선스 안내',
    type: 'website',
    url: 'https://dullegilgogo.kr/data-license',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: '데이터 출처·라이선스' }],
  },
  twitter: { card: 'summary_large_image', images: [OG_URL] },
}

export default function DataLicensePage() {
  return (
    <div id="top">
      <SiteHeader />
      <main id="main-content" className="wrap wrap--narrow" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>공개 정보</div>
        <h1 className="h1" style={{ marginBottom: 24 }}>데이터 출처·라이선스</h1>

        <div className="body" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <section>
            <h2 className="h3" style={{ marginBottom: 12 }}>사용 데이터 목록</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { name: '전국등산로표준데이터', provider: '산림청', id: 'data.go.kr ID: 15029184', license: '공공누리 제1유형', note: '출처 표시 조건 상업이용·변경·배포 허용' },
                { name: '두루누비 코스 정보',   provider: '한국관광공사', id: 'data.go.kr Durunubi', license: '이용허락범위 제한 없음', note: '상업이용·DB저장 허용' },
                { name: '명산등산로 API',       provider: '산림청', id: 'data.go.kr cultureInfoService', license: '이용허락범위 제한 없음', note: '상업이용·DB저장 허용' },
              ].map(d => (
                <div key={d.name} className="card card--pad" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--forest)' }}>{d.name}</div>
                  <div className="cap">제공: {d.provider} · {d.id}</div>
                  <div style={{ display: 'inline-flex' }}>
                    <span className="tag tag--100" style={{ fontSize: 12 }}>{d.license}</span>
                  </div>
                  <p className="cap">{d.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="h3" style={{ marginBottom: 12 }}>출처 표기</h2>
            <p>본 사이트의 코스·등산로 정보는 <b>data.go.kr, 산림청, 한국관광공사</b> 공공데이터를 가공해 제작되었습니다. 공공누리 제1유형에 따라 출처를 표기합니다.</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              {SOURCE_LINKS.map(([label, href]) => (
                <a key={href} className="tag" href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--forest)', textDecoration: 'none' }}>
                  {label}
                </a>
              ))}
            </div>
          </section>

          <section>
            <h2 className="h3" style={{ marginBottom: 12 }}>AI 보조 작성 고지</h2>
            <p>일부 산 소개 및 코스 설명은 AI(Google Gemini)가 보조 작성한 데이터 가공물입니다. 정확성 확인을 위해 원본 공공데이터와 공식 기관 안내를 참고하세요.</p>
          </section>

          <section>
            <h2 className="h3" style={{ marginBottom: 12 }}>정보 검증과 이용 한계</h2>
            <p>
              둘레길고고는 공공데이터를 바탕으로 산 이름, 지역, 높이, 난이도, 교통 접근성, 코스 설명을 정리하지만 실시간 운영 정보를 보장하지 않습니다. 탐방로 폐쇄, 산불방지 입산통제, 폭우·폭설 이후 복구 공사, 주차장 운영, 대중교통 시간표는 현장과 공식 기관 공지가 우선합니다.
            </p>
            <p style={{ marginTop: 10 }}>
              안전과 비용이 걸린 의사결정에는 이 사이트의 요약만 사용하지 말고 산림청, 국립공원공단, 지자체, 기상청, 교통 사업자의 최신 공지를 함께 확인해 주세요. 공개 데이터의 구조가 바뀌거나 원천 기관이 항목을 수정하면 사이트의 설명도 순차적으로 재가공합니다.
            </p>
          </section>

          <section>
            <h2 className="h3" style={{ marginBottom: 12 }}>정정·삭제 요청</h2>
            <p>데이터 오류, 출처 표기 누락, 삭제 요청, 안전상 위험한 표현은 <a href="mailto:lsk7209@gmail.com" style={{ color: 'var(--clay-deep)' }}>lsk7209@gmail.com</a>으로 연락해 주세요. 요청 시 산 이름, 페이지 주소, 오류로 보이는 문장, 참고 가능한 공식 출처를 함께 보내주시면 더 빠르게 확인할 수 있습니다.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
