const { test, expect } = require('@playwright/test');

async function openSimulator(page) {
  await page.route('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js', async route => {
    const response = await route.fetch();
    await route.fulfill({ response });
  });
  await page.goto('/index.html');
  await expect(page.locator('#sceneMount canvas')).toBeVisible();
}

test('camera orbit and zoom interactions change bounded camera state', async ({ page }) => {
  await openSimulator(page);
  const canvas = page.locator('#sceneMount canvas');
  const mount = page.locator('#sceneMount');
  const initial = await page.evaluate(() => ({
    azimuth: globalThis.simulatorScene.cameraController.state.azimuth,
    radius: globalThis.simulatorScene.cameraController.state.radius,
  }));
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();

  await mount.dispatchEvent('pointerdown', { clientX: 100, clientY: 100, pointerId: 7 });
  await mount.dispatchEvent('pointermove', { clientX: 180, clientY: 70, pointerId: 7 });
  await mount.dispatchEvent('pointerup', { pointerId: 7 });
  await mount.dispatchEvent('wheel', { deltaY: -400 });

  const changed = await page.evaluate(() => ({
    azimuth: globalThis.simulatorScene.cameraController.state.azimuth,
    polarAngle: globalThis.simulatorScene.cameraController.state.polarAngle,
    radius: globalThis.simulatorScene.cameraController.state.radius,
  }));
  expect(changed.azimuth).not.toBe(initial.azimuth);
  expect(changed.radius).not.toBe(initial.radius);
  expect(changed.polarAngle).toBeGreaterThanOrEqual(0.35);
  expect(changed.polarAngle).toBeLessThanOrEqual(1.45);
  expect(changed.radius).toBeGreaterThanOrEqual(3);
  expect(changed.radius).toBeLessThanOrEqual(14);
});
