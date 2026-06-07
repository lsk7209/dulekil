import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: '문의하기 | 둘레길고고',
  description:
    '둘레길고고의 코스 정보 오류 제보, 데이터 출처 정정, 광고 및 제휴 문의, 개인정보 관련 요청을 안내합니다.',
  alternates: { canonical: 'https://dullegilgogo.kr/contact' },
  openGraph: {
    title: '문의하기 | 둘레길고고',
    description: '둘레길고고 운영 관련 문의와 정보 정정 요청 안내 페이지입니다.',
    type: 'website',
    url: 'https://dullegilgogo.kr/contact',
  },
}

export default function ContactPage() {
  return (
    <div id="top">
      <SiteHeader />
      <main id="main-content" className="wrap wrap--narrow" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>문의</div>
        <h1 className="h1" style={{ marginBottom: 24 }}>문의하기</h1>

        <div className="body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <p>
            둘레길고고는 등산 코스, 명산 정보, 걷기 기록에 필요한 일반 정보를 정리하는 사이트입니다.
            코스 정보 오류, 출처 정정, 광고 및 제휴 문의, 개인정보 관련 요청은 아래 연락처로 보내 주세요.
          </p>

          <section>
            <h2>문의 가능 항목</h2>
            <ul>
              <li>산행 코스, 거리, 소요 시간, 난이도 정보의 오류 제보</li>
              <li>공공데이터 출처, 업데이트 날짜, 인용 정보 정정 요청</li>
              <li>광고 게재, 제휴, 자료 제공 관련 문의</li>
              <li>개인정보 열람, 정정, 삭제 요청</li>
            </ul>
          </section>

          <section>
            <h2>연락처</h2>
            <p>
              이메일:{' '}
              <a href="mailto:lsk7209@gmail.com">
                lsk7209@gmail.com
              </a>
            </p>
            <p>
              문의 시 문제가 있는 페이지 주소, 확인한 날짜, 정정이 필요한 내용을 함께 적어 주시면
              검토가 빠릅니다.
            </p>
          </section>

          <div className="safety">
            <div>
              <h4>안전 안내</h4>
              <p>
                등산 코스와 날씨, 통제 정보는 현장 상황에 따라 달라질 수 있습니다. 실제 산행 전에는
                산림청, 국립공원공단, 지자체 공지와 현장 안내를 반드시 확인해 주세요.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
