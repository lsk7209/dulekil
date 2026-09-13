const PHONE_PATTERN = /(?:1\d{3}[\s.-]*\d{4}|0\d{1,2}[\s().-]*\d{3,4}[\s.-]*(?:\d{4}|[xX]{3,4})|0\d{1,2}[\s.-]*[xX]{3,4}(?:[\s.-]*[xX]{3,4})?)/g
const EMERGENCY_CONTEXT = /산악\s*구조|구조대|구급대|조난[^.]{0,30}(?:연락|신고|전화)|긴급\s*(?:연락|신고|전화)|구조\s*요청|대안\s*연락처|119\s*또는[^.]{0,60}(?:연락|신고|전화)/i
const PLACEHOLDER_PHONE = /[xX]{3,4}/

function safeEmergencyNotice(tag: string): string {
  const message = '<strong>긴급 연락처 안내:</strong> 응급 구조·구급은 119에 신고하고, 기관 일반 문의는 해당 기관 공식 사이트에서 최신 번호를 확인하세요.'
  if (tag.toLowerCase() === 'td') return `<td data-contact-redacted="true">${message}</td>`
  return `<${tag} class="safety" data-contact-redacted="true">${message}</${tag}>`
}

function textOnly(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim()
}

function normalizePhone(value: string): string {
  return value.replace(/\D/g, '')
}

export function findUnsafeEmergencyContacts(value: string): string[] {
  const text = textOnly(value)
  return [...text.matchAll(PHONE_PATTERN)].flatMap(match => {
    const phone = match[0]
    if (PLACEHOLDER_PHONE.test(phone)) return [phone]
    const normalized = normalizePhone(phone)
    if (normalized === '119') return []
    const start = Math.max(0, (match.index ?? 0) - 80)
    const end = Math.min(text.length, (match.index ?? 0) + phone.length + 80)
    const context = text.slice(start, end)
    if (normalized === '15889119' && /산불/.test(context)) return []
    return EMERGENCY_CONTEXT.test(context) ? [phone] : []
  })
}

export interface SanitizedArticleHtml {
  html: string
  redactedClaims: number
}

export function sanitizeUnreviewedArticleHtml(html: string): SanitizedArticleHtml {
  let redactedClaims = 0
  const rendered = html.replace(/<(p|li|td|div)(\s[^>]*)?>[\s\S]*?<\/\1>/gi, (block, tag: string) => {
    if (findUnsafeEmergencyContacts(block).length === 0) return block
    redactedClaims += 1
    return safeEmergencyNotice(tag)
  })
  return { html: rendered, redactedClaims }
}
