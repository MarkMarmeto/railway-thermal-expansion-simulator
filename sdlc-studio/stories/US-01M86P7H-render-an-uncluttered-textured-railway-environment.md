# US-01M86P7H: Render an uncluttered textured railway environment

> **Status:** Review
> **Parent:** CR01M86PR6
> **Created:** 2026-11-24
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Affects:** src/scene.js, tests/scene.test.js, tests/animation.test.js, tests/e2e/simulator.spec.js
> **Epic:** EP-01M6DA39
> **Points:** 3

## User Story

**As a** student presenter
**I want** a textured outdoor railway scene without the overhead measurement bar
**So that** the materials are easier to recognize and the joint remains the focus.

## Acceptance Criteria

- **AC1:** Scene omits the overhead bar and has sky, terrain, ballast, and textured sleepers and rails.
  - **Verify:** shell node --test tests/scene.test.js
  - **Verified:** yes (2026-11-24)
- **AC2:** Material changes preserve distinct finishes and closed rails remain red without changing physical results.
  - **Verify:** shell node --test tests/animation.test.js tests/physics.test.js
  - **Verified:** yes (2026-11-24)
- **AC3:** The real browser renders the environment offline with functioning mobile layout and camera.
  - **Verify:** shell npx playwright test tests/e2e
  - **Verified:** yes (2026-11-24)

## Summary

Implementation plan: [PL-01M86PFC](../plans/PL-01M86PFC-textured-railway-environment-implementation.md).

Remove the overhead gap mesh and its update path. Add lightweight procedural metal, wood, ballast, and terrain surfaces with a sky background. Keep numerical clearance, closure tint, and camera behavior.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-24 | sdlc-studio | Created via `new` (deterministic) |
