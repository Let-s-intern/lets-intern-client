# N+1 / 항목별 요청(fan-out) 패턴 정리

> 작성일: 2026-06-09
> 범위: monorepo 전체(`apps/{web,admin,mentor}/src`) 정적 조사 — `useQueries`, per-item `useQuery`(Fetcher), per-item mutation 루프
> 성격: **부채 인벤토리**. 대부분 "BE에 목록 필드/배치 엔드포인트가 없어 FE가 항목마다 호출"하는 구조. 즉시 버그는 아니나 목록이 커지면 요청 수가 선형 증가.

코드에는 `⚠️ N+1` 마커로 표시돼 있어 `grep -rn "⚠️ N+1" apps/*/src` 로 추적 가능.

---

## 요약

| # | 위치 | fan-out 단위 | 요청 수 | 분류 |
|---|---|---|---|---|
| R1 | mentor `useMergedFeedbackRows.ts` `useWrittenMissionRangeMap` | 챌린지마다 | N(챌린지) | 읽기·useQueries |
| R2 | mentor `useMergedFeedbackRows.ts` `useLiveMenteeSubmissionMap` | 라이브 세션마다 | N(세션) | 읽기·useQueries |
| R3 | mentor `WrittenMenteeAttendanceFetcher`→`MissionMenteeFetcher` | 미션마다 | N(미션) | 읽기·Fetcher |
| R4 | mentor `schedule/ui/ChallengeDataFetcher`→`MissionAttendanceFetcher` | 챌린지×미션 | N×M | 읽기·Fetcher |
| R5 | admin `useLegacyMentorAssignmentMap.ts` | 미션마다(attendances/prev) | N(미션) | 읽기·useQueries |
| R6 | admin `useLegacyMissionCounts.ts` | 미션마다(attendances/prev) | N(미션) | 읽기·useQueries |
| R7 | admin `live-feedback/mentor-schedule/MentorScheduleView.tsx` | 멘토마다(slot/{mentorId}) | N(멘토) | 읽기·useQueries |
| W1 | admin `magnet/hooks/useCommonFormBuilder.ts` | 질문마다(PATCH/POST) | N(질문) | 쓰기·루프 |
| W2 | admin `program/challenge/ChallengeOptionSection.tsx` | 옵션마다(PATCH) | N(옵션) | 쓰기·루프 |
| W3 | admin `faq/FaqSection.tsx` | FAQ마다(PATCH) | N(FAQ) | 쓰기·루프 |
| W4 | web/admin `library/apply/MagnetApplyContent.tsx` | 출시알림 프로그램마다(POST) | N(선택) | 쓰기·루프 |

---

## 1. 읽기 fan-out — `useQueries`

### R1. `useWrittenMissionRangeMap` — 챌린지마다 미션 목록 조회
- `apps/mentor/src/pages/feedback-management/hooks/useMergedFeedbackRows.ts` (`⚠️ N+1` 마커 있음)
- `GET /challenge/{id}/mission/feedback` 를 challengeId 마다 병렬 조회 → 서면 행 일정(missionId→{start,end}) 채움.
- **원인**: `feedback-management` 목록 응답에 미션 날짜가 없음.
- **개선**: BE 목록 응답에 미션 날짜 포함 → fan-out 제거.

### R2. `useLiveMenteeSubmissionMap` — 라이브 세션마다 단건 상세 조회
- 같은 파일 (`⚠️ N+1` 마커 있음)
- `GET /feedback/mentor/{id}` 를 라이브 feedbackId 마다 병렬 조회 → 라이브 행 멘티 제출(attendanceStatus) 채움.
- **원인**: 목록 VO `FeedbackMentorVo` 에 `attendanceStatus` 없음.
- **개선**: BE 목록 VO에 `attendanceStatus` 추가 → 단일 요청으로 대체.

### R5. `useLegacyMentorAssignmentMap` — 미션마다 출석 조회
- `apps/admin/src/pages/pages/challenge/mentor-assignment/hooks/useLegacyMentorAssignmentMap.ts`
- 230 미만(legacy) 챌린지에서 `.../mission/{missionId}/feedback/attendances/prev` 를 미션마다 병렬 조회해 멘토 배정 맵 산출.
- **원인**: legacy 챌린지에 멘토 배정 집계 API 부재.
- **개선**: BE가 챌린지 단위 배정/집계를 한 번에 제공.

### R6. `useLegacyMissionCounts` — 미션마다 출석 조회
- `apps/admin/src/pages/pages/challenge/feedback-operation/hooks/useLegacyMissionCounts.ts`
- R5와 동일하게 `attendances/prev` 를 미션마다 병렬 조회해 제출/완료 카운트 직접 계산.
- **개선**: BE가 미션별 카운트를 목록에 포함.

### R7. `MentorScheduleView` — 멘토마다 슬롯 조회
- `apps/admin/src/pages/challenge/feedback-operation/live-feedback/mentor-schedule/MentorScheduleView.tsx` (`N+1 허용` 주석 있음)
- `GET /admin/feedback/slot/{mentorId}` 를 멘토마다 useQueries 로 병렬 호출해 합산.
- **개선**: BE가 다중 멘토 슬롯을 한 번에 조회하는 엔드포인트 제공.

---

## 2. 읽기 fan-out — Fetcher 컴포넌트 (map 안에서 항목별 `useQuery`)

부모가 항목 배열을 `.map()` 으로 자식 컴포넌트를 렌더하고, **자식마다 `useQuery` 1건**을 호출하는 패턴. react-query 가 동일 key 는 dedupe 하지만 항목 수만큼 쿼리 인스턴스가 생긴다.

### R3. `WrittenMenteeAttendanceFetcher` → `MissionMenteeFetcher`
- `apps/mentor/src/pages/feedback-management/ui/WrittenMenteeAttendanceFetcher.tsx` (`⚠️ N+1` 마커 있음)
- (challenge, mission) 쌍마다 미션별 출석 API 조회 → 서면 행을 멘티별로 펼침.
- **개선**: BE `feedback-management` 응답에 멘티별 출석 포함.

### R4. `ChallengeDataFetcher` → `MissionAttendanceFetcher`
- `apps/mentor/src/pages/schedule/ui/ChallengeDataFetcher.tsx` (`⚠️ N+1` 마커 있음)
- 챌린지 1개의 미션 목록 조회 후, 미션마다 출석 API를 또 호출 → 총 (챌린지 수 × 미션 수).
- SchedulePage / FeedbackSummary(피드백 내역 페이지) 공용으로 소비.
- **개선**: BE가 챌린지별 미션+출석을 한 번에 제공.
- ⚠️ 중복 사본: `apps/admin/src/domain/mentor/schedule/ui/ChallengeDataFetcher.tsx`, `apps/web/src/domain/mentor/schedule/ui/ChallengeDataFetcher.tsx` 에도 같은 패턴 존재(멘토 스케줄 뷰 복제).

---

## 3. 쓰기 fan-out — 항목별 mutation 루프 (배치 API 부재)

`Promise.all(list.map((item) => patchOrPost(item)))` 형태. 저장 1번에 항목 수만큼 요청 발생. (※ `Promise.all` 로 병렬화돼 있어 latency 는 완화되나 요청 수 자체는 N건.)

### W1. magnet 질문 저장 — 질문마다 PATCH/POST
- `apps/admin/src/pages/magnet/hooks/useCommonFormBuilder.ts` (삭제분 PATCH + 수정/생성 루프 2개)
- **개선**: BE 가 질문 배열 일괄 upsert 엔드포인트 제공.
- ⚠️ 중복 사본: `apps/admin/src/domain/admin/magnet/hooks/useCommonFormBuilder.ts`.

### W2. 챌린지 옵션 저장 — 옵션마다 PATCH
- `apps/admin/src/pages/program/challenge/ChallengeOptionSection.tsx`
- `Promise.all(editingOptions.map(patchChallengeOpt))`.
- **개선**: 옵션 배열 일괄 PATCH 엔드포인트.
- ⚠️ 중복 사본: `apps/admin/src/domain/admin/program/challenge/ChallengeOptionSection.tsx`.

### W3. FAQ 저장 — FAQ마다 PATCH
- `apps/admin/src/domain/faq/FaqSection.tsx`
- `Promise.all(faqList.map(patchFaq))`.
- **개선**: FAQ 배열 일괄 저장 엔드포인트.

### W4. 마그넷 출시 알림 신청 — 선택 프로그램마다 POST
- web: `apps/web/src/domain/library/apply/MagnetApplyContent.tsx` (`⚠️ N+1 호출` 마커 있음)
- admin: `apps/admin/src/domain/library/apply/MagnetApplyContent.tsx` (`Promise.allSettled` 루프)
- batch 신청 API 부재로 magnetId 당 1회 POST.
- **개선**: 다건 신청 배치 API.

---

## 공통 개선 방향

1. **목록 응답 확장(읽기)**: R1·R2·R3·R4·R5·R6·R7 모두 "목록 API가 화면에 필요한 필드를 안 줘서 항목마다 상세/출석을 긁는" 동일 원인 → 1순위는 **BE 목록 응답에 필드 포함**.
2. **배치 엔드포인트(쓰기)**: W1~W4 는 "단건 엔드포인트만 있어 항목마다 호출" → **배열 일괄 upsert/신청 API** 로 해결.
3. 그 전까지 FE는 `useQueries`/`Promise.all` 로 **병렬화**해 latency 는 줄여 둔 상태(요청 수는 그대로).

## 주의 — 중복 트리

admin 은 `src/pages/...`(현 라우팅)과 `src/domain/admin/...`(DDD 이행 사본)이 병존하며, 일부 N+1 코드가 양쪽에 중복 존재한다. 멘토 스케줄(`domain/mentor/schedule`)은 mentor·admin·web 세 앱에 복제돼 있다. **본 조사는 코드 존재 기준**이며, 중복 사본별 라우팅 활성 여부까지 전수 확인하지는 않았다. 개선 시 중복 사본 동시 반영 필요.
