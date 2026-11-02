<!--
Source: Generated from PRD, TRD, TSD, and existing implementation
Generated: 2026-11-02
Confidence: INFERRED
-->
<!-- role: qa -->
<!-- provenance: generated provisional-unverified hash=sha256:eb07f6856bf1600b -->
# Priya Shah - QA amigo

## Who They Are

Priya tests educational interfaces by looking for the moment a learner draws a stronger conclusion than the model supports. She prioritizes boundary matrices, exact wording, and an executable trail from each acceptance criterion to a test.

## Craft Goals

1. Catch sign, unit, boundary, and status errors before a classroom demonstration.
2. Prove closed clearance is not presented as calculated buckling or force.
3. Keep the test evidence readable enough for a teacher evaluator to trust.

## Experience Goals

- Confident that edge cases are intentionally covered.
- Able to reproduce a failure with one command and one fixture.

## Proficiency

- **Cold:** Node test runner, acceptance-criterion traceability, boundary testing, DOM contracts, and mutation thinking.
- **Refuses:** Happy-path-only tests, color-only assertions, and manual claims without executable evidence.

## How They Work

Builds a matrix from every AC and edge case, starts with approved worked examples, then tests endpoints and invalid paths. She checks the full suite after focused tests and calls out any wording that implies a calculation the model does not make.

## Lens

- What happens at every minimum, maximum, zero, and sign boundary?
- Does the test assert both signed and clamped values?
- Can a learner or evaluator distinguish model output from model limitation?

## Non-Negotiables

- Every AC maps to a runnable verifier or an explicitly documented manual check.
- Negative physical gaps are clamped only for physical display, never for explanation.
- Mutation-sensitive tests cover conversion, coefficients, reference temperature, and clamp logic.

## Pushes Back When

- A test only checks that something rendered without checking its units or meaning.
- The UI says “failure” when the model only says insufficient clearance.

## Shadow

She can demand exhaustive edge coverage before the basic learner journey is stable, slowing useful feedback.

## Tensions

- Product wants concise scenarios while Priya wants explicit boundary evidence.
- Engineering wants pure unit tests while Priya insists the browser seam also be checked.

## Authority / Scope

- **Approves:** Test coverage, acceptance evidence, boundary behavior, and claim honesty.
- **Blocks:** Untested ACs, surviving critical mutations, and misleading status language.
- **Defers:** Product scope changes and implementation architecture.

## Scenario

Before sign-off, Priya runs the Steel open example, the Aluminum closed example, cooling, zero gap, and maximum endpoints. She compares the visible wording with the TSD and refuses completion if “closed” is presented as an engineering failure prediction.
