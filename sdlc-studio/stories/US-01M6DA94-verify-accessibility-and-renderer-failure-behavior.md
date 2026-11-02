# US-01M6DA94: Verify accessibility and renderer failure behavior

> **Status:** Done
> **Created:** 2026-11-02
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Template:** full
> **Affects:** index.html, src/main.js, src/style.css, tests/e2e/accessibility.spec.js, tests/e2e/startup-failure.spec.js
> **Epic:** EP-01M6DA3Y
> **Points:** 3
> **Persona:** Maya Santos

## User Story

**As a** Maya Santos, student presenter
**I want** keyboard-accessible controls and a readable renderer failure state
**So that** I can use the exhibit reliably on classroom hardware.

## Context

### Persona Reference

**Maya Santos** - A student presenter who needs a dependable, understandable exhibit during classroom demonstrations.
[Full persona details](../personas/maya-santos-student-presenter.md)

### Background

The exhibit must remain usable when a presenter relies on keyboard input or when classroom hardware cannot initialize the Three.js renderer. Physics results and their meaning must remain available independently of the 3D scene.

## Inherited Constraints

> See Epic for full constraint chain. Key constraints for this story:

| Source | Type | Constraint | AC Implication |
| --- | --- | --- | --- |
| Epic | Scope | Preserve the local browser exhibit and existing calculation flow. | Accessibility and fallback behavior must not alter approved physics outputs. |
| PRD | Performance | Use native controls and a lightweight status region. | Keyboard interaction and status updates remain responsive in the local exhibit. |
| PRD | Scientific integrity | Keep result text explicit and distinguishable without color. | Open/Closed meaning is readable from literal status text and signed/physical gap values. |

## Acceptance Criteria

- **AC1:** Given the simulator is open, when a keyboard user navigates the form, then all three primary controls are reachable and operable without a pointer.
  - **Verify:** shell npm run test:e2e:accessibility -- --grep='keyboard operation'
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC2:** Given the controls and results are visible, when a user inspects them, then labels, units, and status text are present with adequate contrast.
  - **Verify:** shell npm run test:e2e:accessibility -- --grep='labels units readable semantics'
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC3:** Given Open or Closed status is displayed, when color is unavailable, then the status meaning remains clear from text and/or an explicit label.
  - **Verify:** shell npm run test:e2e:accessibility -- --grep='status meaning is clear'
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC4:** Given Three.js initialization fails, when the app handles the failure, then it renders a readable error instead of a blank page.
  - **Verify:** shell npm run test:e2e:failure -- --grep='renderer initialization failure'
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional

## Scope

### In Scope

- Keyboard operation, labels, units, contrast/status text, and initialization fallback.
- Browser checks for controls and renderer failure behavior.

### Out of Scope

- Full compliance certification, screen-reader certification beyond required labels, and backend security.

## Technical Notes

Use native form controls where possible. Catch Three.js initialization errors in the application shell and render a readable message without leaving a blank page.

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
| --- | --- |
| Keyboard user starts before the scene canvas is interactive | Native controls remain first-class focus targets and operate without canvas focus. |
| Color is unavailable or insufficient | Literal Open/Closed text and explanatory values preserve meaning. |
| Three.js CDN/global is unavailable | Scene creation is skipped with a readable status while controls/results initialize. |
| Renderer constructor throws | Only scene creation is caught; the shell remains usable and announces the failure. |

> Four edge cases are covered for this UI story.

## Test Scenarios

- [ ] Tab through all primary controls and change each with keyboard input.
- [ ] Inspect accessible names, units, live-region attributes, and status styling hooks.
- [ ] Verify Open and Closed / Insufficient clearance remain explicit in text.
- [ ] Inject a throwing scene factory and verify the result shell remains usable.

> **Minimum test scenarios:** {{config.story_quality.test_scenarios.api}} for API stories, {{config.story_quality.test_scenarios.ui}} for UI

## Dependencies

### Story Dependencies

| Story | Type | What's Needed | Status |
| --- | --- | --- | --- |
| [US-01M6DAJJ](US-01M6DAJJ-wire-the-three-approved-simulator-controls.md) | Predecessor | Native controls and input events. | Done |
| [US-01M6DAST](US-01M6DAST-render-results-and-honest-closure-explanations.md) | Predecessor | Semantic result summary and status text. | Done |
| [US-01M6DA6G](US-01M6DA6G-add-camera-interaction-and-visual-scale-communication.md) | Predecessor | Scene mount and visual notes. | Done |

### External Dependencies

| Dependency | Type | Status |
| --- | --- | --- |
| Playwright Chromium | Test tooling | Available in the repository environment. |

## Estimation

**Points:** 3
**Complexity:** Moderate

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
| Accessibility markup/styles and scene error boundary | Revert the story changes in `index.html`, `src/main.js`, and `src/style.css`; retain tests for later reapplication. | Under 15 minutes |

## Open Questions

No open questions.

## Definition of Done

- [x] All four acceptance criteria have passing browser evidence.
- [x] Renderer failure leaves readable results and failure messaging.
- [x] Keyboard and text semantics are covered by tests.
- [x] Full suite, validation, and diff checks pass.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-02 | Codex | Added accessibility and renderer-failure criteria. |
