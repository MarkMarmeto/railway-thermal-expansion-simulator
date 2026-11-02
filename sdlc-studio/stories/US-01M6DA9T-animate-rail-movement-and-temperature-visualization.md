# US-01M6DA9T: Animate rail movement and temperature visualization

> **Status:** Done
> **Created:** 2026-11-02
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Template:** full
> **Affects:** src/scene.js, src/main.js
> **Epic:** EP-01M6DA39
> **Points:** 5
> **Persona:** Maya Santos

## User Story

**As a** Maya Santos, student presenter
**I want** the 3D rails and heat colors to respond to the shared state
**So that** I can connect the numerical result to visible movement.

## Context

### Persona Reference

**Maya Santos** - Student presenter who needs the numerical model to be understandable through visible, responsive movement.
[Full persona details](../personas/maya-santos-student-presenter.md)

### Background

The basic Three.js railway joint scene and shared physics state already exist. This story connects that state to rendered rail movement and temperature feedback while keeping visual exaggeration separate from the scientific calculation.

## Inherited Constraints

> See Epic for full constraint chain. Key constraints for this story:

| Source | Type | Constraint | AC Implication |
| --- | --- | --- | --- |
| Epic | Scope | Use the existing primitive Three.js scene and shared state seam | Animation remains visual-only and does not add a second physics model |
| PRD | Performance | Keep updates lightweight and deterministic for a local browser exhibit | Temperature and material changes remain responsive |
| PRD | Scientific integrity | Preserve signed numerical clearance and document visual exaggeration | Rendered geometry must not claim negative physical gap |

## Acceptance Criteria

- **AC1:** Given temperature or material changes, when the shared rail state updates, then the rail ends move smoothly using the calculated expansion.
  - **Verify:** shell node --test --test-name-pattern='moves rail ends smoothly' tests/animation.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC2:** Given temperature changes across the supported range, when the scene updates, then rail color progresses from cool blue toward warm red.
  - **Verify:** shell node --test --test-name-pattern='maps supported temperatures' tests/animation.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC3:** Given any material is selected, when temperature coloring is applied, then material identity remains readable through text or a contrasting swatch.
  - **Verify:** shell node --test --test-name-pattern='keeps material identity' tests/animation.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC4:** Given signed clearance is insufficient, when the scene animates, then it does not show physical rail overlap or describe a negative physical gap as real geometry.
  - **Verify:** shell node --test --test-name-pattern='clamps closed clearance' tests/animation.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional

## Scope

### In Scope

- Smooth state-driven rail movement, temperature color mapping, material cue, and closed-gap handling.
- Visual-only animation that preserves numerical physics values.

### Out of Scope

- Quantitative heat-flow particles, physical overlap, stress, force, or buckling animation.

## Technical Notes

Apply a clearly documented visual exaggeration factor only to rendered movement. Map temperature to cool-blue through warm-red independently from material identity, and clamp the visual gap when signed clearance is insufficient.

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
| --- | --- |
| Temperature is 10°C or 100°C | Use bounded blue and red endpoints with finite values. |
| Temperature is outside the visual range | Clamp the color mapping to 10-100°C; physics validation remains authoritative. |
| Signed clearance is zero or negative | Clamp rendered separation at the joint boundary and preserve the signed value in state/results. |
| Material changes at a fixed temperature | Keep heat color stable and update the readable material label/swatch. |
| State lacks an optional visual field | Skip that visual update rather than infer a physics value. |

> **Minimum edge cases:** {{config.story_quality.edge_cases.api}} for API stories, {{config.story_quality.edge_cases.other}} for others

## Test Scenarios

- [ ] Unit-test color endpoints, midpoint interpolation, and out-of-range clamping.
- [ ] Integration-test state-driven rail interpolation, material cue updates, and closed-state no-overlap behavior.

> **Minimum test scenarios:** {{config.story_quality.test_scenarios.api}} for API stories, {{config.story_quality.test_scenarios.ui}} for UI

## Definition of Done

- [x] All four acceptance criteria have implementation and automated test evidence.
- [x] Manual browser checks remain identified for visual behavior.
- [x] Existing physics state and signed gap values remain unchanged by visual animation.
- [x] Full test suite and SDLC validation pass.

## Dependencies

### Story Dependencies

| Story | Type | What's Needed | Status |
| --- | --- | --- | --- |
| None | N/A | Existing basic scene and shared state are already delivered | Complete |

### External Dependencies

| Dependency | Type | Status |
| --- | --- | --- |
| Three.js CDN runtime | Browser library | Existing dependency; no new service required |

## Estimation

**Points:** 5
**Complexity:** Moderate; visual state mapping and animation are isolated from the physics model.

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

*Not applicable – story is a local browser visualization and does not change deployed services or persisted data.*

## Open Questions

- No open questions. Visual exaggeration is explicitly documented and tested as display-only.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-02 | Codex | Added state-driven movement, color, and no-overlap criteria. |
