import { test, expect } from '@playwright/test';

/**
 * End-to-end tests for the application shell.
 *
 * These tests verify the deployed application renders its initial
 * state correctly in a real browser environment, complementing the
 * jsdom-based unit tests with full rendering fidelity.
 */
test.describe('application shell', () => {
  /**
   * Confirms the HTML document includes the correct lang attribute
   * for accessibility compliance.
   */
  test('serves a page with the correct language attribute', async ({ page }) => {
    await page.goto('/');
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('en');
  });

  /**
   * Verifies the viewport meta tag is present, which is required for
   * responsive layout behavior on mobile devices.
   */
  test('includes a viewport meta tag', async ({ page }) => {
    await page.goto('/');
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
  });

  /**
   * Asserts the application renders its name as visible text content,
   * confirming the React component tree mounted successfully.
   */
  test('displays the application name in the page body', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Rompecabezas')).toBeVisible();
  });
});
