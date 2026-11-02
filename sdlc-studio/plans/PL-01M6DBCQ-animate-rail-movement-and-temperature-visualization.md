# PL-01M6DBCQ: Animate rail movement and temperature visualization - Implementation Plan

> **Status:** Complete
> **Raised-by:** Codex; agent; v1
> **Story:** [US-01M6DA9T: Animate rail movement and temperature visualization](../stories/US-01M6DA9T-animate-rail-movement-and-temperature-visualization.md)
> **Epic:** [EP-01M6DA39: Interactive 3D Railway Visualization](../epics/EP-01M6DA39-interactive-3d-railway-visualization.md)
> **Created:** 2026-11-02
> **Language:** JavaScript
> **Created-by:** sdlc-studio remake (backfilled)

## Overview

Extend the static railway scene with state-driven visual feedback: smoothly move rail ends using the calculated expansion, map supported temperature to a cool-blue/warm-red color, preserve material identity through a text or swatch cue, and prevent closed states from rendering physical overlap.

## Acceptance Criteria Summary

| AC | Description | Plan coverage |
|---|---|---|
| AC1 | Rail ends move smoothly from calculated expansion on temperature/material updates. | Tasks 1-3; TC01 |
| AC2 | Temperature maps from cool blue to warm red across 10-100°C. | Tasks 2-3; TC02 |
| AC3 | Material identity remains readable while temperature color changes. | Tasks 2-3; TC03 |
| AC4 | Closed clearance clamps visual geometry and never shows physical overlap. | Tasks 1-3; TC04 |

## Technical Context

### Language & Framework

- **Primary Language:** JavaScript
- **Framework:** Existing Three.js browser scene
- **Test Framework:** Node built-in tests with fake Three.js objects

### Relevant Best Practices

- Treat physics output as the source of truth; visual exaggeration is clearly named and never fed back into physics.
- Interpolate visual transforms with a deterministic helper so tests do not depend on wall-clock animation.
- Map temperature independently from material identity; use a contrasting material label/swatch for readability.
- Clamp visual separation at zero for closed states and do not animate overlap.

### Existing Patterns

`src/scene.js` creates named rail objects and applies `remainingGapMm`; `src/main.js` emits shared state. This story adds pure visual mapping/interpolation helpers and a state update path without changing `src/physics.js`.

## Recommended Approach

**Strategy:** TDD
**Rationale:** Color endpoints, visual exaggeration, interpolation, and closed-gap behavior are exact contracts with high risk of visual/physical conflation. Pure helpers can be tested without a browser or animation clock.

### Test Priority

1. Rail movement and no-overlap geometry.
2. Temperature color endpoints and midpoint.
3. Material cue preservation and visual exaggeration boundary.

## Implementation Tasks

| # | Task | File | Depends On | Status |
|---:|---|---|---|---|
| 1 | Add deterministic visual helpers for temperature color, visual expansion, and clamped target positions. | `src/scene.js` | Existing scene objects | [x] |
| 2 | Add state-driven rail animation/update logic and a material identity cue. | `src/scene.js`, `src/main.js`, `index.html` | Task 1 | [x] |
| 3 | Add tests for movement, color mapping, material readability, and closed-state clamping. | `tests/animation.test.js` | Tasks 1-2 | [x] |
| 4 | Run the full suite and quality checks; confirm visual exaggeration never changes shared physics state. | `tests/`, `src/scene.js`, `src/main.js` | Tasks 1-3 | [x] |

## Parallel Execution Groups

| Group | Tasks | Prerequisite |
|---|---|---|
| A | Task 1 | Existing named scene objects |
| B | Task 2 | Visual helper contract |
| C | Task 3 | State update seam |
| D | Task 4 | Green tests |

## Implementation Phases

### Phase 1: Define deterministic visual mapping

**Goal:** Make visual movement and heat color explicit and testable.

- [x] Define a named visual exaggeration factor used only for display.
- [x] Map 10°C to cool blue and 100°C to warm red with bounded interpolation.
- [x] Compute target rail positions from physical gap/expansion without allowing negative physical gap.

**Files:** `src/scene.js`.

### Phase 2: Apply state to the scene

**Goal:** Animate the existing scene without changing the physics model.

- [x] Move rail ends toward target positions using a deterministic interpolation step or requestAnimationFrame loop.
- [x] Update rail color from temperature while keeping material identity readable via label or swatch.
- [x] Clamp closed-state rail separation to the joint boundary and keep numerical signed gap in the results panel.
- [x] Ensure visual-only factors never mutate `global.simulatorState` or feed back into `calculateRailState()`.

**Files:** `src/scene.js`, `src/main.js`, `index.html`.

### Phase 3: Testing & Validation

**Goal:** Verify all acceptance criteria and visual/physical boundaries.

| AC | Verification Method | File Evidence | Status |
|---|---|---|---|
| AC1 | Helper and fake-scene test checks target movement and interpolation. | `tests/animation.test.js` TC01 | Passed |
| AC2 | Color mapping test checks blue endpoint, midpoint, and red endpoint. | `tests/animation.test.js` TC02 | Passed |
| AC3 | Material cue test checks material label/swatch remains distinct. | `tests/animation.test.js` TC03 | Passed |
| AC4 | Closed-state test checks zero visual separation and no overlap. | `tests/animation.test.js` TC04 | Passed |

## Edge Case Handling

| # | Edge Case | Handling Strategy | Phase |
|---:|---|---|---|
| 1 | Temperature = 10°C | Map to the cool-blue endpoint and maintain finite target positions. | 1-2 |
| 2 | Temperature = 100°C | Map to the warm-red endpoint and maintain finite target positions. | 1-2 |
| 3 | Temperature outside supported range | Clamp visual color input to 10-100°C; physics validation remains authoritative. | 1 |
| 4 | Signed clearance <= 0 | Use physical gap 0 for geometry and never render overlap. | 2 |
| 5 | Material changes with same temperature | Keep temperature color stable while updating material label/swatch. | 2 |
| 6 | Animation receives incomplete state | Skip the visual update or show unavailable state; never infer expansion. | 2 |

**Coverage:** 6/6 edge cases handled.

## Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Visual exaggeration is mistaken for physical expansion. | High | Name the factor, document it, and test shared state remains unchanged. |
| Color obscures material identity. | Medium | Add a text/swatch material cue independent from rail heat color. |
| Animation renders rail overlap when closed. | High | Clamp target separation from `remainingGapMm` and assert zero closed separation. |

## Definition of Done

- [x] Rail movement responds smoothly to shared state.
- [x] Temperature color maps across the full supported range.
- [x] Material identity remains readable.
- [x] Closed states never render physical overlap.
- [x] Visual factors do not alter physics values.
- [x] Tests, validation, and diff checks pass.

## Notes

Camera interaction is intentionally left to `US-01M6DA6G`. This story changes scene motion and color only; it does not add stress, force, buckling, or heat-flow simulation.

## Revision History

| Date | Author | Change |
|---|---|---|
| 2026-11-02 | Codex | Created TDD plan with complete AC and edge-case coverage. |
