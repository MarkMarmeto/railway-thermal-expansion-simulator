# US-01M86Q8Q: Show exact contact and illustrative restrained expansion

> **Status:** Review
> **Parent:** CR01M86Q57
> **Created:** 2026-11-24
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Affects:** src/scene.js, src/main.js, index.html, tests/animation.test.js, tests/scene.test.js, tests/results.test.js, tests/e2e/simulator.spec.js
> **Epic:** EP-01M6DA39
> **Points:** 5

## User Story

**As a** student presenter
**I want** visible contact and a clearly labeled restrained-expansion demonstration
**So that** I can explain the difference between open clearance, contact, and further expansion without claiming a failure prediction.

## Acceptance Criteria

- **AC1:** Rendered rail ends preserve small positive gaps, meet at zero, and never overlap.
  - **Verify:** shell node --test tests/animation.test.js tests/scene.test.js
  - **Verified:** yes (2026-11-24)
- **AC2:** Closure and excess expansion are distinguished in text without claims of calculated force or failure.
  - **Verify:** shell node --test tests/results.test.js tests/physics.test.js
  - **Verified:** yes (2026-11-24)
- **AC3:** Browser transitions from open to contact to bending and back, with red warning, offline support, and mobile layout.
  - **Verify:** shell npx playwright test tests/e2e
  - **Verified:** yes (2026-11-24)

## Summary

Implementation plan: [PL-01M86QQJ](../plans/PL-01M86QQJ-exact-contact-and-restrained-expansion-presentation.md).

Map the physical gap directly to a fixed visual scale, move the joint marker below the contact path, deform segmented rail geometry continuously after contact, and show inward arrows plus an explicitly illustrative caption. Restore straight geometry on cooling.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-24 | sdlc-studio | Created via `new` (deterministic) |
