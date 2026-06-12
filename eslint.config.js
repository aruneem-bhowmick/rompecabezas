import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

/**
 * ESLint flat configuration for the Rompecabezas project.
 *
 * Combines TypeScript strict checking, React best-practice rules,
 * React Hooks validation, Vite fast-refresh compatibility, and
 * Prettier conflict resolution into a single rule set that applies
 * to every TypeScript source file under src/.
 *
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  { ignores: ['dist/'] },

  js.configs.recommended,

  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      /* TypeScript recommended rules */
      ...tsPlugin.configs.recommended.rules,

      /* React recommended rules */
      ...reactPlugin.configs.recommended.rules,

      /* React 17+ JSX transform — no need to import React in scope */
      'react/react-in-jsx-scope': 'off',

      /* Disable prop-types checking; TypeScript handles type safety */
      'react/prop-types': 'off',

      /* React Hooks: enforce rules-of-hooks and exhaustive-deps */
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      /* Vite fast-refresh: only export components from modules */
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      /* Prefer the TypeScript-aware no-unused-vars over the base rule */
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  /* Test files — TypeScript-aware linting without React-specific rules */
  {
    files: ['tests/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  prettierConfig,
];
