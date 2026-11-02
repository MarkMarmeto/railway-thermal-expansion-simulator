const { test, expect } = require('@playwright/test');

test('renders the scene with external network requests blocked', async ({ page }) => {
  await page.route('https://**/*', route => route.abort());
  await page.goto('/index.html');

  await expect(page.locator('#sceneMount canvas')).toBeVisible();
  await expect(page.locator('#sceneStatus')).toHaveClass(/ready/);
  await expect(page.locator('#resultsSummary')).toContainText('Status: Open');

  const renderCalls = await page.evaluate(() => globalThis.simulatorScene.renderer.info.render.calls);
  expect(renderCalls).toBeGreaterThan(0);
  const cameraState = await page.evaluate(() => {
    const { camera } = globalThis.simulatorScene;
    return [...camera.position.toArray(), ...camera.quaternion.toArray()];
  });
  expect(cameraState.every(Number.isFinite)).toBe(true);
});
