import type { Config } from 'tailwindcss';

/**
 * Tailwind CSS theme configuration.
 *
 * Extends the default theme with project design tokens — colors, border
 * radii, transition durations, and font families — so every UI component
 * references a single source of truth for visual consistency.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-serif', 'Georgia', 'serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#1b1d1c',
        paper: '#f4f5f2',
        felt: '#2f6b53',
        'felt-deep': '#255843',
        marigold: '#e8a13a',
        slate: '#5b636a',
        line: 'rgba(27, 29, 28, 0.12)',
      },
      borderRadius: {
        card: '10px',
      },
      transitionDuration: {
        snap: '200ms',
      },
    },
  },
  plugins: [],
};

export default config;
