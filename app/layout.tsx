import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

const GA_ID      = process.env.NEXT_PUBLIC_GA_ID
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

export const metadata: Metadata = {
  title: {
    default: '둘레길 — 100대 명산 챌린지 도우미',
    template: '%s · 둘레길',
  },
  description: '한국 100대 명산 완등 챌린지를 위한 코스·둘레길 정보 사이트. 집에서 다음 산을 계획하세요.',
  keywords: ['100대 명산', '등산 코스', '둘레길', '완등 챌린지', '등산 난이도', '대중교통 등산'],
  authors: [{ name: '둘레길' }],
  metadataBase: new URL('https://dulekil.vercel.app'),
  openGraph: {
    siteName: '둘레길',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://dulekil.vercel.app',
  },
  verification: {
    google: 'F4MlP2TwGNrutz6uvY5BhPRqbdgAA5QXvuVhg0KbFg0',
    other: {
      'naver-site-verification': '43567d5a8e06ca7e10fa1d706c858b086a85ff4f',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* Google AdSense — 승인 후 NEXT_PUBLIC_ADSENSE_CLIENT_ID 설정 */}
        {ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body>
        {children}

        {/* Google Analytics — NEXT_PUBLIC_GA_ID 설정 후 활성화 */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}</Script>
          </>
        )}
      </body>
    </html>
  )
}
