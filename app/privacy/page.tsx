import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: '개인정보처리방침 | 둘레길고고',
  description: '둘레길고고 사이트의 개인정보 수집·이용·제3자 제공에 관한 방침을 안내합니다.',
  alternates: { canonical: 'https://dullegilgogo.kr/privacy' },
}

const SECTIONS = [
  {
    title: '1. 수집하는 정보',
    body: `본 사이트(둘레길고고, dullegilgogo.kr)는 회원 가입·로그인 기능이 없으며 개인 식별 정보를 직접 수집하지 않습니다.\n\n다음 정보는 서비스 개선·광고 제공 목적으로 제3자 도구를 통해 자동 수집될 수 있습니다.\n\n• Google Analytics: 페이지 방문 기록, 접속 기기·브라우저 정보, 체류 시간 (익명화된 IP 주소)\n• Google AdSense: 광고 노출·클릭 데이터, 쿠키를 통한 관심사 기반 광고\n• 브라우저 localStorage: 완등 체크 기록 (서버 전송 없이 기기 내 저장만)`,
  },
  {
    title: '2. 쿠키 및 유사 기술',
    body: `본 사이트는 직접 쿠키를 설정하지 않습니다. 다만 Google Analytics·Google AdSense가 자체 쿠키를 설정할 수 있습니다.\n\n브라우저 설정에서 쿠키를 차단하거나 Google 광고 개인화를 옵트아웃할 수 있습니다.\n\n• Google 광고 설정: https://myadcenter.google.com\n• Google Analytics 차단: 브라우저 확장 프로그램 'Google Analytics Opt-out' 사용 가능`,
  },
  {
    title: '3. 제3자 서비스',
    body: `본 사이트는 다음 외부 서비스를 이용합니다.\n\n• Google Analytics (구글 LLC): 방문자 통계 분석\n• Google AdSense (구글 LLC): 광고 게재\n• Vercel (Vercel Inc.): 웹 호스팅 및 CDN\n• Turso (ChiselStrike Inc.): 데이터베이스 서비스\n\n각 서비스의 개인정보처리방침은 해당 제공업체 웹사이트에서 확인하세요.`,
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
