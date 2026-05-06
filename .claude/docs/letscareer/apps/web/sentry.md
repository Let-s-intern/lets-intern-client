# Sentry 에러트래킹 운영 가이드

> 최종 업데이트: 2026-05-06
> 적용 범위: `apps/web`
> Sentry 프로젝트: `letscareer.sentry.io` / projectId `4510669498810369`

---

## 1. 에러 코드 표

| 코드 | 메시지 | 도메인 | 발생 위치 |
|---|---|---|---|
| `BLOG_FETCH_FAILED` | 블로그 조회에 실패했습니다. | blog | `api/blog/blog.ts::fetchBlogData` |
| `BLOG_RECOMMEND_FETCH_FAILED` | 추천 블로그 조회에 실패했습니다. | blog | `api/blog/blog.ts::fetchRecommendBlogData` |
| `VOD_FETCH_FAILED` | VOD 조회에 실패했습니다. | vod | `api/program.ts::fetchPublicVodData` |
| `GUIDEBOOK_FETCH_FAILED` | 가이드북 조회에 실패했습니다. | guidebook | `api/program.ts::fetchPublicGuidebookData` |
| `CHALLENGE_FETCH_FAILED` | 챌린지 조회에 실패했습니다. | challenge | `api/challenge/challenge.ts::fetchChallengeData` |
| `LIVE_FETCH_FAILED` | 라이브 프로그램 조회에 실패했습니다. | common | `api/program.ts::fetchLive` |
| `APPLICATION_FETCH_FAILED` | 신청 정보 조회에 실패했습니다. | common | `api/application.ts::fetchProgramApplication` |
| `REPORT_FETCH_FAILED` | 리포트 조회에 실패했습니다. | common | `api/report.ts::fetchReport`, `fetchReportId` |
| `REPORT_INVALID_TYPE` | 알 수 없는 리포트 유형입니다. | common | `api/report.ts::fetchReport` |
| `PRESIGNED_URL_FAILED` | 업로드 URL 발급에 실패했습니다. | common | `api/presignedUrl.ts::uploadToS3` |
| `*_NETWORK` | (원본 메시지) | - | fetchJson 네트워크 실패 |
| `*_PARSE` | (원본 메시지) | - | fetchJson Zod schema 파싱 실패 |

---

## 2. 도메인 태그 구조

모든 도메인 에러는 `captureDomainError` 또는 도메인별 wrapper를 통해 Sentry에 전송됩니다.

### 표준 태그

| 태그 | 값 예시 | 설명 |
|---|---|---|
| `domain` | `vod`, `blog`, `challenge`, `guidebook`, `auth`, `common` | 에러 도메인 |
| `section` | `fetchPublicVodData`, `vodDetailPage`, `signin` | 에러 발생 함수/섹션 |
| `errorCode` | `VOD_FETCH_FAILED` | 머신 식별 코드 |
| `httpStatus` | `500`, `404` | HTTP 응답 상태 |
| `noise` | `translator`, `wallet`, `stale-deploy` | 노이즈 분류 (격리용) |
| `kind` | `server-component` | RSC 에러 분류 |
| `replayId` | `abc123def456` | Sentry Replay 연결 ID (M5a 이후) |

### Fingerprint 규칙

`[domain, section, errorCode, httpStatus]` 고정

- 같은 VOD 다른 ID → **같은 그룹** (vodId는 extra에만)
- 같은 도메인 다른 status (404 vs 500) → **다른 그룹**

---

## 3. Sentry Discover 저장 쿼리

### 도메인별 5xx 추적

```
issue.category:error tags.domain:vod tags.httpStatus:[500 TO 599]
issue.category:error tags.domain:blog tags.httpStatus:[500 TO 599]
issue.category:error tags.domain:challenge tags.httpStatus:[500 TO 599]
```

### 신호만 (노이즈 제외)

```
!tags.noise:translator !tags.noise:stale-deploy !tags.noise:wallet
```

### 로그인 실패

```
tags.domain:auth tags.section:signin
```

### Server Components 크래시

```
tags.kind:server-component
```

### Replay 연결된 크래시

```
has:tags.replayId tags.errorCode:*
```

---

## 4. Slack 알람 라우팅

`webhook.ts` → `#dev-alert` Slack 채널으로 에러 전송.

| 조건 | 알람 수준 | 채널 |
|---|---|---|
| `httpStatus >= 500` (BE 장애) | Warning | `#dev-alert` |
| `httpStatus < 500` (FE 코드 버그) | Error | `#dev-alert` |
| `noise=translator\|wallet\|stale-deploy` | — | 알람 제외 (Sentry에는 noise 태그로 격리 보관) |
| `kind=server-component` | Error | `#dev-alert` |

### BE 핸드오프 시 확인할 정보

Sentry 이슈에서 Extra 필드를 확인:

- `endpoint`: 실패한 API 경로
- `method`: HTTP 메서드
- `serverMessage`: BE에서 내려준 에러 메시지
- `responseBody`: 응답 body 샘플 (500자 truncate)
- `httpStatus`: 응답 상태 코드

---

## 5. Replay 활용 가이드

### Slack 알람 → Replay 바로가기

Slack 알람에 `replayId` 태그가 있으면 자동으로 Sentry Replay URL이 포함됩니다.

```
https://sentry.io/organizations/letscareer/replays/{replayId}/
```

### Replay 정책 (M5a 이후)

- `replaysSessionSampleRate: 0` — 전체 세션 녹화 OFF
- `replaysOnErrorSampleRate: 1.0` — 크래시 시 100% 업로드
- `beforeErrorSampling` — 다음 조건만 크래시로 판정:
  - `level === 'fatal'`
  - `mechanism.handled === false` (unhandled exception)
  - `tags.kind === 'server-component'`
  - `exc.type === 'ChunkLoadError'`
  - `tags.errorCode` ends with `_PARSE`

---

## 6. 노이즈 격리

`classifyNoise(error)` 함수로 분류 후 `event.tags.noise`로 부착합니다.

| 분류 | 에러 패턴 | 대응 |
|---|---|---|
| `translator` | `TypeError` + `parentNode/removeChild/insertBefore` | noise 태그 부착, 별도 saved search로 관리 |
| `wallet` | `metamask/web3/ethereum/wallet` 포함 | noise 태그 부착, 무시 가능 |
| `stale-deploy` | `ChunkLoadError` / `Failed to load chunk` | noise 태그 + `StaleChunkHandler`가 1회 자동 reload |

### StaleChunkHandler 동작

`src/components/StaleChunkHandler.tsx`가 `app/layout.tsx`에 마운트됨.

- `window` 전역 `error`/`unhandledrejection` 이벤트 감시
- `ChunkLoadError` 감지 → `sessionStorage['sentry_stale_chunk_reloaded']` 확인
- 미설정이면 flag 세팅 후 `window.location.reload()`
- 이미 설정이면 무한 루프 방지를 위해 reload 생략

---

## 7. 개발자 가이드

### 새 도메인 에러 캡처 추가

```typescript
import { captureVodError } from '@/utils/captureError';

// 5xx → warning, 4xx → error 자동 분류
captureVodError(err, {
  section: 'fetchPublicVodData',  // 함수명 또는 섹션명
  extra: { vodId },               // 동적 식별자는 extra에
});
```

### fetchJson 사용

```typescript
import { fetchJson } from '@letscareer/api';

const data = await fetchJson<MyType>(url, {
  code: 'MY_FETCH_FAILED',
  displayMessage: '데이터 조회에 실패했습니다.',  // 한국어 고정
  parse: (raw) => mySchema.parse(raw),            // 선택 사항
});
```

### 에러 클래스 계층

```
Error
  └── AppError (code, displayMessage, status, context)
        ├── ApiError (endpoint, method, serverMessage)
        │     └── AuthError
        └── SchemaParseError
```

---

## 8. 모니터링 체크리스트 (배포 후 7일)

- [ ] `domain` 태그 없는 이슈 비율 < 5%
- [ ] `서버 내부 오류입니다.` 그룹이 domain별로 분리됨
- [ ] `noise=translator` 이슈가 메인 이슈 보드에서 비노출
- [ ] Replay 업로드 건수 감소 확인 (크래시 건수만)
- [ ] Slack 알람에 `replayId` 태그 포함 여부 확인
