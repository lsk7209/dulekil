# p173 저나트륨혈증 안전 근거 보정

- 대상: 공개 글 `p173` (`저나트륨혈증 — 물만 마시면 안 되는 이유와 전해질 보충`)
- 처리: 자동 안전 보정. 사람 편집 승인이나 현장 진단·치료 지침으로 기록하지 않음.
- 공개 상태: 유지. 제목, slug 생성 입력, 배지 유지.
- 변경 범위: 소변색·피부검사 자가진단, 고정 수분·전해질 비율, 소금물 제조, 의심 환자에게 소금·전해질을 먹인 뒤 관찰하는 지시를 제거. 과음수 회피, 증상 중첩, 혈액검사 필요 가능성, 중증 신경 증상 시 119 신고로 교체.

## 공식 근거

- [CDC Yellow Book — Heat and Cold Illness in Travelers](https://www.cdc.gov/yellow-book/hcp/environmental-hazards-risks/heat-and-cold-illness-in-travelers.html): 열탈진과 초기 운동 관련 저나트륨혈증 증상의 중첩, 혈중 나트륨 측정을 통한 진단 원칙.
- [Wilderness Medical Society Clinical Practice Guidelines for Exercise-Associated Hyponatremia](https://pubmed.ncbi.nlm.nih.gov/32044213/): 저나트륨혈증과 다른 운동성 질환을 구분하지 못하면 위해가 커질 수 있다는 임상진료지침.
- [질병관리청 — 폭염 대비와 온열질환 예방](https://kdca.go.kr/bbs/kdca/46/306747/download.do): 일반적인 폭염 예방에서 별도 소금·이온음료가 항상 필요하지 않으며 만성질환자는 의료진과 상의해야 한다는 안내.

## 의도적으로 하지 않은 일

- 혈액검사 없이 저나트륨혈증·탈수를 판별하는 규칙을 제공하지 않음.
- 소금, 전해질 제품 또는 수분의 치료 용량·비율·관찰 시간을 제시하지 않음.
- 공개 상태, 제목, 배지, 운영 DB, 배포, 색인 또는 광고 계정을 변경하지 않음.

## 회귀 방지

- `lib/quality-gate.ts`: 현장 소금 자가치료, 고정 소금물 제조, 소변·피부 자가진단 재등장을 차단.
- `scripts/verify-publication-safety.ts`: p173 공개 정체성, 공식 링크, 119 우선, 위험 문구 부재와 기존 렌더 차단 목록 축소를 검증.
