const { test, expect } = require('@playwright/test');

async function allowThree(page) {
  await page.route(
    'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js',
    async route => {
      const response = await route.fetch();
      await route.fulfill({ response });
    },
  );
}

async function focusNext(page) {
  await page.keyboard.press('Tab');
  return page.evaluate(() => document.activeElement && document.activeElement.id);
}

test('keyboard operation reaches and operates all primary controls', async ({ page }) => {
  await allowThree(page);
  await page.goto('/');

  await expect(page.getByLabel('Temperature (°C)')).toBeVisible();
  await expect(page.getByLabel('Initial gap (mm)')).toBeVisible();
  await expect(page.getByLabel('Material')).toBeVisible();

  for (let tab = 0; tab < 10; tab += 1) {
    await page.keyboard.press('Tab');
    if (await page.locator(':focus').getAttribute('id') === 'temperatureC') break;
  }
  await expect(page.locator(':focus')).toHaveAttribute('id', 'temperatureC');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#resultsSummary')).toContainText('Temperature: 26 °C');

  await expect.poll(() => focusNext(page)).toBe('initialGapMm');
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => page.evaluate(() => window.simulatorState.initialGapMm)).toBe(6.1);

  await expect.poll(() => focusNext(page)).toBe('material');
  await page.locator('#material').press('a');
  await expect.poll(() => page.evaluate(() => window.simulatorState.material)).toBe('aluminum');
  await expect(page.locator('#resultsSummary')).toContainText('Material: Aluminum');
});

test('labels units readable semantics are present', async ({ page }) => {
  await allowThree(page);
  await page.goto('/');

  await expect(page.getByLabel('Temperature (°C)')).toHaveAccessibleName('Temperature (°C)');
  await expect(page.getByLabel('Initial gap (mm)')).toHaveAccessibleName('Initial gap (mm)');
  await expect(page.getByLabel('Material')).toHaveAccessibleName('Material');
  await expect(page.locator('#resultsSummary')).toHaveAttribute('aria-live', 'polite');
  await expect(page.locator('#sceneStatus')).toHaveAttribute('role', 'status');
  await expect(page.locator('#sceneStatus')).toHaveAttribute('aria-live', 'polite');
  await expect(page.locator('#resultsSummary')).toContainText(/°C/);
  await expect(page.locator('#resultsSummary')).toContainText(/mm/);
  await expect(page.locator('#resultsSummary')).toContainText('/°C');
  await expect(page.locator('#resultsSummary')).toContainText('Status: Open');
  await expect(page.locator('#sceneStatus')).toHaveClass(/ready/);
});

test('status meaning is clear without color', async ({ page }) => {
  await allowThree(page);
  await page.goto('/');

  await page.getByLabel('Temperature (°C)').fill('55');
  await page.getByLabel('Initial gap (mm)').fill('6');
  await expect(page.locator('#resultsSummary')).toContainText('Status: Open');

  await page.getByLabel('Temperature (°C)').fill('75');
  await page.getByLabel('Initial gap (mm)').fill('5');
  await page.getByLabel('Material').selectOption('aluminum');
  await expect(page.locator('#resultsSummary')).toContainText('Status: Closed / Insufficient clearance');
  await expect(page.locator('#resultsSummary')).toContainText('Signed gap: -6.5 mm');
});
