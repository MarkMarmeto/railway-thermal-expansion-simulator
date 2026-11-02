# TS-01M6DAMB: Approved simulator controls wiring - Test Specification

> **Status:** Complete
> **Raised-by:** Codex; agent; v1
> **Story:** [US-01M6DAJJ: Wire the three approved simulator controls](../stories/US-01M6DAJJ-wire-the-three-approved-simulator-controls.md)
> **Created:** 2026-11-02
> **Created-by:** sdlc-studio remake (backfilled)

## Overview

Verify that the simulator exposes exactly the three approved controls and routes each control value into the shared rail-state calculation without changing unrelated physics inputs.

## Scope

### Stories Covered

| Story | Title | Priority |
|---|---|---|
| [US-01M6DAJJ](../stories/US-01M6DAJJ-wire-the-three-approved-simulator-controls.md) | Wire the three approved simulator controls | High |

### AC Coverage Matrix

| Story | AC | Description | Test Cases | Status |
|---|---|---|---|---|
| US-01M6DAJJ | AC1 | Exactly three labelled primary controls are exposed. | TC01 | Covered |
| US-01M6DAJJ | AC2 | Temperature endpoints update shared state and recalculated results. | TC02-TC03 | Covered |
| US-01M6DAJJ | AC3 | Gap endpoints update shared state without changing expansion. | TC04-TC05 | Covered |
| US-01M6DAJJ | AC4 | All approved materials map to matching coefficients. | TC06 | Covered |

**Coverage:** 4/4 ACs covered.

### Test Types Required

| Type | Required | Rationale |
|---|---|---|
| Unit | Yes | Control-state adapter conversion and mapping are deterministic. |
| Integration | Yes | The adapter must call the existing physics module with the shared state. |
| E2E | Yes | Control count, labels, ranges, and browser event wiring are user-visible requirements. |

### Strategy Heuristics

- [x] **Production-state-shape integration test** - TC02-TC06 inject each non-default control value into the shared state seam.
- [ ] **Rejects-old-shape contract test** - Not applicable; this story introduces no persisted or wire-format contract.
- [ ] **Regression test per fixed bug** - Not applicable; no bug is being fixed.

## Environment

| Requirement | Details |
|---|---|
| Prerequisites | Node.js built-in test runner; browser runner such as Playwright for E2E. |
| External Services | None. |
| Test Data | Defaults: 25°C, 6 mm, Steel; endpoints: 10/100°C and 0/15 mm; materials Steel/Aluminum/Copper. |

## Test Cases

### TC01: Exposes exactly the approved controls

**Type:** E2E | **Priority:** High | **Story:** US-01M6DAJJ AC1

| Step | Action | Expected Result |
|---|---|---|
| Given | Load the simulator page. | The page renders successfully. |
| When | Query primary input controls and their visible labels. | There are exactly three: temperature, initial gap, and material. |
| Then | Inspect IDs, types, ranges, and options. | Temperature is a range 10-100°C; gap is a range 0-15 mm; material is a select with only Steel, Aluminum, Copper. |

**Assertions:**

- [ ] Three and only three approved primary controls exist.
- [ ] Each control has a visible associated label and unit.
- [ ] No out-of-scope control is present.

### TC02: Updates state at the minimum temperature

**Type:** Integration | **Priority:** High | **Story:** US-01M6DAJJ AC2

| Step | Action | Expected Result |
|---|---|---|
| Given | Start with Steel, 25°C, and 6 mm. | Shared state matches defaults. |
| When | Commit temperature 10°C. | Shared state temperature becomes 10 and physics is recalculated. |
| Then | Read the resulting rail state. | Steel expansion is negative and the physical gap increases. |

**Assertions:**

- [ ] Numeric temperature is passed, not the raw string.
- [ ] Recalculation uses the shared state path.

### TC03: Updates state at the maximum temperature

**Type:** Integration | **Priority:** High | **Story:** US-01M6DAJJ AC2

| Step | Action | Expected Result |
|---|---|---|
| Given | Start with Steel, 25°C, and 6 mm. | Shared state matches defaults. |
| When | Commit temperature 100°C. | Shared state temperature becomes 100 and physics is recalculated. |
| Then | Read the resulting rail state. | Expansion is finite and the clearance reflects the increased temperature. |

**Assertions:**

- [ ] Maximum endpoint is accepted.
- [ ] Result is finite and uses the selected material and gap.

### TC04: Updates initial gap at the minimum

**Type:** Integration | **Priority:** High | **Story:** US-01M6DAJJ AC3

| Step | Action | Expected Result |
|---|---|---|
| Given | Calculate Steel at 55°C with a 6 mm gap. | A baseline expansion is available. |
| When | Commit gap 0 mm. | Shared state gap becomes 0 and physics is recalculated. |
| Then | Compare expansion and gap. | Expansion is unchanged; physical gap is clamped according to the physics contract. |

**Assertions:**

- [ ] Gap is converted to number.
- [ ] Changing only gap does not change expansion.

### TC05: Updates initial gap at the maximum

**Type:** Integration | **Priority:** Medium | **Story:** US-01M6DAJJ AC3

| Step | Action | Expected Result |
|---|---|---|
| Given | Calculate Steel at 55°C with a 6 mm gap. | A baseline expansion is available. |
| When | Commit gap 15 mm. | Shared state gap becomes 15 and physics is recalculated. |
| Then | Compare expansion and gap. | Expansion is unchanged and the larger initial gap is reflected. |

**Assertions:**

- [ ] Maximum gap endpoint is accepted.
- [ ] Expansion remains identical to the baseline.

### TC06: Maps each approved material to its coefficient

**Type:** Unit/Integration | **Priority:** High | **Story:** US-01M6DAJJ AC4

| Step | Action | Expected Result |
|---|---|---|
| Given | Use the same temperature and gap for each option. | State starts with one approved material. |
| When | Commit Steel, Aluminum, then Copper. | Shared state material changes to the selected key. |
| Then | Read each calculated state. | Coefficients are respectively 12e-6, 23e-6, and 17e-6 and expansion changes accordingly. |

**Assertions:**

- [ ] Only the three approved options are selectable.
- [ ] Selected material is passed unchanged to physics.
- [ ] Each coefficient matches the approved PRD value.

## Fixtures

```yaml
defaults:
  temperatureC: 25
  initialGapMm: 6
  material: steel
controls:
  temperatureC: { min: 10, max: 100 }
  initialGapMm: { min: 0, max: 15 }
materials:
  steel: 0.000012
  aluminum: 0.000023
  copper: 0.000017
```

## Automation Status

| TC | Title | Status | Implementation |
|---|---|---|---|
| TC01 | Exposes exactly the approved controls | Passed | `tests/controls.test.js` |
| TC02 | Minimum temperature updates state | Passed | `tests/controls.test.js` |
| TC03 | Maximum temperature updates state | Passed | `tests/controls.test.js` |
| TC04 | Minimum gap updates state | Passed | `tests/controls.test.js` |
| TC05 | Maximum gap updates state | Passed | `tests/controls.test.js` |
| TC06 | Material maps to coefficient | Passed | `tests/controls.test.js` |

## Traceability

| Artefact | Reference |
|---|---|
| PRD | [sdlc-studio/prd.md](../../prd.md) |
| TRD | [sdlc-studio/trd.md](../../trd.md) |
| TSD | [sdlc-studio/tsd.md](../../tsd.md) |
| Epic | [EP-01M6DA1Y](../epics/EP-01M6DA1Y-scientific-core-and-interactive-controls.md) |
| Story | [US-01M6DAJJ](../stories/US-01M6DAJJ-wire-the-three-approved-simulator-controls.md) |

## Revision History

| Date | Author | Change |
|---|---|---|
| 2026-11-02 | Codex | Created six-case specification with complete AC coverage. |
