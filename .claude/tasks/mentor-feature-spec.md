# 멘토 마이페이지 기능명세서 (구현 현황)

> 경로: `src/domain/mentor/` | 브랜치: `LC-2888-멘토-마이페이지-ver01`

## 기능 구현 현황

| 기능번호 | 페이지 | 기능명 | 구현 방식 | API (훅) | 주요 컴포넌트 | 비고 |
|----------|--------|--------|-----------|----------|---------------|------|
| **WK-01** | 스케줄 (메인) | 주간 캘린더 렌더링 | 7일 그리드에 챌린지별 기간 바 배치, 겹치는 챌린지는 행 분리. 보이지 않는 컴포넌트 페처 패턴으로 챌린지→미션→출석 계층적 데이터 로딩 | `GET /challenge-mentor` (`useMentorChallengeListQuery`) → `GET /challenge/{id}/mission/feedback` (`useMentorMissionFeedbackListQuery`) → `GET /challenge/{id}/mission/{id}/feedback/attendances` (`useMentorMissionFeedbackAttendanceQuery`) | `SchedulePage`, `WeeklyCalendar`, `ChallengePeriodBar` | 신규 통합 API 대신 기존 API 3개 조합으로 구현 |
| **WK-02** | 스케줄 (메인) | 주 이동 | `useState`로 주 시작일 관리, 이전/다음 주 버튼으로 날짜 변경 후 API 재호출 | 프론트 로직 (날짜 변경) | `WeekNavigation` | |
| **WK-03** | 스케줄 (메인) | 주간 요약 카드 | `useMemo`로 기간 바 데이터 집계하여 4개 통계 카드 계산 (전체/오늘마감/미완료/진행률) | 로컬 계산 (WK-01 데이터 활용) | `WeeklySummary` | 신규 통합 API 대신 프론트 로컬 계산으로 구현. 진행률 카드 추가 (명세 대비 추가) |
| **WK-04** | 스케줄 (메인) | 챌린지 필터 | "전체" 또는 개별 챌린지 버튼 선택 → `useState`로 필터 상태 관리 → 캘린더 기간 바 필터링 | `GET /challenge-mentor` (`useMentorChallengeListQuery`) | `ChallengeFilter` | |
| **WK-05** | 스케줄 (메인) | 기간 바 정보 | 챌린지별 4색 순환(주황/하늘/초록/보라), 미제출/제출 수 + 피드백 상태 카운트(대기/진행/완료) 표시 | `GET /challenge/{id}/mission/{id}/feedback/attendances` (`useMentorMissionFeedbackAttendanceQuery`) | `ChallengePeriodBar` | 출석 상태 `ABSENT`=미제출, 나머지=제출로 분류 |
| **WK-06** | 스케줄 (메인) | 바 클릭 → 모달 | 기간 바 클릭 시 `challengeId`, `missionId`를 모달에 전달하여 피드백 모달 오픈 | 프론트 인터랙션 | `ChallengePeriodBar` → `FeedbackModal` | |
| **WK-07** | 스케줄 (메인) | 환영 메시지 표시 | `useUserQuery`로 멘토 이름 조회 후 개인화된 인사 메시지 표시 | `GET /user` (`useUserQuery`) | `WelcomeMessage` | 신규 환영 메시지 API 대신 유저 이름으로 하드코딩된 환영 문구 사용 |
| **FB-01** | 피드백 모달 | 멘티 리스트 | 스크롤 사이드바에 이름 + 상태 뱃지 표시, 선택 하이라이트, 전환 시 미저장 경고 | `GET /challenge/{id}/mission/{id}/feedback/attendances` (`useMentorMissionFeedbackAttendanceQuery`) | `MenteeList` | |
| **FB-02** | 피드백 모달 | 멘티 정보 + 링크 | 멘티명, 제출 상태, 제출물 링크(외부), 희망 직무/산업/기업, 피드백 상태 색상 코딩 | `GET /challenge/{id}/mission/{id}/feedback/attendances/{id}` (`useFeedbackAttendanceQuery`) | `MenteeInfo` | |
| **FB-03** | 피드백 모달 | 피드백 에디터 | Lexical 에디터 기반 리치 텍스트 작성. FB-02 응답의 feedback 필드를 에디터에 로드 (null이면 빈 에디터). 완료/확인완료 시 읽기 전용 전환 | `useFeedbackAttendanceQuery` 응답 활용 | `FeedbackEditor` | 명세의 Markdown 에디터 대신 Lexical 에디터 사용 |
| **FB-04** | 피드백 모달 | 임시 저장 | 현재 에디터 내용을 `IN_PROGRESS` 상태로 서버 저장 (이후 수정 가능) | `PATCH /attendance/{id}/mentor` (`usePatchAttendanceMentorMutation`) | `FeedbackActions` | 뮤테이션 성공 후 쿼리 무효화 |
| **FB-05** | 피드백 모달 | 최종 제출 | 확인 다이얼로그 후 `COMPLETED` 상태로 제출 (이후 수정 불가, 읽기 전용 전환) | `PATCH /attendance/{id}/mentor` (`usePatchAttendanceMentorMutation`) | `FeedbackActions` | |
| **FB-06** | 피드백 모달 | 상태 인디케이터 | 3단계 표시: 시작 전(회색) → 진행 중(노란색) → 완료(초록색). FB-02 응답의 `feedbackStatus` 값으로 렌더링 | API 호출 없음 | `StatusIndicator` | |
| **FB-07** | 피드백 모달 | 닫기 / 멘티 전환 | X 닫기 + 멘티 클릭 시 우측 전환. 미저장 시 확인 다이얼로그. 모달 열림 시 첫 멘티 자동 선택 | 프론트 인터랙션 (전환 시 FB-02 재호출) | `FeedbackModal` | `editorContent` vs `serverContent` 비교로 dirty 체크 |
| **PF-01** | 프로필 | 프로필 조회/수정 | 프로필 이미지(5MB 제한, 업로드/삭제), 이름, 닉네임, 전화번호, SNS, 이메일 입력 | `GET /user` (`useUserQuery`) | `BasicInfo` | 신규 프로필 API 대신 기존 user API 활용 |
| **PF-02** | 프로필 | 한줄 소개 | textarea로 소개 작성, 프로필 저장 시 함께 전송 | `PATCH /user` (`usePatchUser`) | `Introduction` | |
| **PF-03** | 프로필 | 경력 관리 | 경력 카드 CRUD: 조회(페이지네이션), 추가(FormData POST), 수정(blur 시 자동 PATCH), 삭제(확인 후 DELETE) | `GET /user-career/my` (`useGetUserCareerQuery`), `POST /user-career/my` (`usePostUserCareerMutation`), `PATCH /user-career/my/{id}` (`usePatchUserCareerMutation`), `DELETE /user-career/my/{id}` (`useDeleteUserCareerMutation`) | `CareerSection` | 명세의 일괄 저장 대신 개별 CRUD API로 구현 |
| **PF-04** | 프로필 | 프로필 저장 | 확인 다이얼로그 후 기본정보 + 소개 일괄 저장 | `PATCH /user` (`usePatchUser`) | `ProfilePage` | 경력은 PF-03에서 개별 저장, 기본정보+소개만 일괄 |
| - | 피드백 모달 | 피드백 가이드 라인 | 모달 헤더에 Notion 외부 링크 (config.json URL) | - | `FeedbackModal` 헤더 | 명세에 없는 추가 구현 |
| - | 챌린지 목록 | 챌린지 카드 그리드 | 참여 중인 챌린지를 그리드로 표시, 썸네일/제목/설명/상태뱃지(준비중/진행중/완료)/기간 표시. 날짜 기반 상태 판별 | `GET /challenge-mentor` (`useMentorChallengeListQuery`) | `ChallengeListPage`, `MentorChallengeCard` | 명세에 없는 추가 구현 (별도 페이지) |
| - | 챌린지 상세 | 미션별 피드백 현황 | 미션 회차별 제출 건수, 피드백 상태 뱃지(대기/진행/완료), 진행률 표시. "피드백 작성" 버튼 → 모달 오픈 | `GET /challenge/{id}/mission/feedback` (`useMentorMissionFeedbackListQuery`), `GET /challenge/{id}/mission/{id}/feedback/attendances` (`useMentorMissionFeedbackAttendanceQuery`) | `ChallengeDetailPage` | 명세에 없는 추가 구현 (별도 페이지) |
| - | 공지사항 목록 | 공지 리스트 | 중요(ESSENTIAL)/실시간(ADDITIONAL) 분류, 상대 시간 표시 | **Mock 데이터** (API 미연동) | `NoticeListPage` | 명세에 없는 추가 구현. API 연동 필요 |
| - | 공지사항 상세 | 공지 상세 | 뒤로가기, 제목/작성일/본문 표시 | **Mock 데이터** (API 미연동) | `NoticeDetailPage` | 명세에 없는 추가 구현. API 연동 필요 |

## 피드백 상태 흐름

```
WAITING(진행전) → IN_PROGRESS(진행중, 임시저장) → COMPLETED(진행완료, 제출) → CONFIRMED(확인완료, 멘티 확인)
```

- `WAITING` / `IN_PROGRESS`: 에디터 편집 가능
- `COMPLETED` / `CONFIRMED`: 읽기 전용

## 사용된 API 훅 요약

| 훅 | 메서드 | 엔드포인트 | 사용 기능번호 |
|----|--------|------------|---------------|
| `useUserQuery` | GET | `/user` | WK-07, PF-01 |
| `usePatchUser` | PATCH | `/user` | PF-02, PF-04 |
| `useMentorChallengeListQuery` | GET | `/challenge-mentor` | WK-01, WK-04 |
| `useMentorMissionFeedbackListQuery` | GET | `/challenge/{id}/mission/feedback` | WK-01 |
| `useMentorMissionFeedbackAttendanceQuery` | GET | `/challenge/{id}/mission/{id}/feedback/attendances` | WK-01, WK-05, FB-01 |
| `useFeedbackAttendanceQuery` | GET | `/challenge/{id}/mission/{id}/feedback/attendances/{id}` | FB-02, FB-03 |
| `usePatchAttendanceMentorMutation` | PATCH | `/attendance/{id}/mentor` | FB-04, FB-05 |
| `useGetUserCareerQuery` | GET | `/user-career/my` | PF-03 |
| `usePostUserCareerMutation` | POST | `/user-career/my` | PF-03 |
| `usePatchUserCareerMutation` | PATCH | `/user-career/my/{id}` | PF-03 |
| `useDeleteUserCareerMutation` | DELETE | `/user-career/my/{id}` | PF-03 |
