import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = { title: '이용약관' }

export default function TermsPage() {
  return (
    <div id="top">
      <SiteHeader />
      <main className="wrap wrap--narrow" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <h1 className="h1" style={{ marginBottom: 8 }}>이용약관</h1>
        <p className="cap" style={{ marginBottom: 32 }}>최종 업데이트: 2026년 6월 3일</p>
        <div className="body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <p>본 사이트의 모든 코스·등산로 정보는 공공데이터를 가공한 참고 자료입니다. 실제 산행 전 반드시 공식 기관(산림청, 국립공원관리공단 등)의 최신 통제정보를 확인하세요.</p>
          <p>사이트 이용 중 발생하는 사고나 피해에 대해 운영자는 책임을 지지 않습니다.</p>
          <p>콘텐츠의 무단 복제 및 재배포를 금합니다. 공공데이터 원본은 각 기관의 라이선스를 따릅니다(<a href="/data-license" style={{ color: 'var(--clay-deep)' }}>데이터 출처·라이선스</a> 참고).</p>
          <p>문의: <a href="mailto:lsk7209@gmail.com" style={{ color: 'var(--clay-deep)' }}>lsk7209@gmail.com</a></p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
