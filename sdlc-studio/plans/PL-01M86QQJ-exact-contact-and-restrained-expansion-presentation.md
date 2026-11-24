# PL-01M86QQJ: Exact contact and restrained expansion presentation

> **Status:** Draft
> **Story:** US-01M86Q8Q
> **Created:** 2026-11-24
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1

## Overview

Deliver US-01M86Q8Q under CR-01M86Q57. First add regression cases for the 0.22 mm positive gap, exact contact, no overlap, matched bending endpoints, and cooling. Remove extra expansion subtraction and the central spacer width from targets. Use subdivided box meshes with shared end deflections, clamped schematic amplitude based on excess clearance, and inward arrows only after contact. Add a near-scene clearance/excess caption and disclose that buckling onset, force, and deflection are not predicted. Verify unit tests, browser transition and reversal, offline/mobile behavior, and inspect a rendered example.

## Specification delta and review considerations

- PRD physical gap and scene agreement: remove double-subtracted expansion and central spacer, retaining the pure physics function.
- PRD no overlap: rail faces meet exactly; deformation changes only lateral coordinates and shares the same center displacement.
- PRD clearance-only model: allow schematic compression/bending presentation while continuing to exclude force, deflection, failure, and buckling prediction. State the distinction beside the scene and in results.
- PRD material colors, camera, mobile/offline behavior: retain existing appearances and use primitive geometry only; show and hide cues from shared state.
- Teacher perspective: never equate negative signed clearance with overlap or predicted damage. Student perspective: visible, reversible contact progression and local captions. QA perspective: regression test the 0.22 mm gap, exact contact for all materials, bending endpoint continuity, cooling reversal, and real browser rendering.

Validation is author verification; independent review remains separate.

## Verification evidence

The new regression tests first failed on the original zero visual gap at 0.22 mm clearance, the 0.15-unit spacer at contact, and the missing deformation state. After implementation: 40 unit tests and 15 browser tests passed. The browser checked first contact for all three materials, then excess expansion and cooling reversal. Desktop and mobile screenshots were inspected for connected bent geometry, inward arrows, red warning, and a visible illustrative-only caption.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-24 | sdlc-studio | Created via `new` (deterministic) |
