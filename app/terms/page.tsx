import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: '이용약관 | 둘레길고고',
  description: '둘레길고고 사이트 이용 조건 및 면책 사항에 대한 약관입니다.',
  alternates: { canonical: 'https://dullegilgogo.kr/terms' },
}

const SECTIONS = [
  {
    title: '1. 서비스 소개',
    body: `둘레길고고(dullegilgogo.kr, 이하 "사이트")는 한국 산림청이 선정한 100대 명산의 코스 정보를 제공하는 참고용 정보 서비스입니다.\n\n본 사이트를 이용함으로써 아래 약관에 동의하는 것으로 간주합니다.`,
  },
  {
    title: '2. 정보의 정확성 및 면책',
    body: `본 사이트의 등산 코스 정보(거리·소요시간·난이도·대중교통 등)는 data.go.kr, 산림청, 한국관광공사 공공데이터를 가공한 참고 자료이며, 일부 설명은 AI가 보조 작성한 데이터 가공물입니다.\n\n현장 상황, 기상 조건, 탐방로 변경 등으로 인해 실제와 다를 수 있습니다. 산행 전 반드시 산림청·국립공원 공식 통제 정보를 확인하세요.\n\n사이트 운영자는 정보의 오류로 인해 발생한 산행 사고, 재산 피해, 기타 손해에 대해 법적 책임을 지지 않습니다.`,
  },
  {
    title: '3. 이용 제한',
    body: `다음 행위는 금지됩니다.\n\n• 본 사이트 콘텐츠를 무단으로 크롤링·복사·재배포하는 행위\n• 서비스 운영에 지장을 주는 과도한 요청(DDoS 등)\n• 허위 정보를 제출하거나 서비스를 악용하는 행위`,
  },
  {
    title: '4. 데이터 출처 및 라이선스',
    body: `코스 데이터는 공공누리 제1유형(출처 표시) 라이선스가 적용된 공공데이터를 가공해 제작되었습니다. 출처: data.go.kr(ID: 15029184), 산림청, 한국관광공사.\n\n공공누리 제1유형에 따라 출처를 표시하면 상업적 이용·변경·재배포가 허용됩니다. 자세한 내용은 데이터 출처·라이선스 페이지를 참고하세요.`,
  },
  {
    title: '5. 지식재산권',
    body: `사이트 디자인, 레이아웃, 고유 콘텐츠(블로그 글, 가이드 등)의 저작권은 운영자에게 있습니다. 무단 복제 및 상업적 이용을 금지합니다.`,
  },
  {
    title: '6. 서비스 변경 및 중단',
    body: `운영자는 서비스 내용을 사전 고지 없이 변경하거나 중단할 수 있습니다. 서비스 중단으로 인한 손해에 대해 운영자는 책임을 지지 않습니다.`,
  },
  {
    title: '7. 문의',
    body: `이용약관에 관한 문의는 아래로 연락주세요.\n\n이메일: lsk7209@gmail.com\n\n본 약관은 서비스 변경에 따라 개정될 수 있으며, 변경 시 본 페이지에 게시합니다.`,
  },
]

export default function TermsPage() {
  return (
    <div id="top">
      <SiteHeader />
      <main id="main-content" className="wrap wrap--narrow" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>법적 고지</div>
        <h1 className="h1" style={{ marginBottom: 8 }}>이용약관</h1>
        <p className="cap" style={{ marginBottom: 40 }}>최종 업데이트: 2025-06-01</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {SECTIONS.map(s => (
            <section key={s.title}>
              <h2 className="h3" style={{ marginBottom: 12, color: 'var(--forest)' }}>{s.title}</h2>
              {s.body.split('\n\n').map((para, i) => (
                <p key={i} className="body" style={{ whiteSpace: 'pre-line', marginBottom: 10 }}>{para}</p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
