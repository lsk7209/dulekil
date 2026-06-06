import { enhanceArticleBody } from '../lib/article-enhancements'
import { POSTS, getPostPath } from '../lib/posts'

const now = new Date()
const publishedIds = new Set(POSTS.map(post => post.id))

type Finding = {
  id: string
  title: string
  path: string
  reason: string
}

const findings: Finding[] = []
const warnings: Finding[] = []
const headingCounts = new Map<string, number>()

function stripTags(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function getPath(id: string) {
  const post = POSTS.find(p => p.id === id)
  return post ? getPostPath(post) : ''
}

function addFinding(id: string, title: string, reason: string) {
  findings.push({ id, title, path: getPath(id), reason })
}

function addWarning(id: string, title: string, reason: string) {
  warnings.push({ id, title, path: getPath(id), reason })
}

for (const post of POSTS) {
  const body = enhanceArticleBody(post)
  const h2s = [...body.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(match => stripTags(match[1]))
  for (const h2 of h2s) headingCounts.set(h2, (headingCounts.get(h2) ?? 0) + 1)

  const internalLinks = body.match(/href="\//g)?.length ?? 0
  const externalLinks = body.match(/href="https?:\/\//g)?.length ?? 0
  const hasSource = body.includes('source-note')
  const hasCta = body.includes('article-cta') || /href="\/(blog|guide|list)\//.test(body)
  const structuredBlocks = [
    /<table/i.test(body),
    /<(ul|ol)>/i.test(body),
    /<details/i.test(body),
    /article-(summary|callout|decision|cta)/.test(body),
  ].filter(Boolean).length

  if ((post.body ?? '').length < 2500) addFinding(post.id, post.title, 'body under 2,500 chars')
  if (h2s.length < 3) addFinding(post.id, post.title, 'fewer than 3 H2 headings')
  if (internalLinks < 2) addFinding(post.id, post.title, 'fewer than 2 internal links')
  if (externalLinks < 1) addFinding(post.id, post.title, 'missing official external source link')
  if (!hasSource) addFinding(post.id, post.title, 'missing source-note block')
  if (!hasCta) addFinding(post.id, post.title, 'missing CTA')
  if (structuredBlocks < 2) addFinding(post.id, post.title, 'fewer than 2 structured blocks')

  for (const link of post.body?.matchAll(/href="\/blog\/([^"#?]+)"/g) ?? []) {
    const target = decodeURIComponent(link[1])
    if (/^p\d+$/.test(target) && !publishedIds.has(target)) {
      addWarning(post.id, post.title, `raw body links to unpublished internal post: ${target}`)
    }
  }
}

const repeatedHeadings = [...headingCounts]
  .filter(([, count]) => count > Math.max(10, Math.ceil(POSTS.length * 0.1)))
  .sort((a, b) => b[1] - a[1])

if (repeatedHeadings.length > 0) {
  for (const [heading, count] of repeatedHeadings.slice(0, 20)) {
    findings.push({ id: 'GLOBAL', title: heading, path: '', reason: `H2 repeated too often: ${count} times` })
  }
}

const scheduled = POSTS
  .filter(post => post.publishAt)
  .sort((a, b) => new Date(a.publishAt!).getTime() - new Date(b.publishAt!).getTime())

const report = {
  checkedAt: new Date().toISOString(),
  totalPosts: POSTS.length,
  visibleNow: POSTS.filter(post => !post.publishAt || new Date(post.publishAt) <= now).length,
  scheduled: scheduled.length,
  lastScheduled: scheduled.at(-1)
    ? { id: scheduled.at(-1)!.id, title: scheduled.at(-1)!.title, publishAt: scheduled.at(-1)!.publishAt }
    : null,
  findings: findings.slice(0, 100),
  findingCount: findings.length,
  warnings: warnings.slice(0, 100),
  warningCount: warnings.length,
}

console.log(JSON.stringify(report, null, 2))

if (findings.length > 0) {
  process.exitCode = 1
}
