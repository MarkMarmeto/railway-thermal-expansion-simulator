# TS-01M6DBJ8: Basic Three.js railway joint scene - Test Specification

> **Status:** Complete
> **Raised-by:** Codex; agent; v1
> **Story:** [US-01M6DACM: Build the basic Three.js railway joint scene](../stories/US-01M6DACM-build-the-basic-three-js-railway-joint-scene.md)
> **Created:** 2026-11-02
> **Created-by:** sdlc-studio remake (backfilled)

## Overview

Verify that the basic 3D scene is composed from local Three.js primitives, contains every required railway-joint object, and consumes shared rail state without reimplementing thermal-expansion physics.

## Scope

### Stories Covered

| Story | Title | Priority |
|---|---|---|
| [US-01M6DACM](../stories/US-01M6DACM-build-the-basic-three-js-railway-joint-scene.md) | Build the basic Three.js railway joint scene | High |

### AC Coverage Matrix

| Story | AC | Description | Test Cases | Status |
|---|---|---|---|---|
| US-01M6DACM | AC1 | Scene inventory includes rails, joint, sleepers, gap indicator, camera, and lighting. | TC01 | Covered |
| US-01M6DACM | AC2 | Scene uses primitive geometry without imported assets or physics engine. | TC02 | Covered |
| US-01M6DACM | AC3 | Scene applies shared state without duplicating the physics formula. | TC03 | Covered |

**Coverage:** 3/3 ACs covered.

### Test Types Required

| Type | Required | Rationale |
|---|---|---|
| Unit | Yes | Scene factory and state application can be tested with a fake Three.js API. |
| Integration | Yes | Browser startup must connect the scene to the existing shared state. |
| E2E | Recommended | A later browser smoke test should confirm a visible canvas on a classroom laptop. |

### Strategy Heuristics

- [x] **Production-state-shape integration test** - TC03 uses complete open and closed rail-state fixtures.
- [ ] **Rejects-old-shape contract test** - Not applicable; no persisted or external wire-format contract changes.
- [ ] **Regression test per fixed bug** - Not applicable; this is feature work.

## Environment

| Requirement | Details |
|---|---|
| Prerequisites | Node.js built-in test runner; a fake Three.js object for unit tests; browser/WebGL for smoke testing. |
| External Services | None; no imported assets or network calls. |
| Test Data | Open Steel state, closed Aluminum state, and incomplete-state fixture. |

## Test Cases

### TC01: Builds the required scene inventory

**Type:** Unit/Integration | **Priority:** High | **Story:** US-01M6DACM AC1

| Step | Action | Expected Result |
|---|---|---|
| Given | Provide a fake Three.js API and a canvas mount. | Renderer, scene, camera, and light constructors are available. |
| When | Initialize the railway scene. | Scene graph is built from named groups. |
| Then | Inspect the graph. | Two rail ends, joint, sleepers, gap indicator, camera, and basic lighting are present. |

**Assertions:**

- [ ] Two rail-end meshes exist.
- [ ] Joint and gap indicator objects exist.
- [ ] Sleeper group contains repeated geometry.
- [ ] Camera and at least one basic light exist.

### TC02: Uses primitive geometry only

**Type:** Unit | **Priority:** High | **Story:** US-01M6DACM AC2

| Step | Action | Expected Result |
|---|---|---|
| Given | Initialize the scene with the fake API. | No asset loader or physics engine is provided. |
| When | Construct the scene. | Initialization succeeds using primitive geometry. |
| Then | Inspect calls and source dependencies. | Box/plane/cylinder-like primitives are used; no model fetch or physics import occurs. |

**Assertions:**

- [ ] No imported model is required.
- [ ] No physics-engine dependency is required.
- [ ] No network request is made by scene initialization.

### TC03: Applies shared rail state without recalculating physics

**Type:** Unit/Integration | **Priority:** High | **Story:** US-01M6DACM AC3

| Step | Action | Expected Result |
|---|---|---|
| Given | Initialize the scene and provide a complete calculated state. | Scene has a gap indicator and rail groups. |
| When | Apply open, closed, and incomplete states. | Gap indicator updates from `remainingGapMm`; no formula is evaluated. |
| Then | Inspect scene source and object state. | State is consumed directly and incomplete input is handled explicitly. |

**Assertions:**

- [ ] Open state remains visually open.
- [ ] Closed state reaches the joint boundary without negative physical geometry.
- [ ] Scene source contains no expansion equation or material coefficient table.
- [ ] Incomplete state does not fabricate a result.

## Fixtures

```yaml
open:
  material: steel
  temperatureC: 55
  initialGapMm: 6
  expansionMm: 3.6
  signedGapMm: 2.4
  remainingGapMm: 2.4
  status: Open
closed:
  material: aluminum
  temperatureC: 75
  initialGapMm: 5
  expansionMm: 11.5
  signedGapMm: -6.5
  remainingGapMm: 0
  status: Closed/Insufficient clearance
```

## Automation Status

| TC | Title | Status | Implementation |
|---|---|---|---|
| TC01 | Builds the required scene inventory | Passed | `tests/scene.test.js` |
| TC02 | Uses primitive geometry only | Passed | `tests/scene.test.js` |
| TC03 | Applies shared rail state without recalculating physics | Passed | `tests/scene.test.js` |

## Traceability

| Artefact | Reference |
|---|---|
| PRD | [sdlc-studio/prd.md](../../prd.md) |
| TRD | [sdlc-studio/trd.md](../../trd.md) |
| TSD | [sdlc-studio/tsd.md](../../tsd.md) |
| Epic | [EP-01M6DA39](../epics/EP-01M6DA39-interactive-3d-railway-joint-scene.md) |
| Story | [US-01M6DACM](../stories/US-01M6DACM-build-the-basic-three-js-railway-joint-scene.md) |

## Revision History

| Date | Author | Change |
|---|---|---|
| 2026-11-02 | Codex | Created three-case specification with complete AC coverage. |
