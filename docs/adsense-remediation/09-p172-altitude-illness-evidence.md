# p172 고산병 안전 근거 보정

- 대상: 공개 글 `p172` (`고산증 증상 인지 — 하산 결정 타이밍과 예방 전략`)
- 처리: 자동 안전 보정. 사람 편집 승인이나 출처 검증 완료로 기록하지 않음.
- 공개 상태: 유지. 제목, slug 생성 입력, 배지 유지.
- 변경 범위: 본문의 고정 약물 용량·복용 간격, 고정 하강 거리, 고정 수분량, 국내 산행 자가투약 일반화를 제거하고 상승 중단·악화 시 하강·긴급 신호 대응으로 교체.

## 공식 근거

- [CDC Yellow Book — High-Altitude Travel and Altitude Illness](https://www.cdc.gov/yellow-book/hcp/environmental-hazards-risks/high-altitude-travel-and-altitude-illness.html): 고산 질환의 위험 요인, 증상이 있을 때 추가 상승 금지, 악화 시 하강, HACE/HAPE의 긴급 대응 기준.
- [CDC Yellow Book — Medication and Vaccine Interactions in Travel Medicine](https://www.cdc.gov/yellow-book/hcp/preparing-international-travelers/medication-and-vaccine-interactions-in-travel-medicine.html): 여행 전 현재 복용약과 상호작용을 검토해야 한다는 원칙.

## 의도적으로 하지 않은 일

- 특정 약의 용량·복용 간격을 새로 제시하지 않음.
- p172의 공개 상태, 제목, 배지 또는 기존 slug를 변경하지 않음.
- 운영 배포, 운영 DB 변경, 대량 공개 상태 변경, 광고 계정 작업을 수행하지 않음.

## 회귀 방지

- `lib/quality-gate.ts`: 고산병 예방 목적의 이부프로펜 고정 용량, 국내 산행 자가투약, 고정 수분량 재등장을 차단.
- `scripts/verify-publication-safety.ts`: p172 공개 상태와 식별 정보, 공식 링크, 위험 문구 부재를 검증.
