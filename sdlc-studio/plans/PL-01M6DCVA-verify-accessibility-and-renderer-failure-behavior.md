# PL-01M6DCVA: Verify accessibility and renderer failure behavior - Implementation Plan

> **Status:** Complete
> **Raised-by:** Codex; agent; v1
> **Story:** [US-01M6DA94: Verify accessibility and renderer failure behavior](../stories/US-01M6DA94-verify-accessibility-and-renderer-failure-behavior.md)
> **Epic:** [EP-01M6DA3Y: Exhibit Quality and Verification](../epics/EP-01M6DA3Y-exhibit-quality-and-verification.md)
> **Created:** 2026-11-02
> **Language:** JavaScript
> **Created-by:** sdlc-studio remake (backfilled)

## Overview

Verify keyboard operation, semantic labels, units, status meaning, and readable renderer-failure behavior in a real browser. Preserve native form controls, add explicit status semantics where color is unavailable, and catch Three.js scene initialization errors so the calculation/results shell remains usable.

## Acceptance Criteria Summary

| AC | Name | Description | Plan coverage |
| ---- | --- | --- | --- |
| AC1 | Keyboard operation | All three primary controls are reachable and operable without a pointer. | Tasks 1-3; TC01 |
| AC2 | Labels, units, contrast | Controls and results expose labels, units, status text, and readable contrast. | Tasks 1-3; TC02 |
| AC3 | Text status meaning | Open/Closed meaning remains clear without color. | Tasks 1-3; TC03 |
| AC4 | Renderer fallback | Three.js initialization failure produces a readable message instead of a blank page. | Tasks 1-3; TC04 |

## Technical Context

### Language & Framework

- **Primary Language:** JavaScript
- **Framework:** Existing semantic HTML/CSS shell with Three.js CDN scene
- **Test Framework:** Playwright Test plus Node unit tests

### Relevant Best Practices

- Prefer native inputs/selects and explicit `<label>` associations.
- Keep status meaning in text and use `aria-live` for dynamic results/failure messages.
- Catch only the renderer/scene initialization boundary; do not hide physics or control errors.
- Test failure behavior by injecting a failing scene constructor while leaving the real controls/results path intact.

### Library Documentation (Context7)

| Library | Context7 ID | Key Patterns |
| --- | --- | --- |
| Playwright | Existing CLI dependency | Use label/role locators, keyboard navigation, and page-level failure injection before app startup. |

### Existing Patterns

The page already uses native range/select controls, explicit labels, live result text, and a separate scene mount. `initSimulator` currently constructs the scene before wiring the controller; the plan wraps only that construction and adds a status node for failure communication.

## Recommended Approach

**Strategy:** TDD
**Rationale:** Accessibility contracts and renderer fallback behavior are observable browser behaviors. Playwright can verify keyboard focus, accessible names, text status, and injected scene failure before implementation changes.

### Test Priority

1. Renderer failure must never leave the application blank.
2. Keyboard reachability and operability of all three controls.
3. Text labels, units, contrast-related classes, and non-color status semantics.

## Implementation Tasks

| # | Task | File | Depends On | Status |
| ---: | --- | --- | --- | --- |
| 1 | Add explicit status semantics, failure message markup, and accessible visual styling. | `index.html`, `src/style.css` | Existing semantic shell | [x] |
| 2 | Catch scene initialization errors and keep controls/results running; expose a deterministic failure hook for tests. | `src/main.js` | Task 1 | [x] |
| 3 | Add browser and unit tests for keyboard use, labels/contrast/status text, and renderer failure. | `tests/e2e/accessibility.spec.js`, `tests/e2e/startup-failure.spec.js`, `tests/results.test.js` | Tasks 1-2 | [x] |
| 4 | Run accessibility/failure E2E tests, full Node suite, validation, and diff checks. | `tests/`, `sdlc-studio/` | Tasks 1-3 | [x] |

## Parallel Execution Groups

| Group | Tasks | Prerequisite |
| --- | --- | --- |
| A | Task 1 | Existing page structure |
| B | Task 2 | Failure message contract |
| C | Task 3 | Stable accessible selectors |
| D | Task 4 | Green browser tests |

## Implementation Phases

### Phase 1: Establish accessible contracts

**Goal:** Make labels, dynamic regions, status meaning, and failure messaging explicit.

- [x] Add a scene status region with `role="status"`/`aria-live` and a readable initialization-failure message path.
- [x] Ensure result/status text communicates Open and Closed meaning independently of color.
- [x] Add contrast-conscious classes for status and failure states.

**Files:** `index.html`, `src/style.css`.

### Phase 2: Handle renderer failure safely

**Goal:** Preserve the usable simulator shell when Three.js or scene construction fails.

- [x] Wrap only `createRailwayScene` invocation in a guarded error boundary.
- [x] Render a concise failure message in the scene status region and keep physics/results controls active.
- [x] Add a test-only injectable scene factory or guarded global seam without changing production physics behavior.

**Files:** `src/main.js`, `index.html`.

### Phase 3: Testing & Validation

**Goal:** Verify all acceptance criteria in a real browser and unit seam.

| AC | Verification Method | File Evidence | Status |
| ---- | --------------------- | --------------- | -------- |
| AC1 | Keyboard traversal and control updates through Playwright. | `tests/e2e/accessibility.spec.js` TC01 | Passed |
| AC2 | Accessible-name, unit, live-region, and contrast-class assertions. | `tests/e2e/accessibility.spec.js` TC02 | Passed |
| AC3 | Open/Closed text assertions with color-independent status. | `tests/e2e/accessibility.spec.js` TC03 | Passed |
| AC4 | Injected scene-constructor failure leaves readable fallback and results. | `tests/e2e/startup-failure.spec.js` TC04 | Passed |

## Edge Case Handling

| # | Edge Case | Handling Strategy | Phase |
| ---: | --- | --- | --- |
| 1 | Keyboard user starts before the scene canvas is interactive | Native controls remain first-class focus targets and do not depend on canvas focus. | 1 |
| 2 | Color is unavailable or insufficient | Include literal Open/Closed status text and explanatory labels; do not rely on hue alone. | 1 |
| 3 | Three.js CDN/global is unavailable | Skip scene creation, render the failure status, and continue initializing controls/results. | 2 |
| 4 | Renderer constructor throws | Catch the scene boundary error, preserve the page shell, and expose the message in a live region. | 2 |

**Coverage:** 4/4 edge cases handled

## Risks & Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Failure handling hides a real application defect. | High | Catch only scene construction and include the error path in tests; leave controller/physics errors visible. |
| Status color passes visual review but fails non-color use. | Medium | Assert literal status text and semantic status region, not only CSS color. |
| Keyboard focus order changes unexpectedly. | Medium | Use native controls and assert tab order reaches each control in the browser. |

## Definition of Done

- [x] All four acceptance criteria have passing browser evidence.
- [x] Renderer failure leaves readable results and failure messaging.
- [x] Keyboard and text semantics are covered by tests.
- [x] Full suite, validation, and diff checks pass.

## Notes

This story does not attempt full WCAG certification or screen-reader certification. It establishes the specified keyboard, labeling, contrast/status, and startup-fallback behaviors.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-02 | Codex | Created TDD plan with 4/4 AC and edge-case coverage. |
