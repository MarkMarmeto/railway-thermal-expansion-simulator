# TS-01M6DAV6: Results panel and closure explanations - Test Specification

> **Status:** Complete
> **Raised-by:** Codex; agent; v1
> **Story:** [US-01M6DAST: Render results and honest closure explanations](../stories/US-01M6DAST-render-results-and-honest-closure-explanations.md)
> **Created:** 2026-11-02
> **Created-by:** sdlc-studio remake (backfilled)

## Overview

Verify that the results panel presents the shared rail state with complete units, explains the approved formula and assumptions, distinguishes signed from physical clearance, and makes no unsupported engineering claims.

## Scope

### Stories Covered

| Story | Title | Priority |
|---|---|---|
| [US-01M6DAST](../stories/US-01M6DAST-render-results-and-honest-closure-explanations.md) | Render results and honest closure explanations | High |

### AC Coverage Matrix

| Story | AC | Description | Test Cases | Status |
|---|---|---|---|---|
| US-01M6DAST | AC1 | Required numerical results, assumptions, status, and units render. | TC01 | Covered |
| US-01M6DAST | AC2 | Closed state renders zero physical gap and honest status. | TC02 | Covered |
| US-01M6DAST | AC3 | Formula and all variables are explained plainly. | TC03 | Covered |
| US-01M6DAST | AC4 | Closed explanation makes no unsupported force/buckling/failure claim. | TC04 | Covered |

**Coverage:** 4/4 ACs covered.

### Test Types Required

| Type | Required | Rationale |
|---|---|---|
| Unit | Yes | Formatting and limitation wording are deterministic. |
| Integration | Yes | Renderer must consume the shared state emitted by controls. |
| E2E | Recommended | A later browser pass should confirm visual visibility and responsive layout. |

### Strategy Heuristics

- [x] **Production-state-shape integration test** - TC01 and TC02 use complete open and closed rail-state fixtures.
- [ ] **Rejects-old-shape contract test** - Not applicable; no persisted or external wire-format contract changes.
- [ ] **Regression test per fixed bug** - Not applicable; this is feature work.

## Environment

| Requirement | Details |
|---|---|
| Prerequisites | Node.js built-in test runner and the existing physics module. |
| External Services | None. |
| Test Data | Open Steel fixture and closed Aluminum fixture from the approved PRD examples. |

## Test Cases

### TC01: Renders complete open-state results

**Type:** Unit/Integration | **Priority:** High | **Story:** US-01M6DAST AC1

| Step | Action | Expected Result |
|---|---|---|
| Given | Provide Steel at 55°C, 6 mm initial gap, and the calculated open state. | Renderer receives a complete shared state. |
| When | Render the results panel. | All required fields are populated. |
| Then | Inspect the rendered text. | Temperature, material, coefficient, L₀, T₀, signed expansion, physical gap, status, and units are present. |

**Assertions:**

- [ ] Temperature shows °C.
- [ ] Coefficient shows per-°C units.
- [ ] Expansion and gap values show mm.
- [ ] L₀ and T₀ are visible with units.
- [ ] Status is Open.

### TC02: Renders closed state without hiding signed clearance

**Type:** Unit/Integration | **Priority:** High | **Story:** US-01M6DAST AC2

| Step | Action | Expected Result |
|---|---|---|
| Given | Provide Aluminum at 75°C, 5 mm initial gap, signed gap -6.5 mm, physical gap 0 mm. | Renderer receives a closed shared state. |
| When | Render the results panel. | Physical gap and status are rendered from the state. |
| Then | Inspect the rendered text. | Physical gap is 0 mm, signed gap remains -6.5 mm, and status is Closed / Insufficient clearance. |

**Assertions:**

- [ ] Physical gap equals 0 mm.
- [ ] Signed gap remains visible and negative.
- [ ] Exact closed status is present.

### TC03: Explains formula and variables in plain language

**Type:** Unit | **Priority:** High | **Story:** US-01M6DAST AC3

| Step | Action | Expected Result |
|---|---|---|
| Given | Render any complete rail state. | Explanation region is available. |
| When | Read the explanation text. | Formula and variable definitions are present. |
| Then | Check named terms. | α, L₀, T, T₀, ΔL, and g₀ are explained plainly with the approved expansion formula. |

**Assertions:**

- [ ] Formula includes `ΔL = α × L₀ × (T − T₀)`.
- [ ] Every named variable is defined.
- [ ] Explanation states L₀ = 10 m and T₀ = 25°C.

### TC04: Excludes unsupported engineering claims

**Type:** Unit | **Priority:** High | **Story:** US-01M6DAST AC4

| Step | Action | Expected Result |
|---|---|---|
| Given | Render the closed Aluminum state. | Closed explanation is selected. |
| When | Inspect the explanation and limitations text. | It describes insufficient clearance and model scope. |
| Then | Search for unsupported claims. | Text does not claim buckling, compression force, or real-world failure was calculated. |

**Assertions:**

- [ ] “buckling” is absent from claims of calculated behavior.
- [ ] “force” is absent from claims of calculated behavior.
- [ ] “failure” is absent from claims of predicted real-world behavior.
- [ ] Explicit limitation text says those analyses are not calculated.

## Fixtures

```yaml
open:
  material: steel
  materialName: Steel
  coefficientPerC: 0.000012
  temperatureC: 55
  initialGapMm: 6
  railLengthM: 10
  referenceTemperatureC: 25
  expansionMm: 3.6
  signedGapMm: 2.4
  remainingGapMm: 2.4
  status: Open
closed:
  material: aluminum
  materialName: Aluminum
  coefficientPerC: 0.000023
  temperatureC: 75
  initialGapMm: 5
  railLengthM: 10
  referenceTemperatureC: 25
  expansionMm: 11.5
  signedGapMm: -6.5
  remainingGapMm: 0
  status: Closed/Insufficient clearance
```

## Automation Status

| TC | Title | Status | Implementation |
|---|---|---|---|
| TC01 | Renders complete open-state results | Passed | `tests/results.test.js` |
| TC02 | Renders closed state without hiding signed clearance | Passed | `tests/results.test.js` |
| TC03 | Explains formula and variables in plain language | Passed | `tests/results.test.js` |
| TC04 | Excludes unsupported engineering claims | Passed | `tests/results.test.js` |

## Traceability

| Artefact | Reference |
|---|---|
| PRD | [sdlc-studio/prd.md](../../prd.md) |
| TRD | [sdlc-studio/trd.md](../../trd.md) |
| TSD | [sdlc-studio/tsd.md](../../tsd.md) |
| Epic | [EP-01M6DA1Y](../epics/EP-01M6DA1Y-scientific-core-and-interactive-controls.md) |
| Story | [US-01M6DAST](../stories/US-01M6DAST-render-results-and-honest-closure-explanations.md) |

## Revision History

| Date | Author | Change |
|---|---|---|
| 2026-11-02 | Codex | Created four-case specification with complete AC coverage. |
