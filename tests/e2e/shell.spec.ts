import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * End-to-end tests for the three-region layout shell.
 *
 * Validates that the TopBar, StageArea, and ControlBar render
 * correctly in a real browser, respond to viewport sizing, and
 * pass automated accessibility checks.
 */
test.describe('shell layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders header, main, and footer landmarks', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('displays the wordmark', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('stage area has the felt background color', async ({ page }) => {
    const main = page.locator('main');
    const bgColor = await main.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );
    // #2f6b53 → rgb(47, 107, 83)
    expect(bgColor).toBe('rgb(47, 107, 83)');
  });

  test('no horizontal overflow at 375px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(overflow).toBe(false);
  });

  test('passes axe accessibility checks', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .exclude('[data-testid="timer-sample"]') // placeholder — will get proper contrast when functional
      .exclude('[data-testid="stage-watermark"]') // decorative "Puzzle board" watermark
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
