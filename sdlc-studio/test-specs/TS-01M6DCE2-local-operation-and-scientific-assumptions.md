# TS-01M6DCE2: Local operation and scientific assumptions

> **Status:** Complete
> **Created:** 2026-11-02
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1

> **Story:** [US-01M6DA5X: Document local operation and scientific assumptions](../stories/US-01M6DA5X-document-local-operation-and-scientific-assumptions.md)
> **Epic:** [EP-01M6DA3Y: Exhibit Quality and Verification](../epics/EP-01M6DA3Y-exhibit-quality-and-verification.md)

## Overview

Validate that the README is an executable local-run guide and an honest explanation of the approved simplified thermal-expansion model. The checks assert exact documentation contracts while the implementation workflow separately runs the documented commands.

## Scope

### Stories Covered

| Story | Title | Priority |
| --- | --- | --- |
| [US-01M6DA5X](../stories/US-01M6DA5X-document-local-operation-and-scientific-assumptions.md) | Document local operation and scientific assumptions | P1 |

### AC Coverage Matrix

| Story | AC | Description | Test Cases | Status |
| --- | --- | --- | --- | --- |
| US-01M6DA5X | AC1 | Fresh-checkout local start and test commands are documented and runnable. | TC01 | Covered |
| US-01M6DA5X | AC2 | Equation, assumptions, coefficients, signed clearance rule, and non-goals are documented. | TC02 | Covered |
| US-01M6DA5X | AC3 | Exaggerated movement and illustrative heat-flow visuals are clearly caveated. | TC03 | Covered |
| US-01M6DA5X | AC4 | Codex/AI use is explicitly declared. | TC04 | Covered |

**Coverage:** 4/4 ACs covered

### Test Types Required

| Type | Required | Rationale |
| --- | --- | --- |
| Unit | Yes | README and package-script contracts can be checked deterministically. |
| Integration | Yes | The documented start command must serve the actual app shell. |
| E2E | No | Existing browser smoke tests cover the running exhibit; this story validates its documentation. |

### Strategy Heuristics

- [x] **Production-state-shape integration test** - Not applicable: no production state shape changes.
- [x] **Rejects-old-shape contract test** - Not applicable: no API, wire format, or schema changes.
- [x] **Regression test per fixed bug** - Not applicable: this is documentation completion rather than a defect fix.

## Environment

| Requirement | Details |
| --- | --- |
| Prerequisites | Node.js, Python 3, repository root, and installed npm dependencies. |
| External Services | None; coefficient citation is documentation-only. |
| Test Data | README text, package scripts, equation symbols, fixed assumptions, visual caveats, and AI declaration. |

## Test Cases

### TC01: Local commands match the project workflow

**Type:** Unit + integration | **Priority:** P0 | **Story:** US-01M6DA5X

| Step | Action | Expected Result |
| --- | --- | --- |
| Given | Read README local-start instructions and `package.json`. | Every documented command has a matching script or standard prerequisite. |
| When | Run `npm test` and start the documented local server from the repository root. | Commands complete/launch without undocumented setup. |
| Then | Request the documented local URL. | The simulator shell is served. |

**Assertions:**

- [ ] README contains install, start, URL, unit-test, and browser-test commands.
- [ ] `package.json` contains the documented `start` script.
- [ ] The documented URL matches the start command's port.

### TC02: Scientific model and assumptions are complete

**Type:** Unit | **Priority:** P0 | **Story:** US-01M6DA5X

| Step | Action | Expected Result |
| --- | --- | --- |
| Given | Read the model section of README. | The approved equation and fixed values are present. |
| When | Compare wording with `src/physics.js`. | Coefficients, units, signed/physical gap behavior, and reference values agree. |
| Then | Read the limitations/non-goals section. | Buckling, force, and real-world failure are explicitly excluded. |

**Assertions:**

- [ ] README contains `ΔL = α × L₀ × (T − T₀)`.
- [ ] README states `L₀ = 10 m` and `T₀ = 25 °C`.
- [ ] README lists Steel, Aluminum, and Copper approximate coefficients with a credible source.
- [ ] README explains signed gap and physical-gap clamping.
- [ ] README states excluded analyses/non-goals.

### TC03: Visual caveats are explicit

**Type:** Unit | **Priority:** P1 | **Story:** US-01M6DA5X

| Step | Action | Expected Result |
| --- | --- | --- |
| Given | Read README visual explanation. | It distinguishes visual communication from numerical physics. |
| When | Compare with the scene notes in `index.html`. | README does not imply physical-scale movement or quantitative heat flow. |
| Then | Review the wording as a teacher evaluator. | A reader cannot reasonably mistake the visuals for engineering measurements. |

**Assertions:**

- [ ] README says rail movement is exaggerated/not drawn to physical scale.
- [ ] README says heat-flow arrows/particles are illustrative and non-quantitative.

### TC04: AI declaration is present

**Type:** Unit | **Priority:** P1 | **Story:** US-01M6DA5X

| Step | Action | Expected Result |
| --- | --- | --- |
| Given | Read the README assignment declaration. | The declaration names Codex/AI assistance. |
| When | Review the declaration for ambiguity. | It clearly identifies AI-assisted implementation/documentation. |
| Then | Compare it with assignment requirements. | The required declaration is visible and complete. |

**Assertions:**

- [ ] README includes an explicit `Codex` or `AI` declaration.
- [ ] Declaration is not hidden only in generated lifecycle metadata.

## Fixtures

```yaml
required_scripts: [start, test, test:e2e]
required_model_terms: ["ΔL = α × L₀ × (T − T₀)", "10 m", "25 °C", "signed gap", "physical gap"]
required_visual_terms: [exaggerated, "not drawn to physical scale", illustrative, "non-quantitative"]
required_ai_terms: [Codex, AI]
```

## Automation Status

| TC | Title | Status | Implementation |
| --- | --- | --- | --- |
| TC01 | Local commands match the project workflow | Automated / Passed | `tests/documentation.test.js` |
| TC02 | Scientific model and assumptions are complete | Automated / Passed | `tests/documentation.test.js` |
| TC03 | Visual caveats are explicit | Automated / Passed | `tests/documentation.test.js` |
| TC04 | AI declaration is present | Automated / Passed | `tests/documentation.test.js` |

## Traceability

| Artefact | Reference |
| --- | --- |
| PRD | [sdlc-studio/prd.md](../prd.md) |
| Epic | [EP-01M6DA3Y](../epics/EP-01M6DA3Y-exhibit-quality-and-verification.md) |
| Plan | [PL-01M6DC95](../plans/PL-01M6DC95-document-local-operation-and-scientific-assumptions-implementation-plan.md) |
| TSD | [sdlc-studio/tsd.md](../tsd.md) |

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-02 | Codex | Created test specification with 4/4 AC coverage. |
