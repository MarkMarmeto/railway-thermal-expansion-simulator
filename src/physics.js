const RAIL_LENGTH_M = 10;
const REFERENCE_TEMPERATURE_C = 25;

const MATERIALS = Object.freeze({
  steel: Object.freeze({ name: 'Steel', coefficientPerC: 12e-6 }),
  aluminum: Object.freeze({ name: 'Aluminum', coefficientPerC: 23e-6 }),
  copper: Object.freeze({ name: 'Copper', coefficientPerC: 17e-6 }),
});

function assertFiniteNumber(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${label} must be a finite number`);
  }
}

function assertRange(value, label, minimum, maximum) {
  assertFiniteNumber(value, label);
  if (value < minimum || value > maximum) {
    throw new RangeError(`${label} must be between ${minimum} and ${maximum}`);
  }
}

function calculateRailState({ material, temperatureC, initialGapMm }) {
  if (!Object.prototype.hasOwnProperty.call(MATERIALS, material)) {
    throw new RangeError(`Unknown material: ${material}`);
  }

  assertRange(temperatureC, 'temperature', 10, 100);
  assertRange(initialGapMm, 'gap', 0, 15);

  const coefficientPerC = MATERIALS[material].coefficientPerC;
  const deltaTemperatureC = temperatureC - REFERENCE_TEMPERATURE_C;
  const expansionMm = Number((coefficientPerC * RAIL_LENGTH_M * deltaTemperatureC * 1000).toFixed(10));
  const signedGapMm = Number((initialGapMm - expansionMm).toFixed(10));
  const remainingGapMm = Math.max(0, signedGapMm);

  return Object.freeze({
    material,
    materialName: MATERIALS[material].name,
    coefficientPerC,
    temperatureC,
    initialGapMm,
    railLengthM: RAIL_LENGTH_M,
    referenceTemperatureC: REFERENCE_TEMPERATURE_C,
    deltaTemperatureC,
    expansionMm,
    signedGapMm,
    remainingGapMm,
    status: signedGapMm > 0 ? 'Open' : 'Closed/Insufficient clearance',
  });
}

const api = {
  MATERIALS,
  RAIL_LENGTH_M,
  REFERENCE_TEMPERATURE_C,
  calculateRailState,
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = api;
} else {
  globalThis.RailwayPhysics = api;
}
