# TS-01M6DAX8: Deterministic rail-state physics test specification

> **Status:** Complete  
> **Raised-by:** Codex; agent; v1  
> **Story:** [US-01M6DA7V: Implement deterministic rail-state physics](../../stories/US-01M6DA7V-implement-deterministic-rail-state-physics.md)  
> **Epic:** [EP-01M6DA1Y: Scientific Core and Interactive Controls](../../epics/EP-01M6DA1Y-scientific-core-and-interactive-controls.md)  
> **Created:** 2026-11-02  
> **Last Updated:** 2026-11-02
> **Created-by:** sdlc-studio remake (backfilled)

## Overview

This specification verifies the pure physics contract before UI or 3D work. Tests use exact numeric expectations for the approved examples and explicit edge assertions for signs, boundaries, coefficient selection, conversion, status, and gap clamping.

## Scope

### Stories Covered

| Story | Title | Priority |
|---|---|---|
| [US-01M6DA7V](../../stories/US-01M6DA7V-implement-deterministic-rail-state-physics.md) | Implement deterministic rail-state physics | Must |

### AC Coverage Matrix

| Story | AC | Description | Test Cases | Status |
|---|---|---|---|---|
| US-01M6DA7V | AC1 | Steel 55°C / 6 mm worked example | TC01 | Planned |
| US-01M6DA7V | AC2 | Aluminum 75°C / 5 mm insufficient-clearance example | TC02 | Planned |
| US-01M6DA7V | AC3 | Cooling, reference temperature, and non-negative physical gap | TC03–TC06 | Planned |
| US-01M6DA7V | AC4 | Coefficients, fixed assumptions, and unit conversion | TC01–TC08 | Planned |

**Coverage:** 4/4 ACs mapped to planned test cases.

### Test Types Required

| Type | Required | Rationale |
|---|---|---|
| Unit | Yes | The pure calculation is the scientific contract and must be testable without browser dependencies. |
| Integration | No | UI/state wiring belongs to a downstream story; this story has no integration boundary. |
| E2E | No | Browser behavior belongs to the exhibit-quality epic. |

### Strategy Heuristics

- [x] **Production-state-shape integration test** - Not applicable; no production state or persistence exists.
- [x] **Rejects-old-shape contract test** - Not applicable; no external wire contract changes.
- [x] **Regression test per fixed bug** - Not applicable; this is greenfield foundation work.

## Environment

| Requirement | Details |
|---|---|
| Prerequisites | Node runtime with built-in `node:test`; `src/physics.js` and `tests/physics.test.js`. |
| External Services | None. |
| Test Data | Inline deterministic material and input fixtures. |

## Test Cases

### TC01: Steel worked example remains open

**Type:** Unit | **Priority:** Must | **Story:** US-01M6DA7V

| Step | Action | Expected Result |
|---|---|---|
| Given | Select Steel, `T = 55°C`, `g₀ = 6 mm`, `L₀ = 10 m`, `T₀ = 25°C`. | Inputs are accepted. |
| When | Call `calculateRailState()`. | Expansion is calculated from the approved equation. |
| Then | Assert expansion, signed gap, physical gap, and status. | `ΔL = 3.6 mm`, signed gap `2.4 mm`, physical gap `2.4 mm`, Open. |

**Assertions:**

- [ ] Expansion equals 3.6 mm.
- [ ] Signed and physical gaps equal 2.4 mm.
- [ ] Status equals Open.

### TC02: Aluminum insufficient clearance is reported honestly

**Type:** Unit | **Priority:** Must | **Story:** US-01M6DA7V

| Step | Action | Expected Result |
|---|---|---|
| Given | Select Aluminum, `T = 75°C`, and `g₀ = 5 mm`. | Inputs are accepted. |
| When | Call `calculateRailState()`. | Expansion is 11.5 mm. |
| Then | Assert signed gap, physical gap, and status. | Signed gap `−6.5 mm`, physical gap `0 mm`, Closed / Insufficient clearance. |

**Assertions:**

- [ ] Expansion equals 11.5 mm.
- [ ] Signed gap equals −6.5 mm.
- [ ] Physical gap equals 0 mm.
- [ ] Status does not claim buckling or force was calculated.

### TC03: Cooling increases clearance

**Type:** Unit | **Priority:** Must | **Story:** US-01M6DA7V

| Step | Action | Expected Result |
|---|---|---|
| Given | Select Steel, `T = 10°C`, and `g₀ = 6 mm`. | Boundary input is accepted. |
| When | Calculate state. | Expansion is `−1.8 mm`. |
| Then | Assert gap and status. | Physical gap is `7.8 mm`; status is Open. |

### TC04: Reference temperature produces zero expansion

**Type:** Unit | **Priority:** Must | **Story:** US-01M6DA7V

| Step | Action | Expected Result |
|---|---|---|
| Given | Select each approved material with `T = 25°C`. | Reference input is accepted. |
| When | Calculate state for each material. | `ΔT = 0`. |
| Then | Assert expansion. | Expansion is exactly `0 mm` for all three materials. |

### TC05: Minimum gap closes at non-contracting temperature

**Type:** Unit | **Priority:** Must | **Story:** US-01M6DA7V

| Step | Action | Expected Result |
|---|---|---|
| Given | Set `g₀ = 0 mm` and `T >= 25°C`. | Minimum gap is accepted. |
| When | Calculate state. | Signed gap is non-positive. |
| Then | Assert display state. | Physical gap is `0 mm`; status is Closed / Insufficient clearance. |

### TC06: Physical gap is clamped but signed gap is preserved

**Type:** Unit | **Priority:** Must | **Story:** US-01M6DA7V

| Step | Action | Expected Result |
|---|---|---|
| Given | Choose inputs that produce a negative signed gap. | Insufficient-clearance state exists. |
| When | Calculate state. | Signed gap remains negative. |
| Then | Assert the two gap fields. | Physical gap is `0 mm`; signed gap is unchanged for explanation/status. |

### TC07: All material coefficients are distinct and applied

**Type:** Unit | **Priority:** High | **Story:** US-01M6DA7V

| Step | Action | Expected Result |
|---|---|---|
| Given | Calculate the same temperature delta and rail length for Steel, Aluminum, and Copper. | Each material resolves its approved coefficient. |
| When | Calculate state for all materials. | Coefficients are 12, 23, and 17 × 10⁻⁶ /°C respectively. |
| Then | Compare expansion. | Expansion follows the selected coefficient; no material uses another material’s value. |

### TC08: Metre-to-millimetre conversion is applied once

**Type:** Unit | **Priority:** High | **Story:** US-01M6DA7V

| Step | Action | Expected Result |
|---|---|---|
| Given | Use Steel, `L₀ = 10 m`, and `ΔT = 30°C`. | Base expansion in metres is `0.0036 m`. |
| When | Read returned expansion. | Conversion to display units occurs once. |
| Then | Assert returned value. | Expansion is `3.6 mm`, not `0.0036` or `3600 mm`. |

## Fixtures

```yaml
constants:
  railLengthM: 10
  referenceTemperatureC: 25
materials:
  steel: 0.000012
  aluminum: 0.000023
  copper: 0.000017
examples:
  steel_open: { material: steel, temperatureC: 55, initialGapMm: 6 }
  aluminum_closed: { material: aluminum, temperatureC: 75, initialGapMm: 5 }
```

## Automation Status

| TC | Title | Status | Implementation |
|---|---|---|---|
| TC01–TC08 | Deterministic rail-state physics cases | Passed | `tests/physics.test.js` |

## Traceability

| Artefact | Reference |
|---|---|
| PRD | [sdlc-studio/prd.md](../../prd.md) |
| TRD | [sdlc-studio/trd.md](../../trd.md) |
| TSD | [sdlc-studio/tsd.md](../../tsd.md) |
| Story | [US-01M6DA7V](../../stories/US-01M6DA7V-implement-deterministic-rail-state-physics.md) |

## Revision History

| Date | Author | Change |
|---|---|---|
| 2026-11-02 | Codex | Created test specification with 8 cases and full AC coverage. |
