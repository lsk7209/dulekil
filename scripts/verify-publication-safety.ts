import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { enhanceArticleBody } from '../lib/article-enhancements'
import { findBlockedPublicSafetyClaims, runQualityGate, sanitizeBlockedPublicSafetyHtml } from '../lib/quality-gate'
import { POSTS } from '../lib/posts'

const guideSource = fs.readFileSync(path.join(process.cwd(), 'app/guide/[slug]/page.tsx'), 'utf8')

assert.equal(guideSource.includes('산악구조대 1588-3018'), false)
assert.deepEqual(findBlockedPublicSafetyClaims(guideSource), [])

const unsafe = runQualityGate({
  title: '산행 안전 안내',
  body: '비상연락처는 산악구조대 1588-3018입니다.',
  unique_points: ['a', 'b', 'c'],
  ai_commentary: '가'.repeat(200),
  faq: Array.from({ length: 3 }, (_, index) => ({ q: `q${index}`, a: '가'.repeat(50) })),
  active_sections: ['안전'],
  has_comparison: true,
  has_safety_block: true,
})

assert.equal(unsafe.passed, false)
assert.match(unsafe.failures.join('\n'), /unverified-rescue-number/)
for (const [claim, rule] of [
  ['초보자는 왕복 6km 이하, 고도차 500m 이하를 기준으로 시작하세요.', 'fixed-beginner-distance-elevation'],
  ['소요시간은 거리(km) × 15분 + 고도상승으로 계산합니다.', 'fixed-hiking-time-formula'],
  ['물은 500mL를 기준으로 총 소요시간에 맞춰 준비하세요.', 'fixed-hydration-formula'],
  ['체력 상위 30% 이상이 기준입니다.', 'unverified-fitness-percentile'],
  ['119 구급차 이송은 기본 45,000원, km당 900원입니다.', 'false-119-ambulance-fee'],
  ['산행 중에는 매 시간 소금 캡슐 1개를 복용합니다.', 'prescriptive-salt-capsule-dose'],
  ['3시간 이상 장거리 산행에서는 반드시 전해질을 함께 보충해야 합니다.', 'mandatory-electrolyte-dose'],
  ['부상 후 48시간이 지나면 냉찜질 대신 온찜질로 전환하세요.', 'fixed-injury-heat-switch'],
  ['통증이 5점 미만이면 하산을 시도할 수 있습니다.', 'pain-score-self-evacuation'],
  ['미끄럼을 멈출 수 없다면 큰 나무나 바위를 향해 충격을 분산하세요.', 'dangerous-slide-collision'],
  ['두 폴을 강하게 지면에 찔러 제동하세요.', 'pole-slide-arrest'],
  ['고산증 예방을 위해 이부프로펜 400mg을 8시간마다 예방 복용하세요.', 'prescriptive-altitude-ibuprofen'],
  ['국내 산행에서는 이부프로펜으로 증상 관리가 가능합니다.', 'domestic-altitude-self-medication'],
  ['고도 적응을 위해 하루 3~4리터를 마시세요.', 'fixed-altitude-water-dose'],
  ['당일 아침 수축기 혈압 140mmHg를 넘으면 산행하지 마세요.', 'fixed-cardiac-hike-clearance'],
  ['산행 중 흉통이 오면 니트로글리세린을 설하 투여하세요.', 'prescriptive-hiking-nitroglycerin'],
  ['이뇨제 혈압약을 복용하면 30분마다 150~200ml를 마시세요.', 'fixed-cardiac-hydration-schedule'],
  ['저나트륨혈증 의심 시 소금을 섭취하고 30분 관찰 후 하산하세요.', 'field-hyponatremia-salt-treatment'],
  ['소금 0.5~1g을 물 500ml에 타서 섭취하세요.', 'fixed-salt-water-mixture'],
  ['소변 색이 맑으면 저나트륨혈증 가능성이 높습니다.', 'field-hydration-self-diagnosis'],
  ['배낭 적정 무게 기준은 체중의 20% 이하가 권장 기준입니다.', 'fixed-backpack-body-percent'],
  ['허리 통증은 24시간 후 온찜질로 전환하세요.', 'fixed-back-pain-heat-switch'],
  ['요통에는 이부프로펜 400mg을 식후 복용하면 도움이 됩니다.', 'prescriptive-back-pain-ibuprofen-dose'],
  ['등산 관련 허리 통증의 68%는 배낭 무게 배분 때문입니다.', 'unsupported-backpack-biomechanics-stat'],
  ['소변 색을 확인해 산행을 계속할지 하산할지 정하세요.', 'urine-color-hike-go-no-go'],
  ['탈수 증상을 먼저 보고 두통과 열탈진을 판단하세요.', 'dehydration-first-headache-diagnosis'],
  ['두통이 생기면 소변 색을 확인한 뒤 진행보다 하산을 검토하세요.', 'heat-illness-delayed-descent'],
  ['하산 직후 30분 이내는 단백질 합성 창이므로 단백질 25~30g을 섭취하세요.', 'fixed-post-hike-anabolic-window'],
  ['냉수 10~15°C와 온수 38~40°C를 3~5회 반복하세요.', 'fixed-contrast-bath-protocol'],
  ['능동적 회복은 젖산 제거를 약 30% 빠르게 합니다.', 'lactate-clearance-recovery-claim'],
  ['통증이 완전히 사라진 뒤 최소 1~2일 회복하고 산행하세요.', 'fixed-soreness-return-delay'],
  ['산행 중 두통은 수분 보충을 가장 먼저 확인하는 것이 출발점입니다.', 'headache-hydration-first'],
  ['두통이 있으면 오후 3시 이후 산 위에 남지 마세요.', 'fixed-headache-descent-clock'],
  ['땀이 없으면 열사병으로 판단하세요.', 'false-no-sweat-heatstroke-test'],
  ['체온 38°C 이상이면 위험 경보로 판단하고 119에 신고하세요.', 'fixed-heatstroke-temperature-trigger'],
  ['열탈진은 냉각 후 30분 이내 개선되지 않으면 119에 신고하세요.', 'delayed-heat-illness-emergency-call'],
  ['열사병 회복 후 최소 2~4주간 폭염 노출과 운동을 피하세요.', 'fixed-post-heatstroke-return-ban'],
  ['여름 산행은 오전 6시 이전 출발하고 차가운 물 최소 2리터를 준비하세요.', 'fixed-summer-hike-water-start-time'],
  ['체감 온도 영하 10°C 이하부터 동상 위험이 급격히 높아집니다.', 'fixed-frostbite-weather-threshold'],
  ['젖은 장갑은 동상 위험이 5배 높습니다.', 'unsupported-wet-glove-frostbite-multiplier'],
  ['2도 동상은 온수 담금 현장 처치 후 병원 이동이 필요합니다.', 'field-frostbite-grade-treatment'],
  ['동상 환부를 39~42°C 물에 20~30분 담그세요.', 'fixed-frostbite-rewarming-protocol'],
  ['내부 장갑과 외부 장갑을 이중 착용하고 방수 등산 양말도 이중 착용하세요.', 'categorical-frostbite-layer-rule'],
  ['저체온증은 겨울 산악 사망 원인의 15~20%입니다.', 'unsupported-hypothermia-statistic'],
  ['경증 32~35°C, 중등도 28~32°C, 중증 28°C 미만으로 저체온증 단계를 분류합니다.', 'field-hypothermia-temperature-staging'],
  ['중등도 이상이면 119에 신고하고 경증은 호전되지 않을 때 119에 신고합니다.', 'delayed-hypothermia-emergency-call'],
  ['은박 담요는 복사열의 90%를 반사합니다.', 'unsupported-foil-blanket-performance'],
  ['보온병은 60°C 이상으로 준비하고 면은 절대 금지입니다.', 'fixed-hypothermia-drink-or-layer-rule'],
  ['콜라색 소변은 횡문근융해증의 가장 중요한 구분 신호입니다.', 'rhabdo-dark-urine-only-test'],
  ['부종이 24시간 이상 지속되면 병원을 방문하세요.', 'fixed-post-hike-care-delay'],
  ['근육통은 3~5일 동안 체중 1kg당 단백질 1.2~1.5g으로 회복합니다.', 'fixed-post-hike-protein-recovery'],
  ['부분 파열은 최소 2~4주, 완전 파열은 3~6개월 뒤 복귀합니다.', 'fixed-sprain-return-timeline'],
  ['탈수 두통은 수분 섭취 후 30분 이내 호전됩니다.', 'headache-water-response-diagnosis'],
  ['산행 후 2주 이내 38°C 이상 발열과 딱지가 있으면 진료받으세요.', 'fixed-tick-fever-eschar-gate'],
  ['탈진 직후 가장 먼저 해야 할 것은 당 보충입니다.', 'exhaustion-sugar-first-diagnosis'],
  ['포도당 젤리는 5~10분 안에 흡수되어 효과가 나타납니다.', 'fixed-emergency-food-response-table'],
  ['비상식은 1회 섭취 기준 200kcal를 기준으로 준비하세요.', 'fixed-emergency-food-calories'],
  ['탈진 즉시 물 200~300ml를 마시고 10~15분 후 간식, 20분 후 재출발하세요.', 'fixed-exhaustion-food-water-schedule'],
  ['20분 휴식 후 회복되지 않으면 추가 30분 휴식 뒤 구조 요청을 고려하세요.', 'delayed-exhaustion-rescue'],
  ['물만 마시면 저나트륨혈증이 생기므로 반드시 당분과 함께 수분 보충하세요.', 'mandatory-sugar-with-water-exhaustion'],
  ['탈진 예방을 위해 2시간마다 100~150kcal 행동식을 먹으세요.', 'fixed-trail-snack-schedule'],
] as const) assert.ok(findBlockedPublicSafetyClaims(claim).includes(rule), rule)

// p275 is intentionally filtered from the public POSTS set until it meets the
// publication threshold. Guard the raw source as well so a future rewrite or
// filter change cannot reintroduce the incorrect fee claim.
const postsSource = fs.readFileSync(path.join(process.cwd(), 'lib/posts.ts'), 'utf8')
const rescueCostSource = postsSource.match(/id: 'p275',[\s\S]*?\n\s*},/)?.[0]
assert.ok(rescueCostSource, 'p275 source missing')
assert.match(rescueCostSource, /119 구급차는 이용자에게 별도 이송료를 청구하지 않는 것으로 안내/)
assert.match(rescueCostSource, /119\.busan\.go\.kr\/gangseo\/119gsaler01\/129623/)
assert.doesNotMatch(rescueCostSource, /기본\s*45,?000원|km당\s*900원|50만~500만 원|8,742건|1,247건/)

const electrolytePost = POSTS.find(post => post.id === 'p261')
assert.ok(electrolytePost, 'p261 public rewrite missing')
assert.match(electrolytePost.body, /질병관리청/)
assert.match(electrolytePost.body, /kdca\.go\.kr/)
assert.match(electrolytePost.body, /cdc\.gov\/niosh\/heat-stress/)
assert.doesNotMatch(electrolytePost.body, /매\s*시간\s*소금\s*캡슐|시간당\s*1~2개|반드시\s*전해질|나트륨\s*200~300mg|현장 테스트/)

const hydrationPost = POSTS.find(post => post.id === 'p78')
assert.ok(hydrationPost, 'p78 public rewrite missing')
assert.equal(hydrationPost.title, '산행 탈수 예방 — 수분 보충 올바른 방법')
assert.deepEqual(hydrationPost.badges, ['탈수예방', '수분'])
assert.match(hydrationPost.body, /kdca\.go\.kr\/contents\.es\?mid=a20205030103/)
assert.match(hydrationPost.body, /cdc\.gov\/niosh\/heat-stress\/about\/illnesses/)
assert.match(hydrationPost.body, /cdc\.gov\/yellow-book\/hcp\/environmental-hazards-risks\/heat-and-cold-illness-in-travelers/)
assert.match(hydrationPost.body, /즉시 119에 신고/)
assert.match(hydrationPost.body, /열사병에서도[^.]{0,80}땀이/)
assert.match(hydrationPost.body, /안전하게 삼킬 수 있는 사람만/)
assert.match(hydrationPost.body, /필요 이상으로 많은 물을 마시면/)
assert.match(hydrationPost.body, /같은 날 산행을 재개하지/)
assert.doesNotMatch(hydrationPost.body, /시간당\s*500~750ml|750~1,000ml|\+200~300ml|400~500ml|최소\s*3L|3\.5~4L|체중의\s*2%|지구력[^.]{0,30}20%|1\.5~2%\s*탈수|체온\s*38\.5°C\s*이상|발한\s*감소[^.]{0,40}열사병|3시간\s*이상[^.]{0,50}전해질\s*보충이\s*필요/)

const altitudePost = POSTS.find(post => post.id === 'p172')
assert.ok(altitudePost, 'p172 public rewrite missing')
assert.equal(altitudePost.title, '고산증 증상 인지 — 하산 결정 타이밍과 예방 전략')
assert.deepEqual(altitudePost.badges, ['고산증 예방', 'AMS 증상', '하산 기준'])
assert.match(altitudePost.body, /cdc\.gov\/yellow-book\/hcp\/environmental-hazards-risks\/high-altitude-travel-and-altitude-illness/)
assert.match(altitudePost.body, /cdc\.gov\/yellow-book\/hcp\/preparing-international-travelers\/medication-and-vaccine-interactions-in-travel-medicine/)
assert.match(altitudePost.body, /증상이 있으면 더 높은 곳으로 올라가지/)
assert.doesNotMatch(altitudePost.body, /이부프로펜\s*\d+\s*mg|아세타졸아마이드[^.]{0,80}\d+\s*mg|하루\s*3~4리터|전날\s*제주에서\s*숙박|국내\s*산행에서는\s*이부프로펜/)

const cardiacPost = POSTS.find(post => post.id === 'p82')
assert.ok(cardiacPost, 'p82 public rewrite missing')
assert.equal(cardiacPost.title, '고혈압 심장질환 있어도 등산 가능한가')
assert.deepEqual(cardiacPost.badges, ['건강주의', '중장년'])
assert.match(cardiacPost.body, /heart\.org\/en\/health-topics\/high-blood-pressure/)
assert.match(cardiacPost.body, /heart\.org\/en\/health-topics\/cardiac-rehab/)
assert.match(cardiacPost.body, /cdc\.gov\/heart-disease\/about\/heart-attack/)
assert.match(cardiacPost.body, /즉시 119에/)
assert.doesNotMatch(cardiacPost.body, /당일[^.]{0,40}수축기\s*140mmHg|표고차\s*\d+\s*m\s*이하|30분마다\s*150~200ml|니트로글리세린[^.]{0,50}설하\s*투여|체중의\s*\d+%|산악\s*심정지[^.]{0,60}\d+%/)

const hyponatremiaPost = POSTS.find(post => post.id === 'p173')
assert.ok(hyponatremiaPost, 'p173 public rewrite missing')
assert.equal(hyponatremiaPost.title, '저나트륨혈증 — 물만 마시면 안 되는 이유와 전해질 보충')
assert.deepEqual(hyponatremiaPost.badges, ['저나트륨혈증', '전해질 보충', '수분 관리'])
assert.match(hyponatremiaPost.body, /cdc\.gov\/yellow-book\/hcp\/environmental-hazards-risks\/heat-and-cold-illness-in-travelers/)
assert.match(hyponatremiaPost.body, /pubmed\.ncbi\.nlm\.nih\.gov\/32044213/)
assert.match(hyponatremiaPost.body, /kdca\.go\.kr\/bbs\/kdca\/46\/306747\/download\.do/)
assert.match(hyponatremiaPost.body, /즉시 119에 신고/)
assert.doesNotMatch(hyponatremiaPost.body, /소금\s*0\.5~1g|물\s*500ml에\s*1포|시간당\s*최대\s*800ml|시간당\s*500ml|절반\s*이상을\s*전해질\s*음료|소변\s*색이\s*맑고[^.]{0,60}가능성\s*높음|손등\s*피부[^.]{0,80}2초|30분\s*관찰\s*후/)

const backPainPost = POSTS.find(post => post.id === 'p274')
assert.ok(backPainPost, 'p274 public rewrite missing')
assert.equal(backPainPost.title, '배낭 무게와 척추 통증 — 잘못된 무게 배분이 만드는 요통 예방')
assert.deepEqual(backPainPost.badges, ['배낭요통', '척추', '무게배분'])
assert.match(backPainPost.body, /health\.kdca\.go\.kr[^"']+cntnts_sn=3796/)
assert.match(backPainPost.body, /niams\.nih\.gov\/health-topics\/back-pain/)
assert.match(backPainPost.body, /nps\.gov\/articles\/hiking-safety/)
assert.match(backPainPost.body, /119에 위치와 증상을/)
assert.doesNotMatch(backPainPost.body, /허리\s*통증의\s*68%|최대\s*2\.3배|체중의\s*20%|체중의\s*15%|이부프로펜\s*400mg|24시간[^.]{0,60}온열\s*찜질|단순\s*근육통은\s*3~5일|표고차\s*300m\s*이하|배낭\s*5kg\s*이하|반드시\s*등산\s*스틱\s*2개/)

const heatPost = POSTS.find(post => post.id === 'p462')
assert.ok(heatPost, 'p462 public rewrite missing')
assert.equal(heatPost.title, '폭염 산행 중단 기준 — 땀보다 소변 색과 두통을 보자')
assert.deepEqual(heatPost.badges, ['폭염 산행 중단', '탈수 증상', '열탈진'])
assert.match(heatPost.body, /kdca\.go\.kr\/contents\.es\?mid=a20205030103/)
assert.match(heatPost.body, /cdc\.gov\/niosh\/heat-stress\/about\/illnesses/)
assert.match(heatPost.body, /cdc\.gov\/yellow-book\/hcp\/environmental-hazards-risks\/heat-and-cold-illness-in-travelers/)
assert.match(heatPost.body, /즉시 119에 신고/)
assert.match(heatPost.body, /의식이 흐리거나 삼키기 어려운 사람에게/)
assert.doesNotMatch(heatPost.body, /소변\s*색[^.]{0,100}(?:진행보다\s*하산|후보|1차|2차)|탈수\s*증상보다\s*두통|탈수\s*증상을\s*먼저|정상\s*도착\s*목표를\s*오후\s*1시|예상\s*하산\s*시간보다\s*90분|폭염\s*산행은\s*오전\s*하산을\s*원칙/)

const recoveryPost = POSTS.find(post => post.id === 'p71')
assert.ok(recoveryPost, 'p71 public rewrite missing')
assert.equal(recoveryPost.title, '등산 후 회복 루틴 — 근육통 빠르게 없애는 법')
assert.deepEqual(recoveryPost.badges, ['회복루틴', '근육통'])
assert.match(recoveryPost.body, /cdc\.gov\/niosh\/rhabdo\/signs-symptoms/)
assert.match(recoveryPost.body, /niams\.nih\.gov\/health-topics\/sports-injuries/)
assert.match(recoveryPost.body, /health\.gov\/paguidelines\/second-edition/)
assert.match(recoveryPost.body, /ausport\.gov\.au\/ais\/rest-hub\/recovery/)
assert.match(recoveryPost.body, /즉시 의료기관에서 평가/)
assert.doesNotMatch(recoveryPost.body, /단백질\s*합성\s*창|체중\s*1kg당\s*1\.2~1\.6g|단백질\s*25~30g|냉수\s*\(10~15°C\)|온수\s*\(38~40°C\)|젖산\s*제거를\s*약\s*30%|통증의\s*70~80%|최소\s*1~2일\s*더\s*회복/)

const headachePost = POSTS.find(post => post.id === 'p473')
assert.ok(headachePost, 'p473 public rewrite missing')
assert.equal(headachePost.title, '산행 중 두통이 올 때 — 고도보다 탈수와 열을 먼저 의심하라')
assert.deepEqual(headachePost.badges, ['산행 중 두통 대처', '탈수 두통', '열탈진'])
assert.match(headachePost.body, /medlineplus\.gov\/ency\/patientinstructions\/000424/)
assert.match(headachePost.body, /cdc\.gov\/niosh\/heat-stress\/about\/illnesses/)
assert.match(headachePost.body, /cdc\.gov\/yellow-book\/hcp\/environmental-hazards-risks\/heat-and-cold-illness-in-travelers/)
assert.match(headachePost.body, /cdc\.gov\/yellow-book\/hcp\/environmental-hazards-risks\/high-altitude-travel-and-altitude-illness/)
assert.match(headachePost.body, /즉시 119에 신고/)
assert.match(headachePost.body, /의식이 흐리거나[^.]{0,100}물·음식·약을 억지로 주지/)
assert.doesNotMatch(headachePost.body, /탈수\s*두통을\s*먼저|수분\s*보충을\s*가장\s*먼저|오후\s*3시\s*이후\s*산\s*위|후보를\s*1차로|일정이\s*확정된\s*뒤에는\s*열탈진|상위노출|SEO\s*관점/)

const heatstrokePost = POSTS.find(post => post.id === 'p175')
assert.ok(heatstrokePost, 'p175 public rewrite missing')
assert.equal(heatstrokePost.title, '여름 산행 열사병 — 초기 징후 인식과 즉각 대처법')
assert.deepEqual(heatstrokePost.badges, ['열사병 대처', '열탈진 구분', '여름 산행 안전'])
assert.match(heatstrokePost.body, /kdca\.go\.kr\/contents\.es\?mid=a20205030103/)
assert.match(heatstrokePost.body, /cdc\.gov\/niosh\/heat-stress\/about\/illnesses/)
assert.match(heatstrokePost.body, /cdc\.gov\/yellow-book\/hcp\/environmental-hazards-risks\/heat-and-cold-illness-in-travelers/)
assert.match(heatstrokePost.body, /즉시 119에 신고/)
assert.match(heatstrokePost.body, /찬물·얼음물에 몸을 담그는 적극적 냉각/)
assert.match(heatstrokePost.body, /안전하게 삼킬 수 없는 사람에게/)
assert.doesNotMatch(heatstrokePost.body, /땀이\s*없으면\s*열사병|거의\s*없음[^.]{0,80}뜨겁고\s*건조|체온\s*38°C\s*이상[^.]{0,80}위험\s*경보|냉각\s*후\s*30분\s*내에\s*증상\s*개선|혈관이\s*수축하여\s*오히려\s*체열\s*방출을\s*방해|최소\s*2~4주간|오전\s*6시\s*이전\s*출발|차가운\s*물\s*최소\s*2리터/)

const frostbitePost = POSTS.find(post => post.id === 'p77')
assert.ok(frostbitePost, 'p77 public rewrite missing')
assert.equal(frostbitePost.title, '겨울 산행 동상 예방과 현장 응급처치')
assert.deepEqual(frostbitePost.badges, ['동상', '겨울안전'])
assert.match(frostbitePost.body, /cdc\.gov\/winter-weather\/prevention\/preventing-frostbite/)
assert.match(frostbitePost.body, /medlineplus\.gov\/ency\/article\/000057/)
assert.match(frostbitePost.body, /cdc\.gov\/yellow-book\/hcp\/environmental-hazards-risks\/heat-and-cold-illness-in-travelers/)
assert.match(frostbitePost.body, /저체온증이 더 긴급/)
assert.match(frostbitePost.body, /재동결 위험이 없고/)
assert.match(frostbitePost.body, /문지르거나 마사지하면/)
assert.doesNotMatch(frostbitePost.body, /영하\s*10°C\s*이하[^.]{0,100}위험이\s*급격|열\s*손실\s*속도가\s*5배|손가락\s*끝\s*온도가\s*15°C|1도와\s*2도\s*이상을\s*구분|39~42°C|20~30분\s*담그|보온\s*기능이\s*0|방수\s*등산\s*양말\s*이중\s*착용|1인\s*1개/)

const hypothermiaPost = POSTS.find(post => post.id === 'p81')
assert.ok(hypothermiaPost, 'p81 public rewrite missing')
assert.equal(hypothermiaPost.title, '겨울 산행 저체온증 예방과 응급 대처')
assert.deepEqual(hypothermiaPost.badges, ['저체온증', '겨울안전'])
assert.match(hypothermiaPost.body, /cdc\.gov\/winter-weather\/prevention\/index/)
assert.match(hypothermiaPost.body, /cdc\.gov\/niosh\/cold-stress\/about\/related-illness/)
assert.match(hypothermiaPost.body, /medlineplus\.gov\/hypothermia/)
assert.match(hypothermiaPost.body, /redcross\.org\/get-help\/how-to-prepare-for-emergencies\/types-of-emergencies\/winter-storm\/hypothermia-and-frostbite/)
assert.match(hypothermiaPost.body, /저체온증이 의심되면 119에/)
assert.match(hypothermiaPost.body, /완전히 깨어 있고 혼란이 없으며 스스로 안전하게 삼킬 수 있을 때만/)
assert.match(hypothermiaPost.body, /가슴·목·머리·사타구니 등 몸통 중심을 먼저/)
assert.match(hypothermiaPost.body, /심하게 약하거나 혼란한 사람을 억지로 걷게 하지/)
assert.doesNotMatch(hypothermiaPost.body, /15~20%|32~35°C|28~32°C|28°C\s*미만|심실세동|단열\s*효율[^.]{0,80}30~40%|체온\s*손실의\s*40~50%|90%까지\s*반사|60°C\s*이상|면\s*절대\s*금지|1인\s*1개|중등도\s*이상이\s*의심되면|경증이라도\s*처치\s*후\s*호전이\s*없으면/)

const postHikeRedFlagsPost = POSTS.find(post => post.id === 'p89')
assert.ok(postHikeRedFlagsPost, 'p89 public rewrite missing')
assert.equal(postHikeRedFlagsPost.title, '등산 후 이런 증상 나타나면 병원에 가세요')
assert.deepEqual(postHikeRedFlagsPost.badges, ['건강관리', '이상신호'])
assert.match(postHikeRedFlagsPost.body, /cdc\.gov\/niosh\/rhabdo\/about\/index/)
assert.match(postHikeRedFlagsPost.body, /cdc\.gov\/niosh\/rhabdo\/treatment\/index/)
assert.match(postHikeRedFlagsPost.body, /heart\.org\/en\/health-topics\/heart-attack\/warning-signs-of-a-heart-attack/)
assert.match(postHikeRedFlagsPost.body, /cdc\.gov\/stroke\/signs-symptoms\/index/)
assert.match(postHikeRedFlagsPost.body, /kdca\.go\.kr\/kdca\/3396\/subview\.do/)
assert.match(postHikeRedFlagsPost.body, /증상만으로 확정할 수 없습니다/)
assert.match(postHikeRedFlagsPost.body, /직접 운전하기보다 119에/)
assert.match(postHikeRedFlagsPost.body, /완전히 깨어 있고 안전하게 삼킬 수 있다면/)
assert.match(postHikeRedFlagsPost.body, /고정된 주수나 검사 수치 하나로/)
assert.doesNotMatch(postHikeRedFlagsPost.body, /12~48시간|24시간\s*이상\s*지속|72시간\s*이상|3~5일[^.]{0,100}체중\s*1kg당\s*1\.2~1\.5g|초기\s*72시간\s*RICE|부분\s*파열\(2도\s*염좌\)[^.]{0,80}2~4주|완전\s*파열\(3도\s*염좌\)[^.]{0,80}3~6개월|수분\s*섭취\s*후\s*30분\s*이내\s*호전|38°C\s*이상\s*발열[^.]{0,80}딱지|면역\s*기능이\s*회복되는\s*데는\s*2~4주/)

const rescueCallPost = POSTS.find(post => post.id === 'p88')
assert.ok(rescueCallPost, 'p88 public rewrite missing')
assert.equal(rescueCallPost.title, '119 구조 신고 — 산에서 위치 정확히 알리는 법')
assert.equal(rescueCallPost.cat, '안전')
assert.equal(rescueCallPost.pal, 'autumn')
assert.deepEqual(rescueCallPost.badges, ['119구조', '위치신고'])
assert.match(rescueCallPost.body, /nfa\.go\.kr\/nfa\/safetyinfo\/emergencyservice\/119emergencydeclaration/)
assert.match(rescueCallPost.body, /119\.go\.kr/)
assert.match(rescueCallPost.body, /mois\.go\.kr\/frt\/sub\/a06\/b10\/emergencycall/)
assert.match(rescueCallPost.body, /knps\.or\.kr/)
assert.match(rescueCallPost.body, /medlineplus\.gov\/ency\/article\/000028/)
assert.match(rescueCallPost.body, /가능한 한 빨리 119에 신고/)
assert.match(rescueCallPost.body, /부상자를 임의로 옮기지 말고/)
assert.match(rescueCallPost.body, /불가피한 이동은 새 위치와 방향을 즉시/)
assert.match(rescueCallPost.body, /119의 현재 지시를 우선/)
assert.doesNotMatch(rescueCallPost.body, /신고가\s*아니라\s*안전한\s*위치|넓은\s*바위\s*위로\s*이동|등산로\s*중앙으로|평균\s*62분|2~3배|100m\s*격자|10~20m|오차\s*500m~1km|3번\s*연속\s*취명|119\s*스마트\s*신고|전원\s*버튼\s*5번|측면\s*버튼[^.]{0,20}3회|헬기\s*접근[^.]{0,80}나무\s*아래/)

const basicSafetyPost = POSTS.find(post => post.id === 'p84')
assert.ok(basicSafetyPost, 'p84 public rewrite missing')
assert.equal(basicSafetyPost.title, '산에서 살아남는 안전 수칙 10가지')
assert.equal(basicSafetyPost.cat, '안전')
assert.equal(basicSafetyPost.pal, 'sage')
assert.deepEqual(basicSafetyPost.badges, ['안전수칙', '기본'])
assert.match(basicSafetyPost.body, /nfa\.go\.kr\/nfa\/safetyinfo\/emergencyservice\/119emergencydeclaration/)
assert.match(basicSafetyPost.body, /mois\.go\.kr\/frt\/sub\/a06\/b10\/emergencycall/)
assert.match(basicSafetyPost.body, /weather\.go\.kr\/w\/hazard\/safety-guide\/heavy-rain\.do/)
assert.match(basicSafetyPost.body, /knps\.or\.kr/)
assert.match(basicSafetyPost.body, /forest\.go\.kr/)
assert.match(basicSafetyPost.body, /kdca\.go\.kr\/contents\.es\?mid=a20205030103/)
assert.match(basicSafetyPost.body, /cdc\.gov\/yellow-book\/hcp\/environmental-hazards-risks\/heat-and-cold-illness-in-travelers/)
assert.match(basicSafetyPost.body, /가능한 한 빨리 119에 신고/)
assert.match(basicSafetyPost.body, /억지로 마시지/)
assert.match(basicSafetyPost.body, /주관적 비율[^.]{0,80}계속 진행하지/)
assert.match(basicSafetyPost.body, /사람의 최종 편집 검수는 아직 완료되지 않았습니다/)
assert.doesNotMatch(basicSafetyPost.body, /9,000~10,000건|실족·추락\s*35%|길\s*잃음\s*25%|탈진[^.]{0,20}15%|예방\s*가능한\s*원인이?\s*80%|평균\s*2~3시간|일몰\s*2시간\s*전|오후\s*3시\s*30분|시간당\s*500~700ml|최소\s*3L|3\.5~4L|2시간\s*간격으로\s*섭취|서쪽\s*방향\s*구름|100m\s*격자|3회\s*연속|체력이?\s*60%|60~70%|50%\s*체력/)

const hikeTimePlanningPost = POSTS.find(post => post.id === 'p75')
assert.ok(hikeTimePlanningPost, 'p75 public rewrite missing')
assert.equal(hikeTimePlanningPost.title, '산행 계획 거리 고도 소요시간 계산법')
assert.equal(hikeTimePlanningPost.cat, '가이드')
assert.equal(hikeTimePlanningPost.pal, 'valley')
assert.deepEqual(hikeTimePlanningPost.badges, ['계획수립', '시간계산'])
assert.match(hikeTimePlanningPost.body, /knps\.or\.kr/)
assert.match(hikeTimePlanningPost.body, /res\.knps\.or\.kr/)
assert.match(hikeTimePlanningPost.body, /weather\.go\.kr/)
assert.match(hikeTimePlanningPost.body, /nfa\.go\.kr\/nfa\/safetyinfo\/emergencyservice\/119emergencydeclaration/)
assert.match(hikeTimePlanningPost.body, /cdc\.gov\/winter-weather\/prevention/)
assert.match(hikeTimePlanningPost.body, /낙관·기준·보수 범위/)
assert.match(hikeTimePlanningPost.body, /실제 일몰/)
assert.match(hikeTimePlanningPost.body, /일정을 취소하거나 안전한 경로로 돌아갑니다/)
assert.match(hikeTimePlanningPost.body, /사람의 최종 편집 검수는 아직 완료되지 않았습니다/)
assert.doesNotMatch(hikeTimePlanningPost.body, /40~60%|2~3km\/h|62%|거리\s*km\s*×\s*12분|고도\s*상승\s*m\s*÷\s*100|30~50%|20~30%\s*감산|60~70%|10~20분\s*내외|일몰\s*1\.5~2시간\s*전|풍속[^.]{0,60}10m\/s|체력\s*소모가\s*2배/)

const courseRiskDecisionPost = POSTS.find(post => post.id === 'p86')
assert.ok(courseRiskDecisionPost, 'p86 public rewrite missing')
assert.equal(courseRiskDecisionPost.title, '이 코스 가도 될까 — 위험 판단 기준 5가지')
assert.equal(courseRiskDecisionPost.cat, '안전')
assert.equal(courseRiskDecisionPost.pal, 'valley')
assert.deepEqual(courseRiskDecisionPost.badges, ['위험판단', '코스선택'])
assert.match(courseRiskDecisionPost.body, /knps\.or\.kr/)
assert.match(courseRiskDecisionPost.body, /res\.knps\.or\.kr/)
assert.match(courseRiskDecisionPost.body, /forest\.go\.kr/)
assert.match(courseRiskDecisionPost.body, /weather\.go\.kr/)
assert.match(courseRiskDecisionPost.body, /nfa\.go\.kr\/nfa\/safetyinfo\/emergencyservice\/119emergencydeclaration/)
assert.match(courseRiskDecisionPost.body, /중대한 조건이 하나라도 확인되면/)
assert.match(courseRiskDecisionPost.body, /진행<\/td>|진행<\/td>/)
assert.match(courseRiskDecisionPost.body, /가능한 한 빨리 119에 위치와 상태를/)
assert.match(courseRiskDecisionPost.body, /사람의 최종 편집 검수는 아직 완료되지 않았습니다/)
assert.doesNotMatch(courseRiskDecisionPost.body, /40%\s*이상|체력\s*소모는?\s*2~3배|250kcal|550kcal|800kcal|3개월\s*이상|6개월\s*이상|1\.3~1\.5배|일몰[^.]{0,80}2시간|30분~1시간|암릉\s*비율[^.]{0,40}20%|강수\s*확률\s*30%|초속\s*8m|구조\s*소요시간[^.]{0,80}2~3배|편도\s*1시간\s*이내/)

const manisanPost = POSTS.find(post => post.id === 'p349')
assert.ok(manisanPost, 'p349 public rewrite missing')
assert.equal(manisanPost.title, '마니산 등산 완전 가이드 — 인천 강화 강화도 최고봉·참성단·서해 조망')
assert.equal(manisanPost.cat, '코스추천')
assert.equal(manisanPost.pal, 'dawn')
assert.deepEqual(manisanPost.badges, ['마니산', '강화도', '참성단'])
assert.match(manisanPost.body, /ganghwa\.go\.kr\/manisan\/facility\/guide\.jsp/)
assert.match(manisanPost.body, /ganghwa\.go\.kr\/manisan\/introduce\/hamheo\.jsp/)
assert.match(manisanPost.body, /ganghwa\.go\.kr\/manisan\/introduce\/jeongsusa\.jsp/)
assert.match(manisanPost.body, /heritage\.go\.kr/)
assert.deepEqual(findBlockedPublicSafetyClaims(enhanceArticleBody(manisanPost)), [], 'p349 enhanced body')

const palbongsanPost = POSTS.find(post => post.id === 'p401')
assert.ok(palbongsanPost, 'p401 public rewrite missing')
assert.equal(palbongsanPost.title, '팔봉산 등산 완전 가이드 — 강원 홍천 기암 8봉·홍천강 조망 당일 명산')
assert.equal(palbongsanPost.cat, '코스추천')
assert.equal(palbongsanPost.pal, 'valley')
assert.deepEqual(palbongsanPost.badges, ['팔봉산', '홍천', '홍천강'])
assert.match(palbongsanPost.body, /hongcheon\.go\.kr\/palbong\/contents\.do\?key=1172/)
assert.match(palbongsanPost.body, /2026년 9월 13일/)
assert.match(palbongsanPost.body, /2025년 1월 1일[^.]{0,80}무료/)
assert.match(palbongsanPost.body, /실제 일몰/)
assert.match(palbongsanPost.body, /즉시 119/)
assert.match(palbongsanPost.body, /사람의 최종 편집 검수는 아직 완료되지 않았습니다/)
assert.doesNotMatch(palbongsanPost.body, /오후\s*늦게\s*출발해도|경사\s*40도\s*이상|비가\s*온\s*뒤\s*24시간|비브람\s*계열|주차요금[^.]{0,30}2,?000원|06:00부터\s*22:00|30분\s*간격|버스\s*23번|하루\s*6\s*(?:~|～)\s*8회|성인\s*기준\s*1,?000원|10월\s*20일\s*(?:~|～)\s*11월\s*5일|7세\s*이상|사이트\s*수는?\s*약\s*100개|6개월\s*전부터\s*예약/)
assert.deepEqual(findBlockedPublicSafetyClaims(enhanceArticleBody(palbongsanPost)), [], 'p401 enhanced body')

const capitalRidgePost = POSTS.find(post => post.id === 'p414')
assert.ok(capitalRidgePost, 'p414 public rewrite missing')
assert.equal(capitalRidgePost.title, '새벽 출발 수도권 능선 산행 — 대중교통 막차까지 계산한 당일 코스')
assert.equal(capitalRidgePost.cat, '코스추천')
assert.equal(capitalRidgePost.pal, 'forest')
assert.deepEqual(capitalRidgePost.badges, ['수도권 능선 산행', '새벽 출발', '대중교통 등산'])
assert.match(capitalRidgePost.body, /knps\.or\.kr/)
assert.match(capitalRidgePost.body, /map\.seoul\.go\.kr/)
assert.match(capitalRidgePost.body, /seoulmetro\.co\.kr/)
assert.match(capitalRidgePost.body, /topis\.seoul\.go\.kr/)
assert.match(capitalRidgePost.body, /실제 일몰/)
assert.match(capitalRidgePost.body, /즉시 119/)
assert.match(capitalRidgePost.body, /사람의 최종 편집 검수는 아직 완료되지 않았습니다/)
assert.doesNotMatch(capitalRidgePost.body, /일몰\s*2시간\s*전|오전\s*6시\s*40분|오전\s*7시\s*전후|오전\s*10시\s*30분|오후\s*1시\s*이전|90분\s*이상|오후\s*3시\s*이후|당일\s*실패를\s*줄이는\s*기준은\s*새벽\s*출발|초보도\s*가능하지만/)
assert.deepEqual(findBlockedPublicSafetyClaims(enhanceArticleBody(capitalRidgePost)), [], 'p414 enhanced body')

const winterBeginnerPost = POSTS.find(post => post.id === 'p417')
assert.ok(winterBeginnerPost, 'p417 public rewrite missing')
assert.equal(winterBeginnerPost.title, '겨울 초보가 실패하지 않는 낮은 산 코스 — 아이젠보다 중요한 하산 시간')
assert.equal(winterBeginnerPost.cat, '코스추천')
assert.equal(winterBeginnerPost.pal, 'winter')
assert.deepEqual(winterBeginnerPost.badges, ['겨울 낮은 산 코스', '초보 겨울 산행', '아이젠 준비'])
assert.match(winterBeginnerPost.body, /knps\.or\.kr/)
assert.match(winterBeginnerPost.body, /forest\.go\.kr/)
assert.match(winterBeginnerPost.body, /weather\.go\.kr\/w\/hazard\/safety-guide\/coldwave\.do/)
assert.match(winterBeginnerPost.body, /kdca\.go\.kr\/menu\.es\?mid=a20205060300/)
assert.match(winterBeginnerPost.body, /실제 일몰/)
assert.match(winterBeginnerPost.body, /즉시 119/)
assert.match(winterBeginnerPost.body, /사람의 최종 편집 검수는 아직 완료되지 않았습니다/)
assert.doesNotMatch(winterBeginnerPost.body, /일몰\s*2시간\s*전|정오\s*전후|오후\s*1시[^.]{0,80}1시간\s*이상|오후\s*2시\s*이후|오후\s*3시\s*이후|왕복\s*3시간\s*(?:이내|안쪽)|30분\s*지연|초보도\s*가능하지만/)
assert.deepEqual(findBlockedPublicSafetyClaims(enhanceArticleBody(winterBeginnerPost)), [], 'p417 enhanced body')

const lateStartPost = POSTS.find(post => post.id === 'p449')
assert.ok(lateStartPost, 'p449 public rewrite missing')
assert.equal(lateStartPost.title, '초보가 피해야 할 산행 약속 시간 — 오전 10시 출발이 위험한 이유')
assert.equal(lateStartPost.cat, '가이드')
assert.equal(lateStartPost.pal, 'guide')
assert.deepEqual(lateStartPost.badges, ['늦은 산행 출발 위험', '오전 10시 등산', '일몰 하산'])
assert.match(lateStartPost.body, /knps\.or\.kr/)
assert.match(lateStartPost.body, /forest\.go\.kr/)
assert.match(lateStartPost.body, /seoulmetro\.co\.kr/)
assert.match(lateStartPost.body, /topis\.seoul\.go\.kr/)
assert.match(lateStartPost.body, /실제 일몰/)
assert.match(lateStartPost.body, /즉시 119/)
assert.match(lateStartPost.body, /오전 10시 자체가 위험한 것이 아니라/)
assert.match(lateStartPost.body, /사람의 최종 편집 검수는 아직 완료되지 않았습니다/)
assert.doesNotMatch(lateStartPost.body, /일몰\s*(?:1|2)시간\s*전|오후\s*[123]시\s*(?:이전|이후)|90분\s*이상|오전\s*10시\s*등산[^.]{0,100}일몰\s*하산[^.]{0,100}같은\s*무게|가까운\s*숲길로\s*바꾸는\s*편이\s*낫/)
assert.deepEqual(findBlockedPublicSafetyClaims(enhanceArticleBody(lateStartPost)), [], 'p449 enhanced body')
assert.match(manisanPost.body, /weather\.go\.kr/)
assert.match(manisanPost.body, /nfa\.go\.kr\/nfa\/safetyinfo\/emergencyservice\/119emergencydeclaration/)
assert.match(manisanPost.body, /2026년 9월 13일 강화군 공식 이용안내 확인 기준/)
assert.match(manisanPost.body, /북쪽 마니산 국민관광지 기점과 남쪽 함허동천 기점을 섞지 않는 것/)
assert.match(manisanPost.body, /방문 당일[\s\S]{0,220}다시 확인/)
assert.match(manisanPost.body, /사람의 최종 편집 검수는 아직 완료되지 않았습니다/)
assert.doesNotMatch(manisanPost.body, /계단길\s*코스\s*\(함허동천|일몰\s*1시간\s*전|오후\s*5시\s*30분|오후\s*2시\s*이전|3000번\s*버스|30~40분\s*간격|1일\s*6~8회|12,000~15,000원|1일\s*3,000원|약\s*300대|경사\s*30도\s*이상|250m[^.]{0,40}암릉|비브람\s*계열|4발\s*이상\s*아이젠/)

const lostHikerPost = POSTS.find(post => post.id === 'p72')
assert.ok(lostHikerPost, 'p72 public rewrite missing')
assert.equal(lostHikerPost.title, '산에서 길 잃었을 때 대처하는 법')
assert.equal(lostHikerPost.cat, '가이드')
assert.equal(lostHikerPost.pal, 'dawn')
assert.deepEqual(lostHikerPost.badges, ['조난대처', '안전'])
assert.match(lostHikerPost.body, /nfa\.go\.kr\/nfa\/safetyinfo\/emergencyservice\/119emergencydeclaration/)
assert.match(lostHikerPost.body, /119\.go\.kr/)
assert.match(lostHikerPost.body, /mois\.go\.kr\/frt\/sub\/a06\/b10\/emergencycall/)
assert.match(lostHikerPost.body, /knps\.or\.kr/)
assert.match(lostHikerPost.body, /weather\.go\.kr\/w\/hazard\/safety-guide\/heavy-rain\.do/)
assert.match(lostHikerPost.body, /가능한 한 빨리 119에 신고/)
assert.match(lostHikerPost.body, /마지막으로 확실히 확인한/)
assert.match(lostHikerPost.body, /불가피하게 이동했다면/)
assert.match(lostHikerPost.body, /콜백을 받을 수 있도록/)
assert.match(lostHikerPost.body, /사람의 최종 편집 검수는 아직 완료되지 않았습니다/)
assert.doesNotMatch(lostHikerPost.body, /23%|36%|약\s*8,000건|2시간\s*48분|1시간\s*22분|62%|첫\s*5분의\s*행동|500m마다|문자[^.]{0,80}통화보다\s*전송\s*성공률|소방청\s*119신고\s*앱|GPS\s*좌표를\s*자동\s*첨부|산림청\s*국민\s*안심\s*서비스|5,000mAh|3회\s*연속\s*호루라기|국제\s*조난\s*신호/)

const floodPost = POSTS.find(post => post.id === 'p90')
assert.ok(floodPost, 'p90 public rewrite missing')
assert.equal(floodPost.title, '폭우 속 산행 — 계곡 위험과 대피 수칙')
assert.equal(floodPost.cat, '안전')
assert.deepEqual(floodPost.badges, ['폭우대피', '계곡위험'])
assert.match(floodPost.body, /weather\.go\.kr\/w\/hazard\/safety-guide\/heavy-rain\.do/)
assert.match(floodPost.body, /safekorea\.go\.kr/)
assert.match(floodPost.body, /nfa\.go\.kr\/nfa/)
assert.match(floodPost.body, /knps\.or\.kr/)
assert.match(floodPost.body, /즉시 119에 신고/)
assert.match(floodPost.body, /경과 시간은 안전 확인이 아닙니다/)
assert.match(floodPost.body, /능선은 낙뢰와 강풍에 노출/)
assert.match(floodPost.body, /사람부터 이동/)
assert.doesNotMatch(floodPost.body, /시간당\s*(?:20|30)mm|20~40cm|30분\s*이내|초속\s*(?:2|3)m|30m\s*이상|5분\s*간격|최소\s*2~3시간|강수\s*확률\s*50%|전날\s*150mm|대피\s*여유\s*시간을\s*2~3시간/)

const exhaustionFoodPost = POSTS.find(post => post.id === 'p180')
assert.ok(exhaustionFoodPost, 'p180 public rewrite missing')
assert.equal(exhaustionFoodPost.title, '탈진 후 에너지 회복 — 산에서 먹는 비상식 종류와 섭취법')
assert.deepEqual(exhaustionFoodPost.badges, ['탈진회복', '비상식', '에너지보충'])
assert.match(exhaustionFoodPost.body, /kdca\.go\.kr\/contents\.es\?mid=a20205030103/)
assert.match(exhaustionFoodPost.body, /cdc\.gov\/niosh\/heat-stress\/about\/illnesses/)
assert.match(exhaustionFoodPost.body, /cdc\.gov\/yellow-book\/hcp\/environmental-hazards-risks\/heat-and-cold-illness-in-travelers/)
assert.match(exhaustionFoodPost.body, /medlineplus\.gov\/ency\/article\/000022/)
assert.match(exhaustionFoodPost.body, /medlineplus\.gov\/ency\/patientinstructions\/000085/)
assert.match(exhaustionFoodPost.body, /heart\.org\/en\/health-topics\/heart-attack\/warning-signs-of-a-heart-attack/)
assert.match(exhaustionFoodPost.body, /cdc\.gov\/stroke\/signs-symptoms\/index/)
assert.match(exhaustionFoodPost.body, /즉시 119에 위치와 증상 시작 시각을/)
assert.match(exhaustionFoodPost.body, /안전하게 삼키지 못하는 사람에게/)
assert.match(exhaustionFoodPost.body, /필요 이상으로 물을 계속 마시면/)
assert.match(exhaustionFoodPost.body, /진한 차색·콜라색 소변 또는 소변량 감소/)
assert.match(exhaustionFoodPost.body, /10분이나 20분 쉬었다는 이유로 재출발하지/)
assert.doesNotMatch(exhaustionFoodPost.body, /평지\s*걷기의\s*3~4배|4~5시간\s*이상|5~10분|10~15분|20~30분|30~45분|45~60분|60~90분|120~180분|1회\s*섭취\s*기준\s*200kcal|물\s*200~300ml|추가\s*30분\s*휴식|2시간마다\s*100~150kcal|소화\s*불필요|무게\s*대비\s*칼로리\s*최고/)

assert.equal(POSTS.some(post => post.id === 'p270'), false, 'p270 publication state changed')
const rewriteSource = fs.readFileSync(path.join(process.cwd(), 'lib/post-quality-rewrites.ts'), 'utf8')
const ankleSprainRewrite = rewriteSource.match(/p270:\s*\{[\s\S]*?\n\s*},/)?.[0]
assert.ok(ankleSprainRewrite, 'p270 rewrite missing')
assert.match(ankleSprainRewrite, /NIAMS|미국 국립 관절염·근골격·피부질환 연구소/)
assert.match(ankleSprainRewrite, /niams\.nih\.gov/)
assert.match(ankleSprainRewrite, /nhs\.uk\/conditions\/sprains-and-strains/)
assert.doesNotMatch(ankleSprainRewrite, /통증이\s*\d+점|온찜질로\s*전환|셀프 테이핑 완전|이부프로펜 또는 아세트아미노펜|부분 파열을 완전 파열/)

assert.equal(POSTS.some(post => post.id === 'p269'), false, 'p269 publication state changed')
const fallPreventionRewrite = rewriteSource.match(/p269:\s*\{[\s\S]*?\n\s*},/)?.[0]
assert.ok(fallPreventionRewrite, 'p269 rewrite missing')
assert.match(fallPreventionRewrite, /National Park Service|미국 국립공원관리청/)
assert.match(fallPreventionRewrite, /nps\.gov\/articles\/camp-safety-before-the-trip/)
assert.match(fallPreventionRewrite, /nhs\.uk\/conditions\/falls/)
assert.doesNotMatch(fallPreventionRewrite, /큰 나무나 바위를 향해|두 폴을 강하게|통증이\s*\d+점|체중의\s*20~30%|이부프로펜\(소염진통제\)|사고의\s*약\s*70%/)

const sourceBodies = new Map(POSTS.map(post => [post.id, post.body ?? '']))
const affected = POSTS.flatMap(post => {
  const sourceLinks = [...(post.body ?? '').matchAll(/href=(['"])([^'"]+)\1/gi)].map(match => match[2])
  const result = sanitizeBlockedPublicSafetyHtml(post.body ?? '')
  assert.deepEqual(findBlockedPublicSafetyClaims(result.html), [], post.id)
  assert.equal(post.body ?? '', sourceBodies.get(post.id), `${post.id}: source body changed`)
  for (const href of sourceLinks) assert.ok(result.html.includes(href), `${post.id}: lost href ${href}`)
  return result.redactedClaims > 0 ? [{ id: post.id, ...result }] : []
})
assert.deepEqual(affected.map(row => row.id), [])

const geumjeongsanPost = POSTS.find(post => post.id === 'p335')
assert.ok(geumjeongsanPost, 'p335 public rewrite missing')
assert.equal(geumjeongsanPost.title, '금정산 등산 완전 가이드 — 부산·경남 양산 부산 시민 산·금정산성 역사 트레킹')
assert.equal(geumjeongsanPost.cat, '코스추천')
assert.equal(geumjeongsanPost.pal, 'forest')
assert.deepEqual(geumjeongsanPost.badges, ['금정산', '부산', '금정산성'])
assert.match(geumjeongsanPost.body, /geumjeong\.go\.kr\/tour/)
assert.match(geumjeongsanPost.body, /humetro\.busan\.kr/)
assert.match(geumjeongsanPost.body, /실제 일몰/)
assert.match(geumjeongsanPost.body, /가능한 한 빨리 119/)
assert.match(geumjeongsanPost.body, /사람의 최종 편집 검수는 아직 완료되지 않았습니다/)
assert.doesNotMatch(geumjeongsanPost.body, /3호선과 환승|초보자도 4시간|일몰 1시간 전|오전 6시~7시|영하 5도 이하|방한 장비를 과하게|비브람 계열|제91-5호/)
assert.deepEqual(findBlockedPublicSafetyClaims(enhanceArticleBody(geumjeongsanPost)), [], 'p335 enhanced body')

const hwaaksanPost = POSTS.find(post => post.id === 'p407')
assert.ok(hwaaksanPost, 'p407 public rewrite missing')
assert.equal(hwaaksanPost.title, '화악산 등산 완전 가이드 — 경기 가평·강원 화천 경기 최북단 고봉·군사시설 허가 산행')
assert.equal(hwaaksanPost.cat, '코스추천')
assert.equal(hwaaksanPost.pal, 'forest')
assert.deepEqual(hwaaksanPost.badges, ['화악산', '가평', '경기최북단'])
assert.match(hwaaksanPost.body, /gp\.go\.kr/)
assert.match(hwaaksanPost.body, /ihc\.go\.kr/)
assert.match(hwaaksanPost.body, /실제 일몰/)
assert.match(hwaaksanPost.body, /가능한 한 빨리 119/)
assert.match(hwaaksanPost.body, /사람의 최종 편집 검수는 아직 완료되지 않았으며/)
assert.doesNotMatch(hwaaksanPost.body, /14\.2km|12\.8km|9\.4km|15\.6km|6시간 30분|하루 4~6회|3만~4만 원|약 80대|오전 6시 출발|낮 12시 이전|최소 1\.5L/)
assert.deepEqual(findBlockedPublicSafetyClaims(enhanceArticleBody(hwaaksanPost)), [], 'p407 enhanced body')
console.log('PUBLICATION_SAFETY_OK')
