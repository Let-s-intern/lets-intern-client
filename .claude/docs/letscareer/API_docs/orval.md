# orval 인프라 운영 가이드

> BE Swagger(OpenAPI 3.0) spec → 프론트엔드 React Query hook + 타입 자동 생성 파이프라인.
> 이 문서는 *결정 배경 + 운영 절차* 위주. 패키지 사용법 디테일은 [`packages/api/README.md`](../../../../packages/api/README.md) 참조.

## 한 줄 요약

`pnpm --filter @letscareer/api gen:api` 한 번이 spec fetch → generated 코드 재생성을 모두 처리한다. 신규 기능은 generated hook을 사용하고 기존 코드는 그대로 둔다.

## 위치

```
packages/api/
├── openapi.json                # Swagger spec snapshot (commit됨)
├── orval.config.ts             # orval 설정 (mode + transformer + mutator)
├── scripts/
│   └── fetch-spec.mjs          # SWAGGER_SPEC_URL env 기반 spec 다운로드
├── src/
│   ├── mutator.ts              # custom axios + envelope 자동 unwrap
│   └── generated/              # orval 출력 (자동 생성, lint/format 제외)
│       ├── letsCareerAPI.schemas.ts   # 공용 타입
│       └── <domain>/<domain>.ts       # 도메인 hook (42개 폴더)
├── README.md                   # 패키지 사용 가이드
└── MIGRATION_CHECKLIST.md      # 도메인 단위 전환 시 표준 체크리스트
```

## 명령

```bash
# spec 다운 + generate (가장 많이 씀)
pnpm --filter @letscareer/api gen:api

# spec만 다운
pnpm --filter @letscareer/api fetch:spec

# generate만 (spec 변경 없을 때)
pnpm --filter @letscareer/api generate

# 환경변수로 spec URL override
SWAGGER_SPEC_URL=https://staging.letsintern.kr/v3/api-docs \
  pnpm --filter @letscareer/api gen:api
```

## 신규 기능 사용법

```ts
// 도메인 hook
import { useGetXxx } from '@letscareer/api/generated/<domain>';

// 공용 타입
import type { Foo } from '@letscareer/api/generated/schemas';

// 앱 부트스트랩에서 1회 호출 (인증/baseURL 주입)
import { configureGeneratedAxios, SERVER_API } from '@letscareer/api';
configureGeneratedAxios({
  baseURL: SERVER_API,
  getAuthHeader: () => useAuthStore.getState().accessToken,
  onUnauthorized: () => useAuthStore.getState().logout(),
});
```

## spec ≠ baseURL 분리

| 채널 | 시점 | 메커니즘 | 예시 |
|---|---|---|---|
| **Spec URL** (코드 생성용) | generate 시점, 1회 | `SWAGGER_SPEC_URL` env (default: prod) | `https://letsintern.kr/v3/api-docs` |
| **Runtime baseURL** (호출용) | 앱 실행, 매 요청 | `NEXT_PUBLIC_SERVER_API` / `VITE_SERVER_API` (`.env`/`.env.prod`) | `https://letsintern.kr/api/v1` |

→ generated 코드는 prod spec 1개로 commit, 호출 baseURL은 환경별 `.env`로 분리. test/prod 분기는 *런타임* 문제이지 generation 문제가 아님.

## 핵심 결정 사항

| 항목 | 결정 | 근거 |
|---|---|---|
| Generated 위치 | `packages/api/src/generated/` | 단일 패키지 통합. mutator와 colocate. |
| Spec 동기화 | 로컬 commit (`openapi.json`) + `pnpm gen:api` 수동 | diff 리뷰 가능, 오프라인 빌드 |
| Output mode | `tags-split` + tag transformer | 도메인 단위 폴더링 |
| Tag 정리 | `xxx-v-1-controller` → `xxx`로 transformer 변환 | BE 정리 요청 없이 깔끔한 도메인명 |
| Client | `react-query` (TanStack Query 5) | 이미 사용 중 |
| Mutator | `createAuthorizedAxios` 재활용 + envelope auto-unwrap | 인증/401 처리 중복 회피 |
| Zod 생성 | OFF (시작 시) | 타입만 사용. critical path만 추후 활성화 |
| Naming | orval 기본 (`useGetXxx`) | override 비용 ≫ 이득 |
| Lint/format | `generated/`는 prettier·eslint ignore | 자동 포맷팅으로 깨지는 사고 방지 |
| Typecheck | `generated/` 포함 | 컴파일 에러 즉시 발견 |
| Export | `./generated/*` 서브패스만 (barrel index 없음) | Tree-shaking 보호 + 도메인 명시 |

## Mutator 동작 원리

```
generated hook 호출
    ↓
customAxios(config)                 ← packages/api/src/mutator.ts
    ↓
configureGeneratedAxios()로 셋업된 createAuthorizedAxios 인스턴스 사용
    ↓
HTTP 요청 (인증 헤더 자동 부착, 401 자동 처리)
    ↓
응답 envelope 자동 unwrap: body?.data ?? body
    ↓
generated 타입대로 반환
```

### envelope auto-unwrap fallback의 이유

spec 검증 결과(316 endpoint 스캔):
- envelope 패턴 (`{ data: T }`): **34%**
- 직접 객체 반환: **54%**
- void (200 응답 schema 없음): **12%**

비일관 비율이 높아 mutator에서 `body?.data ?? body` fallback 패턴으로 두 케이스를 모두 처리한다. 즉 *생성된 타입을 신뢰하면 사용처는 양쪽 다 동일하게 동작*. 단 도메인 마이그레이션 시 endpoint별 응답 shape는 [MIGRATION_CHECKLIST.md](../../../../packages/api/MIGRATION_CHECKLIST.md) 절차로 검증해야 한다.

## 사용 규칙

### 1. 신규 기능
- generated hook **만** 사용 (`useGetXxx`, `usePostXxx`)
- 신규 fetcher 손으로 작성 금지

### 2. 기존 코드
- 기존 `apps/<app>/src/api/**`의 hook 호출은 그대로 유지
- 도메인 단위 일괄 전환 시점은 별도 PRD로 결정

### 3. 도메인 단위 결정 원칙 (중요)
**같은 endpoint를 신/구 두 hook이 동시에 호출하는 상태를 만들지 않는다.**
- 도메인 X가 generated로 전환되면 → 모든 호출처가 generated 사용
- 아직 전환 안 된 도메인 → 모든 호출처가 기존 hook 사용
- 두 방식이 *같은 endpoint*에 공존하면 캐시 분리·invalidate 누락 사고 위험

### 4. PR 리뷰 체크포인트
- 신규 fetcher hook을 손으로 작성하지 않았는가?
- 같은 endpoint가 두 hook으로 호출되지 않는가?
- spec 변경(`openapi.json` diff)을 의도했는가?

## Spec 갱신 절차

### 수동 (현재 default)

```bash
pnpm --filter @letscareer/api gen:api
git status packages/api          # diff 확인
# openapi.json 변경 → BE가 spec을 바꿨음
# src/generated/** 변경 → spec 변경의 결과
git add packages/api
git commit -m "chore(api): openapi spec 동기화"
```

언제 실행하나:
- 신규 기능 작업 시작 (BE에 endpoint 미리 만들어달라 요청 후)
- 정기 점검 (sprint 시작 시 1회)
- BE 시그니처 변경 의심 시

### 자동 (옵션, 미구현)

GitHub Actions cron으로 매주 월요일 자동 PR 생성 — `.github/workflows/orval-spec-sync.yml`.

```yaml
on:
  schedule:
    - cron: '0 2 * * MON'   # KST 11:00
jobs:
  sync:
    steps:
      - run: pnpm --filter @letscareer/api gen:api
        env:
          SWAGGER_SPEC_URL: ${{ secrets.SWAGGER_SPEC_URL }}
      - if: ... (diff 있으면)
        uses: peter-evans/create-pull-request@v6
```

도입 시 효과:
- 개발자 무관하게 BE 변경 자동 추적
- 변경 없으면 PR 안 만들어짐 (소음 0)
- reviewer가 5분 안에 확인 → 머지

도입 PRD는 별도. 현재는 수동만으로 충분.

## Breaking change 감지

```bash
pnpm gen:api               # generated 타입 갱신
pnpm typecheck             # 호출처에서 시그니처 mismatch 시 컴파일 에러
```

→ endpoint 시그니처 변경/삭제는 PR 단계에서 자동 노출. silent failure 없음.

## 미래 도메인 마이그레이션

이번 인프라는 *generated 사용을 가능하게* 한 단계. 기존 도메인 hook을 generated로 일괄 전환하는 작업은 별도 PRD로 진행.

대상 추정 규모:
- mentor: 108 hooks / 38 caller files (마이그레이션 1주~1.5주)
- admin: 243 hooks / 485 caller files (마이그레이션 4~6주, 사고 영향 큼)
- web: (별도 측정 필요)

도메인 1개 전환 절차는 [`packages/api/MIGRATION_CHECKLIST.md`](../../../../packages/api/MIGRATION_CHECKLIST.md) 참조.

## 위험 요소

| 위험 | 가능성 | 대응 |
|---|---|---|
| BE Swagger envelope이 비일관 | 🟡 (이미 발생, 54% non-envelope) | mutator의 `body?.data ?? body` fallback이 처리. 도메인 마이그레이션 시 endpoint별 검증 |
| Tag transformer 정규식 밖 outlier | 🟢 (`health-check-api-controller` 1건) | 후속 PR에서 정규식 보강 또는 BE tag 정리 |
| operationId 충돌/더러움 | 🟢 (현재 없음) | 발생 시 `output.override.operations.<id>` 수동 지정 |
| Spec drift 누적 | 🟡 (수동 갱신 의존) | 자동 PR cron 도입 (옵션) |
| `clean: true`로 generated 폴더 비워짐 | 🟢 | hand-written 파일은 generated/ 밖에 둠 |

## 후속 작업 (별도 PRD)

- [ ] mentor 도메인 점진 마이그레이션
- [ ] admin/web 도메인 점진 마이그레이션
- [ ] BE Swagger tag/operationId 정리 협업
- [ ] CI에 spec drift 감지 (`pnpm gen:api && git diff --exit-code`)
- [ ] GitHub Actions cron 자동 PR 도입
- [ ] zod schema 활성화 (critical path)

## 관련 문서

- [`packages/api/README.md`](../../../../packages/api/README.md) — 패키지 사용 가이드 (명령어 디테일)
- [`packages/api/MIGRATION_CHECKLIST.md`](../../../../packages/api/MIGRATION_CHECKLIST.md) — 도메인 전환 표준 절차
- [`.claude/tasks/prd-0505.md`](../../../tasks/prd-0505.md) — 도입 PRD (결정 사항·일정·acceptance criteria)
- [`packages/api.md`](../packages/api.md) — `@letscareer/api` 패키지 개요 (axios 인스턴스 + generated 통합)
- [`swagger_url.md`](./swagger_url.md) — Swagger spec URL
