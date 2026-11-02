# US-01M6DA5X: Document local operation and scientific assumptions

> **Status:** Done
> **Created:** 2026-11-02
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Template:** full
> **Affects:** README.md, package.json
> **Epic:** EP-01M6DA3Y
> **Points:** 3
> **Persona:** Elena Reyes

## User Story

**As a** Elena Reyes, teacher evaluator
**I want** complete local-run and scientific documentation
**So that** I can reproduce, evaluate, and explain the exhibit.

## Context

### Persona Reference

**Elena Reyes** - A teacher evaluator who needs to reproduce the exhibit, inspect its assumptions, and explain its limits clearly.
[Full persona details](../personas/elena-reyes-teacher-evaluator.md)

### Background

The final exhibit needs a single, trustworthy local-run guide that connects the approved physics model to the visible simulator and makes the demonstration reproducible for classroom evaluation.

## Inherited Constraints

> See Epic for full constraint chain. Key constraints for this story:

| Source | Type | Constraint | AC Implication |
| --- | --- | --- | --- |
| Epic | Scope | Keep the exhibit local, deterministic, and explainable. | README commands and claims must match the implemented app and test workflow. |
| PRD | Scientific integrity | Document the simplified model and its fixed assumptions. | Equation, coefficients, signed/physical gap rule, and non-goals are explicit. |
| TRD | Runtime | Do not add backend, persistence, or cloud services. | Local start instructions serve the existing static browser shell only. |

## Acceptance Criteria

- **AC1:** Given a fresh checkout, when a developer follows README local-start instructions, then the app starts using the documented commands.
  - **Verify:** shell node --test tests/documentation.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC2:** Given a reader opens the README, when they review the model, then the equation, fixed assumptions, coefficients, signed clearance rule, and non-goals are documented.
  - **Verify:** shell node --test tests/documentation.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC3:** Given a reader reviews the visual explanation, when they read the scene notes, then exaggerated movement and illustrative heat-flow visuals are clearly distinguished from numerical physics.
  - **Verify:** shell node --test tests/documentation.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional
- **AC4:** Given the project documentation is complete, when the assignment declaration is reviewed, then Codex/AI use is documented as required.
  - **Verify:** shell node --test tests/documentation.test.js
  - **Verified:** yes (2026-11-02)
  - **Verification target:** functional

## Scope

### In Scope

- README commands, equation, fixed assumptions, coefficients, non-goals, visual caveats, and AI declaration.
- A documented test/start workflow that can be followed from a fresh checkout.

### Out of Scope

- Deployment operations, user manuals spanning multiple screens, and unrelated assignment deliverables.

## Technical Notes

Documentation must match `package.json` scripts and the implemented UI. Cite a credible source for approximate material coefficients and state that the visual movement is exaggerated while numerical readings use the fixed model.

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
| --- | --- |
| Dependencies are not installed in a fresh checkout | README starts with `npm install` before any npm command. |
| Commands are run outside the repository root | README identifies the repository root as the working directory and gives the local URL. |
| Documentation drifts from implementation | Focused tests assert required terms and implementation review compares README with `src/physics.js` and `index.html`. |
| Approximate coefficients are mistaken for certified data | README labels values approximate, cites a coefficient table, and states engineering certification is out of scope. |
| Illustrative visuals are mistaken for physical measurements | README explicitly says movement is exaggerated and heat-flow visuals are non-quantitative. |

> **Minimum edge cases:** {{config.story_quality.edge_cases.api}} for API stories, {{config.story_quality.edge_cases.other}} for others

## Test Scenarios

- [ ] Follow the README install/start/test workflow from the repository root.
- [ ] Check the equation, fixed assumptions, coefficients, clearance rule, and non-goals against the implementation.
- [ ] Check the visual caveats against the scene notes in `index.html`.
- [ ] Check that the Codex/AI declaration is explicit and visible.

> **Minimum test scenarios:** {{config.story_quality.test_scenarios.api}} for API stories, {{config.story_quality.test_scenarios.ui}} for UI

## Dependencies

### Story Dependencies

| Story | Type | What's Needed | Status |
| --- | --- | --- | --- |
| [US-01M6DAST](US-01M6DAST-render-results-and-honest-closure-explanations.md) | Predecessor | Result wording and simplified model outputs. | Done |
| [US-01M6DA94](US-01M6DA94-verify-accessibility-and-renderer-failure-behavior.md) | Predecessor | Final UI caveats and browser test workflow. | Done |

### External Dependencies

| Dependency | Type | Status |
| --- | --- | --- |
| Node.js and Python 3 | Runtime/tooling | Available in the local development environment. |
| Engineering Toolbox coefficient table | Reference | Cited as an approximate external reference. |

## Estimation

**Points:** 3
**Complexity:** Low

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
| README and start-script documentation | Revert `README.md`, `package.json`, and `tests/documentation.test.js`; no persisted data or runtime state is affected. | Under 10 minutes |

If `affects_production_runtime: false`, replace with: *Not applicable – story does not change runtime behaviour.*

## Open Questions

No open questions.

## Definition of Done

- [x] All four acceptance criteria have passing evidence.
- [x] Local setup and test commands are documented and runnable.
- [x] Scientific assumptions and visual caveats match the implementation.
- [x] Codex/AI declaration is present.
- [x] Full suite, validation, and diff checks pass.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-02 | Codex | Added local-run, scientific-assumption, and AI-declaration criteria. |
