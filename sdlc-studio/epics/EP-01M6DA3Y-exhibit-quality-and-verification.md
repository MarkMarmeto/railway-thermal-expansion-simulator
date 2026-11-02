# EP-01M6DA3Y: Exhibit Quality and Verification

> **Status:** Done  
> **Created:** 2026-11-02  
> **Raised-by:** Codex; agent; v1  
> **Size:** M
> **Created-by:** sdlc-studio remake (backfilled)

## Summary

Make the simulator reliable and demonstrable through automated browser verification, accessibility behavior, readable startup failure handling, and complete local-run/scientific documentation.

## Inherited Constraints

| Source | Constraint | Impact |
|---|---|---|
| PRD | App must work locally on an ordinary classroom laptop without sign-in or network-backed services. | Startup and local-run checks are blocking. |
| PRD | Controls must be keyboard-operable, labelled, unit-bearing, and status must not rely on color alone. | Accessibility is acceptance scope, not polish. |
| TSD | Worked examples, edge checks, critical browser paths, and startup resilience are blocking gates. | Completion requires executable evidence. |
| TRD | No backend, persistence, or runtime integration. | Test environments remain local and deterministic. |

## Business Context

### Problem Statement

A scientifically correct core and a working scene are not enough for a classroom exhibit if the app is inaccessible, undocumented, fragile on startup, or impossible to verify reproducibly.

**PRD Reference:** [FR-09 and FR-10](../prd.md#4-functional-requirements)

### Value Proposition

This epic turns the simulator into a trustworthy, explainable exhibit that can be run, tested, reviewed, and demonstrated without hidden setup or misleading behavior.

### Success Metrics

| Metric | Target | Measurement |
|---|---|---|
| Critical browser coverage | 100% of approved user-visible features covered | E2E matrix and gate |
| Accessibility checks | All required keyboard/label/status checks pass | Browser accessibility tests and manual review |
| Startup resilience | Successful render or readable fallback error | Browser smoke test |
| Documentation | Local run, formula, assumptions, visual caveat, and AI declaration present | README review |

## Scope

### In Scope

- Physics unit and integration tests wired to project commands.
- Browser tests for controls, examples, edge checks, scene response, camera, accessibility, and startup failure.
- Manual visual/exhibit review with Maya and Elena personas.
- README with local commands, equations, assumptions, material-source note, exaggerated-scale caveat, and Codex/AI declaration.
- Dependency/security and diff quality checks.

### Out of Scope

- Load testing, multi-user testing, analytics, production operations, or cloud deployment.
- Certification of material data or validation of engineering failure behavior beyond the approved simplified model.
- Additional product features or screens.

### Affected Personas

- **Maya Santos:** Can run and present the exhibit confidently with accessible controls and understandable failure/status behavior.
- **Elena Reyes:** Can reproduce the calculations and verify scope, documentation, and reliability.

## Acceptance Criteria (Epic Level)

- [x] Unit tests pass for both worked examples and all specified edge checks.
- [x] Browser tests cover all three controls, live outputs, closure reporting, scene response, camera interaction, and startup behavior.
- [x] Controls are keyboard-operable with visible labels and units.
- [x] Open/Closed status is communicated in text and not by color alone.
- [x] Renderer initialization failure produces a readable error instead of a blank page.
- [x] README documents exact local start/test commands, equations, assumptions, visual exaggeration, coefficient source requirement, and AI declaration.
- [x] No critical dependency/security or scope violation remains open before demonstration.

## Dependencies

### Blocked By

| Dependency | Type | Status | Owner |
|---|---|---|---|
| EP-01M6DA1Y Scientific Core and Interactive Controls | Epic | Draft | Delivery team |
| EP-01M6DA39 Interactive 3D Railway Visualization | Epic | Draft | Delivery team |

### Blocking

None. This is the release-readiness epic.

## Risks & Assumptions

### Assumptions

- Playwright is the recommended browser test tool unless implementation constraints require a documented alternative.
- Manual visual review remains necessary for scene quality and teaching clarity even when automated checks pass.

### Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Browser tests mock away the real calculation/wiring | Medium | High | Use real bundle and real controls; mock only renderer edges when required. |
| Test coverage reports green without meaningful assertions | Medium | High | Use explicit expected values, mutation checks, and AC-to-test traceability. |
| Documentation drifts from implementation commands | Medium | Medium | Run documented commands during the final gate and update README with code. |

## Technical Considerations

### Architecture Impact

Adds test scripts, browser-test configuration if selected, and README/quality-gate documentation. It must not introduce runtime architecture beyond the PRD/TRD.

### Integration Points

- Node test runner and `package.json` scripts.
- Vite local server and browser automation.
- SDLC Studio test specs and executable acceptance verification.
- README and final classroom exhibit workflow.

## Sizing

**Size:** M  
**Estimated Story Count:** 3  
**Derived Point Total:** 11

**Complexity Factors:**

- Browser automation must observe real wiring and a WebGL-dependent scene.
- Some quality criteria require human visual judgment in addition to executable tests.

## Story Breakdown

Stories will be generated after epic review and will cover automated verification, accessibility/resilience, and final documentation/gate readiness.
- [x] [US-01M6DAAX: Verify critical simulator journeys in a browser](../stories/US-01M6DAAX-verify-critical-simulator-journeys-in-a-browser.md)
- [x] [US-01M6DA94: Verify accessibility and renderer failure behavior](../stories/US-01M6DA94-verify-accessibility-and-renderer-failure-behavior.md)
- [x] [US-01M6DA5X: Document local operation and scientific assumptions](../stories/US-01M6DA5X-document-local-operation-and-scientific-assumptions.md)

## Test Plan

An epic-scoped test specification will be generated after stories and will map every acceptance criterion to automated or explicitly manual verification.

## Open Questions

Resolved: Playwright is the final browser smoke-test tool.
Resolved: README cites the NOAA/PMEL Metrology Handbook as the primary coefficient reference and Engineering Toolbox as a secondary reference.

## Revision History

| Date | Author | Change |
|---|---|---|
| 2026-11-02 | Codex | Created from approved PRD, TRD, and TSD. |
