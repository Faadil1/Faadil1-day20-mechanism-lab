# D4 Spatial Vertical Slice — Technical Reality Receipt

Date: 2026-10-04
Status: **PROVEN — CI GREEN**
Evidence class: CI / LOCAL_BUILD
Branch: `build/d4-spatial-vertical-slice`
Commit under test: `945ba686f766100842d0bb8dae56daf33746e13e`
GitHub Actions run: `37215134166`
Job: `111473984644`

## Pipeline

1. Checkout — PASS
2. Node 22 setup — PASS
3. npm install — PASS
4. Model tests — PASS
5. Typecheck — PASS
6. Vite production build — PASS

## Model tests

`src/world.test.ts`

Result:
- Test files: **1 passed**
- Tests: **5 passed**

Covered invariants:
- same observation sequence produces the same canonical world state;
- behavior never upgrades intention beyond `UNKNOWN`;
- Deep Time return gate activates only after representative exploration;
- only Deep Time completes the return task;
- every territory remains inside the bounded navigable world.

## Typecheck

`npm run typecheck`

Result: **PASS**

A previous run exposed one missing Vite CSS side-effect declaration. It was repaired with `src/vite-env.d.ts`. The successful run includes that repair.

## Production build

`npm run build`

Result: **PASS**

Observed Vite build completion:
`built in 746ms`

Motion/framer-motion emitted module-level `"use client"` preservation warnings during bundling. These did not fail or invalidate the browser bundle. Treat them as build warnings, not runtime proof.

## Product behavior implemented

This build contains a real vertical slice:

`ENTER → EXPLORE → OBSERVE → MUTATE CANONICAL WORLD → FIND DEEP TIME AGAIN → CAUSAL REPLAY`

The causal reveal reads the same mutation log that drove the spatial changes. No separate fake replay is used.

## Truth boundary

This receipt proves:
- source compiles;
- deterministic model tests pass;
- TypeScript contract passes;
- Vite production bundle is generated successfully.

It does **not** prove:
- browser/runtime behavior;
- WebGL compatibility;
- desktop/mobile visual fidelity;
- reduced-motion behavior in a real browser;
- performance on representative devices;
- external participant comprehension;
- production readiness.

## Reproducibility note

Top-level dependencies are exactly pinned in `package.json`. A committed npm lockfile is not yet present, so transitive dependency reproducibility is **PARTIAL** and remains engineering debt until resolved.

## Exact next gate

`D4_CODED_SPATIAL_VERTICAL_SLICE_001__RUNTIME_PREVIEW`

## Exact next action

Deploy commit `945ba686f766100842d0bb8dae56daf33746e13e` as a non-production Vite preview and verify the full core loop on desktop, mobile and reduced-motion before any merge or Concept Lock.
