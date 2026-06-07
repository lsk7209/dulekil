import type { Course, Mountain } from './db/schema'

export type MountainDifficulty = '하' | '중' | '상' | '매우상'

type MountainFallbackGuide = {
  summary: string[]
  fits: { title: string; body: string }[]
  access: { body: string; trailheads: string[] }
  risks?: string[]
}

export type MountainOfficialSource = {
  label: string
  url: string
}

export type MountainDeepInfo = {
  intro: string
  highlights: { title: string; body: string; tone: 'forest' | 'clay' | 'sky' }[]
  sourceNote: string
  sources: MountainOfficialSource[]
}

export type MountainQuickFacts = {
  difficultyLabel: string
  distanceLabel: string
  durationLabel: string
  accessLabel: string
}

export type MountainFallbackRoute = {
  name: string
  target: string
  plan: string
  caution: string
}

export type MountainFaq = {
  q: string
  a: string
}

const FALLBACK_GUIDES: Record<string, MountainFallbackGuide> = {
  '가리산': {
    summary: [
      '가리산은 강원 홍천의 1,000m급 조망 산행지로, 정상부 암릉과 능선 조망이 핵심입니다.',
      '현재 DB 코스 수치가 없으므로 산행 전 홍천군·산림청 안내와 현장 이정표를 먼저 확인해야 합니다.',
      '초보자는 정상 욕심보다 짧은 원점회귀와 하산 시간을 보수적으로 잡는 편이 안전합니다.',
    ],
    fits: [
      { title: '초보·가족 산행', body: '자연휴양림이나 관리된 들머리 기준으로 짧은 왕복 동선을 우선 검토하세요. 정상부 바위 구간은 날씨가 나쁘면 무리하지 않는 편이 좋습니다.' },
      { title: '당일치기 완등', body: '홍천 접근 시간을 포함해 오전 출발을 기본값으로 두세요. 하산 후 이동 시간이 길어질 수 있어 일몰 전 하산 기준이 중요합니다.' },
      { title: '경험자 코스', body: '능선 조망과 정상부 암릉을 목표로 잡되, 비 온 뒤나 겨울 결빙기에는 난이도를 한 단계 높게 판단하세요.' },
    ],
    access: { body: '홍천 방면 자가용 접근을 우선 검토하세요. 대중교통은 배차와 택시 연계가 필요할 수 있습니다.', trailheads: ['가리산 자연휴양림 방면', '홍천 두촌면 방면'] },
    risks: ['정상부 암릉과 젖은 바위 미끄럼에 주의하세요.'],
  },
  '강천산': {
    summary: [
      '강천산은 순창의 협곡, 폭포, 단풍 동선이 강한 산행지입니다.',
      '가을 성수기에는 코스 난이도보다 주차, 입장, 인파, 하산 동선 관리가 더 중요합니다.',
      '초보자는 정상 완등보다 구장군폭포와 계곡 탐방을 묶은 짧은 계획이 안정적입니다.',
    ],
    fits: [
      { title: '초보·가족 산행', body: '강천사와 폭포를 중심으로 걷는 탐방형 동선이 적합합니다. 계단과 젖은 데크 구간은 천천히 통과하세요.' },
      { title: '당일치기 완등', body: '순창 이동 시간과 성수기 주차 대기 시간을 포함해야 합니다. 단풍철 주말은 평소보다 일정을 1시간 이상 여유 있게 잡으세요.' },
      { title: '경험자 코스', body: '왕자봉 방향 능선까지 확장하면 걷는 맛이 살아납니다. 다만 인파가 많으면 하산 속도가 크게 느려집니다.' },
    ],
    access: { body: '순창 강천산군립공원 주차장과 강천사 방면 접근을 우선 확인하세요.', trailheads: ['강천산군립공원 주차장', '강천사 방면'] },
  },
  '내장산': {
    summary: [
      '내장산은 단풍, 사찰, 완만한 탐방 동선을 함께 고를 수 있는 전북 대표 명산입니다.',
      '단풍철에는 산행 난이도보다 교통 혼잡과 탐방객 밀도가 가장 큰 변수입니다.',
      '초보자는 신선봉 완등보다 내장사 주변과 짧은 능선 조망을 먼저 선택해도 만족도가 높습니다.',
    ],
    fits: [
      { title: '초보·가족 산행', body: '내장사와 단풍 탐방 중심으로 짧게 잡으세요. 성수기에는 셔틀, 매표, 주차 시간을 먼저 계산해야 합니다.' },
      { title: '당일치기 완등', body: '신선봉이나 까치봉 방향은 하산 시간을 보수적으로 잡아야 합니다. 단풍철 오후 하산은 정체가 생길 수 있습니다.' },
      { title: '경험자 코스', body: '능선 연계 산행은 조망이 좋지만 코스가 길어집니다. 물 보급과 하산 지점을 미리 정하세요.' },
    ],
    access: { body: '정읍 내장산국립공원 내장사 지구를 기준으로 접근합니다. 성수기 셔틀과 통제 공지를 먼저 확인하세요.', trailheads: ['내장사 지구', '내장산국립공원 탐방안내소'] },
  },
  '덕숭산': {
    summary: [
      '덕숭산은 예산 수덕사와 함께 걷기 좋은 문화 산행지입니다.',
      '높이는 낮지만 계단과 사찰 주변 동선이 있어 신발과 하산 집중력이 필요합니다.',
      '온천·사찰 여행과 묶기 좋아 등정형보다 반나절 산행에 적합합니다.',
    ],
    fits: [
      { title: '초보·가족 산행', body: '수덕사 관람과 짧은 산길을 묶는 일정이 안정적입니다. 급하게 정상 왕복을 잡기보다 쉬는 시간을 넣으세요.' },
      { title: '당일치기 완등', body: '예산 이동, 수덕사 관람, 식사까지 포함해 반나절~하루 일정으로 잡기 좋습니다.' },
      { title: '경험자 코스', body: '강한 운동량보다 문화·숲길·온천 연계를 목표로 잡으면 만족도가 높습니다.' },
    ],
    access: { body: '예산 수덕사 주차장과 덕산온천 권역을 함께 확인하세요.', trailheads: ['수덕사 주차장', '덕산온천 방면'] },
  },
  '덕유산': {
    summary: [
      '덕유산은 겨울 눈꽃과 향적봉 조망으로 유명한 고산 산행지입니다.',
      '곤돌라 이용 여부에 따라 체감 난이도와 산행 시간이 크게 달라집니다.',
      '겨울에는 바람, 결빙, 체감온도를 가장 보수적으로 판단해야 합니다.',
    ],
    fits: [
      { title: '초보·가족 산행', body: '무주덕유산리조트 곤돌라와 향적봉 짧은 왕복을 검토하세요. 겨울에는 아이젠과 방풍층이 필요합니다.' },
      { title: '당일치기 완등', body: '구천동 계곡이나 백련사 방향은 길어질 수 있습니다. 곤돌라 대기 시간과 하산 시간을 함께 계산하세요.' },
      { title: '경험자 코스', body: '능선 연계는 만족도가 높지만 기상 변화가 빠릅니다. 강풍 예보가 있으면 과감히 줄이세요.' },
    ],
    access: { body: '무주구천동, 백련사, 무주덕유산리조트 곤돌라 운영 여부를 함께 확인하세요.', trailheads: ['무주구천동', '백련사 방면', '무주덕유산리조트'] },
    risks: ['겨울 능선 강풍과 결빙에 주의하세요.'],
  },
  '두륜산': {
    summary: [
      '두륜산은 해남 대흥사, 케이블카, 남도 조망을 함께 보는 산행지입니다.',
      '정상 산행과 관광형 접근이 모두 가능해 동행자 체력에 맞춰 조절하기 좋습니다.',
      '비 온 뒤 바위와 데크 구간은 미끄럼을 보수적으로 봐야 합니다.',
    ],
    fits: [
      { title: '초보·가족 산행', body: '대흥사 탐방 또는 케이블카 조망을 중심으로 짧게 잡으면 부담이 작습니다.' },
      { title: '당일치기 완등', body: '대흥사 방면 산행과 해남 이동 시간을 함께 계산하세요. 남도 여행과 묶는 일정이 현실적입니다.' },
      { title: '경험자 코스', body: '능선 조망과 암릉 구간을 포함하면 산행 밀도가 올라갑니다. 습한 날은 하산을 서두르지 마세요.' },
    ],
    access: { body: '해남 대흥사 주차장과 두륜산 케이블카 운영 정보를 함께 확인하세요.', trailheads: ['대흥사 방면', '두륜산 케이블카 방면'] },
  },
  '변산': {
    summary: [
      '변산은 내변산 계곡, 직소폭포, 해안 여행을 함께 묶을 수 있는 국립공원 산행지입니다.',
      '정상 중심보다 계곡 탐방과 조망 포인트를 조합하는 방식이 실용적입니다.',
      '여름에는 더위와 습도, 비 온 뒤 계곡 수위 확인이 중요합니다.',
    ],
    fits: [
      { title: '초보·가족 산행', body: '직소폭포와 내변산 탐방로 중심으로 잡으면 만족도가 높습니다. 물가 미끄럼과 데크 구간을 조심하세요.' },
      { title: '당일치기 완등', body: '부안 이동, 주차, 해안 관광까지 묶을 수 있어 산행 시간을 과하게 늘리지 않는 편이 좋습니다.' },
      { title: '경험자 코스', body: '능선과 계곡을 함께 엮으면 변화감이 좋지만 하산 후 차량 회수 동선을 확인해야 합니다.' },
    ],
    access: { body: '내변산 탐방지원센터, 직소폭포 방면, 부안 해안 관광 동선을 함께 확인하세요.', trailheads: ['내변산 탐방지원센터', '직소폭포 방면'] },
  },
  '사량도지리산': {
    summary: [
      '사량도지리산은 섬 산행, 바다 조망, 암릉 능선이 결합된 통영 대표 산행지입니다.',
      '배 시간과 산행 시간을 함께 맞춰야 하므로 일반 내륙 산보다 일정 관리가 중요합니다.',
      '초보자는 암릉 노출 구간을 피하거나 짧은 조망 코스로 줄이는 편이 안전합니다.',
    ],
    fits: [
      { title: '초보·가족 산행', body: '여객선 시간에 맞춘 짧은 조망 산행을 검토하세요. 비, 강풍, 젖은 암릉이면 산행을 줄이는 것이 좋습니다.' },
      { title: '당일치기 완등', body: '통영 이동, 여객선 왕복, 하산 후 선착장 복귀 시간을 모두 합산해야 합니다.' },
      { title: '경험자 코스', body: '능선 종주는 조망이 뛰어나지만 암릉 집중력이 필요합니다. 배 시간 압박이 있으면 무리하지 마세요.' },
    ],
    access: { body: '통영 사량도 여객선 시간표와 선착장 복귀 동선을 먼저 확인하세요.', trailheads: ['사량도 선착장 방면', '상도 능선 방면'] },
    risks: ['강풍과 젖은 암릉, 배 시간 지연에 주의하세요.'],
  },
  '설악산': {
    summary: [
      '설악산은 고도, 거리, 암릉, 계곡이 모두 강한 국내 대표 고난도 산행지입니다.',
      '코스 선택 전 국립공원 탐방로 통제, 날씨, 대피소, 일몰 시간을 반드시 확인해야 합니다.',
      '초보자는 대청봉보다 권금성, 울산바위, 비선대처럼 짧은 탐방형 코스부터 시작하는 편이 안전합니다.',
    ],
    fits: [
      { title: '초보·가족 산행', body: '소공원, 비선대, 울산바위처럼 탐방객이 많고 이정표가 분명한 코스부터 검토하세요.' },
      { title: '당일치기 완등', body: '대청봉 당일 산행은 체력, 출발 시간, 하산 집중력이 모두 필요합니다. 일몰 전 하산 가능성을 먼저 계산하세요.' },
      { title: '경험자 코스', body: '공룡능선, 서북능선 등은 날씨와 체력 변수에 민감합니다. 통제와 대피소 정보를 우선하세요.' },
    ],
    access: { body: '설악동 소공원, 오색, 한계령, 백담사 등 들머리에 따라 난이도와 교통이 크게 달라집니다.', trailheads: ['설악동 소공원', '오색 방면', '한계령 방면', '백담사 방면'] },
    risks: ['탐방로 통제, 낙석, 강풍, 장거리 하산에 주의하세요.'],
  },
  '소백산': {
    summary: [
      '소백산은 넓은 능선, 바람, 철쭉과 겨울 상고대가 강한 고산 산행지입니다.',
      '정상부 능선은 완만해 보여도 바람이 강해 체감 난도가 올라갑니다.',
      '초보자는 비로사·삼가·어의곡 등 들머리별 거리와 하산 시간을 먼저 비교해야 합니다.',
    ],
    fits: [
      { title: '초보·가족 산행', body: '짧은 원점회귀와 날씨 좋은 날을 우선하세요. 능선 바람이 강하면 정상 욕심을 줄이는 편이 좋습니다.' },
      { title: '당일치기 완등', body: '비로봉 왕복은 충분히 가능하지만 이동 시간과 하산 후 피로를 함께 계산해야 합니다.' },
      { title: '경험자 코스', body: '연화봉과 비로봉 연계는 만족도가 높습니다. 겨울에는 방풍과 체온 관리가 핵심입니다.' },
    ],
    access: { body: '단양, 영주 방면 들머리와 국립공원 통제 정보를 함께 확인하세요.', trailheads: ['비로사 방면', '삼가 방면', '어의곡 방면'] },
    risks: ['능선 강풍과 겨울 체감온도 저하에 주의하세요.'],
  },
  '속리산': {
    summary: [
      '속리산은 법주사, 문장대, 천왕봉을 목적에 따라 나눠 선택하는 산행지입니다.',
      '초보자는 정상 완등보다 법주사와 문장대 중심으로 계획하면 부담이 줄어듭니다.',
      '암릉과 계단, 긴 하산이 겹칠 수 있어 무릎 피로를 고려해야 합니다.',
    ],
    fits: [
      { title: '초보·가족 산행', body: '법주사 탐방과 짧은 산길을 묶는 문화 산행이 좋습니다. 문장대까지 확장할 때는 하산 시간을 보수적으로 잡으세요.' },
      { title: '당일치기 완등', body: '문장대와 천왕봉을 모두 엮으면 길어집니다. 한 목표만 정하는 편이 안정적입니다.' },
      { title: '경험자 코스', body: '능선 연계는 조망이 좋지만 계단과 바위 피로가 누적됩니다. 무릎 보호와 하산 속도 관리가 필요합니다.' },
    ],
    access: { body: '보은 법주사 지구와 화북 방면 접근을 비교하세요.', trailheads: ['법주사 지구', '화북 방면'] },
  },
  '월악산': {
    summary: [
      '월악산은 충주호 조망과 급경사 계단이 강한 산행지입니다.',
      '영봉 정상 산행은 짧아 보여도 오르내림이 강해 체감 난도가 높습니다.',
      '초보자는 거리보다 계단, 무릎 피로, 하산 집중력을 먼저 고려해야 합니다.',
    ],
    fits: [
      { title: '초보·가족 산행', body: '정상 완등보다 짧은 조망 탐방이나 주변 걷기 코스를 먼저 검토하세요.' },
      { title: '당일치기 완등', body: '덕주사·송계계곡 등 들머리에 따라 하산 동선이 달라집니다. 원점회귀 여부를 먼저 정하세요.' },
      { title: '경험자 코스', body: '영봉과 능선 조망은 좋지만 급경사 계단이 누적됩니다. 비나 결빙이면 난이도를 높게 판단하세요.' },
    ],
    access: { body: '월악산국립공원 덕주사, 송계계곡, 보덕암 방면 통제와 주차 정보를 확인하세요.', trailheads: ['덕주사 방면', '송계계곡 방면', '보덕암 방면'] },
    risks: ['급경사 계단과 겨울 결빙에 주의하세요.'],
  },
  '월출산': {
    summary: [
      '월출산은 바위 능선과 구름다리, 남도 조망이 강한 암릉 산행지입니다.',
      '거리는 길지 않아도 계단, 바위, 노출 구간 때문에 체감 난도가 높습니다.',
      '초보자는 날씨가 좋은 날 짧은 코스로 줄이고 강풍·비 예보에는 무리하지 않는 편이 안전합니다.',
    ],
    fits: [
      { title: '초보·가족 산행', body: '천황사 방면 짧은 조망 코스부터 검토하세요. 구름다리와 계단 구간은 혼잡 시 시간이 늘어납니다.' },
      { title: '당일치기 완등', body: '정상 완등은 가능하지만 암릉 피로가 큽니다. 하산 후 영암 이동까지 포함해 일정을 잡으세요.' },
      { title: '경험자 코스', body: '도갑사 연계나 능선 산행은 만족도가 높지만 차량 회수와 하산 동선 확인이 필요합니다.' },
    ],
    access: { body: '천황사, 도갑사 방면 들머리와 월출산국립공원 통제 정보를 확인하세요.', trailheads: ['천황사 방면', '도갑사 방면'] },
    risks: ['강풍, 젖은 암릉, 계단 피로에 주의하세요.'],
  },
  '장성축령산': {
    summary: [
      '장성축령산은 편백숲 치유 산행과 완만한 숲길이 강한 전남 힐링 산행지입니다.',
      '정상 등정 욕심보다 숲길 체류와 호흡, 그늘 휴식에 초점을 맞추면 만족도가 높습니다.',
      '여름에도 습도와 벌레, 비 온 뒤 흙길 미끄럼은 확인해야 합니다.',
    ],
    fits: [
      { title: '초보·가족 산행', body: '편백숲 산책로 중심으로 짧게 걸으면 부담이 작습니다. 아이나 시니어 동행에도 비교적 맞습니다.' },
      { title: '당일치기 완등', body: '장성 이동과 숲길 체류 시간을 포함해 반나절 코스로 잡기 좋습니다.' },
      { title: '경험자 코스', body: '강한 운동량보다 회복 산행, 우중 숲길, 피톤치드 체험 목적에 적합합니다.' },
    ],
    access: { body: '장성 치유의 숲, 축령산 편백숲 주차와 탐방 안내를 확인하세요.', trailheads: ['장성 편백숲 방면', '치유의 숲 방면'] },
  },
  '장안산': {
    summary: [
      '장안산은 전북 장수의 고산 초원 능선과 금강·섬진강 발원지 권역을 함께 보는 산입니다.',
      '고도가 높아 바람과 기온 차가 크며, 계절에 따라 체감 난도가 달라집니다.',
      '초보자는 짧은 능선 왕복과 하산 시간을 보수적으로 잡는 편이 좋습니다.',
    ],
    fits: [
      { title: '초보·가족 산행', body: '무룡고개 등 고도를 올려 시작하는 들머리를 확인해 부담을 줄이세요. 바람이 강하면 짧게 줄이는 판단이 필요합니다.' },
      { title: '당일치기 완등', body: '장수 이동 시간과 능선 바람을 고려해 오전 출발을 기본값으로 두세요.' },
      { title: '경험자 코스', body: '능선 조망과 고산 초원을 목표로 잡으면 좋습니다. 겨울과 강풍기에는 방풍 장비를 우선하세요.' },
    ],
    access: { body: '장수 무룡고개와 지자체 탐방 안내를 확인하세요.', trailheads: ['무룡고개 방면', '장수 방면'] },
    risks: ['고산 능선 강풍과 기온 저하에 주의하세요.'],
  },
  '치악산': {
    summary: [
      '치악산은 원주 접근성이 좋지만 급경사와 긴 계단으로 체감 난도가 높은 산입니다.',
      '비로봉 산행은 거리보다 오르막 강도와 하산 무릎 피로가 변수입니다.',
      '초보자는 구룡사 주변 탐방이나 짧은 코스부터 경험하는 편이 안전합니다.',
    ],
    fits: [
      { title: '초보·가족 산행', body: '구룡사와 계곡 탐방 중심으로 잡고 비로봉 완등은 다음 단계로 미루는 편이 좋습니다.' },
      { title: '당일치기 완등', body: '사다리병창 등 급경사 구간은 체력 소모가 큽니다. 하산 시간을 넉넉히 잡으세요.' },
      { title: '경험자 코스', body: '비로봉 왕복 또는 능선 연계는 운동량이 충분합니다. 겨울에는 결빙 대비가 필요합니다.' },
    ],
    access: { body: '원주 구룡사 지구, 황골, 부곡 방면 들머리를 비교하세요.', trailheads: ['구룡사 방면', '황골 방면', '부곡 방면'] },
    risks: ['급경사 하산과 겨울 결빙에 주의하세요.'],
  },
  '한라산': {
    summary: [
      '한라산은 백록담 정상 탐방 여부에 따라 예약, 시간, 난이도가 크게 달라지는 제주 대표 고산입니다.',
      '성판악·관음사 코스는 탐방예약과 입산 통제 시간을 반드시 확인해야 합니다.',
      '초보자는 백록담보다 영실·어리목 등 짧은 고지대 탐방부터 시작해도 충분히 만족도가 높습니다.',
    ],
    fits: [
      { title: '초보·가족 산행', body: '영실, 어리목처럼 백록담까지 가지 않는 코스를 먼저 검토하세요. 날씨가 나쁘면 고도 체감이 빠르게 올라갑니다.' },
      { title: '당일치기 완등', body: '성판악 또는 관음사 예약, 입산 마감, 하산 시간을 모두 맞춰야 합니다. 새벽 출발이 기본입니다.' },
      { title: '경험자 코스', body: '관음사 하산은 경관이 좋지만 피로도가 높습니다. 겨울에는 아이젠과 방풍 장비가 필수입니다.' },
    ],
    access: { body: '한라산 탐방예약제, 성판악·관음사 주차, 버스 시간표를 먼저 확인하세요.', trailheads: ['성판악', '관음사', '영실', '어리목'] },
    risks: ['입산 통제 시간, 강풍, 눈·결빙, 고도 피로에 주의하세요.'],
  },
}

export function getMountainFallbackGuide(name: string) {
  return FALLBACK_GUIDES[name]
}

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

const MOUNTAIN_IDENTITY_NOTES: Record<string, string> = {
  '가리산': '홍천 내륙의 1,000m급 산세와 정상부 암릉 조망이 강점입니다. 숲길로 시작해 바위 능선으로 분위기가 바뀌는 산이라, 짧은 원점회귀라도 장갑과 접지 좋은 신발을 준비하는 편이 좋습니다.',
  '가야산': '합천과 성주에 걸친 가야산은 해인사 문화권과 바위 능선 조망이 함께 살아나는 산입니다. 사찰 체류와 정상 산행을 모두 잡으면 일정이 길어지므로 목적을 분리하는 편이 좋습니다.',
  '가지산': '가지산은 영남알프스의 높은 축을 이루는 산으로, 능선 바람과 긴 하산 피로가 큰 편입니다. 억새·철쭉 풍경을 보더라도 기상 변화와 탈출 동선을 먼저 확인해야 합니다.',
  '감악산': '감악산은 파주·양주권에서 접근성이 좋고 출렁다리, 임꺽정봉, 능선 조망을 함께 엮기 좋은 산입니다. 주말에는 등산 난도보다 주차와 하산 인파가 더 큰 변수가 됩니다.',
  '갑장산': '상주 갑장산은 낙동강 내륙 조망과 완만한 산길을 함께 볼 수 있는 지역 명산입니다. 낮은 고도처럼 보여도 능선 바람과 흙길 미끄럼을 따로 계산해야 합니다.',
  '강천산': '순창 강천산은 계곡, 폭포, 사찰, 단풍 탐방을 한 번에 엮기 쉬운 산입니다. 정상 완등보다 강천사와 구장군폭포 일대의 탐방 만족도가 높아 동행자 체력 차이가 큰 팀에도 잘 맞습니다.',
  '계방산': '계방산은 높은 고도와 겨울 설경으로 알려진 강원 산행지입니다. 운두령 등 고도를 올려 시작하는 동선이 많아 짧아 보여도 바람과 체감온도를 보수적으로 잡아야 합니다.',
  '공작산': '공작산은 홍천 숲길과 능선 조망을 차분하게 걷기 좋은 산입니다. 강한 관광 포인트보다 조용한 능선 산행 성격이 커서 물 보급과 하산 시간을 미리 정하는 편이 좋습니다.',
  '관악산': '관악산은 서울 도심 접근성이 매우 좋지만 바위 구간과 계단이 많아 체감 난도는 낮지 않습니다. 사당·서울대·과천 들머리별 분위기가 달라 하산지를 먼저 정해야 합니다.',
  '광덕산': '광덕산은 포천·화천권 고산 분위기와 겨울 적설 변수가 강한 산입니다. 능선 길은 비교적 단순해 보여도 강풍과 결빙 때는 체력보다 장비가 산행 품질을 좌우합니다.',
  '구병산': '구병산은 속리산권의 바위 능선과 내륙 조망이 살아나는 산입니다. 짧은 구간도 급경사와 바위 피로가 누적될 수 있어 하산 집중력을 넉넉히 남겨야 합니다.',
  '금수산': '금수산은 단양·제천권 호수 조망과 암릉 분위기가 함께 있는 산입니다. 청풍호 주변 일정과 묶기 좋지만, 계단과 바위길 때문에 거리보다 무릎 피로를 크게 봐야 합니다.',
  '금오산': '금오산은 구미 도심 가까이 있으면서 폭포, 사찰, 성곽 흔적, 정상 조망을 함께 볼 수 있는 산입니다. 케이블카·탐방형 동선과 정상 산행의 체력 요구치가 다릅니다.',
  '금정산': '금정산은 부산 도심과 산성 능선을 함께 걷는 산입니다. 대중교통 접근은 좋지만 구간 선택지가 많아 초보자는 북문·동문·범어사 기준으로 짧게 나누는 편이 안정적입니다.',
  '기백산': '기백산은 함양·거창권의 능선 조망과 고산 숲길을 함께 가진 산입니다. 장거리 능선 연계 욕심을 내기보다 하산 지점과 차량 회수 동선을 먼저 확정해야 합니다.',
  '남덕유산': '남덕유산은 덕유산 남쪽의 거친 능선미와 고도감을 느끼는 산입니다. 겨울 바람과 결빙이 강해 짧은 구간도 난도를 높게 보고 방풍 장비를 우선해야 합니다.',
  '남산': '경주 남산은 불교 유적, 석불, 탑, 능선을 함께 걷는 문화 산행지입니다. 정상 인증보다 유적 동선을 어떻게 묶을지에 따라 만족도가 크게 달라집니다.',
  '내연산': '내연산은 보경사와 12폭포 계곡으로 대표되는 포항권 탐방 산입니다. 여름과 가을에는 계곡 체류가 좋지만 비 온 뒤 수량과 미끄럼을 반드시 확인해야 합니다.',
  '내장산': '내장산은 단풍으로 유명하지만 실제 계획에서는 내장사, 계곡, 능선 조망, 신선봉 완등 중 무엇을 우선할지 먼저 정해야 합니다. 성수기에는 산행 난이도보다 주차와 셔틀 대기 시간이 더 큰 변수가 됩니다.',
  '대둔산': '대둔산은 암릉, 구름다리, 계단 구간이 강한 산으로 거리보다 고도감과 노출감이 기억에 남습니다. 케이블카 이용 여부에 따라 산행 피로와 일정이 크게 달라집니다.',
  '대야산': '대야산은 문경·괴산권의 계곡과 바위 능선을 함께 가진 산입니다. 여름에는 물길 주변 미끄럼, 겨울에는 암릉 결빙을 보수적으로 판단해야 합니다.',
  '덕숭산': '덕숭산은 예산 수덕사와 덕산온천 권역을 함께 묶기 좋은 문화 산행지입니다. 정상 등정보다 사찰 탐방과 짧은 숲길 산행의 균형을 맞추면 만족도가 높습니다.',
  '덕유산': '덕유산은 향적봉, 구천동 계곡, 백련사, 설천봉 곤돌라가 결합된 고산 산행지입니다. 곤돌라를 쓰면 짧은 고산 조망이 가능하지만, 겨울 능선은 바람과 결빙 때문에 짧아도 체감 난도가 크게 올라갑니다.',
  '도락산': '도락산은 단양권 바위 능선과 조망이 강한 산으로, 짧은 거리에도 오르내림이 잦습니다. 초보자는 코스 길이보다 계단과 바위 하산 피로를 먼저 봐야 합니다.',
  '두륜산': '두륜산은 해남 대흥사 문화권과 남도 조망, 케이블카 접근성을 함께 가진 산입니다. 등정형 산행과 관광형 탐방을 모두 설계할 수 있어 가족 여행과 산행을 결합하기 좋습니다.',
  '두타산': '두타산은 무릉계곡과 긴 능선 산행이 모두 가능한 강원 동해권 산입니다. 계곡 탐방형과 정상 등정형의 체력 차이가 크므로 일정 목적을 분명히 해야 합니다.',
  '마니산': '마니산은 강화도 바다 조망과 참성단 역사성을 함께 보는 산입니다. 계단길과 능선길 선택에 따라 체감이 달라지며, 해무와 강풍이 조망을 좌우합니다.',
  '마이산': '마이산은 말의 귀처럼 솟은 독특한 봉우리와 탑사 권역으로 기억되는 산입니다. 짧은 관광 동선과 암마이봉 등정은 성격이 다르므로 계단 피로와 통제 여부를 먼저 확인해야 합니다.',
  '명성산': '명성산은 억새와 산정호수 연계가 강한 포천 대표 산행지입니다. 가을 성수기에는 등산 난도보다 주차, 인파, 하산 대기 시간이 더 큰 변수입니다.',
  '명지산': '명지산은 가평의 높은 산세와 계곡, 긴 오르막이 특징입니다. 정상 조망을 목표로 하면 산행 시간이 길어져 일몰 전 하산 기준을 엄격히 잡아야 합니다.',
  '모악산': '모악산은 김제·전주권에서 접근하기 좋은 산으로 금산사와 능선 조망을 함께 볼 수 있습니다. 종교·문화 탐방과 운동 목적 산행을 나눠 계획하면 동선이 깔끔합니다.',
  '무등산': '무등산은 입석대·서석대 주상절리와 광주 도심 조망이 강한 국립공원 산입니다. 정상부 통제와 탐방예약·개방 여부가 시기별로 달라 공식 공지가 중요합니다.',
  '무학산': '무학산은 창원·마산 도심 가까이에서 바다와 도시 조망을 함께 보는 산입니다. 접근은 쉽지만 코스가 다양해 하산지를 잘못 잡으면 이동 시간이 길어집니다.',
  '민주지산': '민주지산은 충북·전북·경북 경계권의 겨울 능선 산행지로 알려져 있습니다. 고도와 바람이 강해 겨울에는 체력보다 체온 유지와 탈출 동선이 중요합니다.',
  '방태산': '방태산은 인제 깊은 숲과 계곡, 높은 고도감이 강한 산입니다. 접근 시간이 길고 산세가 깊어 단독 산행보다 여유 있는 당일 또는 숙박 연계가 안정적입니다.',
  '백덕산': '백덕산은 영월·평창권의 고산 숲길과 겨울 설경이 좋은 산입니다. 능선부 바람과 적설 변수가 있어 짧은 산행이라도 방한 장비를 갖춰야 합니다.',
  '백운산': '포천 백운산은 광덕고개권 능선 산행과 계곡 접근을 함께 고려하는 산입니다. 수도권에서 가깝지만 고도가 있어 겨울 결빙과 강풍을 가볍게 보면 안 됩니다.',
  '변산': '변산은 산과 바다가 가까운 변산반도 권역의 탐방지입니다. 내변산 계곡과 직소폭포를 중심으로 잡으면 여름 숲길의 장점이 살아나고, 해안 여행과 하루 일정으로 묶기 쉽습니다.',
  '불암산': '불암산은 서울·남양주 경계의 짧고 밀도 높은 바위산입니다. 접근은 쉽지만 정상부 암릉과 계단이 있어 초보자는 날씨 좋은 날 짧게 왕복하는 편이 안전합니다.',
  '비슬산': '비슬산은 대구 달성권의 참꽃 군락과 넓은 고원 분위기가 강한 산입니다. 봄꽃 시기에는 주차와 셔틀, 능선 바람을 함께 고려해야 합니다.',
  '사량도지리산': '사량도지리산은 통영 섬 산행 특유의 바다 조망과 암릉 능선이 핵심입니다. 배 시간, 강풍, 젖은 바위 변수를 함께 계산해야 하므로 일반 내륙 산보다 일정 여유가 더 중요합니다.',
  '설악산': '설악산은 대청봉, 공룡능선, 울산바위, 비선대, 오색 권역처럼 산행 성격이 크게 갈립니다. 국립공원 탐방로 통제와 낙석 위험, 대피소 운영 여부가 실제 코스 선택을 좌우합니다.',
  '소백산': '소백산은 비로봉과 연화봉을 잇는 넓은 능선, 철쭉, 겨울 상고대가 강한 산입니다. 능선이 완만해 보여도 바람이 강해 체온 관리가 중요하며, 들머리 선택에 따라 체감 거리가 크게 달라집니다.',
  '속리산': '속리산은 법주사 문화권, 문장대 조망, 천왕봉 능선을 따로 또는 함께 선택하는 산입니다. 한 번에 모두 욕심내면 길어지므로 초보자는 법주사와 문장대 중심으로 계획하는 편이 안정적입니다.',
  '수락산': '수락산은 서울 북동부에서 접근성이 좋고 암릉과 계곡을 짧게 경험할 수 있는 산입니다. 가까운 산이라고 가볍게 보면 바위 하산에서 피로가 커질 수 있습니다.',
  '신불산': '신불산은 영남알프스 억새 능선의 대표 산행지입니다. 간월재와 능선 조망은 좋지만 가을 성수기 혼잡과 능선 강풍을 함께 계산해야 합니다.',
  '연화산': '고성 연화산은 완만한 숲길과 사찰 탐방을 묶기 좋은 남해권 산입니다. 강한 운동량보다 조용한 산책형 산행과 가족 동행에 잘 맞습니다.',
  '오봉산': '춘천 오봉산은 소양강 조망과 암릉, 청평사 연계가 매력적인 산입니다. 배편·도로 접근 여부와 하산 후 이동 동선을 함께 확인하면 일정이 안정적입니다.',
  '오서산': '오서산은 서해 조망과 억새 능선이 강한 충남 대표 산입니다. 가을에는 풍경 만족도가 높지만 주차와 능선 바람, 하산 혼잡을 넉넉히 봐야 합니다.',
  '용문산': '용문산은 양평의 높은 산세와 용문사 문화권을 함께 가진 산입니다. 은행나무 탐방과 정상 산행은 체력 요구치가 달라 목표를 분리하는 편이 좋습니다.',
  '용화산': '용화산은 화천·춘천권 바위 능선과 호수권 조망이 어우러진 산입니다. 암릉 구간은 짧아도 집중력이 필요해 비나 결빙 때는 난도를 높게 봐야 합니다.',
  '운달산': '운달산은 문경 내륙의 조용한 숲길과 능선 산행을 즐기기 좋은 산입니다. 방문객 밀도가 낮은 구간은 표지 확인과 하산 시간 관리가 특히 중요합니다.',
  '운문산': '운문산은 영남알프스 남쪽의 계곡, 사찰, 고산 능선을 함께 보는 산입니다. 석골사·운문사 권역 선택에 따라 접근과 하산 동선이 크게 달라집니다.',
  '운장산': '운장산은 진안·완주권의 고산 능선과 조망이 강한 산입니다. 피암목재 등 고도를 올려 시작하는 코스라도 능선 바람과 하산 피로를 크게 잡아야 합니다.',
  '월악산': '월악산은 충주호 조망과 영봉 급경사 계단으로 기억되는 산입니다. 거리는 과하게 길지 않아 보여도 오르내림이 강해 무릎 피로와 하산 집중력을 크게 잡아야 합니다.',
  '월출산': '월출산은 남도 평야 위로 솟은 바위산 이미지가 뚜렷합니다. 천황봉, 구름다리, 도갑사 연계처럼 짧지만 밀도 높은 암릉 산행이 많아 강풍과 비 예보를 특히 보수적으로 봐야 합니다.',
  '유명산': '유명산은 가평권에서 계곡과 능선 산행을 함께 즐기기 좋은 산입니다. 자연휴양림 접근이 편하지만 성수기에는 주차와 계곡 인파가 산행 흐름을 늦출 수 있습니다.',
  '응봉산': '응봉산은 덕구계곡과 온천 연계가 강한 산행지입니다. 계곡길은 여름 만족도가 높지만 비 온 뒤 수량과 미끄럼, 긴 접근 시간을 함께 고려해야 합니다.',
  '장성축령산': '장성축령산은 편백숲 체류와 완만한 숲길이 강점인 회복형 산행지입니다. 정상 인증보다 숲길 체류, 그늘 휴식, 가족 동행 산책에 초점을 맞추면 만족도가 높습니다.',
  '장안산': '장안산은 장수 고원의 능선 조망과 바람을 함께 느끼는 산입니다. 고도가 높아 계절보다 기온 차가 크게 체감되므로 여름에도 방풍층을 챙기는 것이 좋습니다.',
  '재약산': '재약산은 사자평 억새와 영남알프스 능선 연계가 강한 산입니다. 표충사·천황산 연계 여부에 따라 거리가 늘어나므로 체력과 하산지를 먼저 정해야 합니다.',
  '적상산': '적상산은 무주 적상산성, 전망대, 단풍 풍경이 어울리는 산입니다. 차로 고도를 올리는 동선과 등산형 동선의 체감이 달라 목적에 맞게 선택해야 합니다.',
  '주왕산': '주왕산은 기암 절벽과 계곡 탐방로가 강한 국립공원입니다. 정상 등정형보다 주왕계곡 탐방 만족도가 높은 편이라 가족 동행은 계곡 중심이 안정적입니다.',
  '주흘산': '주흘산은 문경새재와 조령산권 역사길을 함께 엮기 좋은 산입니다. 주봉·영봉 연계는 길어지므로 문화 탐방과 정상 산행 시간을 분리해 잡아야 합니다.',
  '치악산': '치악산은 원주 접근성은 좋지만 비로봉 오름과 긴 계단, 급경사 하산 때문에 만만하게 보면 안 됩니다. 구룡사 탐방과 비로봉 완등은 체력 요구치가 다르므로 목표를 분리하는 편이 좋습니다.',
  '한라산': '한라산은 백록담 정상 탐방 여부가 모든 계획을 바꾸는 산입니다. 성판악과 관음사는 예약, 입산 마감, 하산 시간을 맞춰야 하고, 영실과 어리목은 정상 대신 고지대 풍경을 가볍게 즐기기 좋습니다.',
  '지리산': '지리산은 여러 도와 시군에 걸친 큰 산악형 국립공원으로, 성삼재 노고단 탐방부터 천왕봉 장거리 산행까지 난이도 폭이 큽니다. 짧은 조망 산행과 종주형 산행을 같은 기준으로 비교하면 안 됩니다.',
  '천관산': '천관산은 장흥 남해 조망과 기암 능선, 억새 풍경이 강한 산입니다. 거리는 길지 않아도 바위와 바람이 체감을 높이므로 날씨 좋은 날을 고르는 편이 좋습니다.',
  '천마산': '천마산은 남양주권 접근성이 좋은 산으로 야생화와 능선 조망을 함께 볼 수 있습니다. 대중교통 접근이 편한 만큼 주말 혼잡과 하산 동선을 미리 정해야 합니다.',
  '천성산': '천성산은 양산권 습지, 억새, 능선 조망이 어우러진 산입니다. 화엄벌과 정상부 동선은 바람과 안개 영향을 받기 쉬워 시야와 노면을 확인해야 합니다.',
  '천왕산': '천왕산은 밀양·청도권 고산 분위기와 영남알프스 주변 조망을 함께 보는 산입니다. 재약산·운문산권 연계 욕심을 내면 거리가 길어지므로 단일 목표가 안전합니다.',
  '청량산': '청량산은 봉화의 기암, 사찰, 하늘다리 조망이 강한 산입니다. 관광형 탐방과 능선 산행이 섞여 있어 계단과 데크 구간의 혼잡을 고려해야 합니다.',
  '청화산': '청화산은 속리산권 내륙 능선과 조용한 숲길 성격이 강한 산입니다. 표지와 하산 지점 확인이 중요하며, 여름에는 숲길 습도와 물 보급을 넉넉히 잡아야 합니다.',
  '축령산': '남양주 축령산은 잣나무 숲과 휴양림 접근성이 좋아 가족 산행에 잘 맞습니다. 정상 왕복보다 숲길 체류와 완만한 원점회귀를 우선하면 만족도가 높습니다.',
  '칠갑산': '칠갑산은 청양의 완만한 산세와 장곡사, 출렁다리 등 주변 관광지를 묶기 좋은 산입니다. 산행 난도는 낮은 편이어도 성수기 주차와 이동 시간을 포함해야 합니다.',
  '태백산': '태백산은 천제단, 주목 군락, 겨울 눈꽃으로 대표되는 고산 산행지입니다. 비교적 길이 정비돼 있어도 겨울 강풍과 체감온도는 매우 보수적으로 봐야 합니다.',
  '팔공산': '팔공산은 대구·경북권의 큰 산세와 사찰, 능선 조망을 함께 가진 산입니다. 케이블카·갓바위·동봉 등 목적지가 달라 코스 선택 전 우선순위를 정해야 합니다.',
  '팔봉산': '홍천 팔봉산은 낮은 고도와 달리 짧은 암릉 봉우리를 오르내리는 재미가 강한 산입니다. 강변 조망은 좋지만 비 온 뒤 바위와 사다리 구간은 특히 조심해야 합니다.',
  '팔영산': '팔영산은 고흥 다도해 조망과 여덟 봉우리 암릉 흐름이 매력적인 산입니다. 봉우리 연속 구간은 짧아도 집중력이 필요해 강풍·비 예보에는 단축을 고려해야 합니다.',
  '학가산': '학가산은 안동권에서 비교적 조용하게 능선 조망을 즐길 수 있는 산입니다. 방문객이 많은 산보다 표지 확인과 하산 교통 계획을 더 꼼꼼히 잡아야 합니다.',
  '함백산': '함백산은 자동차 접근 고도가 높고 정상 조망이 강한 태백권 고산입니다. 짧은 산책처럼 보여도 겨울 바람과 결빙은 고산 기준으로 준비해야 합니다.',
  '향로봉': '향로봉은 강원 북부의 높은 산세와 군사지역 인접성 때문에 접근·통제 확인이 중요한 산입니다. 코스보다 허용 구간과 현장 안내를 먼저 확인해야 합니다.',
  '화악산': '화악산은 경기 최고봉권의 고도와 긴 접근이 체감되는 산입니다. 정상부 군사시설·도로 접근 변수와 겨울 결빙을 함께 고려해야 합니다.',
  '화왕산': '화왕산은 창녕 억새평원과 화왕산성 분위기가 강한 산입니다. 봄 진달래와 가을 억새철에는 풍경보다 주차·혼잡 관리가 더 중요해질 수 있습니다.',
  '황매산': '황매산은 철쭉 군락과 넓은 능선 풍경으로 유명한 합천·산청권 산입니다. 축제철에는 걷는 난도보다 차량 접근, 인파, 하산 시간이 산행 품질을 좌우합니다.',
  '황석산': '황석산은 함양권의 거친 암릉과 산성 흔적이 살아 있는 산입니다. 짧게 잡아도 바위 구간 집중력이 필요해 비나 결빙 때는 난도를 높게 봐야 합니다.',
  '황악산': '황악산은 김천 직지사 문화권과 능선 산행을 함께 가진 산입니다. 사찰 탐방 시간을 포함하면 일정이 길어지므로 정상 산행과 문화 관람을 나눠 잡는 편이 좋습니다.',
  '황장산': '황장산은 문경권 백두대간 분위기와 바위 능선을 함께 느끼는 산입니다. 통제 구간과 우회로 확인이 중요하며, 능선 바람을 보수적으로 봐야 합니다.',
  '회문산': '회문산은 순창의 숲길과 역사적 이야기, 완만한 능선을 함께 가진 산입니다. 강한 등정형보다 조용한 숲길 체류와 지역 여행 연계에 잘 맞습니다.',
  '북한산': '북한산은 도심 접근성이 뛰어나지만 백운대와 암릉 구간은 주말 혼잡과 노출감이 강합니다. 지하철 접근이 쉬운 만큼 출발은 편하지만, 하산길 선택과 인파 회피가 만족도를 좌우합니다.',
  '도봉산': '도봉산은 서울 북부의 바위 능선 산행지로, 짧은 접근 시간에 비해 암릉 체감이 강합니다. 초보자는 정상 인증보다 계곡, 사찰, 전망 포인트를 중심으로 코스를 줄이는 편이 안전합니다.',
  '오대산': '오대산은 월정사 전나무숲, 상원사, 비로봉을 목적에 따라 조합하는 산입니다. 숲길 탐방과 정상 산행의 피로도가 다르므로 사찰 탐방 시간을 산행 시간과 분리해 계산해야 합니다.',
  '계룡산': '계룡산은 동학사, 갑사, 신원사 권역과 능선 조망을 함께 가진 충청권 대표 산입니다. 사찰 탐방형 코스와 정상 연계 코스의 난도가 크게 달라 들머리부터 목적을 분명히 하는 것이 좋습니다.',
}

const OFFICIAL_SOURCES: Record<string, MountainOfficialSource[]> = {
  '설악산': [
    { label: '국립공원공단 설악산 탐방예약', url: 'https://reservation.knps.or.kr/contents/T/serviceGuide.do?parkId=B03&prdDvcd=T' },
    { label: '국립공원공단', url: 'https://www.knps.or.kr' },
  ],
  '지리산': [
    { label: '국립공원공단 지리산 탐방예약', url: 'https://reservation.knps.or.kr/contents/T/serviceGuide.do?parkId=B01&prdDvcd=T' },
    { label: '국립공원공단', url: 'https://www.knps.or.kr' },
  ],
  '덕유산': [
    { label: '국립공원공단 덕유산 탐방예약', url: 'https://reservation.knps.or.kr/contents/T/serviceGuide.do?parkId=B05&prdDvcd=T' },
    { label: '국립공원공단', url: 'https://www.knps.or.kr' },
  ],
  '한라산': [
    { label: '한라산국립공원 탐방예약', url: 'https://visithalla.jeju.go.kr' },
    { label: '제주특별자치도 한라산국립공원', url: 'https://www.jeju.go.kr/hallasan/index.htm' },
  ],
}

const NATIONAL_PARK_MOUNTAINS = new Set([
  '가야산',
  '계룡산',
  '내장산',
  '덕유산',
  '무등산',
  '변산',
  '북한산',
  '설악산',
  '소백산',
  '속리산',
  '오대산',
  '월악산',
  '월출산',
  '주왕산',
  '지리산',
  '치악산',
  '태백산',
  '한라산',
])

export function getMountainOfficialSources(name: string): MountainOfficialSource[] {
  const sources = OFFICIAL_SOURCES[name] ?? []
  const common = NATIONAL_PARK_MOUNTAINS.has(name)
    ? [{ label: '국립공원공단 탐방통제·안전공지', url: 'https://www.knps.or.kr' }]
    : [{ label: '산림청 100대 명산', url: 'https://www.forest.go.kr' }]

  return [...sources, ...common]
    .filter((source, index, arr) => arr.findIndex(item => item.url === source.url) === index)
    .slice(0, 3)
}

export function hasMountainIdentityNote(name: string) {
  return Boolean(MOUNTAIN_IDENTITY_NOTES[name])
}

function mountainRegionCharacter(mountain: Mountain) {
  const region = `${mountain.region ?? ''} ${mountain.sigun ?? ''}`
  const elev = mountain.elev ?? 0

  if (mountain.name.includes('산') && region.includes('제주')) return '화산 지형, 고도 변화, 해안 날씨의 영향을 함께 받는 산입니다.'
  if (region.includes('서울') || region.includes('인천') || region.includes('경기')) return '수도권에서 접근하기 쉬워 주말 혼잡이 잦고, 짧은 산행에도 하산 동선 선택이 중요합니다.'
  if (region.includes('강원')) return '강원 내륙과 백두대간권 산세의 영향으로 고도감, 바람, 겨울 결빙 변수가 비교적 큽니다.'
  if (region.includes('충북') || region.includes('충남')) return '내륙 산행 특성이 강해 계곡, 사찰, 능선 조망을 목적별로 나눠 계획하기 좋습니다.'
  if (region.includes('전남') || region.includes('전북') || region.includes('광주')) return '호남권 산행지답게 사찰, 계곡, 단풍, 남도 조망을 함께 엮는 일정이 잘 맞습니다.'
  if (region.includes('경남') || region.includes('경북') || region.includes('대구') || region.includes('울산') || region.includes('부산')) return '영남권의 능선 조망과 바위 구간, 계절별 억새·철쭉·단풍 변화를 함께 보기 좋은 산입니다.'
  if (elev >= 1400) return '1,400m 이상 고산이라 기온, 바람, 잔설, 일몰 시간을 낮은 산보다 보수적으로 계산해야 합니다.'
  return '지역 산행지 특성과 계절 변수가 함께 작용하므로 코스 거리만으로 난이도를 판단하지 않는 편이 좋습니다.'
}

function courseRangeText(courses: Course[]) {
  const distances = courses.map(course => course.distance).filter((value): value is number => value != null && value > 0)
  if (distances.length === 0) return '거리 수치가 부족해 공식 안내와 현장 이정표 확인이 필요합니다'
  const min = Math.min(...distances)
  const max = Math.max(...distances)
  return min === max ? `${min.toFixed(1)}km 코스가 확인됩니다` : `${min.toFixed(1)}~${max.toFixed(1)}km 범위의 코스가 확인됩니다`
}

export function buildMountainQuickFacts(mountain: Mountain, courses: Course[]): MountainQuickFacts {
  const stats = getCourseStats(courses)
  const fallback = courses.length === 0 ? getMountainFallbackGuide(mountain.name) : undefined
  const diff = courses.length > 0
    ? normalizeDifficulty(stats.shortest?.diff_norm ?? stats.hardest?.diff_norm)
    : '중'

  return {
    difficultyLabel: `난이도 ${diff}`,
    distanceLabel: stats.minDistance != null ? formatDistance(stats.minDistance) : fallback ? '공식 코스 확인' : '현장 확인 필요',
    durationLabel: stats.maxDuration > 0 ? formatDuration(stats.maxDuration) : fallback ? '일몰 전 하산 기준' : '공식 시간 확인',
    accessLabel: stats.hasTransit ? '대중교통 코스 있음' : fallback?.access.trailheads[0] ? fallback.access.trailheads[0] : '자가용 우선 검토',
  }
}

export function buildMountainMetaDescription(mountain: Mountain, courses: Course[]) {
  const stats = getCourseStats(courses)
  const region = [mountain.region, mountain.sigun].filter(Boolean).join(' ')
  const elevation = mountain.elev ? `${mountain.elev.toLocaleString()}m` : '고도 확인 필요'
  const diff = courses.length > 0
    ? normalizeDifficulty(stats.shortest?.diff_norm ?? stats.hardest?.diff_norm)
    : '중'
  const courseText = courses.length > 0
    ? `최단 ${formatDistance(stats.minDistance)}, 난이도 ${diff}`
    : '대표 들머리와 공식 통제 확인'
  const raw = `${mountain.name} 등산 코스: ${region || '국내'} 해발 ${elevation}. ${courseText}, 초보·당일치기 계획, 교통·주차, 계절별 준비와 하산 동선까지 한 번에 확인하세요.`

  return raw.length > 155 ? `${raw.slice(0, 154)}…` : raw
}

export function buildFallbackRoutes(mountain: Mountain, courses: Course[]): MountainFallbackRoute[] {
  if (courses.length > 0) return []

  const fallback = getMountainFallbackGuide(mountain.name)
  if (!fallback) return []

  const routeTargets = [
    { target: '초보·가족', plan: '짧은 왕복 또는 탐방형 동선으로 잡고, 정상 완등보다 하산 여유를 우선합니다.' },
    { target: '당일치기', plan: '오전 출발, 중간 반환 기준, 일몰 전 하산을 기본값으로 두고 교통 대기 시간을 포함합니다.' },
    { target: '경험자', plan: '능선·정상 연계를 검토하되, 통제·기상·노면 상태가 나쁘면 코스를 즉시 줄입니다.' },
    { target: '계절 탐방', plan: '봄·가을 혼잡, 여름 습도, 겨울 결빙을 따로 계산하고 공식 공지를 최종 기준으로 둡니다.' },
  ]
  const risks = fallback.risks?.join(' ') || '비, 강풍, 결빙, 낙석, 성수기 혼잡 시 체감 난도를 한 단계 높게 보세요.'

  return fallback.access.trailheads.slice(0, 4).map((trailhead, index) => ({
    name: trailhead,
    target: routeTargets[index]?.target ?? '탐방 계획',
    plan: routeTargets[index]?.plan ?? '공식 안내와 현장 이정표 기준으로 짧은 동선부터 확인합니다.',
    caution: risks,
  }))
}

export function buildMountainFaqs(mountain: Mountain, courses: Course[]): MountainFaq[] {
  const stats = getCourseStats(courses)
  const fallback = courses.length === 0 ? getMountainFallbackGuide(mountain.name) : undefined
  const diff = courses.length > 0
    ? normalizeDifficulty(stats.shortest?.diff_norm ?? stats.hardest?.diff_norm)
    : '중'
  const shortest = stats.shortest
  const access = buildAccessNotes(mountain, courses)
  const seasons = buildSeasonNotes(mountain)
  const winter = seasons.find(item => item.season === '겨울')?.body ?? '겨울에는 결빙과 체감온도 저하를 확인해야 합니다.'
  const identity = MOUNTAIN_IDENTITY_NOTES[mountain.name] ?? mountainRegionCharacter(mountain)
  const specialQuestion = NATIONAL_PARK_MOUNTAINS.has(mountain.name)
    ? `${mountain.name} 국립공원 통제는 어디서 확인하나요?`
    : `${mountain.name}은 어떤 계절에 가기 좋나요?`
  const specialAnswer = NATIONAL_PARK_MOUNTAINS.has(mountain.name)
    ? `${mountain.name}은 국립공원 또는 국립공원권 산행지로 통제, 예약, 낙석, 산불예방 공지가 코스 선택보다 우선입니다. 국립공원공단 공지와 현장 안내를 출발 당일 다시 확인하세요.`
    : `${identity} 계절 선택은 산의 대표 볼거리와 안전 변수를 함께 봐야 합니다. 봄·가을은 조망과 꽃·단풍, 여름은 계곡과 숲그늘, 겨울은 결빙 대비가 핵심입니다.`

  return [
    {
      q: `${mountain.name} 등산 난이도는?`,
      a: courses.length > 0
        ? `${mountain.name}에는 총 ${courses.length}개의 등산로 데이터가 있으며, 주요 난이도는 '${diff}'입니다. 다만 실제 체감은 계단, 암릉, 하산 경사, 날씨에 따라 달라집니다.`
        : `${mountain.name}은 현재 정량 코스 데이터가 부족해 난이도 '${diff}' 기준으로 보수적으로 안내합니다. 공식 탐방 안내와 현장 이정표를 확인한 뒤 짧은 동선부터 선택하세요.`,
    },
    {
      q: `${mountain.name} 초보도 갈 수 있나요?`,
      a: shortest
        ? `초보자는 ${shortName(shortest)}처럼 ${formatDistance(shortest.distance)} 안팎의 짧은 코스부터 보는 편이 좋습니다. 정상 인증보다 하산 시간과 무릎 피로를 우선하세요.`
        : fallback?.fits[0]?.body ?? `${mountain.name}은 초보자가 방문할 때 정상 완등보다 짧은 왕복, 탐방로 상태, 하산 시간을 먼저 확인하는 편이 안전합니다.`,
    },
    {
      q: `${mountain.name} 가장 쉬운 코스는 어떻게 고르나요?`,
      a: shortest
        ? `현재 데이터 기준 가장 짧게 비교되는 코스는 ${shortName(shortest)}이며 거리는 ${formatDistance(shortest.distance)}입니다. 쉬운 코스라도 비 온 뒤나 겨울에는 난이도를 높게 판단하세요.`
        : `현재 거리 수치가 없어 가장 쉬운 코스를 단정하지 않습니다. ${access.trailheads[0] ? `${access.trailheads[0]}처럼 접근이 분명한 들머리` : '공식 안내소가 제시하는 짧은 원점회귀'}를 먼저 확인하세요.`,
    },
    {
      q: `${mountain.name} 대중교통으로 갈 수 있나요?`,
      a: stats.hasTransit
        ? '대중교통 접근 표시가 있는 등산로가 있습니다. 다만 산행지는 배차 간격과 막차 시간이 계절·요일별로 달라지므로 최신 시간표를 확인하세요.'
        : `${access.body} 하산 후 택시 호출 가능 여부와 막차 시간을 출발 전에 같이 확인해야 합니다.`,
    },
    {
      q: `${mountain.name} 겨울 산행은 괜찮나요?`,
      a: `${winter} 아이젠, 방풍층, 장갑, 헤드랜턴을 기본으로 보고, 강풍·대설·결빙 예보가 있으면 정상보다 안전한 하산을 우선하세요.`,
    },
    {
      q: `${mountain.name} 산행 전 무엇을 확인해야 하나요?`,
      a: '기상청 예보, 일몰 시간, 국립공원·지자체·산림청 통제 공지, 주차장 위치, 들머리와 하산 지점을 확인하세요. 성수기에는 산행 시간보다 이동·주차 시간이 더 길어질 수 있습니다.',
    },
    {
      q: specialQuestion,
      a: specialAnswer,
    },
  ]
}

export function buildMountainDeepInfo(mountain: Mountain, courses: Course[]): MountainDeepInfo {
  const stats = getCourseStats(courses)
  const region = [mountain.region, mountain.sigun].filter(Boolean).join(' ')
  const elevation = mountain.elev ? `${mountain.elev.toLocaleString()}m` : '고도 정보 미확인'
  const identity = MOUNTAIN_IDENTITY_NOTES[mountain.name] ?? mountainRegionCharacter(mountain)
  const shortest = stats.shortest
  const hardest = stats.hardest
  const longest = stats.longest
  const diff = normalizeDifficulty(shortest?.diff_norm ?? hardest?.diff_norm)
  const diffPlanning =
    diff === '하'
      ? '난이도는 낮게 잡혀도 초반 페이스를 천천히 잡고, 하산 후 이동 시간을 남겨두면 초보 동행도 안정적으로 움직일 수 있습니다.'
      : diff === '중'
        ? '난이도는 중간 수준으로 보되 실제 체감은 계단, 바위, 흙길 미끄럼, 하산 경사에 따라 달라지므로 휴식 간격을 미리 정하는 것이 좋습니다.'
        : '난이도가 높게 잡히는 산행은 거리보다 노출 구간, 급경사 하산, 기상 변화가 위험을 키우므로 우회 또는 단축 기준을 출발 전에 정해야 합니다.'
  const trailheads = courses
    .map(course => course.trailhead?.trim())
    .filter((value): value is string => Boolean(value))
    .filter((value, index, arr) => arr.indexOf(value) === index)
    .slice(0, 4)

  const intro = `${mountain.name}은 ${region || '국내'}에 자리한 해발 ${elevation} 산입니다. ${identity} 산행 계획은 정상 이름만 보고 고르기보다 들머리, 누적 오르막, 하산 교통, 계절 통제 가능성을 함께 보는 방식이 정확합니다.`

  return {
    intro,
    highlights: [
      {
        title: '산세와 볼거리',
        tone: 'forest',
        body: `${mountainRegionCharacter(mountain)} ${mountain.description ? '기본 설명만으로는 부족하므로 조망, 계곡, 사찰, 숲길 중 이번 산행의 우선순위를 먼저 정하세요.' : '현장 탐방 전 지자체와 공식 탐방 안내를 함께 확인하는 편이 좋습니다.'} 해발 ${elevation} 기준으로 봄·가을은 일교차, 여름은 습도와 물 소모, 겨울은 그늘 결빙을 각각 따로 계산해야 합니다. 사진 목적이면 능선과 전망 지점을, 동행자 배려가 우선이면 계곡·숲길·사찰 주변처럼 중간에 쉴 수 있는 구간을 먼저 고르는 방식이 좋습니다.`,
      },
      {
        title: '코스 선택 기준',
        tone: 'clay',
        body: courses.length > 0
          ? `${mountain.name}에는 현재 ${courses.length}개 코스 데이터가 있으며, ${courseRangeText(courses)}. ${shortest ? `처음이라면 ${shortName(shortest)}처럼 짧은 코스를 기준으로 보고,` : '처음이라면 짧은 원점회귀를 기준으로 보고,'} ${hardest ? `${shortName(hardest)}처럼 난이도 ${normalizeDifficulty(hardest.diff_norm)}로 잡힌 코스는 날씨가 나쁘면 한 단계 더 어렵게 판단하세요.` : '난이도 수치가 부족한 코스는 현장 경사와 하산 시간을 더 보수적으로 잡으세요.'} ${diffPlanning}`
          : `${mountain.name}은 현재 공개 코스 수치가 부족한 산입니다. 정상 완등을 먼저 정하기보다 공식 안내소, 산림청·국립공원·지자체 공지, 현장 이정표를 확인한 뒤 짧은 왕복 동선부터 잡는 편이 안전합니다. 코스명이 비슷해도 실제 들머리와 주차 위치가 다를 수 있으므로 지도 앱 목적지와 현장 탐방로 입구를 따로 확인하세요.`,
      },
      {
        title: '시간과 체력 배분',
        tone: 'sky',
        body: stats.maxDuration > 0
          ? `상행 기준 최대 ${formatDuration(stats.maxDuration)}까지 잡히는 코스가 있어 휴식, 사진 촬영, 식사, 하산 시간을 별도로 더해야 합니다. ${longest ? `긴 코스는 ${shortName(longest)} 기준 ${formatDistance(longest.distance)} 안팎으로 보되,` : '긴 코스는 거리보다 누적 오르막을 우선 보되,'} 일몰 2시간 전에는 하산 흐름에 들어가는 계획이 안정적입니다. 초반 30분에 숨이 차면 전체 속도를 낮추고, 정상 직전보다 하산 후반의 집중력 저하를 더 크게 잡아야 사고 위험을 줄일 수 있습니다.`
          : '소요시간 수치가 부족하므로 오전 출발, 중간 반환 지점, 일몰 전 하산을 기본값으로 두세요. 산행 앱 기록은 개인 속도 차이가 크기 때문에 공식 탐방 시간과 현장 표지를 함께 보는 편이 안전합니다. 초보자는 정상 도착 시각보다 하산 시작 시각을 먼저 정하고, 물과 간식은 돌아오는 길까지 남기는 방식으로 배분하세요.',
      },
      {
        title: '교통·통제·현장 변수',
        tone: 'forest',
        body: `${stats.hasTransit ? '대중교통 접근 표시가 있는 코스가 있으나 배차와 막차는 계절·요일별로 달라집니다.' : '대중교통 정보가 제한적이므로 자가용, 택시, 산악회 버스, 하산 후 차량 회수까지 함께 계산해야 합니다.'} ${trailheads.length > 0 ? `확인된 주요 들머리는 ${trailheads.join(', ')}입니다.` : '들머리 정보가 부족한 산은 내비게이션 목적지와 실제 탐방로 입구가 다를 수 있습니다.'} 국립공원·군립공원·지자체 관리 구역은 낙석, 산불예방, 해빙기, 기상특보에 따라 탐방로가 바뀔 수 있습니다. 특히 비 온 뒤 계곡길, 겨울 북사면, 단풍철 혼잡 구간은 같은 거리라도 소요시간이 늘어나므로 현장 공지를 최종 기준으로 삼으세요.`,
      },
    ],
    sourceNote: '산림청 100대 명산, 국립공원공단 탐방로·예약 안내, 지자체 탐방 공지와 현장 이정표를 함께 확인하는 전제로 정리했습니다.',
    sources: getMountainOfficialSources(mountain.name),
  }
}

export function buildMountainSummary(mountain: Mountain, courses: Course[]) {
  const fallback = courses.length === 0 ? getMountainFallbackGuide(mountain.name) : undefined
  if (fallback) return fallback.summary

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
  const fallback = courses.length === 0 ? getMountainFallbackGuide(mountain.name) : undefined
  if (fallback) return fallback.fits

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
  const fallback = courses.length === 0 ? getMountainFallbackGuide(mountain.name) : undefined
  if (fallback) {
    return {
      title: `${mountain.name} 교통·주차·들머리 확인`,
      body: fallback.access.body,
      trailheads: fallback.access.trailheads,
    }
  }

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

export function buildFallbackRisks(mountain: Mountain, courses: Course[]) {
  if (courses.length > 0) return []
  return getMountainFallbackGuide(mountain.name)?.risks ?? []
}
