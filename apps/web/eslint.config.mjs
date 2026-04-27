import { FlatCompat } from '@eslint/eslintrc';
import { baseConfig } from '@letscareer/eslint-config/base';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...baseConfig,
  {
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
  {
    ignores: ['.config/*', 'node_modules/*', '.next/*', 'dist/*'],
  },
];

export default eslintConfig;
