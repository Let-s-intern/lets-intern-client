import { reactConfig } from '@letscareer/eslint-config/react';

export default [
  {
    ignores: [
      '*.config.mjs',
      'storybook-static/*',
      // JitsiEmbed 폴더 전체 검사에서 제외
      'src/JitsiEmbed/**',
    ],
  },
  ...reactConfig,
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['next/*', 'next/image', 'next/link', 'next/navigation'],
        },
      ],
    },
  },
  {
    // Storybook의 `render: (args) => { useState(...) }` 패턴은 실제로는 문제없지만,
    // 함수명이 대문자로 시작하지 않고 use*도 아니라서 react-hooks 규칙이 오탐한다.
    files: ['**/*.stories.tsx'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
];
