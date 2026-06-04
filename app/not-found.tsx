import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function NotFound() {
  return (
    <div id="top">
      <SiteHeader />
      <main>
        <div className="wrap" style={{ paddingTop: 80, paddingBottom: 80, textAlign: 'center' }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>⛰</div>
          <h1 className="h2" style={{ marginBottom: 12, color: 'var(--forest)' }}>페이지를 찾을 수 없습니다</h1>
          <p style={{ color: 'var(--ink-soft)', marginBottom: 36, fontSize: 16 }}>
            요청하신 페이지가 없거나 이동되었습니다.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" className="btn btn--forest">홈으로</Link>
            <Link href="/mountains" className="btn btn--ghost">100대 명산 보기</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
