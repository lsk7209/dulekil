# p462 폭염·온열질환 안전 근거 보정

- 대상: 공개 글 `p462` (`폭염 산행 중단 기준 — 땀보다 소변 색과 두통을 보자`)
- 처리: 자동 안전 보정. 사람 편집 승인이나 현장 진단 지침으로 기록하지 않음.
- 공개 상태: 유지. 제목, slug 생성 입력, 배지 유지.
- 변경 범위: 소변 색을 진행·하산 기준으로 삼는 자가진단, 탈수를 우선 가정하는 흐름, 고정 정상·하산 시각, 열탈진과 탈수의 혼합 설명을 제거. 활동 중단, 시원한 장소 이동, 냉각, 열사병 신경학적 위험 신호와 즉시 119 신고로 교체.

## 공식 근거

- [질병관리청 — 온열질환 종류 및 응급조치](https://www.kdca.go.kr/contents.es?mid=a20205030103): 열사병의 위험성과 119 신고, 시원한 장소 이동·의복 완화·냉각, 의식이 없을 때 음료 금지.
- [CDC/NIOSH — Heat-related Illnesses](https://www.cdc.gov/niosh/heat-stress/about/illnesses.html): 열탈진과 열사병 증상, 혼란·말 어눌함·경련·의식 소실 시 응급의료 요청과 신속 냉각.
- [CDC Yellow Book — Heat and Cold Illness in Travelers](https://www.cdc.gov/yellow-book/hcp/environmental-hazards-risks/heat-and-cold-illness-in-travelers.html): 탈수·열질환·운동 관련 저나트륨혈증의 증상 중첩과 임상 평가 필요성.

## 의도적으로 하지 않은 일

- 소변 색, 두통 또는 땀 유무만으로 열질환·탈수를 진단하지 않음.
- 고정된 출발·정상·하산 시간이나 수분량을 보편 기준으로 제시하지 않음.
- 공개 상태, 제목, 배지, 운영 DB, 배포, 색인 또는 광고 계정을 변경하지 않음.

## 회귀 방지

- `lib/quality-gate.ts`: 소변색 산행 진행 결정, 탈수 우선 두통 진단, 두통·소변색 기반 지연 하산 흐름을 차단.
- `scripts/verify-publication-safety.ts`: p462 공개 정체성, 공식 링크, 즉시 신고·냉각·경구 섭취 금지 조건과 제거 문구 부재를 검증.
