import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{
        width: 180, height: 180,
        background: '#2F4A3C',
        borderRadius: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 0, height: 0,
          borderLeft: '52px solid transparent',
          borderRight: '52px solid transparent',
          borderBottom: '80px solid #C4D1C7',
          marginBottom: 12,
        }} />
      </div>
    ),
    { ...size },
  )
}
