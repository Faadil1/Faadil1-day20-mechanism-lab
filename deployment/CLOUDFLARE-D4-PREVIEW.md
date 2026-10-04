# Cloudflare Pages — D4 Spatial Runtime Preview

Status: REQUIRED NEXT ACTION
Date: 2026-10-04

## Why a separate Pages project

The existing Cloudflare Pages project was configured for the historical static pre-concept lab:

- production branch: `main`
- build command: `exit 0`
- output: repository root

The D4 spatial vertical slice is now a Vite/React/R3F application and requires:

- dependency installation;
- `npm run build`;
- output directory `dist`.

Changing the old project globally would risk breaking or misclassifying the historical static runtime.

Therefore create a **separate staging-only Cloudflare Pages project**.

## Recommended project settings

Project name:
`faadil1-day20-d4-preview`

Repository:
`Faadil1/Faadil1-day20-mechanism-lab`

Branch:
`build/d4-spatial-vertical-slice`

Framework preset:
`Vite`

Build command:
`npm run build`

Build output directory:
`dist`

Root directory:
leave empty

Node:
`.nvmrc` pins Node 22.

## Truth boundary

Although Cloudflare may label the configured branch as the Pages project's production branch, this Cloudflare project is **staging/preview infrastructure only**.

It must not be represented as:
- Day 20 production release;
- Concept Lock;
- public final;
- submitted/frozen build.

Canonical classification:
`LIVE_STAGING_PREVIEW`

## Runtime verification checklist

After deployment, verify:

1. URL returns HTTP 200.
2. ENTER loads the R3F world.
3. Territory clicks are usable.
4. Four-territory exploration including Deep Time triggers `FIND DEEP TIME AGAIN`.
5. Clicking Deep Time in return mode opens reveal.
6. reveal shows baseline/current difference.
7. causal replay has actual mutation events.
8. each event preserves `INTENTION = UNKNOWN`.
9. reset restores exact baseline.
10. mobile viewport remains navigable.
11. reduced-motion preserves same causal state.
12. no fatal WebGL/runtime errors.
13. Cloudflare deployment is bound to exact branch commit.

## Exact promotion rule

Only after the runtime checklist passes may:
`D4_SPATIAL_RUNTIME_PREVIEW` become PROVEN.

The PR remains Draft / DO NOT MERGE.
