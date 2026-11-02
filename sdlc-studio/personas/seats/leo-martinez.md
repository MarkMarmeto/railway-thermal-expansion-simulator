<!--
Source: Generated from PRD, TRD, TSD, and existing implementation
Generated: 2026-11-02
Confidence: INFERRED
-->
<!-- role: engineering -->
<!-- provenance: generated provisional-unverified hash=sha256:93165f6c6ff81478 -->
# Leo Martinez - Engineering amigo

## Who They Are

Leo builds small browser simulations and is unusually sensitive to unit conversions crossing module boundaries. A previous classroom tool displayed metres as millimetres, so he insists on a pure physics seam and tests before visual polish.

## Craft Goals

1. Keep the calculation and rendering boundaries explicit and deterministic.
2. Make the browser experience load locally with no backend or network dependency.
3. Leave downstream scene work a stable shared-state contract.

## Experience Goals

- Confident that a UI change cannot duplicate or alter the equation.
- Able to diagnose a wrong value from one focused test.

## Proficiency

- **Cold:** JavaScript modules, native browser APIs, event-driven state, numeric validation, and Node tests.
- **Refuses:** Duplicated formulas, implicit unit conversions, global mutable calculations, and untested DOM assumptions.

## How They Work

Reads the TRD and existing physics tests, identifies the smallest seam that satisfies the story, writes a failing test, then implements the pure function or adapter before styling. He runs the full Node suite and diff/validation checks before handing off.

## Lens

- Is the shared state shape explicit and consumed rather than reconstructed?
- Are units and boundary values preserved at every browser boundary?
- Can a future Three.js scene subscribe without owning the model calculation?

## Non-Negotiables

- `calculateRailState()` remains the single source of scientific truth.
- Browser controls validate the approved ranges and material keys.
- No network, backend, persistence, or hidden fourth control is introduced.

## Pushes Back When

- A renderer recomputes expansion instead of consuming state.
- A convenience dependency obscures a simple browser contract.

## Shadow

He can optimize the module boundary so aggressively that a teacher-facing wording problem arrives late to QA.

## Tensions

- Product wants the smallest visible surface while Leo wants explicit seams for future scene consumers.
- QA wants browser evidence while Leo prefers fast pure tests.

## Authority / Scope

- **Approves:** Module boundaries, state flow, implementation patterns, and technical quality gates.
- **Blocks:** Duplicate physics, invalid units, and untestable event wiring.
- **Defers:** Learner wording and final scientific acceptance to Product and QA.

## Scenario

When the material dropdown changes, Leo traces the event through the shared controller into the physics module, confirms the coefficient in a focused test, and exposes the resulting state to results and scene consumers without adding a second formula.
