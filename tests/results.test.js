const test = require('node:test');
const assert = require('node:assert/strict');

const { calculateRailState } = require('../src/physics');
const {
  formatRailResults,
  renderResultsPanel,
  renderSceneFailure,
} = require('../src/main');

test('formats all required open-state values with units and assumptions', () => {
  const result = formatRailResults(calculateRailState({
    material: 'steel',
    temperatureC: 55,
    initialGapMm: 6,
  }));

  assert.match(result.summary, /Temperature: 55 °C/);
  assert.match(result.summary, /Material: Steel/);
  assert.match(result.summary, /α: 0\.000012 \/°C/);
  assert.match(result.summary, /L₀: 10 m/);
  assert.match(result.summary, /T₀: 25 °C/);
  assert.match(result.summary, /Expansion: 3\.6 mm/);
  assert.match(result.summary, /Signed gap: 2\.4 mm/);
  assert.match(result.summary, /Physical gap: 2\.4 mm/);
  assert.match(result.summary, /Status: Open/);
});

test('formats closed state with zero physical gap and preserved signed gap', () => {
  const result = formatRailResults(calculateRailState({
    material: 'aluminum',
    temperatureC: 75,
    initialGapMm: 5,
  }));

  assert.match(result.summary, /Signed gap: -6\.5 mm/);
  assert.match(result.summary, /Physical gap: 0 mm/);
  assert.match(result.summary, /Status: Closed \/ Insufficient clearance/);
});

test('explains the approved formula and every required variable', () => {
  const result = formatRailResults(calculateRailState({
    material: 'steel',
    temperatureC: 55,
    initialGapMm: 6,
  }));

  assert.match(result.explanation, /ΔL = α × L₀ × \(T − T₀\)/);
  for (const variable of ['α', 'L₀', 'T', 'T₀', 'ΔL', 'g₀']) {
    assert.match(result.explanation, new RegExp(variable));
  }
  assert.match(result.explanation, /10 m/);
  assert.match(result.explanation, /25 °C/);
});

test('states unsupported analyses are not calculated without claiming them', () => {
  const result = formatRailResults(calculateRailState({
    material: 'aluminum',
    temperatureC: 75,
    initialGapMm: 5,
  }));

  assert.match(result.limitations, /not calculated/i);
  assert.match(result.limitations, /buckling/i);
  assert.match(result.limitations, /compression force/i);
  assert.match(result.limitations, /real-world failure/i);
  assert.doesNotMatch(result.explanation, /buckling occurred|force was calculated|failure occurred/i);
});

test('renders formatted results into the semantic result regions', () => {
  const nodes = {
    summary: { textContent: '' },
    explanation: { textContent: '' },
    limitations: { textContent: '' },
  };
  renderResultsPanel(nodes, calculateRailState({ material: 'copper', temperatureC: 35, initialGapMm: 10 }));
  assert.match(nodes.summary.textContent, /Material: Copper/);
  assert.match(nodes.explanation.textContent, /ΔL/);
  assert.match(nodes.limitations.textContent, /not calculated/i);
});

test('renders a readable scene failure without replacing the result shell', () => {
  const node = { textContent: '', className: 'scene-status', dataset: {} };
  renderSceneFailure(node, new Error('Renderer unavailable'));
  assert.match(node.textContent, /3D scene unavailable/);
  assert.match(node.textContent, /Renderer unavailable/);
  assert.equal(node.className, 'scene-status error');
  assert.equal(node.dataset.state, 'error');
});
