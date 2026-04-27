# Tasks: PR #2286 리뷰 수정사항 — 2026-04-26

> 대상 PR: [#2286](https://github.com/Let-s-intern/lets-intern-client/pull/2286) `LC-3000-npm-pnpm-전환` → `test-260424`
> 리뷰 방식: 3 specialized agents (code-reviewer, silent-failure-hunter, pr-test-analyzer) 병렬 실행 후 직접 검증
> 상태: 🔲 머지 전 처리 필요
> 작성: 2026-04-26 세션

본 문서는 PR #2286 리뷰에서 발견된 이슈를 우선순위별로 정리. 각 항목은 직접 코드 검증을 거쳐 확정됨(에이전트 보고 그대로가 아님).

---

## 1. Critical (머지 차단 — 본 PR에서 처리 권장)

### C1. 빈 baseURL → self-origin 요청 (silent failure)

**증상**: 환경변수 SERVER_API/V2/V3 미설정 시 axios가 `''`을 baseURL로 받아 **현재 브라우저 origin에 상대 요청**을 보냄. 사용자에게는 "API가 이상하다"는 모호한 증상만 도달.

**위치**:
- `packages/api/src/env.ts:24-45` — SERVER_API/V2/V3/API_BASE_PATH 모두 `''`로 fallback
- `packages/api/src/axiosV2.ts:26` — `baseURL: options?.baseURL ?? SERVER_API_V2`
- `packages/api/src/axiosV3.ts:14` — 동일 패턴
- `apps/web/src/utils/auth.ts:8-9` — `(process.env.NEXT_PUBLIC_SERVER_API_V2 ?? '') + '/user/token'` → `'/user/token'`이 되어 self-origin PATCH → 토큰 갱신 무한 실패 → **사용자 silent 자동 로그아웃**
- `apps/admin/src/utils/auth.ts:8-9`, `apps/mentor/src/utils/auth.ts:8-9` — 동일 패턴
- `apps/web/src/__tests__/api-env.test.ts:38-46` — 빈 문자열 fallback을 **회귀 테스트로 잠금**까지 함

**수정 방향**:
- [ ] `packages/api/src/env.ts`: 모듈 로드 시점에 SERVER_API/V2/V3 검증 추가 (또는 axios factory에서)
  ```ts
  if (!SERVER_API_V2) throw new Error('SERVER_API_V2 not configured');
  ```
- [ ] `axiosV2.ts:26`, `axiosV3.ts:14`: `baseURL`이 비어 있으면 throw
- [ ] `auth.ts`(web/admin/mentor 3곳): `REFRESH_PATH` 모듈 로드 시 absolute URL 검증
- [ ] `api-env.test.ts:38-46`: "빈 문자열 fallback 잠금" 테스트는 **"throw하는지"** 검증으로 갱신

**검증**: 모든 env 미설정 상태에서 빌드/테스트 시 명확한 에러 메시지가 노출되는지 확인.

---

### C2. admin/mentor의 환경변수 검증 부재

**증상**: web만 빌드 단계에서 env 누락 시 throw하고 admin/mentor는 검증 없이 빌드 통과. secret 누락이 운영 사고로 silent하게 변환됨.

**위치**:
- `apps/web/next.config.mjs:2-8` — `NEXT_PUBLIC_API_BASE_PATH`, `NEXT_PUBLIC_SERVER_API` throw ✅ (있음)
- `apps/admin/vite.config.ts` — env 검증 코드 **0줄** ❌
- `apps/mentor/vite.config.ts` — env 검증 코드 **0줄** ❌
- web도 V2/V3는 미검증 (non-null `!`은 컴파일러용일 뿐 런타임 효과 없음)

**수정 방향**:
- [ ] `apps/admin/vite.config.ts` 상단에 가드 추가:
  ```ts
  if (!process.env.VITE_API_BASE_PATH) throw new Error('VITE_API_BASE_PATH is not defined');
  if (!process.env.VITE_SERVER_API) throw new Error('VITE_SERVER_API is not defined');
  if (!process.env.VITE_SERVER_API_V2) throw new Error('VITE_SERVER_API_V2 is not defined');
  ```
- [ ] `apps/mentor/vite.config.ts`도 동일
- [ ] `apps/web/next.config.mjs`에 V2/V3 검증 추가
- [ ] (선택) 검증 로직을 `packages/config/env-validator` 같은 공유 유틸로 추출

**검증**: secret 일부 누락 상태에서 `pnpm build:admin` / `build:mentor` / `build:web` 모두 명확한 에러로 fail하는지 확인.

---

### C4. Playwright 0 specs → CI step 무조건 fail

**증상**: e2e/ 디렉토리에 spec 파일이 0개라 Playwright가 `Error: No tests found`로 exit 1. 워크플로우 6) E2E step에 `continue-on-error`가 없어서 web 워크플로우 전체가 빨강.

**위치**:
- `apps/web/e2e/` — README.md만 남음 (이번 PR 마지막 commit `7b42abb43`에서 home.spec.ts 삭제)
- `apps/web/playwright.config.ts:18` — `webServer.command: 'pnpm dev'` (0 spec이어도 dev 서버 부팅 시도)
- `.github/workflows/build-web.yml:81-82` — 6) E2E step, `continue-on-error` 없음

**검증 결과 (실측)**:
```bash
$ pnpm playwright test --reporter=list --workers=1
Error: No tests found
$ echo $?
1
```

**수정 방향 (택 1)**:
- [ ] **A. step 가드 추가** (가장 작은 변경):
  ```yaml
  - name: '6) E2E (Playwright, web 전용)'
    if: hashFiles('apps/web/e2e/**/*.spec.ts') != ''
    run: pnpm --filter @letscareer/web e2e
  ```
- [ ] **B. placeholder spec 1개 부활**: 의미 있는 시나리오 1개 작성. (단, env 누락 시 dev 서버도 부팅 못 하니 C2와 결합 처리 필요)
- [ ] **C. 6) E2E에도 `continue-on-error: true`** (다른 검사들과 일관성, 임시방편)

**권장**: 옵션 A + 향후 진짜 시나리오 추가 시 가드 자동 해제.

---

## 2. Important (별도 PR 또는 머지 후 follow-up)

### I1. Sidebar 외부 링크 `??` fallback 버그

**증상**: `??`는 빈 문자열에 발동 안 하므로, `.env.example`처럼 빈 값으로 deploy되면 `<a href="">` 또는 `<a href="#">`로 렌더링되어 클릭 무반응 또는 의도치 않은 동작.

**위치**:
- `apps/admin/src/layout/AdminSidebar.tsx:9` — `import.meta.env.VITE_WEB_URL ?? '/'`
- `apps/mentor/src/layout/MentorSidebar.tsx:103` — `import.meta.env.VITE_WEB_URL ?? '#'`
- `.env.example`이 둘 다 `VITE_WEB_URL=` (빈 문자열)

**수정 방향**:
- [ ] `??` → `||` 변경 (빈 문자열도 fallback으로 처리)
- [ ] 또는 빈 값일 때 링크 자체를 비표시 (`null` 반환)
- [ ] `.env.example`의 `VITE_WEB_URL=`를 명확한 placeholder URL로 변경 권장

---

### I2. `client.ts` API_BASE_PATH 의미 변경 — 호출처 마이그레이션 검증 부재

**증상**: `${BASE_PATH}${endpoint}` 패턴인데 BASE_PATH가 "호스트 루트"로 좁혀짐. 호출처에서 endpoint에 `/v1/...` 버전 prefix를 붙이도록 마이그레이션됐는지 검증 안 됨.

**위치**:
- `apps/admin/src/utils/client.ts:24`
- `apps/web/src/utils/client.ts`

**수정 방향**:
- [ ] grep으로 호출처 전수 검사: 모든 client 호출 endpoint가 `/v1/`, `/v2/` 같은 prefix 포함하는지
- [ ] 회귀 테스트 추가: dev/test 환경에서 실제 client 호출이 올바른 URL로 가는지
- [ ] (선택) client에서 endpoint가 `/`로 시작하지 않으면 throw하는 가드 추가

---

### I3. admin/mentor `eslint.config.mjs` 완전 동일

**증상**: `apps/admin/eslint.config.mjs`와 `apps/mentor/eslint.config.mjs`가 git blob hash까지 동일(34줄). 향후 한쪽만 수정되어 drift 발생 위험.

**수정 방향**:
- [ ] `packages/config/eslint`에 `vite-react.mjs` preset 신설:
  ```js
  export const viteReactConfig = [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    { files: ['**/*.{ts,tsx,js,jsx}'], languageOptions: {...}, plugins: {...}, rules: {...} },
    ...baseConfig,
  ];
  ```
- [ ] `apps/admin/eslint.config.mjs`, `apps/mentor/eslint.config.mjs`는 import + ignores만 남김

---

### I4. `getRobotsMetadata` 정책 변경 명시 부재

**증상**: 이전 `NO_INDEX === 'true'`만 noindex → 이후 `profile !== 'production'` 모두 noindex로 강화. SEO 정책 변경인데 PR 설명/주석 없음.

**위치**: `apps/web/src/utils/url.ts:135-141`

**수정 방향**:
- [ ] `getRobotsMetadata` JSDoc에 정책 명문화
- [ ] PR 설명에 정책 변경 내역 추가
- [ ] 운영 배포 전 `NEXT_PUBLIC_PROFILE=production` 확실히 설정되어 있는지 확인

---

### I5. `requestRefresh` JSON 파싱 catch가 status 정보 swallow

**증상**: `try { payload = await response.json() } catch { payload = null }` — 502/HTML 응답이 인증 실패와 구분 불가. 디버깅 시 status 정보 사라짐.

**위치**: `apps/web/src/utils/auth.ts:39-43`

**수정 방향**:
```ts
try {
  payload = await response.json();
} catch (e) {
  console.error('[letscareer] refresh-json-parse', { status: response.status, error: e });
  payload = null;
}
```

---

### I6. deprecated `buildV2BaseUrl` 여전히 export

**증상**: `packages/api/src/index.ts:14`에서 export 유지 → 신규 코드가 무심코 import 가능. `@deprecated` JSDoc만으론 부족.

**수정 방향**:
- [ ] `index.ts`에서 export 제거
- [ ] 또는 호출 시 `console.warn('buildV2BaseUrl is deprecated')` 추가
- [ ] 제거 일정/마일스톤 주석에 명시

---

### I7. (NEW — 직접 발견) `auth.ts` if/else 양쪽이 동일

**증상**: 의도는 status별 분기였을 텐데 결과적으로 양쪽이 같은 동작. dead conditional branching.

**위치**: `apps/web/src/utils/auth.ts:117-124`

```ts
} catch (err) {
  const status = (err as Error & { status?: number }).status;
  if (status === 401) {
    logoutAndRefreshPage();
  } else {
    logoutAndRefreshPage();   // ← 동일!
  }
  return false;
}
```

**수정 방향**:
- [ ] 의도 확인 후 (a) if/else 제거하고 단순 호출만 남기기, (b) 또는 status별 다른 처리(예: 5xx 시 retry, 401 시 logout) 구현

---

### I8. (C3에서 강등) jest.config 글로벌 env 주입은 코드 스멜

**증상**: `apps/web/jest.config.js:8-9`의 `??=`가 모든 jest 테스트 시작 시 env 기본값을 주입. 격리 자체는 정상이지만 (`beforeEach`에서 reset), test setup 파일로 옮기는 게 더 명시적.

**수정 방향** (선택):
- [ ] `??=` 주입을 `jest.setup.ts`로 이동 → 의도가 더 명확해짐

---

## 3. Test Gaps (별도 PR — 보안 우선)

### T1. ⚠️ `sanitizeUrl` 테스트 부재 (보안 함수)

**위치**: `apps/web/src/utils/url.ts` (sanitizeUrl 함수), `url.test.ts`에는 부재

**필요 케이스**:
- [ ] `javascript:alert(1)` → `'about:blank'` 반환
- [ ] `data:` → `'about:blank'`
- [ ] `https://valid-host` → 통과
- [ ] malformed URL → 원본 또는 명시적 처리

**중요도**: 7 (XSS 직결)

### T2. `getCanonicalSiteUrl` env 모두 미지정 시 fallback 케이스
- [ ] 모든 env 미설정 시 `'http://localhost:3000'` 반환 검증

### T3. `getCanonicalUrl` 이중 슬래시 비발생 단언
- [ ] `getCanonicalUrl('/path')` (leading slash 있는 입력) 정상 처리
- [ ] 결과 URL에 `//` 없는지 단언

### T4. `getBlogPathname`/`getProgramPathname` 인코딩 검증
- [ ] 한글, 공백, `?#&` 처리

### T5. 영구 placeholder `sample.test.tsx` 처리

**위치**: `apps/web/src/__tests__/sample.test.tsx`, `apps/admin/...`, `apps/mentor/...`

**수정 방향**:
- [ ] 각 파일에 TODO 주석 추가 (`// TODO: 실 단위 테스트 추가 후 제거`)
- [ ] 또는 첫 실 테스트 추가 시 즉시 제거

---

## 4. Suggestions (선택, 시간 여유 시)

- [ ] `apps/web/jest.config.js:4-5` — `next/jest` preset이 dotenv 처리하는지 확인 후 명시적 require 두 줄 제거 가능 여부 검토
- [ ] `packages/api/src/env.ts:9-18` — `Function('return import.meta')()` catch에 CSP 환경 fallback 주석 한 줄 추가
- [ ] CI `concurrency.cancel-in-progress: true` — main push 시 배포 추적 취소 위험. **PR 한정으로 분기**:
  ```yaml
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}
  ```
- [ ] `apps/web/e2e/README.md` — "brwoser" 오타 수정

---

## 5. Strengths (참고용)

이번 PR의 잘 된 결정. 향후 비슷한 작업 시 참고:

- **env 키 분리 의미를 일관 문서화**: `.env.example`, `packages/api/src/env.ts` JSDoc, `axios*.ts` 주석 모두에서 SERVER_API/V2/V3/BASE_PATH 의미를 같은 어휘로 설명. literal access 강제 이유까지 코드 옆에 남긴 가독성은 모범 사례.
- **사이드바·메타데이터 SSOT 일원화**: 하드코딩된 `https://www.letscareer.co.kr` → `getCanonicalSiteUrl()`로 일원화하면서 `url.test.ts` 단위 테스트 동시 추가.
- **CI 5단계 직렬 + `if: always()` 아티팩트 업로드**: 점진 전환 의도가 명확. Playwright을 web에만 도입하는 차등도 합리적.
- **`schema.test.ts` 968줄 cleanup**: 실제로 105개 `skip()` 호출만 있던 미완성 코드라 정합성 있는 정리.

---

## 6. 권장 액션 플랜

### 6-1. 본 PR 머지 전 (Critical 3건)

```
1. C1 (env.ts/axios baseURL 가드 추가)
   → packages/api/src/env.ts, axiosV2.ts, axiosV3.ts, auth.ts × 3
   → api-env.test.ts 갱신

2. C2 (admin/mentor vite.config.ts 검증 추가)
   → apps/admin/vite.config.ts, apps/mentor/vite.config.ts
   → apps/web/next.config.mjs에 V2/V3 검증 추가

3. C4 (Playwright 0 specs 가드)
   → .github/workflows/build-web.yml의 6) E2E step에 if 가드
```

### 6-2. 머지 후 follow-up PR (1주 내)

```
1. I1 (sidebar ?? → || 또는 조건부 렌더) — 사용자 노출 버그
2. I2 (client.ts 호출처 검증)
3. I7 (auth.ts dead branch 정리)
4. T1 (sanitizeUrl 테스트 추가) — 보안 회귀 보호
```

### 6-3. 정리 PR (월 단위)

```
1. I3 (eslint.config 중복 제거 → vite-react preset)
2. I5, I6, I8 (코드 스멜 정리)
3. T2~T5 (테스트 보강)
4. Suggestions
```

---

## 7. 검증 체크리스트 (각 fix 후)

각 항목 처리 후 다음을 확인:

- [ ] `pnpm typecheck` 통과
- [ ] `pnpm test` 통과 (또는 영향 받은 앱만 `pnpm test:<app>`)
- [ ] `pnpm lint` (또는 `lint:<app>`) 통과 — 새로운 errors 없는지
- [ ] 영향 받은 앱의 `pnpm dev:<app>` 정상 부팅
- [ ] env 누락 케이스 수동 테스트: 의도된 throw 발생하는지
- [ ] CI 워크플로우 push 후 expected step만 빨강/초록

---

## 8. 메타정보

- **리뷰 에이전트**: code-reviewer, silent-failure-hunter, pr-test-analyzer (병렬 실행)
- **검증 방식**: 에이전트 보고 → 직접 코드 검증 (특히 Critical) → C3 강등, I7 추가 발견
- **참고 메모**: `.claude/tasks/memos/ci-prettier-eslint-260426.md` (이번 세션 인프라 정리 후 잔여 작업)
- **연관 PRD**: 없음 (CI 인프라 cleanup 성격)
