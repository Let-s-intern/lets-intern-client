# 블로그 상세 페이지 — Program API 광범위 5xx 장애

> **상태**: 🔴 미해결 (백엔드 측 조사 필요)
> **발견일**: 2026-05-01 (KST 15:17 / UTC 06:17)
> **영향 환경**: vercel-production
> **프론트 mitigation**: ✅ 적용 (페이지 폭발은 차단, Sentry warning 등록 유지)

---

## 요약

블로그 상세 페이지(`/blog/[id]/[title]`)에서 사용하는 **`/v1/program/*` 계열 API들이 광범위하게 5xx 응답**을 반환하고 있다.
한 두 endpoint 단위 문제가 아니라 program 도메인 전반의 장애로 보인다.

본문 fetch(`/v1/blog/{id}`)는 정상이라 페이지는 표시되지만, 추천 위젯(`<ProgramRecommendCard>`)이 렌더 단계에서 무더기로 throw하던 것을 프론트가 catch로 격리한 상태.

---

## Sentry 이슈

| 이슈 ID | 상태 | 비고 |
|---|---|---|
| `e1319bb785f64a84be553efcffbf4404` | 페이지 폭발 (RSC unhandled rejection) | FE catch 추가로 차단 |
| `7e64c27c54434e59ae8e897468c60bd3` | `fetchProgramRecommend` 500 | warning level로 계속 등록 중 |

대시보드 필터: `domain:blog AND level:warning AND httpStatus:500`

---

## 발견된 5xx Endpoint

모두 응답 본문: `{ "message": "서버 내부 오류입니다." }` (status 500)

| Endpoint | 호출 함수 | 호출처 (FE) | 재현 ID |
|---|---|---|---|
| `GET /v1/program/recommend` | `fetchProgramRecommend` | `apps/web/src/api/program.ts:824` | (파라미터 없음) |
| `GET /v1/challenge/{id}` | `fetchChallenge` | `apps/web/src/api/program.ts:761` | `343`, `259`, `258` |
| `GET /v1/live/{id}` | `fetchLive` | `apps/web/src/api/program.ts:768` | `10` |
| `GET /v1/program?type=&...` | `fetchProgram` (via `getChallengeByKeyword`) | `apps/web/src/api/program.ts:783, 800` | `latest:{keyword}` 분기 |

추가로 다른 도메인이지만 같은 페이지에서 호출:

| Endpoint | 호출 함수 | 호출처 (FE) | 재현 ID | 응답 |
|---|---|---|---|---|
| VOD 상세 | `fetchPublicVodData` | `apps/web/src/api/program.ts:527` | `14` | `"VOD 상세 조회에 실패했습니다."` (status 미보존) |

---

## 백엔드 호스트

env: `NEXT_PUBLIC_SERVER_API` (운영 환경 변수 참조)

---

## 재현 방법

운영 또는 로컬 `pnpm prod`에서 다음 블로그 상세 페이지 접속:

- `/blog/27/...` (블로그 ID 27)
- `/blog/1/...` (블로그 ID 1)

페이지는 200으로 표시되지만, 아래 호출들이 500을 반환:
- `GET .../api/v1/program/recommend`
- `GET .../api/v1/challenge/343`
- `GET .../api/v1/live/10`
- (관리자가 `latest:{keyword}` 형식으로 등록한 추천 카드가 있는 블로그) `GET .../api/v1/program?type=...`

---

## 프론트엔드 측 처리 (이미 완료)

1. **격리** — `<ProgramRecommendCard>`의 모든 fetch 분기, `getProgramRecommendList`, `getBlogRecommendList` 모두 try/catch + `.catch(...)`로 페이지 SSR 폭발 차단.
2. **Sentry 보고** — `captureBlogError` helper로 5xx는 `level: 'warning'`, 그 외는 `'error'`로 자동 분류. `domain: blog`, `section`, `lookup`, `httpStatus` 태그 부여.
3. **dev overlay 노이즈 제거** — `console.error` 호출 제거 (Sentry 보고는 유지).

관련 커밋/파일:
- `apps/web/src/domain/blog/utils/captureBlogError.ts` (신규)
- `apps/web/src/app/(user)/blog/[id]/[title]/page.tsx`
- `apps/web/src/domain/blog/card/ProgramRecommendCard.tsx`

---

## BE 팀 권장 액션

1. **`/v1/program/recommend` 우선 조사** — 가장 흔하게 호출되는 endpoint. 모든 블로그 상세 페이지 진입에서 실패 중.
2. **CHALLENGE-343, 259, 258 / LIVE-10 / VOD-14 데이터 점검** — 삭제된 row 참조? FK 무결성? 또는 람다 cold start 타임아웃?
3. **CloudWatch / API Gateway 로그**에서 2026-05-01 06:17 UTC 시점부터의 5xx 패턴 확인.
4. **VOD endpoint는 응답 status를 BE 표준 에러 응답 형식으로 통일** — 현재 어떤 호출에서는 status 정보가 프론트로 전달되지 않아 Sentry에서 warning vs error 분류가 안 됨.
5. **404 vs 500 구분** — 삭제/없는 데이터면 404가 맞음. 현재는 모두 500이라 "있는데 망가짐"인지 "없어서 못 찾음"인지 구분 불가.

---

## 원인 분석 → 별도 문서

서버 코드 분석 결과(가설 4개, 의심 코드 위치, BE 검증 SQL)는 다음 문서로 분리:

📄 **[2026-05-01-블로그-program-API-5xx-원인-가설.md](./2026-05-01-블로그-program-API-5xx-원인-가설.md)**

요약:
- 모든 500은 `GlobalExceptionHandler` fallback에서 출력 → unhandled exception (코드/데이터 결함).
- 가설 A 🔴: `findChallengePriceDetailVos`의 비정상 QueryDSL (FROM/SELECT 미스매치 + `.stream()` 직접 호출)
- 가설 B 🟡: 최근 `ChallengeOption.type` enum 추가에 따른 schema drift (커밋 `f738a8856`)
- 가설 C 🟢: `liveHelper.findLiveRecommendVo`의 안티패턴 (throw 아님, 별도 fix 대상)
- 가설 D 🟢: VOD-14는 사실 404 (status 정보가 클라이언트로 미전달되어 500처럼 보이는 케이스)

CloudWatch `>>> handle: Exception` 로그 1건이면 가설 확정 가능.

---

## 모니터링

해결 검증 시:

```
Sentry > Issues
필터: domain:blog AND level:warning AND httpStatus:500
기간: 마지막 24시간
```

위 필터 결과가 0이 되면 BE 수정 완료된 것.
