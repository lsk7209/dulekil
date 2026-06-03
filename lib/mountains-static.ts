/**
 * 홈 페이지용 정적 산 데이터 (DB 수집 완료 전 임시)
 * P4 단계에서 Turso DB 쿼리로 교체 예정
 */

export interface StaticMountain {
  id: string
  name: string
  peak: string
  region: string
  group: string
  elev: number
  dist: number
  diff: '하' | '중' | '상' | '매우상'
  time: string
  gpx: boolean
  seasons: string[]
  transit: boolean
  transitNote: string
  pop: number
  beginner: boolean
  sun: boolean
  pal: string
  tags: string[]
}

export const DIFF_META: Record<string, { cls: string; order: number }> = {
  '하':    { cls: 'low',  order: 1 },
  '중':    { cls: 'mid',  order: 2 },
  '상':    { cls: 'high', order: 3 },
  '매우상': { cls: 'max',  order: 4 },
}

export const MOUNTAINS: StaticMountain[] = [
  { id:'seorak',   name:'설악산',   peak:'대청봉',   region:'강원 속초·인제', group:'강원',  elev:1708, dist:18.4, diff:'매우상', time:'9:30',  gpx:true,  seasons:['겨울','가을'], transit:true,  transitNote:'속초시외터미널 → 설악동 버스 20분', pop:98, beginner:false, sun:true,  pal:'winter', tags:['눈꽃','일출 명소'] },
  { id:'bukhan',   name:'북한산',   peak:'백운대',   region:'서울·경기 고양', group:'수도권', elev:836,  dist:8.6,  diff:'상',    time:'4:40',  gpx:true,  seasons:['가을','봄'],   transit:true,  transitNote:'3호선 구파발역 → 버스 10분',       pop:99, beginner:false, sun:false, pal:'forest', tags:['도심 근교','화장실 있음'] },
  { id:'jiri',     name:'지리산',   peak:'천왕봉',   region:'경남·전북·전남', group:'영남',  elev:1915, dist:25.5, diff:'매우상', time:'11:00', gpx:true,  seasons:['가을','여름'], transit:false, transitNote:'중산리 주차장 들머리(자가용 권장)', pop:95, beginner:false, sun:true,  pal:'autumn', tags:['종주','일출 명소'] },
  { id:'halla',    name:'한라산',   peak:'백록담',   region:'제주',          group:'제주',  elev:1947, dist:19.2, diff:'상',    time:'8:00',  gpx:true,  seasons:['겨울','봄'],   transit:true,  transitNote:'제주시 → 성판악 버스 40분',        pop:96, beginner:false, sun:false, pal:'winter', tags:['눈꽃','예약 필수'] },
  { id:'gwanak',   name:'관악산',   peak:'연주대',   region:'서울·경기 과천', group:'수도권', elev:632,  dist:6.4,  diff:'중',    time:'3:30',  gpx:true,  seasons:['봄','가을'],   transit:true,  transitNote:'2호선 서울대입구역 도보 12분',     pop:90, beginner:true,  sun:false, pal:'sage',   tags:['대중교통','조망'] },
  { id:'dobong',   name:'도봉산',   peak:'자운봉',   region:'서울·경기 의정부',group:'수도권', elev:740,  dist:7.2,  diff:'상',    time:'4:10',  gpx:true,  seasons:['가을'],        transit:true,  transitNote:'1·7호선 도봉산역 도보 5분',       pop:88, beginner:false, sun:false, pal:'forest', tags:['대중교통','암릉'] },
  { id:'cheonggye',name:'청계산',   peak:'망경대',   region:'서울·경기 성남', group:'수도권', elev:618,  dist:5.8,  diff:'하',    time:'3:00',  gpx:true,  seasons:['봄','여름'],   transit:true,  transitNote:'신분당선 청계산입구역 도보 8분',   pop:86, beginner:true,  sun:false, pal:'sage',   tags:['대중교통','초보'] },
  { id:'sobaek',   name:'소백산',   peak:'비로봉',   region:'충북·경북 단양', group:'충청',  elev:1439, dist:12.6, diff:'중',    time:'6:00',  gpx:true,  seasons:['겨울','봄'],   transit:false, transitNote:'단양 → 천동탐방소(버스 적음)',    pop:84, beginner:false, sun:true,  pal:'winter', tags:['눈꽃','철쭉'] },
  { id:'mudeung',  name:'무등산',   peak:'서석대',   region:'광주',          group:'호남',  elev:1187, dist:11.4, diff:'중',    time:'5:20',  gpx:true,  seasons:['겨울','가을'], transit:true,  transitNote:'광주 시내버스 → 증심사 종점',     pop:85, beginner:false, sun:false, pal:'dawn',   tags:['주상절리','대중교통'] },
  { id:'gaya',     name:'가야산',   peak:'상왕봉',   region:'경남·경북 합천', group:'영남',  elev:1433, dist:10.8, diff:'중',    time:'5:30',  gpx:false, seasons:['가을'],        transit:false, transitNote:'백운동 탐방지원센터 들머리',      pop:78, beginner:false, sun:false, pal:'autumn', tags:['단풍','고찰'] },
  { id:'songni',   name:'속리산',   peak:'문장대',   region:'충북·경북 보은', group:'충청',  elev:1058, dist:9.6,  diff:'중',    time:'5:00',  gpx:true,  seasons:['가을','여름'], transit:false, transitNote:'법주사 주차장 들머리',            pop:80, beginner:false, sun:false, pal:'valley', tags:['계곡','단풍'] },
  { id:'gyeryong', name:'계룡산',   peak:'관음봉',   region:'대전·충남 공주', group:'충청',  elev:845,  dist:8.2,  diff:'중',    time:'4:30',  gpx:true,  seasons:['봄','가을'],   transit:true,  transitNote:'동학사 시내버스 종점 도보',       pop:82, beginner:true,  sun:false, pal:'sage',   tags:['대중교통','능선'] },
  { id:'palgong',  name:'팔공산',   peak:'비로봉',   region:'대구·경북',      group:'영남',  elev:1193, dist:10.2, diff:'상',    time:'5:40',  gpx:true,  seasons:['가을','겨울'], transit:true,  transitNote:'대구 → 동화사 버스',             pop:79, beginner:false, sun:false, pal:'dawn',   tags:['케이블카','조망'] },
  { id:'odae',     name:'오대산',   peak:'비로봉',   region:'강원 평창',      group:'강원',  elev:1563, dist:14.0, diff:'중',    time:'6:30',  gpx:true,  seasons:['가을','겨울'], transit:false, transitNote:'상원사 주차장 들머리',           pop:76, beginner:false, sun:false, pal:'forest', tags:['전나무숲','단풍'] },
  { id:'deokyu',   name:'덕유산',   peak:'향적봉',   region:'전북·경남 무주', group:'호남',  elev:1614, dist:8.0,  diff:'하',    time:'4:00',  gpx:true,  seasons:['겨울'],        transit:false, transitNote:'무주 곤돌라 탑승 가능',          pop:88, beginner:true,  sun:false, pal:'winter', tags:['눈꽃','곤돌라'] },
  { id:'naejang',  name:'내장산',   peak:'신선봉',   region:'전북 정읍',      group:'호남',  elev:763,  dist:7.4,  diff:'하',    time:'3:40',  gpx:true,  seasons:['가을'],        transit:true,  transitNote:'정읍역 → 내장산 버스 30분',      pop:84, beginner:true,  sun:false, pal:'autumn', tags:['단풍 명소','대중교통'] },
]

const SEASON_ICON: Record<string, string> = {
  '겨울': 'snow', '여름': 'sun', '봄': 'flower', '가을': 'leaf',
}
export { SEASON_ICON }
