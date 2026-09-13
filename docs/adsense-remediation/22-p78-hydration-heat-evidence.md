# p78 hydration and heat-illness correction evidence — 2026-09-13

## Publication boundary

- Effective public ID, title, category, badges and slug remain unchanged: `p78`, `산행 탈수 예방 — 수분 보충 올바른 방법`, `안전`, `탈수예방|수분`, `/blog/산행-탈수-예방-수분-보충-올바른-방법-p78`.
- This is an automated official-source correction, not diagnosis, treatment, individualized fluid advice, source verification, or human editorial approval.

## Removed high-risk claims

- Universal hourly, hot-weather, incline-addition, pre-load and total-volume formulas.
- Unsupported dehydration/performance percentages and thirst/urine field diagnosis.
- Mandatory electrolyte timing and water-alone causal shortcut.
- The low temperature plus reduced-sweating heatstroke test.
- Beverage-response reassurance and time-only return to activity.

## Replacement contract

- Individual and route-context planning, drink to relieve thirst/comfort, and no forced intake.
- Heatstroke recognition by altered mental status, seizure, collapse and other emergency signs; sweating can still occur.
- Immediate 119 plus rapid available cooling, with safe airway observation.
- Nothing by mouth for confusion, impaired consciousness, vomiting or unsafe swallowing.
- Explicit excessive-intake/hyponatremia and rhabdomyolysis safeguards; no field salt treatment.
- No same-day restart after suspected heatstroke or severe neurologic/systemic symptoms; clinician-led return where indicated.

## Official sources

- 질병관리청 온열질환 응급조치: https://www.kdca.go.kr/contents.es?mid=a20205030103
- CDC/NIOSH heat-related illness: https://www.cdc.gov/niosh/heat-stress/about/illnesses.html
- CDC Yellow Book heat illness and exercise-associated hyponatremia: https://www.cdc.gov/yellow-book/hcp/environmental-hazards-risks/heat-and-cold-illness-in-travelers.html
- 기상청 and 국립공원공단 are linked for current weather/control checks.

## Fresh verification

- Independent Luna(max) read-only review confirmed the remove/replace matrix and official-source boundaries.
- `PUBLICATION_SAFETY_OK`; the new general hydration rules also newly contain p84's fixed six-hour minimum-water claim.
- `CONTENT_SAFETY_RENDER_OK affected_posts=7`.
- `pnpm audit:remediation` — 1,276 URLs, 344 posts, 329 legacy signals, 18 findings; p78 left the top-risk list.
- TypeScript `--noEmit` and the 1,305-page production build passed.
- Generated p78 HTML contains KDCA, CDC/NIOSH and CDC Yellow Book links, immediate 119, safe-swallowing, overdrinking and unfinished-human-review language. It contains no legacy fixed formula, false heatstroke threshold, or redaction placeholder.
- Scoped `git diff --check` passed with only existing LF-to-CRLF warnings.
