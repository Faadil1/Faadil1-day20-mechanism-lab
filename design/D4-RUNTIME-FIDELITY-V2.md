# D4 Runtime Fidelity V2 — World Scale & Monumentality

Date: 2026-10-04
Status: **IMPLEMENTED / CI GREEN / RUNTIME REVIEW PENDING**

## Trigger

Human review of the first D4 live runtime and Fidelity V1 concluded that the project was functionally real but still visually below the approved Day Challenge bar.

Largest remaining gaps:
- world too compact / diorama-like;
- territory architecture not distinct enough;
- gold/brass overused;
- weak foreground / midground / horizon separation;
- world reorganization too subtle;
- navigation index still visually prominent;
- Deep Time challenge copy stronger than the spatial tension itself.

## V2 design response

### 1. World scale

The renderer now expands the canonical baseline world by a fixed display scale:

`BASE_SCALE = 1.55`

Territories sit farther apart, some approach the edge of frame, and the world extends beyond a single centered diagram.

### 2. Deterministic visual consequence amplification

The canonical world model is unchanged.

For each territory:

```
display_position =
  scaled_baseline +
  (canonical_current - canonical_baseline) * MUTATION_GAIN
```

with:

`MUTATION_GAIN = 5.2`

This makes a real canonical movement perceptually legible without inventing a different causal event.

Truth boundary:

- canonical mutation = source of truth;
- display distance = cinematic visualization of that mutation;
- causal replay receipts continue to reference canonical mutations;
- display amplification must never be reported as the literal model distance.

### 3. Territory-specific architecture

The eight territories now have distinct spatial identities:

- IDEAS → archive colonnade;
- CONCEPTS → orbital observatory;
- DEEP TIME → temporal spire;
- STORIES → amphitheatre / narrative surface;
- ARTIFACTS → reliquary;
- PEOPLE → orbital forum;
- PLACES → topographic terraces;
- SYSTEMS → nested mechanism.

The goal is landmark memory: a participant should be able to recognize a territory from silhouette, not only from its label.

### 4. Material hierarchy

Gold is no longer the global material.

Territory palettes now include:
- ivory / parchment;
- slate;
- oxblood / clay;
- cool blue-grey;
- moss / stone;
- charcoal;
- restrained brass as connective accent;
- vermilion reserved for causal state.

### 5. Foreground / midground / horizon

Added:
- foreground ruins partially off-screen;
- larger middle atlas;
- distant procedural skyline;
- three spatial rings;
- longer bridges;
- atmospheric fog and cooler horizon light.

The world should imply continuation beyond the viewport.

### 6. Deep Time return tension

The task copy is reduced in visual dominance.

The world itself should communicate displacement:
- more space between landmarks;
- routes have visibly changed;
- Deep Time is still reachable but no longer trivially framed.

Copy:
`THE ATLAS HAS MOVED`
`Find Deep Time again.`

### 7. Accessibility/navigation chrome

The landmark index remains available but is visually de-emphasized:
- low opacity at rest;
- full opacity on hover/focus;
- semantic buttons preserved.

This keeps accessibility without making the index the primary visual object.

## Product truth preserved

No changes to:
- `src/world.ts`;
- observation types;
- deterministic model;
- Deep Time gate;
- mutation log;
- INTENTION=UNKNOWN rule;
- test invariants.

## Performance considerations

V2 adds geometry but does not add:
- external 3D assets;
- large textures;
- shader packs;
- post-processing dependencies;
- new runtime packages.

Procedural textures remain canvas-generated locally.

Performance must be checked in live browser before promotion.

## Exact next gate

`D4_RUNTIME_FIDELITY_V2__LIVE_VISUAL_REVIEW`

## Review criteria

Human review should answer:
1. Does this finally read as a **world**, not a diagram?
2. Are territories memorable from architecture/silhouette?
3. Does the world feel larger than the viewport?
4. Does reorganization feel consequential?
5. Is Deep Time return spatially tense without excessive text?
6. Is the atlas index subordinate?
7. Is the result materially closer to the approved D4 visual proof?
8. Does mobile remain usable?

If any of 1–4 are still materially weak, V2 is **REVISE**, not “good enough.”


## CI verification

GitHub Actions run:
`37235565466`

Head:
`f3080a122adae38621b673023591ad318d9753a2`

Result:
- install: PASS
- deterministic model tests: PASS 5/5
- TypeScript typecheck: PASS
- Vite production build: PASS

This proves build integrity only. It does not prove visual quality or live-browser performance.
