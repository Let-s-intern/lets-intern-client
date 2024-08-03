// @ts-nocheck

// import pluginJs from '@eslint/js';
import hooksPlugin from 'eslint-plugin-react-hooks';
// import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import eslint from '@eslint/js';
import react from 'eslint-plugin-react/configs/recommended.js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist/*',
      // Temporary compiled files
      '**/*.ts.build-*.mjs',

      '.vercel/*',
      // JS files at the root of the project
      '*.js',
      '*.cjs',
      '*.mjs',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        project: './tsconfig.json',
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        1,
        {
          argsIgnorePattern: '^_',
        },
      ],
    },
  },

  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    ...react,
    languageOptions: {
      ...react.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  {
    plugins: {
      'react-hooks': hooksPlugin,
    },
    rules: hooksPlugin.configs.recommended.rules,
  },
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
);
