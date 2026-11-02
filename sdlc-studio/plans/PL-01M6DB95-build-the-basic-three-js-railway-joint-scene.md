# PL-01M6DB95: Build the basic Three.js railway joint scene - Implementation Plan

> **Status:** Draft
> **Raised-by:** Codex; agent; v1
> **Story:** [US-01M6DACM: Build the basic Three.js railway joint scene](../stories/US-01M6DACM-build-the-basic-three-js-railway-joint-scene.md)
> **Epic:** [EP-01M6DA39: Interactive 3D Railway Visualization](../epics/EP-01M6DA39-interactive-3d-railway-visualization.md)
> **Created:** 2026-11-02
> **Language:** JavaScript
> **Created-by:** sdlc-studio remake (backfilled)

## Overview

Add the smallest classroom-friendly Three.js scene that makes the railway joint visible: two rail ends, a gap indicator, sleepers, a camera, and basic lighting. Geometry is created locally with Three.js primitives; the scene consumes calculated state and never owns the thermal-expansion equation.

## Acceptance Criteria Summary

| AC | Description | Plan coverage |
|---|---|---|
| AC1 | Initialized scene contains rails, joint, sleepers, gap indicator, camera, and lighting. | Tasks 1-3; TC01 |
| AC2 | Scene renders from basic local geometry without assets or physics engine. | Tasks 1-2; TC02 |
| AC3 | Scene consumes calculated state without duplicating physics. | Tasks 2-3; TC03 |

## Technical Context

### Language & Framework

- **Primary Language:** JavaScript
- **Framework:** Three.js in the browser
- **Test Framework:** Node built-in tests with a minimal fake Three.js API; browser smoke test is recommended when dependency tooling exists

### Relevant Best Practices

- Keep scene construction and state application separate from physics and DOM controls.
- Use named groups/userData for rails, sleepers, joint, and gap indicator so later animation can target them.
- Keep geometry primitive-only and avoid imported assets, physics engines, or network fetches.
- Make initialization fail clearly when a renderer cannot be created; do not silently claim a 3D scene exists.

### Existing Patterns

`src/main.js` owns the shared calculated state and emits `simulatorstatechange`. `src/physics.js` is the sole scientific calculation module. This story adds `src/scene.js` and connects state consumption from `main.js`; Three.js dependency setup is new.

## Recommended Approach

**Strategy:** TDD
**Rationale:** Scene composition is easy to regress through missing groups or accidental formula duplication. A fake-Three unit seam can prove object composition and state application without requiring a GPU or imported model.

### Test Priority

1. Required scene object inventory and initialization.
2. Primitive geometry and no-asset/no-physics boundary.
3. State application and source-boundary check for duplicated expansion logic.

## Implementation Tasks

| # | Task | File | Depends On | Status |
|---:|---|---|---|---|
| 1 | Add Three.js dependency/loading and a canvas mount point with renderer-safe startup wiring. | `index.html`, `src/main.js` | Existing browser shell | [x] |
| 2 | Implement scene initialization with primitive rail ends, joint, sleepers, gap indicator, camera, and lighting. | `src/scene.js` | Task 1 | [x] |
| 3 | Implement `applyRailState(scene, state)` that updates scene presentation from state without recomputing expansion. | `src/scene.js`, `src/main.js` | Tasks 1-2 | [x] |
| 4 | Add fake-Three tests and source-boundary assertions for scene composition and state consumption. | `tests/scene.test.js` | Tasks 2-3 | [x] |
| 5 | Run tests, validation, and browser smoke checks where available. | `tests/`, `src/scene.js`, `src/main.js` | Tasks 1-4 | [x] |

## Parallel Execution Groups

| Group | Tasks | Prerequisite |
|---|---|---|
| A | Task 1 | Existing HTML and shared state |
| B | Task 2 | Three.js loading decision |
| C | Tasks 3-4 | Scene object contract |
| D | Task 5 | Green tests |

## Implementation Phases

### Phase 1: Establish the scene runtime

**Goal:** Provide a canvas mount and a renderer initialization seam that works with basic local geometry.

- [x] Add Three.js using the project’s chosen browser dependency path.
- [x] Add a scene canvas mount and renderer sizing without adding unrelated controls.
- [x] Keep startup failure visible and honest if WebGL/renderer setup is unavailable.

**Files:** `package.json`, `index.html`, `src/main.js`.

### Phase 2: Build the railway joint composition

**Goal:** Create the required primitive scene graph.

- [x] Create two rail-end meshes with a visible joint gap.
- [x] Add repeated sleeper geometry beneath the rails.
- [x] Add a gap-indicator object, camera, and basic lighting.
- [x] Name groups and expose them from the scene object for downstream animation.

**Files:** `src/scene.js`.

### Phase 3: Consume state and validate

**Goal:** Connect calculated state without duplicating scientific logic.

- [x] Apply the shared state to gap-indicator presentation only.
- [x] Ensure no `α × L₀ × (T − T₀)` formula or material coefficients are redefined in the scene module.
- [x] Verify object inventory and primitive-only construction with tests.

| AC | Verification Method | File Evidence | Status |
|---|---|---|---|
| AC1 | Fake-Three scene inventory test. | `tests/scene.test.js` TC01 | Passed |
| AC2 | Primitive-construction and source dependency test. | `tests/scene.test.js` TC02 | Passed |
| AC3 | State-application test plus no-formula source assertion. | `tests/scene.test.js` TC03 | Passed |

## Edge Case Handling

| # | Edge Case | Handling Strategy | Phase |
|---:|---|---|---|
| 1 | No imported asset available | Build all geometry from Three.js primitives; no asset fetch path. | 2 |
| 2 | Renderer/WebGL unavailable | Show a visible startup limitation and keep textual results available. | 1 |
| 3 | State has zero physical gap | Keep rail ends at the joint boundary and show a closed indicator; do not invent force. | 3 |
| 4 | State has an open physical gap | Scale/update only the gap indicator from `remainingGapMm`; keep physics in the shared module. | 3 |
| 5 | Scene receives incomplete state | Use a defensive no-op or explicit unavailable state rather than recalculating missing values. | 3 |
| 6 | Resize or high-DPI classroom display | Use renderer sizing/pixel-ratio bounds without changing the scene contract. | 1 |

**Coverage:** 6/6 edge cases handled.

## Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Three.js loading fails offline. | High | Select a local dependency path and keep primitive geometry asset-free. |
| Scene duplicates thermal-expansion logic. | High | Pass state into `applyRailState`; source assertion forbids formula/coefficient duplication. |
| Primitive scene is visually ambiguous. | Medium | Name scene groups and include an explicit joint/gap indicator. |

## Definition of Done

- [x] Scene contains all required primitive objects.
- [x] No imported model or physics engine is required.
- [x] State is consumed without a duplicate equation.
- [x] Renderer limitation is visible and honest when unavailable.
- [x] Tests, validation, and diff checks pass.

## Notes

Rail movement animation, camera interaction, and temperature visualization remain in later stories. This story establishes the static scene and state seam only.

## Revision History

| Date | Author | Change |
|---|---|---|
| 2026-11-02 | Codex | Created TDD plan with complete AC and edge-case coverage. |
