export const CATS = {
  '코스추천': { label: '코스 추천', c: '#2F4A3C', bg: '#E7EEE6' },
  '가이드':   { label: '가이드',   c: '#5E7E63', bg: '#E7EEE6' },
  '안전':     { label: '안전',     c: '#A85C29', bg: '#F4E2D2' },
  '계절':     { label: '계절',     c: '#9A7A1E', bg: '#F5ECD2' },
  '장비':     { label: '장비',     c: '#6B4226', bg: '#EBDFD4' },
  '후기':     { label: '후기',     c: '#4E6B62', bg: '#E3ECE7' },
} as const

export type CatKey = keyof typeof CATS

export interface Post {
  id: string
  cat: CatKey
  pal: string
  title: string
  excerpt: string
  read: number
  date: string
  featured?: boolean
  badges: string[]
}

export const POSTS: Post[] = [
  {
    id: 'p1', cat: '코스추천', pal: 'forest',
    title: '지하철로 가는 수도권 명산 7곳',
    excerpt: '차 없이도 닿는 들머리만 골랐습니다. 역에서 도보 15분 안쪽, 하산 후 교통까지 정리한 당일 산행 지도.',
    read: 8, date: '2026.06.01', featured: true,
    badges: ['대중교통', '당일치기'],
  },
  {
    id: 'p2', cat: '코스추천', pal: 'sage',
    title: '초보가 처음 오르기 좋은 100대 명산 10',
    excerpt: '표고차·거리·노면을 기준으로 부담 적은 코스만. 첫 완등 도장을 어디서 찍을지 고민이라면.',
    read: 7, date: '2026.05.28',
    badges: ['초보', '난이도 하'],
  },
  {
    id: 'p3', cat: '장비', pal: 'winter',
    title: '겨울 눈꽃 산행, 아이젠·스패츠 고르는 법',
    excerpt: '체인젠과 4발·6발의 차이부터 발목 스패츠 길이까지. 설악·덕유 설경을 안전하게 보는 준비물.',
    read: 6, date: '2026.05.22',
    badges: ['겨울', '체크리스트'],
  },
  {
    id: 'p4', cat: '코스추천', pal: 'autumn',
    title: '당일치기 지리산, 가장 쉬운 코스는?',
    excerpt: '천왕봉을 하루에. 중산리·백무동·성삼재 들머리별 소요시간과 막차 시간을 비교했습니다.',
    read: 9, date: '2026.05.18',
    badges: ['지리산', '당일치기'],
  },
  {
    id: 'p5', cat: '안전', pal: 'dawn',
    title: '산행 전 반드시 확인하는 통제·기상 정보 5곳',
    excerpt: '국립공원 탐방로 통제, 기상청 산악날씨, 일출·일몰 시각. 출발 전 5분이면 끝나는 안전 루틴.',
    read: 5, date: '2026.05.14',
    badges: ['안전', '필수'],
  },
  {
    id: 'p6', cat: '계절', pal: 'valley',
    title: '6월에 걷기 좋은 시원한 계곡 산행',
    excerpt: '숲그늘과 물소리로 더위를 식히는 코스. 초여름 들머리부터 알탕 포인트까지.',
    read: 6, date: '2026.06.02',
    badges: ['여름', '계곡'],
  },
  {
    id: 'p7', cat: '코스추천', pal: 'forest',
    title: '북한산 백운대 vs 도봉산 자운봉, 뭐가 더 힘들까',
    excerpt: '같은 서울 북쪽 두 암봉을 거리·경사·암릉 구간으로 정면 비교. 오늘 컨디션에 맞는 선택.',
    read: 7, date: '2026.05.09',
    badges: ['비교', '수도권'],
  },
  {
    id: 'p8', cat: '장비', pal: 'sage',
    title: '배낭 무게 줄이는 패킹 체크리스트',
    excerpt: '당일 산행 기준 꼭 필요한 것과 빼도 되는 것. 어깨가 편해지는 짐 싸기의 순서.',
    read: 5, date: '2026.05.05',
    badges: ['장비', '초보'],
  },
  {
    id: 'p9', cat: '계절', pal: 'autumn',
    title: '단풍 절정 시기로 고른 가을 명산 지도',
    excerpt: '위도와 고도로 추정한 단풍 시작일. 내장산·설악·오대산을 언제 가야 절정을 볼까.',
    read: 8, date: '2026.04.30',
    badges: ['가을', '단풍'],
  },
]
