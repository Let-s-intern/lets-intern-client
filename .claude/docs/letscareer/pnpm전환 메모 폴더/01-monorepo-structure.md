# 01. 모노레포 구조

> Keywords: monorepo, pnpm-workspace, turborepo, packages, apps

pnpm workspace + Turborepo로 구성된 단일 저장소다. `apps/`에 배포 대상 앱 3개, `packages/`에 앱들이 공유하는 라이브러리·설정이 들어 있다.

## 파일 시스템 레이아웃

```
lets-intern-client/
├── apps/
│   ├── web/         # Next.js 15 (App Router, Turbopack)  → 사용자 페이지
│   ├── admin/       # Vite + React                        → 어드민 콘솔
│   └── mentor/      # Vite + React                        → 멘토 마이페이지
├── packages/
│   ├── api/         # 공용 axios 인스턴스
│   ├── hooks/       # 공용 React Hooks
│   ├── store/       # zustand 스토어 (SSO consume 포함)
│   ├── types/       # 공용 TypeScript 타입
│   ├── ui/          # 공용 컴포넌트
│   ├── utils/       # 유틸리티 함수
│   └── config/
│       ├── eslint/
│       ├── prettier/
│       ├── tailwind/
│       └── typescript/
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── package.json
└── turbo.json
```

## pnpm workspace 매니페스트

[pnpm-workspace.yaml](../../../../pnpm-workspace.yaml):

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "packages/config/*"
```

세 번째 줄이 핵심이다. `packages/*`만 있으면 `packages/config/` 자체가 한 개 패키지로 인식되는데, 그 아래 `eslint/`, `prettier/`, `tailwind/`, `typescript/`를 각각 독립 패키지로 노출하기 위해 한 단계 더 글로브를 추가했다.

총 14개 워크스페이스 (`apps` 3 + `packages` 7 + `packages/config` 4).

## 패키지 식별자

모든 워크스페이스 패키지는 `@letscareer/*` 네임스페이스로 통일.

| 패키지 | 이름 | 용도 |
|---|---|---|
| `apps/web` | `@letscareer/web` | Next.js 사용자 사이트 |
| `apps/admin` | `@letscareer/admin` | Vite 어드민 SPA |
| `apps/mentor` | `@letscareer/mentor` | Vite 멘토 SPA |
| `packages/api` | `@letscareer/api` | 공용 axios |
| `packages/hooks` | `@letscareer/hooks` | 공용 훅 |
| `packages/store` | `@letscareer/store` | zustand + SSO 소비자 |
| `packages/types` | `@letscareer/types` | 공용 타입 |
| `packages/ui` | `@letscareer/ui` | 공용 UI |
| `packages/utils` | `@letscareer/utils` | 유틸 |
| `packages/config/eslint` | `@letscareer/eslint-config` | 공용 ESLint 설정 |
| `packages/config/prettier` | `@letscareer/prettier-config` | 공용 Prettier 설정 |
| `packages/config/tailwind` | `@letscareer/tailwind-config` | 공용 Tailwind 설정 |
| `packages/config/typescript` | `@letscareer/tsconfig` | 공용 tsconfig |

## workspace 의존 프로토콜

앱 `package.json`에서 공용 패키지를 가져올 땐 `workspace:*`를 명시한다.

```json
{
  "name": "@letscareer/web",
  "dependencies": {
    "@letscareer/api": "workspace:*",
    "@letscareer/hooks": "workspace:*",
    "@letscareer/store": "workspace:*",
    "@letscareer/types": "workspace:*",
    "@letscareer/ui": "workspace:*",
    "@letscareer/utils": "workspace:*"
  },
  "devDependencies": {
    "@letscareer/eslint-config": "workspace:*",
    "@letscareer/tailwind-config": "workspace:*",
    "@letscareer/tsconfig": "workspace:*"
  }
}
```

`workspace:*`는 pnpm이 *외부 npm 레지스트리가 아닌 로컬 패키지로 해석*하라는 신호다. 배포 시 pnpm이 자동으로 실제 버전 번호로 변환한다.

각 앱이 의존하는 공용 패키지 세트는 거의 동일하다. (`api`, `hooks`, `store`, `types`, `ui`, `utils` + 빌드용 `eslint-config`, `tailwind-config`, `tsconfig`.) `prettier-config`는 루트 `package.json`의 devDependencies에만 있다.

## 빌드 의존 그래프

Turborepo는 `^build` 의존 표기로 *공용 패키지가 먼저 빌드되고 → 앱이 나중에 빌드*되도록 강제한다. [turbo.json](../../../../turbo.json):

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    }
  }
}
```

```
packages/api ─┐
packages/hooks ┤
packages/store ┤
packages/types ┼──→ apps/web
packages/ui    ┤    apps/admin
packages/utils ┘    apps/mentor
```

공용 패키지에 변경이 생기면 그 패키지를 import하는 모든 앱이 재빌드된다. 한 앱만 바뀌면 다른 앱은 캐시 히트.

## 프레임워크 분포

| 앱 | 프레임워크 | dev 명령 | 출력 디렉토리 |
|---|---|---|---|
| web | Next.js 15 (App Router, Turbopack) | `next dev --turbopack --port 3000` | `.next/` |
| admin | Vite + React | `vite` (port 3001) | `dist/` |
| mentor | Vite + React | `vite` (port 3002) | `dist/` |

서로 다른 프레임워크를 한 Vercel 프로젝트로 합칠 수 없는 핵심 이유다 — 자세한 내용은 [04-vercel-deployment.md](./04-vercel-deployment.md).

## 루트 스크립트 카탈로그

[package.json](../../../../package.json)의 scripts:

| 명령 | 동작 |
|---|---|
| `pnpm dev` | 3개 앱 동시 실행 (`turbo run dev`) |
| `pnpm dev:web` / `dev:admin` / `dev:mentor` | 해당 앱만 실행 (`--filter`) |
| `pnpm build` | 3개 앱 모두 빌드 |
| `pnpm build:web` / `build:admin` / `build:mentor` | 해당 앱만 빌드 |
| `pnpm lint` / `typecheck` / `test` | 전체 검증 |
| `pnpm lint:<app>` / `typecheck:<app>` | 해당 앱만 검증 |
| `pnpm clean` | 빌드 산출물 + node_modules + .turbo 삭제 |

각 명령은 내부적으로 `turbo run <task> --filter=@letscareer/<name>` 형태다. Turbo의 캐시·병렬화는 [05-build-test-ci.md](./05-build-test-ci.md) 참고.

## overrides

루트 `package.json`에 보안·호환성 패치를 위한 의존 강제:

```json
"overrides": {
  "tar-fs": "2.1.4",
  "path-to-regexp": "6.3.0",
  "undici": "5.29.0"
}
```

pnpm은 `overrides`를 그대로 인식해 모든 transitive 의존성도 위 버전으로 픽스한다.
