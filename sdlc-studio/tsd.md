<!--
Source: sdlc-studio/prd.md and sdlc-studio/trd.md
This TSD defines verification for the approved lean browser simulator.
-->
# Test Strategy Document

> **Project:** railway-thermal-expansion-simulator  
> **Version:** 1.1  
> **Last Updated:** 2026-11-02  
> **Owner:** Project delivery team

## Overview

The test strategy prioritizes scientific correctness and shared-state consistency. The pure physics calculation is tested first with exact examples and boundary cases. Browser-level tests then verify that the three controls, results panel, accessibility labels, 3D scene wiring, camera interaction, and startup failure path expose the tested state coherently.

The project is a local-first static browser application. There are no APIs, databases, authentication flows, persistence, or runtime integrations to contract-test.

## Test Objectives

- Prove the linear-expansion and signed-clearance equations, unit conversions, and material constants.
- Prove that temperature, initial gap, and material changes update all dependent outputs together.
- Prove that negative expansion grows the gap and that insufficient clearance displays zero physical gap without claiming to calculate buckling.
- Prove that the 3D scene is driven by the same calculated state as the results panel.
- Prove keyboard-operable controls, visible units, readable status text, and graceful 3D initialization failure.
- Catch regressions at the control boundaries and in the two approved worked examples before demonstration.

## Scope

### In Scope

- Pure `calculateRailState()` behavior.
- Steel, Aluminum, and Copper coefficient selection.
- Temperature range 10–100°C and initial-gap range 0–15 mm.
- Expansion, signed clearance, clamped physical gap, and Open/Closed status.
- UI control-to-result wiring and normal display rounding.
- 3D scene initialization, rail movement, heat coloring, gap indicator, orbit, and zoom.
- Exaggerated movement label and closed-gap explanation.
- Keyboard interaction, labels, units, contrast, and non-color status communication.
- Local startup, readable renderer failure, and documented run commands.

### Out of Scope

- Actual rail stress, compression force, buckling, derailment, or failure prediction.
- Full heat-transfer or fluid simulation.
- Train movement, railway network behavior, accounts, persistence, backend services, APIs, analytics, or cloud infrastructure.
- Engineering certification of approximate material coefficients.
- Performance/load testing for multiple users or distributed deployment.

---

## Test Levels

### Coverage Targets

| Level | Target | Rationale |
|---|---:|---|
| Unit | 90% of physics-module lines/branches where measurable | The physics module is the core scientific contract and must be thoroughly tested. |
| Integration | 90% of application state transitions | There is no API/database layer; this target applies to UI-to-physics-to-render wiring. |
| E2E | 100% feature coverage for critical user-visible features | Every approved interaction and required exhibit behavior must have at least one browser scenario. |
| Accessibility | 100% of required control/status checks | Keyboard operation, labels, units, contrast, and non-color status are explicit requirements. |

Coverage percentages are evidence, not a substitute for boundary assertions or mutation checks. A green suite that cannot fail on a broken equation is not sufficient.

### Unit Testing

| Attribute | Value |
|---|---|
| Coverage Target | 90% of `src/physics.js` |
| Framework | Node built-in `node:test` and `node:assert/strict` |
| Execution | `npm test` or the exact package script documented in `README.md` |
| Boundary | Pure function only; no DOM, Three.js, timers, or mocks |

Required unit cases:

- Steel, 55°C, 6 mm gap → `ΔL = 3.6 mm`, remaining gap `2.4 mm`, Open.
- Aluminum, 75°C, 5 mm gap → `ΔL = 11.5 mm`, signed gap `−6.5 mm`, displayed gap `0 mm`, Closed / Insufficient clearance.
- Steel, 10°C, 6 mm gap → `ΔL = −1.8 mm`, remaining gap `7.8 mm`, Open.
- Every material at 25°C → `ΔL = 0`.
- Zero initial gap at or above 25°C → Closed.
- Temperature minimum and maximum boundaries: 10°C and 100°C.
- Initial-gap minimum and maximum boundaries: 0 mm and 15 mm.
- Every material coefficient is selected and applied distinctly.
- Displayed gap never becomes negative, while signed gap remains available for status.

### Integration Testing

| Attribute | Value |
|---|---|
| Scope | `main.js` control events, calculated-state propagation, result rendering, and scene update calls |
| Framework | Lightweight browser tests or DOM-capable test harness selected during implementation; prefer real module wiring over broad mocks |
| Execution | Run in the project test command before browser E2E tests |
| Boundary | Mock only browser/renderer edges when necessary; do not mock `calculateRailState()` for state-flow tests |

Integration checks must prove:

- Temperature changes update expansion, gap, status, rail movement, and heat color together.
- Initial gap changes leave expansion unchanged.
- Material changes update coefficient, expansion, movement, and gap.
- Closed results display `0 mm`, text status, and the no-buckling explanation.
- The formula, assumptions, selected values, units, and interpretation are rendered from the current state.

### End-to-End Testing

| Attribute | Value |
|---|---|
| Scope | Critical single-screen user journeys in a standard browser |
| Framework | Playwright recommended; confirm final choice when implementing browser tests |
| Execution | Start the local Vite server, run headless smoke tests, then perform a headed/manual exhibit check when visual judgment is needed |
| Boundary | Real browser controls and application bundle; no replacement of the physics module |

### E2E Feature Coverage Matrix

| Feature Area | Spec File | Test Count | Status |
|---|---|---:|---|
| App startup and default state | `tests/e2e/simulator.spec.js` | Planned | Not Started |
| Temperature interaction and heat color | `tests/e2e/simulator.spec.js` | Planned | Not Started |
| Initial gap and closure reporting | `tests/e2e/simulator.spec.js` | Planned | Not Started |
| Material selection and coefficient output | `tests/e2e/simulator.spec.js` | Planned | Not Started |
| Worked examples and edge checks | `tests/e2e/simulator.spec.js` | Planned | Not Started |
| Camera orbit and zoom | `tests/e2e/simulator.spec.js` | Planned | Not Started |
| Keyboard/accessibility behavior | `tests/e2e/accessibility.spec.js` | Planned | Not Started |
| Renderer initialization failure | `tests/e2e/startup-failure.spec.js` | Planned | Not Started |

### API Contract Testing

Not applicable. The MVP defines no API or server boundary.

### Performance Testing

| Attribute | Value |
|---|---|
| Scope | Lightweight browser responsiveness and render-smoke check on an ordinary classroom laptop |
| Framework | Browser developer tools/manual observation initially; automated performance tooling only if a real issue appears |
| Criteria | Control changes remain responsive, animation does not block input, and the scene stays intentionally lightweight |

### Security Testing

| Attribute | Value |
|---|---|
| Scope | Dependency surface, absence of secrets, safe static serving, and no unexpected network/runtime service requirement |
| Tools | npm audit or equivalent dependency check when dependencies are installed; manual source/config review |
| Criteria | No credentials committed, no unnecessary packages/assets, and no user data collection or persistence |

---

## Test Environments

| Environment | Purpose | URL | Data |
|---|---|---|---|
| Local Node | Unit and integration tests | N/A | Deterministic inline fixtures |
| Local Vite server | Browser smoke and E2E tests | `http://localhost:<port>` | Default state and controlled input values |
| Classroom laptop browser | Final exhibit check | Local server | No external data or account |

Tests must not depend on production services, remote APIs, network-backed fixtures, or paid assets.

## Test Data Strategy

### Approach

Use small deterministic input fixtures matching the approved examples and edge checks. Keep expected values explicit in test names and assertions so a failure explains the scientific discrepancy.

### Sensitive Data

No sensitive data exists or is required. Do not add real student, teacher, account, or analytics data to fixtures.

---

## Automation Strategy

### Automation Candidates

- All physics equations, constants, conversions, boundaries, and closure rules.
- All three control interactions and their dependent result fields.
- Worked examples and edge checks.
- Formula, assumption, unit, and status text presence.
- Basic startup and renderer failure behavior.
- Keyboard operation and accessible labels.
- Camera orbit/zoom smoke behavior where the browser harness can observe it reliably.

### Manual Testing

- Visual quality of the 3D railway scene, sleepers, lighting, joint gap, and heat-color transition.
- Whether exaggerated movement is clearly labelled and understandable.
- Whether a first-time classroom user can explain the result without extra instruction.
- Cross-browser visual sanity check on the intended classroom browser.
- Final teacher/evaluator exhibit review.

### Automation Framework Stack

| Layer | Tool | Language |
|---|---|---|
| E2E/UI | Playwright (recommended) | JavaScript |
| Integration | Browser test harness selected during implementation | JavaScript |
| Unit | Node built-in test runner | JavaScript |
| Coverage | Node/V8 coverage or a minimal compatible coverage tool | JavaScript |

### Mutation and Failure-Oriented Checks

At minimum, deliberately verify that tests fail when:

- The metre-to-millimetre conversion is removed.
- The reference temperature changes from 25°C.
- The aluminum coefficient is replaced with the steel coefficient.
- Negative signed clearance is displayed as a negative physical gap.
- The initial gap incorrectly changes thermal expansion.

Use the project mutation tooling when the implementation surface exists. Survivors must be investigated rather than treated as harmless coverage gaps.

---

## CI/CD Integration

The project has no CI pipeline yet. Once scripts exist, the quality gate should run locally and in CI with the same commands.

### Pipeline Stages

1. **Pre-commit:** formatting/lint checks if configured, unit tests, and diff checks.
2. **Pull request:** unit tests, integration tests, browser E2E smoke, and dependency review.
3. **Pre-demonstration:** full unit suite, full critical-path E2E suite, accessibility checks, and manual visual review.
4. **Pre-release/static publish:** gate plus all executable acceptance verifications.

### Quality Gates

| Gate | Criteria | Blocking |
|---|---|---|
| Physics unit suite | 100% pass; 90% target for physics module | Yes |
| Worked examples | Both approved examples and edge checks pass | Yes |
| Integration state flow | 100% of critical state transitions pass | Yes |
| E2E critical path | All required user-visible features covered and passing | Yes |
| Accessibility | Keyboard, labels, units, contrast/status checks pass | Yes |
| Startup resilience | App starts successfully or renders readable initialization error | Yes |
| Dependency/security review | No unreviewed critical dependency/security issue | Yes |
| Manual visual review | Scene, heat colors, exaggeration label, and camera behavior acceptable | Yes before demonstration |

No feature may be marked complete based only on a screenshot or a test that mocks away the calculation or application wiring.

---

## Defect Management

### Severity Definitions

| Severity | Definition | Handling |
|---|---|---|
| Critical | App cannot start, produces materially incorrect physics, or presents a misleading closed-gap claim | Block demonstration; file a bug immediately |
| High | Required control, output, scene response, or keyboard path is broken with no workaround | Must fix before story completion |
| Medium | Feature is impaired but a clear workaround exists, or a required explanation is incomplete | Fix before final exhibit where feasible; otherwise explicitly defer |
| Low | Cosmetic issue or minor wording/visual polish that does not affect correctness or operation | Backlog and address by priority |

Every defect must identify the affected requirement, reproduction inputs, expected result, actual result, and a verification path.

---

## Roles & Responsibilities

| Role | Responsibility |
|---|---|
| Product / teacher-facing reviewer | Confirms the simulator remains within approved scope and teaches the intended concept. |
| Engineering | Implements the pure calculation, UI, and scene with tests-first sequencing. |
| QA / independent reviewer | Challenges equations, boundaries, wiring, accessibility, and failure behavior; does not sign off its own tests. |
| Student presenter persona | Validates that the key path is understandable and usable during a live demonstration. |

---

## Tools & Infrastructure

| Purpose | Tool |
|---|---|
| Unit testing | Node built-in `node:test` |
| Browser automation | Playwright, recommended pending implementation confirmation |
| Local server | Vite |
| Coverage | Node/V8-compatible coverage reporting |
| Static checks | `git diff --check` plus project lint/format scripts when added |
| Test management | SDLC Studio test specs and story acceptance criteria |

## Test Organisation

```text
tests/
  physics.test.js
  integration/
    state-flow.test.js
  e2e/
    simulator.spec.js
    accessibility.spec.js
    startup-failure.spec.js
```

Tests should be named after observable behavior and include the relevant requirement or test-case reference in their description/docstring.

## Related Specifications

- [Product Requirements Document](prd.md)
- [Technical Requirements Document](trd.md)
- [Project Personas](personas/index.md)

## Revision History

| Date | Author | Change |
|---|---|---|
| 2026-11-02 | Codex | Created test strategy from the approved PRD and TRD. |
