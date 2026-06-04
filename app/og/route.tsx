import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'

export const runtime = 'edge'

const W = 1200
const H = 630

const PALETTES: Record<string, { bg: string; ridge1: string; ridge2: string; ridge3: string }> = {
  mountain: { bg: '#1A2E20', ridge1: '#2F4A3C', ridge2: '#243B30', ridge3: '#1A2E20' },
  blog:     { bg: '#1C2A38', ridge1: '#2A3E50', ridge2: '#1E3040', ridge3: '#162230' },
  default:  { bg: '#1A2E20', ridge1: '#2F4A3C', ridge2: '#243B30', ridge3: '#1A2E20' },
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? '둘레길고고'
  const type  = (searchParams.get('type') ?? 'default') as keyof typeof PALETTES
  const sub   = searchParams.get('sub') ?? '100대 명산 등산 정보'

  const pal = PALETTES[type] ?? PALETTES.default

  return new ImageResponse(
    (
      <div
        style={{
          width: W, height: H,
          display: 'flex', flexDirection: 'column',
          background: pal.bg,
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* 능선 레이어 3단 */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 320,
          background: pal.ridge1,
          clipPath: 'polygon(0 60%, 8% 40%, 18% 52%, 28% 28%, 38% 44%, 48% 20%, 58% 38%, 68% 15%, 78% 35%, 88% 22%, 100% 40%, 100% 100%, 0 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 240,
          background: pal.ridge2,
          clipPath: 'polygon(0 55%, 10% 35%, 22% 50%, 34% 25%, 46% 42%, 56% 18%, 66% 36%, 76% 12%, 86% 30%, 96% 20%, 100% 35%, 100% 100%, 0 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 160,
          background: pal.ridge3,
          clipPath: 'polygon(0 65%, 12% 45%, 24% 60%, 36% 35%, 48% 55%, 60% 28%, 72% 48%, 84% 30%, 96% 45%, 100% 38%, 100% 100%, 0 100%)',
        }} />

        {/* 상단 로고 */}
        <div style={{
          position: 'absolute', top: 48, left: 64,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: '#3A5848',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24,
          }}>⛰</div>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>
            둘레길고고
          </span>
        </div>

        {/* 중앙 텍스트 */}
        <div style={{
          position: 'absolute', top: 0, bottom: 180, left: 0, right: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '0 64px',
        }}>
          {sub && (
            <div style={{
              fontSize: 22, color: 'rgba(180,210,190,0.85)',
              fontWeight: 600, marginBottom: 20,
              letterSpacing: '0.04em',
            }}>
              {sub}
            </div>
          )}
          <div style={{
            fontSize: title.length > 20 ? 58 : title.length > 12 ? 66 : 76,
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            maxWidth: 900,
          }}>
            {title}
          </div>
        </div>

        {/* 하단 URL */}
        <div style={{
          position: 'absolute', bottom: 44, left: 64,
          color: 'rgba(255,255,255,0.4)', fontSize: 20,
        }}>
          dullegilgogo.kr
        </div>
      </div>
    ),
    { width: W, height: H },
  )
}
