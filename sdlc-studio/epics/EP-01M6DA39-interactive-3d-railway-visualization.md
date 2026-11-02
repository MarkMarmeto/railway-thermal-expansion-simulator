# EP-01M6DA39: Interactive 3D Railway Visualization

> **Status:** Done  
> **Created:** 2026-11-02  
> **Raised-by:** Codex; agent; v1  
> **Size:** M
> **Created-by:** sdlc-studio remake (backfilled)

## Summary

Build the lightweight Three.js railway joint scene and connect it to the shared calculated state so rail movement, heat coloring, gap indication, orbit, and zoom visibly explain the calculation.

## Inherited Constraints

| Source | Constraint | Impact |
|---|---|---|
| PRD | Scene contains two rail ends, joint, sleepers, gap indicator, and basic lighting. | Use simple geometry only. |
| PRD | Small physical expansions use a labelled exaggerated visual scale. | Exaggeration applies only to rendering, never numerical state. |
| TRD | `scene.js` consumes shared state and does not recalculate physics. | Prevents UI/scene disagreement. |
| TRD | No imported assets or advanced physics engine. | Keep dependency and performance surface small. |

## Business Context

### Problem Statement

The equation alone does not make rail movement and clearance intuitive. The exhibit needs a visible joint scene that responds coherently to the same state shown in the results panel.

**PRD Reference:** [Interactive 3D Scene](../prd.md#feature-details)

### Value Proposition

The visualization turns a signed calculation into a clear classroom demonstration while honestly distinguishing illustrative motion from engineering simulation.

### Success Metrics

| Metric | Target | Measurement |
|---|---|---|
| Scene response | Temperature/material changes visibly move rails and update heat color | Browser smoke test and manual review |
| Camera interaction | User can orbit and zoom the scene | Browser/manual interaction test |
| Visual honesty | Exaggeration is labelled and closed state does not show physical overlap | Visual acceptance review |

## Scope

### In Scope

- Basic Three.js rails, sleepers, joint, gap indicator, lighting, and camera.
- Smooth rail movement based on calculated expansion.
- Cool-blue to warm-red temperature coloring.
- Readable material identity separate from temperature color.
- Orbit, zoom, and optional illustrative heat-flow arrows/particles.
- No-overlap visual handling when signed clearance is insufficient.

### Out of Scope

- Photorealistic assets, imported models, advanced particle engines, fluid simulation, or physical stress/buckling.
- Train movement or full railway network scenes.
- Independent physics logic in the scene module.

### Affected Personas

- **Maya Santos:** Can see and explain the relationship between inputs, movement, color, and clearance.
- **Elena Reyes:** Can distinguish a teaching visualization from an unsupported engineering claim.

## Acceptance Criteria (Epic Level)

- [x] Scene shows two adjacent rail ends, sleepers, a visible joint, gap indicator, and basic lighting.
- [x] Temperature and material changes produce smooth visible rail movement.
- [x] Heat color responds to temperature from cool blue toward warm red.
- [x] Material identity remains readable independently of heat color.
- [x] User can orbit and zoom the camera.
- [x] Visual movement is clearly labelled as exaggerated for clarity.
- [x] Insufficient clearance never animates physical rail overlap or presents negative physical gap as real geometry.
- [x] Optional heat-flow visuals are explicitly illustrative rather than quantitative fluid physics.

## Dependencies

### Blocked By

| Dependency | Type | Status | Owner |
|---|---|---|---|
| EP-01M6DA1Y Scientific Core and Interactive Controls | Epic | Draft | Delivery team |

### Blocking

| Item | Type | Impact |
|---|---|---|
| EP-01M6DA3Y Exhibit Quality and Verification | Epic | Visual and browser acceptance depends on the integrated scene. |

## Risks & Assumptions

### Assumptions

- The scene uses one shared calculated state produced by the scientific core.
- The exaggeration factor is a visual constant documented in the README and UI.

### Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Visual exaggeration is mistaken for physical distance | Medium | High | Label it beside the scene and preserve unmodified numerical readings. |
| Renderer or camera setup fails on classroom hardware | Medium | High | Keep geometry basic and add readable initialization fallback. |
| Color mapping hides material identity | Medium | Medium | Use text and swatches in addition to temperature color. |

## Technical Considerations

### Architecture Impact

Creates `src/scene.js` with a small public surface for initialization, state updates, camera controls, and animation. The module receives calculated state from `main.js` and must not import or duplicate formula logic.

### Integration Points

- Three.js scene, camera, renderer, materials, and animation loop.
- `main.js` calculated state updates.
- Accessible HTML result/status panel that explains the visual scale.

## Sizing

**Size:** M  
**Estimated Story Count:** 3  
**Derived Point Total:** 13

**Complexity Factors:**

- Camera interaction and animation must remain smooth without heavy assets.
- Closed-gap geometry requires an honest visual representation.

## Story Breakdown

Stories will be generated after epic review and will cover scene construction, state-driven visual response, and camera/accessibility integration.
- [x] [US-01M6DACM: Build the basic Three.js railway joint scene](../stories/US-01M6DACM-build-the-basic-three-js-railway-joint-scene.md)
- [x] [US-01M6DA9T: Animate rail movement and temperature visualization](../stories/US-01M6DA9T-animate-rail-movement-and-temperature-visualization.md)
- [x] [US-01M6DA6G: Add camera interaction and visual-scale communication](../stories/US-01M6DA6G-add-camera-interaction-and-visual-scale-communication.md)

## Test Plan

An epic-scoped test specification will be generated after stories and will cover scene smoke behavior plus manual visual acceptance.

## Open Questions

Resolved: Playwright is the browser smoke-test tool; camera observability is covered by bounded camera-state assertions after pointer drag and wheel input in `tests/e2e/camera.spec.js`.

## Revision History

| Date | Author | Change |
|---|---|---|
| 2026-11-02 | Codex | Created from approved PRD, TRD, and TSD. |
