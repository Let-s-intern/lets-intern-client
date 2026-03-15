# API 업데이트 반영 태스크 (2026-03-16)

백엔드에서 전달받은 6건의 API 변경사항을 프론트엔드에 반영합니다.

## 작업 목록

### Task 1: 챌린지 멘토 목록 — userCareer 필드 추가
- **상태**: [x] 완료
- **파일**:
  - `src/api/mentor/mentorSchema.ts` — `adminChallengeMentorListSchema`에 `userCareer` 배열 추가
  - `src/domain/admin/pages/challenge/MentorMenteeAssignment.tsx` — 멘토별 개별 유저 조회(N+1) 제거, 응답 데이터 직접 사용
- **스키마 변경 예시**:
  ```ts
  mentorList: z.array(z.object({
    challengeMentorId: z.number(),
    userId: z.number(),
    name: z.string(),
    userCareerList: z.array(z.object({
      company: z.string().nullable(),
      job: z.string().nullable(),
    })).optional().default([]),
  }))
  ```
- **참고**: 실제 응답 필드명은 Swagger에서 확인 필요

### Task 2: 어드민 프로그램 조회 — isActive 파라미터
- **상태**: [x] 완료
- **파일**:
  - `src/api/program.ts` — 어드민 프로그램 조회 hook에 `isActive` 파라미터 추가
  - `src/domain/admin/challenge/feedback-operation/OngoingChallenges.tsx` — `isActive=true`로 호출 변경
- **변경 포인트**: 기존 `status=PROCEEDING` 대신 `isActive=true`로 진행중 챌린지 필터링

### Task 3: 멘토-멘티 매칭 — 다건 등록
- **상태**: [x] 완료
- **파일**:
  - `src/api/mentor/mentor.ts` — `usePostAdminChallengeMentorMatch` URL 변경 + body 수정
  - `src/domain/admin/pages/challenge/MentorMenteeAssignment.tsx` — 다건 매칭 호출로 변경
- **변경 내용**:
  - URL: `/{challengeId}/mentor/{challengeMentorId}/match/{applicationId}` → `/{challengeId}/mentor/{challengeMentorId}/match`
  - Body: `{ applicationIdList: number[] }`
  - 기존 단건 반복 호출 → 한번에 다건 전송

### Task 4: 신청자 조회 — isMentee 파라미터
- **상태**: [x] 완료
- **파일**:
  - `src/api/challenge/challenge.ts` — 신청자 조회 hook 추가/수정 (`isMentee`, `isCanceled` 파라미터)
  - `src/domain/admin/pages/challenge/MentorMenteeAssignment.tsx` — 멘티 목록 조회 시 사용
- **사용법**: `GET /api/v1/challenge/{challengeId}/applications?isCanceled=false&isMentee=true`

### Task 5: [멘토용] 나의 멘티 제출 내역 조회 (신규 API)
- **상태**: [x] 완료
- **파일**:
  - `src/api/challenge/challengeSchema.ts` — 응답 스키마 추가 (id nullable)
  - `src/api/challenge/challenge.ts` — `useMentorMenteeAttendanceQuery` hook 추가
  - `src/domain/mentor/feedback/FeedbackModal.tsx` — 새 API로 전환 검토
- **엔드포인트**: `GET /api/v1/challenge/{challengeId}/mission/{missionId}/feedback/attendances/mentee`
- **특이사항**: 미제출자는 `id`가 `null`로 반환됨 → 스키마에서 id를 nullable로 처리

### Task 6: [멘토용] 피드백 현황 조회 (신규 API)
- **상태**: [x] 완료
- **파일**:
  - `src/api/challenge/challengeSchema.ts` — 응답 스키마 추가
  - `src/api/challenge/challenge.ts` — `useMentorFeedbackManagementQuery` hook 추가
  - `src/domain/mentor/schedule/SchedulePage.tsx` — N+1 호출 대체
  - `src/domain/mentor/challenge/ChallengeDetailPage.tsx` — 활용 검토
- **엔드포인트**: `GET /api/v1/challenge/mentor/feedback-management`
- **효과**: 기존 28회+ API 호출 → 1회로 감소

## 작업 순서 (권장)

1. **Task 1 + Task 2** — 기존 API 수정 반영 (스키마/파라미터 추가만)
2. **Task 3 + Task 4** — 매칭 API 변경 + 신청자 조회 (MentorMenteeAssignment 관련)
3. **Task 5 + Task 6** — 신규 멘토용 API (Swagger에서 응답 스키마 확인 후 진행)

## 주의사항

- Task 5, 6의 응답 스키마는 Swagger에서 정확한 필드 확인 필요
- Task 6은 기존 SchedulePage의 데이터 흐름을 크게 바꾸므로 신중히 작업
