# TS-01M6DBYH: Rail movement and temperature visualization

> **Status:** Draft
> **Created:** 2026-11-02
> **Created-by:** Codex; agent; v1
> **Raised-by:** Codex; agent; v1
> **Story:** US-01M6DA9T
> **Epic:** EP-01M6DA39

## Overview

Verify that the existing Three.js railway scene responds to calculated rail state with smooth visual movement, bounded temperature coloring, a readable material cue, and no rendered rail overlap when signed clearance is insufficient. Tests must keep visual exaggeration separate from the physics state.

## Scope

### Stories Covered

| Story | Title | Priority |
| --- | --- | --- |
| [US-01M6DA9T](../stories/US-01M6DA9T-animate-rail-movement-and-temperature-visualization.md) | Animate rail movement and temperature visualization | P1 |

### AC Coverage Matrix

| Story | AC | Description | Test Cases | Status |
| --- | --- | --- | --- | --- |
| US-01M6DA9T | AC1 | Rail ends move smoothly from calculated expansion on state updates. | TC01 | Covered |
| US-01M6DA9T | AC2 | Temperature maps from cool blue to warm red over 10-100°C. | TC02 | Covered |
| US-01M6DA9T | AC3 | Material identity remains readable while temperature color changes. | TC03 | Covered |
| US-01M6DA9T | AC4 | Closed clearance clamps rendered geometry and never shows physical overlap. | TC04 | Covered |

**Coverage:** 4/4 ACs covered

### Test Types Required

| Type | Required | Rationale |
| ------ | ---------- | ----------- |
| Unit | Yes | Pure color, interpolation, clamping, and material-cue helpers are deterministic. |
| Integration | Yes | The scene update seam must apply one shared rail state without mutating physics values. |
| E2E | No | Manual browser verification is already specified by the story; this change has no backend or external integration. |

### Strategy Heuristics

- [x] **Production-state-shape integration test** - TC01 and TC04 inject complete shared rail state, including signed clearance and expansion fields.
- [x] **Rejects-old-shape contract test** - Not applicable: no wire format, API shape, or schema changes.
- [x] **Regression test per fixed bug** - Not applicable: this is new visual behavior, covered at the scene update seam.

## Environment

| Requirement | Details |
| ------------- | --------- |
| Prerequisites | Node.js; existing fake Three.js test seam; no browser required for automated tests. |
| External Services | None. |
| Test Data | Rail state with temperature 10, 55, and 100°C; material identities; positive and non-positive signed clearance. |

## Test Cases

### TC01: Smooth rail movement from calculated expansion

**Type:** Unit + integration | **Priority:** P0 | **Story:** US-01M6DA9T

| Step | Action | Expected Result |
| ------ | -------- | ----------------- |
| Given | Create a scene and provide two valid rail states with different calculated expansion values. | Rail target positions are derived from state values and remain finite. |
| When | Apply the updated state through the scene update seam with an intermediate animation step. | Rail ends move toward the new targets without a discontinuous jump. |
| Then | Compare the rendered positions and the original state object. | Movement is in the expected direction, and visual scaling does not mutate physics values. |

**Assertions:**

- [ ] Target movement responds to calculated expansion.
- [ ] Interpolation is monotonic and bounded by the target.
- [ ] The original calculated expansion and signed gap remain unchanged.

### TC02: Temperature color mapping

**Type:** Unit | **Priority:** P0 | **Story:** US-01M6DA9T

| Step | Action | Expected Result |
| ------ | -------- | ----------------- |
| Given | Request the visual color for 10°C, a midpoint temperature, and 100°C. | All results are valid colors. |
| When | Map temperatures across and outside the supported range. | Inputs are bounded to 10-100°C. |
| Then | Compare endpoint and midpoint channels. | 10°C is cool blue, 100°C is warm red, and the midpoint is between the endpoints. |

**Assertions:**

- [ ] Low endpoint is blue-dominant.
- [ ] High endpoint is red-dominant.
- [ ] Midpoint is a bounded interpolation.
- [ ] Out-of-range values clamp without producing invalid color channels.

### TC03: Material identity cue remains readable

**Type:** Unit + integration | **Priority:** P1 | **Story:** US-01M6DA9T

| Step | Action | Expected Result |
| ------ | ---------- | --------------- |
| Given | Apply two different material selections at the same temperature. | The temperature color is identical for both states. |
| When | Update the scene material cue. | A material label or contrasting swatch identifies the selected material. |
| Then | Change temperature while retaining the material. | Heat color changes while the material identity cue remains present and distinct. |

**Assertions:**

- [ ] Material identity is independent of heat color.
- [ ] The cue is available for every supported material.
- [ ] Temperature updates do not remove or overwrite the cue.

### TC04: Closed clearance never renders physical overlap

**Type:** Unit + integration | **Priority:** P0 | **Story:** US-01M6DA9T

| Step | Action | Expected Result |
| ------ | ---------- | --------------- |
| Given | Provide a state with signed clearance of zero or less. | The visual separation target is clamped at the joint boundary. |
| When | Apply the state and advance animation. | Rails approach the boundary without crossing or overlapping. |
| Then | Inspect rendered positions and the results state. | Geometry contains no negative physical gap, while the signed numerical value remains available as data. |

**Assertions:**

- [ ] Non-positive clearance never creates negative visual separation.
- [ ] Rail meshes do not overlap in the closed state.
- [ ] Signed clearance is not rewritten to hide the physics result.

## Fixtures

```yaml
temperature_range_c: [10, 100]
temperatures_c: [10, 55, 100, 0, 120]
materials: [steel, aluminum]
rail_state:
  expansion_mm: 12.5
  remaining_gap_mm: 4.0
closed_states: [0, -1.0]
```

## Automation Status

| TC | Title | Status | Implementation |
| --- | --- | --- | --- |
| TC01 | Smooth rail movement from calculated expansion | Automated | `tests/animation.test.js` |
| TC02 | Temperature color mapping | Automated | `tests/animation.test.js` |
| TC03 | Material identity cue remains readable | Automated | `tests/animation.test.js` |
| TC04 | Closed clearance never renders physical overlap | Automated | `tests/animation.test.js` |

## Traceability

| Artefact | Reference |
| ---------- | ---------- |
| PRD | [sdlc-studio/prd.md](../prd.md) |
| Epic | [EP-01M6DA39](../epics/EP-01M6DA39-interactive-3d-railway-visualization.md) |
| Plan | [PL-01M6DBCQ](../plans/PL-01M6DBCQ-animate-rail-movement-and-temperature-visualization.md) |
| TSD | [sdlc-studio/tsd.md](../tsd.md) |

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-02 | Codex | Created TDD specification with 4/4 AC coverage and 4 test cases. |
