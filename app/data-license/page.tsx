import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

const OG_URL = '/og?title=데이터+출처·라이선스&type=default&sub=공공데이터+공공누리+제1유형'

export const metadata: Metadata = {
  title: '데이터 출처·라이선스 | 둘레길고고',
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
          </section>

          <section>
            <h2 className="h3" style={{ marginBottom: 12 }}>AI 보조 작성 고지</h2>
            <p>일부 산 소개 및 코스 설명은 AI(Google Gemini)가 보조 작성한 데이터 가공물입니다. 정확성 확인을 위해 원본 공공데이터와 공식 기관 안내를 참고하세요.</p>
          </section>

          <section>
            <h2 className="h3" style={{ marginBottom: 12 }}>삭제 요청</h2>
            <p>데이터 오류 또는 삭제 요청은 <a href="mailto:lsk7209@gmail.com" style={{ color: 'var(--clay-deep)' }}>lsk7209@gmail.com</a>으로 연락해 주세요.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
