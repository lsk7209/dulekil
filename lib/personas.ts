/**
 * P3 — 페르소나 기반 동적 프롬프트
 * traveler: 감성·풍경 중심
 * hiker:    실용·안전 중심
 */
import type { Mountain, Course } from './db/schema'

export type PersonaKey = 'traveler' | 'hiker'

interface MountainContext {
  mountain: Pick<Mountain, 'name' | 'region' | 'elev'>
  courses: Pick<Course, 'name' | 'distance' | 'duration_up' | 'diff_norm' | 'transit'>[]
  highlights?: string[]
}

// 특이점 자동 추출
function extractHighlights(ctx: MountainContext): string[] {
  const hints: string[] = []
  if (ctx.mountain.elev && ctx.mountain.elev >= 1500) hints.push('고산(1500m+)')
  if (ctx.mountain.elev && ctx.mountain.elev <= 500)  hints.push('저산(500m 이하, 초보 접근성 좋음)')
  if (ctx.courses.some(c => c.transit))               hints.push('대중교통 접근 가능')
  if (ctx.courses.some(c => c.diff_norm === '하'))    hints.push('초보자 코스 있음')
  if (ctx.courses.some(c => c.diff_norm === '매우상')) hints.push('암릉/험준 구간 포함')
  const minDist = Math.min(...ctx.courses.map(c => c.distance ?? 999).filter(v => v < 999))
  if (minDist < 3) hints.push(`최단 코스 ${minDist.toFixed(1)}km`)
  return hints
}

export function buildPrompt(persona: PersonaKey, ctx: MountainContext): string {
  const { mountain, courses } = ctx
  const highlights = ctx.highlights ?? extractHighlights(ctx)
  const courseList = courses.slice(0, 3).map(c =>
    `  - ${c.name}: ${c.distance ?? '?'}km, 상행 ${c.duration_up ?? '?'}분, 난이도 ${c.diff_norm ?? '?'}`
  ).join('\n')

  if (persona === 'hiker') {
    return `당신은 한국 등산 전문 정보 작가입니다. 실용적이고 신뢰할 수 있는 정보를 제공합니다.
단정·과장 표현 금지. 의료적 효능 표현 금지. "쉽다/안전하다" 단정 금지.

[산 정보]
- 산 이름: ${mountain.name} (${mountain.region}, 해발 ${mountain.elev ?? '?'}m)
- 주요 코스:
${courseList}
- 특이점: ${highlights.join(', ') || '없음'}

위 정보를 바탕으로 ${mountain.name} 등산 정보 소개글을 200~300자로 작성하세요.
코스 데이터 기반 실용 정보 중심. 특이점이 있으면 반드시 언급.
출처가 공공데이터임을 인지하되 글 안에 명시 불필요.`
  }

  // traveler
  return `당신은 한국 여행·등산 매거진 감성 작가입니다. 풍경과 분위기를 생생하게 전달합니다.
과장 금지. 의료적 효능 표현 금지.

[산 정보]
- 산 이름: ${mountain.name} (${mountain.region}, 해발 ${mountain.elev ?? '?'}m)
- 주요 코스:
${courseList}
- 특이점: ${highlights.join(', ') || '없음'}

위 정보를 바탕으로 ${mountain.name}의 매력과 분위기를 담은 소개글을 200~300자로 작성하세요.
계절감·경관·감성 중심. 특이점이 있으면 자연스럽게 녹여 넣기.`
}
