/*
  검사 대상은 의존성이 없는 zod enum 하나지만, `file.ts` 를 import 하는 것만으로
  jest 가 파싱하지 못하는 모듈 두 개가 딸려 온다.

  - `@/utils/axios` → `packages/api/src/env.ts` 의 `import.meta`
  - `@/utils/random` → ESM 으로만 배포되는 `nanoid`

  둘 다 이 테스트와 무관하므로 목으로 막는다. `jest.config.js` 가 같은 이유로
  `lucide-react` 를 스텁에 매핑해 둔 것과 같은 처방이다.
*/
jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { post: jest.fn(), get: jest.fn() },
}));
jest.mock('@/utils/random', () => ({
  __esModule: true,
  generateRandomString: () => 'ab',
}));

import { fileType } from './file';

/*
  이 enum 은 zod 다 — 값이 빠져 있어도 타입체크는 통과하고 업로드 직전 parse 에서
  터진다. 컴파일러가 잡아 주지 않으므로 서버 `FileType.java` 와의 대조를
  테스트로 못박는다.
*/
describe('fileType', () => {
  it('LIVE_MENTORING 을 받는다 — 서버 FileType.java:27 과 대응', () => {
    expect(fileType.parse('LIVE_MENTORING')).toBe('LIVE_MENTORING');
  });

  it('서버에 없는 값은 거른다', () => {
    expect(() => fileType.parse('LIVE_MENTORING_QUESTION')).toThrow();
    expect(() => fileType.parse('')).toThrow();
  });
});
