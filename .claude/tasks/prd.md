# 멘토 마이페이지 v0.2 — PRD

> **브랜치**: `LC-2888-멘토-마이페이지-ver01`
> **작성일**: 2026-03-06
> **이전 버전**: `.claude/tasks/done/260306/prd260304.md` (v0.1.1)

---

## 1. 배경 및 목적

v0.1.1에서 멘토 마이페이지 3개 화면(프로그램 일정 / 서면 피드백 모달 / 프로필)의 기본 구조를 완성했다. 그러나 프로필 저장 기능이 백엔드 API 부재로 미연결 상태였고, 피드백 에디터가 단순 텍스트 에디터(Lexical 기본)로 구현되어 있었다.

**백엔드에서 다음 API 필드가 추가되었다:**
- `GET/PATCH /api/v1/user` — `nickname`, `introduction`, `profileImgUrl`, `sns` 필드 추가
- `/api/v1/user-career/*` — `field`(업무분야), `position`(직책), `department`(부서명) 필드 추가
- `POST /api/v1/file` — `FileType: USER_PROFILE` 추가

이로써 프로필 페이지의 **저장 기능을 실제 API와 연동**할 수 있게 되었다.

### 1-1. v0.2 목표

1. **프로필 API 연동 완성** — 기본정보(nickname, sns, profileImgUrl, introduction) 저장/조회
2. **경력 API 연동** — user-career API로 경력 CRUD 연결 (field, position, department 신규 필드 활용)
3. **프로필 이미지 업로드** — USER_PROFILE 파일타입으로 이미지 업로드 연동
4. **피드백 에디터 개선** — Lexical 에디터 Markdown 서식 지원 강화
5. **와이어프레임 디자인 정합성** — 현재 UI를 와이어프레임에 맞게 보정
6. **코드 품질 개선** — v0.1.1에서 확인된 mock 데이터 제거 (완료), 추가 리팩터링

---

## 2. API 변경사항 상세

> Swagger: https://letsintern.kr/v3/api-docs

### 2-1. User API 필드 추가

**`GET /api/v1/user` 응답에 추가된 필드:**

| 필드명 | 타입 | 설명 | 비고 |
|--------|------|------|------|
| `nickname` | `string \| null` | 활동명 | 신규 |
| `introduction` | `string \| null` | 한줄 소개 | 신규 |
| `profileImgUrl` | `string \| null` | 프로필 이미지 URL | 신규 |
| `sns` | `string \| null` | SNS 링크 | 신규 |

**`PATCH /api/v1/user` 요청 바디에 추가 가능한 필드:**

| 필드명 | 타입 | 설명 |
|--------|------|------|
| `nickname` | `string` | 활동명 |
| `introduction` | `string` | 한줄 소개 |
| `profileImgUrl` | `string` | 프로필 이미지 URL (파일 업로드 후 받은 URL) |
| `sns` | `string` | SNS 링크 |

### 2-2. User Career API 필드 추가

**기존 `userCareerSchema` 필드:**
- `id`, `company`, `job`, `employmentType`, `startDate`, `endDate`

**추가된 필드:**

| 필드명 | 타입 | 설명 | 비고 |
|--------|------|------|------|
| `field` | `string \| null` | 업무분야 | 신규 |
| `position` | `string \| null` | 직책 | 신규 |
| `department` | `string \| null` | 부서명 | 신규 |

**관련 API 엔드포인트:**
- `GET /api/v1/user-career/my` — 나의 커리어 목록 조회
- `POST /api/v1/user-career/my` — 나의 커리어 생성 (multipart/form-data)
- `PATCH /api/v1/user-career/my/{id}` — 나의 커리어 수정 (multipart/form-data)
- `DELETE /api/v1/user-career/my/{id}` — 나의 커리어 삭제

### 2-3. 파일 업로드 API

**`POST /api/v1/file`**
- `type` 파라미터에 `USER_PROFILE` 추가
- 요청: `multipart/form-data` (file: binary)
- 응답: `{ fileUrl: string }` — S3 URL 반환

---

## 3. 현재 구현 상태 (v0.1.1 기준)

### 3-1. 완료된 기능

| 화면 | 상태 | 비고 |
|------|------|------|
| 프로그램 일정 (7/7) | ✅ 완료 | 서버 데이터 연동 완료 |
| 서면 피드백 모달 (5/7) | ⚠️ 부분 | 에디터 서식 미지원, 노션링크 위치 |
| 프로필 (2/4) | ⚠️ 부분 | 저장 미연결, 이미지 업로드 없음 |
| 인프라 (4/4) | ✅ 완료 | 라우트/가드/사이드바/Provider |

### 3-2. v0.2에서 해결할 미완성 기능

| 기능 ID | 내용 | 원인 | 해결 방법 |
|---------|------|------|-----------|
| PF-01 | 프로필 이미지 업로드 | FileType 미지원 | `USER_PROFILE` 타입으로 file API 연동 |
| PF-01 | 기본정보 조회/저장 | API 필드 부재 | userSchema에 nickname, sns, introduction, profileImgUrl 추가 후 PATCH 연동 |
| PF-02 | 한줄 소개 저장 | API 필드 부재 | introduction 필드로 PATCH 연동 |
| PF-03 | 경력 CRUD API 연동 | 로컬 상태만 사용 | user-career API 연동 |
| PF-04 | 저장 버튼 동작 | API 부재 | PATCH /api/v1/user + user-career API 조합 |
| FB-02 | 멘티 정보에 노션 링크 | 하단에만 표시 | 멘티 정보 영역에도 추가 |
| FB-03 | Markdown 서식 | 단순 텍스트 | Lexical 에디터 서식 플러그인 활성화 |

---

## 4. 화면별 상세 변경 스펙

### 4-1. 프로필 페이지 (`/mentor/profile`)

> 와이어프레임: `.claude/tasks/profile.png`

#### PF-01 기본 정보 — API 연동

**현재 코드**: `src/domain/mentor/profile/BasicInfo.tsx`
- 폼 필드: name, nickname, phoneNum, sns, email (useState로 관리)
- 초기값: `GET /api/v1/user`의 name, email, phoneNum만 채움

**변경사항:**

1. **userSchema 확장** (`src/api/user/user.ts:205-229`)
   ```
   기존 필드 + nickname, introduction, profileImgUrl, sns 추가 (모두 nullable)
   ```

2. **PatchUserBody 타입 확장** (`src/api/user/user.ts:263-282`)
   ```
   기존 필드 + nickname, introduction, profileImgUrl, sns 추가
   ```

3. **BasicInfo 초기값 로드 개선** (`ProfilePage.tsx`)
   - useUserQuery에서 nickname, sns도 폼에 채움
   - introduction은 Introduction 컴포넌트에 전달

4. **저장 로직 구현** (`ProfilePage.tsx`)
   - `usePatchUser` 훅 사용
   - 저장 시 PATCH /api/v1/user에 { name, nickname, phoneNum, sns, email, introduction, profileImgUrl } 전송
   - 성공 시 토스트 알림, 실패 시 에러 알림

#### PF-01 프로필 이미지 업로드

**와이어프레임 기준:**
- 좌측 큰 사각형 영역 (권장 600px, 5MB 이하)
- 업로드 아이콘 + 삭제 아이콘 버튼

**구현:**

1. **FileType에 USER_PROFILE 추가** (`src/api/file.ts:6-18`)
   ```
   fileType enum에 'USER_PROFILE' 추가
   ```

2. **이미지 업로드 컴포넌트 추가** (`BasicInfo.tsx`)
   - `<input type="file" accept="image/*">` (hidden)
   - 클릭 시 파일 선택 → `uploadFile({ file, type: 'USER_PROFILE' })` 호출
   - 성공 시 profileImgUrl 상태 업데이트 → 이미지 미리보기 표시
   - 삭제 버튼 → profileImgUrl을 빈 문자열로 설정

#### PF-02 한줄 소개 — API 연동

**현재 코드**: `src/domain/mentor/profile/Introduction.tsx`
- 텍스트 입력만 가능, 저장 미연결

**변경사항:**
- ProfilePage에서 useUserQuery의 introduction 값으로 초기화
- 저장 시 PF-01과 함께 PATCH 요청에 introduction 포함

#### PF-03 경력 — API 연동

**현재 코드**: `src/domain/mentor/profile/CareerSection.tsx`
- 로컬 useState로 careers 배열 관리
- 필드: company, field, position, department, startDate, endDate

**와이어프레임 기준:**
- 필드: 회사명, 업무분야(드롭다운), 직책(드롭다운), 부서명, 입사일(캘린더), 퇴사일(캘린더)
- `+` 버튼: 경력 추가
- `-` 버튼: 경력 삭제

**변경사항:**

1. **경력 스키마 확장** (`src/api/career/careerSchema.ts`)
   - `userCareerSchema`에 field, position, department 추가 (nullable)

2. **경력 조회 연동** (`ProfilePage.tsx`)
   - `useGetUserCareerQuery` 훅으로 기존 경력 목록 조회
   - 응답 데이터를 CareerSection에 전달

3. **경력 생성/수정/삭제 연동** (`CareerSection.tsx`)
   - 추가: `usePostUserCareerMutation` 사용
   - 수정: `usePatchUserCareerMutation` 사용
   - 삭제: `useDeleteUserCareerMutation` 사용
   - 각 API는 multipart/form-data 형식 (requestDto + verificationFile)

4. **와이어프레임 정합**
   - 업무분야, 직책을 드롭다운(select)으로 변경 (현재 text input)
   - 입사일, 퇴사일을 YYYY.MM 형식 date picker로 변경 (현재 text input)

#### PF-04 저장 버튼

**현재**: `alert('프로필 저장 기능은 준비 중입니다')`

**변경:**
- 클릭 시:
  1. `usePatchUser`로 기본정보 + 한줄소개 + 프로필이미지 저장
  2. 경력은 개별 경력 카드에서 이미 CRUD됨 (저장 버튼과 무관)
  3. 또는, 경력을 모아서 일괄 저장하는 UX로 변경 (결정 필요)
- 성공: 토스트 "프로필이 저장되었습니다"
- 실패: 에러 토스트

### 4-2. 프로그램 일정 (`/mentor`) — 와이어프레임 정합

> 와이어프레임: `.claude/tasks/program_schedule.png`

**와이어프레임 vs 현재 구현 차이:**

| 항목 | 와이어프레임 | 현재 구현 | 변경 필요 |
|------|-------------|-----------|-----------|
| 요약 카드 | 4개 (이번주 전체 / 오늘 마감 / 미완료 / 진행률) | 3개 (진행률 없음) | 진행률 카드 추가 |
| 진행률 | 퍼센트 + 프로그레스 바 | 없음 | 추가 |
| 사이드바 메뉴 | 프로그램 일정, 프로필, 공지사항 | 프로그램 일정, Profile | "공지사항" 메뉴 추가 (링크만) |
| 기간 바 디자인 | 챌린지명 태그(컬러) + 미제출/제출 우측정렬 + 피드백 상태 상단 | 단일 베이지 바 | 디자인 개선 |
| 일요일 | 빨간색 "일" 레이블 | 일반 색상 | 빨간색으로 변경 |

**변경사항:**

1. **WeeklySummary.tsx** — 진행률 카드 추가
   - 계산: completedCount / totalCount * 100
   - 프로그레스 바 UI 추가

2. **ChallengePeriodBar.tsx** — 디자인 개선
   - 상단: `[N차 피드백] 시작 전 N · 진행 중 N · 완료 N`
   - 중단: 챌린지명 태그 (컬러 배지)
   - 우측: `미제출 N · 제출 N`

3. **WeeklyCalendar.tsx** — 일요일 레이블 빨간색

4. **MentorSidebar** — "공지사항" 메뉴 항목 추가

### 4-3. 서면 피드백 모달 — 개선

> 와이어프레임: `.claude/tasks/Feedback.png`

**와이어프레임 vs 현재 구현 차이:**

| 항목 | 와이어프레임 | 현재 구현 | 변경 필요 |
|------|-------------|-----------|-----------|
| 모달 헤더 | `자소서 챌린지 7기 · 2차 피드백` + `총 15명` + 상태 요약 + 피드백 가이드 라인 링크 | 챌린지명 + 차수만 | 헤더 정보 보강 |
| 멘티 네비게이션 | `< 이전 멘티` / `다음 멘티 >` 버튼 | 없음 | 추가 |
| 멘티 정보 | 이름 + 챌린지명 + 희망직무/희망산업/희망기업 + 제출물 보기 링크 | 이름 + 희망직군/기업 (산업 없음) | 희망 산업 추가, 제출물 보기 위치 |
| 피드백 상태 | 우측 상단에 텍스트로 "피드백 상태: 진행 중" | 상단 스텝 바 | 와이어프레임 방식으로 변경 |
| 에디터 | "Markdown Editor" 라벨 | Lexical 에디터 (서식 미지원) | Markdown 플러그인 활성화 |
| 하단 버튼 | `임시저장` (outlined) + `피드백 제출` (primary/파란색) | `임시 저장` + `최종 제출` (둘 다 회색) | 버튼 스타일 변경 |

**변경사항:**

1. **FeedbackModal.tsx** — 모달 헤더 개선
   - 챌린지명 + 회차 + 총 멘티 수 + 피드백 상태 요약 (시작 전 N · 진행 중 N · 완료 N)

2. **MenteeInfo.tsx** — 이전/다음 멘티 네비게이션 추가
   - 멘티 리스트에서 현재 인덱스 기반 prev/next 이동

3. **FeedbackEditor.tsx** — Lexical Markdown 서식 지원
   - MarkdownShortcutPlugin 활성화
   - 기본 툴바 (Bold, Italic, List, Link 등)

4. **FeedbackActions.tsx** — 버튼 스타일 변경
   - 임시저장: outlined (border-primary)
   - 피드백 제출: solid primary (bg-primary text-white)

---

## 5. 파일 변경 목록

### 5-1. API 레이어 변경

| 파일 | 변경 내용 |
|------|-----------|
| `src/api/user/user.ts` | userSchema에 nickname, introduction, profileImgUrl, sns 추가. PatchUserBody에 동일 필드 추가 |
| `src/api/career/careerSchema.ts` | userCareerSchema에 field, position, department 추가 (nullable) |
| `src/api/file.ts` | fileType enum에 `USER_PROFILE` 추가 |

### 5-2. 프로필 페이지

| 파일 | 변경 내용 |
|------|-----------|
| `src/domain/mentor/profile/ProfilePage.tsx` | useUserQuery 초기값 확장, usePatchUser 연동, useGetUserCareerQuery 연동, 저장 로직 구현 |
| `src/domain/mentor/profile/BasicInfo.tsx` | 프로필 이미지 업로드 추가, profileImgUrl prop 추가 |
| `src/domain/mentor/profile/Introduction.tsx` | 변경 없음 (부모에서 초기값 전달) |
| `src/domain/mentor/profile/CareerSection.tsx` | user-career API 연동, 드롭다운/date picker 변경 |

### 5-3. 프로그램 일정

| 파일 | 변경 내용 |
|------|-----------|
| `src/domain/mentor/schedule/WeeklySummary.tsx` | 진행률 카드 추가 (4번째 카드) |
| `src/domain/mentor/schedule/ChallengePeriodBar.tsx` | 바 디자인 와이어프레임 정합 |
| `src/domain/mentor/schedule/WeeklyCalendar.tsx` | 일요일 빨간색 |

### 5-4. 서면 피드백 모달

| 파일 | 변경 내용 |
|------|-----------|
| `src/domain/mentor/feedback/FeedbackModal.tsx` | 모달 헤더 개선 |
| `src/domain/mentor/feedback/MenteeInfo.tsx` | 이전/다음 멘티 네비게이션, 희망 산업 표시 |
| `src/domain/mentor/feedback/FeedbackEditor.tsx` | Lexical Markdown 서식 플러그인 |
| `src/domain/mentor/feedback/FeedbackActions.tsx` | 버튼 스타일 (outlined + primary) |

---

## 6. 구현 우선순위

### Phase 1: API 스키마 확장 (기반 작업)
1. userSchema에 신규 필드 추가 (nickname, introduction, profileImgUrl, sns)
2. PatchUserBody에 신규 필드 추가
3. userCareerSchema에 신규 필드 추가 (field, position, department)
4. fileType에 USER_PROFILE 추가

### Phase 2: 프로필 API 연동
5. ProfilePage에서 useUserQuery 초기값 확장 (nickname, sns, introduction)
6. 프로필 이미지 업로드 구현 (BasicInfo)
7. 저장 버튼 동작 구현 (usePatchUser 연동)
8. 경력 CRUD API 연동 (CareerSection)

### Phase 3: UI 와이어프레임 정합
9. WeeklySummary 진행률 카드 추가
10. ChallengePeriodBar 디자인 개선
11. WeeklyCalendar 일요일 빨간색
12. FeedbackModal 헤더 개선
13. MenteeInfo 이전/다음 네비게이션
14. FeedbackActions 버튼 스타일

### Phase 4: 에디터 개선
15. FeedbackEditor Lexical Markdown 서식 지원

---

## 7. 확인 필요 사항

| 항목 | 상세 | 우선순위 |
|------|------|---------|
| user-career 신규 필드 정확한 스키마 | Swagger에서 field/position/department의 정확한 타입과 필수 여부 확인 | 높음 |
| 경력 저장 UX | 경력을 개별 CRUD vs 일괄 저장 중 어떤 방식으로 할지 결정 | 높음 |
| 업무분야/직책 드롭다운 선택지 | 와이어프레임에 드롭다운으로 되어 있는데, 선택지 목록이 필요 (API에서 제공하는지 확인) | 중간 |
| 공지사항 페이지 | 사이드바에 "공지사항" 메뉴가 있는데, 해당 페이지 스펙이 없음 | 낮음 |
| 프로필 이미지 크기 제한 | 와이어프레임에 "권장 600px, 5MB 이하" 표기 — 프론트에서 validation 필요 | 중간 |
| 피드백 가이드 라인 링크 | 와이어프레임에 "피드백 가이드 라인" 링크가 있는데, URL이 필요 | 낮음 |

---

## 8. 참고 자료

- 와이어프레임: `.claude/tasks/profile.png`, `.claude/tasks/program_schedule.png`, `.claude/tasks/Feedback.png`
- 이전 PRD: `.claude/tasks/done/260306/prd260304.md`
- 구현 현황: `.claude/tasks/done/260306/기능구현현황_v0.1.1.md`
- Swagger API docs: https://letsintern.kr/v3/api-docs
