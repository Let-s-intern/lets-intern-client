import { createNextConfig } from '@letscareer/eslint-config/next';

export default [
  ...createNextConfig(import.meta.url),
  {
    rules: {
      '@next/next/no-img-element': 'off',
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
