# BE 협업 요청 — 멘토 라이브 피드백 상세 응답에 회의실 메타 필드 추가

> 작성일: 2026-05-21
> 컨텍스트: PRD `jitsi-라이브-피드백-도입.md` / Push 3 (멘토 Jitsi 교체)
> 우선순위: **HIGH** — 통합 배포(Push 2 + 3) 전제

## 문제

Jitsi는 백엔드가 회의실 URL을 직접 내려주지 않고 **프론트가 메타데이터로 동일한 URL을 합성**한다(`buildJitsiRoomUrl`). 멘티/멘토가 같은 방에 입장하려면 양측이 만든 URL의 입력값이 **완전히 동일**해야 한다.

```
buildJitsiRoomUrl({
  baseUrl,
  challengeName,
  missionName,   // ← 멘토 측에 없음
  menteeName,    // ← 멘토 측 BE 응답에는 없음 (현재 schedule mock에만 존재)
  startDate,
  feedbackId,
})
```

멘티 측(`apps/web`)은 자기 페이지의 `challengeName`, `mission.title`, `useUserQuery().data.name`, `reservation.startDate`, `reservation.feedbackId`로 입력을 채운다. **멘토 측(`apps/mentor`)은 schedule 페이지 컨텍스트에서 동일한 정보를 얻을 수 없다.**

## 현재 멘토 BE 응답 (`GET /api/v1/feedback/{feedbackId}`)

```ts
// apps/mentor/src/api/feedback/feedbackSchema.ts
export const feedbackSchema = z.object({
  feedbackId: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  meetingUrl: z.string().nullable(),
  status: feedbackStatusSchema,
});
```

- `challengeTitle` ❌ 없음 (멘토 schedule mock에는 있으나 BE 미연동)
- `missionTitle`  ❌ **완전히 없음** (mock에도 없음)
- `menteeName`    ❌ 없음 (멘토 schedule mock에만 있고 BE 미연동)

## 요청 사항

`GetFeedbackDetailResponse` (`/api/v1/feedback/{feedbackId}` 또는 별도 mentor 전용 엔드포인트)에 아래 3개 필드를 **멘티 측과 동일한 정규화 형태**로 추가:

| 필드 | 타입 | 멘티 측 출처 (동일 값 보장 필요) |
|---|---|---|
| `challengeTitle` | `string` | 멘티 페이지 `challengeName` (챌린지 제목 그대로) |
| `missionTitle`   | `string` | 멘티 페이지 `LiveFeedbackMission.title` |
| `menteeName`     | `string` | 멘티 본인 `useUserQuery().data.name` (멘티 본명) |

### 정규화 가드 (중요)

`buildJitsiRoomUrl`은 입력 문자열을 **있는 그대로** 해시 키 일부로 사용한다. 다음을 양측에서 동일하게 유지해야 한다:

- 앞뒤 공백 trim 여부
- 영문 대소문자
- 멀티 공백(`"  "` vs `" "`) 처리
- 특수문자 (`·`, `—`, `'` 등)

**권장**: BE에서 동일 source-of-truth(챌린지 row, mission row, user row)에서 값을 꺼내 양측 응답에 동일 문자열로 응답.

## 임시 처리 (FE 합의)

BE 추가 전까지 멘토 측 `JitsiEmbedModal` 호출부는:

- `challengeName`: `selectedBar.challengeTitle` (schedule mock) — BE 연동 시 `feedbackDetail.challengeTitle`로 교체
- `menteeName`: `selectedBar.liveFeedback.menteeName` (schedule mock) — BE 연동 시 `feedbackDetail.menteeName`로 교체
- `missionName`: **placeholder 사용** (`{th}회차 라이브 피드백` 형식). 멘티 측과 불일치 → **방 분리 발생**. 통합 QA 전 BE 응답 추가 필수
- `startDate`: `feedbackDetail.startDate` (이미 BE 응답 존재) → 양측 동일
- `feedbackId`: `feedbackDetail.feedbackId` → 양측 동일

## 완료 시 FE 작업

1. `feedbackSchema`에 3 필드 추가
2. `LiveFeedbackReservationModal`의 임시 placeholder 제거 → BE 필드 사용
3. 통합 QA: 멘티/멘토 둘 다 입장 시 동일 방에 모이는지 iframe src 비교
