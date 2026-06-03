'use client'

import { useEffect, useRef } from 'react'

interface AdSlotProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
  style?: React.CSSProperties
  label?: string
}

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

export function AdSlot({ slot, format = 'auto', className = 'ad', label, style }: AdSlotProps) {
  const ref = useRef<HTMLModElement>(null)

  useEffect(() => {
    if (!CLIENT_ID) return
    try {
      // @ts-expect-error -- AdSense global
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch { /* */ }
  }, [])

  // 개발/AdSense 미승인: 플레이스홀더
  if (!CLIENT_ID) {
    return (
      <div className={className} style={style}>
        <span className="ad__label">{label ?? `광고 슬롯 ${slot}`}</span>
      </div>
    )
  }

  return (
    <ins
      ref={ref}
      className="adsbygoogle"
      style={{ display: 'block', ...style }}
      data-ad-client={CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}
