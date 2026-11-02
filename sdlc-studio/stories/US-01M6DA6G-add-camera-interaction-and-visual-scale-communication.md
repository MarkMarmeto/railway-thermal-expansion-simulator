# US-01M6DA6G: Add camera interaction and visual-scale communication

> **Status:** Done
> **Created:** 2026-11-02
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Template:** full
> **Affects:** src/scene.js, index.html, src/style.css
> **Epic:** EP-01M6DA39
> **Points:** 3
> **Persona:** Maya Santos

## User Story

**As a** Maya Santos, student presenter
**I want** orbit/zoom controls and a visible visual-scale caveat
**So that** I can present the scene clearly without implying exaggerated movement is literal.

## Context

### Persona Reference

**Maya Santos** - Student presenter who needs a clear, controllable scene and honest communication about illustrative movement.
[Full persona details](../personas/maya-santos-student-presenter.md)

### Background

The railway joint scene already renders the calculated state and heat color. This story adds camera manipulation and the explanatory labels needed to keep visual exaggeration from being mistaken for measured displacement.

## Inherited Constraints

> See Epic for full constraint chain. Key constraints for this story:

| Source | Type | Constraint | AC Implication |
| --- | --- | --- | --- |
| Epic | Scope | Use the existing primitive Three.js scene and CDN runtime | Camera interaction remains local to the scene mount |
| PRD | Performance | Keep interaction lightweight and responsive in a local browser | Pointer and wheel updates must not recalculate physics |
| PRD | Scientific integrity | Clearly distinguish illustrative visuals from physical quantities | Labels accompany exaggerated movement and heat-flow visuals |

## Acceptance Criteria

- **AC1:** Given the 3D scene is visible, when the user drags the scene, then the camera orbits around the railway joint.
  - **Verify:** shell node --test --test-name-pattern='pointer drag orbits' tests/camera.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC2:** Given the 3D scene is visible, when the user zooms, then the camera moves closer to or farther from the joint without losing the scene.
  - **Verify:** shell node --test --test-name-pattern='zoom changes radius' tests/camera.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC3:** Given the scene is visible, when the user reads the interface, then the exaggerated visual movement is clearly labelled as illustrative rather than a physical scale.
  - **Verify:** shell node --test --test-name-pattern='illustrative visual-scale caveat' tests/camera.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC4:** Given optional heat-flow arrows or particles are present, when they animate, then nearby text identifies them as illustrative and non-quantitative.
  - **Verify:** shell node --test --test-name-pattern='non-quantitative heat-flow caveat' tests/camera.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional

## Scope

### In Scope

- User-driven camera orbit and zoom around the joint.
- Visible explanation of exaggerated movement and any illustrative heat-flow visuals.

### Out of Scope

- Advanced camera systems, photorealism, and quantitative fluid animation.

## Technical Notes

Use the Three.js camera interaction mechanism selected in implementation. Keep the scene in view after orbit/zoom and place the visual-scale note adjacent to the 3D scene.

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
| --- | --- |
| Pointer drag begins or ends outside the mount | Ignore movement until an active pointer gesture exists and release safely. |
| Extreme zoom input | Clamp radius to safe minimum and maximum bounds while retaining the joint target. |
| Exaggerated movement is visible | Keep an adjacent note stating that rendered movement is illustrative and not physical scale. |
| Optional heat-flow visuals are present | Label them illustrative and non-quantitative; do not infer heat-flow physics. |

> **Minimum edge cases:** {{config.story_quality.edge_cases.api}} for API stories, {{config.story_quality.edge_cases.other}} for others

## Test Scenarios

- [ ] Test bounded orbit calculations and pointer gesture wiring.
- [ ] Test bounded zoom calculations and the two explanatory caveat labels.

> **Minimum test scenarios:** {{config.story_quality.test_scenarios.api}} for API stories, {{config.story_quality.test_scenarios.ui}} for UI

## Dependencies

### Story Dependencies

| Story | Type | What's Needed | Status |
| --- | --- | --- | --- |
| US-01M6DACM | Prerequisite | Existing Three.js railway scene and camera | Complete |

### External Dependencies

| Dependency | Type | Status |
| --- | --- | --- |
| Three.js CDN runtime | Browser library | Existing dependency; no new service required |

## Estimation

**Points:** 3
**Complexity:** Low; interaction is isolated to the existing scene camera and DOM mount.

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

- No open questions. Camera bounds and illustrative labels are specified in the implementation plan.

## Definition of Done

- [x] All four acceptance criteria have implementation and automated test evidence.
- [x] Camera orbit and zoom remain bounded around the railway joint.
- [x] Scale and heat-flow caveats are visible and explicit.
- [x] Full test suite and SDLC validation pass.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-02 | Codex | Added camera and visual-communication criteria. |
