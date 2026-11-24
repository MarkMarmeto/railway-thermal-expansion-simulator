# CR-01M86Q57: Demonstrate rail contact and restrained expansion

> **Status:** inbox
> **Decomposed-into:** US01M86Q8Q
> **Created:** 2026-11-24
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Affects:** src/scene.js, src/main.js, index.html, tests/animation.test.js, tests/scene.test.js, tests/results.test.js, tests/e2e/simulator.spec.js, README.md, sdlc-studio/prd.md, sdlc-studio/trd.md
> **Priority:** Medium
> **Type:** Feature
> **Size:** S

## Summary

User approved exact rail-end convergence, compression cues, and illustrative sideways bending after closure. Correct the early visual closure and remove the central spacer from the contact path. Label arrows and bending as schematic, without predicting force or failure.

## Impact

Changes the scene mapping and extends presentation beyond clearance-only visuals. Numerical physics stays unchanged; no new physical material constants or buckling model are introduced.

## Acceptance Criteria

- [ ] Positive numerical gaps remain positive in geometry and zero gap makes rail ends meet without overlap.
- [ ] Further expansion shows inward arrows and bounded lateral bending with a visible illustrative-only explanation.
- [ ] Cooling restores straight rails and an open gap, preserving material colors and offline operation.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-24 | sdlc-studio | Created via `new` (deterministic) |
