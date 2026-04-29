# apps/web E2E

POM (Page Object Model) + Pipeline 패턴 기반의 E2E 테스트 스위트.

## 실행

```bash
# 1) 한 번만 브라우저 설치
pnpm --filter @letscareer/web e2e:install

# 2) 테스트 실행 (별도 터미널에서 dev 서버 띄워둘 것)
pnpm --filter web dev   # 다른 터미널
pnpm --filter @letscareer/web e2e

# 3) UI 모드 (인터랙티브 디버깅, 원격 SSH 면 포트포워딩 9323)
pnpm --filter @letscareer/web e2e:ui

# 4) 특정 시나리오만
pnpm --filter @letscareer/web e2e --grep "login -> purchase"
```

## 디렉토리 구조

```
apps/web/e2e/
├── support/                    — 인프라 (helpers + setup)
│   ├── log.ts                  · [E2E HH:MM:SS] prefix 콘솔 로그
│   ├── settle.ts               · domcontentloaded -> networkidle -> buffer 대기
│   ├── runDir.ts               · 실행 디렉토리 (success/failure/skipped × timestamp)
│   ├── pipeline.ts             · Pipeline.run(label, fn, snap?) 단계 오케스트레이터
│   └── global-setup.ts         · storageState 생성기 (환경변수 기반)
├── pages/                      — Page Object Model (per-page)
│   ├── BasePage.ts             · 베이스 클래스 (page + settle)
│   ├── HomePage.ts             · 홈 (/) — clickLogin, openProgramsDropdown, gotoAllPrograms
│   ├── LoginPage.ts            · /login — loginWith (404 자동 복구 포함)
│   ├── ProgramListPage.ts      · /program — getChallengeCount, openChallengeByIndex
│   ├── ChallengeDetailPage.ts  · /program/challenge/[id]/[slug] — checkStatus, clickApply
│   ├── PaymentInputPage.ts     · 결제 입력 — clickEnrollIfPresent, clickPayZero
│   └── OrderResultPage.ts      · /order/result — expectSuccess
├── flows/                      — 재사용 가능한 시나리오 조각 (POM 조합)
│   └── LoginFlow.ts            · 홈 -> /login -> 인증 -> 복귀 (한 번에 처리)
├── specs/                      — 실제 테스트 (testDir)
│   ├── auth-mypage.authenticated.spec.ts
│   ├── login-to-purchase.anonymous.spec.ts
│   └── payment-flow.anonymous.spec.ts
├── .auth/                      — gitignored (storageState.json)
└── README.md
```

## 디자인 패턴

### POM (Page Object Model)
각 페이지를 클래스로 캡슐화. 메서드는 다음 페이지의 POM 을 반환 -> method chain.

```typescript
const home = await new HomePage(page).goto();
const login = await home.clickLogin();          // -> LoginPage
const homeAuth = await login.loginWith(...);    // -> HomePage
const list = await homeAuth.gotoAllPrograms();  // -> ProgramListPage
const detail = await list.openChallengeByIndex(0); // -> ChallengeDetailPage
```

### Pipeline
단계 오케스트레이터 — `test.step` + 자동 로그 + 스크린샷 한 번에.

```typescript
const flow = new Pipeline(page, runDir);
const home = await flow.run('1. 홈 진입', () => new HomePage(page).goto(), '홈');
//                          ↑ 라벨        ↑ 액션              ↑ 스크린샷 이름
```

### Flows
여러 POM 호출을 묶은 재사용 함수. 같은 시퀀스가 여러 spec 에서 반복될 때 추출.

```typescript
const home = await loginFlow(page, { email, password, homeWait, afterLoginWait });
```

## 산출물

`apps/web/test-results/e2e-screenshots/<status>/<YYYYMMDD-HHMMSS>/`

| status | 의미 |
|---|---|
| `success/` | 통과한 실행 (PNG + meta.txt) |
| `failure/` | 실패한 실행 (PNG + 99-실패시점.png + error.txt) |
| `skipped/` | skip 된 실행 |
| `_pending/` | 실행 중 (afterEach 에서 위 셋으로 이동) |

## 환경 변수

`apps/web/.env.test.local.example` 을 `apps/web/.env.test.local` 로 복사 후 값 채우기.

| 변수 | 의미 | 미설정 시 |
|------|------|-----------|
| `PLAYWRIGHT_BASE_URL` | 테스트 대상 baseURL | localhost:3000 fallback |
| `E2E_TEST_USER_EMAIL` | 로그인 계정 이메일 | authenticated/login 시나리오 skip |
| `E2E_TEST_USER_PW` | 로그인 계정 비밀번호 | authenticated/login 시나리오 skip |
| `E2E_SSO_TEST_HASH` | SSO 1회용 해시 | SSO 시나리오 skip |
| `E2E_SAMPLE_CHALLENGE_PATH` | 결제 스모크용 챌린지 path | `/program` fallback |

## Project 매핑

`playwright.config.ts` 의 project 가 spec 파일명 패턴으로 매핑됨:

- `chromium-anonymous` — `*.anonymous.spec.ts` (storageState 미사용, 명시적 로그인)
- `chromium-authenticated` — `*.authenticated.spec.ts` (storageState 사용, globalSetup 의존)

## 정책

- **Chromium 만 사용** — Firefox/WebKit 빌드 시간 절약
- **web 에만 도입** — admin/mentor 는 단위 테스트 위주
- **manual dev 관리** — webServer 자동 spawn 비활성 (포트 충돌 회피)
- **viewport 1920×1080** — 데스크톱 nav 강제 노출
- **timeout 120s** — 다단계 결제 시나리오 누적 시간 흡수

## 새 spec 추가 가이드

1. `pages/` 에 POM 클래스 작성 (필요 시)
2. 같은 시퀀스가 여러 spec 에 들어가면 `flows/` 로 추출
3. `specs/<name>.{anonymous,authenticated}.spec.ts` 작성
4. spec 상단에 `WAITS` 객체로 단계별 대기시간 명시
5. `Pipeline.run(label, fn, snap?)` 으로 단계 묶음
6. `RunDir` 으로 산출물 디렉토리 관리
