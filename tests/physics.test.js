const test = require('node:test');
const assert = require('node:assert/strict');

const {
  MATERIALS,
  RAIL_LENGTH_M,
  REFERENCE_TEMPERATURE_C,
  calculateRailState,
} = require('../src/physics');

test('calculates the approved Steel expansion example', () => {
  const result = calculateRailState({
    material: 'steel',
    temperatureC: 55,
    initialGapMm: 6,
  });

  assert.equal(result.expansionMm, 3.6);
  assert.equal(result.signedGapMm, 2.4);
  assert.equal(result.remainingGapMm, 2.4);
  assert.equal(result.status, 'Open');
});

test('clamps a physically closed Aluminum joint at zero', () => {
  const result = calculateRailState({
    material: 'aluminum',
    temperatureC: 75,
    initialGapMm: 5,
  });

  assert.equal(result.expansionMm, 11.5);
  assert.equal(result.signedGapMm, -6.5);
  assert.equal(result.remainingGapMm, 0);
  assert.equal(result.status, 'Closed/Insufficient clearance');
});

test('represents cooling as negative expansion while preserving an open gap', () => {
  const result = calculateRailState({
    material: 'steel',
    temperatureC: 10,
    initialGapMm: 6,
  });

  assert.equal(result.expansionMm, -1.8);
  assert.equal(result.signedGapMm, 7.8);
  assert.equal(result.remainingGapMm, 7.8);
  assert.equal(result.status, 'Open');
});

test('has zero expansion at the reference temperature for every approved material', () => {
  for (const material of Object.keys(MATERIALS)) {
    const result = calculateRailState({ material, temperatureC: REFERENCE_TEMPERATURE_C, initialGapMm: 4 });
    assert.equal(result.expansionMm, 0);
    assert.equal(result.signedGapMm, 4);
    assert.equal(result.remainingGapMm, 4);
  }
});

test('does not produce a negative physical gap when the initial gap is zero', () => {
  const result = calculateRailState({ material: 'copper', temperatureC: 100, initialGapMm: 0 });
  assert.ok(result.signedGapMm < 0);
  assert.equal(result.remainingGapMm, 0);
  assert.equal(result.status, 'Closed/Insufficient clearance');
});

test('supports the complete approved input boundary', () => {
  const result = calculateRailState({ material: 'copper', temperatureC: 100, initialGapMm: 15 });
  assert.equal(result.temperatureC, 100);
  assert.equal(result.initialGapMm, 15);
  assert.equal(result.railLengthM, RAIL_LENGTH_M);
  assert.ok(Number.isFinite(result.remainingGapMm));
  assert.ok(result.remainingGapMm >= 0);
});

test('uses distinct approved coefficients and the metre-to-millimetre conversion', () => {
  assert.equal(MATERIALS.steel.coefficientPerC, 12e-6);
  assert.equal(MATERIALS.aluminum.coefficientPerC, 23e-6);
  assert.equal(MATERIALS.copper.coefficientPerC, 17e-6);

  const result = calculateRailState({ material: 'copper', temperatureC: 35, initialGapMm: 10 });
  assert.equal(result.deltaTemperatureC, 10);
  assert.equal(result.expansionMm, 1.7);
});

test('rejects unknown materials and out-of-range controls', () => {
  assert.throws(() => calculateRailState({ material: 'iron', temperatureC: 25, initialGapMm: 1 }), /material/i);
  assert.throws(() => calculateRailState({ material: 'steel', temperatureC: 9, initialGapMm: 1 }), /temperature/i);
  assert.throws(() => calculateRailState({ material: 'steel', temperatureC: 25, initialGapMm: 16 }), /gap/i);
});
