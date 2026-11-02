# PL-01M6DAJH: Wire the three approved simulator controls - Implementation Plan

> **Status:** Draft
> **Raised-by:** Codex; agent; v1
> **Story:** [US-01M6DAJJ: Wire the three approved simulator controls](../stories/US-01M6DAJJ-wire-the-three-approved-simulator-controls.md)
> **Epic:** [EP-01M6DA1Y: Scientific Core and Interactive Controls](../epics/EP-01M6DA1Y-scientific-core-and-interactive-controls.md)
> **Created:** 2026-11-02
> **Language:** JavaScript
> **Created-by:** sdlc-studio remake (backfilled)

## Overview

Create the simulator's sole primary input surface: a labelled temperature slider, a labelled initial-gap slider, and a labelled material dropdown. Keep control values in one shared state owned by `main.js`, pass that state to the existing pure physics module, and expose a refresh seam for results and scene consumers without adding controls outside the approved scope.

## Acceptance Criteria Summary

| AC | Description | Plan coverage |
|---|---|---|
| AC1 | Page exposes only the three labelled primary controls. | Tasks 1-2; TC01 |
| AC2 | Temperature 10-100°C updates shared state and recalculates results. | Tasks 2-3; TC02-TC03 |
| AC3 | Gap 0-15 mm updates shared state without changing expansion. | Tasks 2-3; TC04-TC05 |
| AC4 | Steel, Aluminum, and Copper select matching coefficients. | Tasks 2-3; TC06 |

## Technical Context

### Language & Framework

- **Primary Language:** JavaScript
- **Framework:** Vite-compatible browser module; native HTML controls
- **Test Framework:** Node built-in test runner for state logic; Playwright/browser checks for DOM wiring

### Relevant Best Practices

- Use explicit labels, `for`/`id` associations, ranges, units, and keyboard-operable native controls.
- Keep DOM event handling separate from the pure `calculateRailState()` function.
- Use one state object and one recomputation path so material, temperature, and gap cannot drift.
- Do not add unapproved controls, hidden alternate inputs, network calls, or persistence.

### Existing Patterns

`src/physics.js` is the existing pure domain boundary and returns the shared rail state. No `index.html` or `src/main.js` exists yet, so this plan establishes the initial browser entry point and its test seam.

## Recommended Approach

**Strategy:** TDD
**Rationale:** The story has four precise input/state contracts and a strict control-count constraint. Tests can assert the pure control-to-state mapping before browser presentation details are expanded.

### Test Priority

1. Exact control inventory, labels, IDs, ranges, and defaults.
2. Temperature and gap state updates through the shared recomputation path.
3. Material coefficient selection and preservation of expansion behavior.

## Implementation Tasks

| # | Task | File | Depends On | Status |
|---:|---|---|---|---|
| 1 | Define the HTML control surface with exactly three primary controls, explicit labels, units, ranges, and approved defaults. | `index.html` | None | [x] |
| 2 | Add a small control-state adapter and event wiring that reads the three controls, validates their constrained values, and calls `calculateRailState()` once per committed input. | `src/main.js` | Task 1; `src/physics.js` | [x] |
| 3 | Add browser-facing tests for inventory and state changes, plus unit tests for the adapter's temperature, gap, and material mapping. | `tests/controls.test.js` | Tasks 1-2 | [x] |
| 4 | Run tests and quality checks; confirm no unapproved controls or duplicated physics formula were introduced. | `tests/`, `index.html`, `src/main.js` | Tasks 1-3 | [x] |

## Parallel Execution Groups

| Group | Tasks | Prerequisite |
|---|---|---|
| A | Task 1 | Approved PRD control contract |
| B | Task 2 | HTML IDs and existing physics export |
| C | Task 3 | Tasks 1-2 complete |
| D | Task 4 | Green tests |

## Implementation Phases

### Phase 1: Establish the approved input surface

**Goal:** Make the exact control contract present and accessible.

- [x] Add `temperatureC` range input: 10-100, default 25, with visible °C value.
- [x] Add `initialGapMm` range input: 0-15, default 6, with visible mm value.
- [x] Add `material` select with only Steel, Aluminum, and Copper options; do not add a fourth primary control.
- [x] Associate every control with a visible label and stable ID.

**Files:** `index.html` - new browser shell and control markup.

### Phase 2: Wire one shared state path

**Goal:** Ensure every approved input updates the same physics calculation.

- [x] Read the three controls into one state object using numeric conversion for sliders.
- [x] Call `calculateRailState({ material, temperatureC, initialGapMm })` from one recompute function.
- [x] Update the displayed control values and expose the latest state to downstream results/scene consumers.
- [x] Keep validation/ranges aligned with the PRD and avoid duplicating the expansion equation.

**Files:** `src/main.js`, `src/physics.js` - import only; no formula changes expected.

### Phase 3: Testing & Validation

**Goal:** Verify all acceptance criteria and scope boundaries.

| AC | Verification Method | File Evidence | Status |
|---|---|---|---|
| AC1 | DOM contract test checks exactly three primary controls and labels. | `tests/controls.test.js` TC01 | Passed |
| AC2 | Adapter test changes temperature to 10 and 100 and asserts state/result updates. | `tests/controls.test.js` TC02-TC03 | Passed |
| AC3 | Adapter test changes gap endpoints and asserts expansion is unchanged. | `tests/controls.test.js` TC04-TC05 | Passed |
| AC4 | Material selection test covers all three approved materials and coefficient values. | `tests/controls.test.js` TC06 | Passed |

## Edge Case Handling

| # | Edge Case | Handling Strategy | Phase |
|---:|---|---|---|
| 1 | Temperature at 10°C | Native min constraint plus numeric adapter preserves the lower bound and recalculates. | 1-2 |
| 2 | Temperature at 100°C | Native max constraint plus numeric adapter preserves the upper bound and recalculates. | 1-2 |
| 3 | Initial gap at 0 mm | Accept zero explicitly; pass it to physics so closed clearance is represented honestly. | 1-2 |
| 4 | Initial gap at 15 mm | Accept the maximum explicitly without changing thermal expansion. | 1-2 |
| 5 | Material selection changes | Restrict options to the three approved keys and pass the selected key unchanged. | 1-2 |
| 6 | Slider string-to-number conversion | Convert input values before calling physics; reject non-finite values at the adapter boundary. | 2 |

**Coverage:** 6/6 edge cases handled.

## Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| A second formula is added in `main.js`. | High | Import and call `calculateRailState()`; test expansion invariance when gap changes. |
| Labels/ranges drift from the PRD. | Medium | DOM assertions inspect exact IDs, labels, min/max, and option set. |
| Control events update separate state copies. | High | One recompute function owns the shared state and test each input through it. |

## Definition of Done

- [x] All four ACs pass through automated or browser verification.
- [x] Exactly three approved primary controls are present.
- [x] Temperature, gap, and material changes reach the shared physics state.
- [x] No new physics formula or out-of-scope control exists.
- [x] Tests, validation, and diff checks pass.

## Notes

This plan intentionally leaves results rendering and 3D scene behavior to later stories. The implementation may expose a small state/recompute seam for those consumers, but it must not implement their UI or animation yet.

## Revision History

| Date | Author | Change |
|---|---|---|
| 2026-11-02 | Codex | Created TDD plan with complete AC and edge-case coverage. |
