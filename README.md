# Lets Career Client

렛츠커리어 프론트엔드 모노레포. pnpm workspace + Turborepo 기반 3개 앱 (Next.js + Vite × 2).

## 사전 요구사항

- Node.js >= 18.17 (권장: 20.x)
- pnpm >= 10 — `package.json`의 `packageManager: "pnpm@10.33.0"` 강제. Corepack 권장.

## 빠른 시작

```bash
# 1. pnpm 활성화 (Corepack)
corepack enable
corepack prepare pnpm@10.33.0 --activate

# 2. 의존성 설치
pnpm install --frozen-lockfile

# 3. 환경변수 (각 앱의 .env.example 참고해 값 채우기)
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env
cp apps/mentor/.env.example apps/mentor/.env

# 4. 개발 서버
pnpm dev:web      # http://localhost:3000  (Next.js)
pnpm dev:admin    # http://localhost:3001  (Vite)
pnpm dev:mentor   # http://localhost:3002  (Vite)
pnpm dev          # 3개 동시
```

## 빌드·검증

기본 빌드·테스트 명령:

```bash
pnpm build         # 또는 build:web / build:admin / build:mentor
pnpm typecheck     # 또는 typecheck:web / typecheck:admin / typecheck:mentor
pnpm test          # 또는 test:web / test:admin / test:mentor
pnpm clean         # 빌드 산출물·node_modules·.turbo 삭제
```

### 코드 품질 검사

ESLint(정적 분석)와 Prettier(포맷팅)는 **도구 레벨에선 분리**하고 scripts 레벨에서만 묶음. Prettier 공식 권장 패턴.

```bash
# ESLint 전용
pnpm lint                  # 전체
pnpm lint:web              # 앱별 (또는 lint:admin / lint:mentor)

# Prettier 전용
pnpm format                # 전체 자동 수정 (--write)
pnpm format:check          # 전체 검사만 (--check)
pnpm format:web            # 앱별 자동 수정 (또는 format:admin / format:mentor)

# 통합 (Prettier --check + ESLint, fail-fast)
pnpm check                 # 전체
pnpm check:web             # 앱별 (또는 check:admin / check:mentor)
```

| 명령 | Prettier | ESLint | 자동 수정 |
|---|---|---|---|
| `lint` / `lint:<app>` | ❌ | ✅ | ❌ |
| `format` / `format:<app>` | ✅ | ❌ | ✅ |
| `format:check` | ✅ | ❌ | ❌ |
| `check` / `check:<app>` | ✅ | ✅ | ❌ |

> **CI 동작**: GitHub Actions(`build-web/admin/mentor.yml`)는 1) Prettier · 2) ESLint · 4) Coverage를 `continue-on-error: true`로 설정해 **위반이 있어도 PR을 막지 않음**. 머지를 차단하는 단계는 3) Test · 5) Build · 6) E2E(web). 베이스라인 정리 후 `continue-on-error` 제거 예정.