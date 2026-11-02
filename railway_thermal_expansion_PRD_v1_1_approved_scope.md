# Product Requirements Document (PRD)

**Product:** Railway Track Thermal Expansion Simulator  
**Version:** 1.1 — approved proposal alignment, lean MVP  
**Status:** Ready for implementation planning  
**Approach:** Ship the simplest scientifically defensible interactive 3D simulator.

## 1. Purpose

Create a single-page interactive 3D railway joint simulator that shows how temperature and material affect rail expansion and how the initial joint gap affects remaining clearance. Users should be able to change three inputs, immediately see numerical results and rail movement, and explain the governing Physics equation. No complex train simulation, detailed structural engineering, or user account system is needed.

**Source of scope:** The submitted *Printable Form 1: Group Registration & System Choice Proposal*, Section II. The form specifies Visual Studio Code + Codex + JavaScript, a temperature range of 10–100°C, initial expansion joint gap of 0–15 mm, and steel/aluminum/copper material choices. The original performance task separately requires 3D motion, temperature-color visualization, orbit/zoom, and live outputs.

## 2. Success definition

A first-time visitor can change any of the three controls and see a coherent update to the 3D rail joint and calculated readings, with no instructions beyond short on-screen labels. Every displayed calculation matches the documented equation. The application is simple enough to run on one ordinary classroom laptop and explain in a short live demo.

## 3. Exactly three primary controls — locked scope

| # | Control | Input | Required output |
|---|---|---|---|
| 1 | **Thermal** | Rail temperature **T: 10–100°C** (slider) | Calculated thermal expansion **ΔL** in mm; rail heat visualization from cool blue toward warm red |
| 2 | **Mechanical / geometric** | Initial expansion joint gap **g₀: 0–15 mm** (slider) | Remaining joint gap **g** in mm; **Open / Closed** indicator |
| 3 | **Material** | Rail material dropdown: **Steel, Aluminum, Copper** | Updates expansion coefficient **α**, rail movement, and gap reading |

Material identity may use a blue/gray/orange label or swatch matching the proposal; **thermal blue-to-red coloring must still respond to temperature**, not be confused with material identity. Show material name and coefficient explicitly.

**Do not add rail-length, insulation, train-speed, or heat-flux sliders.** Rail length is fixed as a documented assumption, not a fourth interactive control.

## 4. Physics specification — keep it understandable

Use linear thermal expansion:

`ΔL = α × L₀ × (T − T₀)`

- `ΔL`: free expansion relative to reference temperature (m; display in mm)
- `α`: linear thermal expansion coefficient (1/°C)
- `L₀`: effective expanding rail length, fixed at **10 m**
- `T`: user-selected temperature (°C)
- `T₀`: fixed reference temperature **25°C**
- Fixed example coefficients: **Steel 12 × 10⁻⁶ /°C**, **Aluminum 23 × 10⁻⁶ /°C**, **Copper 17 × 10⁻⁶ /°C**. These are approximate reference values, not engineering-certified material data; cite a credible source in the final binder.

For a **simplified, freely expanding joint**, assume the combined closing movement at the joint is `ΔL`. Define the **signed remaining clearance** `g_raw = g₀ − ΔL_mm`, where `ΔL_mm = 1000 × ΔL`. Display physical gap `g = max(0, g_raw)` mm. Status is **Open** if `g_raw > 0`, otherwise **Closed / Insufficient clearance**. If `g_raw < 0`, explain that the free-expansion calculation exceeds the available gap and **does not calculate actual buckling, compression force, or real-world failure**. For `T < 25°C`, ΔL is negative (contraction) and the gap grows. At `T = 25°C`, ΔL is zero.

Do not apply thermodynamic gas laws, Carnot efficiency, or a full heat-flow solver; these do not directly describe the selected model. The existing school task requires applicable equations and validation; confirm any extra teacher expectations separately, rather than inventing unrelated Physics.

## 5. Required UI — single screen

**Layout:** Main interactive 3D railway scene with a small adjacent or below-the-scene control panel. A compact results panel shows:

- Selected temperature and material
- Expansion coefficient `α`
- Rail length assumption `L₀ = 10 m` and reference temperature `T₀ = 25°C`
- **Thermal expansion ΔL (mm)**, signed (positive for expansion, negative for contraction)
- **Remaining gap g (mm)**
- **Open / Closed** status
- Main formula plus a one-line plain-language interpretation

**3D scene:** Two adjacent rail ends at a joint, visible sleepers, a clear gap indicator, and basic lighting. Animate the rail-end movement when values change. Make small physical expansions visible using a **clearly labeled exaggerated visual scale** while keeping all numerical readings physically calculated. Include user-driven camera orbit and zoom. Visual temperature colors progress from cool blue to warm red; keep contrasting material identity in text or small swatches so they cannot mask the heat map.

**Animation:** Smooth rail movement and optional simple animated heat-flow arrows/particles to represent heat entering the rail; do not simulate real fluid flow. Treat animated heat-flow indicators as illustrative, not quantitative fluid physics.

**Accessibility:** Visible labels with units, keyboard-operable form controls, adequate text contrast, and a result status that is not communicated by color alone.

**Optional tiny conveniences:** Reset to defaults and short one-line usage instructions. No additional major screens.

## 6. Functional requirements and acceptance criteria

### FR-01 — App starts
Given the app is opened on a laptop browser, the user sees the 3D railway joint, all three controls, and initial results without sign-in or network-backed services.

### FR-02 — Temperature
When T changes anywhere between 10 and 100°C, the computed ΔL, gap, status, rail position, and thermal coloring update together.

### FR-03 — Joint gap
When g₀ changes between 0 and 15 mm, the gap and closure indicator update while ΔL stays unchanged, because gap does not alter free thermal expansion.

### FR-04 — Material
When the material changes between steel, aluminum and copper, α, ΔL, movement, and gap update. Material identity remains readable even during temperature coloring.

### FR-05 — Accurate Physics
The results follow the equations in §4, with dimensional conversions handled consistently, negative ΔL on cooling, and no fake pressure or force values.

### FR-06 — Camera and visual response
The scene can orbit and zoom. Changing T or material produces a visible, smooth rail movement and heat-color change. An explicit note says movement is exaggerated for clarity.

### FR-07 — Closure reporting
If signed clearance is ≤ 0, status reads Closed / Insufficient clearance, displayed physical gap is 0 mm, and the explanation avoids claiming that track buckling was computed.

### FR-08 — Teaching clarity
A short explanation identifies what α, L₀, T, T₀, ΔL and g₀ mean and explains the displayed result in everyday language.

### FR-09 — Verification
At least two sample calculations can be reproduced manually and checked with automated unit tests; the UI output matches within normal display rounding.

### FR-10 — Exhibit resilience
The app runs locally via documented start commands; it should not require an account, database, remote API, or paid asset. If 3D initialization fails, show a readable error rather than a blank page.

## 7. Two reference test cases

**Case A — steel, gap remains open**

- Inputs: Steel; T = 55°C; g₀ = 6 mm; L₀ = 10 m; T₀ = 25°C.
- ΔT = 30°C; ΔL = 12×10⁻⁶ × 10 × 30 m = **3.6 mm**.
- g_raw = 6 − 3.6 = **2.4 mm**; displayed g = **2.4 mm**; **Open**.

**Case B — aluminum, insufficient clearance**

- Inputs: Aluminum; T = 75°C; g₀ = 5 mm; L₀ = 10 m; T₀ = 25°C.
- ΔT = 50°C; ΔL = 23×10⁻⁶ × 10 × 50 m = **11.5 mm**.
- g_raw = 5 − 11.5 = **−6.5 mm**; displayed g = **0 mm**; **Closed / Insufficient clearance**.
- Do not animate physical overlap of rails or describe −6.5 mm as a real remaining gap.

**Edge checks:** Steel, T = 10°C, g₀ = 6 mm → ΔL = −1.8 mm, g = 7.8 mm, Open. At T = 25°C, ΔL = 0 for every material. At g₀ = 0 and T ≥ 25°C, status is Closed.

## 8. Minimal technical implementation

**Development tools (approved proposal):** Visual Studio Code, Codex, JavaScript.  
**Implementation choice:** Vite + **vanilla JavaScript** + **Three.js**. Use plain HTML/CSS for sliders, dropdown, results, and accessible labels.

Why: These tools directly support browser-based interactive 3D with minimal tooling. Avoid React, TypeScript, state-management libraries, physics-engine packages, CSS frameworks, and server endpoints unless a real blocker demands them.

Keep code small and understandable:

- `src/physics.js` — pure calculation function and material constants
- `src/scene.js` — basic Three.js railway scene, camera, animation
- `src/main.js` — UI inputs, events, linking calculated results to the scene
- `src/style.css` — one-page styling
- `tests/physics.test.js` — lightweight equation tests using Node's built-in test runner (or equivalently simple tool)

Use only basic 3D shapes (boxes/cylinders) for rails and sleepers; avoid imported 3D assets and advanced shading. No persistence is required.

## 9. Non-goals (explicitly out of scope)

- Multi-topic simulator, full railway network, moving trains, derailment or buckling prediction
- Finite element analysis, rail stress/force computations, or real fluid dynamics
- Full heat-transfer PDE solver, detailed thermodynamic cycles
- Login, accounts, database, backend, cloud services, analytics, multiplayer
- Export/report generation, administrative panels, tutorials with multiple pages
- Heavy 3D assets, photorealism, advanced particle engines, excessive animations

## 10. Smallest delivery plan

1. **Physics first:** `calculateRailState()` and automated test cases; simple controls and numbers, no 3D yet.
2. **One 3D scene:** rails, joint gap, orbit/zoom, motion, and heat colors wired to the same calculated state.
3. **Finish:** concise explanation, labels, graceful handling of closed gap, browser test, README with local run instructions and scientific assumptions.

No extra features until these pass acceptance tests.

## 11. Definition of done

- All three submitted proposal controls work with the stated options and ranges.
- Outputs are correct for both worked examples and edge checks.
- 3D rails visibly respond, camera orbits/zooms, heat colors reflect T, measurements update immediately.
- Clear Open/Closed status and no misleading negative physical gap.
- Code is readable, dependencies minimal, works in a standard laptop browser.
- README states how to run, how formulas work, assumptions, and animation scale caveat.
- Documentation shows the use of Codex/AI when preparing the assignment's required AI declaration.

## 12. Open assumption, not a blocker for MVP

The proposal contains a teacher signature and favorable remarks, though its **APPROVED checkbox is not visibly checked**. Treat the user-supplied proposal as the scope baseline; do not present the checkbox as marked in artifacts. The original task mentions “fluid animations,” which is not literally applicable to solid rails. The simulator will use smooth rail motion and illustrative animated heat-flow indicators; confirm this interpretation with the teacher as needed. The task's broader binder and exhibit deliverables remain separate from building the app.

## 13. Codex / SDLC Studio instruction

Treat §3, §4 and §6 as fixed acceptance criteria. Build with JavaScript and Three.js, prioritize one working demonstrable scene, and create the smallest useful stories. Do not invent new controls or complex subsystems. Implement and verify calculations first, then add the visual scene. Mark as complete only after the two manual examples and required interactions pass. Where available, use SDLC Studio's lightweight profile to avoid unnecessary workflow overhead.
