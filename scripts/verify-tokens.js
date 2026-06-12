/**
 * Build verification script for Tailwind CSS design tokens.
 *
 * Runs `npm run build`, then inspects the compiled CSS in dist/ to
 * confirm that every design token color value made it through the
 * Tailwind/PostCSS pipeline. Exits with code 1 if any token is missing.
 */

import { execSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Design token hex values that must appear in compiled CSS. */
const EXPECTED_TOKENS = [
  { name: 'ink', value: '#1b1d1c' },
  { name: 'paper', value: '#f4f5f2' },
  { name: 'felt', value: '#2f6b53' },
  { name: 'felt-deep', value: '#255843' },
  { name: 'marigold', value: '#e8a13a' },
  { name: 'slate', value: '#5b636a' },
];

/**
 * Read all CSS files from the dist/assets directory and return their
 * concatenated contents.
 *
 * @returns {string} Combined CSS output from the production build.
 */
function readBuiltCss() {
  const assetsDir = join('dist', 'assets');
  const cssFiles = readdirSync(assetsDir).filter((f) => f.endsWith('.css'));
  if (cssFiles.length === 0) {
    console.error('No CSS files found in dist/assets/');
    process.exit(1);
  }
  return cssFiles
    .map((f) => readFileSync(join(assetsDir, f), 'utf-8'))
    .join('\n');
}

// Run build
console.log('Running production build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch {
  console.error('Build failed');
  process.exit(1);
}

// Verify tokens
console.log('\nVerifying design tokens in compiled CSS...');
const css = readBuiltCss();
let allFound = true;

for (const token of EXPECTED_TOKENS) {
  if (css.includes(token.value)) {
    console.log(`  ✓ ${token.name} (${token.value})`);
  } else {
    console.error(`  ✗ ${token.name} (${token.value}) — NOT FOUND`);
    allFound = false;
  }
}

if (allFound) {
  console.log('\nAll design tokens verified.');
} else {
  console.error('\nSome design tokens are missing from the build output.');
  process.exit(1);
}
