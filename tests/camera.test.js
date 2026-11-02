const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const {
  createCameraInteraction,
  orbitCamera,
  zoomCamera,
  CAMERA_BOUNDS,
} = require('../src/scene');

class Camera {
  constructor() {
    this.position = { x: 0, y: 4, z: 8, set: (x, y, z) => { this.position.x = x; this.position.y = y; this.position.z = z; } };
    this.lookAtTarget = null;
  }

  lookAt(...target) { this.lookAtTarget = target; }
}

class Mount {
  constructor() { this.listeners = {}; }
  addEventListener(type, listener) { this.listeners[type] = listener; }
  removeEventListener() {}
  dispatch(type, event) { this.listeners[type](event); }
  setPointerCapture(pointerId) { this.capturedPointer = pointerId; }
  releasePointerCapture(pointerId) { this.releasedPointer = pointerId; }
}

test('pointer drag orbits around the railway joint within angle bounds', () => {
  const camera = new Camera();
  const mount = new Mount();
  const interaction = createCameraInteraction(camera, mount);
  const initialAzimuth = interaction.state.azimuth;

  mount.dispatch('pointerdown', { clientX: 100, clientY: 100, pointerId: 7 });
  mount.dispatch('pointermove', { clientX: 140, clientY: 80, pointerId: 7 });
  mount.dispatch('pointerup', { pointerId: 7 });

  assert.notEqual(interaction.state.azimuth, initialAzimuth);
  assert.ok(interaction.state.polarAngle >= CAMERA_BOUNDS.minPolarAngle);
  assert.ok(interaction.state.polarAngle <= CAMERA_BOUNDS.maxPolarAngle);
  assert.deepEqual(interaction.target, { x: 0, y: 0.55, z: 0 });
  assert.equal(mount.capturedPointer, 7);
  assert.equal(mount.releasedPointer, 7);
});

test('zoom changes radius but clamps extreme wheel input', () => {
  const camera = new Camera();
  const interaction = createCameraInteraction(camera, new Mount());
  const initialRadius = interaction.state.radius;

  zoomCamera(interaction, -100000);
  assert.equal(interaction.state.radius, CAMERA_BOUNDS.minRadius);
  zoomCamera(interaction, 100000);
  assert.equal(interaction.state.radius, CAMERA_BOUNDS.maxRadius);
  assert.notEqual(initialRadius, interaction.state.radius);
  assert.deepEqual(camera.lookAtTarget, [interaction.target.x, interaction.target.y, interaction.target.z]);
});

test('direct orbit and zoom helpers preserve finite camera state', () => {
  const interaction = createCameraInteraction(new Camera(), new Mount());
  orbitCamera(interaction, 0.5, -0.5);
  zoomCamera(interaction, 2);
  assert.ok(Number.isFinite(interaction.state.azimuth));
  assert.ok(Number.isFinite(interaction.state.polarAngle));
  assert.ok(Number.isFinite(interaction.state.radius));
});

test('interface includes illustrative visual-scale caveat', () => {
  const source = fs.readFileSync('index.html', 'utf8');
  assert.match(source, /illustrative/i);
  assert.match(source, /not.*physical scale/i);
});

test('interface includes non-quantitative heat-flow caveat', () => {
  const source = fs.readFileSync('index.html', 'utf8');
  assert.match(source, /heat-flow.*non-quantitative/i);
});
