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
 * Coverage is collected via the V8 provider and enforced at 90 %
 * thresholds for the pure-logic modules under src/lib/ and src/image/.
 * These directories are forward-looking targets; the thresholds will
 * activate once source files exist there.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**', 'src/image/**'],
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },
});
