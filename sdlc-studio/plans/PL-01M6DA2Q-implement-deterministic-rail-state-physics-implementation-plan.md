# PL-01M6DA2Q: Implement deterministic rail-state physics - Implementation Plan

> **Status:** Draft  
> **Raised-by:** Codex; agent; v1  
> **Story:** [US-01M6DA7V: Implement deterministic rail-state physics](../stories/US-01M6DA7V-implement-deterministic-rail-state-physics.md)  
> **Epic:** [EP-01M6DA1Y: Scientific Core and Interactive Controls](../epics/EP-01M6DA1Y-scientific-core-and-interactive-controls.md)  
> **Created:** 2026-11-02  
> **Language:** JavaScript
> **Created-by:** sdlc-studio remake (backfilled)

## Overview

Implement the pure scientific calculation before any UI or 3D work. The function returns one serializable rail state with signed expansion, signed clearance, clamped physical gap, and derived status. Tests use Node’s built-in runner and are written first.

## Acceptance Criteria Summary

| AC | Description | Plan coverage |
|---|---|---|
| AC1 | Steel worked example returns 3.6 mm expansion, 2.4 mm gap, Open. | Tasks 1–3; TC01 |
| AC2 | Aluminum insufficient-clearance example returns 11.5 mm expansion, -6.5 mm signed gap, 0 mm physical gap, Closed. | Tasks 1–3; TC02 |
| AC3 | Cooling is negative, reference temperature is zero, physical gap never negative. | Tasks 2–3; TC03–TC06 |
| AC4 | Selected coefficient, fixed assumptions, and metre-to-millimetre conversion are applied consistently. | Tasks 1–3; TC07–TC08 |

## Technical Context

### Language & Framework

- **Primary Language:** JavaScript
- **Framework:** None; pure module
- **Test Framework:** Node built-in `node:test` and `node:assert/strict`

### Relevant Best Practices

- Keep domain logic pure and independent of DOM, Three.js, timers, and network calls.
- Use explicit expected values for scientific examples and boundary tests.
- Preserve signed intermediate values; clamp only the physical display value.
- Write tests before implementation and prove the suite fails against the missing function.

### Existing Patterns

No application source exists yet. Follow the TRD module boundary: `src/physics.js` exports the calculation and constants; `tests/physics.test.js` imports it directly.

## Recommended Approach

**Strategy:** TDD  
**Rationale:** The story has a clear mathematical contract, more than five edge conditions, and a high consequence for silent sign/unit errors. Tests can be deterministic and implementation-independent.

### Test Priority

1. Worked examples and signed/clamped gap behavior.
2. Reference-temperature, cooling, and input-boundary behavior.
3. All material coefficients and unit conversion.

## Implementation Tasks

| # | Task | File | Depends On | Status |
|---:|---|---|---|---|
| 1 | Define approved material constants and fixed assumptions (`L₀`, `T₀`). | `src/physics.js` | None | [x] |
| 2 | Write failing tests for examples, edges, coefficients, and conversion. | `tests/physics.test.js` | Task 1 contract only | [x] |
| 3 | Implement `calculateRailState(input)` with validation, signed values, clamp, and status. | `src/physics.js` | Task 2 red tests | [x] |
| 4 | Run the Node suite, inspect failures, and refactor only without changing the contract. | `src/physics.js`, `tests/physics.test.js` | Tasks 2–3 | [x] |
| 5 | Run mutation checks for conversion, reference temperature, coefficient, and clamp logic. | `src/physics.js`, `tests/physics.test.js` | Task 4 green suite | [x] |

## Parallel Execution Groups

| Group | Tasks | Prerequisite |
|---|---|---|
| A | Task 1 | None |
| B | Task 2 | Contract from Task 1 |
| C | Tasks 3–5 | Red tests from Task 2 |

## Implementation Phases

### Phase 1: Establish the scientific contract

**Goal:** Make constants and the pure function boundary explicit.

- [x] Add Steel, Aluminum, and Copper coefficients.
- [x] Add fixed `railLengthM = 10` and `referenceTemperatureC = 25`.
- [x] Define the returned state fields used by later UI/scene stories.

**Files:** `src/physics.js` - new pure module.

### Phase 2: Test-first implementation

**Goal:** Make every approved example and edge case executable.

- [x] Add tests for TC01–TC08.
- [x] Confirm tests fail because the implementation is absent or incomplete.
- [x] Implement the smallest function that makes the tests pass.

**Files:** `tests/physics.test.js`, `src/physics.js`.

### Phase 3: Testing & Validation

**Goal:** Verify all acceptance criteria and mutation resistance.

| AC | Verification Method | File Evidence | Status |
|---|---|---|---|
| AC1 | `node --test tests/physics.test.js` | `tests/physics.test.js` TC01 | Passed |
| AC2 | `node --test tests/physics.test.js` | `tests/physics.test.js` TC02 | Passed |
| AC3 | `node --test tests/physics.test.js` | `tests/physics.test.js` TC03–TC06 | Passed |
| AC4 | `node --test tests/physics.test.js` | `tests/physics.test.js` TC07–TC08 | Passed |

## Edge Case Handling

| # | Edge Case | Handling Strategy | Phase |
|---:|---|---|---|
| 1 | Temperature = 10°C | Accept boundary; return negative expansion and increased physical gap. | 2 |
| 2 | Temperature = 25°C | Return exactly zero expansion for every material. | 2 |
| 3 | Temperature = 100°C | Accept boundary and return finite expansion. | 2 |
| 4 | Initial gap = 0 mm with T >= 25°C | Return non-positive signed gap, zero physical gap, Closed status. | 2 |
| 5 | Initial gap = 15 mm | Accept maximum boundary and clamp only if expansion closes it. | 2 |
| 6 | Signed gap < 0 mm | Preserve signed value; return physical gap 0 and Closed / Insufficient clearance. | 2–3 |

**Coverage:** 6/6 edge cases handled.

## Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Metre/mm conversion is omitted | High | Explicit worked-example assertion and mutation check. |
| Signed gap is clamped too early | High | Assert both signed and physical gap in insufficient-clearance test. |
| UI/scene later duplicates this formula | High | Document and preserve the pure state contract for downstream stories. |

## Definition of Done

- [x] All four ACs pass through the Node test command.
- [x] All six edge cases have executable assertions.
- [x] Mutation checks kill the four named fault classes.
- [x] No DOM, Three.js, or runtime service dependency exists in the physics module.
- [x] Code and tests pass project quality checks.

## Notes

This plan intentionally leaves UI and 3D implementation to downstream stories. The exact Node minimum version remains a TRD open question, but the implementation must use a runtime supporting the built-in test runner.

## Revision History

| Date | Author | Change |
|---|---|---|
| 2026-11-02 | Codex | Created TDD plan and mapped all ACs and edge cases. |
