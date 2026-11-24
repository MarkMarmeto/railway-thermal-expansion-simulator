# CR-01M86PR6: Add an offline railway environment and textured surfaces

> **Status:** inbox
> **Decomposed-into:** US01M86P7H
> **Created:** 2026-11-24
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Affects:** src/scene.js, tests/scene.test.js, tests/animation.test.js, tests/e2e/simulator.spec.js, sdlc-studio/prd.md, sdlc-studio/trd.md
> **Priority:** Medium
> **Type:** Feature
> **Size:** S

## Summary

User requested removal of the overhead gap bar, an environment background, and richer material textures. Use lightweight procedural textures and geometry; preserve material colors, the red closure cue, camera interaction, and physical results.

## Impact

Replaces the mandatory floating gap indicator with existing numerical gap reporting. Adds offline visual detail without new controls or physics changes.

## Acceptance Criteria

- [ ] No floating gap bar is rendered; numerical gap reporting remains available.
- [ ] Sky, terrain, ballast, and textured rails and sleepers render without external asset requests.
- [ ] Material selection and red closure warning remain visible; camera and mobile layout remain functional.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-24 | sdlc-studio | Created via `new` (deterministic) |
