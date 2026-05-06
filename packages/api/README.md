# @letscareer/api

레츠커리어 모노레포의 공용 API 패키지.

이 패키지는 두 가지를 제공합니다.

1. **axios 인스턴스 팩토리** — 인증·401 처리·헤더 표준이 박힌 axios 인스턴스를 만드는 함수들 (`createAuthorizedAxios`, `createDefaultAxios`, `createV2Axios`, `createV3Axios`).
2. **orval 자동 생성 React Query hook** — BE Swagger spec(`openapi.json`)에서 도메인별 hook·타입을 자동 생성한 `src/generated/**` 트리. `@letscareer/api/generated/<domain>` 서브패스로 import 합니다.

> 신규 기능 개발 시에는 **generated hook 사용을 기본**으로 합니다. 자세한 규칙은 아래 §사용 규칙을 참고하세요.

---

## 폴더 구조

```
packages/api/
├── openapi.json                 # BE Swagger snapshot (commit 대상)
├── orval.config.ts              # orval 빌드 설정
├── scripts/
│   └── fetch-spec.mjs           # spec 다운로드 스크립트 (SWAGGER_SPEC_URL 지원)
├── src/
│   ├── index.ts                 # 패키지 entry — axios 팩토리 + configureGeneratedAxios
│   ├── env.ts                   # 환경변수 추상화 (Next/Vite 양립)
│   ├── createAuthorizedAxios.ts # 공용 axios 팩토리
│   ├── axios.ts / axiosV2.ts / axiosV3.ts
│   ├── mutator.ts               # orval custom mutator (`customAxios`)
│   └── generated/               # ⛔ orval 생성, 수정 금지 (clean: true로 매 generate마다 덮어씀)
│       ├── letsCareerAPI.schemas.ts   # 공용 타입 — `@letscareer/api/generated/schemas` 로 import
│       └── <domain>/<domain>.ts       # 도메인 단위 hook + 타입 — `@letscareer/api/generated/<domain>` 로 import
├── .prettierignore              # generated 제외
└── eslint.config.mjs            # generated ignore
```

---

## 사용 규칙

PRD-0505 §6에서 정한 합의입니다. PR 리뷰 시 동일한 항목을 체크합니다.

### 1) 신규 기능 개발 — generated hook 사용

```ts
// 권장
import { useGetMentorProfile } from '@letscareer/api/generated/mentor';

// 신규 코드에서 신규 fetcher hook을 손으로 작성하지 마세요
// (예: useQuery + axios 한 쌍을 새로 만드는 패턴 금지)
```

해당 endpoint가 spec에 없으면 BE에 추가를 요청하고, 그 사이 임시 hook을 추가해야 한다면
PR 설명에 사유 + 후속 정리 plan을 명시하세요.

### 2) 기존 코드 — 변경하지 않음

이번 PRD(0505) 범위는 **인프라 도입까지**입니다. 기존 `apps/{web,admin,mentor}/src/api/**` fetcher는
이번 작업에서 0줄 변경으로 유지합니다. 도메인 단위 마이그레이션은 별도 PRD에서 진행합니다.

```ts
// 기존 — 그대로 두기
import { useAdminUserMentorListQuery } from '@/api/mentor/mentor';
```

### 3) 도메인 단위 결정 원칙 (전환 시)

같은 endpoint를 신/구 두 hook이 동시에 호출하는 상태를 만들지 않습니다.

- 신규 endpoint: generated만 사용
- 기존 endpoint를 새 페이지에서 호출: 가능한 한 generated로 호출. 단, 그 도메인 fetcher가 이미 정리 중이거나 충돌하면 기존 hook을 재사용해 도메인 단위로 묶습니다.
- 도메인 단위 일괄 전환 시에만 도메인 마커 파일(`apps/<app>/src/api/<domain>/.use-generated`)로 표시합니다.

### 4) PR 리뷰 체크포인트

PR 리뷰 시 아래 두 가지를 매번 확인합니다.

- [ ] 신규 fetcher hook을 손으로 작성하지 않았는가?
- [ ] 같은 endpoint가 두 hook(신·구)으로 호출되지 않는가?

---

## Spec 갱신 절차

```bash
pnpm --filter @letscareer/api gen:api
```

이 명령은 다음 두 단계를 순차 실행합니다.

1. `fetch:spec` — `SWAGGER_SPEC_URL`(미지정 시 `https://letsintern.kr/v3/api-docs`)에서 spec을 받아 `openapi.json`에 저장
2. `generate` — orval로 `src/generated/**` 재생성

생성 후 `git diff packages/api/openapi.json packages/api/src/generated/`로 BE 변경분을 리뷰하고
의도된 변경이면 그대로 commit, 의도치 않은 drift면 BE 협업 메모를 남깁니다.

### Spec ≠ baseURL 구분 (헷갈리지 마세요)

| 용도         | 출처                                                | 결정 시점                          | 환경별 분기                      |
| ------------ | --------------------------------------------------- | ---------------------------------- | -------------------------------- |
| **spec**     | `SWAGGER_SPEC_URL` (default: `letsintern.kr/...`)   | 코드 생성 시점 (`gen:api` 1회 실행) | ❌ 환경별로 다른 spec을 쓸 일 없음 |
| **baseURL**  | `NEXT_PUBLIC_SERVER_API` / `VITE_SERVER_API` (.env) | 런타임(요청 발생 시점)             | ✅ dev / prod / stage 분기        |

즉 **spec은 한 곳에서 받아 코드를 한 번 생성**하고, **실제 API 호출 host는 각 앱의 .env로 환경별로 분기**합니다.

---

## Mutator (`configureGeneratedAxios`)

orval이 생성한 모든 hook은 `src/mutator.ts`의 `customAxios`를 통해 요청합니다.
앱이 부트스트랩될 때 한 번만 `configureGeneratedAxios`를 호출해 baseURL/인증/401 처리를 주입합니다.

```ts
// apps/<app>/src/main.tsx (또는 axios 초기화 위치)
import { configureGeneratedAxios } from '@letscareer/api';
import { SERVER_API } from '@letscareer/api/env';

configureGeneratedAxios({
  baseURL: SERVER_API,
  getAuthHeader: async () => {
    const token = getAccessTokenFromStore();
    return token ? { Authorization: `Bearer ${token}` } : null;
  },
  onUnauthorized: () => {
    // 토큰 폐기, 로그인 페이지 redirect 등
    redirectToLogin();
  },
});
```

호출하지 않으면 generated hook이 처음 fire 될 때 다음 에러로 즉시 실패합니다.

```
[@letscareer/api] customAxios: configureGeneratedAxios()를 앱 초기화 시점에 호출해야 합니다.
```

> 부트스트랩 코드 추가는 첫 사용처 PR에서 함께 진행합니다 (이번 인프라 PRD 범위 밖).

---

## 환경변수

| 변수                     | 용도                                         | 미지정 시              |
| ------------------------ | -------------------------------------------- | ---------------------- |
| `SWAGGER_SPEC_URL`       | `gen:api` 의 spec fetch URL (codegen 시점)   | prod default 사용      |
| `NEXT_PUBLIC_SERVER_API` | apps/web 런타임 v1 baseURL                   | (env.ts가 빈 문자열 + 콘솔 경고) |
| `VITE_SERVER_API`        | apps/{admin,mentor} 런타임 v1 baseURL        | 동일                   |
| 기타 v2/v3/host          | `@letscareer/api/env` 참조                   | —                      |

---

## envelope 처리

BE 응답이 `{ data: T }` 형태인 경우 `customAxios`가 자동으로 `T`만 반환합니다.
envelope 비일관 응답이 발견되면 mutator의 언래핑 로직을 endpoint별 override로 보정합니다 (현재는 단일 규칙).

---

## 후속 자동화 (참고 — 이번 PRD 범위 밖)

- **CI에서 spec drift 감지**: `pnpm gen:api && git diff --exit-code` 형태로 BE Swagger 변경을 PR로 알려주는 cron PR 워크플로우. 별도 후속 작업으로 다룹니다.
- **도메인 단위 마이그레이션 PRD**: `MIGRATION_CHECKLIST.md` 템플릿을 도메인마다 복사·체크해서 진행합니다.

---

## 관련 문서

- PRD: `.claude/tasks/prd-0505.md`
- 마이그레이션 체크리스트: `./MIGRATION_CHECKLIST.md`
- BE 협업 메모(필요 시): `tasks/memos/be-request-orval.md`
