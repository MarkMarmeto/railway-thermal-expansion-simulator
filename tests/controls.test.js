const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const {
  CONTROL_IDS,
  createSimulatorController,
} = require('../src/main');

function elements(values) {
  return {
    temperature: { value: String(values.temperatureC) },
    initialGap: { value: String(values.initialGapMm) },
    material: { value: values.material },
  };
}

test('the page declares exactly the three approved primary controls', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const primaryControls = [...html.matchAll(/data-primary-control/g)];

  assert.equal(primaryControls.length, 3);
  assert.match(html, /id="temperatureC"[^>]*type="range"[^>]*min="10"[^>]*max="100"/);
  assert.match(html, /id="initialGapMm"[^>]*type="range"[^>]*min="0"[^>]*max="15"/);
  assert.match(html, /id="material"[^>]*>[^]*value="steel"[^]*value="aluminum"[^]*value="copper"/);
  assert.deepEqual(CONTROL_IDS, {
    temperature: 'temperatureC',
    initialGap: 'initialGapMm',
    material: 'material',
  });
});

test('temperature endpoint values update shared state and recalculate', () => {
  const states = [];
  const controller = createSimulatorController(elements({ temperatureC: 25, initialGapMm: 6, material: 'steel' }), state => states.push(state));

  controller.elements.temperature.value = '10';
  controller.recompute();
  assert.equal(controller.state.temperatureC, 10);
  assert.equal(controller.state.expansionMm, -1.8);

  controller.elements.temperature.value = '100';
  controller.recompute();
  assert.equal(controller.state.temperatureC, 100);
  assert.equal(controller.state.expansionMm, 9);
  assert.equal(states.length, 3);
});

test('minimum and maximum gap values update state without changing expansion', () => {
  const controller = createSimulatorController(elements({ temperatureC: 55, initialGapMm: 6, material: 'steel' }), () => {});
  const expansion = controller.state.expansionMm;

  controller.elements.initialGap.value = '0';
  controller.recompute();
  assert.equal(controller.state.initialGapMm, 0);
  assert.equal(controller.state.expansionMm, expansion);

  controller.elements.initialGap.value = '15';
  controller.recompute();
  assert.equal(controller.state.initialGapMm, 15);
  assert.equal(controller.state.expansionMm, expansion);
});

test('material selection maps to each approved coefficient', () => {
  const controller = createSimulatorController(elements({ temperatureC: 55, initialGapMm: 6, material: 'steel' }), () => {});

  for (const [material, coefficient] of [['steel', 12e-6], ['aluminum', 23e-6], ['copper', 17e-6]]) {
    controller.elements.material.value = material;
    controller.recompute();
    assert.equal(controller.state.material, material);
    assert.equal(controller.state.coefficientPerC, coefficient);
  }
});

test('slider values are converted to numbers before physics is called', () => {
  const controller = createSimulatorController(elements({ temperatureC: 75, initialGapMm: 5, material: 'aluminum' }), () => {});
  assert.equal(typeof controller.state.temperatureC, 'number');
  assert.equal(typeof controller.state.initialGapMm, 'number');
  assert.equal(controller.state.signedGapMm, -6.5);
});
