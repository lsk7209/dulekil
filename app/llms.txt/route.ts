import { NextResponse } from 'next/server'

const CONTENT = `# 둘레길 — 한국 100대 명산 챌린지 도우미

> 이 파일은 AI 언어모델이 사이트 구조를 이해할 수 있도록 제공됩니다.

## 사이트 소개

둘레길은 산림청이 선정한 한국 100대 명산 완등 챌린지에 도전하는 등산객을 위한 정보 사이트입니다.
"집에서 다음에 어느 산을 갈지 계획하는 단계"를 도웁니다.

- URL: https://dulekil.com
- 주제: 한국 등산, 100대 명산, 코스 비교, 완등 트래커
- 언어: 한국어
- 광고 수익 모델 (애드센스)

## 주요 페이지

- / : 홈 — 검색, 필터, 완등 트래커 미리보기
- /mountains : 100대 명산 허브 (지역·난이도·계절 필터)
- /mountains/[지역]/[산이름] : 산 상세 페이지 (코스 비교, FAQ, 안전고지)
- /tracker : 완등 트래커 (localStorage, 로그인 불필요)
- /blog : 매거진 — 코스 추천, 장비, 안전, 계절 가이드
- /blog/[id] : 블로그 상세 글
- /data-license : 공공데이터 출처·라이선스

## 데이터 출처

모든 코스·등산로 정보는 공공데이터(data.go.kr, 산림청, 한국관광공사)를 가공해 제공합니다.
일부 설명은 AI(Gemini)가 보조 작성한 데이터 가공물입니다.
출처: data.go.kr · 산림청 · 한국관광공사 (공공누리 제1유형)

## 안전 고지

본 사이트의 코스 정보는 참고용입니다. 실제 산행 전 산림청·국립공원 공식 통제정보를 반드시 확인하세요.
`

export function GET() {
  return new NextResponse(CONTENT, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
