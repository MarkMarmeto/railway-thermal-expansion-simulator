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
  await expect.poll(() => page.evaluate(() => globalThis.simulatorScene.objects.gapIndicator.scale.x)).toBe(0);

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
