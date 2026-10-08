# Day 20 V4 — Paired Experiential Kill Test Packet

Date: 2026-10-08
Status: PREDECLARED / EXTERNAL PARTICIPANT EVIDENCE MISSING
Source: design/D4-V4-BURIED-PATH-EXPERIENTIAL-KILL-TEST.md
Engineering branch: build/v4-buried-path-kill-test

## Question

Does geology/stratification improve comprehension of a real behavioral feedback loop over a simpler route-based representation, or is it attractive decoration?

The product thesis remains:
**BEHAVIOR IS EVIDENCE, NOT INTENTION.**

## Conditions

- A — Sediment Atlas: `/?probe=strata`
- B — Route Register: `/?probe=route`

Same:
- original fictional three-artifact micro-corpus;
- canonical five-node, seven-edge graph;
- travel task, observations, deterministic route state;
- before/after snapshots, return task, recovery decision;
- neutral uncoached comprehension questions;
- no external recommender or proprietary algorithm inference.

Different:
- presentation of routes / surface metaphor (geological sediment vs route register).

The terms *Sediment Atlas* and *Route Register* are study-condition labels, **not final public names**.

## User flow

1. ENTER: participant is told only to locate a stable archive anchor.
2. TRAVEL: participant reaches Deep Time and records a real outbound route.
3. EXPLORE: participant visits two distinct original fictional specimens and explicitly keeps/passes them.
4. RETURN: deterministic cost updates may cover a previous connection; alternative traversal remains available.
5. REFLECT: user answers neutral, uncoached questions *before* causal reveal.
6. REVEAL: participant scrubs actual before/after snapshots with observed signal, rule, consequence and intention UNKNOWN.
7. ACT: participant restores the original routes or keeps the current graph. The explicit decision is recorded.
8. EXPORT: participant optionally copies a local JSON session receipt. No answers are uploaded by this app.

## Predeclared eligibility and decision thresholds

Small exploratory pilot, not a representative human study.
Start with 8 independent people: four A and four B. Counterbalance order/assignment across people without allowing an individual to see both versions before their initial uncoached questionnaire. Participants do not receive the thesis.

Score per participant from their **pre-reveal written answers**:
- C1: notices a navigational/path change or correctly says none materially affected them;
- C2: attributes changes to their explicit actions or records uncertainty, not merely "the site animates";
- C3: distinguishes logged behavior from the visitor's internal motivation, without being taught the conclusion;
- C4: identifies a real consequence of changing connections, including a benefit where applicable;
- C5: completes the first archive approach, two distinct specimen decisions and valid return without coaching.

Strong preliminary signal for a condition: at least 3 of 4 participants meet C2 and C3 and at least 3 of 4 complete C5. This is a **pilot signal only**, not promotion to Concept Lock.

If a condition misses 3/4 on core comprehension, verdict is REVISE or KILL pending failure analysis, not silent sample extension for a desired verdict. If both conditions pass similarly, choose the lower-complexity mechanism unless geology offers a clearly observed additional interaction benefit. Any isolated participant win is not a universal rule.

Do NOT select a winner based on:
- the appearance of the start screen;
- an aesthetically pleasing 3D concept;
- a single participant's reaction;
- memorizing a rehearsed demo route;
- a non-live or preseeded replay.

## Negative / boundary / recovery scenarios

- Participant passes a specimen and the local rule makes a route less useful.
- Participant reinforces an earlier route; feed-like optimization can **help**.
- An altered route becomes covered but Deep Time remains reachable.
- Participant selects a nonadjacent passage: no travel occurs.
- Repeated choice at one artifact cannot silently create multiple independent decisions.
- A participant cannot infer intention from KEEP / PASS; final reveal shows UNKNOWN.
- Restoring original routes is an explicit logged action, not a fake reset.
- Refresh restarts the local study; it is NOT interpreted as evidence or abandoned session data.

## Accessibility and renderer requirements

- The V4 kill test uses SVG/semantic controls and **does not instantiate WebGL**.
- Keyboard passage buttons and visible focus indicators.
- SVG has an accessible summary; primary actions do not depend on interpreting the drawing.
- Reduced-motion via prefers-reduced-motion; no information in animation alone.
- Small screens can horizontally traverse the atlas and operate the full route via buttons.
- Test real mobile browser interactions before asserting MOBILE PROVEN.

## Collection and privacy

- No automatic user account, backend, telemetry, server submission or analytics in the probe app.
- Nothing is uploaded by the app. Cloudflare still handles ordinary HTTP requests when hosted; avoid stronger "zero data processing" claims.
- Optional receipt export uses Clipboard API and may require secure origin/browser permission.
- Remove or avoid collecting personally identifying details in tester notes.
- Store anonymized external session review and owner notes within the project evidence workflow only with participant permission.

## Engineering proof is not user evidence

CI tests and production bundle, once passing, prove LOCAL_BUILD quality only.
A Cloudflare response proves a browser route is served, not that a stranger understood causality.
Until runtime evaluation:
- external comprehension: MISSING
- mobile usability: UNKNOWN
- WebGL-independence: IMPLEMENTED_IN_CODE; browser verification pending
- final concept / naming: BLOCKED

## Next actions

1. Green test/typecheck/build on build/v4-buried-path-kill-test.
2. Deploy isolated Preview to Cloudflare (not production main), bind branch+commit+URL.
3. Browser test both query routes, negative case, keyboard, mobile, reset and export.
4. Run uncoached participant pilot; log positive and negative outcomes.
5. Compare both conditions and issue KEEP / REVISE / KILL without post-hoc threshold changes.
