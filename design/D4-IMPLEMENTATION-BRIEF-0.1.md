# D4 Living Compendium — Implementation Brief 0.1

Status: PRE-CODE VISUAL PROOF

## Core architectural principle

**One canonical world-state, multiple renderers.**

The visual world must never become the source of truth.
The deterministic model owns positions, relationships and consequences.

## Suggested stack

### Core
- TypeScript
- React
- Vite or Next.js only if routing/content scale requires it
- Zustand optional

### Spatial renderer
- React Three Fiber / Three.js

### Layout dynamics
- D3-force for inspectable force relationships
- custom deterministic constraints for landmarks/bridges

### UI/motion
- Motion
- semantic HTML overlay for labels, accessibility and prompts

## Do not introduce yet
- AI model inference;
- backend;
- vector database;
- GSAP;
- Rive;
- particle library;
- shader stack;
- CMS.

Add only after a concrete job survives the visual proof gate.

## World-state requirement

Every transformation is serializable.

Example:

```json
{
  "observation": {"type":"RETURN","node":"ART","value":1},
  "rule":"RETURN_INCREASES_LOCAL_AFFINITY",
  "before":{"ART_CONCEPTS":0.42},
  "after":{"ART_CONCEPTS":0.57},
  "consequence":{"CONCEPTS":{"distanceDelta":-18}}
}
```

## Runtime receipt

The final reveal should be derivable from the same mutation log that drove the world.

No separate fake replay.

## Performance target

Desktop:
- stable 60fps on representative modern laptop where practical;
- graceful reduction on integrated graphics.

Mobile:
- target usable interaction first;
- lower geometry/material complexity;
- no required continuous physics after state settles.

## Accessibility

- keyboard-accessible landmark list;
- semantic alternate navigation;
- reduced-motion renderer;
- high-contrast labels;
- no critical information encoded only in depth/color.

## Test invariants

- same observation sequence = same canonical world state;
- renderer reset restores baseline;
- Deep Time remains reachable in every valid state;
- no node can become permanently unreachable unless a deliberate scenario tests that failure;
- reveal receipt can explain every material move;
- UNKNOWN remains available when intention is not explicitly provided.
