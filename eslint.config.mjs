// @ts-nocheck

// import pluginJs from '@eslint/js';
// import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';

import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn',
      'react/react-in-jsx-scope': 'off',
      'object-shorthand': ['warn', 'always'],
      'no-useless-rename': 'warn',
      'react/jsx-key': ['warn', { checkFragmentShorthand: true }],
      'react/prop-types': 'off',

      // switch
      '@typescript-eslint/switch-exhaustiveness-check': 'warn',

      // lexical
      '@typescript-eslint/ban-ts-comment': 'warn',
    },
  },
];

export default eslintConfig;
