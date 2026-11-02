# EP-01M6DA1Y: Scientific Core and Interactive Controls

> **Status:** Done  
> **Created:** 2026-11-02  
> **Raised-by:** Codex; agent; v1  
> **Size:** M
> **Created-by:** sdlc-studio remake (backfilled)

## Summary

Implement the deterministic thermal-expansion model, exactly three approved controls, and the live results panel so learners can reproduce the documented equation and clearance outcomes.

## Inherited Constraints

| Source | Constraint | Impact |
|---|---|---|
| PRD | Temperature is 10–100°C; initial gap is 0–15 mm; material is Steel, Aluminum, or Copper. | No extra primary controls. |
| PRD | `ΔL = α × L₀ × (T − T₀)`, with `L₀ = 10 m` and `T₀ = 25°C`. | Calculation and displayed assumptions are fixed. |
| TRD | Physics must be a pure JavaScript module. | Unit tests run without DOM or Three.js. |
| TRD | No backend, persistence, API, or account system. | All state is in memory. |

## Business Context

### Problem Statement

Learners need to connect the thermal-expansion equation to an immediately visible numerical result. Without a deterministic calculation and clear controls, the simulator cannot be scientifically defended or demonstrated.

**PRD Reference:** [Functional Requirements](../prd.md#4-functional-requirements)

### Value Proposition

The core makes temperature, material, and initial clearance understandable through reproducible calculations, signed values, and plain-language status.

### Success Metrics

| Metric | Target | Measurement |
|---|---|---|
| Worked examples | Both approved examples pass exactly within display rounding | Automated unit tests |
| Edge checks | Cooling, reference temperature, and zero-gap cases pass | Automated unit tests |
| Control consistency | Every approved input updates all dependent outputs together | Integration/browser tests |

## Scope

### In Scope

- Material constants and `calculateRailState()`.
- Temperature slider, initial-gap slider, and material dropdown.
- Results for temperature, material, coefficient, assumptions, signed expansion, physical gap, and status.
- Formula and one-line interpretation.
- Closed / Insufficient clearance explanation without buckling or force claims.

### Out of Scope

- Rail-length, insulation, train-speed, or heat-flux controls.
- Stress, force, buckling, failure, or full heat-flow calculations.
- Persistence, accounts, APIs, and server-side state.

### Affected Personas

- **Maya Santos:** Can explore the three inputs and explain the worked examples during a classroom demonstration.
- **Elena Reyes:** Can audit the formula, assumptions, units, and scope boundaries.

## Acceptance Criteria (Epic Level)

- [x] Steel at 55°C with a 6 mm initial gap produces `ΔL = 3.6 mm`, `g = 2.4 mm`, and Open.
- [x] Aluminum at 75°C with a 5 mm initial gap produces `ΔL = 11.5 mm`, `g = 0 mm`, and Closed / Insufficient clearance.
- [x] Cooling below 25°C produces negative expansion and an increased physical gap.
- [x] At 25°C, expansion is zero for every material.
- [x] Changing initial gap does not change free expansion.
- [x] No displayed physical gap is negative, and closed status does not claim buckling was computed.
- [x] All results show required units, assumptions, formula, and plain-language interpretation.

## Dependencies

### Blocked By

None. This is the foundation epic.

### Blocking

| Item | Type | Impact |
|---|---|---|
| Interactive 3D Railway Visualization | Epic | The scene consumes this epic’s calculated state. |
| Exhibit Quality and Verification | Epic | Browser and acceptance tests depend on the stable calculation/UI contract. |

## Risks & Assumptions

### Assumptions

- The three approximate coefficients are fixed as approved in the PRD.
- Display formatting may round values, but calculation tests use exact numeric expectations.

### Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Unit conversion or sign error | Medium | High | Test worked examples, cooling, zero, and boundary cases first. |
| UI duplicates physics logic | Medium | High | Keep one pure calculation function and pass one shared state. |
| Scope expands with extra controls | Medium | Medium | Review every proposed control against the locked PRD scope. |

## Technical Considerations

### Architecture Impact

Creates `src/physics.js` and the UI orchestration contract consumed by `src/main.js`. It establishes the state shape that `src/scene.js` must consume without recalculation.

### Integration Points

- Native HTML controls to `main.js`.
- `main.js` to `calculateRailState()`.
- Shared calculated state to results rendering and later Three.js scene updates.

## Sizing

**Size:** M  
**Estimated Story Count:** 3  
**Derived Point Total:** 11

**Complexity Factors:**

- Scientific sign and unit rules must remain exact.
- The UI must expose assumptions without adding scope.

## Story Breakdown

Stories will be generated after epic review and will cover the pure physics contract, approved controls, and results/closure explanation.
- [x] [US-01M6DA7V: Implement deterministic rail-state physics](../stories/US-01M6DA7V-implement-deterministic-rail-state-physics.md)
- [x] [US-01M6DAJJ: Wire the three approved simulator controls](../stories/US-01M6DAJJ-wire-the-three-approved-simulator-controls.md)
- [x] [US-01M6DAST: Render results and honest closure explanations](../stories/US-01M6DAST-render-results-and-honest-closure-explanations.md)

## Test Plan

An epic-scoped test specification will be generated after stories and will map every epic acceptance criterion to executable verification.

## Open Questions

Resolved: NOAA/PMEL Metrology Handbook is the primary coefficient reference; rounded educational values remain in the implementation.

## Revision History

| Date | Author | Change |
|---|---|---|
| 2026-11-02 | Codex | Created from approved PRD, TRD, and TSD. |
