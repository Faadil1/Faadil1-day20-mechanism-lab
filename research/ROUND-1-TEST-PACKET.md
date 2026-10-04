# Day 20 — External Blind Test Round 1

Status: **PAUSED — WAITING FOR v0.2 RUNTIME VERIFICATION**  
Gate: `COMPARATIVE_MECHANISM_PROOF__EXTERNAL_BLIND_TEST_ROUND_1`

## Rule

One participant sees **one probe only** before answering.

Do not mention:
- algorithms;
- recommendation systems;
- old web / new web;
- nostalgia;
- the working law;
- the intended interpretation.

Do not coach a participant toward the thesis.

## Neutral message to send

> I’m testing a short interactive web experiment.  
> Use it however feels natural. There is no correct way to interact.  
> When you finish, I’ll ask you a few questions about what you think happened.

## Seed assignment

This is an initial balanced round, **not a fixed sample-size rule**.

| Participant | Probe | Link |
|---|---|---|
| P01 | A | https://e037fb87.faadil1-day20-mechanism-lab.pages.dev/?blind=1&probe=a&pid=P01 |
| P02 | B | https://e037fb87.faadil1-day20-mechanism-lab.pages.dev/?blind=1&probe=b&pid=P02 |
| P03 | C | https://e037fb87.faadil1-day20-mechanism-lab.pages.dev/?blind=1&probe=c&pid=P03 |
| P04 | A | https://e037fb87.faadil1-day20-mechanism-lab.pages.dev/?blind=1&probe=a&pid=P04 |
| P05 | B | https://e037fb87.faadil1-day20-mechanism-lab.pages.dev/?blind=1&probe=b&pid=P05 |
| P06 | C | https://e037fb87.faadil1-day20-mechanism-lab.pages.dev/?blind=1&probe=c&pid=P06 |

If evidence is contradictory or too weak after P06, continue cyclically A → B → C. Do not stop merely because six participants were reached.

## Ask immediately after use

Ask these in order, before explaining anything:

1. **What do you think happened?**
2. **What did the system actually know about you?**
3. **What do you think it inferred?**
4. **Did anything change because of that inference?**
5. **What felt surprising, useful, uncomfortable, or unclear?**
6. **Describe the experience in one sentence.**

Then ask:

7. **What do you think the experiment was trying to make you notice?**

Only after recording question 7 may the thesis be explained.

## Record literally

Prefer the participant's own words. Do not rewrite an answer into our terminology.

Record:
- participant ID;
- probe;
- completion state;
- answers Q1–Q7;
- whether they independently identified a causal chain;
- whether they recognized that intention was not actually known;
- whether they required coaching;
- any product defect or confusion;
- interviewer notes clearly separated from participant words.

## Scoring

### Causal comprehension
- `2 = spontaneous`: independently describes action → system interpretation → changed consequence.
- `1 = partial`: notices personalization/change but not the causal chain.
- `0 = absent`: does not identify a causal consequence.

### Truth-boundary comprehension
- `2 = spontaneous`: explicitly distinguishes what the system observed from what it could not truly know.
- `1 = partial`: expresses uncertainty about what the system knew.
- `0 = absent`: assumes the system knew their actual intention/preference.

### Felt consequence
- `2 = clear`: participant noticed a meaningful system-induced change.
- `1 = weak`: change noticed but not meaningful.
- `0 = none`: no consequence perceived.

### Explanation dependence
- `0 = no coaching needed`
- `1 = minor clarification needed`
- `2 = thesis had to be explained`

Lower is better only for explanation dependence.

## Kill / repair signals

A probe should be killed or repaired if repeated users:
- describe it only as a generic feed or recommendation demo;
- fail to notice that their action changed anything;
- interpret the reveal as proof that the system knows their true preference;
- need the thesis explained before the mechanism makes sense;
- focus on a usability defect rather than the intended causal phenomenon.

## Promotion signal

Do not pick a winner from aesthetics or one enthusiastic participant.

A mechanism becomes a **Concept Lock candidate** only when multiple independent participants:
1. identify behavior → inference → consequence without coaching;
2. preserve the distinction between observed behavior and unknown intention;
3. experience a consequence strong enough to remember and describe;
4. do not collapse the piece into “algorithms are bad.”

## After Round 1

Update:
- `research/blind-test-results/`;
- `governance/EVIDENCE-GRAPH.yaml`;
- `governance/PRODUCT-REALITY-PACKET.yaml`;
- `state/CURRENT.yaml`.

Then:
1. compare A/B/C;
2. kill or repair weak mechanisms;
3. re-run collision research on survivors;
4. only then review Concept Lock.


## v0.2 hold

Do not send the old deployment-specific URL to participants until the v0.2 Cloudflare preview is verified.

Surface repair receipt:
`research/SURFACE-LEGIBILITY-REPAIR-2026-10-04.md`

When the new preview URL is verified, replace the URL base in this packet before starting P01.
