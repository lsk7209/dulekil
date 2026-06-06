import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CATS, POSTS, getPostPath, type CatKey } from '@/lib/posts'

const BASE = 'https://dullegilgogo.kr'

interface Props { params: { cat: string } }

function isCatKey(value: string): value is CatKey {
  return value in CATS
}

export function generateStaticParams() {
  return Object.keys(CATS).map(cat => ({ cat }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = decodeURIComponent(params.cat)
  if (!isCatKey(cat)) return {}
  const label = CATS[cat].label
  return {
    title: `${label} 등산 글 모음 | 둘레길고고`,
    description: `${label} 주제의 100대 명산 코스, 준비, 안전 정보를 한곳에서 확인하세요.`,
    alternates: { canonical: `${BASE}/blog/category/${encodeURIComponent(cat)}` },
    openGraph: {
      title: `${label} 등산 글 모음`,
      description: `${label} 관련 등산 가이드 모음`,
      type: 'website',
      url: `${BASE}/blog/category/${encodeURIComponent(cat)}`,
      images: [{ url: `/og?title=${encodeURIComponent(label + ' 등산 글 모음')}&type=default&sub=둘레길고고+매거진`, width: 1200, height: 630, alt: `${label} 등산 글` }],
    },
  }
}

export default function BlogCategoryPage({ params }: Props) {
  const cat = decodeURIComponent(params.cat)
  if (!isCatKey(cat)) notFound()

  const now = new Date()
  const meta = CATS[cat]
  const posts = POSTS.filter(post => post.cat === cat && (!post.publishAt || new Date(post.publishAt) <= now))
  if (posts.length === 0) notFound()

  const pageUrl = `${BASE}/blog/category/${encodeURIComponent(cat)}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: `${meta.label} 등산 글 모음`,
        description: `${meta.label} 관련 100대 명산 등산 가이드 모음`,
        url: pageUrl,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: posts.length,
          itemListElement: posts.slice(0, 20).map((post, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: post.title,
            url: `${BASE}${getPostPath(post)}`,
            description: post.excerpt,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: BASE },
          { '@type': 'ListItem', position: 2, name: '블로그', item: `${BASE}/blog` },
          { '@type': 'ListItem', position: 3, name: meta.label, item: pageUrl },
        ],
      },
    ],
  }

  return (
    <div id="top">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader active="blog" />
      <main id="main-content">
        <section className="wrap" style={{ paddingTop: 36, paddingBottom: 12 }}>
          <nav style={{ display: 'flex', gap: 6, fontSize: 13, color: 'var(--ink-faint)', marginBottom: 18 }}>
            <Link href="/">홈</Link>
            <span>/</span>
            <Link href="/blog">블로그</Link>
          </nav>
          <div className="eyebrow" style={{ marginBottom: 10 }}>카테고리</div>
          <h1 className="h1" style={{ marginBottom: 12 }}>{meta.label} 글</h1>
          <p className="lead">{meta.label} 주제의 등산 가이드와 코스 정보를 모았습니다.</p>
          <span className="cap" style={{ display: 'inline-block', marginTop: 10 }}>{posts.length}편</span>
        </section>

        <section className="wrap" style={{ paddingTop: 24, paddingBottom: 48 }}>
          <div className="post-grid">
            {posts.map(post => (
              <Link key={post.id} href={getPostPath(post)} className="card card--hover card--pad" style={{ textDecoration: 'none' }}>
                <span className="tag" style={{ marginBottom: 10 }}>{meta.label}</span>
                <h2 className="h3" style={{ fontSize: 18, marginBottom: 8 }}>{post.title}</h2>
                <p className="body" style={{ fontSize: 14, marginBottom: 10 }}>{post.excerpt}</p>
                <span className="cap tnum">{post.date}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
