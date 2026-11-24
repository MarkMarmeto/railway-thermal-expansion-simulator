const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createRailwayScene,
  applyRailState,
  animateRailwayScene,
  temperatureToColor,
  calculateVisualRailTargets,
  MATERIAL_CUES,
} = require('../src/scene');

class Renderer { constructor() { this.domElement = { tagName: 'CANVAS' }; } setSize() {} }

const fakeThree = {
  ...require('three'),
  WebGLRenderer: Renderer,
};

function scene() {
  return createRailwayScene(fakeThree, { appendChild() {} });
}

test('moves rail ends smoothly toward expansion-driven targets without mutating physics state', () => {
  const railwayScene = scene();
  const state = { temperatureC: 100, material: 'steel', materialName: 'Steel', expansionMm: 9, remainingGapMm: 1.5, signedGapMm: 1.5 };
  const before = { ...state };
  const initialX = railwayScene.objects.railLeft.position.x;

  applyRailState(railwayScene, state);
  const target = railwayScene.animation.targetPositions.left;
  assert.notEqual(initialX, target);
  assert.notEqual(railwayScene.objects.railLeft.position.x, target);

  animateRailwayScene(railwayScene, 0.5);
  assert.ok(railwayScene.objects.railLeft.position.x > Math.min(initialX, target));
  assert.ok(railwayScene.objects.railLeft.position.x < Math.max(initialX, target));
  assert.deepEqual(state, before);
});

test('maps supported temperatures from cool blue to warm red and clamps outliers', () => {
  const cold = temperatureToColor(10);
  const middle = temperatureToColor(55);
  const hot = temperatureToColor(100);
  assert.ok(cold.b > cold.r);
  assert.ok(hot.r > hot.b);
  assert.ok(middle.r > cold.r && middle.b < cold.b);
  assert.deepEqual(temperatureToColor(0), cold);
  assert.deepEqual(temperatureToColor(120), hot);
});

test('keeps material identity separate from heat color', () => {
  const railwayScene = scene();
  applyRailState(railwayScene, { temperatureC: 55, material: 'aluminum', materialName: 'Aluminum', remainingGapMm: 2, signedGapMm: 2 });
  assert.equal(railwayScene.materialCue.label, MATERIAL_CUES.aluminum.label);
  assert.ok(railwayScene.materialCue.swatch);
  const colorAtMidpoint = railwayScene.animation.heatColor;

  applyRailState(railwayScene, { temperatureC: 55, material: 'steel', materialName: 'Steel', remainingGapMm: 2, signedGapMm: 2 });
  assert.equal(railwayScene.materialCue.label, MATERIAL_CUES.steel.label);
  assert.deepEqual(railwayScene.animation.heatColor, colorAtMidpoint);
});

test('changes the rail appearance for each supported material', () => {
  const railwayScene = scene();
  applyRailState(railwayScene, { temperatureC: 55, material: 'steel', materialName: 'Steel', remainingGapMm: 2, signedGapMm: 2 });
  const steelColor = railwayScene.materials.rail.color.getHex();

  applyRailState(railwayScene, { temperatureC: 55, material: 'aluminum', materialName: 'Aluminum', remainingGapMm: 2, signedGapMm: 2 });
  const aluminumColor = railwayScene.materials.rail.color.getHex();
  applyRailState(railwayScene, { temperatureC: 55, material: 'copper', materialName: 'Copper', remainingGapMm: 2, signedGapMm: 2 });
  const copperColor = railwayScene.materials.rail.color.getHex();

  assert.notEqual(steelColor, aluminumColor);
  assert.notEqual(aluminumColor, copperColor);
  assert.notEqual(steelColor, copperColor);
});

test('restores a strong red rail tint when the physical gap closes', () => {
  const railwayScene = scene();
  applyRailState(railwayScene, { temperatureC: 75, material: 'aluminum', materialName: 'Aluminum', remainingGapMm: 2, signedGapMm: 2 });
  const openColor = railwayScene.animation.appearanceColor;

  applyRailState(railwayScene, { temperatureC: 75, material: 'aluminum', materialName: 'Aluminum', remainingGapMm: 0, signedGapMm: -2 });
  const closedColor = railwayScene.animation.appearanceColor;

  assert.ok(closedColor.r > closedColor.b);
  assert.ok(closedColor.r > openColor.r);
  assert.ok(closedColor.b < openColor.b);
});

test('closed rail ends meet exactly without a spacer or overlap', () => {
  const targets = calculateVisualRailTargets({ remainingGapMm: 0, signedGapMm: -4 });
  assert.equal(targets.visualGap, 0);
  assert.equal(targets.right - targets.left, 4);

  const railwayScene = scene();
  applyRailState(railwayScene, { temperatureC: 100, material: 'steel', remainingGapMm: 0, signedGapMm: -4 });
  animateRailwayScene(railwayScene, 1);
  const railHalfLength = 2;
  assert.equal(railwayScene.objects.railLeft.position.x + railHalfLength, 0);
  assert.equal(railwayScene.objects.railRight.position.x - railHalfLength, 0);
});

test('preserves small positive gaps instead of subtracting expansion twice', () => {
  const { calculateRailState } = require('../src/physics');
  const state = calculateRailState({ material: 'steel', temperatureC: 69, initialGapMm: 5.5 });
  const targets = calculateVisualRailTargets(state);
  assert.equal(targets.visualGap, 0.22);
  assert.ok(Math.abs((targets.right - 2) - (targets.left + 2) - 0.022) < 1e-12);
});

test('contact has no bending; excess expansion bends matching rail ends and cooling restores them', () => {
  const railwayScene = scene();
  const { railLeft, railRight, compressionArrows } = railwayScene.objects;
  const original = Array.from(railLeft.geometry.attributes.position.array);
  const update = signedGapMm => {
    applyRailState(railwayScene, { material: 'steel', temperatureC: 75, signedGapMm, remainingGapMm: Math.max(0, signedGapMm) });
    animateRailwayScene(railwayScene, 1);
  };
  update(0);
  assert.equal(railwayScene.animation.bend, 0);
  assert.equal(compressionArrows.visible, false);
  update(-2);
  const mildBend = railwayScene.animation.bend;
  assert.ok(mildBend > 0);
  assert.equal(compressionArrows.visible, true);
  update(-10);
  assert.ok(railwayScene.animation.bend > mildBend);
  const endpoint = (rail, x) => {
    const points = rail.geometry.attributes.position;
    const zs = [];
    for (let i = 0; i < points.count; i += 1) {
      if (points.getX(i) === x) zs.push(points.getZ(i));
    }
    return [...new Set(zs)].sort();
  };
  assert.deepEqual(endpoint(railLeft, 2), endpoint(railRight, -2));
  assert.deepEqual(endpoint(railLeft, -2), [-0.125, 0.125]);
  update(4);
  assert.equal(railwayScene.animation.bend, 0);
  assert.equal(compressionArrows.visible, false);
  assert.deepEqual(Array.from(railLeft.geometry.attributes.position.array), original);
  assert.ok(railLeft.position.x + 2 < railRight.position.x - 2);
});
