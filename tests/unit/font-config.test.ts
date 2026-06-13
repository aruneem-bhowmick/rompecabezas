import { describe, expect, it } from 'vitest';
import tailwindConfig from '../../tailwind.config';

/**
 * Font family values are read from theme.extend so assertions target
 * only the project's own font configuration, not Tailwind defaults.
 */
const extended = tailwindConfig.theme?.extend ?? {};
const fontFamily = extended.fontFamily as Record<string, string[]> | undefined;

/**
 * Tests for the Tailwind font family configuration.
 *
 * Verifies that the display and body font families are correctly
 * registered with appropriate primary faces and fallback stacks.
 */
describe('font configuration', () => {
  it('defines a fontFamily extension', () => {
    expect(fontFamily).toBeDefined();
  });

  it('defines the display font family with Bricolage Grotesque as primary', () => {
    const display = fontFamily?.display;
    expect(display).toBeDefined();
    expect(display?.[0]).toContain('Bricolage Grotesque');
  });

  it('defines the body font family with Inter as primary', () => {
    const body = fontFamily?.body;
    expect(body).toBeDefined();
    expect(body?.[0]).toBe('Inter');
  });

  it('includes fallback stacks for the display font family', () => {
    const display = fontFamily?.display;
    expect(display).toBeDefined();
    expect(display?.length).toBeGreaterThan(1);
  });

  it('includes fallback stacks for the body font family', () => {
    const body = fontFamily?.body;
    expect(body).toBeDefined();
    expect(body?.length).toBeGreaterThan(1);
  });

  it('terminates the display fallback stack with the serif generic family', () => {
    const display = fontFamily?.display;
    expect(display).toBeDefined();
    expect(display?.slice(-1)[0]?.toLowerCase()).toBe('serif');
  });

  it('terminates the body fallback stack with the sans-serif generic family', () => {
    const body = fontFamily?.body;
    expect(body).toBeDefined();
    expect(body?.slice(-1)[0]?.toLowerCase()).toBe('sans-serif');
  });
});
