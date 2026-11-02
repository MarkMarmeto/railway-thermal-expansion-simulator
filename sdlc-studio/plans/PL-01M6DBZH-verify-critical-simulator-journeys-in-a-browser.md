# PL-01M6DBZH: Verify critical simulator journeys in a browser - Implementation Plan

> **Status:** Complete
> **Raised-by:** Codex; agent; v1
> **Story:** [US-01M6DAAX: Verify critical simulator journeys in a browser](../stories/US-01M6DAAX-verify-critical-simulator-journeys-in-a-browser.md)
> **Epic:** [EP-01M6DA3Y: Exhibit Quality and Verification](../epics/EP-01M6DA3Y-exhibit-quality-and-verification.md)
> **Created:** 2026-11-02
> **Language:** JavaScript
> **Created-by:** sdlc-studio remake (backfilled)

## Overview

Add real-browser coverage for the simulator’s critical journeys. Use Playwright against a local static server, keep the real HTML scripts and physics wiring intact, and verify the initial scene, the approved Steel example, the closed Aluminum example, and shared updates from all three controls.

## Acceptance Criteria Summary

| AC | Name | Description | Plan coverage |
| ---- | ----------- | ----------- | --- |
| AC1 | Initial browser load | Scene, three controls, and initial results appear without sign-in/backend. | Tasks 1-3; TC01 |
| AC2 | Steel worked example | Browser observes 3.6 mm expansion, 2.4 mm gap, and Open. | Tasks 2-3; TC02 |
| AC3 | Aluminum closed example | Browser observes 11.5 mm expansion, 0 mm gap, and Closed / Insufficient clearance. | Tasks 2-3; TC03 |
| AC4 | Shared interaction updates | Each primary control updates numerical results and the visible scene from the same interaction. | Tasks 2-3; TC04 |

## Technical Context

### Language & Framework

- **Primary Language:** JavaScript
- **Framework:** Static browser page with CDN Three.js and local physics/main modules
- **Test Framework:** Playwright Test via `npx playwright test`

### Relevant Best Practices

- Run the real page through a local HTTP server; do not load `file://` or mock the physics module.
- Use accessible labels and stable IDs already present in the page for selectors.
- Assert user-visible rounded output and scene state indicators rather than internal implementation details.
- Ensure the server lifecycle is deterministic and terminates after the suite.

### Library Documentation (Context7)

| Library | Context7 ID | Key Patterns |
| --- | --- | --- |
| Playwright | Existing CLI dependency | Use `webServer`, role/label selectors, and a browser project configured for the local page. |

### Existing Patterns

The page has stable IDs for all controls and result regions. `src/main.js` computes state through `src/physics.js`, updates results, dispatches `simulatorstatechange`, and applies state to the scene. Existing Node tests cover the same physics examples; browser tests should verify the real seam rather than duplicate formula unit tests.

## Recommended Approach

**Strategy:** TDD
**Rationale:** The browser journeys are executable acceptance contracts. A Playwright spec and local-server configuration can be written first, then run against the real page to expose missing startup or wiring behavior.

### Test Priority

1. Initial page startup and required visible regions.
2. Steel and Aluminum worked examples with exact display values.
3. Control-by-control shared state and scene update behavior.

## Implementation Tasks

| # | Task | File | Depends On | Status |
| ---: | --- | --- | --- | --- |
| 1 | Add Playwright package/config and a deterministic local static-server fixture. | `package.json`, `playwright.config.js`, `tests/e2e/server.js` | Node runtime | [x] |
| 2 | Implement browser journey tests for startup, both worked examples, and each control. | `tests/e2e/simulator.spec.js` | Task 1 | [x] |
| 3 | Add only the smallest app hooks needed to observe scene/state updates without mocking physics. | `index.html`, `src/main.js`, `src/scene.js` | Tasks 1-2 | [x] |
| 4 | Install/verify browser dependencies and run Playwright plus the existing Node suite and quality gates. | `tests/`, `sdlc-studio/` | Tasks 1-3 | [x] |

## Parallel Execution Groups

| Group | Tasks | Prerequisite |
| --- | --- | --- |
| A | Task 1 | Existing local page |
| B | Task 2 | Playwright configuration |
| C | Task 3 | Failing browser assertions identify required seam |
| D | Task 4 | Passing browser tests |

## Implementation Phases

### Phase 1: Establish real-browser harness

**Goal:** Start the local page over HTTP and launch a repeatable browser test.

- [x] Add minimal `package.json` scripts/config for Playwright.
- [x] Serve the repository root through a deterministic local Node server, with no external backend.
- [x] Keep the CDN Three.js dependency observable; document how browser installation is performed.

**Files:** `package.json`, `playwright.config.js`, `tests/e2e/server.js`.

### Phase 2: Cover critical journeys

**Goal:** Verify visible startup, worked examples, and shared updates using real controls.

- [x] Assert the scene mount, three primary controls, initial results, and no sign-in/backend requirement.
- [x] Select Steel 55°C/6 mm and assert 3.6 mm expansion, 2.4 mm physical gap, and Open.
- [x] Select Aluminum 75°C/5 mm and assert 11.5 mm expansion, 0 mm physical gap, and Closed / Insufficient clearance.
- [x] Change temperature, initial gap, and material independently and assert results plus visible scene state update.

**Files:** `tests/e2e/simulator.spec.js`, with app hooks only if needed for observable state.

### Phase 3: Testing & Validation

**Goal:** Verify all acceptance criteria against the real browser page.

| AC | Verification Method | File Evidence | Status |
| ---- | --------------------- | --------------- | -------- |
| AC1 | Playwright startup/visibility assertions. | `tests/e2e/simulator.spec.js` TC01 | Passed |
| AC2 | Playwright Steel example assertions. | `tests/e2e/simulator.spec.js` TC02 | Passed |
| AC3 | Playwright Aluminum closed-state assertions. | `tests/e2e/simulator.spec.js` TC03 | Passed |
| AC4 | Playwright control interaction and scene-state assertions. | `tests/e2e/simulator.spec.js` TC04 | Passed |

## Edge Case Handling

| # | Edge Case (from Story) | Handling Strategy | Phase |
| ---: | --- | --- | --- |
| 1 | Browser starts against a local app with no backend/sign-in. | Use a local static server and assert the page loads directly. | 1-2 |
| 2 | Steel worked example display rounding. | Assert exact rendered strings for the approved 3.6/2.4/Open example. | 2 |
| 3 | Aluminum insufficient clearance. | Assert signed negative gap remains visible, physical gap is 0, and closed status is explicit. | 2 |
| 4 | Each primary control changes. | Change temperature, initial gap, and material separately; assert state/result and scene update evidence after each. | 2 |

**Coverage:** 4/4 edge cases handled

## Risks & Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| CDN Three.js unavailable in the test environment. | High | Keep the browser test explicitly network-aware and document/install a deterministic fallback only if the approved runtime requires it. |
| Static server does not terminate cleanly. | Medium | Use Playwright `webServer` lifecycle and a small Node server with graceful close. |
| Tests assert implementation internals instead of user behavior. | Medium | Prefer labels, result text, scene canvas, and observable state changes. |

## Definition of Done

- [x] All four acceptance criteria have real-browser test coverage.
- [x] Playwright runs against the real page without physics or scene mocking.
- [x] Existing Node tests remain green.
- [x] Edge cases, validation, and diff checks pass.

## Notes

This story is verification-focused. It may add test harness/configuration and narrowly scoped observability hooks, but it must not change the scientific model or introduce production backend dependencies.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-02 | Codex | Created TDD browser-journey plan with 4/4 AC and edge-case coverage. |
