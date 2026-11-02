# PL-01M6DAME: Render results and honest closure explanations - Implementation Plan

> **Status:** Draft
> **Raised-by:** Codex; agent; v1
> **Story:** [US-01M6DAST: Render results and honest closure explanations](../stories/US-01M6DAST-render-results-and-honest-closure-explanations.md)
> **Epic:** [EP-01M6DA1Y: Scientific Core and Interactive Controls](../epics/EP-01M6DA1Y-scientific-core-and-interactive-controls.md)
> **Created:** 2026-11-02
> **Language:** JavaScript
> **Created-by:** sdlc-studio remake (backfilled)

## Overview

Add a readable results panel and scientific explanation fed entirely by the shared rail state. The panel must preserve signed values for explanation, display the clamped physical gap, show all approved assumptions and units, and explicitly limit claims when clearance closes.

## Acceptance Criteria Summary

| AC | Description | Plan coverage |
|---|---|---|
| AC1 | Results show all required values, assumptions, status, and units. | Tasks 1-3; TC01 |
| AC2 | Closed states show physical gap 0 mm and honest status. | Tasks 2-3; TC02 |
| AC3 | Formula and variables are explained in plain language. | Tasks 1, 3; TC03 |
| AC4 | Closed explanation excludes unsupported force/buckling/failure claims. | Tasks 2-3; TC04 |

## Technical Context

### Language & Framework

- **Primary Language:** JavaScript
- **Framework:** Existing browser entry point; semantic HTML/CSS
- **Test Framework:** Node built-in test runner for renderer output; browser check may be added later

### Relevant Best Practices

- Render from the shared calculated state; do not recalculate physics in the view layer.
- Keep signed gap and physical gap distinct in labels and explanatory text.
- Use semantic headings, definition lists/table-like labels, and sufficient contrast without encoding meaning by color alone.
- Use explicit text for scientific assumptions and limitations.

### Existing Patterns

`src/main.js` owns the shared controller and emits `simulatorstatechange`; `index.html` contains the controls. The results renderer should subscribe to that state path and remain a pure formatter where possible. No stylesheet exists yet.

## Recommended Approach

**Strategy:** TDD
**Rationale:** The story is a precise presentation contract with high risk of missing units or making unsupported engineering claims. Pure formatting tests can lock the wording and required fields before DOM styling.

### Test Priority

1. Required values, units, formula, and assumptions.
2. Open versus closed physical/signed gap distinction.
3. Negative claim checks for buckling, force, and real-world failure.

## Implementation Tasks

| # | Task | File | Depends On | Status |
|---:|---|---|---|---|
| 1 | Add semantic results-panel markup and explanation regions with stable IDs. | `index.html` | Existing controls | [x] |
| 2 | Add pure result-formatting/render functions that consume the shared rail state and preserve signed versus physical gap. | `src/main.js` | `src/physics.js` | [x] |
| 3 | Add styles for readable results, status text, units, and formula/assumptions sections without color-only meaning. | `src/style.css` | Task 1 | [x] |
| 4 | Add tests for required fields, closed-state wording, formula explanation, and unsupported-claim exclusions. | `tests/results.test.js` | Tasks 1-2 | [x] |
| 5 | Run tests, validate acceptance criteria, and check that the renderer contains no duplicate physics formula. | `tests/`, `src/main.js`, `index.html` | Tasks 1-4 | [x] |

## Parallel Execution Groups

| Group | Tasks | Prerequisite |
|---|---|---|
| A | Task 1 | Existing control page |
| B | Task 2 | Existing shared-state controller |
| C | Tasks 3-4 | Markup and renderer seam |
| D | Task 5 | Green test suite |

## Implementation Phases

### Phase 1: Establish results contract

**Goal:** Define semantic regions for numeric results, status, formula, assumptions, and limitations.

- [x] Add a results heading and stable result element IDs.
- [x] Add separate fields for signed gap and physical gap.
- [x] Add formula and variable explanation text using approved notation and units.

**Files:** `index.html` - new results and explanation markup.

### Phase 2: Render shared state honestly

**Goal:** Update every displayed value from the shared rail state.

- [x] Format temperature, material, coefficient, L₀, T₀, expansion, and gaps with units.
- [x] Render `Open` only for positive signed clearance; otherwise render `Closed / Insufficient clearance` and physical gap 0 mm.
- [x] State that this model does not calculate buckling, compression force, or real-world failure.
- [x] Subscribe to the existing state-change event without duplicating the expansion equation.

**Files:** `src/main.js` - renderer and event hookup; `src/physics.js` - no calculation changes expected.

### Phase 3: Presentation and validation

**Goal:** Make the panel readable and prove all acceptance criteria.

- [x] Add responsive, high-contrast styles with visible status text.
- [x] Add pure renderer tests for open and closed states.
- [x] Run Node tests, AC verification, structural validation, and diff checks.

**Files:** `src/style.css`, `tests/results.test.js`.

| AC | Verification Method | File Evidence | Status |
|---|---|---|---|
| AC1 | Renderer output contains every required field and unit. | `tests/results.test.js` TC01 | Passed |
| AC2 | Closed fixture renders zero physical gap and exact status. | `tests/results.test.js` TC02 | Passed |
| AC3 | Explanation contains formula and all named variables. | `tests/results.test.js` TC03 | Passed |
| AC4 | Closed explanation excludes unsupported engineering claims. | `tests/results.test.js` TC04 | Passed |

## Edge Case Handling

| # | Edge Case | Handling Strategy | Phase |
|---:|---|---|---|
| 1 | Signed gap is negative | Preserve signed gap in its own field; display physical gap as 0 mm and closed status. | 2 |
| 2 | Signed gap is exactly zero | Treat as closed/insufficient clearance because status is Open only when signed gap > 0. | 2 |
| 3 | Cooling produces negative expansion | Render the signed negative expansion with mm units; do not clamp expansion. | 2-3 |
| 4 | Material coefficient is displayed | Render the selected coefficient in scientific notation with per-°C unit. | 2 |
| 5 | Unsupported claim temptation | Use fixed limitation text that explicitly excludes buckling, force, and failure prediction. | 2-3 |
| 6 | Missing/non-finite state | Keep renderer defensive: show an unavailable-state message rather than fabricating values. | 2 |

**Coverage:** 6/6 edge cases handled.

## Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| View recomputes physics independently. | High | Renderer consumes state only; tests use supplied fixtures and inspect no formula duplication. |
| Signed gap is hidden by clamping. | High | Separate signed-gap and physical-gap fields and closed fixture assertions. |
| Wording implies structural failure prediction. | High | Negative assertions forbid buckling, force, and real-world failure claims. |

## Definition of Done

- [x] All four ACs pass.
- [x] Required numerical values and units are visible.
- [x] Open/closed status and signed/physical gap distinction are explicit.
- [x] Formula, variables, assumptions, and model limitations are explained.
- [x] No unsupported engineering claim is rendered.
- [x] Tests, validation, and diff checks pass.

## Notes

This story does not add 3D rendering or animation. It provides the textual/numerical explanation layer consumed by later exhibit stories.

## Revision History

| Date | Author | Change |
|---|---|---|
| 2026-11-02 | Codex | Created TDD plan with complete AC and edge-case coverage. |
