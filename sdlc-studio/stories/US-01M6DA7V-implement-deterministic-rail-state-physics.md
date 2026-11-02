# US-01M6DA7V: Implement deterministic rail-state physics

> **Status:** Done
> **Created:** 2026-11-02
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Template:** full
> **Affects:** src/physics.js, tests/physics.test.js
> **Epic:** EP-01M6DA1Y
> **Points:** 5
> **Persona:** Maya Santos

## User Story

**As a** Maya Santos, student presenter
**I want** a deterministic rail-state calculation
**So that** I can demonstrate scientifically reproducible expansion and clearance results.

## Context

### Persona Reference

**Maya Santos** - Student presenter who needs reproducible, explainable thermal-expansion results.
[Full persona details](../personas/maya-santos-student-presenter.md)

### Background

The calculation is the foundation for every later UI and 3D behavior. Maya needs signed expansion and clearance values that match the approved worked examples so she can explain them during a classroom demonstration.

## Inherited Constraints

> See Epic for full constraint chain. Key constraints for this story:

| Source | Type | Constraint | AC Implication |
| --- | --- | --- | --- |
| Epic | Scientific model | Fixed coefficients, L₀ = 10 m, and T₀ = 25°C | Preserve the approved equation and units. |
| PRD | Performance | Client-side calculation must remain responsive for a single simulator state. | Pure arithmetic has no network or blocking dependency. |
| PRD | Security | No user-controlled value is executed as code or sent to a backend. | Inputs are numeric/material values validated at the module boundary. |

## Acceptance Criteria

- **AC1:** Given Steel, 55°C, a 6 mm initial gap, L₀ = 10 m, and T₀ = 25°C, when rail state is calculated, then expansion is 3.6 mm, physical gap is 2.4 mm, and status is Open.
  - **Verify:** shell node --test tests/physics.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC2:** Given Aluminum, 75°C, and a 5 mm initial gap, when rail state is calculated, then expansion is 11.5 mm, signed gap is -6.5 mm, physical gap is 0 mm, and status is Closed / Insufficient clearance.
  - **Verify:** shell node --test tests/physics.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC3:** Given any approved material, when temperature is below 25°C or equal to 25°C, then expansion is respectively negative or zero and the physical gap is never negative.
  - **Verify:** shell node --test tests/physics.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC4:** Given any approved material and initial gap, when the calculation runs, then it uses the selected coefficient, L₀ = 10 m, T₀ = 25°C, and consistent metre-to-millimetre conversion.
  - **Verify:** shell node --test tests/physics.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional

## Scope

### In Scope

- Material constants, fixed assumptions, signed expansion, signed clearance, and clamped physical gap.
- Automated Node tests for the worked examples and edge cases.

### Out of Scope

- 3D rendering, UI controls, stress, force, buckling, and full heat-flow simulation.

## Technical Notes

Implement `calculateRailState()` as a pure function in `src/physics.js`. Keep `signedGapMm` separate from `remainingGapMm`; only the latter is clamped for display. Tests are written first in `tests/physics.test.js`.

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
| --- | --- |
| Temperature = 10°C | Expansion is negative and physical gap increases. |
| Temperature = 25°C | Expansion is exactly zero for Steel, Aluminum, and Copper. |
| Temperature = 100°C | Calculation remains within supported range and returns a finite result. |
| Initial gap = 0 mm with T >= 25°C | Signed gap is non-positive and status is Closed / Insufficient clearance; physical gap is 0 mm. |
| Initial gap = 15 mm | Calculation accepts the maximum supported gap and never returns a negative physical gap. |
| Signed gap < 0 mm | Preserve signed gap for status/explanation while clamping displayed physical gap to 0 mm. |

> **Minimum edge cases:** 5 for non-API stories

## Test Scenarios

- [x] Run Steel worked example and assert expansion, signed gap, physical gap, and Open status.
- [x] Run Aluminum insufficient-clearance example and assert signed/physical gap distinction and Closed status.
- [x] Run all materials at reference temperature and assert zero expansion.
- [x] Run cooling and minimum/maximum input boundaries.
- [x] Apply mutation checks for unit conversion, reference temperature, material coefficient, and gap clamping.

> **Minimum test scenarios:** 5 for UI/non-API stories

## Dependencies

### Story Dependencies

| Story | Type | What's Needed | Status |
| --- | --- | --- | --- |
| None | — | This is the foundation story for the epic. | N/A |

### External Dependencies

| Dependency | Type | Status |
| --- | --- | --- |
| Node.js runtime with built-in test runner | Toolchain | To be selected/documented during implementation |

## Estimation

**Points:** 5
**Complexity:** Medium

> **Points** are a RELATIVE size on the modified Fibonacci scale (1, 2, 3, 5, 8, 13, 20) - not
> "how long will this take" but "is this bigger than that one", sized against stories already
> delivered. The gaps widen deliberately, because uncertainty grows with size: it is much harder
> to argue a story is a 7 rather than an 8 than to choose between a 5 and an 8. A value off the
> scale is REFUSED, never rounded - the scale IS the estimate. Above 8, SPLIT the story;
> estimator consistency collapses beyond it, so a bigger number is a triage failure rather than
> a harder estimate. This is the one size vocabulary: the planner, the forecast and the measured
> velocity all read this field.

## Rollback Envelope

> Required when `affects_production_runtime: true`; optional otherwise. See `reference-story.md#rollback-envelope`.

**Affects production runtime:** false

| Component | Reversal | Expected time |
| --- | --- | --- |
| `src/physics.js` and `tests/physics.test.js` | Revert the story commit; no persistent data migration exists. | Immediate |

The story changes not-yet-deployed source only; no production rollback or data migration is required.

## Open Questions

No blocking questions. The exact supported Node version is a documentation detail for implementation and does not change the scientific contract.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-02 | Codex | Added implementation-ready physics criteria and executable test command. |
