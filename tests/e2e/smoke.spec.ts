import { test, expect } from '@playwright/test';

/**
 * Foundational smoke test that validates the application loads and
 * renders its initial state.  All subsequent e2e tests build on the
 * assumption that this basic page-load contract holds.
 */
test('app loads and displays the title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Rompecabezas');
  await expect(page.locator('body')).toBeVisible();
});
