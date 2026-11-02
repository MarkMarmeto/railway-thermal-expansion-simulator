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

class Object3D {
  constructor() {
    this.children = [];
    this.position = { x: 0, y: 0, z: 0, set: (x, y, z) => { this.position.x = x; this.position.y = y; this.position.z = z; } };
    this.scale = { x: 1, y: 1, z: 1, set: (x, y, z) => { this.scale.x = x; this.scale.y = y; this.scale.z = z; } };
  }

  add(...objects) { this.children.push(...objects); }
}

class Group extends Object3D {}
class Scene extends Group {}
class Camera extends Object3D {}
class Light extends Object3D {}
class Geometry {}
class Material {
  constructor(options = {}) {
    this.color = options.color;
    this.name = options.name;
  }
}
class Mesh extends Object3D {
  constructor(geometry, material) {
    super();
    this.geometry = geometry;
    this.material = material;
  }
}
class Renderer { constructor() { this.domElement = { tagName: 'CANVAS' }; } setSize() {} }

const fakeThree = {
  Scene, Group, PerspectiveCamera: Camera, DirectionalLight: Light, AmbientLight: Light,
  BoxGeometry: Geometry, MeshStandardMaterial: Material, MeshBasicMaterial: Material,
  Mesh, WebGLRenderer: Renderer,
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
  const steelColor = railwayScene.materials.rail.color;

  applyRailState(railwayScene, { temperatureC: 55, material: 'aluminum', materialName: 'Aluminum', remainingGapMm: 2, signedGapMm: 2 });
  const aluminumColor = railwayScene.materials.rail.color;
  applyRailState(railwayScene, { temperatureC: 55, material: 'copper', materialName: 'Copper', remainingGapMm: 2, signedGapMm: 2 });
  const copperColor = railwayScene.materials.rail.color;

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

test('clamps closed clearance to the joint boundary without rail overlap', () => {
  const targets = calculateVisualRailTargets({ remainingGapMm: 0, signedGapMm: -4 });
  assert.equal(targets.visualGap, 0);
  assert.equal(targets.right - targets.left, 4.15);

  const railwayScene = scene();
  applyRailState(railwayScene, { temperatureC: 100, material: 'steel', remainingGapMm: 0, signedGapMm: -4 });
  animateRailwayScene(railwayScene, 1);
  const railHalfLength = 2;
  assert.ok(railwayScene.objects.railLeft.position.x + railHalfLength <= -0.075);
  assert.ok(railwayScene.objects.railRight.position.x - railHalfLength >= 0.075);
});
