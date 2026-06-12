import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const currentDir = dirname(fileURLToPath(import.meta.url));

/**
 * Validates that the Vitest configuration file declares the expected
 * test runner settings.  These assertions act as a regression guard
 * against accidental changes to the shared test infrastructure.
 */
describe('vitest.config.ts contract', () => {
  const configContent = readFileSync(resolve(currentDir, '../../vitest.config.ts'), 'utf-8');

  /**
   * The jsdom environment is required for all component and DOM-aware
   * unit tests.  If this value changes, RTL tests will break.
   */
  it('specifies jsdom as the test environment', () => {
    expect(configContent).toContain("environment: 'jsdom'");
  });

  /**
   * Global test APIs (describe, it, expect) should be available
   * without explicit imports in every test file.
   */
  it('enables global test APIs', () => {
    expect(configContent).toContain('globals: true');
  });

  /**
   * The setup file path must point to tests/setup.ts so jest-dom
   * matchers are registered before test execution.
   */
  it('references the shared setup file', () => {
    expect(configContent).toContain('./tests/setup.ts');
  });

  /**
   * Coverage must target the pure-logic modules (src/lib/, src/image/)
   * to enforce quality on business logic without penalizing UI code.
   */
  it('targets pure-logic modules for coverage collection', () => {
    expect(configContent).toContain('src/lib/**');
    expect(configContent).toContain('src/image/**');
  });

  /**
   * 90% thresholds on statements, branches, functions, and lines
   * prevent regressions in test coverage for critical modules.
   */
  it('enforces 90% coverage thresholds', () => {
    expect(configContent).toContain('statements: 90');
    expect(configContent).toContain('branches: 90');
    expect(configContent).toContain('functions: 90');
    expect(configContent).toContain('lines: 90');
  });
});
