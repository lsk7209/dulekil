'use client'

import Link from 'next/link'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 56 }}>⚠️</div>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>오류가 발생했습니다</h2>
      <p style={{ color: '#6b7280', marginBottom: 8 }}>잠시 후 다시 시도해 주세요.</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={reset} style={{ padding: '10px 20px', background: '#2F4A3C', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          다시 시도
        </button>
        <Link href="/" style={{ padding: '10px 20px', border: '1px solid #d1d5db', borderRadius: 8, textDecoration: 'none', color: '#374151', fontWeight: 600 }}>
          홈으로
        </Link>
      </div>
    </div>
  )
}
