# Day 20 — Comparative Mechanism Proof

**Status:** PRE-CONCEPT / NOT CONCEPT-LOCKED

This repository is the canonical research workspace for Day 20.

## Research law under test

**Behavior is evidence. It is not intention.**

Research question:

> What happens when a system learns what you do faster than you can tell it what you mean?

The project intentionally does **not** simulate TikTok, Instagram, X, or any proprietary recommender. All inference rules used in the mechanism lab are local, deterministic, inspectable, and truth-bounded.

## Surviving probes

### A — Retrospective Mismatch
Tests the tension between a stated session intention and a tiny model inferred from observable behavior.

Truth boundary:
- stated session goal = OBSERVED
- actions = OBSERVED
- model weights = OBSERVED
- true intention inferred from behavior = UNKNOWN

### B — Who Moved the World?
Tests whether behavior → inference → consequence can be felt through a self-modifying information terrain.

Truth boundary:
- node visit = OBSERVED
- deterministic similarity rule = OBSERVED
- terrain movement = OBSERVED
- meaning of the visit = UNKNOWN unless explicitly stated

### C — Unretraceable Cause
Tests content memory versus causal memory by asking the participant to retrieve an earlier item and explain why it appeared when it did.

## Comparative kill test

Do **not** score aesthetic preference.

Fail:
> “social media algorithms are bad.”

Promising:
> “the system interpreted what I did, changed what came next, and I’m not sure that interpretation matched what I meant.”

A mechanism cannot advance merely because it looks compelling. It must create a felt, inspectable consequence without requiring the thesis to be explained first.

## Killed directions

- nostalgia / old-web revival as the core concept
- Y2K / Windows / GeoCities reconstruction
- “serendipity was lost”
- algorithmic vs chronological feed as the solution
- filter-bubble / polarization as the central thesis
- “give users more controls”
- visible links / trails alone
- human curation good / machine curation bad
- fake proprietary-algorithm explanation

## Current research synthesis

The six-review process (Gemini, Grok, Claude, DeepSeek bonus, Perplexity, Kimi; GPT central synthesis) converged on a stronger territory than the original nostalgia prompt:

```
WHAT I WANT
      ↓
WHAT I DO
      ↓
WHAT THE SYSTEM THINKS I WANT
      ↓
WHAT THE SYSTEM CHANGES
      ↓
WHAT I ENCOUNTER NEXT
      ↓
WHAT I DO NEXT
      ↺
```

The material phenomenon is not that a recommender necessarily removes agency or serendipity. It is that **observable behavior is used as evidence about intention, that interpretation can change the environment, and the user may not be able to reconstruct or endorse the causal chain.**

## Negative event

Observed behavior can optimize immediate engagement while diverging from reflectively endorsed preference.

This repo must preserve that contradiction rather than turning the project into an anti-algorithm sermon.

## Next gate

**COMPARATIVE_MECHANISM_PROOF**

Run blind tests across A/B/C with the same protocol. Promote only a mechanism that participants can describe without being coached into the thesis.

Concept Lock remains **BLOCKED** until comparative evidence exists.
