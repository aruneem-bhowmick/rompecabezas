import path from 'node:path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Vitest test runner configuration.
 *
 * Uses jsdom to simulate a browser environment for component and unit
 * tests, enables global test APIs (describe, it, expect) so imports
 * are optional, and loads the shared setup file that registers
 * extended DOM matchers from @testing-library/jest-dom.
 *
 * Konva is aliased to its browser build because the default Node.js
 * entry point requires the native `canvas` npm package, which is not
 * needed in a jsdom test environment.
 *
 * Coverage is collected via the V8 provider and enforced at 90 %
 * thresholds for the pure-logic modules under src/lib/ and src/image/,
 * and at 80 % for the UI components under src/ui/.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      konva: path.resolve(__dirname, 'node_modules/konva/lib/index.js'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**', 'src/image/**', 'src/ui/**'],
      thresholds: {
        'src/lib/**': {
          statements: 90,
          branches: 90,
          functions: 90,
          lines: 90,
        },
        'src/image/**': {
          statements: 90,
          branches: 90,
          functions: 90,
          lines: 90,
        },
        'src/ui/**': {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
      },
    },
  },
});
