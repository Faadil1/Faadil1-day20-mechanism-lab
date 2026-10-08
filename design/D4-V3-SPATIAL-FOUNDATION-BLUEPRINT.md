# D4 V3 — Spatial Experience Foundation Blueprint

Date: 2026-10-04
Status: READY_FOR_IMPLEMENTATION
Gate: D4_V3_SPATIAL_EXPERIENCE_FOUNDATION_001

## Foundation slice

```
CENTRAL THRESHOLD
      ↓ travel
BRIDGE A
      ↓
DEEP TIME EXTERIOR
      ↓ enter
DEEP TIME INTERIOR
      ↓ explore
BEHAVIOR OBSERVATION
      ↓
WORLD TOPOLOGY MUTATION
      ↓
RETURN
      ↓
BRIDGE A IS NO LONGER THE SAME ROUTE
      ↓
CAUSAL REPLAY
```

## World-state additions

Proposed:

```ts
type EdgeId = string

interface EdgeState {
  id: EdgeId
  from: TerritoryId
  to: TerritoryId
  weight: number
  available: boolean
  visibility: number
  curveBias: number
}

interface TerritoryState {
  position: Vec3
  visibility: number
  accessibility: number
}

interface WorldSnapshot {
  id: string
  mutationIndex: number
  territories: Record<TerritoryId, TerritoryState>
  edges: Record<EdgeId, EdgeState>
}

interface Mutation {
  ...
  territoryChanges: ...
  edgeChanges: ...
  snapshotBeforeId: string
  snapshotAfterId: string
}
```

## Travel state

```ts
type TravelPhase =
  | 'IDLE'
  | 'DEPARTING'
  | 'TRAVELLING'
  | 'ARRIVING'
  | 'INSIDE_TERRITORY'
```

Travel is a real state transition and receipt.

## Deep Time interior

Minimum authored objects:
- geological timeline wall;
- suspended temporal instrument;
- archive fragment;
- return threshold.

At least two objects generate distinct observations.

Do not use arbitrary educational copy; content should support the experience theme of persistence, accumulation and path memory.

## Asset contract

Every 3D asset:
- GLB/GLTF;
- origin normalized;
- meter/world scale documented;
- <= defined triangle budget per LOD;
- material slots named;
- no embedded copyrighted third-party texture without provenance;
- mobile LOD or procedural substitute.

## Fidelity target

The foundation slice should already demonstrate:
- monumental scale;
- near/mid/far composition;
- one unforgettable landmark;
- one interior;
- material specificity;
- atmospheric light;
- route change that physically matters.

If the foundation slice still looks like procedural primitives, asset pipeline is not considered proven.

## Acceptance

PROVEN only when:
- travel is user-controlled and orientation-preserving;
- Deep Time can be entered;
- one behavior mutates route topology;
- return path is materially different;
- causal replay reconstructs actual before/after state;
- approved art direction is recognizable without explanatory copy;
- mobile path is usable;
- CI and live preview are green.
