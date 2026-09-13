import type { Post } from './posts'

export const CONTENT_RISK_CATEGORIES = [
  'MEDICAL_TREATMENT',
  'EMERGENCY_RESCUE',
  'LEGAL_REGULATORY',
  'PRICE_FEE',
  'RESERVATION_TRANSPORT',
  'VOLATILE_OPERATIONAL',
  'ROUTE_SAFETY_NUMERIC',
] as const

export type ContentRiskCategory = (typeof CONTENT_RISK_CATEGORIES)[number]

type Rule = {
  category: ContentRiskCategory
  score: number
  pattern: RegExp
}

const RULES: Rule[] = [
  { category: 'MEDICAL_TREATMENT', score: 18, pattern: /(?:복용|투여|처방|진단|치료|응급처치|해열제|진통제|소염제|아스피린|이부프로펜|아세트아미노펜|항히스타민|인슐린|혈당|저혈당|저나트륨혈증|열사병|열탈진|동상|저체온증|횡문근융해증|심근경색|뇌졸중)/i },
  { category: 'MEDICAL_TREATMENT', score: 13, pattern: /(?:상처|골절|염좌|출혈|통증|두통|구토|설사|발열|체온|맥박|혈압|알레르기|벌독|뱀물림|진드기|근육통|경련)/i },
  { category: 'MEDICAL_TREATMENT', score: 12, pattern: /(?:\d+(?:\.\d+)?\s*(?:mg|g|ml|mL|리터|분|시간|일|주))[^<\n]{0,50}(?:복용|섭취|마신|냉각|찜질|회복|치료)/i },
  { category: 'EMERGENCY_RESCUE', score: 17, pattern: /(?:119|구조대|산악구조|응급실|후송|이송|구조 요청|조난|실종|심폐소생술|CPR|자동심장충격기|AED)/i },
  { category: 'EMERGENCY_RESCUE', score: 11, pattern: /(?:즉시|바로|기다린|경과를 본|\d+\s*분)[^<\n]{0,45}(?:신고|119|구조|병원|응급실)/i },
  { category: 'LEGAL_REGULATORY', score: 13, pattern: /(?:과태료|벌금|불법|법적|금지|허가|신고 의무|산림보호법|자연공원법|입산금지|출입금지)/i },
  { category: 'PRICE_FEE', score: 9, pattern: /(?:주차비|입장료|이용료|요금|비용|무료|유료|원\/|\d{1,3}(?:,\d{3})+\s*원|\d+\s*만원)/i },
  { category: 'RESERVATION_TRANSPORT', score: 8, pattern: /(?:예약|사전 신청|탐방예약|막차|첫차|배차|운행시간|운휴|셔틀|버스 시간표|주차장 운영)/i },
  { category: 'VOLATILE_OPERATIONAL', score: 8, pattern: /(?:통제|폐쇄|개방|운영시간|휴무|공사|우회|기상특보|산불조심기간|입산 가능|탐방 가능)/i },
  { category: 'ROUTE_SAFETY_NUMERIC', score: 6, pattern: /(?:왕복|편도|정상|들머리|하산|일몰|고도|경사|난이도)[^<\n]{0,45}\d+(?:\.\d+)?\s*(?:km|m|분|시간|%|도)/i },
  { category: 'ROUTE_SAFETY_NUMERIC', score: 5, pattern: /\d+(?:\.\d+)?\s*(?:km|분|시간|%|도)[^<\n]{0,45}(?:초보|어린이|가족|안전|위험|하산|도착)/i },
]

const OFFICIAL_SOURCE_PATTERN = /https?:\/\/[^"'\s<]*(?:\.go\.kr|knps\.or\.kr|kdca\.go\.kr|kma\.go\.kr|nfa\.go\.kr|law\.go\.kr|cdc\.gov|nih\.gov|medlineplus\.gov|who\.int)[^"'\s<]*/gi

function plainText(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function excerptAround(text: string, pattern: RegExp): string {
  const flags = pattern.flags.replace('g', '')
  const match = new RegExp(pattern.source, flags).exec(text)
  if (!match || match.index === undefined) return ''
  const start = Math.max(0, match.index - 45)
  const end = Math.min(text.length, match.index + match[0].length + 75)
  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`
}

export type ContentRiskRanking = {
  id: string
  url: string
  title: string
  risk_score: number
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  categories: string
  matched_rule_count: number
  evidence_excerpt: string
  official_source_link_count: number
  review_status: 'UNREVIEWED'
  source_verified: false
}

export function rankContentRisk(posts: Post[], getPath: (post: Post) => string): ContentRiskRanking[] {
  return posts.map(post => {
    const text = plainText(`${post.title} ${post.excerpt} ${post.body ?? ''}`)
    const matches = RULES.filter(rule => rule.pattern.test(text))
    const categories = [...new Set(matches.map(match => match.category))]
    const riskScore = matches.reduce((sum, match) => sum + match.score, 0)
    const sourceLinks = (`${post.body ?? ''}`.match(OFFICIAL_SOURCE_PATTERN) ?? []).length
    const riskLevel: ContentRiskRanking['risk_level'] = riskScore >= 55 ? 'CRITICAL' : riskScore >= 35 ? 'HIGH' : riskScore >= 15 ? 'MEDIUM' : 'LOW'
    return {
      id: post.id,
      url: getPath(post),
      title: post.title,
      risk_score: riskScore,
      risk_level: riskLevel,
      categories: categories.join('|') || 'NONE',
      matched_rule_count: matches.length,
      evidence_excerpt: matches.map(match => excerptAround(text, match.pattern)).find(Boolean) ?? '',
      official_source_link_count: sourceLinks,
      review_status: 'UNREVIEWED' as const,
      source_verified: false as const,
    }
  }).sort((left, right) => right.risk_score - left.risk_score || left.id.localeCompare(right.id, 'en', { numeric: true }))
}
