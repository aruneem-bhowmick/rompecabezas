import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * End-to-end tests for the PuzzleCanvas component.
 *
 * Validates that the headbreaker Canvas renders correctly in a real
 * browser, produces visible puzzle pieces, handles mouse interaction
 * without errors, and maintains accessibility of the surrounding
 * application chrome.
 */
test.describe('puzzle canvas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('canvas element is visible inside main', async ({ page }) => {
    const canvas = page.getByTestId('puzzle-canvas');
    await expect(canvas).toBeVisible({ timeout: 10_000 });

    // Should be inside <main>
    const main = page.locator('main');
    await expect(main.getByTestId('puzzle-canvas')).toBeVisible();
  });

  test('canvas has non-zero dimensions', async ({ page }) => {
    const canvas = page.getByTestId('puzzle-canvas');
    await expect(canvas).toBeVisible({ timeout: 10_000 });

    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });

  test('puzzle pieces are visible (non-trivial screenshot)', async ({
    page,
  }) => {
    const canvas = page.getByTestId('puzzle-canvas');
    await expect(canvas).toBeVisible({ timeout: 10_000 });

    // Wait for Konva to render (the konvajs-content div appears)
    await page.waitForSelector('.konvajs-content', { timeout: 10_000 });

    const screenshot = await canvas.screenshot();
    // A rendered puzzle produces a non-trivial image (> 5KB)
    expect(screenshot.byteLength).toBeGreaterThan(5_000);
  });

  test('mouse drag does not produce console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    const canvas = page.getByTestId('puzzle-canvas');
    await expect(canvas).toBeVisible({ timeout: 10_000 });
    await page.waitForSelector('.konvajs-content', { timeout: 10_000 });

    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();

    // Drag from center-ish area
    const startX = box!.x + box!.width * 0.4;
    const startY = box!.y + box!.height * 0.4;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 50, startY + 30, { steps: 5 });
    await page.mouse.up();

    expect(errors).toEqual([]);
  });

  test('header, main, and footer landmarks remain after canvas mounts', async ({
    page,
  }) => {
    await page.waitForSelector('.konvajs-content', { timeout: 10_000 });

    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('no console errors during rendering', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForSelector('.konvajs-content', { timeout: 10_000 });

    expect(errors).toEqual([]);
  });

  test('passes axe accessibility on surrounding chrome', async ({ page }) => {
    await page.waitForSelector('.konvajs-content', { timeout: 10_000 });

    const results = await new AxeBuilder({ page })
      .exclude('[data-testid="timer-sample"]')
      .exclude('[data-testid="puzzle-canvas"]')
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
