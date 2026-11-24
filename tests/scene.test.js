const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const { createRailwayScene, applyRailState } = require('../src/scene');

class Renderer {
  constructor() { this.domElement = { tagName: 'CANVAS' }; }
  setPixelRatio() {}
  setSize() {}
  render() {}
}

const fakeThree = {
  ...require('three'),
  WebGLRenderer: Renderer,
};

function flatten(root) {
  return [root, ...root.children.flatMap(flatten)];
}

test('initializes rails in an outdoor environment without an overhead gap bar', () => {
  const mount = { appendChild(node) { this.node = node; } };
  const result = createRailwayScene(fakeThree, mount);
  const names = flatten(result.scene).map(object => object.name).filter(Boolean);

  assert.ok(names.includes('rail-left'));
  assert.ok(names.includes('rail-right'));
  assert.ok(names.includes('joint'));
  assert.ok(names.includes('sleepers'));
  assert.ok(!names.includes('gap-indicator'));
  assert.ok(names.includes('terrain'));
  assert.ok(names.includes('ballast'));
  assert.ok(result.scene.background);
  assert.ok(result.scene.fog);
  assert.ok(result.camera.isPerspectiveCamera);
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
  const openTarget = result.animation.targetPositions.left;
  applyRailState(result, closedState);
  assert.ok(result.animation.targetPositions.left > openTarget);
  assert.doesNotMatch(source, /12e-6|23e-6|17e-6|α\s*[×*]\s*L₀|calculateRailState/);
});
