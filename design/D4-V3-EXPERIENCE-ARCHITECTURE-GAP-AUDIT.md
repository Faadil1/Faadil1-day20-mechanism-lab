# D4 V3 — Experience Architecture Gap Audit

Date: 2026-10-04
Status: **V2 = REVISE / V3 = ACTIVE**
Runtime reviewed:
`https://f1925470.faadil1-day20-d4-preview.pages.dev/`

## Human verdict

The human owner reported:

> "c'est possibliment mes attentes qui sont trop grosses mais il manquent enormement de choses"

Reconciliation verdict:

**Expectations are not materially above the approved D4 target. The coded runtime is materially below the approved experience scope.**

The mismatch is structural, not merely aesthetic.

---

# 1. What V2 genuinely proves

V2 is valuable and should not be discarded.

It proves:
- the D4 causal thesis can exist in a real R3F runtime;
- observed behavior can mutate a deterministic world state;
- territory positions can change from real session observations;
- a Deep Time return gate can exist;
- the build can pass deterministic tests, typecheck and Vite production build;
- the visual surface can move beyond the original research/debug lab.

This remains valid evidence.

---

# 2. Why V2 still feels incomplete

## A. The current world model is too shallow

Approved D4 expected:
- positions;
- visibility;
- route weights;
- changing adjacency;
- bridge/path rerouting;
- appearing/disappearing pathways;
- territories becoming easier/harder to reach;
- accumulated causal history.

Current `WorldState` contains only:
- stage;
- positions;
- visits;
- observations;
- mutations.

Current fixed `EDGES` never become a real mutable topology.

### Consequence
The runtime can currently **move monuments**, but it cannot yet fully **rebuild a world**.

Severity: **CRITICAL**

---

## B. Traversal is selection, not travel

Current interaction:
- click/tap a territory;
- camera reframes;
- state updates.

Approved D4 implied:
- crossing thresholds;
- navigating corridors/bridges;
- maintaining orientation;
- spatial memory;
- returning through a transformed world.

### Consequence
The participant observes a map changing rather than inhabiting a world that changed around them.

Severity: **CRITICAL**

---

## C. Territory depth is representational, not experiential

Current territories:
- one exterior monument;
- one short deck;
- one procedural illustration.

Missing:
- internal spatial layer;
- multiple discoverable objects;
- territory-specific interaction;
- meaningful reason to dwell/return;
- content relationships inside each territory.

### Consequence
There is no strong behavioral reason to produce rich session signals.

Severity: **CRITICAL**

---

## D. Architecture is still procedural primitive composition

V2 improved silhouettes, but the runtime is still fundamentally assembled from:
- box geometry;
- torus geometry;
- cone geometry;
- cylinders;
- procedural canvas textures.

Approved D4 promised:
- monumental impossible architecture;
- high visual specificity;
- authored material hierarchy;
- memorable landmarks;
- sculptural editorial environments.

### Consequence
Code-level procedural geometry has reached diminishing returns.

Severity: **HIGH**

Decision:
**Do not spend another pass trying to reach final fidelity using only primitive R3F geometry.**

---

## E. Reorganization lacks topological consequence

Current display amplification:
`display = baseline × scale + canonical delta × gain`

This increases visible displacement but does not yet produce:
- route opening;
- route closure;
- weighted travel cost;
- bridge substitution;
- peripheral fade/visibility;
- topology-based detour;
- route inheritance.

### Consequence
The world moves, but it does not yet meaningfully **change how one must navigate it**.

Severity: **CRITICAL**

---

## F. Bridges do not yet embody the canonical transition history

Current bridges are derived from current node positions.

Missing:
- previous-route state;
- animated reroute from before → after;
- route weight;
- route availability;
- explicit path consequence per mutation;
- bridge lifecycle receipts.

### Consequence
The system shows connection geometry, but not the authored history of how those connections changed.

Severity: **HIGH**

---

## G. Causal replay is not a true temporal replay

Current reveal:
- selects one mutation from the log;
- highlights its source and affected territories;
- displays final world state.

Missing:
- reconstruct exact pre-mutation snapshot;
- animate that exact mutation;
- show before → rule → after;
- replay route topology change;
- compare entered world / exited world as real render states.

### Consequence
The data source is real, but the replay is currently closer to **inspection of receipts** than replay of lived causal history.

Severity: **CRITICAL**

---

## H. The reveal covers the world instead of transforming it

Approved D4:
`immersive world → causal map`

Current:
full-screen overlay over the world.

Missing:
- world freeze;
- baseline ghost world;
- current world materialization;
- vector/movement reveal;
- sequential `WORLD YOU ENTERED → WORLD YOU LEFT → WHAT MOVED → WHY`.

Severity: **HIGH**

---

## I. Mobile is still responsive CSS, not the approved mobile experience

Approved mobile:
- one corridor/cluster at a time;
- bounded drag/look;
- tap landmark to travel;
- mobile-specific camera distance;
- vertical causal reveal.

Current:
same desktop world + media-query UI adaptations.

Severity: **CRITICAL**

---

## J. Reduced motion is not a true alternate renderer

Approved:
- stepped spatial updates;
- before/after path swap;
- static mini-map receipts;
- no lost causal information.

Current:
mostly disables interpolation and CSS animation.

Severity: **HIGH**

---

## K. The content universe is too thin

Current territory content is effectively one sentence per territory.

Missing:
- objects worth exploring;
- real variation in content density;
- recognizable internal structure;
- authored relationships;
- moments that make return/dwell behavior natural.

Severity: **CRITICAL**

---

## L. No sound layer

Sound was correctly deferred earlier.

Now that the visual mechanism exists, the final experience still lacks:
- spatial ambience;
- territory acoustic identity;
- route activation cue;
- world-shift low-frequency cue;
- Deep Time attenuation;
- causal replay sonic markers.

Severity: **MEDIUM NOW / HIGH FOR FINAL DAY CHALLENGE**

---

## M. No authored asset pipeline

Current runtime has no durable pipeline for:
- GLB/GLTF monuments;
- texture/material authoring;
- LOD;
- baked lighting;
- mobile simplified assets;
- asset provenance/license tracking.

Severity: **CRITICAL FOR FINAL FIDELITY**

---

# 3. V2 disposition

`D4_RUNTIME_FIDELITY_V2 = REVISE`

Do not merge V2 as final presentation architecture.

Preserve it as:
- real technical evidence;
- causal-model proof;
- runtime baseline;
- fallback renderer inspiration.

---

# 4. V3 experience architecture

V3 is not a visual polish pass.

It is a **reconstruction of the experience architecture around the proven causal core**.

## Layer 1 — Canonical world topology

Add:
- mutable edge state;
- route weight;
- route availability;
- territory visibility;
- reachability;
- world snapshots;
- explicit route mutation receipts.

Target:
the user's behavior changes not just where territories are, but **how the world can be traversed**.

## Layer 2 — Real traversal

Add:
- threshold entry;
- bridge/corridor travel;
- bounded camera navigation;
- route selection;
- arrival/departure state;
- travel time / travel event;
- orientation-preserving camera system.

Target:
the user **travels** rather than selects nodes.

## Layer 3 — Territory interiors

Each territory gets:
- an exterior landmark;
- an interior / focused environment;
- 2–4 discoverable content objects;
- one territory-native interaction;
- content relationships;
- natural dwell/return opportunities.

Target:
session signals emerge from meaningful exploration.

## Layer 4 — Authored 3D asset pipeline

Renderer accepts external GLB/GLTF assets.

Asset targets:
- central threshold;
- eight territory landmark kits;
- bridge kit;
- horizon kit;
- terrain/plaza modules.

Maintain procedural fallback for:
- low-power devices;
- asset failure;
- reduced motion / 2D fallback where needed.

## Layer 5 — Temporal world-state engine

Persist snapshots:
`S0 → S1 → S2 → ... → Sn`

Each mutation stores:
- observation;
- rule;
- topology before;
- topology after;
- positions before;
- positions after;
- visibility before/after;
- route weights before/after.

Target:
replay is reconstructed from actual historical states.

## Layer 6 — True causal reveal

Sequence:
1. freeze current world;
2. materialize entered-world ghost;
3. morph to left-world;
4. isolate one mutation;
5. replay exact consequence;
6. move through mutation history;
7. final question.

No generic dashboard overlay as the primary reveal.

## Layer 7 — Mobile renderer

Separate camera/navigation strategy:
- one corridor/cluster visible at a time;
- touch drag/look;
- tap travel;
- simplified geometry;
- vertical reveal.

## Layer 8 — Sound system

Only after Layers 1–6 are stable.

Sound must map to state, not decoration.

---

# 5. Asset/tool strategy

## Keep
- React
- TypeScript
- R3F / Three.js
- Motion
- deterministic canonical model
- procedural fallback renderer

## Add when proven useful
- GLTF/GLB authored assets
- Draco/Meshopt compression
- lightweight postprocessing only for atmosphere
- spatial audio
- asset LOD

## Candidate creation tools
- Blender/manual asset authoring
- Magnific 3D Scene / GLB-capable workflows
- fal image-to-3D / text-to-3D
- generated concept imagery as asset direction input

All generated assets require:
- human visual review;
- topology/performance review;
- source/provenance record;
- no automatic adoption.

---

# 6. Exact V3 gate

`D4_V3_SPATIAL_EXPERIENCE_FOUNDATION_001`

## Exact next proof

Do **not** attempt all eight territories first.

Build one load-bearing real slice:

`CENTRAL THRESHOLD → ONE BRIDGE → DEEP TIME EXTERIOR → DEEP TIME INTERIOR → RETURN THROUGH A MUTATED ROUTE → TRUE CAUSAL REPLAY`

This slice must prove:
- actual travel;
- one authored 3D landmark pipeline;
- mutable topology;
- one route reroute;
- one interior;
- historical snapshot replay;
- desktop and mobile navigation strategy.

If this does not feel like the approved D4, stop before scaling to the other seven territories.

---

# 7. Product Exploitation status

**ACTIVE**

Reason:
the project has a real vertical slice but materially under-exploits:
- traversal;
- topology;
- world depth;
- content;
- causal replay;
- visual asset quality;
- mobile;
- sound.

"Assez de preuves" is explicitly not a reason to stop.
