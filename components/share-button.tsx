'use client'

import { useState } from 'react'

export function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select text
    }
  }

  const shareKakao = () => {
    const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(url)}`
    window.open(kakaoUrl, '_blank', 'width=600,height=400')
  }

  const shareX = () => {
    const text = encodeURIComponent(`${title} — 둘레길고고`)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank')
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-faint)' }}>공유</span>
      <button
        onClick={shareX}
        style={{ padding: '7px 14px', borderRadius: 'var(--r-pill)', border: '1.5px solid var(--line)', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--ink-soft)' }}
        aria-label="X(트위터)에 공유"
      >
        𝕏 트위터
      </button>
      <button
        onClick={shareKakao}
        style={{ padding: '7px 14px', borderRadius: 'var(--r-pill)', border: '1.5px solid var(--line)', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--ink-soft)' }}
        aria-label="카카오스토리에 공유"
      >
        카카오
      </button>
      <button
        onClick={copyLink}
        style={{ padding: '7px 14px', borderRadius: 'var(--r-pill)', border: '1.5px solid var(--line)', background: copied ? 'var(--forest)' : '#fff', color: copied ? '#fff' : 'var(--ink-soft)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .2s' }}
        aria-label="링크 복사"
      >
        {copied ? '✓ 복사됨' : '링크 복사'}
      </button>
    </div>
  )
}
