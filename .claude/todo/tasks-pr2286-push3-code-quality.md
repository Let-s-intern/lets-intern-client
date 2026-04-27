# Tasks: PR #2286 리뷰 수정 - Push 3 (코드 품질 정리)

> PRD: `todo/tasks-pr2286-review-260426.md` (§2 Important 일부 + §4 Suggestions)
> Push 범위: ESLint config 중복 제거, deprecated 함수 정리, jest setup 정리, SEO 정책 문서화, CI 동작 개선. 동작 변경 없이 유지보수성·일관성 향상.
> 상태: 🔲 진행 중
> **선행 조건**: Push 1 머지 후. Push 2와 병렬 가능.

---

### 관련 파일

- `packages/config/eslint/vite-react.mjs` — 신규 preset 파일
- `apps/admin/eslint.config.mjs`, `apps/mentor/eslint.config.mjs` — preset import로 단순화
- `packages/api/src/index.ts` — deprecated `buildV2BaseUrl` export 제거
- `packages/api/src/env.ts:9-18` — CSP fallback 주석 추가
- `apps/web/jest.config.js` — `??=` 주입을 setup으로 이동
- `apps/web/jest.setup.ts` — env 기본값 setup
- `apps/web/src/utils/url.ts` — `getRobotsMetadata` JSDoc 정책 명문화
- `.github/workflows/build-{web,admin,mentor}.yml` — `cancel-in-progress` PR 한정
- `apps/web/e2e/README.md` — 오타 수정

---

## 작업

- [ ] 3.0 코드 품질·일관성 정리 (Push 3)
    - [ ] 3.1 ESLint vite-react preset 추출 및 admin/mentor 통합
        - 설명: 동일 34줄 중복인 admin/mentor `eslint.config.mjs`를 `packages/config/eslint/vite-react.mjs`로 추출. 두 앱은 preset import + ignores만 남김.
        - 영향 파일: `packages/config/eslint/vite-react.mjs` (신규), `packages/config/eslint/package.json` (exports), `apps/admin/eslint.config.mjs`, `apps/mentor/eslint.config.mjs` 4개
        - [ ] 3.1.T1 테스트 코드 작성: 두 앱 lint 결과가 변경 전과 동일한지 비교 (errors/warnings 수치)
        - [ ] 3.1.T2 테스트 실행 및 검증: `pnpm lint:admin`, `pnpm lint:mentor` 출력 동일성 확인
    - [ ] 3.2 deprecated `buildV2BaseUrl` export 제거
        - 설명: `packages/api/src/index.ts:14`의 export 제거. 호출처 grep 후 잔존 사용 정리.
        - 영향 파일: `packages/api/src/index.ts`, `packages/api/src/axiosV2.ts` (해당 함수 정의 제거 또는 internal 격리), 호출처 (있다면)
        - [ ] 3.2.T1 테스트 코드 작성: `@letscareer/api` export 목록에 `buildV2BaseUrl` 부재 단언
        - [ ] 3.2.T2 테스트 실행 및 검증: `pnpm typecheck` 통과, 의도된 호출처 0개 확인
    - [ ] 3.3 `env.ts` CSP fallback 주석 추가
        - 설명: `Function('return ... import.meta ...')()` catch가 CSP/SES 환경 fallback임을 한 줄 주석으로 명시. silent 무력화 가능성 환기.
        - 영향 파일: `packages/api/src/env.ts:9-18` 1개
        - [ ] 3.3.T1 테스트 코드 작성: 주석 추가뿐이라 별도 테스트 불필요 (skip)
        - [ ] 3.3.T2 테스트 실행 및 검증: `pnpm typecheck` 통과
    - [ ] 3.4 jest 글로벌 env 주입을 setup 파일로 이동
        - 설명: `apps/web/jest.config.js:8-9`의 `??=` 주입을 `jest.setup.ts`로 이동. config는 testEnvironment·moduleNameMapper만 담당.
        - 영향 파일: `apps/web/jest.config.js`, `apps/web/jest.setup.ts` 2개
        - [ ] 3.4.T1 테스트 코드 작성: `api-env.test.ts`가 여전히 격리 동작 확인
        - [ ] 3.4.T2 테스트 실행 및 검증: `pnpm test:web` 통과 (특히 api-env.test.ts)
    - [ ] 3.5 `getRobotsMetadata` 정책 JSDoc 명문화
        - 설명: 이전 NO_INDEX-only → 이후 non-production 전체 noindex로 정책 강화된 점을 JSDoc에 명시. SEO 회귀 방지.
        - 영향 파일: `apps/web/src/utils/url.ts:135-141` 1개
        - [ ] 3.5.T1 테스트 코드 작성: 기존 `url.test.ts`의 `getRobotsMetadata` 케이스에 정책 분기 단언 보강
        - [ ] 3.5.T2 테스트 실행 및 검증: `pnpm test:web` 통과
    - [ ] 3.6 워크플로우 `cancel-in-progress`를 PR 한정으로
        - 설명: `concurrency.cancel-in-progress: true`가 main push 시 배포 추적 취소 가능. PR 이벤트일 때만 cancel.
        - 영향 파일: `.github/workflows/build-web.yml`, `build-admin.yml`, `build-mentor.yml` 3개
        - 변경: `cancel-in-progress: ${{ github.event_name == 'pull_request' }}`
        - [ ] 3.6.T1 테스트 코드 작성: 워크플로우 syntax 검증 (actionlint)
        - [ ] 3.6.T2 테스트 실행 및 검증: PR/main push 둘 다에서 의도된 동작 확인 (PR: cancel, main: 보존)
    - [ ] 3.7 e2e README 오타 + dotenv 명시 require 검토
        - 설명: `apps/web/e2e/README.md` "brwoser" → "browser". `apps/web/jest.config.js:4-5`의 `require('dotenv').config(...)`이 next/jest preset과 중복인지 검증, 중복이면 제거.
        - 영향 파일: `apps/web/e2e/README.md`, `apps/web/jest.config.js` 2개
        - [ ] 3.7.T1 테스트 코드 작성: dotenv 제거 시 jest 동작 회귀 테스트 (api-env.test.ts 통과 여부)
        - [ ] 3.7.T2 테스트 실행 및 검증: `pnpm test:web` 통과

---

## 검증 체크리스트 (Push 3 완료 후)

- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test` 모두 통과
- [ ] admin/mentor lint 결과 변경 전후 동일 (수치 비교)
- [ ] `@letscareer/api` export에 deprecated 함수 없음
- [ ] CI 워크플로우 PR/main push 양쪽 시나리오 검증
