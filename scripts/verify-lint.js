/**
 * Smoke verification script for ESLint and Prettier compliance.
 *
 * Runs `npm run lint` and `npm run format:check` to confirm that all
 * source and config files pass linting and formatting checks with zero
 * errors and zero warnings. Also verifies the production build still
 * succeeds after any source modifications. Exits with code 1 if any
 * check fails.
 */

import { execSync } from 'node:child_process';

/**
 * Run a shell command and return whether it succeeded.
 *
 * Captures stdout/stderr and prints them only on failure to keep the
 * success path clean.
 *
 * @param {string} label - Human-readable description of the check.
 * @param {string} command - Shell command to execute.
 * @returns {boolean} True if the command exited with code 0.
 */
function runCheck(label, command) {
  try {
    execSync(command, { stdio: 'pipe', encoding: 'utf-8' });
    console.log(`  \u2713 ${label}`);
    return true;
  } catch (err) {
    console.error(`  \u2717 ${label}`);
    if (err.stdout) console.error(err.stdout);
    if (err.stderr) console.error(err.stderr);
    return false;
  }
}

console.log('Verifying lint and format compliance...\n');

const checks = [
  ['ESLint passes with zero warnings', 'npm run lint'],
  ['Prettier formatting is compliant', 'npm run format:check'],
  ['Production build succeeds', 'npm run build'],
];

let allPassed = true;

for (const [label, command] of checks) {
  if (!runCheck(label, command)) {
    allPassed = false;
  }
}

if (allPassed) {
  console.log('\nAll lint and format checks passed.');
} else {
  console.error('\nOne or more checks failed.');
  process.exit(1);
}
