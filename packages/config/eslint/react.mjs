import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { baseConfig } from './base.mjs';

/** @type {import('eslint').Linter.Config[]} */
export const reactConfig = [
  { ignores: ['dist/*', 'node_modules/*', 'coverage/*', '.config/*'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: { react, 'react-hooks': reactHooks },
    settings: { react: { version: 'detect' } },
    rules: { ...reactHooks.configs.recommended.rules },
  },
  ...baseConfig,
];
