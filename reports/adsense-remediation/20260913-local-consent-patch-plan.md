# Consent patch plan — local checkpoint

- Applied: remove the hardcoded AdSense client fallback; require `NEXT_PUBLIC_GOOGLE_CMP_READY=true` and the relevant service ID before Google tag loading.
- Applied: disclose the locally observed Coupang/multi-dashboard page-path and banner measurement boundary.
- Verified: monetization policy test, TypeScript, production build, and generated HTML samples.
- Manual/production only: confirm account ownership, visitor-region scope, ad mode, certified CMP/IAB TCF integration, consent withdrawal, and Consent Mode signals.
- Rollback: revert the layout, monetization-layer, privacy, verifier, and this report slice only. Do not reset unrelated worktree changes.

No CMP/account/environment mutation or deployment was performed.
