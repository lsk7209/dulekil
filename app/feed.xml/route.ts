import { NextResponse } from 'next/server'
import { POSTS, CATS } from '@/lib/posts'

const BASE = 'https://dullegilgogo.kr'

export function GET() {
  const items = POSTS.slice(0, 20).map(p => {
    const cat = CATS[p.cat]
    return `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <description><![CDATA[${p.excerpt}]]></description>
      <link>${BASE}/blog/${p.id}</link>
      <guid isPermaLink="true">${BASE}/blog/${p.id}</guid>
      <pubDate>${new Date(p.date.replace(/\./g, '-')).toUTCString()}</pubDate>
      <category><![CDATA[${cat.label}]]></category>
    </item>`
  }).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>둘레길고고 매거진</title>
    <description>코스 추천부터 장비·안전·계절 가이드까지. 완등 챌린지에 필요한 판단을 데이터 위에서 정리한 글 모음.</description>
    <link>${BASE}/blog</link>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
