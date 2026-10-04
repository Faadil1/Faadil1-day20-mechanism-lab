# D4 Runtime Fidelity Pass v1

Date: 2026-10-04
Status: **IMPLEMENTED / CI GREEN / RUNTIME REVIEW PENDING**

## Trigger

Human owner feedback on the first live D4 vertical slice:

> "mais visuellement c'est pas encore ca"

The first live runtime proved the spatial mechanism but remained visually closer to a technical R3F prototype than the human-approved D4 Living Compendium direction.

## Gap observed

Compared with the approved D4 storyboard, the live vertical slice lacked:

- human-height cinematic camera;
- monumental editorial architecture;
- spatial depth and environmental hierarchy;
- physical bridges / pathways;
- richly differentiated territory identities;
- immersive atlas/city silhouette;
- material depth;
- reveal treatment matching the approved red causal world;
- a composition that feels like a Day Challenge rather than a 3D diagram.

## Fidelity rebuild v1

### Camera
Changed from elevated diagram view to eye-level cinematic framing.

### Territory architecture
Each territory now has:
- stepped architectural plinth;
- framed editorial knowledge panel;
- procedural territory-specific artwork;
- sculptural symbol;
- material/lighting response for selected/visited/causal states.

### Central portal
Rebuilt as nested monumental arches with depth, emissive brass and a framed line of sight toward the world beyond.

### Paths
Thin graph lines are replaced with physical curved tube bridges plus an emissive causal route.

### Environment
Added:
- dark reflective stone floor;
- concentric atlas markers;
- distant procedural city/knowledge skyline;
- warm/cool directional lighting;
- atmospheric fog.

### Narrative UI
Explore copy is moved out of the world center.
The atlas index becomes quieter/editorial.
Territory detail is presented as a caption, not a dashboard card.

### Reveal
The white side drawer is replaced by a full-screen dark/vermilion causal reveal layer, closer to the approved D4 visual proof.

## Product truth preserved

No changes were made to the canonical behavior model.

Still preserved:
- deterministic world state;
- VISIT / RETURN / DWELL observations;
- real spatial consequences;
- Deep Time return gate;
- causal replay from actual mutation log;
- INTENTION = UNKNOWN;
- reduced-motion model path.

## CI

GitHub Actions run:
`37234319051`

Result:
- install PASS
- 5/5 model tests PASS
- typecheck PASS
- Vite production build PASS
- observed build time ~464ms

## What remains unknown

- real-browser fidelity;
- GPU/runtime performance;
- mobile composition in the new architectural pass;
- readability of procedural territory panels;
- whether the new camera preserves navigation;
- whether reveal still feels coherent with the world;
- whether this reaches the human-approved Day Challenge visual bar.

## Exact next gate

`D4_RUNTIME_FIDELITY_V1__LIVE_VISUAL_REVIEW`

## Promotion rule

Do not promote this branch because screenshots or code sound better.

Promote only after the human owner reviews the live Cloudflare preview and confirms that the runtime is materially closer to the approved D4 direction.

If still below bar:
- preserve product truth;
- identify the largest remaining visual gap;
- perform another fidelity pass rather than accepting "functional enough".
