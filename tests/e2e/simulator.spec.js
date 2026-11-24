const { test, expect } = require('@playwright/test');

async function openSimulator(page) {
  await page.route('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js', async route => {
    const response = await route.fetch();
    await route.fulfill({ response });
  });
  await page.goto('/index.html');
  await expect(page.locator('#resultsSummary')).toContainText('Temperature: 25 °C');
  await expect(page.locator('#sceneMount canvas')).toBeVisible();
}

async function setControls(page, { temperature, gap, material }) {
  await page.locator('#temperatureC').fill(String(temperature));
  await page.locator('#initialGapMm').fill(String(gap));
  await page.locator('#material').selectOption(material);
  await expect(page.locator('#resultsSummary')).toContainText(`Material: ${material[0].toUpperCase()}${material.slice(1)}`);
}

test('initial page shows the scene, three controls, and results', async ({ page }) => {
  await openSimulator(page);
  await expect(page.locator('[data-primary-control]')).toHaveCount(3);
  await expect(page.getByLabel('Temperature (°C)')).toBeVisible();
  await expect(page.getByLabel('Initial gap (mm)')).toBeVisible();
  await expect(page.getByLabel('Material')).toBeVisible();
  await expect(page.locator('#resultsExplanation')).toBeVisible();
  await expect(page.locator('#resultsLimitations')).toBeVisible();
});

test('Steel worked example displays open clearance', async ({ page }) => {
  await openSimulator(page);
  await setControls(page, { temperature: 55, gap: 6, material: 'steel' });
  const summary = page.locator('#resultsSummary');
  await expect(summary).toContainText('Expansion: 3.6 mm');
  await expect(summary).toContainText('Physical gap: 2.4 mm');
  await expect(summary).toContainText('Status: Open');
});

test('Aluminum worked example displays closed insufficient clearance', async ({ page }) => {
  await openSimulator(page);
  await setControls(page, { temperature: 75, gap: 5, material: 'aluminum' });
  const summary = page.locator('#resultsSummary');
  await expect(summary).toContainText('Expansion: 11.5 mm');
  await expect(summary).toContainText('Physical gap: 0 mm');
  await expect(summary).toContainText('Signed gap: -6.5 mm');
  await expect(summary).toContainText('Status: Closed / Insufficient clearance');
});

test('each primary control updates the shared result and scene state', async ({ page }) => {
  await openSimulator(page);
  const initial = await page.evaluate(() => ({
    state: globalThis.simulatorState,
    heat: globalThis.simulatorScene.animation.heatColor,
    cue: globalThis.simulatorScene.materialCue.label,
  }));

  await page.locator('#temperatureC').fill('55');
  await expect.poll(() => page.evaluate(() => globalThis.simulatorState.temperatureC)).toBe(55);
  await expect.poll(() => page.evaluate(() => globalThis.simulatorScene.animation.heatColor.r)).not.toBe(initial.heat.r);

  await page.locator('#initialGapMm').fill('2');
  await expect.poll(() => page.evaluate(() => globalThis.simulatorState.initialGapMm)).toBe(2);
  await expect.poll(() => page.evaluate(() => globalThis.simulatorScene.animation.targetPositions.visualGap)).toBe(0);

  await page.locator('#material').selectOption('copper');
  await expect.poll(() => page.evaluate(() => globalThis.simulatorState.material)).toBe('copper');
  await expect.poll(() => page.evaluate(() => globalThis.simulatorScene.materialCue.label)).toBe('Copper');
  await expect.poll(() => page.evaluate(() => globalThis.simulatorScene.materials.rail.color.r)).toBeGreaterThan(0.4);
  expect(initial.state.material).toBe('steel');
});

test('closed clearance applies the red thermal rail cue', async ({ page }) => {
  await openSimulator(page);
  await page.locator('#temperatureC').fill('75');
  await page.locator('#initialGapMm').fill('5');
  await page.locator('#material').selectOption('aluminum');
  await expect(page.locator('#resultsSummary')).toContainText('Status: Closed / Insufficient clearance');

  const color = await page.evaluate(() => {
    const { color } = globalThis.simulatorScene.materials.rail;
    return { r: color.r, g: color.g, b: color.b };
  });
  expect(color.r).toBeGreaterThan(color.b);
  expect(color.r).toBeGreaterThan(color.g);
});

test('outdoor scene renders local surface textures without a floating gap bar', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await openSimulator(page);
  const appearance = await page.evaluate(() => {
    const { scene, materials, objects, renderer } = globalThis.simulatorScene;
    return {
      bar: Boolean(scene.getObjectByName('gap-indicator')),
      terrain: Boolean(scene.getObjectByName('terrain')),
      ballast: Boolean(scene.getObjectByName('ballast').material.map),
      railTextureWidth: materials.rail.map.image.width,
      woodTextureWidth: objects.sleepers.children[0].material.map.image.width,
      background: scene.background.getHex(),
      drawCalls: renderer.info.render.calls,
      steelRoughness: materials.rail.roughness,
    };
  });
  expect(appearance.bar).toBe(false);
  expect(appearance.terrain).toBe(true);
  expect(appearance.ballast).toBe(true);
  expect(appearance.railTextureWidth).toBe(128);
  expect(appearance.woodTextureWidth).toBe(128);
  expect(appearance.background).not.toBe(0);
  expect(appearance.drawCalls).toBeGreaterThan(0);
  await page.locator('#sceneMount').screenshot({ path: testInfo.outputPath('environment-desktop.png') });
  await page.locator('#material').selectOption('aluminum');
  const aluminumRoughness = await page.evaluate(() => globalThis.simulatorScene.materials.rail.roughness);
  expect(aluminumRoughness).toBeLessThan(appearance.steelRoughness);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#sceneMount').screenshot({ path: testInfo.outputPath('environment-mobile.png') });
  expect(errors).toEqual([]);
});

test('mobile layout stacks panels without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openSimulator(page);

  const layout = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    sidebarWidth: document.querySelector('.sidebar').getBoundingClientRect().width,
    sceneWidth: document.querySelector('#sceneMount').getBoundingClientRect().width,
    canvasHeight: document.querySelector('#sceneMount canvas').getBoundingClientRect().height,
  }));

  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewport + 1);
  expect(layout.sidebarWidth).toBe(layout.viewport);
  expect(layout.sceneWidth).toBeLessThanOrEqual(layout.viewport - 20);
  expect(layout.canvasHeight).toBeGreaterThanOrEqual(300);
});

test('mobile layout places the 3D simulator before controls and results', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openSimulator(page);

  const order = await page.evaluate(() => [
    document.querySelector('.scene-panel'),
    document.querySelector('.controls-panel'),
    document.querySelector('.results-panel'),
  ].map(panel => panel.getBoundingClientRect().top));

  expect(order[0]).toBeLessThan(order[1]);
  expect(order[1]).toBeLessThan(order[2]);
});

test('rail ends converge, illustrate restrained expansion, and straighten on cooling', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openSimulator(page);
  const settled = () => expect.poll(() => page.evaluate(() => Boolean(globalThis.simulatorScene.animation.framePending))).toBe(false);
  const geometry = () => page.evaluate(() => {
    const { objects, animation } = globalThis.simulatorScene;
    return {
      gap: objects.railRight.position.x - objects.railLeft.position.x - 4,
      bend: animation.bend,
      arrows: objects.compressionArrows.visible,
    };
  });
  await setControls(page, { temperature: 69, gap: 5.5, material: 'steel' });
  await settled();
  expect((await geometry()).gap).toBeCloseTo(0.022, 8);
  await expect(page.locator('#contactState')).toContainText('Gap open: 0.22 mm');

  for (const [material, gap] of [['steel', 6], ['copper', 8.5], ['aluminum', 11.5]]) {
    await setControls(page, { temperature: 75, gap, material });
    await settled();
    expect(await geometry()).toEqual({ gap: 0, bend: 0, arrows: false });
    await expect(page.locator('#contactState')).toContainText('Contact reached');
  }

  await setControls(page, { temperature: 75, gap: 5, material: 'aluminum' });
  await settled();
  const compressed = await geometry();
  expect(compressed.gap).toBe(0);
  expect(compressed.bend).toBeCloseTo(0.78);
  expect(compressed.arrows).toBe(true);
  await expect(page.locator('#contactState')).toContainText('6.5 mm');
  await expect(page.locator('#contactState')).toContainText('do not predict buckling or force');
  await page.locator('.scene-panel').screenshot({ path: testInfo.outputPath('contact-desktop.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.scene-panel').screenshot({ path: testInfo.outputPath('contact-mobile.png') });

  await setControls(page, { temperature: 25, gap: 5, material: 'aluminum' });
  await settled();
  expect(await geometry()).toEqual({ gap: 0.5, bend: 0, arrows: false });
  await expect(page.locator('#contactState')).toContainText('Gap open: 5 mm');
  expect(errors).toEqual([]);
});
