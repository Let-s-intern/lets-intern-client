# 공유 패키지 (`packages/*`)

3개 앱(web, admin, mentor)이 공유하는 워크스페이스 패키지. 모두 `@letscareer/*` 네임스페이스.

## 패키지 목록

| 패키지 디렉토리 | 패키지 이름 | 다루는 내용 | 문서 |
|---|---|---|---|
| `packages/api` | `@letscareer/api` | axios 인스턴스 생성기, env 상수 | [api.md](./api.md) |
| `packages/hooks` | `@letscareer/hooks` | 공유 React 훅 (스크롤·라이프사이클·React Query 등) | [hooks.md](./hooks.md) |
| `packages/store` | `@letscareer/store` | zustand 스토어 (auth·scroll·program·report 등) | [store.md](./store.md) |
| `packages/ui` | `@letscareer/ui` | 공유 UI 컴포넌트 (Link·Image) | [ui.md](./ui.md) |
| `packages/utils` | `@letscareer/utils` | 순수 함수 유틸 (cn·debounce·throttle·invariant 등) | [utils.md](./utils.md) |
| `packages/types` | `@letscareer/types` | 공유 타입 (User·Banner·common) | [types.md](./types.md) |
| `packages/config/{eslint,prettier,tailwind,typescript}` | `@letscareer/{eslint,prettier,tailwind}-config`, `@letscareer/tsconfig` | 공유 도구 설정 | [config.md](./config.md) |

## Import 패턴

3개 앱 모두 동일하게 import:

```ts
import { useMounted, useScrollDirection } from '@letscareer/hooks';
import { cn, debounce, invariant } from '@letscareer/utils';
import { createAuthorizedAxios, SERVER_API } from '@letscareer/api';
import { useAuthStore, useProgramStore } from '@letscareer/store';
import { Link, Image } from '@letscareer/ui';
import type { User, Banner } from '@letscareer/types';
```

## 앱 로컬 모듈

각 앱은 자기 `src/` 안에 자체 모듈도 둔다. 공유 가치가 없는 도메인 종속 코드는 앱 로컬에 — [`../apps/`](../apps/) 참조.

## 새 패키지 추가

1. `packages/<이름>/` 디렉토리 생성
2. `package.json`의 `"name": "@letscareer/<이름>"`, `"version": "0.0.0"`, `"main"`/`"types"` 지정
3. `pnpm-workspace.yaml`은 `packages/*`를 자동 인식 — 추가 작업 없음
4. 사용할 앱의 `package.json`에 `"@letscareer/<이름>": "workspace:*"` 등록
5. 루트에서 `pnpm install` → 즉시 import 가능

## 마이그레이션 진행 상태

일부 훅(`useCounter`, `useScrollDirection`)과 유틸(`cn`, `debounce`)은 `packages/`와 `apps/web/src/`에 *둘 다 존재*한다. 새 코드는 `@letscareer/*` 우선 사용. 점진적으로 로컬 사본 제거.
