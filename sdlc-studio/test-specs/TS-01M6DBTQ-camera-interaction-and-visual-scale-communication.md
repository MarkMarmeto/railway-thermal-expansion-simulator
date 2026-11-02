# TS-01M6DBTQ: Camera interaction and visual-scale communication

> **Status:** Draft
> **Created:** 2026-11-02
> **Created-by:** Codex; agent; v1
> **Raised-by:** Codex; agent; v1
> **Story:** US-01M6DA6G
> **Epic:** EP-01M6DA39

## Overview

Verify that the Three.js railway scene supports bounded pointer orbit and wheel zoom while keeping the joint in view, and that the interface explicitly communicates that rendered movement and any optional heat-flow visuals are illustrative rather than quantitative.

## Scope

### Stories Covered

| Story | Title | Priority |
| --- | --- | --- |
| [US-01M6DA6G](../stories/US-01M6DA6G-add-camera-interaction-and-visual-scale-communication.md) | Add camera interaction and visual-scale communication | P1 |

### AC Coverage Matrix

| Story | AC | Description | Test Cases | Status |
| --- | --- | --- | --- | --- |
| US-01M6DA6G | AC1 | Dragging the scene orbits the camera around the railway joint. | TC01 | Covered |
| US-01M6DA6G | AC2 | Zoom moves closer/farther while retaining a useful scene view. | TC02 | Covered |
| US-01M6DA6G | AC3 | Interface labels exaggerated movement as illustrative, not physical scale. | TC03 | Covered |
| US-01M6DA6G | AC4 | Optional heat-flow visuals are identified as illustrative and non-quantitative. | TC04 | Covered |

**Coverage:** 4/4 ACs covered

### Test Types Required

| Type | Required | Rationale |
| ------ | ---------- | ----------- |
| Unit | Yes | Orbit, zoom, and bound calculations are deterministic. |
| Integration | Yes | Pointer/wheel events must update the scene camera through the mount seam. |
| E2E | No | The story has a manual browser smoke check, but no external service or backend contract. |

### Strategy Heuristics

- [x] **Production-state-shape integration test** - Not applicable: camera behavior does not depend on production data shape.
- [x] **Rejects-old-shape contract test** - Not applicable: no wire format, API shape, or schema changes.
- [x] **Regression test per fixed bug** - Not applicable: this is new interaction behavior.

## Environment

| Requirement | Details |
| ------------- | --------- |
| Prerequisites | Node.js; fake Three.js camera and fake DOM mount; no WebGL browser required for automated tests. |
| External Services | None. |
| Test Data | Pointer drags, wheel deltas, radius/angle bounds, and fixture text for illustrative caveats. |

## Test Cases

### TC01: Pointer drag orbits around the joint

**Type:** Unit + integration | **Priority:** P0 | **Story:** US-01M6DA6G

| Step | Action | Expected Result |
| ------ | ------ | ----------------- |
| Given | Create a scene with a fake mount and initial camera state. | The camera has a fixed joint target and finite spherical state. |
| When | Dispatch a pointer down, move, and up sequence on the mount. | Azimuth/elevation changes and the camera is repositioned around the target. |
| Then | Inspect the target and camera bounds. | The target remains the railway joint and polar angle stays within safe limits. |

**Assertions:**

- [ ] Drag changes orbit orientation.
- [ ] Camera target remains the joint.
- [ ] Polar angle remains bounded.

### TC02: Wheel zoom stays bounded

**Type:** Unit + integration | **Priority:** P0 | **Story:** US-01M6DA6G

| Step | Action | Expected Result |
| ------ | ------ | ----------------- |
| Given | Create a scene at its default radius. | The scene is inside configured minimum and maximum zoom limits. |
| When | Dispatch positive and negative wheel deltas, including extreme values. | Radius moves in the expected direction and is clamped to the configured bounds. |
| Then | Inspect camera position and target. | The camera remains aimed at the joint and does not lose the scene through unbounded zoom. |

**Assertions:**

- [ ] Wheel input changes radius.
- [ ] Minimum radius is enforced.
- [ ] Maximum radius is enforced.

### TC03: Visual-scale caveat is visible

**Type:** Unit + integration | **Priority:** P1 | **Story:** US-01M6DA6G

| Step | Action | Expected Result |
| ------ | ------ | ----------------- |
| Given | Load the scene fixture markup. | A note is adjacent to the scene mount. |
| When | Read the note text. | It says rendered rail movement is illustrative/exaggerated and not physical scale. |
| Then | Check semantic presentation. | The note is readable without relying on a 3D visual alone. |

**Assertions:**

- [ ] Illustrative wording is present.
- [ ] Exaggeration or non-physical-scale wording is present.
- [ ] The note is adjacent to the scene.

### TC04: Heat-flow caveat is explicit

**Type:** Unit + integration | **Priority:** P1 | **Story:** US-01M6DA6G

| Step | Action | Expected Result |
| ------ | ------ | ----------------- |
| Given | Load the scene fixture markup with the optional heat-flow explanation. | A heat-flow caveat is present even when no arrows or particles are rendered. |
| When | Read the caveat. | It identifies heat-flow visuals as illustrative and non-quantitative. |
| Then | Inspect the scene implementation scope. | No quantitative heat-flow calculation is introduced by the camera story. |

**Assertions:**

- [ ] The caveat includes illustrative wording.
- [ ] The caveat includes non-quantitative wording.
- [ ] No heat-flow physics is inferred from camera state.

## Fixtures

```yaml
camera:
  initial_radius: 8
  min_radius: 4
  max_radius: 14
  min_polar_angle: 0.35
  max_polar_angle: 1.45
pointer_drag:
  start: [100, 100]
  end: [140, 80]
wheel_deltas: [-100000, 100000]
required_labels:
  visual_scale: [illustrative, exaggerated, physical scale]
  heat_flow: [illustrative, non-quantitative]
```

## Automation Status

| TC | Title | Status | Implementation |
| --- | --- | --- | --- |
| TC01 | Pointer drag orbits around the joint | Automated | `tests/camera.test.js` |
| TC02 | Wheel zoom stays bounded | Automated | `tests/camera.test.js` |
| TC03 | Visual-scale caveat is visible | Automated | `tests/camera.test.js` |
| TC04 | Heat-flow caveat is explicit | Automated | `tests/camera.test.js` |

## Traceability

| Artefact | Reference |
| ---------- | ---------- |
| PRD | [sdlc-studio/prd.md](../prd.md) |
| Epic | [EP-01M6DA39](../epics/EP-01M6DA39-interactive-3d-railway-visualization.md) |
| Plan | [PL-01M6DBDW](../plans/PL-01M6DBDW-add-camera-interaction-and-visual-scale-communication.md) |
| TSD | [sdlc-studio/tsd.md](../tsd.md) |

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-02 | Codex | Created TDD specification with 4/4 AC coverage and 4 test cases. |
