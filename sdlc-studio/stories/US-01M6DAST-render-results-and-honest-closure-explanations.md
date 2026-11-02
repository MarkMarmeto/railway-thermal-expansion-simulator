# US-01M6DAST: Render results and honest closure explanations

> **Status:** Done
> **Created:** 2026-11-02
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Template:** full
> **Affects:** index.html, src/main.js, src/style.css
> **Epic:** EP-01M6DA1Y
> **Points:** 3
> **Persona:** Elena Reyes

## User Story

**As a** Elena Reyes, teacher evaluator
**I want** complete numerical results and an honest explanation of closure
**So that** I can verify the science and prevent unsupported engineering claims.

## Context

### Persona Reference

**Elena Reyes** - Teacher evaluator who needs complete numerical evidence and bounded claims.
[Full persona details](../personas/elena-reyes-teacher-evaluator.md)

### Background

The shared controls and deterministic physics are complete. This story makes the calculation inspectable by presenting all values, assumptions, formula terms, and model limitations in the results panel.

## Inherited Constraints

> See Epic for full constraint chain. Key constraints for this story:

| Source | Type | Constraint | AC Implication |
| --- | --- | --- | --- |
| Epic | Scientific model | Fixed coefficients, L₀ = 10 m, and T₀ = 25°C | Results must display the values produced by the shared physics state. |
| PRD | Honesty | Do not imply buckling, force, or real-world failure was calculated. | Closed explanations must state model limitations. |
| PRD | Accessibility | Results are readable as text and not color-only. | Status and limitations are explicitly written. |

## Acceptance Criteria

- **AC1:** Given a calculated rail state, when the results panel renders, then it shows temperature, material, coefficient, L₀ = 10 m, T₀ = 25°C, signed expansion, physical gap, and status with units.
  - **Verify:** shell node --test tests/results.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC2:** Given signed clearance is less than or equal to zero, when the results render, then physical gap is 0 mm and status reads Closed / Insufficient clearance.
  - **Verify:** shell node --test tests/results.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC3:** Given the results panel is visible, when a learner reads the explanation, then α, L₀, T, T₀, ΔL, and g₀ plus the main formula are explained in plain language.
  - **Verify:** shell node --test tests/results.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC4:** Given a closed result, when the explanatory text renders, then it does not claim that buckling, compression force, or real-world failure was calculated.
  - **Verify:** shell node --test tests/results.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional

## Scope

### In Scope

- Results panel values, units, formula, assumptions, variables, and plain-language interpretation.
- Textual Open / Closed / Insufficient clearance reporting.

### Out of Scope

- Buckling, compression force, failure prediction, and additional screens.

## Technical Notes

Render every displayed value from the shared calculated state. When signed clearance is non-positive, display physical gap `0 mm`, preserve the signed value for explanation, and explicitly state that buckling and force are not calculated.

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
| --- | --- |
| Signed gap is negative | Preserve signed gap in explanation and show physical gap as 0 mm. |
| Signed gap is exactly zero | Display Closed / Insufficient clearance. |
| Cooling produces negative expansion | Display the negative signed expansion with mm units. |
| Coefficient is displayed | Show selected α with per-°C units. |
| Unsupported claim temptation | Explicitly state buckling, compression force, and real-world failure are not calculated. |
| Missing/non-finite state | Display an unavailable-state message rather than fabricated values. |

> **Minimum edge cases:** 5 for non-API stories

## Test Scenarios

- [x] Render a complete open Steel state and assert all required values and units.
- [x] Render a closed Aluminum state and assert signed/physical gap distinction.
- [x] Assert the formula and all six named variables are explained.
- [x] Assert limitations exclude unsupported force, buckling, and failure claims.
- [x] Assert formatted output populates semantic result regions.

> **Minimum test scenarios:** 5 for UI stories

## Dependencies

### Story Dependencies

| Story | Type | What's Needed | Status |
| --- | --- | --- | --- |
| US-01M6DAJJ | Foundation | Shared controls and state-change path | Done |

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
| `index.html`, `src/main.js`, and `src/style.css` | Revert the story commit; no data migration exists. | Immediate |

If `affects_production_runtime: false`, replace with: *Not applicable – story does not change runtime behaviour.*

## Open Questions

None.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-02 | Codex | Added results-panel and closure-reporting criteria. |
