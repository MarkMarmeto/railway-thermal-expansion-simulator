# PL-01M6DC95: Document local operation and scientific assumptions - Implementation Plan

> **Status:** Complete
> **Created:** 2026-11-02
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1

> **Story:** [US-01M6DA5X: Document local operation and scientific assumptions](../stories/US-01M6DA5X-document-local-operation-and-scientific-assumptions.md)
> **Epic:** [EP-01M6DA3Y: Exhibit Quality and Verification](../epics/EP-01M6DA3Y-exhibit-quality-and-verification.md)
> **Language:** Markdown / JSON configuration

## Overview

Create a concise README that lets a reviewer install, start, and test the local exhibit, explains the approved thermal-expansion model and fixed assumptions, distinguishes illustrative visuals from numerical physics, and records the required Codex/AI declaration. Keep the documentation synchronized with the existing `package.json` scripts and UI wording.

## Acceptance Criteria Summary

| AC | Name | Plan coverage |
| --- | --- | --- |
| AC1 | Reproducible local start | README documents dependency installation, `npm run start`, URL, and test commands; package script is added if required. |
| AC2 | Scientific assumptions | README states ΔL = α × L₀ × (T − T₀), L₀ = 10 m, T₀ = 25 °C, coefficients, signed/physical clearance, and non-goals. |
| AC3 | Honest visual explanation | README repeats the UI caveats that movement is exaggerated and heat-flow visuals are illustrative/non-quantitative. |
| AC4 | AI declaration | README includes an explicit Codex/AI-use declaration for the assignment. |

## Technical Context

### Existing Patterns

- `package.json` already defines Node unit and Playwright browser test commands but has no local `start` script.
- The app is a static browser shell with CDN Three.js, `src/physics.js` as the calculation authority, and `tests/e2e/server.js` as the existing static-server pattern.
- Existing UI text in `index.html` contains the approved visual-scale and heat-flow caveats and must not be contradicted by README wording.

### Change Difficulty

Repo-map review identified `src/scene.js`, `src/main.js`, and `src/physics.js` as high-relevance hubs, but this story changes documentation/package metadata only. Complexity assessment found no scored functions and a low-risk change; no refactor-first work is needed.

## Recommended Approach

**Strategy:** Test-After
**Rationale:** The implementation is documentation and script wiring. Add the README and start command, then validate exact required phrases and runnable commands with focused checks plus the existing full suite.

### Test Priority

1. The documented start command and URL must be runnable from the project root.
2. The README must contain every approved equation, assumption, coefficient, rule, caveat, and non-goal.
3. The AI declaration must be explicit and easy for an evaluator to find.

## Implementation Tasks

| # | Task | File | Depends On | Status |
| ---: | --- | --- | --- | --- |
| 1 | Add a local static-server start command aligned with the existing browser harness. | `package.json` | Existing Node/Python runtime | [x] |
| 2 | Write README local-run, test, model, assumptions, coefficient-source, visual-caveat, and AI-declaration sections. | `README.md` | Task 1; existing `index.html`, `src/physics.js` | [x] |
| 3 | Add focused documentation/script checks and update AC verification commands to executable checks. | `tests/documentation.test.js`, story artifact | Tasks 1-2 | [x] |
| 4 | Run documented start/test commands, full tests, SDLC validation, and diff checks. | `README.md`, `package.json`, `tests/`, `sdlc-studio/` | Tasks 1-3 | [x] |

## Implementation Phases

### Phase 1: Make the local workflow explicit

**Goal:** Ensure the README's start command maps to an actual project script.

- [x] Add `npm run start` using the existing static-server approach and document the local URL.
- [x] Document `npm install`, `npm test`, and the Playwright browser test command.

**Files:** `package.json`, `README.md`.

### Phase 2: Document the approved scientific model and honesty boundaries

**Goal:** Give evaluators enough detail to reproduce and explain the exhibit without implying engineering validation.

- [x] Document the equation, units, fixed rail length/reference temperature, material coefficients and their credible source.
- [x] Document signed gap `g₀ − ΔL`, physical gap `max(0, signed gap)`, Open/Closed meaning, and excluded buckling/force/failure analyses.
- [x] Document exaggerated rail movement and non-quantitative heat-flow visuals.
- [x] Add the required Codex/AI-use declaration.

**Files:** `README.md`, with wording checked against `src/physics.js` and `index.html`.

### Phase 3: Testing & Validation

**Goal:** Verify all acceptance criteria against the committed documentation and scripts.

| AC | Verification Method | File Evidence | Status |
| --- | --- | --- | --- |
| AC1 | Focused README/script assertions plus documented command execution. | `tests/documentation.test.js` | Passed |
| AC2 | Focused assertions for equation, assumptions, coefficients, signed clearance, and non-goals. | `tests/documentation.test.js` | Passed |
| AC3 | Focused assertions for both visual caveats. | `tests/documentation.test.js` | Passed |
| AC4 | Focused assertion for explicit Codex/AI declaration. | `tests/documentation.test.js` | Passed |

## Edge Case Handling

| # | Edge Case (from Story) | Handling Strategy | Phase |
| ---: | --- | --- | --- |
| 1 | Fresh checkout has dependencies not installed | README starts with `npm install`; `npm run start` is documented only after installation. | Phase 1 |
| 2 | Reviewer runs commands from a different directory | README explicitly says to run commands from the repository root and gives the URL/port. | Phase 1 |
| 3 | README equation drifts from implementation | Documentation test asserts exact approved symbols/values and implementation review compares `src/physics.js`. | Phase 2/3 |
| 4 | Material coefficients are mistaken for certified engineering data | README labels them approximate source values and states the simplified model's limits. | Phase 2 |
| 5 | Visual exaggeration is mistaken for physical scale | README repeats the UI's explicit illustrative/non-quantitative caveats. | Phase 2 |

**Coverage:** 5/5 edge cases handled

## Risks & Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| The start command works only on one platform. | Medium | Use the existing cross-platform Python static-server command and document the required Python runtime. |
| A source citation implies more precision than the model supports. | Medium | Call coefficients approximate, cite the source, and state that engineering certification is out of scope. |
| README commands drift from package scripts. | Medium | Add focused assertions and run the documented commands before completion. |

## Definition of Done

- [x] All four acceptance criteria have passing evidence.
- [x] A fresh local setup path is documented and runnable.
- [x] Scientific assumptions, visual caveats, and non-goals match the implementation.
- [x] AI declaration is present.
- [x] Full suite, validation, and diff checks pass.

## Notes

No runtime physics or scene behavior changes are planned. The implementation should remain limited to `README.md`, `package.json`, focused documentation tests, and lifecycle artifacts.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-02 | Codex | Created implementation plan with 4/4 AC and 5/5 edge-case coverage. |
