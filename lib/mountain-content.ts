import type { Course, Mountain } from './db/schema'

export type MountainDifficulty = '하' | '중' | '상' | '매우상'

type MountainFallbackGuide = {
  summary: string[]
  fits: { title: string; body: string }[]
  access: { body: string; trailheads: string[] }
  risks?: string[]
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
