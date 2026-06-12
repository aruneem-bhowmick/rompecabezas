/**
 * Build verification script for Tailwind CSS design tokens.
 *
 * Runs `npm run build`, then inspects the compiled CSS in dist/ to
 * confirm that every design token made it through the Tailwind/PostCSS
 * pipeline. Exits with code 1 if any token is missing.
 */

import { execSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * All nine design tokens that must appear in compiled CSS.
 *
 * Color tokens are matched by value. The line token uses a prefix match
 * because Vite's minifier strips the leading zero from 0.12 → .12.
 * Non-color tokens (card, snap) are matched by their CSS custom property
 * name since their values (10px, 200ms) are too generic for substring
 * matching.
 */
const EXPECTED_TOKENS = [
  { name: 'ink', search: '#1b1d1c' },
  { name: 'paper', search: '#f4f5f2' },
  { name: 'felt', search: '#2f6b53' },
  { name: 'felt-deep', search: '#255843' },
  { name: 'marigold', search: '#e8a13a' },
  { name: 'slate', search: '#5b636a' },
  { name: 'line', search: 'rgba(27, 29, 28,' },
  { name: 'card (border-radius)', search: '--card' },
  { name: 'snap (transition-duration)', search: '--snap' },
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
  if (css.includes(token.search)) {
    console.log(`  ✓ ${token.name} (${token.search})`);
  } else {
    console.error(`  ✗ ${token.name} (${token.search}) — NOT FOUND`);
    allFound = false;
  }
}

if (allFound) {
  console.log('\nAll design tokens verified.');
} else {
  console.error('\nSome design tokens are missing from the build output.');
  process.exit(1);
}
