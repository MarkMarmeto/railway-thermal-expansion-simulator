# US-01M6DACM: Build the basic Three.js railway joint scene

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
**I want** a simple 3D railway joint scene
**So that** I can show where the calculated expansion occurs.

## Context

### Persona Reference

**Maya Santos** - Student presenter who needs a clear visual link between expansion and the rail joint.
[Full persona details](../personas/maya-santos-student-presenter.md)

### Background

The physics, controls, and results panel are complete. This story adds the first static 3D view so Maya can see the two rail ends, sleepers, and joint gap represented in the exhibit.

## Inherited Constraints

> See Epic for full constraint chain. Key constraints for this story:

| Source | Type | Constraint | AC Implication |
| --- | --- | --- | --- |
| Epic | Visualization | Use basic Three.js geometry and keep scene state separate from physics. | Scene consumes calculated state and does not duplicate the equation. |
| PRD | Scope | No imported models, trains, networks, or structural mechanics. | Primitive local geometry is sufficient for this story. |
| TRD | Runtime | Client-side browser application with no backend dependency. | Scene startup uses browser resources only and reports renderer limits honestly. |

## Acceptance Criteria

- **AC1:** Given the application starts successfully, when the scene initializes, then it contains two rail ends, a visible joint, sleepers, a gap indicator, a camera, and basic lighting.
  - **Verify:** shell node --test tests/scene.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC2:** Given the scene is initialized on a classroom laptop, when no external asset is available, then basic geometry renders without an imported model or physics engine.
  - **Verify:** shell node --test tests/scene.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC3:** Given the scene receives a calculated rail state, when the state is applied, then scene updates do not recalculate the physics formula independently.
  - **Verify:** shell node --test tests/scene.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional

## Scope

### In Scope

- Basic rails, sleepers, joint, gap indicator, camera, lighting, and renderer initialization.
- Three.js geometry with no imported models or physics engine.

### Out of Scope

- Photorealistic assets, trains, full railway networks, fluid simulation, and structural mechanics.

## Technical Notes

Implement `src/scene.js` with initialization and state-update functions. The module receives calculated state from `main.js` and never reimplements the expansion equation.

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
| --- | --- |
| No imported asset available | Construct all rails, sleepers, joint, and indicator from Three.js primitives. |
| Renderer/WebGL unavailable | Keep textual results available and expose a visible scene limitation. |
| Physical gap is zero | Keep the indicator at zero and do not create negative geometry. |
| Physical gap is positive | Scale the gap indicator from `remainingGapMm` only. |
| Incomplete state arrives | Do not fabricate geometry state; return a handled unavailable result. |
| High-DPI or resize | Bound pixel ratio and update renderer size without changing model state. |

> **Minimum edge cases:** 5 for non-API stories

## Test Scenarios

- [x] Assert rails, joint, sleepers, gap indicator, camera, and lighting exist.
- [x] Assert primitive geometry is used with no model loader or physics engine.
- [x] Assert open state scales the gap indicator from physical gap.
- [x] Assert closed state reaches zero indicator scale without negative geometry.
- [x] Assert incomplete state is handled without recalculating physics.

> **Minimum test scenarios:** 5 for UI stories

## Dependencies

### Story Dependencies

| Story | Type | What's Needed | Status |
| --- | --- | --- | --- |
| US-01M6DAST | Foundation | Results and shared state feed the scene | Done |

### External Dependencies

| Dependency | Type | Status |
| --- | --- | --- |
| Three.js browser library | Runtime dependency | Loaded for scene rendering; no imported model dependency |

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

**Affects production runtime:** true

| Component | Reversal | Expected time |
| --- | --- | --- |
| `index.html`, `src/main.js`, `src/scene.js`, and `src/style.css` | Revert the story commit; no data migration exists. | Immediate |

If `affects_production_runtime: false`, replace with: *Not applicable – story does not change runtime behaviour.*

## Open Questions

None.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-02 | Codex | Added scene composition and architecture-boundary criteria. |
