import { describe, it, expect } from 'vitest';

/**
 * Tests verifying the sample image asset and its re-export module
 * are properly configured for Vite's static asset pipeline.
 *
 * These tests ensure the engine barrel correctly surfaces the
 * loadImage utility and sampleUrl, confirming that new exports
 * resolve without errors under the test environment.
 */
describe('sample image asset', () => {
  /**
   * Verifies that the sampleUrl export from the engine barrel
   * resolves to a string (Vite transforms .jpg imports into URL strings).
   */
  it('exports sampleUrl as a string from the engine barrel', async () => {
    const { sampleUrl } = await import('../../src/engine');
    expect(typeof sampleUrl).toBe('string');
    expect(sampleUrl.length).toBeGreaterThan(0);
  });

  /**
   * Verifies that the sampleImage module directly exports a string URL.
   */
  it('exports sampleUrl from the sampleImage module', async () => {
    const { sampleUrl } = await import('../../src/engine/sampleImage');
    expect(typeof sampleUrl).toBe('string');
  });

  /**
   * Verifies that the loadImage function is exported from the
   * engine barrel and is callable.
   */
  it('exports loadImage as a function from the engine barrel', async () => {
    const { loadImage } = await import('../../src/engine');
    expect(typeof loadImage).toBe('function');
  });
});
