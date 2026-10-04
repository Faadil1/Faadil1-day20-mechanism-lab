# Cloudflare Preview Verification — 2026-10-02

Evidence class: **LIVE PREVIEW / PARTIAL GRAPH BINDING**

Runtime:
`https://e037fb87.faadil1-day20-mechanism-lab.pages.dev/`

Observed:
- root preview returned the Day 20 comparative mechanism lab;
- `?blind=1&probe=a` returned the neutral interaction-study framing for Probe A;
- `?blind=1&probe=b` returned the neutral map framing for Probe B;
- `?blind=1&probe=c` returned the neutral sequence framing for Probe C;
- the deployed content reflected the repaired blind-mode copy.

Not proven:
- exact Cloudflare deployment → Git commit SHA binding;
- full browser interaction on all controls through an automated E2E runner;
- external-user comprehension;
- production readiness.

Truth boundary:
the runtime is a **Cloudflare Pages preview**, not a production release.


## v0.2 runtime re-verification — 2026-10-04

Cloudflare deployment URL:
`https://26ca31b8.faadil1-day20-mechanism-lab.pages.dev/`

Cloudflare dashboard source:
`ca20606f22c954b0559ccbe3381f509b3fcfca07` (displayed as `ca20606`)

Observed v0.2 content markers at runtime:
- `The map is yours to move through.`
- `Read naturally. Move on whenever you want.`
- neutral blind framing `INTERACTION STUDY / Try this short experiment.`

Blind route checks:
- `?blind=1&probe=a&pid=P01`
- `?blind=1&probe=b&pid=P02`
- `?blind=1&probe=c&pid=P03`

Binding verdict:
**RUNTIME → COMMIT → DEPLOYMENT = PROVEN for this preview deployment.**

Scope boundary:
This proves deployment identity/content binding, not external participant comprehension and not full automated browser interaction coverage.
