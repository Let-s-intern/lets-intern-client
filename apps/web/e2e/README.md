# apps/web E2E

## 실행

```bash
# 1) 한번만 brwoser 설치
pnpm --filter @letscareer/web e2e:install

# 2) 테스트 실행 (webServer 자동 부팅)
pnpm --filter @letscareer/web e2e

# 3) UI 모드
pnpm --filter @letscareer/web e2e:ui
```

## 정책

- **Chromium 만 사용** — Firefox/WebKit 빌드 시간 절약. 추후 필요 시 확장.
- **web 에만 도입** — admin/mentor 는 중요도 기반 차등화로 단위 테스트만 운영.
- **dev 서버 부팅 의존** — `playwright.config.ts` 의 `webServer.command = 'pnpm dev'`.
  CI 에서 wall-clock 부담이 크면 `pnpm start` (build → start) 로 갈아끼움.

## 디렉토리 구조

```
apps/web/e2e/
  global-setup.ts                       — 환경변수 기반 로그인 → storageState 저장
  payment-flow.anonymous.spec.ts        — 비로그인: 챌린지 → 결제 진입 스모크
  auth-mypage.authenticated.spec.ts     — 로그인: 마이페이지 + SSO 해시 회귀
  .auth/storageState.json               — gitignored, globalSetup 이 생성
```

## 환경 변수

`apps/web/.env.test.local.example` 을 `apps/web/.env.test.local` 로 복사 후 값 채우기.

| 변수 | 의미 | 미설정 시 |
|------|------|-----------|
| `PLAYWRIGHT_BASE_URL` (또는 `E2E_BASE_URL`) | 테스트 대상 baseURL | localhost:3000 fallback |
| `E2E_TEST_USER_EMAIL` | 로그인 계정 이메일 | authenticated 시나리오 자동 skip |
| `E2E_TEST_USER_PW` | 로그인 계정 비밀번호 | authenticated 시나리오 자동 skip |
| `E2E_SSO_TEST_HASH` | SSO 1회용 해시 (회귀 테스트) | SSO 시나리오 자동 skip |
| `E2E_SAMPLE_CHALLENGE_PATH` | 결제 스모크용 챌린지 path | `/program` fallback |

## Project 매핑

`playwright.config.ts` 의 두 project 가 spec 파일명 패턴으로 매핑된다:

- `chromium-anonymous` — `*.anonymous.spec.ts` (storageState 미사용)
- `chromium-authenticated` — `*.authenticated.spec.ts` (storageState 사용)
