/** @type {import('eslint').Linter.Config[]} */
export const baseConfig = [
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
      '@typescript-eslint/no-explicit-any': 'warn',
      // console.error / console.warn 은 에러 로깅·경고 라우팅의 표준 패턴이므로 허용
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      'react/react-in-jsx-scope': 'off',
      'object-shorthand': ['warn', 'always'],
      'no-useless-rename': 'warn',
      'react/jsx-key': ['warn', { checkFragmentShorthand: true }],
      'react/prop-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
    },
  },
];
