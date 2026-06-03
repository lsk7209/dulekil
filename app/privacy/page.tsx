import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = { title: '개인정보처리방침' }

export default function PrivacyPage() {
  return (
    <div id="top">
      <SiteHeader />
      <main className="wrap wrap--narrow" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <h1 className="h1" style={{ marginBottom: 8 }}>개인정보처리방침</h1>
        <p className="cap" style={{ marginBottom: 32 }}>최종 업데이트: 2026년 6월 3일</p>
        <div className="body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <p>둘레길(이하 "사이트")은 이용자의 개인정보를 수집하지 않습니다.</p>
          <p>완등 트래커 기록은 이용자 브라우저의 <code>localStorage</code>에만 저장되며, 서버로 전송되지 않습니다.</p>
          <p>사이트 이용 통계를 위해 Google Analytics를 사용할 수 있으며, Google의 개인정보처리방침이 적용됩니다.</p>
          <p>광고 표시를 위해 Google AdSense를 사용할 수 있으며, 광고 관련 쿠키는 Google의 정책을 따릅니다.</p>
          <p>문의: <a href="mailto:lsk7209@gmail.com" style={{ color: 'var(--clay-deep)' }}>lsk7209@gmail.com</a></p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
