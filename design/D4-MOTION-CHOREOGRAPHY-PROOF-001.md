# D4 Living Compendium — Motion Choreography Proof 001

Date: 2026-10-04
Status: ACTIVE / PRE-CODE MOTION PROOF
Visual source of truth:
- approved desktop D4 storyboard
- approved mobile D4 proof set

## Motion law

**Movement is consequence.**

No material object moves unless one of these is true:
1. a user action changed canonical world state;
2. a route transition is occurring;
3. a narrative reveal is exposing a real causal receipt.

Decorative ambient motion must remain subordinate and cannot imply state change.

## Global timing language

### Micro
120–220ms
- button press
- hover/focus response
- label emphasis
- route pulse start

### Local world response
500–900ms
- territory moves closer
- bridge endpoint bends
- landmark shifts
- route weight changes visually

### Structural world transition
1100–1800ms
- multi-territory reorganization
- camera reframing
- route network settling
- reveal overlay emerging

### Narrative beat
1800–3200ms
- ENTER
- FIND DEEP TIME AGAIN
- WORLD YOU ENTERED → WORLD YOU LEFT
- CAUSAL REPLAY

## Easing

Primary:
- cubic-bezier(0.22, 0.8, 0.24, 1)

World settling:
- spring-like critically damped motion
- no elastic bounce

Route/bridge bending:
- continuous curvature interpolation
- no sudden node teleportation unless a failure scenario explicitly tests it

Camera:
- ease-in-out with low overshoot
- never rotate faster than the user's ability to maintain orientation

## Sequence 01 — ENTER

Duration: ~2.4s after explicit ENTER action.

0.0–0.3s
- CTA compresses and fades.
- foreground vignette opens.

0.3–1.2s
- camera advances toward central arch.
- Deep Time remains visible as a stable landmark.
- nearby territories gain labels progressively.

1.2–2.4s
- first route lights activate.
- world reaches stable initial state.
- no inferred personalization yet.

Product meaning:
**baseline world exists before behavior.**

## Sequence 02 — TERRITORY FOCUS

Trigger:
user selects/approaches a territory.

0.0–0.2s
- selected territory receives a thin brass outline.
- route to it brightens.

0.2–0.8s
- camera translates, not cuts.
- nearby labels reduce opacity rather than disappear.

0.5–0.9s
- interaction receipt is written to canonical session state.

If state model changes:
the next sequence begins only after the receipt exists.

## Sequence 03 — WORLD REORGANIZES

Trigger:
canonical model emits one or more spatial consequences.

### Example
OBSERVED: RETURNED to IDEAS
MODEL: affinity +0.15
CONSEQUENCE:
- IDEAS moves 8% closer
- CONCEPTS moves 5% closer
- bridge IDEAS↔CONCEPTS shortens
- PLACES route weight decreases

### Choreography
0.0–0.25s
- local route pulse identifies origin of change.

0.25–1.1s
- affected platforms move in depth and lateral position.
- bridges bend continuously.
- route light intensity follows canonical route weight.

1.1–1.5s
- secondary territory settles.
- camera compensates slightly to preserve orientation.

1.5–1.8s
- state settles completely.
- no idle movement after settle except low-level environmental life.

Product meaning:
**behavior changed the world before the user explicitly described intention.**

## Sequence 04 — ACCUMULATION

As multiple consequences occur:
- do not replay each as a full cinematic beat;
- use smaller 500–800ms local changes;
- every third/fourth material state change may trigger a subtle camera reframe.

The participant should gradually notice:
**the world is no longer where it started.**

Do not show a personalization badge or explanation.

## Sequence 05 — FIND DEEP TIME AGAIN

Trigger:
participant has completed the minimum exploration threshold.

0.0–0.7s
- ambient UI disappears.
- world darkens by ~8–12%.
- route lights reduce to neutral.

0.7–1.4s
- large editorial copy fades in:
  **FIND DEEP TIME AGAIN.**

1.4–2.0s
- camera settles to a position where Deep Time is reachable but not trivially centered.

User regains control.

Rules:
- Deep Time must remain reachable.
- no forced camera path to target.
- no glowing objective marker directly on Deep Time.
- the changed topology itself is the task.

Product meaning:
**navigate the world created by prior model consequences.**

## Sequence 06 — RETURN SUCCESS

When Deep Time is reached:

0.0–0.3s
- route locks in.
- Deep Time threshold brightens.

0.3–1.0s
- world freezes spatially.
- environmental audio/motion attenuates.

1.0–1.8s
- camera pulls back enough to reveal accumulated topology.

Then:
transition to reveal.

## Sequence 07 — WORLD YOU ENTERED → WORLD YOU LEFT

Duration: ~3.0s.

### Layer A
**WORLD YOU ENTERED**
- ghost geometry at initial coordinates
- ivory/graphite
- thin original paths

### Transition
1.0–2.0s
- final world geometry fades in over baseline
- original geometry remains as ghost traces
- movement vectors appear only for material changes

### Layer B
**WORLD YOU LEFT**
- current geometry fully material
- changed paths highlighted
- no moral judgment

Product meaning:
**the difference is observable.**

## Sequence 08 — CAUSAL REPLAY

The replay is generated from the actual mutation log.

For each material event:
1. highlight observed action;
2. show rule applied;
3. animate exact downstream consequence;
4. label intention as UNKNOWN unless explicitly stated.

Example:
```
OBSERVED
RETURNED → IDEAS

MODEL
affinity +0.15

CONSEQUENCE
CONCEPTS moved closer
bridge shortened

INTENTION
UNKNOWN
```

Timing per event:
1.2–1.8s.

Events may be grouped if they share a rule and would otherwise create repetitive motion.

## Sequence 09 — FINAL QUESTION

After replay:

World becomes still.

Copy:
**WHICH PART OF THIS WORLD WAS YOURS?**

Then, if the selected narrative ending is retained:

**WE OBSERVED WHAT YOU DID.**
**WE NEVER KNEW WHAT YOU MEANT.**

Do not use:
- “we knew you”
- “your true preference”
- “the algorithm understood you”

## Mobile motion transformation

Mobile is not a miniature desktop.

### Navigation
- one dominant corridor/territory cluster at a time;
- horizontal/vertical drag rotates or pans within bounded limits;
- tap territory = travel;
- camera movement shorter than desktop.

### Reorganization
- foreground platform translates 12–24px screen-space;
- background clusters move in depth;
- route curves redraw visibly;
- avoid simultaneous movement of the entire screen.

### Deep Time task
- landmark remains detectable via architecture, not objective HUD.

### Reveal
vertical narrative:
1. ENTERED
2. LEFT
3. WHAT MOVED
4. WHY IT MOVED
5. INTENTION UNKNOWN

## Reduced-motion mode

Same canonical state, no lost information.

Replace:
- continuous camera travel → crossfade + stepped spatial update
- bridge bending → before/after path swap
- platform drift → discrete position interpolation under 200ms
- long replay → static event cards connected to before/after mini-maps

Preserve:
- exact positions before/after
- causal receipts
- Deep Time reachability
- observed/model/consequence/unknown truth boundary

## Sound-design hypothesis — NOT YET REQUIRED

Potential mapping only:
- observation receipt = soft dry click
- route activation = restrained metallic harmonic
- world shift = low spatial rumble
- Deep Time task = environmental attenuation
- causal replay = isolated per-event sonic marker

No sound implementation until motion prototype proves useful without it.

## Motion proof acceptance criteria

PROVEN only if:
- the user can maintain spatial orientation through reorganization;
- the world change is visible without explanation;
- camera never becomes the spectacle instead of the mechanism;
- Deep Time task remains solvable after transformation;
- replay corresponds exactly to mutation log;
- reduced motion preserves all causal meaning;
- mobile choreography remains usable with one hand;
- no decorative effect implies unsupported inference.

## Next gate after approval

`D4_CODED_SPATIAL_VERTICAL_SLICE_001`

Only then migrate from the current static lab into a real spatial renderer.
