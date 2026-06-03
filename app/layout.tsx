import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: '둘레길 — 100대 명산 챌린지 도우미',
    template: '%s · 둘레길',
  },
  description: '한국 100대 명산 완등 챌린지를 위한 코스·둘레길 정보 사이트. 집에서 다음 산을 계획하세요.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
