# Google 광고·분석 동의 준비 상태

검토일: 2026-09-13

## 현재 로컬 계약

- `NEXT_PUBLIC_GOOGLE_CMP_READY`가 정확히 `true`이고 각 서비스 ID가 있을 때만 Google Analytics 또는 AdSense 로더를 출력한다.
- 기본값은 비활성이다. 현재 로컬 환경에는 CMP 준비 플래그, GA ID, AdSense client ID가 확인되지 않았다.
- 이 플래그는 동의 자체가 아니다. 운영에서 켜기 전에 적용 지역, 광고 모드, Google 인증 CMP, 거부·수락·철회 동작과 Consent Mode 신호를 실제 브라우저에서 확인해야 한다.
- 쿠팡 배너 제공·측정은 Google 동의 플래그와 별개이며, 실제 코드가 전송하는 현재 페이지 경로와 식별자를 개인정보처리방침에 고지했다.

## 공식 요구사항 근거

- EEA·영국의 개인화 광고는 2024-01-16부터, 스위스는 2024-07-31부터 Google 인증 CMP와 IAB TCF 통합이 요구된다: [Google CMP requirements](https://support.google.com/adsense/answer/13554020), [CMP requirements details](https://support.google.com/adsense/answer/13554116).
- Consent Mode를 쓰면 기본 동의 상태가 측정 명령보다 먼저 설정되어야 하고, 이용자 선택 직후 업데이트되어야 한다: [Set up consent mode](https://developers.google.com/tag-platform/security/guides/consent).
- Basic Consent Mode는 이용자 상호작용 전 Google 태그를 차단한다. Advanced Mode는 denied 상태에서도 cookieless ping을 보낼 수 있다: [Consent mode overview](https://developers.google.com/tag-platform/security/concepts/consent-mode).
- 비개인화 광고도 빈도 제한·집계 보고에 쿠키나 식별자를 사용할 수 있어 모든 지역에서 자동으로 동의 면제가 되는 것은 아니다: [Personalized and non-personalized ads](https://support.google.com/adsense/answer/9007336).

## 미확인 및 활성화 금지 조건

- EEA·영국·스위스 방문 여부: 미확인
- 운영 광고 모드 및 AdSense 유럽 규정 설정: 미확인
- 사용 CMP 이름·인증 상태·IAB TCF 통합: 미확인
- 최초 방문, 거부, 수락, 철회와 Consent Mode v2 신호: 미확인
- AdSense 계정과 `public/ads.txt` publisher ID의 실제 소유권 연결: 미확인

위 항목이 운영 증거로 확인되기 전에는 `NEXT_PUBLIC_GOOGLE_CMP_READY=true`를 설정하지 않는다.
