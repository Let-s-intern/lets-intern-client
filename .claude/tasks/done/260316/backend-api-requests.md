# 백엔드 API 요청사항

## 신규 API

| # | 우선순위 | 요청 API | 도메인 위치 | 기능 | 현재 구현 | 서버에 원하는 것 | 상태 |
|---|---------|---------|------------|------|----------|----------------|------|
| 1 | 높음 | `GET /mentor/schedule/dashboard` | 멘토 마이페이지 > 일정 (`schedule/SchedulePage.tsx`) | 주간 피드백 대시보드 | 챌린지 목록 → 미션 목록 → 멘티 목록 순차 호출 (28회+), 클라이언트에서 통계 계산 | 한 API에서 챌린지/미션/멘티/통계 모두 반환 | 대기 |
| 2 | 높음 | `PATCH /admin/attendance/bulk-assign` | 어드민 > 멘토멘티 배정 (`MentorMenteeAssignment.tsx`) | 멘티에 멘토 일괄 배정 | 선택된 멘티마다 개별 PATCH (20명이면 20회) | `{ mentorUserId, attendanceIds[] }` 배치 처리 | 대기 |
| 3 | 높음 | `DELETE /admin/user-career/user/{userId}/{careerId}` | 어드민 > 멘토 관리 | 어드민 추가 경력 삭제 | 프론트 mutation 구현 완료, 서버 API 없음 | API 추가 | 대기 |
| 4 | 중간 | `GET /admin/challenge/ongoing-feedback-summary` | 어드민 > 피드백 운영 > 진행중 챌린지 (`OngoingChallenges.tsx`) | 진행중 챌린지 + 피드백/멘토 현황 | 챌린지 행마다 피드백 미션 API + 멘토 API 호출 (N+1) | 한 API에서 챌린지별 현재 미션/멘토 포함 반환 | 대기 |
| 5 | 낮음 | `PATCH /admin/user-career/user/{userId}/{careerId}` | 어드민 > 멘토 관리 | 어드민 추가 경력 수정 | API 없어서 삭제 후 재등록 | API 추가 | 대기 |

## 기존 API 수정

| # | 우선순위 | 대상 API | 도메인 위치 | 기능 | 현재 문제 | 서버에 원하는 것 | 상태 |
|---|---------|---------|------------|------|----------|----------------|------|
| 6 | 높음 | `GET /program/admin` | 어드민 > 피드백 운영 (`OngoingChallenges.tsx`) | 진행중 챌린지 목록 | `status=PROCEEDING`이 모집 마감 기준이라, 진행 중이지만 모집 마감된 챌린지가 안 보임 | `endDateAfter` 파라미터 추가 또는 "실제 진행중" 필터 지원 | ✅ 완료 — `isActive` 파라미터 추가됨. `isActive=true`로 조회 |
| 7 | 높음 | `GET /user-career/my` | 멘토 마이페이지 > 프로필 (`CareerSection.tsx`) | 멘토 본인 경력 조회 | `isAddedByAdmin: true` 경력이 응답에서 누락 | 어드민 추가 경력도 포함 (읽기 전용 표시) | 대기 |
| 8 | 높음 | `GET /admin/challenge/{id}/mentor` | 어드민 > 멘토멘티 배정 (`MentorMenteeAssignment.tsx`) | 챌린지 멘토 목록 | 경력 정보 미포함 → 멘토마다 `/user/{id}` 개별 호출 (N+1) | 응답에 `careerInfos` (company, job) 포함 | ✅ 완료 — 멘토 `userCareer` 목록 추가됨 |
| 9 | 중간 | `GET /admin/user/mentor` | 어드민 > 멘토 관리 | 멘토 목록 조회 | email, phoneNum 미반환 → 전체 유저 API로 우회 | 응답에 `email`, `phoneNum`, `nickname` 추가 | 대기 |
| 10 | 중간 | `GET /challenge/{id}/mission/{mid}/feedback/attendances` | 멘토 마이페이지 > 피드백 모달 (`FeedbackModal.tsx`) | 피드백 제출자 목록 | 피드백 내용 미포함 → 멘티 선택 시 상세 API 추가 호출 | 각 attendance에 `feedback` 필드 포함 | 대기 |
| 11 | 중간 | `GET /challenge/{id}/mission/feedback` | 멘토 마이페이지 > 챌린지 상세 (`ChallengeDetailPage.tsx`) | 피드백 미션 목록 | 통계 미포함 → 미션마다 attendance 전체 조회 후 클라이언트 집계 | 각 미션에 `stats` (제출수, 완료수 등) 포함 | 대기 |

---

## ✅ 백엔드 업데이트 내역 (2026-03-16 수신)

아래 API가 백엔드에서 업데이트/신규 추가되었으므로 프론트엔드 코드 반영이 필요합니다.

### 1. 챌린지 멘토 목록 조회 — userCareer 추가 (기존 #8 해결)

- **엔드포인트**: `GET /api/v2/admin/challenge/{challengeId}/mentor`
- **변경**: 멘토 응답에 `userCareer` 목록 추가
- **영향 파일**: `src/api/mentor/mentorSchema.ts` (스키마에 userCareer 필드 추가), `MentorMenteeAssignment.tsx` (N+1 호출 제거)
- **TODO**:
  - [ ] `adminChallengeMentorListSchema`에 `userCareer` 배열 필드 추가
  - [ ] `MentorMenteeAssignment.tsx`에서 멘토별 개별 유저 조회 제거, 응답 데이터 직접 사용

### 2. 어드민 프로그램 조회 — isActive 파라미터 추가 (기존 #6 해결)

- **엔드포인트**: `GET /api/v1/program/admin`
- **변경**: `isActive` 파라미터 추가. 진행중인 챌린지 조회 시 `isActive=true`로 조회
- **영향 파일**: `src/api/program.ts`, `OngoingChallenges.tsx`
- **TODO**:
  - [ ] 프로그램 어드민 조회 hook에 `isActive` 파라미터 추가
  - [ ] `OngoingChallenges.tsx`에서 `isActive=true`로 진행중 챌린지 조회하도록 변경

### 3. 멘토-멘티 매칭 — 다건 등록으로 변경 (기존 #2 관련)

- **엔드포인트 변경**: `POST /api/v2/admin/challenge/{challengeId}/mentor/{challengeMentorId}/match/{applicationId}` → `POST /api/v2/admin/challenge/{challengeId}/mentor/{challengeMentorId}/match`
- **변경**: 단건(URL에 applicationId) → 다건(body에 applicationId 배열) 한번에 등록 가능
- **영향 파일**: `src/api/mentor/mentor.ts` (hook 수정), `MentorMenteeAssignment.tsx` (일괄 매칭 로직)
- **TODO**:
  - [ ] `usePostAdminChallengeMentorMatch` hook의 URL에서 `/{applicationId}` 제거
  - [ ] 요청 body에 `applicationIdList: number[]` 전달하도록 수정
  - [ ] `MentorMenteeAssignment.tsx`에서 다건 매칭 호출로 변경

### 4. [어드민] 프로그램 신청자 조회 — isMentee 파라미터 추가 (신규)

- **엔드포인트**: `GET /api/v1/challenge/{challengeId}/applications`
- **변경**: `isMentee` 파라미터 추가. 멘티 목록 조회 시 `isCanceled=false&isMentee=true`로 조회
- **영향 파일**: `src/api/challenge/challenge.ts` (hook 추가 또는 수정), `MentorMenteeAssignment.tsx`
- **TODO**:
  - [ ] 챌린지 신청자 조회 hook에 `isMentee`, `isCanceled` 파라미터 지원 추가
  - [ ] `MentorMenteeAssignment.tsx`에서 멘티 목록 조회 시 해당 파라미터 사용

### 5. [멘토용] 나의 멘티 제출 내역 조회 (신규 — 기존 #10 대체 가능)

- **엔드포인트**: `GET /api/v1/challenge/{challengeId}/mission/{missionId}/feedback/attendances/mentee`
- **설명**: 멘토 본인에게 배정된 멘티의 제출 내역만 조회. 미제출자는 `id`를 `null`로 반환
- **영향 파일**: `src/api/challenge/challenge.ts` (신규 hook), `src/api/challenge/challengeSchema.ts` (스키마), `FeedbackModal.tsx`
- **TODO**:
  - [ ] 멘토용 멘티 제출 내역 조회 hook 추가 (`useMentorMenteeAttendanceQuery`)
  - [ ] 스키마 추가 (id가 nullable)
  - [ ] `FeedbackModal.tsx`에서 기존 `useMentorMissionFeedbackAttendanceQuery` 대신 새 API 사용 검토

### 6. [멘토용] 참여중인 챌린지별 피드백 현황 조회 (신규 — 기존 #1 대체 가능)

- **엔드포인트**: `GET /api/v1/challenge/mentor/feedback-management`
- **설명**: 멘토가 참여중인 챌린지별 피드백 미션 제출/피드백 현황을 한번에 조회
- **영향 파일**: `src/api/challenge/challenge.ts` (신규 hook), `src/api/challenge/challengeSchema.ts` (스키마), `schedule/SchedulePage.tsx`, `ChallengeDetailPage.tsx`
- **TODO**:
  - [ ] 멘토 피드백 현황 조회 hook 추가 (`useMentorFeedbackManagementQuery`)
  - [ ] 응답 스키마 추가 (챌린지별 미션 목록 + 제출/피드백 통계)
  - [ ] `SchedulePage.tsx`에서 기존 N+1 호출 → 이 API 한 건으로 대체
  - [ ] `ChallengeDetailPage.tsx`에서도 활용 검토
