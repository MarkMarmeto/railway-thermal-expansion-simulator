const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const { createRailwayScene, applyRailState } = require('../src/scene');

class Object3D {
  constructor() {
    this.children = [];
    this.position = { set: (...values) => { this.position.values = values; } };
    this.scale = { set: (...values) => { this.scale.values = values; } };
  }

  add(...objects) { this.children.push(...objects); }
}

class Group extends Object3D {}
class Scene extends Group {}
class Camera extends Object3D {}
class Light extends Object3D {}
class Geometry {}
class Material {}
class Mesh extends Object3D {
  constructor(geometry, material) {
    super();
    this.geometry = geometry;
    this.material = material;
  }
}
class Renderer {
  constructor() { this.domElement = { tagName: 'CANVAS' }; }
  setPixelRatio() {}
  setSize() {}
  render() {}
}

const fakeThree = {
  Scene,
  Group,
  PerspectiveCamera: Camera,
  DirectionalLight: Light,
  AmbientLight: Light,
  BoxGeometry: Geometry,
  CylinderGeometry: Geometry,
  MeshStandardMaterial: Material,
  MeshBasicMaterial: Material,
  Mesh,
  WebGLRenderer: Renderer,
  Color: class {},
};

function flatten(root) {
  return [root, ...root.children.flatMap(flatten)];
}

test('initializes rails, joint, sleepers, gap indicator, camera, and lighting', () => {
  const mount = { appendChild(node) { this.node = node; } };
  const result = createRailwayScene(fakeThree, mount);
  const names = flatten(result.scene).map(object => object.name).filter(Boolean);

  assert.ok(names.includes('rail-left'));
  assert.ok(names.includes('rail-right'));
  assert.ok(names.includes('joint'));
  assert.ok(names.includes('sleepers'));
  assert.ok(names.includes('gap-indicator'));
  assert.equal(result.camera.constructor, Camera);
  assert.ok(result.lights.length >= 2);
  assert.equal(mount.node.tagName, 'CANVAS');
});

test('uses primitive geometry and no imported model or physics engine', () => {
  const source = fs.readFileSync('src/scene.js', 'utf8');
  assert.match(source, /BoxGeometry/);
  assert.doesNotMatch(source, /GLTFLoader|OBJLoader|Ammo|Cannon|Rapier|fetch\(/i);
});

test('applies shared physical gap state without recalculating expansion', () => {
  const result = createRailwayScene(fakeThree, { appendChild() {} });
  const source = fs.readFileSync('src/scene.js', 'utf8');
  const openState = { remainingGapMm: 2.4, signedGapMm: 2.4, status: 'Open' };
  const closedState = { remainingGapMm: 0, signedGapMm: -6.5, status: 'Closed/Insufficient clearance' };

  applyRailState(result, openState);
  assert.ok(result.objects.gapIndicator.scale.values[0] > 0);
  applyRailState(result, closedState);
  assert.deepEqual(result.objects.gapIndicator.scale.values, [0, 1, 1]);
  assert.doesNotMatch(source, /12e-6|23e-6|17e-6|α\s*[×*]\s*L₀|calculateRailState/);
});
