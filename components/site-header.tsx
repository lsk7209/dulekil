'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type NavKey = 'explore' | 'tracker' | 'blog' | 'guide'

interface SiteHeaderProps {
  active?: NavKey
}

const LOGO_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="M3 19l5-8 3 4 3-6 4 10z" />
  </svg>
)

const NAV_LINKS = [
  { label: '명산 허브',   href: '/#explore',  key: 'explore' as NavKey },
  { label: '완등 트래커', href: '/tracker',    key: 'tracker' as NavKey },
  { label: '블로그',      href: '/blog',       key: 'blog'    as NavKey },
  { label: '가이드',      href: '/#guide',     key: 'guide'   as NavKey, sm: true },
]

export function SiteHeader({ active }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{
        background: 'rgba(250,248,243,.86)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--line)',
        boxShadow: scrolled ? 'var(--sh-2)' : 'none',
        transition: 'box-shadow .2s ease',
      }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <Link href="/#top" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <span style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--forest)', display: 'grid', placeItems: 'center', color: '#fff' }}>
              {LOGO_ICON}
            </span>
            <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--forest)', letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>둘레길고고</span>
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                className={['navlink', l.sm ? 'hide-sm' : '', active === l.key ? 'navlink--on' : ''].filter(Boolean).join(' ')}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
