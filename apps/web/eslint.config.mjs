import { createNextConfig } from '@letscareer/eslint-config/next';

export default [
  ...createNextConfig(import.meta.url),
  {
    rules: {
      '@next/next/no-img-element': 'off',
      // 의도적으로 미사용임을 표현하는 `_` prefix 관행을 허용 — 의도 표현용 false-positive 감축
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      // console.error / console.warn 은 에러 로깅·경고 라우팅의 표준 패턴이므로 허용.
      // 디버그용 console.log/info/debug 만 경고로 남겨 의도적 로깅과 분리.
      'no-console': ['warn', { allow: ['error', 'warn'] }],
    },
  },
  {
    // jest 의 module-isolation(`jest.resetModules()` 직후 `require()`)이 필요한
    // 테스트 파일에서는 동적 require 패턴을 허용. ESM `import` 로 바꾸면
    // process.env 변화에 따라 모듈을 재평가할 수 없어 회귀 테스트가 깨진다.
    files: ['**/*.test.{ts,tsx,js,jsx}', '**/__tests__/**/*.{ts,tsx,js,jsx}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    ignores: ['.config/*', 'node_modules/*', '.next/*', 'dist/*'],
  },
];
