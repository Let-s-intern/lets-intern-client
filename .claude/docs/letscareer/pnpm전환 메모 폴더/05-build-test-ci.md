# 05. 빌드·테스트·CI 구조

> Keywords: turborepo, github-actions, build, cache, ci, frozen-lockfile

Turborepo 캐시·필터로 *바뀐 앱만 빌드*하고, GitHub Actions로 PR마다 *해당 앱만 검증*한다. 두 시스템이 같은 패턴(앱별 격리)을 다른 층위에서 구현한다.

## Turborepo 설정

[turbo.json](../../../../turbo.json):

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [
    "pnpm-lock.yaml",
    "pnpm-workspace.yaml",
    ".env",
    ".env.*"
  ],
  "globalEnv": ["NODE_ENV", "VERCEL", "CI"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"],
      "inputs": [
        "$TURBO_DEFAULT$",
        "!**/*.md",
        "!**/*.test.ts",
        "!**/*.test.tsx",
        "!**/__tests__/**",
        "!dist/**",
        "!.next/**",
        "!.turbo/**"
      ],
      "env": ["NEXT_PUBLIC_*", "VITE_*", "SENTRY_*", "BUILDER_*"]
    },
    "dev": {
      "cache": false,
      "persistent": true,
      "dependsOn": []
    },
    "lint": {
      "dependsOn": ["^lint"],
      "inputs": ["$TURBO_DEFAULT$", "!**/*.md", "!dist/**", "!.next/**", "!.turbo/**"],
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^typecheck"],
      "inputs": ["$TURBO_DEFAULT$", "!**/*.md", "!dist/**", "!.next/**", "!.turbo/**"],
      "outputs": ["tsconfig.tsbuildinfo"]
    },
    "test": {
      "cache": false,
      "dependsOn": []
    }
  }
}
```

### 핵심 개념

#### `globalDependencies`

이 파일들이 바뀌면 *모든 task의 캐시*가 무효화된다. 락파일·workspace 매니페스트·`.env*`가 여기 들어가 있어, 의존성 변화나 환경변수 변화가 빌드 전체에 반영되도록 보장.

#### `globalEnv`

`NODE_ENV`, `VERCEL`, `CI` 변화는 모든 task의 캐시 키에 영향. 즉 dev/CI/Vercel 환경 차이가 캐시에 반영.

#### `tasks.build.dependsOn: ["^build"]`

`^` 접두사 = *upstream 워크스페이스의 같은 task가 먼저 끝나야 함*. apps의 build는 packages의 build가 끝난 뒤 실행된다.

#### `tasks.build.outputs`

빌드 산출물 경로. Turbo가 이 경로의 파일을 캐시에 저장/복원. `!.next/cache/**`로 Next.js 내부 캐시는 제외 (사이즈 큼, 매번 재생성 OK).

#### `tasks.build.inputs`

캐시 키 계산에 들어갈 입력 파일. `$TURBO_DEFAULT$`는 Turbo의 기본 패턴(소스코드 전반). `!**/*.md`, `!**/*.test.*` 등으로 *문서·테스트 파일은 빌드 캐시에 영향 안 줌* — README 한 줄 고친다고 빌드 캐시가 깨지지 않는다.

#### `tasks.build.env`

이 prefix의 환경변수가 바뀌면 빌드 캐시 무효. `NEXT_PUBLIC_*`(Next.js 클라 노출), `VITE_*`(Vite 클라 노출), `SENTRY_*`, `BUILDER_*`.

#### `tasks.dev`, `tasks.test`

`cache: false` — 캐시하지 않음. dev는 영구 실행, test는 매번 다시 돌려야 의미 있음.
`persistent: true` — Turbo가 task 종료를 기다리지 않고 다음으로 넘어가지 않음.

## 캐시 무효화 트리거

| 변경 | 결과 |
|---|---|
| `apps/web/src/page.tsx` 수정 | web 빌드 캐시만 무효 |
| `packages/ui/Button.tsx` 수정 | packages/ui + 그걸 import하는 모든 앱 캐시 무효 |
| `pnpm-lock.yaml` 수정 | 모든 task 캐시 무효 (`globalDependencies`) |
| `.env.local` 수정 | 모든 task 캐시 무효 (`globalDependencies`) |
| `apps/web/README.md` 수정 | 캐시 유지 (`!**/*.md` 제외) |
| `apps/web/src/foo.test.tsx` 수정 | build 캐시 유지, test 캐시는 매번 재실행 |
| `NEXT_PUBLIC_API_BASE_PATH` 변경 | web 빌드 캐시 무효 (`env: NEXT_PUBLIC_*`) |

## 명령어 — 일상

```bash
# 전체
pnpm build
pnpm lint
pnpm typecheck
pnpm test

# 앱별
pnpm build:web
pnpm lint:admin
pnpm typecheck:mentor

# 캐시 무시 강제 빌드
pnpm exec turbo run build --filter=@letscareer/admin --force

# 의존 그래프 미리보기
pnpm exec turbo run build --filter=@letscareer/admin --dry-run

# 여러 앱 동시 필터
pnpm exec turbo run build --filter=@letscareer/web --filter=@letscareer/admin
```

캐시 히트 시 `>>> FULL TURBO` 표시. 히트율은 `--summarize` 옵션으로 확인.

## 빌드 시간 (캐시 콜드)

| 앱 | 콜드 | 캐시 히트 |
|---|---|---|
| web | ~60s | <1s |
| admin | ~28s | <1s |
| mentor | ~18s | <1s |

## GitHub Actions 워크플로우

[.github/workflows/](../../../../.github/workflows/) 아래 4개 워크플로우. 각 워크플로우는 *그 앱과 관련된 변경*에서만 트리거된다.

### 트리거 매트릭스

| 변경 위치 | build-web | build-admin | build-mentor | build-shared |
|---|:---:|:---:|:---:|:---:|
| `apps/web/**` | ✅ | ❌ | ❌ | ❌ |
| `apps/admin/**` | ❌ | ✅ | ❌ | ❌ |
| `apps/mentor/**` | ❌ | ❌ | ✅ | ❌ |
| `packages/**` | ✅ | ✅ | ✅ | ✅ |
| `pnpm-lock.yaml` | ✅ | ✅ | ✅ | ✅ |
| `pnpm-workspace.yaml` | ✅ | ✅ | ✅ | ✅ |
| `turbo.json` | ✅ | ✅ | ✅ | ✅ |
| `package.json` (루트) | ✅ | ✅ | ✅ | ✅ |
| `.github/workflows/build-X.yml` | 자기 자신만 | 자기 자신만 | 자기 자신만 | 자기 자신만 |
| `.claude/**`, `*.md`, `.cursor/**` | ❌ | ❌ | ❌ | ❌ |

이 트리거 매트릭스는 [04-vercel-deployment.md](./04-vercel-deployment.md)의 Ignored Build Step과 *같은 사고방식*이다. 둘 다 "앱별 격리 + 공용 변경 시 전체"를 다른 도구로 구현한 것.

### 공통 워크플로우 골격

```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
    paths:
      - 'apps/<this-app>/**'
      - 'packages/**'
      - 'pnpm-lock.yaml'
      - 'pnpm-workspace.yaml'
      - 'turbo.json'
      - 'package.json'
      - '.github/workflows/build-<this-app>.yml'
  push:
    branches: [main]
    paths: [...같은 목록...]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build:<app>
        env:
          # 앱에 맞는 환경변수
```

핵심 포인트:
- `pnpm/action-setup@v4` — `packageManager` 필드의 pnpm 버전 자동 활용 (Corepack과 같은 동작).
- `cache: 'pnpm'` — node_modules + pnpm 스토어 캐시.
- `--frozen-lockfile` — 락파일 일관성 검증.

### 4개 워크플로우

#### [build-web.yml](../../../../.github/workflows/build-web.yml)

```yaml
- run: pnpm build:web
  env:
    NEXT_PUBLIC_SERVER_API: ${{ secrets.NEXT_PUBLIC_SERVER_API || 'https://api.example.com' }}
    NEXT_PUBLIC_API_BASE_PATH: ${{ secrets.NEXT_PUBLIC_API_BASE_PATH || '/api' }}
```

#### [build-admin.yml](../../../../.github/workflows/build-admin.yml)

```yaml
- run: pnpm build:admin
  env:
    VITE_API_BASE_PATH: ${{ secrets.VITE_API_BASE_PATH || 'https://api.example.com' }}
    VITE_SERVER_API: ${{ secrets.VITE_SERVER_API || 'https://api.example.com/api/v1' }}
```

#### [build-mentor.yml](../../../../.github/workflows/build-mentor.yml)

```yaml
- run: pnpm build:mentor
  env:
    VITE_API_BASE_PATH: ${{ secrets.VITE_API_BASE_PATH || 'https://api.example.com' }}
    VITE_SERVER_API: ${{ secrets.VITE_SERVER_API || 'https://api.example.com/api/v1' }}
```

#### [build-shared.yml](../../../../.github/workflows/build-shared.yml)

```yaml
- run: pnpm exec turbo run typecheck --filter='./packages/*'
```

공용 패키지 변경 시 타입체크만 돌린다. 앱 전체 빌드를 다시 돌리지는 않는다 (그건 build-web/admin/mentor가 알아서 트리거됨).

### secrets fallback 패턴

```yaml
${{ secrets.VITE_API_BASE_PATH || 'https://api.example.com' }}
```

CI secret이 없으면 더미 URL로 빌드를 통과시킨다. 빌드는 *컴파일 가능성*만 검증하면 충분하므로, secret 없는 포크 PR도 CI를 돌릴 수 있게 하는 안전장치.

운영 환경에선 secret이 반드시 설정되어 있어야 하며, 그 값들은 Vercel 프로젝트의 환경변수와도 일치해야 한다 — [04-vercel-deployment.md](./04-vercel-deployment.md) 4️⃣ 참고.

## 테스트

`pnpm test`는 Turborepo의 `test` task를 호출. 현재 web만 vitest 설정이 있다 ([apps/web/vitest.config.ts](../../../../apps/web/vitest.config.ts)).

```json
// apps/web/package.json
"test": "vitest"
```

CI에선 별도 워크플로우로 테스트를 돌리지 않는다. 필요해지면 `build-web.yml`에 한 단계 추가하거나 별도 워크플로우 파일을 만든다.

## 로컬 검증 흐름

PR 올리기 전 권장 순서:

```bash
pnpm install --frozen-lockfile
pnpm typecheck   # 변경된 앱만 타입체크
pnpm lint
pnpm build       # 영향 받는 앱만 빌드 (캐시 활용)
pnpm test        # 해당되는 곳만
```

CI가 똑같은 단계를 돌리므로, 로컬 통과 = CI 통과 가능성 높음.

## 캐시 정리

```bash
# 전체 클린 (node_modules + .turbo + 빌드 산출물)
pnpm clean

# Turbo 캐시만
rm -rf .turbo apps/*/.turbo packages/*/.turbo

# 강제 빌드 (캐시 무시, 캐시는 갱신)
pnpm exec turbo run build --filter=@letscareer/admin --force
```
