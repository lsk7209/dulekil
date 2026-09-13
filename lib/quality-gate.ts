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

import { findUnsafeEmergencyContacts } from './content-safety'

const BLOCKED_PUBLIC_SAFETY_PATTERNS: ReadonlyArray<{ id: string; pattern: RegExp }> = [
  { id: 'unverified-rescue-number', pattern: /산악구조대\s*1588-3018/i },
  { id: 'fixed-rainfall-go-no-go', pattern: /시간당\s*\d+(?:\.\d+)?\s*mm[^.]{0,80}(?:산행\s*가능|취소)/i },
  { id: 'fixed-fitness-turnaround', pattern: /체력의\s*\d+\s*%\s*수준에서\s*돌아/i },
  { id: 'fixed-beginner-distance-elevation', pattern: /초보자[^.]{0,80}(?:\d+(?:\.\d+)?\s*km|고도차\s*\d+\s*m)[^.]{0,80}(?:시작|기준)/i },
  { id: 'fixed-hiking-time-formula', pattern: /거리\s*\(km\)\s*[×x]\s*\d+분[^.]{0,100}고도상승/i },
  { id: 'fixed-hydration-formula', pattern: /(?:물은\s*)?\d+\s*mL[^.]{0,80}(?:총\s*소요시간|시간당|적정량)/i },
  { id: 'unverified-fitness-percentile', pattern: /체력\s*상위\s*\d+\s*%/i },
  { id: 'false-119-ambulance-fee', pattern: /119[^.]{0,120}구급차[^.]{0,120}(?:기본\s*45,?000원|km당\s*900원|이용\s*요금이\s*발생)/i },
  { id: 'prescriptive-salt-capsule-dose', pattern: /(?:매\s*시간|시간당|\d+시간[^.]{0,40})(?:[^.]{0,100})소금\s*캡슐\s*\d+개/i },
  { id: 'mandatory-electrolyte-dose', pattern: /(?:반드시\s*전해질|전문가들은\s*1시간에\s*물\s*\d+\s*ml\s*\+\s*나트륨)/i },
  { id: 'fixed-injury-heat-switch', pattern: /부상\s*후\s*48시간[^.]{0,80}(?:냉각|냉찜질)[^.]{0,80}온찜질로\s*전환/i },
  { id: 'pain-score-self-evacuation', pattern: /통증이?\s*\d+점[^.]{0,100}(?:하산을\s*시도|구조\s*요청)/i },
  { id: 'dangerous-slide-collision', pattern: /미끄럼[^.]{0,160}(?:큰\s*나무|바위)[^.]{0,80}(?:향해|충격을\s*분산)/i },
  { id: 'pole-slide-arrest', pattern: /(?:두\s*폴|트레킹\s*폴)[^.]{0,100}(?:강하게|힘껏)[^.]{0,80}(?:제동|멈추)/i },
  { id: 'prescriptive-altitude-ibuprofen', pattern: /(?:고산증|고도\s*적응)[^.]{0,160}이부프로펜\s*\d+\s*mg[^.]{0,100}(?:\d+시간마다|예방\s*복용)/i },
  { id: 'domestic-altitude-self-medication', pattern: /국내\s*산행[^.]{0,140}이부프로펜[^.]{0,100}(?:증상\s*관리|복용)/i },
  { id: 'fixed-altitude-water-dose', pattern: /(?:고산증|고도\s*적응)[^.]{0,140}하루\s*\d+\s*(?:~|～|에서)\s*\d+\s*(?:L|리터)/i },
  { id: 'fixed-cardiac-hike-clearance', pattern: /(?:수축기\s*혈압|당일[^.]{0,30}혈압)[^.]{0,100}\d+\s*mmHg[^.]{0,120}(?:등산\s*가능|산행|하산)/i },
  { id: 'prescriptive-hiking-nitroglycerin', pattern: /(?:등산|산행)[^.]{0,200}(?:흉통|흉부\s*압박감)[^.]{0,160}니트로글리세린[^.]{0,80}(?:설하\s*투여|복용)/i },
  { id: 'fixed-cardiac-hydration-schedule', pattern: /(?:혈압약|이뇨제)[^.]{0,180}(?:\d+분마다\s*\d+\s*(?:~|～|에서)\s*\d+\s*ml|시간당\s*\d+\s*ml)/i },
  { id: 'field-hyponatremia-salt-treatment', pattern: /저나트륨(?:혈증)?\s*(?:의심|가능성)[^.]{0,180}(?:소금|전해질\s*음료)[^.]{0,120}(?:섭취|먹)[^.]{0,100}(?:관찰|하산)/i },
  { id: 'fixed-salt-water-mixture', pattern: /소금\s*\d+(?:\.\d+)?\s*(?:~|～|에서)\s*\d+(?:\.\d+)?\s*g[^.]{0,100}물\s*\d+\s*ml/i },
  { id: 'field-hydration-self-diagnosis', pattern: /(?:소변\s*색[^.]{0,100}저나트륨(?:혈증)?\s*가능성|손등\s*피부[^.]{0,100}\d+초[^.]{0,80}탈수)/i },
  { id: 'fixed-backpack-body-percent', pattern: /배낭[^.]{0,140}체중의\s*\d+\s*%\s*이하[^.]{0,100}(?:적정|권장|기준)/i },
  { id: 'fixed-back-pain-heat-switch', pattern: /(?:허리\s*통증|요통)[^.]{0,180}(?:\d+시간[^.]{0,80})온(?:열\s*)?찜질로\s*전환/i },
  { id: 'prescriptive-back-pain-ibuprofen-dose', pattern: /(?:허리\s*통증|요통|근육통)[^.]{0,220}이부프로펜\s*\d+\s*mg[^.]{0,100}(?:복용|도움)/i },
  { id: 'unsupported-backpack-biomechanics-stat', pattern: /등산[^.]{0,160}허리\s*통증[^.]{0,120}\d+\s*%[^.]{0,140}(?:배낭|무게\s*배분)/i },
  { id: 'urine-color-hike-go-no-go', pattern: /소변\s*색[^.]{0,160}(?:진행|산행)[^.]{0,100}(?:하산|계속|중단)/i },
  { id: 'dehydration-first-headache-diagnosis', pattern: /(?:탈수\s*증상|탈수\s*두통)[^.<]{0,120}먼저\s*보/i },
  { id: 'heat-illness-delayed-descent', pattern: /(?:두통|어지럼)[^.]{0,100}(?:소변\s*색)[^.]{0,120}(?:진행|하산|대체\s*코스)/i },
  { id: 'fixed-post-hike-anabolic-window', pattern: /(?:하산|운동)[^.]{0,100}30분\s*(?:이내|직후)[^.]{0,160}(?:단백질\s*합성\s*창|단백질\s*\d+\s*(?:~|～)\s*\d+\s*g)/i },
  { id: 'fixed-contrast-bath-protocol', pattern: /냉수\s*\(?(?:10\s*(?:~|～)\s*15)\s*°?C?\)?[^.]{0,100}온수\s*\(?(?:38\s*(?:~|～)\s*40)\s*°?C?\)?[^.]{0,100}(?:3\s*(?:~|～)\s*5회|반복)/i },
  { id: 'lactate-clearance-recovery-claim', pattern: /(?:능동적\s*회복|가벼운\s*유산소)[^.]{0,160}젖산\s*제거[^.]{0,80}\d+\s*%/i },
  { id: 'fixed-soreness-return-delay', pattern: /통증이\s*완전히\s*사라진[^.]{0,100}최소\s*\d+\s*(?:~|～)\s*\d+일[^.]{0,80}(?:회복|산행)/i },
  { id: 'headache-hydration-first', pattern: /(?:산행\s*중\s*)?두통[^.<]{0,140}(?:수분\s*보충|물을?\s*마시)[^.<]{0,80}(?:가장\s*먼저|우선|출발점)/i },
  { id: 'fixed-headache-descent-clock', pattern: /두통[^.]{0,220}오후\s*\d+시\s*이후[^.]{0,100}(?:산\s*위|하산)/i },
  { id: 'false-no-sweat-heatstroke-test', pattern: /(?:땀이\s*없으면|땀이\s*나지\s*않)[^.]{0,100}열사병/i },
  { id: 'fixed-heatstroke-temperature-trigger', pattern: /체온\s*38\s*°?C?\s*이상[^.]{0,100}(?:위험\s*경보|열사병|119)/i },
  { id: 'delayed-heat-illness-emergency-call', pattern: /열탈진[^.]{0,180}(?:냉각\s*후\s*)?30분\s*(?:내|이내)[^.]{0,100}(?:개선|호전)[^.]{0,80}(?:신고|119)/i },
  { id: 'fixed-post-heatstroke-return-ban', pattern: /열사병[^.]{0,180}최소\s*\d+\s*(?:~|～)\s*\d+주[^.]{0,120}(?:운동|폭염\s*노출|피)/i },
  { id: 'fixed-summer-hike-water-start-time', pattern: /여름\s*산행[^.]{0,180}(?:오전\s*\d+시\s*이전\s*출발|차가운\s*물\s*최소\s*\d+\s*리터)/i },
  { id: 'fixed-frostbite-weather-threshold', pattern: /(?:기온|체감\s*온도)[^.]{0,80}영하\s*\d+\s*°?C?\s*이하[^.]{0,100}동상\s*위험[^.]{0,80}(?:급격|높아)/i },
  { id: 'unsupported-wet-glove-frostbite-multiplier', pattern: /젖은\s*장갑[^.]{0,140}(?:열\s*손실|동상\s*위험)[^.]{0,80}\d+배/i },
  { id: 'field-frostbite-grade-treatment', pattern: /(?:1도|2도)[^.]{0,120}동상[^.]{0,160}(?:현장\s*처치|병원\s*이동|온수\s*담금)/i },
  { id: 'fixed-frostbite-rewarming-protocol', pattern: /(?:동상|환부)[^.]{0,180}39\s*(?:~|～)\s*42\s*°?C?[^.]{0,100}20\s*(?:~|～)\s*30분/i },
  { id: 'categorical-frostbite-layer-rule', pattern: /(?:방수\s*등산\s*양말\s*이중\s*착용|면\s*소재\s*양말[^.]{0,80}보온\s*기능이\s*0|내부\s*장갑[^.]{0,80}외부\s*장갑[^.]{0,80}이중\s*착용)/i },
  { id: 'unsupported-hypothermia-statistic', pattern: /(?:저체온증|동결)[^.]{0,120}(?:사망\s*원인|사망)[^.]{0,100}15\s*(?:~|～)\s*20\s*%/i },
  { id: 'field-hypothermia-temperature-staging', pattern: /(?:경증|중등도|중증)[^.]{0,100}(?:32\s*(?:~|～)\s*35|28\s*(?:~|～)\s*32|28\s*°?C?\s*미만)[^.]{0,160}(?:저체온|단계|분류)/i },
  { id: 'delayed-hypothermia-emergency-call', pattern: /(?:중등도\s*이상[^.]{0,100}119|경증[^.]{0,120}(?:호전|개선)[^.]{0,60}119)/i },
  { id: 'unsupported-foil-blanket-performance', pattern: /(?:은박\s*담요|서바이벌\s*블랭킷)[^.]{0,180}(?:40\s*(?:~|～)\s*50\s*%|90\s*%)[^.]{0,100}(?:복사열|반사|체온)/i },
  { id: 'fixed-hypothermia-drink-or-layer-rule', pattern: /(?:보온병[^.]{0,100}60\s*°?C?\s*이상|레이어링[^.]{0,160}30\s*(?:~|～)\s*40\s*%|면\s*절대\s*금지)/i },
  { id: 'rhabdo-dark-urine-only-test', pattern: /(?:소변\s*색\s*변화|콜라색[^.]{0,40}소변)[^.]{0,120}(?:만\s*있어도|가장\s*(?:직접적|중요한)\s*(?:징후|구분\s*신호))/i },
  { id: 'fixed-post-hike-care-delay', pattern: /(?:부종|저림|감각\s*이상|근육통)[^.]{0,140}(?:24|48|72)시간\s*이상[^.]{0,100}(?:병원|방문|진료)/i },
  { id: 'fixed-post-hike-protein-recovery', pattern: /(?:근육통|회복)[^.]{0,140}(?:3\s*(?:~|～)\s*5일)[^.]{0,120}단백질[^.]{0,80}1\.2\s*(?:~|～)\s*1\.5\s*g/i },
  { id: 'fixed-sprain-return-timeline', pattern: /(?:부분\s*파열|2도\s*염좌)[^.]{0,100}(?:최소\s*)?2\s*(?:~|～)\s*4주[^.]{0,140}(?:완전\s*파열|3도\s*염좌)[^.]{0,100}3\s*(?:~|～)\s*6개월/i },
  { id: 'headache-water-response-diagnosis', pattern: /(?:탈수[^.]{0,50})?두통[^.]{0,160}수분\s*섭취[^.]{0,80}30분\s*이내\s*호전/i },
  { id: 'fixed-tick-fever-eschar-gate', pattern: /(?:야외활동|산행)[^.]{0,180}2주\s*이내[^.]{0,100}38\s*°?C?\s*이상\s*발열[^.]{0,120}(?:딱지|발진)[^.]{0,100}(?:즉시\s*)?(?:방문|진료)/i },
  { id: 'exhaustion-sugar-first-diagnosis', pattern: /(?:탈진\s*직후|탈진[^.]{0,80}가장\s*먼저)[^.]{0,100}(?:당\s*보충|포도당|에너지젤)/i },
  { id: 'fixed-emergency-food-response-table', pattern: /(?:포도당\s*(?:정제|젤리)|에너지젤)[^.]{0,100}(?:5\s*(?:~|～)\s*10분|10\s*(?:~|～)\s*15분)[^.]{0,120}(?:효과|흡수)/i },
  { id: 'fixed-emergency-food-calories', pattern: /(?:비상식|에너지젤)[^.]{0,140}(?:1회\s*섭취\s*기준\s*)?200\s*kcal[^.]{0,120}(?:기준|보충|항상)/i },
  { id: 'fixed-exhaustion-food-water-schedule', pattern: /(?:탈진\s*즉시|0분)[^.]{0,100}(?:물\s*)?200\s*(?:~|～)\s*300\s*ml[^.]{0,180}(?:10\s*(?:~|～)\s*15분|20분)/i },
  { id: 'delayed-exhaustion-rescue', pattern: /(?:20분\s*휴식)[^.]{0,160}(?:추가\s*30분\s*휴식)[^.]{0,120}(?:구조\s*요청|119)/i },
  { id: 'mandatory-sugar-with-water-exhaustion', pattern: /(?:물만[^.]{0,160}저나트륨혈증|반드시\s*당분[^.]{0,80}함께\s*수분\s*보충)/i },
  { id: 'fixed-trail-snack-schedule', pattern: /(?:탈진\s*예방|행동식)[^.]{0,120}2시간마다\s*100\s*(?:~|～)\s*150\s*kcal/i },
  { id: 'fixed-general-hiking-hydration-rate', pattern: /(?:산행\s*중\s*)?(?:권장\s*)?수분\s*섭취량[^.]{0,100}시간당\s*500\s*(?:~|～)\s*750\s*ml/i },
  { id: 'fixed-hot-weather-hydration-rate', pattern: /(?:30\s*°?C?\s*이상|30°C\+|고습도)[^.]{0,120}750\s*(?:~|～)\s*1,?000\s*ml/i },
  { id: 'fixed-hydration-preload', pattern: /출발\s*1\s*(?:~|～)\s*2시간\s*전[^.]{0,100}400\s*(?:~|～)\s*500\s*ml/i },
  { id: 'fixed-hike-water-total', pattern: /6시간\s*산행[^.]{0,100}(?:최소\s*3L|3\.5\s*(?:~|～)\s*4L)/i },
  { id: 'unsupported-dehydration-performance-percent', pattern: /체중의\s*2%[^.]{0,120}지구력[^.]{0,60}20%/i },
  { id: 'thirst-lag-dehydration-diagnosis', pattern: /갈증[^.]{0,120}(?:이미\s*)?체중의\s*1\.5\s*(?:~|～)\s*2%[^.]{0,80}탈수/i },
  { id: 'false-low-temperature-heatstroke-trigger', pattern: /열사병[^.]{0,160}체온\s*38\.5\s*°?C?\s*이상[^.]{0,100}(?:발한\s*감소|피부\s*건조)/i },
  { id: 'mandatory-duration-electrolyte-rule', pattern: /(?:3|4)시간\s*이상\s*산행[^.]{0,140}(?:전해질\s*보충이\s*필요|전해질\s*음료로\s*대체)/i },
  { id: 'fixed-mountain-stream-rise-rate', pattern: /시간당\s*(?:20|30)\s*mm[^.]{0,160}(?:수위[^.]{0,40}(?:20\s*(?:~|～)\s*40cm|급격)|30분\s*이내)/i },
  { id: 'fixed-stream-velocity-crossing-rule', pattern: /유속[^.]{0,80}초속\s*(?:2|3)m[^.]{0,100}(?:도강|이동|서\s*있기)/i },
  { id: 'fixed-flood-vertical-distance', pattern: /계곡[^.]{0,100}(?:최소\s*)?30m\s*이상[^.]{0,100}(?:높은|사면|이동)/i },
  { id: 'fixed-post-rain-crossing-wait', pattern: /강수[^.]{0,100}멈춘\s*후[^.]{0,80}(?:최소\s*)?2\s*(?:~|～)\s*3시간[^.]{0,100}(?:안정|도강|기다)/i },
  { id: 'fixed-flood-go-no-go-rainfall', pattern: /(?:강수\s*확률\s*50%|시간당[^.]{0,30}20mm|전날\s*150mm)[^.]{0,140}(?:취소|변경|원칙)/i },
  { id: 'universal-ridge-flood-safety', pattern: /(?:계곡[^.]{0,100})?능선[^.]{0,100}(?:물이\s*집중되지\s*않|구조\s*헬기[^.]{0,40}용이)[^.]{0,80}(?:선택|안전)/i },
  { id: 'fixed-five-minute-stream-monitoring', pattern: /(?:계곡\s*수위|수위)[^.]{0,100}5분\s*(?:간격|안)[^.]{0,100}(?:비교|변)/i },
  { id: 'rainfall-warning-equals-stream-threshold', pattern: /기상\s*특보[^.]{0,120}시간당\s*30mm[^.]{0,160}(?:계곡\s*수위|임계값)[^.]{0,80}일치/i },
  { id: 'move-before-119-call', pattern: /(?:가장\s*먼저|1단계)[^.]{0,140}(?:신고가\s*아니라|신고\s*전)[^.]{0,120}(?:안전한\s*위치|장소)\s*확보/i },
  { id: 'move-injured-to-rock-or-trail', pattern: /(?:부상|부상자)[^.]{0,180}(?:평지|넓은\s*바위|등산로\s*중앙)[^.]{0,100}(?:이동|나온)[^.]{0,80}(?:신고|119)/i },
  { id: 'unsupported-mountain-rescue-response-time', pattern: /산악\s*구조[^.]{0,160}(?:평균\s*62분|2\s*(?:~|～)\s*3배)[^.]{0,120}(?:도착|시간|지연)/i },
  { id: 'fixed-emergency-location-accuracy', pattern: /(?:국가지점번호|GPS\s*좌표)[^.<]{0,100}(?:100m\s*격자|10\s*(?:~|～)\s*20m|오차\s*500m\s*(?:~|～)\s*1km)/i },
  { id: 'fixed-whistle-rescue-signal', pattern: /호루라기[^.]{0,100}3번\s*연속[^.]{0,100}(?:국제\s*조난\s*신호|수백\s*미터)/i },
  { id: 'unverified-119-smart-report-app', pattern: /(?:119\s*스마트\s*신고|소방청\s*119신고)\s*앱[^.]{0,160}(?:GPS|사진|자동\s*첨부|직접\s*전송)/i },
  { id: 'fixed-device-sos-button-sequence', pattern: /(?:아이폰|삼성)[^.]{0,100}(?:전원|측면)\s*버튼[^.]{0,60}(?:3회|5번)/i },
  { id: 'prescriptive-helicopter-approach-position', pattern: /헬기\s*접근[^.]{0,140}(?:나무\s*아래|바위\s*뒤)[^.]{0,80}(?:몸을\s*낮추|신호)/i },
  { id: 'unsupported-mountain-accident-breakdown', pattern: /(?:산악사고|산악\s*사고)[^.]{0,180}(?:9,?000\s*(?:~|～)\s*10,?000건|실족[^.]{0,30}35%|길\s*잃음[^.]{0,30}25%|탈진[^.]{0,30}15%)/i },
  { id: 'unsupported-accident-preventability-rate', pattern: /(?:예방\s*가능한\s*원인|사전\s*준비[^.]{0,80}예방)[^.]{0,100}(?:75%|80%)/i },
  { id: 'fixed-solo-rescue-delay', pattern: /혼자\s*실족[^.]{0,160}평균\s*2\s*(?:~|～)\s*3시간[^.]{0,80}(?:더\s*걸|지연)/i },
  { id: 'fixed-sunset-hike-timetable', pattern: /일몰[^.]{0,120}(?:2시간\s*전|오후\s*3시\s*30분|오후\s*5시\s*30분)[^.]{0,120}(?:하산|기준|시작)/i },
  { id: 'fixed-hiking-food-interval', pattern: /행동식[^.]{0,120}2시간\s*간격[^.]{0,100}(?:섭취|혈당)/i },
  { id: 'fixed-cardinal-cloud-weather-signal', pattern: /서쪽\s*방향\s*구름[^.]{0,120}(?:기상\s*악화\s*신호|받아들)/i },
  { id: 'unsupported-trail-loss-percent', pattern: /산악구조\s*사례[^.]{0,100}25%[^.]{0,120}길\s*잃음/i },
  { id: 'fixed-hiking-fitness-turnaround-percent', pattern: /(?:체력이?\s*60%\s*이상\s*소모|오르는\s*데\s*쓴\s*체력의\s*60\s*(?:~|～)\s*70%|50%\s*체력\s*소모)[^.]{0,100}(?:하산|필요)/i },
  { id: 'unsupported-lost-hiker-statistics', pattern: /(?:조난|실족·추락)[^.]{0,180}(?:23%|36%|약\s*8,?000건|2시간\s*48분|1시간\s*22분|6km\s*이상[^.]{0,40}62%)/i },
  { id: 'guaranteed-first-five-minute-rescue', pattern: /(?:조난\s*직후\s*)?첫\s*5분[^.]{0,120}(?:구조\s*시간을\s*결정|행동\s*순서)/i },
  { id: 'fixed-trail-marker-spacing', pattern: /(?:국립공원|등산로)[^.]{0,120}500m마다[^.]{0,80}(?:위치\s*표지판|표지)/i },
  { id: 'guaranteed-sms-emergency-success', pattern: /문자\s*(?:메시지)?[^.]{0,120}통화보다[^.]{0,100}(?:전송\s*성공률|성공)/i },
  { id: 'obsolete-forest-safety-auto-alert', pattern: /산림청\s*국민\s*안심\s*서비스[^.]{0,180}(?:자동|비상연락인|2분)/i },
  { id: 'fixed-rescue-power-bank-capacity', pattern: /보조\s*배터리[^.]{0,100}5,?000mAh\s*이상[^.]{0,80}(?:필수|권장)/i },
  { id: 'guaranteed-light-air-rescue-signal', pattern: /헤드랜턴[^.]{0,160}(?:구조\s*헬기|구조대)[^.]{0,80}(?:위치\s*신호|기능)/i },
  { id: 'fixed-portal-versus-hiking-speed', pattern: /(?:포털|지도\s*앱)[^.]{0,140}(?:5km\/h|40\s*(?:~|～)\s*60%)[^.]{0,140}(?:산|보행|속도)/i },
  { id: 'unsupported-dark-descent-rescue-share', pattern: /(?:구조\s*요청자|현장\s*구조\s*사례)[^.]{0,180}62%[^.]{0,140}(?:어두워|하산)/i },
  { id: 'fixed-naismith-adjustment-percent', pattern: /(?:나이페더|나이스미스|계산값)[^.]{0,220}(?:30\s*(?:~|～)\s*50%|20\s*(?:~|～)\s*30%|30%를\s*더)[^.]{0,100}(?:더|감산|계획)/i },
  { id: 'fixed-descent-ascent-ratio', pattern: /하산\s*시간[^.]{0,100}상행\s*시간의\s*60\s*(?:~|～)\s*70%/i },
  { id: 'unsupported-official-time-match', pattern: /(?:계산값|나이페더)[^.]{0,160}공식\s*소요시간[^.]{0,100}10\s*(?:~|～)\s*20분[^.]{0,80}(?:일치|내외)/i },
  { id: 'fixed-sunset-completion-margin', pattern: /일몰\s*1(?:\.5)?\s*(?:~|～)\s*2시간\s*전[^.]{0,120}하산\s*완료/i },
  { id: 'fixed-weather-time-multiplier', pattern: /(?:풍속|바람)[^.]{0,100}10m\/s[^.]{0,160}(?:20\s*(?:~|～)\s*30%|체력\s*소모가\s*2배)/i },
  { id: 'unsupported-overambitious-course-accident-share', pattern: /(?:탈진|체력\s*고갈)[^.]{0,160}40%\s*이상[^.]{0,140}(?:과도한\s*코스|코스\s*선택)/i },
  { id: 'fixed-elevation-calorie-table', pattern: /(?:표고차\s*)?(?:300m|700m|1,?000m)[^.]{0,160}(?:250kcal|550kcal|800kcal)/i },
  { id: 'fixed-elevation-experience-class', pattern: /(?:300\s*(?:~|～)\s*600m|600\s*(?:~|～)\s*900m)[^.]{0,160}(?:3개월|6개월|상급자)/i },
  { id: 'fixed-beginner-course-time-multiplier', pattern: /(?:초보자|체력이\s*낮은)[^.]{0,140}1\.3\s*(?:~|～)\s*1\.5배/i },
  { id: 'fixed-rock-ridge-duration-or-share', pattern: /암릉[^.]{0,180}(?:30분\s*(?:~|～)\s*1시간|20%\s*이상|20%\s*미만)/i },
  { id: 'fixed-weather-course-go-no-go', pattern: /(?:강수\s*확률\s*30%|바람\s*초속\s*8m)[^.]{0,160}(?:통과|출발|하산|가능)/i },
  { id: 'fixed-rescue-access-multiplier', pattern: /(?:구조대\s*접근|구조\s*소요시간)[^.]{0,180}(?:최대\s*)?2\s*(?:~|～)\s*3배/i },
  { id: 'fixed-rescue-vehicle-access-score', pattern: /(?:구조차|차량)[^.]{0,100}접근\s*가능[^.]{0,100}(?:편도\s*)?1시간\s*이내/i },
  { id: 'mixed-manisan-trailhead-course', pattern: /계단길\s*코스\s*\(함허동천[^)]*참성단\)/i },
  { id: 'fixed-manisan-transit-frequency', pattern: /(?:3000번\s*버스|군내버스)[^.]{0,180}(?:30\s*(?:~|～)\s*40분\s*간격|1일\s*6\s*(?:~|～)\s*8회)/i },
  { id: 'fixed-manisan-taxi-fare', pattern: /(?:강화터미널|마니산)[^.]{0,160}택시[^.]{0,100}12,?000\s*(?:~|～)\s*15,?000원/i },
  { id: 'false-manisan-parking-fee-capacity', pattern: /마니산\s*함허동천\s*주차장[^.]{0,180}(?:1일\s*3,?000원|약\s*300대)/i },
  { id: 'fixed-manisan-sunset-rule', pattern: /마니산[^.]{0,220}(?:일몰\s*1시간\s*전|오후\s*5시\s*30분|오후\s*2시\s*이전)[^.]{0,120}하산/i },
  { id: 'fixed-manisan-trail-measurements', pattern: /(?:계단길|참성단)[^.]{0,160}(?:경사가?\s*30도\s*이상|250m[^.]{0,40}암릉|1시간\s*30분이면)/i },
  { id: 'branded-footwear-safety-guarantee', pattern: /(?:일반\s*운동화[^.]{0,160}마찰력|비브람\s*계열\s*(?:밑창\s*)?등산화[^.]{0,80}(?:강력히|가장\s*적합|권장))/i },
  { id: 'fixed-manisan-crampon-count', pattern: /마니산[^.]{0,200}4발\s*이상\s*아이젠/i },
  { id: 'fixed-palbongsan-late-start-safety', pattern: /팔봉산[^.]{0,240}(?:2\s*(?:~|～)\s*3시간|오후\s*늦게)[^.]{0,140}일몰\s*전[^.]{0,80}(?:안전하게\s*)?하산/i },
  { id: 'fixed-palbongsan-slope-route', pattern: /팔봉산[^.]{0,260}(?:경사\s*40도\s*이상|4\.5km[^.]{0,60}2시간\s*(?:~|～)\s*2시간\s*30분|2\.8km[^.]{0,60}1시간\s*30분)/i },
  { id: 'fixed-palbongsan-rain-drying', pattern: /팔봉산[^.]{0,260}비가\s*온\s*뒤\s*24시간\s*이내/i },
  { id: 'stale-palbongsan-parking-fee', pattern: /팔봉(?:산|유원지)[^.]{0,260}(?:주차요금[^.]{0,50}2,?000원|오전\s*9시\s*이후\s*만차)/i },
  { id: 'fixed-palbongsan-transit', pattern: /(?:서울\s*(?:~|～)\s*홍천|팔봉리\s*방면)[^.]{0,260}(?:06:00부터\s*22:00|30분\s*간격|버스\s*23번|하루\s*6\s*(?:~|～)\s*8회)/i },
  { id: 'stale-palbongsan-entry-fee', pattern: /팔봉유원지[^.]{0,220}(?:입장료[^.]{0,80})?성인\s*기준\s*1,?000원/i },
  { id: 'fixed-palbongsan-season-schedule', pattern: /팔봉산[^.]{0,280}(?:07:00\s*(?:~|～)\s*09:00|11시\s*전|10월\s*20일\s*(?:~|～)\s*11월\s*5일)/i },
  { id: 'fixed-palbongsan-child-camp', pattern: /팔봉산[^.]{0,300}(?:7세\s*이상|사이트\s*수는?\s*약\s*100개|6개월\s*전부터\s*예약)/i },
  { id: 'fixed-capital-ridge-sunset-margin', pattern: /(?:수도권\s*능선|새벽\s*출발)[^.]{0,260}일몰\s*2시간\s*전[^.]{0,100}하산/i },
  { id: 'fixed-capital-ridge-checkpoint-time', pattern: /(?:북한산우이역|능선\s*전체)[^.]{0,240}(?:오전\s*6시\s*40분|오전\s*7시\s*전후|오전\s*10시\s*30분)/i },
  { id: 'fixed-capital-ridge-summit-buffer', pattern: /(?:수도권\s*능선|새벽\s*출발)[^.]{0,300}(?:오후\s*1시\s*이전|90분\s*이상|오후\s*3시\s*이후)/i },
  { id: 'capital-ridge-dawn-safety-ranking', pattern: /당일\s*실패를\s*줄이는\s*기준은\s*새벽\s*출발/i },
  { id: 'capital-ridge-beginner-blanket', pattern: /수도권\s*능선\s*산행은\s*초보도[^?]{0,40}(?:가능|시도)/i },
  { id: 'fixed-capital-ridge-transit-plan', pattern: /첫차\s*도착\s*시간[^.]{0,260}막차[^.]{0,180}(?:후보를\s*2개|한\s*장의\s*메모)/i },
  { id: 'fixed-winter-beginner-turnaround-clock', pattern: /(?:겨울\s*(?:초보|낮은\s*산)|아이젠)[^.]{0,300}(?:정오\s*전후|오후\s*1시[^.]{0,80}1시간\s*이상|오후\s*2시\s*이후|오후\s*3시\s*이후)/i },
  { id: 'fixed-winter-beginner-duration', pattern: /겨울[^.]{0,240}(?:왕복\s*3시간\s*(?:이내|안쪽)|30분\s*지연)[^.]{0,140}(?:초보|위험|좋)/i },
  { id: 'low-mountain-fast-exit-guarantee', pattern: /낮은\s*산[^.]{0,220}(?:문제가\s*생겼을\s*때\s*빨리\s*내려|일몰\s*전\s*복귀\s*가능성이\s*높)/i },
  { id: 'fixed-winter-beginner-sunset-margin', pattern: /(?:겨울\s*낮은\s*산|초보\s*겨울\s*산행)[^.]{0,300}일몰\s*2시간\s*전[^.]{0,100}하산/i },
  { id: 'winter-beginner-blanket-permission', pattern: /겨울\s*낮은\s*산\s*코스[^?]{0,40}초보도[^.]{0,50}가능/i },
  { id: 'fixed-late-start-sunset-margin', pattern: /(?:늦은\s*산행\s*출발|오전\s*10시\s*등산)[^.]{0,320}일몰\s*(?:1|2)시간\s*전[^.]{0,100}하산/i },
  { id: 'fixed-late-start-afternoon-ban', pattern: /(?:늦은\s*산행|해가\s*짧은\s*계절)[^.]{0,260}오후\s*3시\s*이후[^.]{0,100}산\s*위/i },
  { id: 'fixed-late-start-summit-buffer', pattern: /(?:늦은\s*산행|오전\s*10시\s*등산)[^.]{0,320}(?:오후\s*[12]시\s*(?:이전|이후)|90분\s*이상)[^.]{0,120}(?:정상|하산|여유)/i },
  { id: 'late-start-clock-equal-weight', pattern: /오전\s*10시\s*등산[^.]{0,100}일몰\s*하산[^.]{0,100}같은\s*무게/i },
  { id: 'fixed-late-start-checklist-formula', pattern: /들머리\s*도착\s*시각[^.]{0,260}정상\s*목표\s*제한[^.]{0,180}일몰\s*2시간\s*전\s*하산/i },
  { id: 'late-start-nearby-forest-safety', pattern: /(?:오전\s*10시\s*등산|초보\s*산행\s*시간)[^.]{0,260}가까운\s*숲길로\s*바꾸는\s*편이\s*낫/i },
]

export function findBlockedPublicSafetyClaims(text: string): string[] {
  return BLOCKED_PUBLIC_SAFETY_PATTERNS
    .filter(({ pattern }) => pattern.test(text))
    .map(({ id }) => id)
}

export interface SanitizedSafetyHtml {
  html: string
  redactedClaims: number
  ruleIds: string[]
}

function extractLinks(block: string): string {
  return [...block.matchAll(/<a\b[^>]*href=(['"])[^'"]+\1[^>]*>[\s\S]*?<\/a>/gi)]
    .map(match => match[0])
    .join(' ')
}

function safeFactNotice(tag: string, block: string): string {
  const links = extractLinks(block)
  const message = `<strong>검수 전 안전 수치 숨김:</strong> 개인 상태와 현장 조건에 따라 달라지는 고정 수치·난이도 단정은 출처와 사람 검수가 끝날 때까지 표시하지 않습니다. 공식 코스·통제·기상 정보를 확인하세요.${links ? ` 참고 링크: ${links}` : ''}`
  if (tag.toLowerCase() === 'td') return `<td data-safety-claim-redacted="true">${message}</td>`
  return `<${tag} class="safety" data-safety-claim-redacted="true">${message}</${tag}>`
}

export function sanitizeBlockedPublicSafetyHtml(html: string): SanitizedSafetyHtml {
  let redactedClaims = 0
  const ruleIds = new Set<string>()
  const rendered = html.replace(/<(p|li|td|div)(\s[^>]*)?>[\s\S]*?<\/\1>/gi, (block, tag: string) => {
    const matches = findBlockedPublicSafetyClaims(block)
    if (matches.length === 0) return block
    matches.forEach(rule => ruleIds.add(rule))
    redactedClaims += 1
    return safeFactNotice(tag, block)
  })
  return { html: rendered, redactedClaims, ruleIds: [...ruleIds] }
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

  const blockedSafetyClaims = findBlockedPublicSafetyClaims(`${input.title}\n${input.body}`)
  const unsafeEmergencyContacts = findUnsafeEmergencyContacts(`${input.title}\n${input.body}`)
  if (blockedSafetyClaims.length > 0) {
    failures.push(`검증되지 않은 안전 주장: ${blockedSafetyClaims.join(', ')}`)
  }
  if (unsafeEmergencyContacts.length > 0) {
    failures.push(`검증되지 않은 긴급 구조 연락처: ${unsafeEmergencyContacts.join(', ')}`)
  }

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
