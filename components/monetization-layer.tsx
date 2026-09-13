'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import CoupangAffiliateBanner from '@/components/affiliate/CoupangAffiliateBanner'
import { isMonetizablePath } from '@/lib/monetization-policy'

export function MonetizationLayer({
  adsenseClientId,
  googleCmpReady = false,
}: {
  adsenseClientId?: string
  googleCmpReady?: boolean
}) {
  const pathname = usePathname() ?? '/'
  const [pageEligible, setPageEligible] = useState(false)

  useEffect(() => {
    const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? ''
    setPageEligible(isMonetizablePath(pathname) && !robots.toLowerCase().includes('noindex'))
  }, [pathname])

  if (!pageEligible) return null

  return (
    <>
      {googleCmpReady && adsenseClientId && (
        <Script
          id="adsense-loader"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsenseClientId)}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
      <CoupangAffiliateBanner pathname={pathname} />
    </>
  )
}
