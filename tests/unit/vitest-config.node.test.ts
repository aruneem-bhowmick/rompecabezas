/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import vitestConfig from '../../vitest.config';

/* eslint-disable @typescript-eslint/no-explicit-any */
const config = (vitestConfig as any).test;

/**
 * Validates that the Vitest configuration object declares the
 * expected test runner settings.  These assertions act as a
 * regression guard against accidental changes to the shared test
 * infrastructure.
 *
 * Runs in the Node environment (not jsdom) so that importing the
 * Vite config (which loads @vitejs/plugin-react and esbuild) does
 * not conflict with jsdom's TextEncoder polyfill.
 */
describe('vitest.config.ts contract', () => {
  /**
   * The jsdom environment is required for all component and DOM-aware
   * unit tests.  If this value changes, RTL tests will break.
   */
  it('specifies jsdom as the test environment', () => {
    expect(config.environment).toBe('jsdom');
  });

  /**
   * Global test APIs (describe, it, expect) should be available
   * without explicit imports in every test file.
   */
  it('enables global test APIs', () => {
    expect(config.globals).toBe(true);
  });

  /**
   * The setup file path must point to tests/setup.ts so jest-dom
   * matchers are registered before test execution.
   */
  it('references the shared setup file', () => {
    expect(config.setupFiles).toContain('./tests/setup.ts');
  });

  /**
   * Coverage must target the pure-logic modules (src/lib/, src/image/)
   * to enforce quality on business logic without penalizing UI code.
   */
  it('targets pure-logic modules for coverage collection', () => {
    expect(config.coverage.include).toContain('src/lib/**');
    expect(config.coverage.include).toContain('src/image/**');
  });

  /**
   * 90% thresholds on statements, branches, functions, and lines
   * prevent regressions in test coverage for critical modules.
   */
  it('enforces 90% coverage thresholds', () => {
    expect(config.coverage.thresholds).toEqual({
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    });
  });
});
