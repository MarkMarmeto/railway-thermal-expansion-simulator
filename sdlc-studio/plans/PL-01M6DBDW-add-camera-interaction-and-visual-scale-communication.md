# PL-01M6DBDW: Add camera interaction and visual-scale communication - Implementation Plan

> **Status:** Complete
> **Raised-by:** Codex; agent; v1
> **Story:** [US-01M6DA6G: Add camera interaction and visual-scale communication](../stories/US-01M6DA6G-add-camera-interaction-and-visual-scale-communication.md)
> **Epic:** [EP-01M6DA39: Interactive 3D Railway Visualization](../epics/EP-01M6DA39-interactive-3d-railway-visualization.md)
> **Created:** 2026-11-02
> **Language:** JavaScript
> **Created-by:** sdlc-studio remake (backfilled)

## Overview

Add lightweight, dependency-free camera interaction to the existing Three.js railway scene. Pointer dragging will orbit the camera around the joint, wheel input will zoom within safe bounds, and the scene will expose a visible note that rendered movement is illustrative and not to physical scale. Heat-flow visuals are not currently present; if added later, the same note will identify them as illustrative and non-quantitative.

## Acceptance Criteria Summary

| AC | Name | Description | Plan coverage |
| ---- | ------ | ----------- | --- |
| AC1 | Camera orbit | Dragging the scene orbits around the railway joint. | Tasks 1-3; TC01 |
| AC2 | Camera zoom | Zoom moves closer/farther while preserving a useful scene view. | Tasks 1-3; TC02 |
| AC3 | Visual-scale caveat | The interface labels exaggerated movement as illustrative, not physical scale. | Tasks 2-3; TC03 |
| AC4 | Heat-flow caveat | Any optional heat-flow visual is labelled illustrative and non-quantitative. | Tasks 2-3; TC04 |

## Technical Context

### Language & Framework

- **Primary Language:** JavaScript
- **Framework:** Existing browser Three.js scene loaded from the approved CDN
- **Test Framework:** Node built-in tests with fake Three.js and DOM objects

### Relevant Best Practices

- Keep camera state in the scene controller and avoid global mutable physics state.
- Guard pointer, wheel, and DOM lookups so the scene remains usable without interaction APIs.
- Clamp radius and polar angle to keep the railway joint in view and prevent inverted views.
- Use explicit labels for illustrative visuals; do not imply quantitative heat-flow simulation.

### Library Documentation (Context7)

| Library | Context7 ID | Key Patterns |
| --- | --- | --- |
| Three.js | Existing CDN runtime | Use the existing `PerspectiveCamera`, renderer, and plain DOM pointer/wheel events; no new control library is required. |

### Existing Patterns

`src/scene.js` owns the camera, renderer, named objects, and state application. `src/main.js` creates the scene only when Three.js and `sceneMount` are available. `tests/scene.test.js` supplies a fake Three.js implementation, so camera helpers should be pure or injectable and should not require WebGL.

## Recommended Approach

**Strategy:** TDD
**Rationale:** Camera orbit/zoom bounds and the scale-label contract can be verified deterministically without a browser. DOM event wiring is tested through a small fake mount, while browser behavior remains a manual smoke check.

### Test Priority

1. Orbit and zoom calculations stay bounded and preserve the camera target.
2. Event handlers update camera state without touching physics state.
3. Visible scale and optional heat-flow caveats are present and unambiguous.

## Implementation Tasks

| # | Task | File | Depends On | Status |
| ---: | --- | --- | --- | --- |
| 1 | Add camera orbit/zoom state, spherical-coordinate helpers, and safe bounds to the scene controller. | `src/scene.js` | Existing camera | [x] |
| 2 | Wire pointer drag and wheel events to the scene mount; add scale/illustration caveat markup and styling. | `src/scene.js`, `index.html`, `src/style.css` | Task 1 | [x] |
| 3 | Add deterministic tests for orbit, zoom, listener wiring, and caveat labels. | `tests/camera.test.js`, `tests/scene.test.js` | Tasks 1-2 | [x] |
| 4 | Run the full suite, AC verification, validation, and diff checks. | `tests/`, `sdlc-studio/` | Tasks 1-3 | [x] |

## Parallel Execution Groups

| Group | Tasks | Prerequisite |
| --- | --- | --- |
| A | Task 1 | Existing scene camera |
| B | Task 2 | Camera helper contract |
| C | Task 3 | Event seam and labels |
| D | Task 4 | Green tests |

## Implementation Phases

### Phase 1: Define bounded camera controls

**Goal:** Make orbit and zoom deterministic, bounded, and target-preserving.

- [x] Add a camera interaction state with azimuth, polar angle, radius, and fixed joint target.
- [x] Add pure orbit and zoom operations with minimum/maximum polar angle and radius limits.
- [x] Keep existing camera framing as the initial state.

**Files:** `src/scene.js` - camera state and movement helpers.

### Phase 2: Wire interaction and communicate scale

**Goal:** Connect user gestures to the scene and make visual caveats visible.

- [x] Add pointer down/move/up handling with pointer capture when available.
- [x] Add wheel zoom with `preventDefault` only when supported and bounded camera updates.
- [x] Add adjacent text stating that rail movement is visually exaggerated and illustrative.
- [x] Add optional heat-flow caveat text or a shared label slot, without adding quantitative heat-flow graphics.

**Files:** `src/scene.js`, `index.html`, `src/style.css`.

### Phase 3: Testing & Validation

**Goal:** Verify all acceptance criteria and interaction safety.

| AC | Verification Method | File Evidence | Status |
| ---- | --------------------- | --------------- | -------- |
| AC1 | Fake mount pointer drag changes orbit while preserving target and bounded angles. | `tests/camera.test.js` TC01 | Passed |
| AC2 | Fake wheel events change radius only within bounds. | `tests/camera.test.js` TC02 | Passed |
| AC3 | DOM fixture contains the illustrative visual-scale caveat. | `tests/camera.test.js` TC03 | Passed |
| AC4 | DOM fixture contains the non-quantitative heat-flow caveat/label slot. | `tests/camera.test.js` TC04 | Passed |

## Edge Case Handling

| # | Edge Case (from Story) | Handling Strategy | Phase |
| ---: | --- | --- | --- |
| 1 | Dragging the visible scene | Use pointer events on the mount and update only camera state. | 2 |
| 2 | Zooming too far in or out | Clamp camera radius and reapply the look-at target. | 1-2 |
| 3 | Exaggerated visual movement could be mistaken for physical scale | Keep the caveat adjacent to the scene and use explicit illustrative wording. | 2 |
| 4 | Optional heat-flow arrows or particles appear later | Provide a non-quantitative illustrative label; do not render or infer quantitative heat flow in this story. | 2 |

**Coverage:** 4/4 edge cases handled

## Risks & Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Camera can enter an unusable inverted or clipped view. | Medium | Clamp polar angle and radius; test both bounds. |
| Event wiring breaks fake or unsupported DOM environments. | Medium | Guard optional APIs and keep pure helpers independently testable. |
| Users interpret exaggeration as measured displacement. | High | Put a visible illustrative/non-physical-scale caveat beside the scene. |

## Definition of Done

- [x] All four acceptance criteria implemented.
- [x] Camera orbit and zoom are bounded and tested.
- [x] Scale and heat-flow caveats are visible and explicit.
- [x] Full tests, AC verification, validation, and diff checks pass.

## Notes

No external control library is introduced. The implementation should preserve the current CDN-only Three.js setup and keep quantitative heat-flow simulation out of scope.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-02 | Codex | Created TDD plan with 4/4 AC and edge-case coverage. |
