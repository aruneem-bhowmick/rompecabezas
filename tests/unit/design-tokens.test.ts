import { describe, expect, it } from 'vitest';
import tailwindConfig from '../../tailwind.config';

/*
 * Read token values from theme.extend (our tokens only) rather than the
 * fully resolved theme, where Tailwind's default colors are nested
 * objects and would make Record<string, string> a lie.
 */
const extended = tailwindConfig.theme?.extend ?? {};
const colors = extended.colors as Record<string, string>;
const borderRadius = extended.borderRadius as Record<string, string>;
const transitionDuration = extended.transitionDuration as Record<string, string>;

describe('design tokens', () => {
  describe('colors', () => {
    it('defines ink token', () => {
      expect(colors.ink).toBe('#1b1d1c');
    });

    it('defines paper token', () => {
      expect(colors.paper).toBe('#f4f5f2');
    });

    it('defines felt token', () => {
      expect(colors.felt).toBe('#2f6b53');
    });

    it('defines felt-deep token', () => {
      expect(colors['felt-deep']).toBe('#255843');
    });

    it('defines marigold token', () => {
      expect(colors.marigold).toBe('#e8a13a');
    });

    it('defines slate token', () => {
      expect(colors.slate).toBe('#5b636a');
    });

    it('defines line token', () => {
      expect(colors.line).toBe('rgba(27, 29, 28, 0.12)');
    });
  });

  describe('borderRadius', () => {
    it('defines card token', () => {
      expect(borderRadius.card).toBe('10px');
    });
  });

  describe('transitionDuration', () => {
    it('defines snap token', () => {
      expect(transitionDuration.snap).toBe('200ms');
    });
  });

  it('matches the full extended theme snapshot', () => {
    expect(tailwindConfig.theme?.extend).toMatchSnapshot();
  });
});
