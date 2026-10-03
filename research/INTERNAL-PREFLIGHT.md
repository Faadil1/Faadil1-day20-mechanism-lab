# Day 20 — Internal Mechanism Preflight

Date: 2026-10-02  
Scope: logic validity before external blind testing  
Evidence class: LOCAL_VERIFIED for deterministic calculations; NOT_EXTERNAL_USER_EVIDENCE

## Findings repaired

### F-01 — Probe C previously lacked a causal branch
Before repair, the first two actions could not change the third item. The experience therefore asked the user to explain a cause that had not affected the tested position.

Repair:
- CONTINUE updates actionBias by -0.15, lower bound -0.60.
- LINGER updates actionBias by +0.30, upper bound +0.90.
- Ranking remains: `novelty + actionBias × depth`.

Deterministic consequence:
- CONTINUE → CONTINUE produces the prefix **F → H → B**.
- LINGER → LINGER produces the prefix **F → H → D**.

Therefore the user's first two observed actions can now change the third exposure.

### F-02 — The lab primed the participant with the thesis
The previous header displayed “Behavior is evidence. It is not intention.” before interaction, invalidating a blind comprehension test.

Repair:
- Added `?blind=1`.
- Added single-probe routing with `?probe=a`, `?probe=b`, or `?probe=c`.
- Blind mode removes the thesis and probe-switching tabs.
- Blind-mode introductions are neutral.

Expected hosted paths:
- `/?blind=1&probe=a`
- `/?blind=1&probe=b`
- `/?blind=1&probe=c`

### F-03 — Corpus choices were too semantically thin
Titles/topics alone made A/C actions arbitrary.

Repair:
- Added short semantic descriptions to all eight corpus items.
- A and C now expose enough content for a participant to have a reason to continue, linger, save, open, or skip.

### F-04 — Reveals explained the thesis too directly
Repair:
- Reveals now emphasize observable session trace.
- Model action and recorded state are displayed.
- Intention is shown as **NOT RECORDED / UNKNOWN**, without asserting what the participant meant.

## Deterministic checks

### Probe B example
Base coordinates:
- A = [120, 230]
- D = [580, 80]

A visit to A moves D because their similarity exceeds the 0.72 threshold.

Rule:
`D_new = D_old + 0.07 × (A - D_old)`

First movement:
- D_new ≈ [547.8, 90.5]
- displacement ≈ 33.9 px

This is a real state change produced by the local model rule.

### Probe C branch
Initial ranking uses novelty.

After two CONTINUE actions:
- bias after action 1 = -0.15
- bias after action 2 = -0.30
- third item = B

After two LINGER actions:
- bias after action 1 = +0.30
- bias after action 2 = +0.60
- third item = D

The tested position is therefore causally sensitive to prior observable behavior.

## Remaining unknowns

- Whether A's retrospective mismatch is understandable without coaching.
- Whether B's terrain movement is visually salient enough.
- Whether C's causal retrieval feels meaningful rather than puzzle-like.
- Which mechanism produces the strongest one-sentence participant explanation.
- Whether participants experience ambiguity, relief, curiosity, or indifference.

These are external-user questions and MUST NOT be promoted from internal reasoning.

## Preflight verdict

**INTERNAL_MECHANISM_PREFLIGHT = PROVEN**

This does **not** prove Comparative Mechanism Proof.

Exact next requirement:
1. host a preview bound to this branch/commit;
2. send one blind probe per participant;
3. run the canonical blind-test questions;
4. record results without coaching;
5. compare A/B/C before Concept Lock.
