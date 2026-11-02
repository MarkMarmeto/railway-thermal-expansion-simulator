# Railway Thermal Expansion Simulator

A local browser exhibit that demonstrates how temperature-driven rail expansion changes the clearance at a railway joint. The numerical model is intentionally small and explainable; the 3D scene communicates the idea but is not an engineering analysis.

## Run locally

From the repository root, install dependencies and start the static app:

```bash
npm install
npm run start
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173) in a browser. Stop the local server with `Ctrl-C`.

Run the checks from the repository root:

```bash
npm test
npm run test:e2e
npm run test:e2e:accessibility
npm run test:e2e:failure
```

The app is a static browser shell. It has no sign-in, backend, persistence, or cloud service requirement. Three.js is vendored under `vendor/three/`, so the visualization does not require internet access at runtime. The local server is the same Node static-server pattern used by the Playwright browser tests.

## Approved thermal-expansion model

The simulator uses the linear expansion equation:

```text
ΔL = α × L₀ × (T − T₀)
```

Where:

- `ΔL` is rail expansion, reported in millimetres.
- `α` is the material coefficient of linear expansion per °C.
- `L₀` is the fixed original rail length: **10 m**.
- `T` is the selected temperature in °C.
- `T₀` is the fixed reference temperature: **25 °C**.
- `g₀` is the selected initial joint gap in millimetres.

The implementation uses these approximate coefficients:

| Material | Coefficient `α` |
| --- | ---: |
| Steel | 12 × 10⁻⁶ /°C |
| Aluminum | 23 × 10⁻⁶ /°C |
| Copper | 17 × 10⁻⁶ /°C |

The values are representative approximations based primarily on the [NOAA/PMEL Metrology Handbook coefficient table](https://www.pmel.org/index_htm_files/met-hdbk.pdf), with the [Engineering Toolbox linear thermal-expansion table](https://www.engineeringtoolbox.com/thermal-expansion-metals-d_859.html) as a secondary readable reference. Actual coefficients vary with alloy, composition, temperature range, and source; these rounded values are not a material certification.

The signed clearance is calculated as:

```text
signed gap = g₀ − ΔL
physical gap = max(0, signed gap)
```

`Open` means the signed gap remains positive. `Closed / Insufficient clearance` means expansion reaches or exceeds the selected initial gap; the physical gap is displayed as zero while the signed gap preserves the amount of overrun in the simplified model.

## Scope and non-goals

This exhibit reports thermal expansion and joint clearance only. It does **not** calculate buckling, compression force, stress, rail restraint, track geometry, material failure, or real-world safety decisions. It is an educational visualization, not an engineering design or inspection tool.

The rail movement in the 3D scene is illustrative and visually exaggerated; it is **not drawn to physical scale**. Any heat-flow arrows or particles are illustrative and **non-quantitative**. Numerical readings come from the fixed model above, not from measuring the rendered scene.

## Assignment declaration

This project was developed and documented with assistance from OpenAI Codex/AI. The human-directed scope, approved assumptions, review decisions, and final verification remain the responsibility of the project author.
