# US-01M6DAAX: Verify critical simulator journeys in a browser

> **Status:** Done
> **Created:** 2026-11-02
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Template:** full
> **Affects:** tests/e2e/simulator.spec.js, package.json
> **Epic:** EP-01M6DA3Y
> **Points:** 5
> **Persona:** Elena Reyes

## User Story

**As a** Elena Reyes, teacher evaluator
**I want** browser tests for the critical simulator journeys
**So that** I can verify the working exhibit rather than rely on screenshots.

## Context

### Persona Reference

**Elena Reyes** - Teacher evaluator who needs repeatable evidence that the working exhibit behaves correctly in a real browser.
[Full persona details](../personas/elena-reyes-teacher-evaluator.md)

### Background

The simulator has deterministic physics, controls, results, and a Three.js scene covered by Node tests. This story adds browser-level confidence across the critical user journeys without replacing real application wiring with mocks.

## Inherited Constraints

> See Epic for full constraint chain. Key constraints for this story:

| Source | Type | Constraint | AC Implication |
| --- | --- | --- | --- |
| Epic | Verification | Exercise the integrated exhibit through a real browser | Browser tests must cover the scene, controls, and results together |
| PRD | Performance | Keep local journeys fast and deterministic | Tests use a local static server and bounded assertions |
| PRD | Scientific integrity | Reuse the approved physics module and worked examples | Tests assert exact visible model outputs without inventing behavior |

## Acceptance Criteria

- **AC1:** Given the local app is started, when a browser opens the page, then the 3D scene, three controls, and initial results are visible without sign-in or a backend.
  - **Verify:** shell npm run test:e2e -- --grep='initial page shows the scene'
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC2:** Given the Steel worked example inputs are selected, when the browser reads the results, then it sees 3.6 mm expansion, 2.4 mm gap, and Open within display rounding.
  - **Verify:** shell npm run test:e2e -- --grep='Steel worked example'
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC3:** Given the Aluminum insufficient-clearance inputs are selected, when the browser reads the results, then it sees 11.5 mm expansion, 0 mm gap, and Closed / Insufficient clearance.
  - **Verify:** shell npm run test:e2e -- --grep='Aluminum worked example'
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC4:** Given each primary control is changed, when the browser observes the app, then numerical results and the visible scene update from the same interaction.
  - **Verify:** shell npm run test:e2e -- --grep='each primary control'
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional

## Scope

### In Scope

- Real-browser startup, all three controls, both worked examples, and shared UI/scene updates.
- Playwright or the documented equivalent against the local Vite bundle.

### Out of Scope

- Multi-user load, remote services, production deployment, and unsupported engineering behavior.

## Technical Notes

Use real controls and the real bundled physics module. Keep renderer-specific mocking limited to failure-path setup; do not mock away the calculation or state wiring that the tests claim to verify.

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
| --- | --- |
| Local app has no backend or sign-in | The static server serves the page directly and the browser reaches the initial state. |
| Steel worked example has rounded display values | Assert the approved 3.6 mm expansion, 2.4 mm physical gap, and Open status. |
| Aluminum clearance closes | Assert 11.5 mm expansion, -6.5 mm signed gap, 0 mm physical gap, and explicit closed status. |
| Each primary control changes | Change temperature, initial gap, and material independently and assert shared result/scene updates. |

> **Minimum edge cases:** {{config.story_quality.edge_cases.api}} for API stories, {{config.story_quality.edge_cases.other}} for others

## Test Scenarios

- [ ] Run the real page through the local Playwright server with no physics or scene mocks.
- [ ] Cover startup, both worked examples, and each primary control interaction.

> **Minimum test scenarios:** {{config.story_quality.test_scenarios.api}} for API stories, {{config.story_quality.test_scenarios.ui}} for UI

## Dependencies

### Story Dependencies

| Story | Type | What's Needed | Status |
| --- | --- | --- | --- |
| US-01M6DA7V, US-01M6DAJJ, US-01M6DAST, US-01M6DACM, US-01M6DA9T, US-01M6DA6G | Prerequisite | Existing physics, controls, results, scene, animation, and camera behavior | Complete |

### External Dependencies

| Dependency | Type | Status |
| --- | --- | --- |
| Playwright Chromium | Test tool | Installed via Playwright CLI for local E2E execution |

## Estimation

**Points:** 5
**Complexity:** Moderate; browser lifecycle and real-renderer startup add integration risk.

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

*Not applicable – this story adds test tooling and browser verification only; it changes no deployed service or persisted data.*

## Open Questions

- No open questions. The test harness and browser dependency are specified in the linked plan.

## Definition of Done

- [x] All four acceptance criteria have passing real-browser evidence.
- [x] Existing Node tests remain green.
- [x] Browser tests use the real controls, physics, and scene wiring.
- [x] Validation and diff checks pass.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-02 | Codex | Added critical browser journeys and real-wiring constraints. |
