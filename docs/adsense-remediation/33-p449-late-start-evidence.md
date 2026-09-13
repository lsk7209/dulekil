# p449 late-start correction evidence — 2026-09-13

## Publication boundary

- Effective identity remains `p449`, `초보가 피해야 할 산행 약속 시간 — 오전 10시 출발이 위험한 이유`, category `가이드`, palette `guide`, badges `늦은 산행 출발 위험|오전 10시 등산|일몰 하산`, and its existing generated slug.
- The post remains public and explicitly human-unreviewed. Its title is contextualized: 10:00 is not a universal danger threshold and no clock time is approved.

## Removed high-risk claims

- Universal one/two-hour pre-sunset margins and a fixed 15:00 ridge ban.
- Generator variants using 13:00/14:00 summit cutoffs and a 90-minute return buffer.
- Treating 10:00 departure and sunset as equal standalone criteria.
- A three-item clock formula and nearby-forest substitution presented as safer without route evidence.
- Weather-only sourcing for trail control, transport and operating facts.

## Replacement contract

- Judge the actual trailhead entry rather than meeting time and require the mountain/date/official course before evaluating a clock time.
- Use managing-agency controls, official entry hours, actual sunset, surface/weather, party function and every exit's day-of transport.
- Reassess at reversible points and finish on an already verified official exit; never speed up for the last service or improvise a shortcut.
- Give every participant authority to shorten, turn back or cancel and contact 119 early for serious symptoms, injury, loss or uncertain safe descent.

## Shared generator repair

- Replaced the common 13:00 summit, 90-minute buffer, 14:00/rain-percentage gate, fixed 15:00 ridge ban and one-hour sunset exclusion in `posts-generated-100.ts`.
- The repair affects the common generated branch rather than hiding 21 newly detected posts. Artifact p425 confirms the fixed 15:00 text is absent and current-sunset/operating guidance is present.

## Official sources

- Korea National Park Service: https://www.knps.or.kr/
- National Park entry-time information: https://res.knps.or.kr/
- Korea Forest Service: https://www.forest.go.kr/
- Korea Meteorological Administration: https://www.weather.go.kr/
- Seoul Metro Cyber Station: https://www.seoulmetro.co.kr/kr/cyberStation.do
- Seoul TOPIS: https://topis.seoul.go.kr/
- National Fire Agency 119 guide: https://www.nfa.go.kr/nfa/safetyinfo/emergencyservice/119emergencydeclaration

## Fresh verification

- The first independent result mapped the wrong generator index; after leader evidence, Luna(max) rechecked the effective p449 identity and confirmed all fixed clock/buffer variants and source gaps.
- The first regression rejected numeric repetition in negative prose; wording was corrected without weakening the gate. The next run exposed the shared 15:00 generator defect across 21 posts; the generator was repaired instead of expanding containment.
- `PUBLICATION_SAFETY_OK`; fixed-rule containment fell from three to two source-preserved posts: p335/p407.
- `CONTENT_SAFETY_RENDER_OK affected_posts=7`; TypeScript `--noEmit`; audit 1,276 URLs/344 posts/329 signals/18 findings; 1,305-page build passed.
- Generated p449 HTML contains official multi-source, actual-sunset and review-pending text with no redaction. Generated p425 contains the shared safe replacement and no old 15:00 rule or redaction.
