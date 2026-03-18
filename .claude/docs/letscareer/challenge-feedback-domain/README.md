# 챌린지 피드백 멘토링 도메인

> 이 문서는 챌린지 피드백 멘토링 상세 안내 페이지 개발 시 참고하는 도메인 문서입니다.

## 도메인 개요

챌린지 상세페이지에서 연결되는 **피드백 멘토링 옵션 안내 랜딩페이지**.
서버/어드민 연동 없이 JSON 기반 정적 데이터로 관리하며, 프리미엄 느낌의 랜딩페이지를 구현.

## 파일 구조

```
src/
├── app/(user)/challenge/feedback-mentoring/
│   └── page.tsx                              # 라우트 엔트리
│
├── domain/challenge-feedback/
│   ├── ChallengeFeedbackScreen.tsx           # 메인 화면 컨테이너
│   ├── types.ts                              # 타입 정의
│   ├── data/
│   │   └── challenge-feedback-data.ts        # 정적 데이터
│   ├── sections/
│   │   ├── HeroSection.tsx                   # 01_상단 (별 애니메이션)
│   │   ├── ChallengeMenuSection.tsx          # 02_챌린지 메뉴
│   │   ├── FeedbackIntroSection.tsx          # 03_피드백 소개
│   │   ├── MentorListSection.tsx             # 04_멘토 소개
│   │   ├── BeforeAfterSection.tsx            # 05_비포 에프터
│   │   ├── LiveMentoringSection.tsx          # 06_라이브 멘토링
│   │   ├── UserReviewSection.tsx             # 07_유저 후기 (공통)
│   │   ├── SuccessStoriesSection.tsx         # 08_취업 성공 (공통)
│   │   └── ApplyCtaSection.tsx               # 09_신청하기
│   └── components/
│       ├── StarAnimation.tsx
│       ├── ChallengeMenuItem.tsx
│       ├── FeedbackOptionCard.tsx
│       ├── FeedbackDetailModal.tsx
│       ├── MentorCard.tsx
│       ├── BeforeAfterCard.tsx
│       └── ReviewCard.tsx
```

## 섹션별 조건부 렌더링

| 섹션 | 챌린지별 동작 |
|---|---|
| 01_HeroSection | 공통 (항상 표시) |
| 02_ChallengeMenu | 공통 (항상 표시, 메뉴 선택) |
| 03_FeedbackIntro | 챌린지별 (feedbackOptions 있으면 표시) |
| 04_MentorList | 챌린지별 (mentors 데이터에 따라) |
| 05_BeforeAfter | 챌린지별 (beforeAfter 데이터 있으면 표시) |
| 06_LiveMentoring | 챌린지별 (liveMentoring 데이터 있으면 표시) |
| 07_UserReview | 공통 |
| 08_SuccessStories | 공통 |
| 09_ApplyCta | 챌린지별 (applyUrl에 따라 버튼 경로 변경) |

## URL 구조

- 경로: `/challenge/feedback-mentoring`
- 쿼리: `?challenge={slug}` (예: `?challenge=marketing`)
- 파라미터 없으면 첫 번째 챌린지 기본 선택

## 참고 패턴

- **Report Landing**: `src/domain/report/` — 유사한 랜딩페이지 패턴
- **Challenge View**: `src/domain/program/challenge/` — 챌린지 상세 컴포넌트
- **Home Review**: `src/domain/home/review/ReviewSection.tsx` — Swiper 롤링 패턴
- **공통 컴포넌트**: `src/common/` — Button, Layout, Modal 등

## 디자인 톤

- 다크 테마 (어두운 남색/보라색 배경)
- 포인트 컬러: 보라색 (#7C6BFF 계열)
- 프리미엄/세련된 랜딩페이지 느낌
- Tailwind CSS 기반 스타일링
