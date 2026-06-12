/**
 * Sanity verification script for ESLint violation detection.
 *
 * Creates a temporary TypeScript file containing a deliberate lint
 * violation (an unused variable), runs `npm run lint`, and confirms
 * that ESLint correctly reports a non-zero exit code. The temporary
 * file is always cleaned up, regardless of test outcome. Exits with
 * code 1 if ESLint fails to catch the violation.
 */

import { execSync } from 'node:child_process';
import { writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const TEMP_FILE = join('src', '__lint-sanity-check__.ts');

/**
 * Content of the temporary file that should trigger a lint error.
 *
 * The unused variable `deliberateViolation` is expected to be caught
 * by the @typescript-eslint/no-unused-vars rule.
 */
const VIOLATION_CONTENT = `// Temporary file for lint sanity check — should be caught and deleted
const deliberateViolation = 'this variable is never used';
`;

/**
 * Remove the temporary file if it exists.
 *
 * Called during both success and failure paths to ensure no test
 * artifacts are left in the source tree.
 */
function cleanup() {
  if (existsSync(TEMP_FILE)) {
    unlinkSync(TEMP_FILE);
  }
}

console.log('Verifying ESLint catches deliberate violations...\n');

try {
  // Create the violating file
  writeFileSync(TEMP_FILE, VIOLATION_CONTENT, 'utf-8');
  console.log(`  Created ${TEMP_FILE} with unused variable`);

  // Run lint — expect it to fail
  let lintFailed = false;
  try {
    execSync('npm run lint', { stdio: 'pipe', encoding: 'utf-8' });
  } catch {
    lintFailed = true;
  }

  if (lintFailed) {
    console.log('  \u2713 ESLint correctly reported a violation');
  } else {
    console.error('  \u2717 ESLint did NOT catch the deliberate violation');
    cleanup();
    process.exit(1);
  }
} finally {
  cleanup();
  console.log(`  Cleaned up ${TEMP_FILE}`);
}

console.log('\nSanity check passed — ESLint violation detection is working.');
