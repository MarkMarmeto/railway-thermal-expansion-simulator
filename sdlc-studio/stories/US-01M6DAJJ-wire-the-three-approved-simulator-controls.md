# US-01M6DAJJ: Wire the three approved simulator controls

> **Status:** Done
> **Created:** 2026-11-02
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Template:** full
> **Affects:** index.html, src/main.js, src/physics.js
> **Epic:** EP-01M6DA1Y
> **Points:** 3
> **Persona:** Maya Santos

## User Story

**As a** Maya Santos, student presenter
**I want** exactly three labelled controls for temperature, initial gap, and material
**So that** I can explore the approved model without scope confusion.

## Context

### Persona Reference

**Maya Santos** - Student presenter who needs a small, explainable control surface.
[Full persona details](../personas/maya-santos-student-presenter.md)

### Background

The physics module is complete. This story provides the only approved inputs and routes them into one shared rail-state calculation for later results and scene stories.

## Inherited Constraints

> See Epic for full constraint chain. Key constraints for this story:

| Source | Type | Constraint | AC Implication |
| --- | --- | --- | --- |
| Epic | Scientific model | Fixed coefficients, L₀ = 10 m, and T₀ = 25°C | Controls must pass values to the existing physics module. |
| PRD | Scope | Exactly three primary controls: temperature, initial gap, and material. | No additional simulator controls are introduced. |
| PRD | Accessibility | Native controls have visible labels and keyboard operation. | Every control is labelled and range-constrained. |

## Acceptance Criteria

- **AC1:** Given the simulator is open, when the page loads, then it exposes only the temperature slider, initial-gap slider, and material dropdown as primary controls.
  - **Verify:** shell node --test tests/controls.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC2:** Given temperature is changed from 10°C through 100°C, when input is committed, then the shared rail state receives the selected temperature and recalculates expansion and clearance.
  - **Verify:** shell node --test tests/controls.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC3:** Given initial gap is changed from 0 mm through 15 mm, when input is committed, then the shared rail state receives the selected gap without changing free thermal expansion.
  - **Verify:** shell node --test tests/controls.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC4:** Given material is changed among Steel, Aluminum, and Copper, when selection is committed, then the shared rail state uses the matching approved coefficient.
  - **Verify:** shell node --test tests/controls.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional

## Scope

### In Scope

- Native labelled temperature and initial-gap sliders and a material dropdown.
- Input event wiring from `main.js` to the shared physics state.

### Out of Scope

- Additional controls for rail length, insulation, train speed, heat flux, or persistence.

## Technical Notes

Use native HTML controls with explicit units and constrained ranges. `main.js` reads controls, calls the pure physics function, and owns the shared state passed to results and scene modules.

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
| --- | --- |
| Temperature = 10°C | Accept lower endpoint and recalculate negative expansion. |
| Temperature = 100°C | Accept upper endpoint and recalculate finite expansion. |
| Initial gap = 0 mm | Preserve zero gap and let physics report closed clearance when applicable. |
| Initial gap = 15 mm | Accept maximum gap without changing expansion. |
| Material changes | Restrict selection to Steel, Aluminum, and Copper and pass the selected key. |
| Slider value is a string | Convert to a finite number before calling physics. |

> **Minimum edge cases:** 5 for non-API stories

## Test Scenarios

- [x] Assert the page exposes exactly the three approved primary controls.
- [x] Assert temperature endpoints 10°C and 100°C update shared state and recalculation.
- [x] Assert gap endpoints 0 mm and 15 mm update gap while expansion remains unchanged.
- [x] Assert each approved material maps to its coefficient.
- [x] Assert slider strings are converted before physics calculation.

> **Minimum test scenarios:** 5 for UI stories

## Dependencies

### Story Dependencies

| Story | Type | What's Needed | Status |
| --- | --- | --- | --- |
| US-01M6DA7V | Foundation | Existing pure physics calculation | Done |

### External Dependencies

| Dependency | Type | Status |
| --- | --- | --- |
| None | — | No external dependency |

## Estimation

**Points:** 3
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

**Affects production runtime:** true

| Component | Reversal | Expected time |
| --- | --- | --- |
| `index.html`, `src/main.js`, and browser-safe physics export | Revert the story commit; no data migration exists. | Immediate |

If `affects_production_runtime: false`, replace with: *Not applicable – story does not change runtime behaviour.*

## Open Questions

None.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-02 | Codex | Added control scope, ranges, and state-wiring criteria. |
