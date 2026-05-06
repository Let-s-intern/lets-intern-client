import { baseConfig } from '@letscareer/eslint-config/base';

/**
 * @letscareer/api 전용 ESLint flat config.
 *
 * - `src/generated/**`는 orval이 생성·덮어쓰는 영역이므로 lint에서 제외.
 *   타입 체크는 tsconfig include에 포함돼 그대로 유지된다.
 * - 공용 base 룰셋은 그대로 사용.
 *
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  { ignores: ['**/generated/**', 'dist/**', 'node_modules/**'] },
  ...baseConfig,
];
