import type { Course, Mountain } from './db/schema'

export type MountainDifficulty = '하' | '중' | '상' | '매우상'

export function normalizeDifficulty(raw: string | null | undefined): MountainDifficulty {
  if (raw === '하' || raw === '쉬움' || raw === '1') return '하'
  if (raw === '상' || raw === '어려움' || raw === '3') return '상'
  if (raw === '매우상' || raw === '4') return '매우상'
  return '중'
}

export function formatDuration(min: number | null | undefined) {
  if (!min || min <= 0) return '정보 없음'
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h <= 0) return `${m}분`
  return m === 0 ? `${h}시간` : `${h}시간 ${m}분`
}

export function formatDistance(km: number | null | undefined) {
  return km && km > 0 ? `${km.toFixed(1)}km` : '정보 없음'
}

function shortName(course: Course) {
  return course.name?.replace(/\s+/g, ' ').trim() || '대표 코스'
}

export function getCourseStats(courses: Course[]) {
  const sortedByDistance = [...courses]
    .filter(course => course.distance != null && course.distance > 0)
    .sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999))
  const shortest = sortedByDistance[0]
  const longest = sortedByDistance.at(-1)
  const transitCourses = courses.filter(course => course.transit)
  const riskCourses = courses.filter(course => course.risk_note)
  const hardest = [...courses].sort((a, b) => {
    const order: Record<MountainDifficulty, number> = { '하': 1, '중': 2, '상': 3, '매우상': 4 }
    return order[normalizeDifficulty(b.diff_norm)] - order[normalizeDifficulty(a.diff_norm)]
  })[0]

  return {
    shortest,
    longest,
    transitCourses,
    riskCourses,
    hardest,
    hasTransit: transitCourses.length > 0,
    hasGpx: courses.some(course => course.gpx_available),
    minDistance: shortest?.distance ?? null,
    maxDuration: Math.max(0, ...courses.map(course => course.duration_up ?? 0)),
  }
}

export function buildMountainSummary(mountain: Mountain, courses: Course[]) {
  const stats = getCourseStats(courses)
  const diff = normalizeDifficulty(stats.shortest?.diff_norm ?? stats.hardest?.diff_norm)
  const region = [mountain.region, mountain.sigun].filter(Boolean).join(' ')
  const elevation = mountain.elev ? `${mountain.elev.toLocaleString()}m` : '고도 정보 미확인'

  return [
    `${mountain.name}은 ${region || '국내'}에 있는 해발 ${elevation} 산입니다.`,
    courses.length > 0
      ? `현재 비교 가능한 등산로는 ${courses.length}개이며, 최단 코스는 ${formatDistance(stats.minDistance)} 기준입니다.`
      : '현재 코스 데이터가 충분하지 않아 공식 안내와 현장 표지 확인이 필요합니다.',
    diff === '하'
      ? '처음 방문한다면 최단 코스와 하산 교통을 먼저 확인하는 방식이 안정적입니다.'
      : diff === '중'
        ? '초보자는 거리보다 누적 피로와 하산 시간을 보수적으로 잡는 편이 좋습니다.'
        : '암릉, 급경사, 긴 하산이 겹칠 수 있으므로 경험자 동행과 기상 확인을 전제로 잡으세요.',
  ]
}

export function buildMountainFitNotes(mountain: Mountain, courses: Course[]) {
  const stats = getCourseStats(courses)
  const shortest = stats.shortest
  const hardest = stats.hardest

  return [
    {
      title: '초보·가족 산행',
      body: shortest
        ? `${shortName(shortest)}처럼 ${formatDistance(shortest.distance)} 안팎의 짧은 코스부터 보세요. 난이도는 ${normalizeDifficulty(shortest.diff_norm)} 기준이며, 실제 체감은 계단과 하산 경사에 따라 달라집니다.`
        : `${mountain.name}은 현재 최단 코스 수치가 부족합니다. 초보자는 공식 안내소나 지자체 탐방 안내에서 짧은 원점회귀 코스를 먼저 확인하세요.`,
    },
    {
      title: '당일치기 완등',
      body: stats.maxDuration > 0
        ? `상행 기준 최대 ${formatDuration(stats.maxDuration)}까지 잡히는 코스가 있으므로 휴식, 식사, 하산 교통을 포함해 일정을 계산해야 합니다.`
        : '소요시간 데이터가 부족합니다. 당일치기는 오전 출발, 중간 반환 기준, 일몰 전 하산을 기본값으로 두세요.',
    },
    {
      title: '경험자 코스',
      body: hardest
        ? `${shortName(hardest)} 코스는 난이도 ${normalizeDifficulty(hardest.diff_norm)}로 분류됩니다. 거리보다 위험 구간, 날씨, 하산 집중력 저하를 먼저 보세요.`
        : '장거리나 능선 종주를 계획한다면 GPX, 탈출로, 통신 음영 구간을 별도로 확인해야 합니다.',
    },
  ]
}

export function buildAccessNotes(mountain: Mountain, courses: Course[]) {
  const stats = getCourseStats(courses)
  const trailheads = courses
    .map(course => course.trailhead?.trim())
    .filter((value): value is string => Boolean(value))
    .slice(0, 3)

  return {
    title: `${mountain.name} 교통·주차·들머리 확인`,
    body: stats.hasTransit
      ? '대중교통 접근 표시가 있는 코스가 있습니다. 다만 산행지는 배차 간격과 막차 시간이 계절·요일별로 달라지므로 출발 전 최신 시간표를 확인하세요.'
      : '대중교통 접근 정보가 부족하거나 제한적입니다. 자가용, 택시, 산악회 버스, 하산 후 이동 수단을 함께 계산하세요.',
    trailheads,
  }
}

export function buildSeasonNotes(mountain: Mountain) {
  const high = (mountain.elev ?? 0) >= 1200
  return [
    {
      season: '봄',
      body: high
        ? '고도가 높으면 3~4월에도 잔설과 결빙이 남을 수 있습니다. 봄꽃보다 노면 상태를 먼저 확인하세요.'
        : '일교차와 미세먼지, 낙엽 아래 미끄러운 흙길을 확인하세요.',
    },
    {
      season: '여름',
      body: '폭염에는 낮은 고도 구간의 체감온도가 크게 오릅니다. 물, 전해질, 그늘 휴식 지점을 먼저 계획하세요.',
    },
    {
      season: '가을',
      body: '단풍철은 주차장보다 하산 동선과 혼잡 시간을 먼저 봐야 합니다. 평일 이른 출발이 가장 안정적입니다.',
    },
    {
      season: '겨울',
      body: high
        ? '능선 바람과 결빙 가능성이 큽니다. 아이젠, 방풍층, 헤드랜턴을 기본 장비로 잡으세요.'
        : '낮은 산도 그늘진 하산로는 얼 수 있습니다. 짧은 코스라도 미끄럼 대비가 필요합니다.',
    },
  ]
}

export function buildSafetyChecks(courses: Course[]) {
  const checks = [
    '기상청 날씨와 일몰 시간을 확인하고, 하산 완료 시간을 먼저 정합니다.',
    '국립공원·지자체·산림청 통제 공지가 있으면 코스보다 통제 정보를 우선합니다.',
    '물, 보온층, 보조배터리, 지도 앱을 준비하고 단독 산행이면 위치 공유를 켭니다.',
  ]
  const risks = courses
    .map(course => course.risk_note?.trim())
    .filter((value): value is string => Boolean(value))
    .slice(0, 3)

  return { checks, risks }
}
