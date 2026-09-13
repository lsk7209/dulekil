import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '둘레길고고 사이트의 개인정보 수집·이용·제3자 제공에 관한 방침을 안내합니다.',
  alternates: { canonical: 'https://dullegilgogo.kr/privacy' },
}

const SECTIONS = [
  {
    title: '1. 수집하는 정보',
    body: `본 사이트(둘레길고고, dullegilgogo.kr)는 회원 가입·로그인 기능이 없으며 개인 식별 정보를 직접 입력받지 않습니다.\n\n다음 정보는 서비스 개선·광고 제공 목적으로 제3자 도구에 전송되거나 자동 수집될 수 있습니다.\n\n• Google Analytics: 설정된 경우 페이지 방문 기록, 접속 기기·브라우저 정보, 체류 시간\n• Google AdSense: 설정된 경우 광고 노출·상호작용 정보와 쿠키 등 광고 기술\n• 쿠팡 파트너스 배너 제공·측정 시스템: 배너가 표시되는 현재 페이지 경로, 사이트·광고 위치 식별자, 이미지 요청 및 링크 상호작용 정보\n• 브라우저 localStorage: 완등 체크 기록 (둘레길고고 서버 전송 없이 기기 내 저장만)`,
  },
  {
    title: '2. 쿠키 및 유사 기술',
    body: `Google Analytics·Google AdSense 등 제3자 서비스는 구성과 이용자의 동의 상태에 따라 쿠키 또는 유사 기술을 사용할 수 있습니다. Google 광고·분석 태그는 운영 환경에서 적용 가능한 동의 관리와 계정 연결을 확인한 뒤에만 활성화하도록 구성합니다.\n\n이용자는 사이트에 제공되는 동의 선택 기능과 브라우저 설정을 이용할 수 있으며, Google 광고 개인화 설정은 아래에서 변경할 수 있습니다.\n\n• Google 광고 설정: https://myadcenter.google.com\n• Google Analytics 차단: 브라우저 확장 프로그램 'Google Analytics Opt-out' 사용 가능`,
  },
  {
    title: '3. 제3자 서비스',
    body: `본 사이트는 다음 외부 서비스를 이용하거나 운영 설정에 따라 이용할 수 있습니다.\n\n• Google Analytics (Google LLC): 방문자 통계 분석\n• Google AdSense (Google LLC): 광고 게재\n• 쿠팡 파트너스 및 둘레길고고의 배너 제공·측정 시스템: 제휴 배너 제공과 성과 측정\n• Vercel (Vercel Inc.): 웹 호스팅 및 CDN\n• Turso: 데이터베이스 서비스\n\n각 서비스의 개인정보처리방침은 해당 제공업체 웹사이트에서 확인하세요.`,
  },
  {
    title: '4. 정보 보유 기간',
    body: `완등 체크 기록은 브라우저 localStorage에만 저장되며 서버에 전송되지 않습니다. 브라우저 데이터를 지우면 즉시 삭제됩니다.\n\nGoogle Analytics·AdSense에서 수집된 데이터의 보유 기간은 각 서비스의 방침을 따릅니다.`,
  },
  {
    title: '5. 이용자 권리',
    body: `본 사이트는 개인 식별 정보를 보유하지 않으므로 별도 삭제 요청은 필요하지 않습니다.\n\nGoogle 서비스와 관련된 데이터 삭제·수정 요청은 Google 계정 설정을 통해 직접 처리하시거나, 아래 연락처로 문의하세요.`,
  },
  {
    title: '6. 문의',
    body: `개인정보와 관련된 문의 사항은 아래로 연락주세요.\n\n이메일: lsk7209@gmail.com\n\n본 방침은 법령 변경 또는 서비스 변경에 따라 사전 고지 후 개정될 수 있습니다. 변경 시 본 페이지에 게시합니다.`,
  },
]

export default function PrivacyPage() {
  return (
    <div id="top">
      <SiteHeader />
      <main id="main-content" className="wrap wrap--narrow" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>법적 고지</div>
        <h1 className="h1" style={{ marginBottom: 8 }}>개인정보처리방침</h1>
        <p className="cap" style={{ marginBottom: 40 }}>최종 업데이트: 2026-09-13</p>

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
