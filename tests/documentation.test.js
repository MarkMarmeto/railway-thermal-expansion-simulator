const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('documents the local install, start, URL, and test commands', () => {
  const readme = read('README.md');
  const packageJson = JSON.parse(read('package.json'));
  const index = read('index.html');

  assert.equal(packageJson.scripts.start, 'node tests/e2e/server.js');
  assert.match(readme, /npm install/);
  assert.match(readme, /npm run start/);
  assert.match(readme, /127\.0\.0\.1:4173/);
  assert.match(readme, /npm test/);
  assert.match(readme, /npm run test:e2e/);
  assert.match(readme, /vendored under `vendor\/three\//);
  assert.match(index, /src="vendor\/three\/three\.min\.js"/);
  assert.doesNotMatch(index, /cdn\.jsdelivr\.net\/npm\/three/);
});

test('documents the approved equation, assumptions, coefficients, and limits', () => {
  const readme = read('README.md');

  assert.match(readme, /ΔL = α × L₀ × \(T − T₀\)/);
  assert.match(readme, /10 m/);
  assert.match(readme, /25 °C/);
  assert.match(readme, /Steel.*12 × 10⁻⁶ \/°C/s);
  assert.match(readme, /Aluminum.*23 × 10⁻⁶ \/°C/s);
  assert.match(readme, /Copper.*17 × 10⁻⁶ \/°C/s);
  assert.match(readme, /NOAA\/PMEL Metrology Handbook/);
  assert.match(readme, /Engineering Toolbox/);
  assert.match(readme, /signed gap = g₀ − ΔL/);
  assert.match(readme, /physical gap = max\(0, signed gap\)/);
  assert.match(readme, /buckling/);
  assert.match(readme, /compression force/);
  assert.match(readme, /engineering design/);
});

test('documents visual exaggeration and non-quantitative heat-flow visuals', () => {
  const readme = read('README.md');

  assert.match(readme, /visually exaggerated/);
  assert.match(readme, /not drawn to physical scale/);
  assert.match(readme, /heat-flow arrows or particles/);
  assert.match(readme, /non-quantitative/);
  assert.match(readme, /Numerical readings/);
});

test('contains an explicit Codex and AI assignment declaration', () => {
  const readme = read('README.md');

  assert.match(readme, /OpenAI Codex\/AI/);
  assert.match(readme, /human-directed scope/);
});
