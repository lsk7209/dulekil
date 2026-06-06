import type { Post } from './posts'

const CAT_COPY: Record<Post['cat'], {
  label: string
  summary: string
  check: string
  cta: string
  primaryHref: string
  primaryLabel: string
  secondaryHref: string
  secondaryLabel: string
}> = {
  '코스추천': {
    label: '코스 선택',
    summary: '거리, 하산 시간, 교통 복귀를 함께 보면 실패 확률이 줄어듭니다.',
    check: '들머리와 날머리를 따로 계산하고, 일몰 2시간 전 하산 가능 여부를 먼저 보세요.',
    cta: '비슷한 난이도의 코스를 함께 비교하면 오늘 갈 산을 더 빨리 좁힐 수 있습니다.',
    primaryHref: '/blog',
    primaryLabel: '관련 코스 더 보기',
    secondaryHref: '/list/beginner',
    secondaryLabel: '초보 명산 목록',
  },
  '가이드': {
    label: '실행 가이드',
    summary: '개념보다 실제 순서가 중요합니다. 준비, 확인, 실행 기준을 나눠 읽으세요.',
    check: '처음이라면 장비를 늘리기보다 코스 난이도와 복귀 시간을 먼저 낮추는 편이 안전합니다.',
    cta: '입문 글을 함께 열어두면 다음 산행 계획까지 이어가기 쉽습니다.',
    primaryHref: '/guide/beginner-100',
    primaryLabel: '입문 가이드 보기',
    secondaryHref: '/blog',
    secondaryLabel: '블로그 전체 보기',
  },
  '안전': {
    label: '안전 판단',
    summary: '안전 글은 아는 것보다 멈추는 기준을 정하는 데 목적이 있습니다.',
    check: '기상, 통제, 동행자 컨디션 중 하나라도 흔들리면 코스를 줄이는 판단이 우선입니다.',
    cta: '출발 전 확인 글과 함께 보면 현장에서 놓치는 위험 신호를 줄일 수 있습니다.',
    primaryHref: '/blog',
    primaryLabel: '안전 글 더 보기',
    secondaryHref: '/guide/safety-checklist',
    secondaryLabel: '초보 가이드',
  },
  '계절': {
    label: '계절 포인트',
    summary: '계절 산행은 절정 시기보다 당일 날씨와 혼잡 회피가 더 큰 변수입니다.',
    check: '꽃, 단풍, 눈꽃은 전날 사진보다 탐방로 통제와 바람 예보를 우선 확인하세요.',
    cta: '같은 계절의 다른 코스를 비교하면 일정 대체안을 만들기 좋습니다.',
    primaryHref: '/blog',
    primaryLabel: '계절 글 더 보기',
    secondaryHref: '/list/autumn',
    secondaryLabel: '명산 목록 보기',
  },
  '장비': {
    label: '장비 판단',
    summary: '장비는 비싼 제품보다 산행 시간, 노면, 계절에 맞는지가 핵심입니다.',
    check: '새 장비는 긴 산행에서 바로 쓰지 말고, 짧은 코스에서 착용감과 마찰을 먼저 확인하세요.',
    cta: '장비 글을 함께 비교하면 과소 준비와 과소비를 동시에 줄일 수 있습니다.',
    primaryHref: '/blog',
    primaryLabel: '장비 글 더 보기',
    secondaryHref: '/guide/gear-basics',
    secondaryLabel: '준비 가이드',
  },
  '후기': {
    label: '후기 활용',
    summary: '후기는 감상보다 다음 산행에서 반복할 점과 줄일 점을 찾는 자료입니다.',
    check: '사진이 좋은 지점보다 실제 체력 소모, 대기 시간, 하산 피로도를 중심으로 읽으세요.',
    cta: '다른 후기와 코스 글을 함께 보면 본인 일정에 맞는 선택이 쉬워집니다.',
    primaryHref: '/blog',
    primaryLabel: '후기 더 보기',
    secondaryHref: '/list/transit-accessible',
    secondaryLabel: '대중교통 명산',
  },
}

function stripTags(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function hashId(id: string) {
  return [...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
}

function hasBatchim(text: string) {
  const ch = text.trim().at(-1)
  if (!ch) return false
  const code = ch.charCodeAt(0)
  if (code < 0xac00 || code > 0xd7a3) return false
  return (code - 0xac00) % 28 !== 0
}

function eun(text: string) {
  return hasBatchim(text) ? '은' : '는'
}

function polishCommonParticles(html: string) {
  return html
    .replace(/피로을/g, '피로를')
    .replace(/거리이/g, '거리가')
    .replace(/열차이/g, '열차가')
    .replace(/시간이을/g, '시간을')
}

function insertAfterParagraph(html: string, block: string, index: number) {
  let count = 0
  return html.replace(/<\/p>/gi, match => {
    count += 1
    return count === index ? `${match}${block}` : match
  })
}

function wrapTables(html: string) {
  return html.replace(/<table(?![^>]*data-enhanced)([\s\S]*?)<\/table>/gi, table => (
    `<div class="article-table-scroll">${table.replace('<table', '<table data-enhanced="true"')}</div>`
  ))
}

function buildSummary(post: Post, variant: number) {
  const copy = CAT_COPY[post.cat]
  const badges = post.badges.slice(0, 3).map(escapeHtml).join(' · ') || escapeHtml(post.cat)
  const title = escapeHtml(post.title)
  const excerpt = escapeHtml(post.excerpt)
  const labels = ['빠른 판단', '먼저 볼 기준', `${copy.label} 요약`]
  const lead = [
    `${title}를 읽을 때는 ${badges} 관점에서 먼저 판단하면 좋습니다.`,
    `${badges}를 기준으로 보면 ${title}의 선택지가 더 명확해집니다.`,
    `${title}${eun(post.title)} ${copy.label} 관점에서 읽을 때 실제 산행 계획으로 연결됩니다.`,
  ][variant]

  return `<aside class="article-summary article-summary--v${variant + 1}">
<strong>${labels[variant]}</strong>
<p>${lead} ${excerpt}</p>
<ul><li>${copy.summary}</li><li>${copy.check}</li></ul>
</aside>`
}

function buildCallout(post: Post, variant: number) {
  const copy = CAT_COPY[post.cat]
  const variants = ['forest', 'clay', 'sky']
  const label = ['현장 기준', '주의할 점', '선택 힌트'][variant]
  return `<aside class="article-callout article-callout--${variants[variant]}">
<strong>${label}: ${escapeHtml(copy.label)}</strong>
<p>${escapeHtml(copy.check)}</p>
</aside>`
}

function buildDecision(post: Post, body: string, variant: number) {
  const h2s = [...body.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)]
    .map(match => stripTags(match[1]))
    .filter(Boolean)
    .slice(0, 3)
  const points = h2s.length >= 3 ? h2s : [
    `${post.cat} 핵심 기준`,
    `${post.badges[0] ?? '산행'} 확인`,
    '출발 전 최종 점검',
  ]

  const heading = ['읽는 순서', '판단 체크', '계획 전환 기준'][variant]
  return `<div class="article-decision">
<strong>${heading}</strong>
<ol>
${points.map((point, i) => `<li><span>${i + 1}</span>${escapeHtml(point)}</li>`).join('')}
</ol>
</div>`
}

function buildCta(post: Post, variant: number) {
  const copy = CAT_COPY[post.cat]
  const labels = ['다음 단계', '함께 보면 좋은 글', '산행 전 확인']
  const description = [
    copy.cta,
    `${post.badges.slice(0, 2).join(' · ') || post.cat} 기준으로 다른 글까지 비교해보세요.`,
    '출발 전에는 코스, 날씨, 통제 정보를 한 번 더 확인하는 편이 안전합니다.',
  ][variant]

  return `<aside class="article-cta">
<div><strong>${labels[variant]}</strong><p>${escapeHtml(description)}</p></div>
<p><a href="${copy.primaryHref}">${escapeHtml(copy.primaryLabel)}</a><a href="${copy.secondaryHref}">${escapeHtml(copy.secondaryLabel)}</a></p>
</aside>`
}

export function enhanceArticleBody(post: Post) {
  let body = polishCommonParticles(post.body ?? post.excerpt)
  const variant = hashId(post.id) % 3

  body = wrapTables(body)

  if (!body.includes('article-summary')) {
    body = `${buildSummary(post, variant)}${body}`
  }

  if (!body.includes('article-callout')) {
    body = insertAfterParagraph(body, buildCallout(post, variant), 2)
  }

  if (!body.includes('article-decision')) {
    body = insertAfterParagraph(body, buildDecision(post, body, variant), 4)
  }

  if (!body.includes('article-cta')) {
    const sourceIndex = body.search(/<(p|div)[^>]*class="[^"]*source-note/i)
    const cta = buildCta(post, variant)
    body = sourceIndex >= 0 ? `${body.slice(0, sourceIndex)}${cta}${body.slice(sourceIndex)}` : `${body}${cta}`
  }

  return body
}
