const { test, expect } = require('@playwright/test');

test('renderer initialization failure leaves a readable usable shell', async ({ page }) => {
  await page.addInitScript(() => {
    globalThis.RailwaySceneFactory = () => {
      throw new Error('Renderer unavailable');
    };
  });

  await page.goto('/');

  await expect(page.locator('#sceneStatus')).toHaveClass(/error/);
  await expect(page.locator('#sceneStatus')).toContainText(/scene|renderer/i);
  await expect(page.locator('#sceneStatus')).toContainText(/unavailable|failed/i);
  await expect(page.locator('#resultsSummary')).toContainText('Status: Open');
  await page.getByLabel('Temperature (°C)').fill('75');
  await expect(page.locator('#resultsSummary')).toContainText('Temperature: 75 °C');
});
