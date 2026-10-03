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
