# TS-01M6DB54: Critical simulator browser journeys

> **Status:** Draft
> **Created:** 2026-11-02
> **Created-by:** Codex; agent; v1
> **Raised-by:** Codex; agent; v1
> **Story:** US-01M6DAAX
> **Epic:** EP-01M6DA3Y

## Overview

Verify the simulator in a real browser against a local static server. The suite must load the actual page and scripts, exercise the three real controls, and assert the visible scene/results for the approved Steel open example and Aluminum closed example without sign-in, backend, physics mocks, or scene mocks.

## Scope

### Stories Covered

| Story | Title | Priority |
| --- | --- | --- |
| [US-01M6DAAX](../stories/US-01M6DAAX-verify-critical-simulator-journeys-in-a-browser.md) | Verify critical simulator journeys in a browser | P1 |

### AC Coverage Matrix

| Story | AC | Description | Test Cases | Status |
| --- | --- | --- | --- | --- |
| US-01M6DAAX | AC1 | Initial page shows scene, three controls, and results without sign-in/backend. | TC01 | Covered |
| US-01M6DAAX | AC2 | Steel worked example shows 3.6 mm expansion, 2.4 mm gap, and Open. | TC02 | Covered |
| US-01M6DAAX | AC3 | Aluminum closed example shows 11.5 mm expansion, 0 mm gap, and Closed / Insufficient clearance. | TC03 | Covered |
| US-01M6DAAX | AC4 | Each primary control updates numerical results and visible scene state. | TC04 | Covered |

**Coverage:** 4/4 ACs covered

### Test Types Required

| Type | Required | Rationale |
| ------ | ---------- | ----------- |
| Unit | No | Formula and formatting units are already covered by the existing Node suite. |
| Integration | Yes | The browser must exercise the real HTML-to-main-to-physics-to-scene seam. |
| E2E | Yes | The story specifically requires a real browser and critical user journeys. |

### Strategy Heuristics

- [x] **Production-state-shape integration test** - TC02-TC04 use complete real control state through the browser, not isolated physics fixtures.
- [x] **Rejects-old-shape contract test** - Not applicable: no wire format, API shape, or schema changes.
- [x] **Regression test per fixed bug** - Not applicable: this is critical journey coverage, not a bug fix.

## Environment

| Requirement | Details |
| ------------- | --------- |
| Prerequisites | Node.js, Playwright CLI/browser, and a local HTTP server for the repository root. |
| External Services | None; the page may load its approved CDN Three.js runtime. |
| Test Data | Initial state; Steel at 55°C/6 mm; Aluminum at 75°C/5 mm; each primary control changed independently. |

## Test Cases

### TC01: Initial browser load

**Type:** E2E | **Priority:** P0 | **Story:** US-01M6DAAX

| Step | Action | Expected Result |
| ------ | ------ | ----------------- |
| Given | Start the local static server and open the root page in a browser. | The document loads without authentication or backend requests. |
| When | Inspect the page by accessible labels and stable IDs. | Temperature, initial gap, and material controls are visible; the scene mount/canvas and results regions are visible. |
| Then | Read the initial result summary. | Initial temperature, material, gap, and status are rendered. |

**Assertions:**

- [ ] Page loads over HTTP without sign-in.
- [ ] Exactly three primary controls are visible.
- [ ] Scene mount/canvas is visible.
- [ ] Summary, explanation, and limitations are visible.

### TC02: Steel worked example

**Type:** E2E | **Priority:** P0 | **Story:** US-01M6DAAX

| Step | Action | Expected Result |
| ------ | ------ | ----------------- |
| Given | Open the page with the real control wiring. | The controls are interactive. |
| When | Set temperature to 55°C, initial gap to 6 mm, and material to Steel. | The app recomputes through the real physics module. |
| Then | Read the visible results. | Expansion is 3.6 mm, physical gap is 2.4 mm, and status is Open. |

**Assertions:**

- [ ] Visible temperature is 55°C.
- [ ] Visible expansion is 3.6 mm.
- [ ] Visible physical gap is 2.4 mm.
- [ ] Visible status is Open.

### TC03: Aluminum insufficient-clearance example

**Type:** E2E | **Priority:** P0 | **Story:** US-01M6DAAX

| Step | Action | Expected Result |
| ------ | ------ | ----------------- |
| Given | Start from the real page and controls. | No state is mocked. |
| When | Set temperature to 75°C, initial gap to 5 mm, and material to Aluminum. | The app recomputes the closed state. |
| Then | Read the visible results. | Expansion is 11.5 mm, physical gap is 0 mm, signed gap is -6.5 mm, and status is Closed / Insufficient clearance. |

**Assertions:**

- [ ] Visible material is Aluminum.
- [ ] Visible expansion is 11.5 mm.
- [ ] Visible physical gap is 0 mm.
- [ ] Visible closed status is explicit.

### TC04: Each primary control updates shared UI and scene

**Type:** E2E | **Priority:** P1 | **Story:** US-01M6DAAX

| Step | Action | Expected Result |
| ------ | ------ | ----------------- |
| Given | Load the page and capture the initial result summary and scene observable state. | The app has a baseline state. |
| When | Change temperature, initial gap, and material one at a time. | Each control dispatches the real recomputation path. |
| Then | Compare results and scene observables after each change. | Numerical output changes when expected, material/heat cue updates, and the same interaction updates the visible scene without a separate physics path. |

**Assertions:**

- [ ] Temperature change updates visible temperature/expansion and scene heat state.
- [ ] Initial-gap change updates visible signed/physical gap and scene gap state.
- [ ] Material change updates visible material and scene material cue/coefficient.
- [ ] No sign-in or backend is introduced.

## Fixtures

```yaml
server:
  root: .
  protocol: http
  port: 4173
examples:
  steel_open:
    temperature_c: 55
    initial_gap_mm: 6
    material: steel
    expansion_mm: 3.6
    physical_gap_mm: 2.4
    status: Open
  aluminum_closed:
    temperature_c: 75
    initial_gap_mm: 5
    material: aluminum
    expansion_mm: 11.5
    signed_gap_mm: -6.5
    physical_gap_mm: 0
    status: Closed/Insufficient clearance
```

## Automation Status

| TC | Title | Status | Implementation |
| --- | --- | --- | --- |
| TC01 | Initial browser load | Automated | `tests/e2e/simulator.spec.js` |
| TC02 | Steel worked example | Automated | `tests/e2e/simulator.spec.js` |
| TC03 | Aluminum insufficient-clearance example | Automated | `tests/e2e/simulator.spec.js` |
| TC04 | Each primary control updates shared UI and scene | Automated | `tests/e2e/simulator.spec.js` |

## Traceability

| Artefact | Reference |
| ---------- | ---------- |
| PRD | [sdlc-studio/prd.md](../prd.md) |
| Epic | [EP-01M6DA3Y](../epics/EP-01M6DA3Y-exhibit-quality-and-verification.md) |
| Plan | [PL-01M6DBZH](../plans/PL-01M6DBZH-verify-critical-simulator-journeys-in-a-browser.md) |
| TSD | [sdlc-studio/tsd.md](../tsd.md) |

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-02 | Codex | Created real-browser TDD specification with 4/4 AC coverage. |
