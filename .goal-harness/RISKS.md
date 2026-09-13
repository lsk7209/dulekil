# RISKS

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Existing dirty work overlaps the broad project | High | High | exact-file review; no reset/clean; isolated release later | Active |
| Production still serves confirmed P0 | High | High | local fix complete; deployment explicitly separated | Open |
| Trail rows are misidentified or incomplete routes | High | High | conservative display policy; snapshot-backed migration next | Contained locally |
| Bulk content signals mistaken for errors | High | Medium | signals require URL-level source/human review; no automated state change | Controlled |

## Risk Notices

No production DB, deployment, account, bulk visibility, or destructive action is authorized or executed. A consistent snapshot and dry-run diff are prerequisites to data writes.
