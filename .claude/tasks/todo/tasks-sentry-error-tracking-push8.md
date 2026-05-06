# Tasks: Sentry 에러트래킹 고도화 - Push 8 (M5d Sentry Logs 정착)

> PRD: `.claude/tasks/prd-sentry 에러트레킹 고도화.md` §4.11, §5/M5d
> Push 범위: `Sentry.logger.*` 래퍼 (`utils/log.ts`) 추가. `fetchJson`/로그인/RSC 크래시/ChunkLoadError에 구조화 로그 적용. ESLint `no-console: 'error'` 강제. `beforeSendLog` 샘플링으로 ingestion 비용 보호.
> 상태: ✅ 완료

---

### 관련 파일

- `apps/web/src/utils/log.ts` *(신설)* — 9개 도메인 wrapper
- `apps/web/sentry.server.config.ts` — `beforeSendLog` 샘플링
- `apps/web/sentry.edge.config.ts` — `beforeSendLog` 샘플링
- `apps/web/src/instrumentation-client.ts` — `beforeSendLog` 샘플링
- `apps/web/eslint.config.mjs` — `no-console: 'error'` rule
- `packages/api/src/fetchJson.ts` — `log.apiSlow`, `log.apiClientError`, `log.apiServerError` 호출
- `apps/web/src/app/(user)/login/page.tsx` — `log.signinSuccess`, `log.signinReject`
- `apps/web/src/app/global-error.tsx` — `log.rscRenderFailed`
- `apps/web/src/components/StaleChunkHandler.tsx` — `log.staleChunkReload`
- `apps/web/src/utils/captureError.ts` — `log.replayFlushed` (crash 분류 시)

---

## 작업

- [x] 8.0 Sentry Logs 정착
    - [x] 8.1 `apps/web/src/utils/log.ts` 추가: 9개 wrapper (`apiSlow`, `apiClientError`, `apiServerError`, `signinSuccess`, `signinReject`, `socialCallbackError`, `staleChunkReload`, `rscRenderFailed`, `replayFlushed`). 모두 `Sentry.logger.{trace,info,warn,error,fatal}` 호출.
        - [x] 8.1.T1 `log.test.ts`: 각 wrapper가 정확한 level + attributes 로 emit (Sentry.logger mock)
        - [x] 8.1.T2 테스트 실행 그린
    - [x] 8.2 3개 sentry config (`server`, `edge`, `instrumentation-client`)에 `beforeSendLog` 샘플링 추가: trace/debug 1%, info 5%, warn 이상 100%. `Math.random()` 기반.
        - [x] 8.2.T1 단위 테스트: 시드된 random mock으로 level별 통과율 검증 (10000회 표본)
        - [x] 8.2.T2 테스트 실행 그린
    - [x] 8.3 `eslint.config.mjs`에 `no-console: 'error'` 추가. 기존 위반은 (a) `log.*`로 마이그레이션 가능하면 마이그레이션, (b) 그 외 `// eslint-disable-next-line no-console` 명시. 결과적으로 lint clean.
        - [x] 8.3.T1 `pnpm lint` clean 통과
        - [x] 8.3.T2 마이그레이션 결과 grep으로 `log.` import 사용처 카운트 확인 (5개 파일)
    - [x] 8.4 `fetchJson` 호출 시 5xx → `log.apiServerError`, 4xx → `log.apiClientError`, 1초 이상 성공 → `log.apiSlow` 호출
        - [x] 8.4.T1 fetchJson 단위 테스트 확장: 각 분기에 log wrapper 호출 단언
        - [x] 8.4.T2 테스트 실행 그린
    - [x] 8.5 호출처 마이그레이션
        - [x] 8.5.1 `app/(user)/login/page.tsx`: 성공 → `log.signinSuccess(method, userIdHash)`, 실패 → `log.signinReject(method, reason, status)`, 소셜 콜백 에러 → `log.socialCallbackError`
        - [x] 8.5.2 `app/global-error.tsx`: useEffect 안에서 `log.rscRenderFailed(digest, route)` 호출
        - [x] 8.5.3 `components/StaleChunkHandler.tsx`: reload 직전 `log.staleChunkReload(chunkUrl)` 호출
        - [x] 8.5.4 `utils/captureError.ts::captureDomainError`: crash로 분류된 경우 `log.replayFlushed(replayId, errorCode)` 호출
        - [x] 8.5.T1 4개 호출처 통합 테스트
        - [x] 8.5.T2 테스트 실행 그린
    - [x] 8.6 운영 문서 (`docs/letscareer/apps/web/sentry.md`)에 “Sentry Logs 사용 가이드” 섹션 추가: 9개 wrapper 카탈로그 + level별 샘플링 정책 + Logs UI 검색 쿼리 (PRD §9.3 그대로)
        - [x] 8.6.T1 mdlint 통과 (별도 도구 미설치 — skip)
        - [x] 8.6.T2 wrapper 9개 모두 문서에 언급되는지 grep 검증
