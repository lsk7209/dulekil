import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt     = '둘레길고고 — 100대 명산 챌린지 도우미'
export const size    = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1F3329 0%, #2F4A3C 60%, #3D5E4E 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 80px',
          position: 'relative',
        }}
      >
        {/* 장식 원 */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 360, height: 360, borderRadius: '50%',
          background: 'rgba(138,163,150,0.12)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 280, height: 280, borderRadius: '50%',
          background: 'rgba(138,163,150,0.08)',
          display: 'flex',
        }} />

        {/* 배지 */}
        <div style={{
          background: 'rgba(201,118,61,0.9)',
          borderRadius: '100px',
          padding: '10px 24px',
          fontSize: 20,
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '0.05em',
          marginBottom: 32,
          display: 'flex',
        }}>
          산림청 선정 · 100대 명산
        </div>

        {/* 사이트명 */}
        <div style={{
          fontSize: 88,
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1.0,
          letterSpacing: '-0.03em',
          marginBottom: 20,
          display: 'flex',
        }}>
          둘레길고고
        </div>

        {/* 슬로건 */}
        <div style={{
          fontSize: 30,
          color: 'rgba(255,255,255,0.75)',
          lineHeight: 1.4,
          textAlign: 'center',
          maxWidth: 700,
          display: 'flex',
        }}>
          집에서 다음 산을 계획하세요
        </div>

        {/* URL */}
        <div style={{
          position: 'absolute', bottom: 48, right: 80,
          fontSize: 18,
          color: 'rgba(255,255,255,0.45)',
          display: 'flex',
        }}>
          dullegilgogo.kr
        </div>
      </div>
    ),
    size
  )
}
