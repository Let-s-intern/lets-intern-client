import { reactConfig } from '@letscareer/eslint-config/react';

export default [
  ...reactConfig,
  {
    rules: {
      // 의도적으로 미사용임을 표현하는 `_` prefix 관행을 허용 — false-positive 감축
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      // console.error / console.warn 은 에러 로깅·경고 라우팅의 표준 패턴이므로 허용
      'no-console': ['warn', { allow: ['error', 'warn'] }],
    },
  },
];
