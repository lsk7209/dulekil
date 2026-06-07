import type { Metadata } from 'next'
import Script from 'next/script'
import localFont from 'next/font/local'
import { Noto_Serif_KR } from 'next/font/google'
import './globals.css'

const pretendard = localFont({
  src: [
    { path: '../node_modules/pretendard/dist/web/static/woff2/Pretendard-Regular.woff2',   weight: '400', style: 'normal' },
    { path: '../node_modules/pretendard/dist/web/static/woff2/Pretendard-SemiBold.woff2',  weight: '600', style: 'normal' },
    { path: '../node_modules/pretendard/dist/web/static/woff2/Pretendard-Bold.woff2',      weight: '700', style: 'normal' },
    { path: '../node_modules/pretendard/dist/web/static/woff2/Pretendard-ExtraBold.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-pretendard',
  display: 'swap',
  preload: false,
})

const notoSerifKR = Noto_Serif_KR({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-noto-serif',
  display: 'swap',
  preload: false,
})

const GA_ID      = process.env.NEXT_PUBLIC_GA_ID
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-3050601904412736'

export const metadata: Metadata = {
  title: {
    default: '둘레길고고 — 100대 명산 챌린지 도우미',
    template: '%s · 둘레길고고',
  },
  description: '한국 100대 명산 완등 챌린지를 위한 코스·둘레길 정보 사이트. 집에서 다음 산을 계획하세요.',
  keywords: ['100대 명산', '등산 코스', '둘레길', '완등 챌린지', '등산 난이도', '대중교통 등산'],
  authors: [{ name: '둘레길고고' }],
  metadataBase: new URL('https://dullegilgogo.kr'),
  openGraph: {
    siteName: '둘레길고고',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/og', width: 1200, height: 630, alt: '둘레길고고' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og'],
  },
  alternates: {
    canonical: 'https://dullegilgogo.kr',
  },
  verification: {
    google: 'F4MlP2TwGNrutz6uvY5BhPRqbdgAA5QXvuVhg0KbFg0',
    other: {
      'naver-site-verification': '43567d5a8e06ca7e10fa1d706c858b086a85ff4f',
    },
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${notoSerifKR.variable}`}>
      <head>
        <meta name="theme-color" content="#2F4A3C" />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}

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
