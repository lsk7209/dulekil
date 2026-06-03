import React from 'react'

interface IconProps {
  name: string
  size?: number
  stroke?: number
}

const PATHS: Record<string, React.ReactNode> = {
  search:  <><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></>,
  pin:     <><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="9" r="2.4"/></>,
  clock:   <><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></>,
  up:      <><path d="M12 19V5"/><path d="M6 11l6-6 6 6"/></>,
  check:   <path d="M4 12.5l5 5 11-11"/>,
  bus:     <><rect x="4" y="4" width="16" height="12" rx="2"/><path d="M4 11h16"/><circle cx="8" cy="19" r="1.4"/><circle cx="16" cy="19" r="1.4"/></>,
  route:   <><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="6" r="2.2"/><path d="M8 16.5c4-1 6-3 8-8"/></>,
  snow:    <><path d="M12 3v18"/><path d="M4.5 7.5l15 9"/><path d="M19.5 7.5l-15 9"/></>,
  sun:     <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></>,
  leaf:    <><path d="M4 20c10 2 16-4 16-16C8 4 2 10 4 20Z"/><path d="M4 20c4-6 8-9 13-11"/></>,
  flower:  <><circle cx="12" cy="12" r="2.5"/><path d="M12 9.5C12 6 13 4 12 4s0 2 0 5.5ZM12 14.5C12 18 11 20 12 20s0-2 0-5.5ZM9.5 12C6 12 4 11 4 12s2 0 5.5 0ZM14.5 12C18 12 20 13 20 12s-2 0-5.5 0Z"/></>,
  warn:    <><path d="M12 3l9 17H3z"/><path d="M12 10v4"/><circle cx="12" cy="17" r=".5" fill="currentColor"/></>,
  chevron: <path d="M9 6l6 6-6 6"/>,
  map:     <><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/></>,
  book:    <><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Z"/><path d="M4 19a2 2 0 0 1 2-2h12"/></>,
  target:  <><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".6" fill="currentColor"/></>,
  pen:     <><path d="M4 20h4L19 9a2 2 0 0 0-3-3L5 17v3Z"/><path d="M14 7l3 3"/></>,
  arrow:   <><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></>,
}

export function Icon({ name, size = 18, stroke = 2 }: IconProps) {
  const p = PATHS[name]
  if (!p) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', flex: 'none' }}
    >
      {p}
    </svg>
  )
}
