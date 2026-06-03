/**
 * P3 — 품질 게이트 (발행 전 7개 기준 자동 검사)
 * draft → enriched → quality_passed → published
 */

export interface QualityInput {
  title:            string
  body:             string
  unique_points:    string[]    // 고유 데이터 포인트 (3개+)
  ai_commentary:    string      // AI 코멘터리 (200자+)
  faq:              { q: string; a: string }[]  // FAQ (3개+, 답변 50자+)
  active_sections:  string[]    // 활성 조건부 섹션 (1개+)
  has_comparison:   boolean     // 비교 데이터 포함
  has_safety_block: boolean     // 안전 고지 블록 존재
  existing_titles?: string[]    // 기존 글 제목 (유사도 검사용)
}

export interface GateResult {
  passed:     boolean
  score:      number            // 0~100
  failures:   string[]
  warnings:   string[]
}

function titleSimilarity(a: string, b: string): number {
  const setA = new Set(a.split(/[\s·,]+/).filter(s => s.length > 1))
  const setB = new Set(b.split(/[\s·,]+/).filter(s => s.length > 1))
  const intersection = [...setA].filter(t => setB.has(t)).length
  const union = new Set([...setA, ...setB]).size
  return union === 0 ? 0 : intersection / union
}

export function runQualityGate(input: QualityInput): GateResult {
  const failures: string[] = []
  const warnings: string[] = []
  let score = 0

  // 1. 고유 데이터 포인트 3개+
  if (input.unique_points.length >= 3) {
    score += 20
  } else {
    failures.push(`고유 데이터 포인트 ${input.unique_points.length}개 < 3개 필요`)
  }

  // 2. AI 코멘터리 200자+
  const bodyLen = input.ai_commentary.trim().length
  if (bodyLen >= 200) {
    score += 15
  } else {
    failures.push(`AI 코멘터리 ${bodyLen}자 < 200자 필요`)
  }

  // 3. 기존 글 제목 유사도 < 30%
  const maxSimilarity = Math.max(
    0,
    ...(input.existing_titles ?? []).map(t => titleSimilarity(input.title, t))
  )
  if (maxSimilarity < 0.3) {
    score += 15
  } else {
    failures.push(`제목 유사도 ${(maxSimilarity * 100).toFixed(0)}% ≥ 30% (중복 우려)`)
  }

  // 4. FAQ 3개+, 답변 50자+
  const validFaq = input.faq.filter(f => f.a.trim().length >= 50)
  if (input.faq.length >= 3 && validFaq.length >= 3) {
    score += 15
  } else if (input.faq.length < 3) {
    failures.push(`FAQ ${input.faq.length}개 < 3개 필요`)
  } else {
    const shortAnswers = input.faq.length - validFaq.length
    failures.push(`FAQ 답변 50자 미만: ${shortAnswers}개`)
  }

  // 5. 조건부 섹션 1개+ 활성화
  if (input.active_sections.length >= 1) {
    score += 15
  } else {
    failures.push('조건부 섹션 0개 — 계절·교통·조망 등 1개 이상 필요')
  }

  // 6. 비교 데이터 포함
  if (input.has_comparison) {
    score += 10
  } else {
    failures.push('비교 데이터 없음 (같은 산 코스 비교 또는 지역 평균 대비)')
  }

  // 7. 안전 고지 블록
  if (input.has_safety_block) {
    score += 10
  } else {
    failures.push('안전 고지 블록 없음 — 등산 도메인 필수')
  }

  return {
    passed:   failures.length === 0,
    score:    Math.round(score),
    failures,
    warnings,
  }
}
