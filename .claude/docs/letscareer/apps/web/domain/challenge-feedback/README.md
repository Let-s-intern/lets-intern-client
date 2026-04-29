# 챌린지 피드백 멘토링 도메인

> 챌린지 상세페이지에서 연결되는 **피드백 멘토링 옵션 안내 랜딩페이지**
> 서버/어드민 연동 없이 정적 데이터(TypeScript)로 관리

## URL 구조

### 페이지 접속

```
/challenge/feedback-mentoring
/challenge/feedback-mentoring?challenge={key}
```

- `?challenge=` 파라미터로 챌린지 선택 (예: `?challenge=portfolio`)
- 파라미터 없으면 첫 번째 챌린지 기본 선택
- referrer URL에서 챌린지 키워드 자동 감지 → 해당 챌린지 자동 선택

### 챌린지 자동 선택 흐름

페이지 진입 시 아래 우선순위로 챌린지 메뉴가 자동 선택됩니다.

```
1. ?challenge= 쿼리 파라미터가 있으면 → 해당 챌린지 선택
2. 쿼리 파라미터 없으면 → document.referrer 확인
   2-1. referrer에 /program/challenge/ 경로가 포함되어 있으면
        → URL 디코딩 후 한글 키워드 매칭 → 해당 챌린지로 router.replace
   2-2. referrer가 없거나 매칭 실패 → 첫 번째 챌린지(경험정리) 기본 선택
```

#### 동작 예시

| 유입 경로 (referrer) | 결과 |
|---------------------|------|
| `/program/challenge/234/포트폴리오-2주-완성-챌린지-30기` | `?challenge=portfolio` 자동 설정 → 포트폴리오 메뉴 선택 |
| `/program/challenge/211/이력서-1주-완성-챌린지-12기` | `?challenge=resume` 자동 설정 → 이력서 메뉴 선택 |
| `/program/challenge/192/대기업-자기소개서-완성-챌린지-7기` | `?challenge=large-corp` 자동 설정 → 대기업 메뉴 선택 |
| 직접 접속 (referrer 없음) | 기본값 → 경험정리 챌린지 선택 |
| `?challenge=hr`로 직접 접속 | 쿼리 파라미터 우선 → HR 메뉴 선택 |

#### Referrer 키워드 매핑

| 키워드 | 챌린지 키 | 비고 |
|--------|-----------|------|
| 경험정리 | `experience` | |
| 이력서 | `resume` | |
| 자기소개서 | `personal-statement` | |
| 포트폴리오 | `portfolio` | |
| 대기업 | `large-corp` | |
| 마케팅 | `marketing` | |
| HR | `hr` | 대소문자 무시 비교 |

- 키워드 매칭은 `toLowerCase()` 비교로 대소문자 무관
- `decodeURIComponent` 실패 시 원문 referrer로 폴백
- 설정 파일: `apps/web/src/domain/challenge-feedback/data/urls.ts` → `REFERRER_KEYWORD_MAP`

#### 메뉴 클릭 시

사용자가 챌린지 메뉴를 클릭하면 `router.push`로 `?challenge={key}` 쿼리 파라미터가 업데이트되고, 해당 챌린지의 섹션들이 조건부 렌더링됩니다. 스크롤 위치는 유지됩니다(`scroll: false`).

### 신청 페이지 (나가는 URL)

플로팅 CTA 버튼 클릭 시 챌린지별 최신 기수 신청 페이지로 이동합니다.

```
https://www.letscareer.co.kr/challenge/{type}/latest
```

설정 파일: `apps/web/src/domain/challenge-feedback/data/urls.ts` → `APPLY_URLS`

---

## 파일 구조

```
apps/web/src/
├── app/(user)/challenge/feedback-mentoring/
│   └── page.tsx                              # 라우트 엔트리
│
├── domain/challenge-feedback/
│   ├── ChallengeFeedbackScreen.tsx           # 메인 화면 컨테이너
│   ├── types.ts                              # 타입 정의
│   │
│   ├── data/                                 # 정적 데이터
│   │   ├── challenge-feedback-data.ts        # 챌린지 목록 통합 export
│   │   ├── common.ts                         # 공통 데이터 (후기, 안내문구)
│   │   ├── mentors.ts                        # 멘토 데이터 (프로필, 이미지)
│   │   ├── urls.ts                           # URL 설정 (유입/신청)
│   │   ├── success-stories.ts                # 취업 성공 사례 데이터
│   │   └── challenges/                       # 챌린지별 개별 데이터
│   │       ├── experience.ts
│   │       ├── resume.ts
│   │       ├── personal-statement.ts
│   │       ├── portfolio.ts
│   │       ├── large-corp.ts
│   │       ├── marketing.ts
│   │       └── hr.ts
│   │
│   ├── sections/                             # 페이지 섹션 컴포넌트
│   │   ├── HeroSection.tsx                   # 히어로 (별 애니메이션)
│   │   ├── ChallengeMenuSection.tsx          # 챌린지 메뉴 선택
│   │   ├── FeedbackIntroSection.tsx          # 피드백 옵션 소개 카드
│   │   ├── WrittenFeedbackSection.tsx        # 서면 피드백 예시
│   │   ├── BeforeAfterSection.tsx            # 비포/애프터
│   │   ├── LiveMentoringSection.tsx          # 라이브 멘토링 영상
│   │   ├── MentorListSection.tsx             # 멘토 리스트
│   │   ├── UserReviewSection.tsx             # 수강생 후기 캐러셀
│   │   ├── SuccessStoriesSection.tsx         # 취업 성공 사례
│   │   ├── ApplyCtaSection.tsx               # 플로팅 CTA 버튼
│   │   └── user-review-pagination.css        # Swiper dot 커스텀 스타일
│   │
│   └── components/                           # 재사용 UI 컴포넌트
│       ├── StarAnimation.tsx
│       ├── ChallengeMenuItem.tsx
│       ├── FeedbackOptionCard.tsx
│       ├── MentorCard.tsx
│       ├── BeforeAfterCard.tsx
│       └── ReviewCard.tsx

public/images/challenge-feedback/
├── mentors/                                  # 멘토 프로필 이미지
│   ├── large-corp/                           # 대기업 챌린지 멘토
│   ├── portfolio/                            # 포트폴리오 챌린지 멘토
│   ├── hr/                                   # HR 챌린지 멘토
│   ├── marketing/                            # 마케팅 챌린지 멘토
│   ├── experience/                           # 경험정리 챌린지 멘토
│   ├── personal-statement/                   # 자기소개서 챌린지 멘토
│   └── common/                               # 공통 (기본 이미지)
├── examples/                                 # 서면 피드백 예시 이미지
│   ├── resume/
│   ├── experience/
│   ├── marketing/
│   └── large-corp/
├── before-after/                             # 비포/애프터 이미지
└── reviews/                                  # (레거시, 현재 미사용)
```

---

## 섹션별 조건부 렌더링

| 순서 | 섹션 | 렌더링 조건 | 배경색 |
|------|------|-------------|--------|
| 01 | HeroSection | 항상 표시 | 그라데이션 |
| 02 | ChallengeMenuSection | 항상 표시 | `#110f28` |
| 03 | FeedbackIntroSection | `feedbackOptions.length > 0` | `#0e0c22` |
| 04 | WrittenFeedbackSection | 서면 피드백 예시 이미지가 있을 때 | `#13112a` |
| 05 | BeforeAfterSection | `beforeAfter !== null` | `#0e0c22` |
| 06 | LiveMentoringSection | `liveMentoring !== null` | `#0e0c22` |
| 07 | MentorListSection | 항상 표시 | `#0f0d2e` |
| 08 | UserReviewSection | 항상 표시 | `#131030` |
| 09 | SuccessStoriesSection | 항상 표시 | `#0e0c22` |
| 10 | ApplyCtaSection | 항상 표시 (플로팅) | — |

---

## 챌린지 키 목록

| 키 | 이름 | 멘토 수 | 서면 피드백 | 비포/애프터 | 라이브 멘토링 |
|----|------|---------|-------------|-------------|---------------|
| `experience` | 경험정리 챌린지 | 1 | ✅ | ❌ | ❌ |
| `resume` | 이력서 1주 완성 챌린지 | 1 | ✅ | ❌ | ❌ |
| `personal-statement` | 자기소개서 2주 완성 챌린지 | 2 | ❌ | ❌ | ✅ |
| `portfolio` | 포트폴리오 2주 완성 챌린지 | 4 | ❌ | ❌ | ✅ |
| `large-corp` | 대기업 완성 챌린지 | 7 | ✅ | ❌ | ❌ |
| `marketing` | 마케팅 서류 완성 챌린지 | 5 | ✅ | ❌ | ❌ |
| `hr` | HR 서류 완성 챌린지 | 5 | ❌ | ❌ | ✅ |

---

## 데이터 관리

### 데이터 변경 시 수정 파일

| 변경 내용 | 파일 |
|-----------|------|
| 챌린지별 피드백 옵션/멘토 | `data/challenges/{key}.ts` |
| 멘토 프로필 (이름/이미지) | `data/mentors.ts` |
| 수강생 후기 텍스트 | `data/common.ts` |
| 유입/신청 URL | `data/urls.ts` |
| 취업 성공 사례 | `data/success-stories.ts` |
| 멘토 이미지 파일 | `public/images/challenge-feedback/mentors/{챌린지}/` |

### 멘토 카드 동작

- `company`와 `role`이 모두 비어있으면 이미지만 표시 (정보 영역 숨김)
- 이미지에 이름/회사 정보가 포함되어 있으므로 대부분 이미지만 사용
- `letscareerTeam` 멘토만 company/role 세팅 (이력서 챌린지)

---

## 디자인

- **테마**: 다크 (어두운 남색/보라색 배경, 섹션별 미세한 색상 차이)
- **액센트**: `#7C6BFF` (보라), `#B49AFF` (연보라)
- **스타일**: Tailwind CSS, 반응형 (모바일 우선)
- **문의하기 버튼**: 이 페이지에서 숨김 처리 (`ChannelTalkBtn.tsx`)
