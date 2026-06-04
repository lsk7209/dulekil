import Link from 'next/link'

const LOGO_ICON = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
    <path d="M3 19l5-8 3 4 3-6 4 10z" />
  </svg>
)

const FOOTER_LINKS = [
  ['사이트', [
    ['명산 허브',   '/#explore'],
    ['완등 트래커', '/tracker'],
    ['블로그',      '/blog'],
    ['가이드',      '/#guide'],
  ]],
  ['정보', [
    ['소개',              '/about'],
    ['데이터 출처·라이선스', '/data-license'],
    ['개인정보처리방침',   '/privacy'],
    ['이용약관',          '/terms'],
  ]],
] as const

export function SiteFooter() {
  return (
    <footer style={{ marginTop: 44, background: 'var(--forest-deep)', color: '#C9D3CB' }}>
      <div className="wrap footer-grid" style={{ paddingTop: 26, paddingBottom: 30 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--sage)', display: 'grid', placeItems: 'center', color: 'var(--forest-deep)' }}>
              {LOGO_ICON}
            </span>
            <span style={{ fontWeight: 800, fontSize: 19, color: '#fff', whiteSpace: 'nowrap' }}>둘레길고고</span>
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#9FB2AE', maxWidth: 280, margin: 0 }}>
            100대 명산 완등 챌린지를 위한 코스·둘레길 정보 사이트.
          </p>
        </div>

        <div className="foot-links">
          {FOOTER_LINKS.map(([heading, items]) => (
            <div key={heading}>
              <div style={{ fontWeight: 700, color: '#EAE6DC', fontSize: 13, marginBottom: 10 }}>{heading}</div>
              {items.map(([label, href]) => (
                <Link key={label} href={href} className="foot-a">{label}</Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,.1)' }}>
        <div className="wrap" style={{ paddingTop: 16, paddingBottom: 22, fontSize: 12.5, color: '#8DA197', lineHeight: 1.7 }}>
          출처: data.go.kr · 산림청 · 한국관광공사 (공공누리 제1유형). 본 사이트는 공공데이터를 가공해 제작되었으며, 일부 설명은 AI 보조로 자동 생성된 데이터 가공물입니다. 코스·통제 정보는 공식 기관 고지를 우선 확인하세요.
        </div>
      </div>
    </footer>
  )
}
