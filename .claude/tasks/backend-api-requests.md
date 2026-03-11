# 백엔드 API 요청사항

## 신규 API

| # | 우선순위 | 요청 API | 도메인 위치 | 기능 | 현재 구현 | 서버에 원하는 것 |
|---|---------|---------|------------|------|----------|----------------|
| 1 | 높음 | `GET /mentor/schedule/dashboard` | 멘토 마이페이지 > 일정 (`schedule/SchedulePage.tsx`) | 주간 피드백 대시보드 | 챌린지 목록 → 미션 목록 → 멘티 목록 순차 호출 (28회+), 클라이언트에서 통계 계산 | 한 API에서 챌린지/미션/멘티/통계 모두 반환 |
| 2 | 높음 | `PATCH /admin/attendance/bulk-assign` | 어드민 > 멘토멘티 배정 (`MentorMenteeAssignment.tsx`) | 멘티에 멘토 일괄 배정 | 선택된 멘티마다 개별 PATCH (20명이면 20회) | `{ mentorUserId, attendanceIds[] }` 배치 처리 |
| 3 | 높음 | `DELETE /admin/user-career/user/{userId}/{careerId}` | 어드민 > 멘토 관리 | 어드민 추가 경력 삭제 | 프론트 mutation 구현 완료, 서버 API 없음 | API 추가 |
| 4 | 중간 | `GET /admin/challenge/ongoing-feedback-summary` | 어드민 > 피드백 운영 > 진행중 챌린지 (`OngoingChallenges.tsx`) | 진행중 챌린지 + 피드백/멘토 현황 | 챌린지 행마다 피드백 미션 API + 멘토 API 호출 (N+1) | 한 API에서 챌린지별 현재 미션/멘토 포함 반환 |
| 5 | 낮음 | `PATCH /admin/user-career/user/{userId}/{careerId}` | 어드민 > 멘토 관리 | 어드민 추가 경력 수정 | API 없어서 삭제 후 재등록 | API 추가 |

## 기존 API 수정

| # | 우선순위 | 대상 API | 도메인 위치 | 기능 | 현재 문제 | 서버에 원하는 것 |
|---|---------|---------|------------|------|----------|----------------|
| 6 | 높음 | `GET /program/admin` | 어드민 > 피드백 운영 (`OngoingChallenges.tsx`) | 진행중 챌린지 목록 | `status=PROCEEDING`이 모집 마감 기준이라, 진행 중이지만 모집 마감된 챌린지가 안 보임 | `endDateAfter` 파라미터 추가 또는 "실제 진행중" 필터 지원 |
| 7 | 높음 | `GET /user-career/my` | 멘토 마이페이지 > 프로필 (`CareerSection.tsx`) | 멘토 본인 경력 조회 | `isAddedByAdmin: true` 경력이 응답에서 누락 | 어드민 추가 경력도 포함 (읽기 전용 표시) |
| 8 | 높음 | `GET /admin/challenge/{id}/mentor` | 어드민 > 멘토멘티 배정 (`MentorMenteeAssignment.tsx`) | 챌린지 멘토 목록 | 경력 정보 미포함 → 멘토마다 `/user/{id}` 개별 호출 (N+1) | 응답에 `careerInfos` (company, job) 포함 |
| 9 | 중간 | `GET /admin/user/mentor` | 어드민 > 멘토 관리 | 멘토 목록 조회 | email, phoneNum 미반환 → 전체 유저 API로 우회 | 응답에 `email`, `phoneNum`, `nickname` 추가 |
| 10 | 중간 | `GET /challenge/{id}/mission/{mid}/feedback/attendances` | 멘토 마이페이지 > 피드백 모달 (`FeedbackModal.tsx`) | 피드백 제출자 목록 | 피드백 내용 미포함 → 멘티 선택 시 상세 API 추가 호출 | 각 attendance에 `feedback` 필드 포함 |
| 11 | 중간 | `GET /challenge/{id}/mission/feedback` | 멘토 마이페이지 > 챌린지 상세 (`ChallengeDetailPage.tsx`) | 피드백 미션 목록 | 통계 미포함 → 미션마다 attendance 전체 조회 후 클라이언트 집계 | 각 미션에 `stats` (제출수, 완료수 등) 포함 |
