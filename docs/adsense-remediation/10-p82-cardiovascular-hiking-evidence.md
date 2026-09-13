# p82 심혈관질환 산행 안전 근거 보정

- 대상: 공개 글 `p82` (`고혈압 심장질환 있어도 등산 가능한가`)
- 처리: 자동 안전 보정. 사람 편집 승인이나 개인별 운동 허가로 기록하지 않음.
- 공개 상태: 유지. 제목, slug 생성 입력, 배지 유지.
- 변경 범위: 근거가 확인되지 않은 통계·MET·혈압·표고차·거리·기온 표, 혈압 수치에 따른 산행 허가, 고정 수분량, 현장 니트로글리세린 투여 지시를 제거. 의료진과의 사전 계획, 점진적 활동, 증상 발생 시 중단과 119 신고로 교체.

## 공식 근거

- [American Heart Association — Getting Active to Control High Blood Pressure](https://www.heart.org/en/health-topics/high-blood-pressure/changes-you-can-make-to-manage-high-blood-pressure/getting-active-to-control-high-blood-pressure): 심혈관질환 등 기존 질환이 있으면 의료진과 확인하고 활동 강도를 점진적으로 높이는 원칙.
- [American Heart Association — Develop a Physical Activity Plan for You](https://www.heart.org/en/health-topics/cardiac-rehab/getting-physically-active/develop-a-physical-activity-plan-for-you): 운동 중 흉통, 어지럼·혼란, 비정상 호흡곤란, 불규칙 심박 등 경고 신호와 활동 중단 원칙.
- [CDC — About Heart Attack](https://www.cdc.gov/heart-disease/about/heart-attack.html): 심장마비 의심 증상과 즉시 응급의료서비스에 연락해야 하는 기준.

## 의도적으로 하지 않은 일

- 혈압 수치·표고차·거리만으로 개인의 산행 가능 여부를 판정하지 않음.
- 처방약의 용량·사용 횟수·투여 방법을 새로 제시하지 않음.
- 공개 상태, 제목, 배지, 운영 DB, 배포, 색인 또는 광고 계정을 변경하지 않음.

## 회귀 방지

- `lib/quality-gate.ts`: 고정 혈압 산행 허가, 산행 중 니트로글리세린 직접 투여, 혈압약 복용자의 고정 수분 일정을 차단.
- `scripts/verify-publication-safety.ts`: p82 공개 정체성, 공식 링크, 119 우선과 제거 문구 부재를 검증.
