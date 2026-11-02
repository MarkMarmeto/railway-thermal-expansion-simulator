<!--
Source: railway_thermal_expansion_PRD_v1_1_approved_scope.md
This PRD translates the approved scope into the SDLC Studio structure.
-->
# Product Requirements Document

**Project:** railway-thermal-expansion-simulator  
**Version:** 1.1  
**Last Updated:** 2026-11-02  
**Status:** Ready for implementation planning

---

## 1. Project Overview

### Product Name

Railway Track Thermal Expansion Simulator

### Purpose

Create a single-page interactive 3D railway joint simulator that shows how temperature and material affect rail expansion and how the initial joint gap affects remaining clearance. A user must be able to change three inputs, immediately see numerical results and rail movement, and understand the governing physics equation.

The MVP is intentionally limited to the simplest scientifically defensible interactive demonstration. It does not simulate trains, structural failure, detailed heat transfer, or real-world buckling.

### Success Definition

A first-time visitor can change any of the three controls and see a coherent update to the 3D rail joint and calculated readings, without instructions beyond short on-screen labels. Every displayed calculation matches the documented equation. The application runs on an ordinary classroom laptop and can be explained in a short live demonstration.

### Tech Stack

- JavaScript
- Vite
- Vanilla HTML/CSS
- Three.js
- Node.js built-in test runner for physics tests

### Architecture Pattern

Small client-side single-page application with pure physics calculations separated from the 3D scene and UI orchestration:

- `src/physics.js` — pure calculation function and material constants
- `src/scene.js` — Three.js railway scene, camera, animation, and visual state
- `src/main.js` — controls, events, calculation-to-UI wiring, and scene updates
- `src/style.css` — single-page styling
- `tests/physics.test.js` — equation and edge-case tests

No backend, database, account system, persistence, or remote service is required.

---

## 2. Problem Statement

### Problem Being Solved

Learners need a clear interactive demonstration of how rail temperature, material expansion coefficient, and initial joint gap affect thermal expansion and remaining clearance. Static equations alone do not make the relationship between the calculation and visible rail movement intuitive.

### Target Users

- Students demonstrating or learning railway thermal expansion
- Teachers evaluating a short physics/software exhibit
- Classroom or assessment audiences viewing the simulator on a laptop browser

### Context

The simulator supports the approved school proposal and performance task. The proposal specifies Visual Studio Code, Codex, JavaScript, a temperature range of 10–100°C, an initial gap range of 0–15 mm, and Steel, Aluminum, and Copper choices. The broader assignment includes 3D motion, temperature-color visualization, orbit/zoom, and live outputs.

---

## 3. Feature Inventory

| Feature | Description | Status | Priority | Location |
|---|---|---|---|---|
| Temperature control | Slider from 10°C to 100°C driving signed expansion, gap, movement, and heat color | Not Started | Must | Single-screen UI |
| Initial gap control | Slider from 0 mm to 15 mm driving remaining clearance and closure status | Not Started | Must | Single-screen UI |
| Material control | Dropdown for Steel, Aluminum, or Copper with explicit coefficient | Not Started | Must | Single-screen UI |
| Physics calculation | Linear thermal expansion and signed-clearance calculation using fixed assumptions | Not Started | Must | `src/physics.js` |
| Live results | Temperature, material, coefficient, assumptions, expansion, gap, status, formula, and explanation | Not Started | Must | Results panel |
| 3D railway scene | Two rail ends, joint, sleepers, gap indicator, lighting, movement, and camera controls | Not Started | Must | `src/scene.js` |
| Thermal visualization | Cool-blue to warm-red response to temperature | Not Started | Must | 3D scene |
| Teaching explanation | Plain-language definitions and interpretation of the displayed result | Not Started | Must | Results/help panel |
| Graceful startup failure | Readable error if 3D initialization fails rather than a blank page | Not Started | Must | Application shell |
| Local documentation | Run commands, formulas, assumptions, animation caveat, and AI declaration documentation | Not Started | Must | `README.md` |

### Feature Details

#### Temperature Control

**User Story:** As a learner, I want to adjust rail temperature from 10°C to 100°C so that I can observe contraction or expansion and its effect on the joint.

**Acceptance Criteria:**

- [ ] The UI exposes a temperature slider constrained to 10–100°C.
- [ ] Changing temperature updates signed `ΔL`, remaining gap, status, rail position, and thermal coloring together.
- [ ] Cooling below 25°C produces negative `ΔL` and increases the physical gap.
- [ ] Temperature is displayed with its °C unit.

**Dependencies:** Physics calculation, UI event wiring, 3D scene.  
**Status:** Not Started  
**Confidence:** [HIGH]

#### Initial Joint Gap Control

**User Story:** As a learner, I want to adjust the initial expansion joint gap so that I can see whether the available clearance remains open.

**Acceptance Criteria:**

- [ ] The UI exposes an initial gap slider constrained to 0–15 mm.
- [ ] Changing the initial gap updates the remaining gap and closure status.
- [ ] Changing the initial gap does not change free thermal expansion `ΔL`.

**Dependencies:** Physics calculation, UI event wiring.  
**Status:** Not Started  
**Confidence:** [HIGH]

#### Material Selection

**User Story:** As a learner, I want to choose Steel, Aluminum, or Copper so that I can compare the effect of the expansion coefficient.

**Acceptance Criteria:**

- [ ] The dropdown contains exactly Steel, Aluminum, and Copper.
- [ ] The selected material name and coefficient are visible.
- [ ] Changing material updates `α`, `ΔL`, movement, and gap.
- [ ] Material identity remains readable separately from the temperature heat map.

**Dependencies:** Material constants, physics calculation, UI and scene wiring.  
**Status:** Not Started  
**Confidence:** [HIGH]

#### Physics Calculation and Closure Reporting

**User Story:** As a learner, I want the displayed values to follow an understandable equation so that the simulation is scientifically defensible.

**Acceptance Criteria:**

- [ ] The calculation uses `ΔL = α × L₀ × (T − T₀)`.
- [ ] `L₀` is fixed at 10 m and `T₀` is fixed at 25°C.
- [ ] `ΔL` is displayed in signed millimetres.
- [ ] Signed clearance is calculated as `g_raw = g₀ − ΔL_mm`.
- [ ] Displayed physical gap is `g = max(0, g_raw)` mm.
- [ ] Status is Open when `g_raw > 0`; otherwise it is Closed / Insufficient clearance.
- [ ] A closed result does not claim to calculate buckling, compression force, or real-world failure.
- [ ] Negative signed clearance is never presented as a physical remaining gap.

**Dependencies:** Physics constants and test cases.  
**Status:** Not Started  
**Confidence:** [HIGH]

#### Interactive 3D Scene and Camera

**User Story:** As a learner, I want to see the rail ends move at the joint so that the numerical result has a clear physical representation.

**Acceptance Criteria:**

- [ ] The scene includes two adjacent rail ends, a visible joint, sleepers, gap indication, and basic lighting.
- [ ] Temperature or material changes produce smooth visible rail movement.
- [ ] The user can orbit and zoom the camera.
- [ ] Small physical expansions use a clearly labelled exaggerated visual scale.
- [ ] Optional heat-flow arrows or particles are illustrative only and are not presented as quantitative fluid physics.

**Dependencies:** Three.js scene and shared calculated state.  
**Status:** Not Started  
**Confidence:** [HIGH]

#### Teaching Clarity and Accessibility

**User Story:** As a classroom user, I want readable labels and a short explanation so that I can understand and operate the exhibit without extensive instructions.

**Acceptance Criteria:**

- [ ] The screen explains `α`, `L₀`, `T`, `T₀`, `ΔL`, and `g₀`.
- [ ] The formula and one-line plain-language interpretation are visible.
- [ ] Controls are keyboard-operable and have visible labels and units.
- [ ] Text contrast is adequate.
- [ ] Open/Closed status is not communicated by color alone.

**Dependencies:** UI layout and content.  
**Status:** Not Started  
**Confidence:** [HIGH]

---

## 4. Functional Requirements

### Core Behaviours

- **FR-01 App starts:** On opening in a laptop browser, the user sees the 3D railway joint, all three controls, and initial results without sign-in or network-backed services.
- **FR-02 Temperature:** Any temperature from 10°C through 100°C updates `ΔL`, gap, status, rail position, and thermal coloring together.
- **FR-03 Joint gap:** Any initial gap from 0 mm through 15 mm updates gap and closure status while leaving `ΔL` unchanged.
- **FR-04 Material:** Steel, Aluminum, and Copper update coefficient, expansion, movement, and gap while keeping material identity readable.
- **FR-05 Accurate physics:** Results use the specified equations, consistent metre-to-millimetre conversion, negative expansion on cooling, and no invented pressure or force values.
- **FR-06 Camera and visual response:** The scene supports orbit and zoom. Temperature or material changes produce smooth rail movement and temperature coloring. The exaggerated movement scale is explicitly labelled.
- **FR-07 Closure reporting:** Signed clearance less than or equal to zero yields `0 mm` physical gap and `Closed / Insufficient clearance`, with no claim that buckling was calculated.
- **FR-08 Teaching clarity:** The interface explains the variables and displayed result in everyday language.
- **FR-09 Verification:** At least two sample calculations are reproducible manually and covered by automated unit tests; UI values match within normal display rounding.
- **FR-10 Exhibit resilience:** Local start commands are documented. No account, database, remote API, or paid asset is required. A 3D initialization failure shows a readable error instead of a blank page.

### Input/Output Specifications

Exactly three primary interactive controls are in scope:

| Control | Input | Output |
|---|---|---|
| Thermal | `T: 10–100°C` slider | Signed `ΔL` in mm and cool-blue to warm-red rail visualization |
| Mechanical/geometric | `g₀: 0–15 mm` slider | Remaining gap `g` in mm and Open / Closed indicator |
| Material | Steel, Aluminum, Copper dropdown | `α`, rail movement, and gap reading |

The results panel shows selected temperature and material, `α`, `L₀ = 10 m`, `T₀ = 25°C`, signed `ΔL`, physical remaining gap, status, the main formula, and a plain-language interpretation.

### Business Logic Rules

Material coefficients are fixed approximate reference values:

| Material | `α` |
|---|---:|
| Steel | `12 × 10⁻⁶ /°C` |
| Aluminum | `23 × 10⁻⁶ /°C` |
| Copper | `17 × 10⁻⁶ /°C` |

The model is a simplified freely expanding joint. It does not calculate actual buckling, compression force, rail stress, failure, fluid flow, thermodynamic gas laws, Carnot efficiency, or a full heat-flow solver.

---

## 5. Non-Functional Requirements

### Performance

- Control changes should update numerical output and visual state immediately enough for live classroom demonstration.
- The application should run on one ordinary classroom laptop in a standard browser.
- Keep the scene to basic boxes/cylinders, sleepers, lighting, and lightweight animation.

### Security

- No authentication, account, database, backend, analytics, or cloud service is required.
- Do not require or store user secrets.
- Do not load paid or untrusted 3D assets.

### Scalability

Scalability beyond a single browser session is out of scope. The design should remain small and understandable rather than introduce state-management or service infrastructure.

### Availability and Resilience

- The application must run locally using documented commands.
- If Three.js initialization fails, show a readable error message rather than a blank page.
- The simulator must not depend on network-backed runtime services.

### Accessibility

- Visible labels with units.
- Keyboard-operable controls.
- Adequate text contrast.
- Status communicated with text, not color alone.

---

## 6. AI/ML Specifications

No AI/ML runtime feature is part of the simulator. The project documentation must include the required declaration of Codex/AI use when preparing the assignment.

---

## 7. Data Architecture

### Data Models

The runtime state is an in-memory object containing:

- selected material and coefficient `α`
- temperature `T`
- initial gap `g₀`
- fixed assumptions `L₀ = 10 m` and `T₀ = 25°C`
- calculated signed expansion `ΔL_mm`
- calculated signed clearance `g_raw`
- displayed physical gap `g`
- Open/Closed status

### Relationships and Constraints

- Temperature is constrained to 10–100°C.
- Initial gap is constrained to 0–15 mm.
- Material is one of exactly three fixed choices.
- `g` cannot be displayed below 0 mm.
- `g_raw` remains available to determine closure status.

### Storage Mechanisms

No persistence is required. State exists only for the current browser session.

---

## 8. Integration Map

### External Services

None at runtime.

### Authentication Methods

None.

### Third-Party Dependencies

- Three.js for browser-based 3D rendering.
- Vite for local development and bundling.

Avoid React, TypeScript, state-management libraries, physics-engine packages, CSS frameworks, server endpoints, and imported 3D assets unless a documented implementation blocker requires reconsideration.

---

## 9. Configuration Reference

### Environment Variables

None required for the MVP.

### Feature Flags

None required. Optional reset controls and one-line usage instructions are permitted as minor conveniences; no additional major screens or controls may be added.

### Fixed Scientific Assumptions

| Setting | Value |
|---|---:|
| Effective rail length `L₀` | 10 m |
| Reference temperature `T₀` | 25°C |
| Temperature range | 10–100°C |
| Initial gap range | 0–15 mm |

---

## 10. Quality Assessment

### Required Test Cases

**Case A — steel, gap remains open**

- Inputs: Steel, `T = 55°C`, `g₀ = 6 mm`, `L₀ = 10 m`, `T₀ = 25°C`.
- Expected: `ΔL = 3.6 mm`, `g_raw = 2.4 mm`, displayed `g = 2.4 mm`, status Open.

**Case B — aluminum, insufficient clearance**

- Inputs: Aluminum, `T = 75°C`, `g₀ = 5 mm`, `L₀ = 10 m`, `T₀ = 25°C`.
- Expected: `ΔL = 11.5 mm`, `g_raw = −6.5 mm`, displayed `g = 0 mm`, status Closed / Insufficient clearance.
- The scene must not animate physical rail overlap or describe `−6.5 mm` as a real remaining gap.

**Edge checks**

- Steel, `T = 10°C`, `g₀ = 6 mm`: `ΔL = −1.8 mm`, `g = 7.8 mm`, Open.
- Any material at `T = 25°C`: `ΔL = 0`.
- Any material at `g₀ = 0` and `T ≥ 25°C`: Closed.

### Tested Functionality

Before implementation: none. The physics module must receive automated unit tests before the 3D scene is considered complete. UI behavior and the two worked examples must be checked in a browser test or equivalent demonstrable verification.

### Untested Areas

All features are currently unimplemented and therefore untested. Physical rail behavior beyond the simplified model is intentionally not tested because it is out of scope.

### Technical Debt

- The material coefficients are approximate reference values, not engineering-certified data; a credible source must be cited in the final binder.
- Visual movement is exaggerated for clarity and must be labelled as such.
- The teacher’s interpretation of “fluid animations” should be confirmed if needed; the MVP uses smooth rail motion and illustrative heat-flow indicators rather than fluid simulation.

---

## 11. Open Questions

1. Confirm any additional teacher expectations for the assignment’s broader binder and exhibit deliverables; these remain separate from the app MVP.
2. Confirm whether the teacher accepts illustrative heat-flow arrows/particles as the interpretation of the task’s “fluid animations” wording.
3. Confirm the credible source to cite for the approximate material coefficients in the final binder.

The submitted proposal includes a teacher signature and favorable remarks, but its APPROVED checkbox is not visibly checked. The user-supplied approved-scope document is treated as the scope baseline; the checkbox is not represented as marked in this artifact.

---

## 12. Non-Goals

- Multi-topic simulator, full railway network, moving trains, derailment, buckling prediction, or failure prediction.
- Finite element analysis, rail stress/force calculations, real fluid dynamics, full heat-transfer PDE solver, or detailed thermodynamic cycles.
- Login, accounts, database, backend, cloud services, analytics, multiplayer, persistence, export/report generation, administrative panels, multi-page tutorials, heavy 3D assets, photorealism, or advanced particle engines.
- Additional interactive controls for rail length, insulation, train speed, or heat flux.

---

## 13. Delivery Plan

1. Implement `calculateRailState()` and automated physics tests first, with simple controls and numbers but no 3D scene.
2. Build one Three.js scene with rails, joint gap, sleepers, orbit/zoom, movement, and heat colors wired to the same calculated state.
3. Finish concise explanation, labels, graceful closed-gap handling, browser verification, and README documentation covering local run commands, formulas, assumptions, animation scale, and the AI declaration.

No extra features should be added until these acceptance tests pass.

---

## 14. Definition of Done

- All three approved controls work with the stated options and ranges.
- Worked examples and edge checks produce the specified values.
- Rails visibly respond, the camera orbits/zooms, heat colors reflect temperature, and measurements update immediately.
- Open/Closed status is clear and no misleading negative physical gap is displayed.
- Code is readable, dependencies are minimal, and the app works in a standard laptop browser.
- README documents how to run the app, how formulas work, assumptions, and the animation-scale caveat.
- Documentation includes the required Codex/AI declaration.

---

## Changelog

| Date | Version | Changes |
|---|---|---|
| 2026-11-02 | 1.1 | Created from `railway_thermal_expansion_PRD_v1_1_approved_scope.md`, preserving the approved lean MVP scope. |
