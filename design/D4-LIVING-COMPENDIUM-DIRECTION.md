# Day 20 — D4 Living Compendium — Selected Visual Direction

Date: 2026-10-04
Status: **SELECTED_VISUAL_DIRECTION / NOT_CONCEPT_LOCK**
Human selection: D4 — Living Compendium

## Selection truth

This selection resolves the visual/experience divergence gate only.

It does **not** prove:
- the final product concept;
- external participant comprehension;
- mechanism superiority;
- naming lock;
- release readiness.

The product truth remains:
**Behavior is evidence. It is not intention.**

## Creative device

**A LIVING COMPENDIUM THAT REARRANGES ITSELF AROUND OBSERVED BEHAVIOR.**

The user explores a world made of rich knowledge territories:
- ideas;
- places;
- people;
- concepts;
- artifacts;
- stories.

The world does not stay fixed.

Observed interaction changes adjacency:
- revisited territories become easier to reach;
- related territories move closer;
- neglected territories recede;
- bridges re-route;
- pathways appear or disappear;
- the user's visible world becomes a product of the model state.

The key experience is not a generic graph.
It is a **world that becomes personalized through spatial consequence**.

## Signature sequence

### 01 — ENTER
A coherent world exists before the participant touches it.

The user sees:
- a central navigable plaza / arch / threshold;
- several knowledge territories;
- distant landmarks;
- a stable route to Deep Time.

No explanation of personalization.

### 02 — EXPLORE
The participant opens and revisits territories.

The model observes:
- visits;
- returns;
- dwell;
- explicit keep/pass actions when used;
- route choices.

Each signal changes actual world-state variables.

### 03 — REORGANIZE
The world slowly rearranges:
- bridges bend;
- platforms drift;
- nearby material clusters;
- peripheral territories recede;
- Deep Time changes relative position.

The movement is legible but not announced.

### 04 — FIND DEEP TIME AGAIN
The system asks:
**FIND DEEP TIME AGAIN.**

The user must navigate the world that their observed behavior helped reshape.

### 05 — PERSONAL MAP REVEAL
The visual system transitions from immersive world → causal map.

Reveal layers:
1. WORLD YOU ENTERED
2. WORLD YOU LEFT
3. WHAT MOVED
4. WHICH OBSERVATIONS CAUSED EACH MOVEMENT
5. INTENTION: UNKNOWN unless explicitly stated

Final question:
**WHICH PART OF THIS WORLD WAS YOURS?**

## Visual language

### Material
- warm ivory stone;
- charcoal void;
- muted brass;
- dim celestial blue;
- restrained vermilion for causal reveal only.

Avoid:
- neon cyberpunk;
- glassmorphism;
- generic AI gradients;
- holographic SaaS cards;
- dark-blue dashboard defaults.

### Form
- impossible architectural atlas;
- floating editorial monuments;
- arches, terraces, bridges, pedestals;
- content is embedded in architecture, not floating UI chrome;
- deep atmospheric perspective;
- real spatial hierarchy.

### Typography
- display serif for chapter/territory naming;
- quiet grotesk/sans for interaction and evidence;
- large editorial scale contrast;
- minimal copy while inside the world.

### Motion
Motion must communicate world-state change.

Allowed:
- slow attraction;
- bridge re-routing;
- platform translation;
- depth shift;
- camera parallax;
- light moving along active route;
- subtle accumulation of causal traces.

Not allowed:
- ambient motion with no state meaning;
- random particles;
- decorative floating;
- cinematic camera moves that obscure interaction.

## Creative law

**THE WORLD REORGANIZES AROUND WHAT THE SYSTEM THINKS YOUR BEHAVIOR MEANS.**

Human-facing short line candidate:
**A WORLD THAT REARRANGES ITSELF.**

## Truth boundary in visuals

Never render:
- “interest” as proven;
- “preference” as proven;
- “you wanted this”;
- emotional diagnosis;
- proprietary platform logic.

Render instead:
- OBSERVED: visited / returned / paused / kept / passed;
- MODEL: affinity weight / proximity update / route priority;
- CONSEQUENCE: moved / connected / receded / rerouted;
- INTENTION: UNKNOWN.

## Desktop composition

Target: 1440 × 900 minimum.

Primary layers:
1. cinematic world viewport;
2. sparse territory labels;
3. minimal route affordance;
4. context-sensitive interaction prompt;
5. no persistent dashboard;
6. reveal mode can overlay causal lines and evidence.

## Mobile composition

Target: 390 × 844.

Do not shrink the desktop world.

Mobile transformation:
- one spatial corridor at a time;
- swipe / drag to look;
- tap landmark to travel;
- compact breadcrumb only when needed;
- Deep Time return task remains possible;
- final reveal becomes vertical sequence:
  ENTERED → LEFT → MOVED → CAUSED BY.

## Reduced motion / fallback

Same canonical model state.

Fallback surface:
- 2D axonometric atlas / SVG;
- state changes use discrete stepped transitions;
- causal reveal remains complete;
- no required WebGL-only information.

## Rendering architecture

Preferred:
- React
- React Three Fiber / Three.js
- D3-force or custom deterministic force model
- Motion for DOM/text transitions
- Zustand or equivalent lightweight state store only if necessary

Core rule:
rendering may change, canonical world state must not.

## Canonical state model sketch

```
world.nodes[]
world.edges[]
world.positions{}
world.visibility{}
world.routeWeights{}
session.observations[]
model.affinities{}
model.transitions[]
reveal.causes[]
```

Each world mutation must have:
- observation_id;
- rule_id;
- prior_state;
- new_state;
- causal receipt.

## Must-build visual proof set

1. **Desktop / Initial World**
2. **Desktop / Reorganized World**
3. **Desktop / Find Deep Time Again**
4. **Desktop / Personal Map Reveal**
5. **Mobile / Initial World**
6. **Mobile / Reorganized World**
7. **Mobile / Reveal**

## Promotion criterion

D4 moves from visual direction to coded experience architecture only if:
- desktop and mobile visual artifacts are coherent;
- spatial transformation makes the causal mechanism clearer, not merely prettier;
- Deep Time return task remains usable;
- final reveal preserves OBSERVED / MODEL / CONSEQUENCE / UNKNOWN;
- implementation can degrade to 2D without losing product truth.

## Next gate

`D4_LIVING_COMPENDIUM__VISUAL_PROOF_SET_001`
