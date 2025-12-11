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
    ignores: ['.config/*', 'node_modules/*', '.next/*', 'dist/*'],
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
      'no-restricted-globals': [
        'warn',
        {
          name: 'encodeURIComponent',
          message:
            '블로그나 프로그램 상세 페이지로 넘어갈 때 title까지 직접 지정하지 마세요. getProgramPathname 또는 getBlogPathname 함수를 사용하거나 id까지만 넘기고 제목은 알아서 처리되도록 해주세요.',
        },
      ],
      // TODO: 추후 제거하여 최적화해보도록 한다.
      '@next/next/no-img-element': 'off',

      // switch
      // '@typescript-eslint/switch-exhaustiveness-check': 'warn',

      // lexical
      '@typescript-eslint/ban-ts-comment': 'warn',
    },
  },
];

export default eslintConfig;
