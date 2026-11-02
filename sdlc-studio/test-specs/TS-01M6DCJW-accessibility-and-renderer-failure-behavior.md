# TS-01M6DCJW: Accessibility and renderer failure behavior

> **Status:** Complete
> **Created:** 2026-11-02
> **Created-by:** Codex; agent; v1
> **Raised-by:** Codex; agent; v1
> **Story:** US-01M6DA94
> **Epic:** EP-01M6DA3Y

## Overview

Verify keyboard operation, accessible labels and units, color-independent status meaning, and graceful renderer failure in the real browser. Tests must keep native controls and the real physics/results path intact while injecting only the scene-construction failure needed for AC4.

## Scope

### Stories Covered

| Story | Title | Priority |
| --- | --- | --- |
| [US-01M6DA94](../stories/US-01M6DA94-verify-accessibility-and-renderer-failure-behavior.md) | Verify accessibility and renderer failure behavior | P1 |

### AC Coverage Matrix

| Story | AC | Description | Test Cases | Status |
| --- | --- | --- | --- | --- |
| US-01M6DA94 | AC1 | Keyboard reaches and operates all three primary controls. | TC01 | Covered |
| US-01M6DA94 | AC2 | Labels, units, status text, and readable contrast semantics are present. | TC02 | Covered |
| US-01M6DA94 | AC3 | Open/Closed meaning remains explicit without relying on color. | TC03 | Covered |
| US-01M6DA94 | AC4 | Scene initialization failure renders a readable fallback instead of a blank page. | TC04 | Covered |

**Coverage:** 4/4 ACs covered

### Test Types Required

| Type | Required | Rationale |
| ------ | -------- | ----------- |
| Unit | Yes | Result/status formatting and failure rendering seams are deterministic. |
| Integration | Yes | The browser must exercise controls/results while scene creation is unavailable. |
| E2E | Yes | Keyboard and renderer behavior are user-visible browser contracts. |

### Strategy Heuristics

- [x] **Production-state-shape integration test** - TC03 and TC04 use complete real result state and a failing scene boundary.
- [x] **Rejects-old-shape contract test** - Not applicable: no wire format, API shape, or schema changes.
- [x] **Regression test per fixed bug** - Not applicable: this adds explicit accessibility/fallback coverage.

## Environment

| Requirement | Details |
| ------------- | --------- |
| Prerequisites | Node.js, Playwright Chromium, local static server, and the existing app scripts. |
| External Services | None; Three.js may be served by the existing deterministic E2E fixture. |
| Test Data | Initial state, Open state, Closed/Insufficient clearance state, keyboard tab/arrow interactions, and a throwing scene factory. |

## Test Cases

### TC01: Keyboard operation reaches all primary controls

**Type:** E2E | **Priority:** P0 | **Story:** US-01M6DA94

| Step | Action | Expected Result |
| ------ | ------ | ----------------- |
| Given | Open the simulator in a browser with focus at the document start. | The page loads and native controls are available. |
| When | Use Tab to reach temperature, initial gap, and material; operate the sliders/select with keyboard input. | Each control receives focus and changes its value without a pointer. |
| Then | Read the results after each change. | The result summary updates from keyboard interaction. |

**Assertions:**

- [ ] Temperature slider has an accessible name and receives focus.
- [ ] Initial-gap slider has an accessible name and receives focus.
- [ ] Material select has an accessible name and receives focus.
- [ ] Keyboard value changes update visible results.

### TC02: Labels, units, and readable semantics are present

**Type:** E2E | **Priority:** P1 | **Story:** US-01M6DA94

| Step | Action | Expected Result |
| ------ | ------ | ----------------- |
| Given | Open the simulator and inspect accessible roles/text. | Controls and result regions are discoverable by their labels/headings. |
| When | Read the labels, output values, and result summary/explanation. | Temperature, gap, expansion, signed/physical gap, and status include units or explicit wording. |
| Then | Inspect status/failure CSS hooks and live-region attributes. | Dynamic results use readable text and semantic live updates rather than color alone. |

**Assertions:**

- [ ] All controls have associated labels.
- [ ] Results include °C, mm, m, and /°C units where applicable.
- [ ] Results and failure status have accessible live semantics.
- [ ] Status/failure classes use readable contrast-conscious styling.

### TC03: Status meaning is clear without color

**Type:** E2E | **Priority:** P1 | **Story:** US-01M6DA94

| Step | Action | Expected Result |
| ------ | ------ | ----------------- |
| Given | Set the app to an Open state and then a Closed/Insufficient clearance state. | Both states are rendered in the result summary. |
| When | Read the status text without inspecting computed color. | The words Open and Closed / Insufficient clearance identify the meaning. |
| Then | Inspect the status node for a text/label contract. | Meaning remains available to users who cannot distinguish color. |

**Assertions:**

- [ ] Open status is literal text.
- [ ] Closed / Insufficient clearance status is literal text.
- [ ] Signed and physical gap values distinguish the closed condition.

### TC04: Renderer initialization failure has a readable fallback

**Type:** E2E + integration | **Priority:** P0 | **Story:** US-01M6DA94

| Step | Action | Expected Result |
| ------ | ------ | ----------------- |
| Given | Inject a scene factory that throws during initialization before loading the app shell. | The simulated renderer failure is isolated to scene creation. |
| When | Load the page and inspect the scene status and results. | A readable initialization-failure message appears in a live/status region; the page is not blank. |
| Then | Operate a primary control. | Results still calculate and update despite the unavailable scene. |

**Assertions:**

- [ ] Failure message is visible and human-readable.
- [ ] Failure message is announced through status/live semantics.
- [ ] Controls/results remain present and operable.
- [ ] Physics/result calculation is not replaced by a mock.

## Fixtures

```yaml
keyboard_controls: [temperatureC, initialGapMm, material]
open_state:
  material: steel
  temperature_c: 55
  initial_gap_mm: 6
closed_state:
  material: aluminum
  temperature_c: 75
  initial_gap_mm: 5
failure_message_keywords: [scene, renderer, unavailable, failed]
```

## Automation Status

| TC | Title | Status | Implementation |
| --- | --- | --- | --- |
| TC01 | Keyboard operation reaches all primary controls | Automated / Passed | `tests/e2e/accessibility.spec.js` |
| TC02 | Labels, units, and readable semantics are present | Automated / Passed | `tests/e2e/accessibility.spec.js` |
| TC03 | Status meaning is clear without color | Automated / Passed | `tests/e2e/accessibility.spec.js` |
| TC04 | Renderer initialization failure has a readable fallback | Automated / Passed | `tests/e2e/startup-failure.spec.js` |

## Traceability

| Artefact | Reference |
| ---------- | ---------- |
| PRD | [sdlc-studio/prd.md](../prd.md) |
| Epic | [EP-01M6DA3Y](../epics/EP-01M6DA3Y-exhibit-quality-and-verification.md) |
| Plan | [PL-01M6DCVA](../plans/PL-01M6DCVA-verify-accessibility-and-renderer-failure-behavior.md) |
| TSD | [sdlc-studio/tsd.md](../tsd.md) |

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-02 | Codex | Created accessibility and renderer-failure TDD specification with 4/4 AC coverage. |
