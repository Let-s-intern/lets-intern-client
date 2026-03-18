# Tasks: 챌린지 피드백 멘토링 - Push 1

> PRD: `.claude/tasks/prd-260318.md`
> Push 범위: 프로젝트 세팅 — 타입 정의, 에셋 배치, 정적 데이터, 라우트, 메인 컨테이너
> 상태: ✅ 완료

---

### 관련 파일

- `src/domain/challenge-feedback/types.ts` — 타입 정의
- `src/domain/challenge-feedback/data/challenge-feedback-data.ts` — 정적 데이터
- `src/app/(user)/challenge/feedback-mentoring/page.tsx` — 라우트 엔트리
- `src/domain/challenge-feedback/ChallengeFeedbackScreen.tsx` — 메인 컨테이너
- `public/images/challenge-feedback/` — 에셋 이미지

### 적용 스킬

- `folder-structure` — 파일/폴더 배치 규칙 (새 파일 생성 시 필수)
- `code-quality` — 타입 설계, 데이터 구조 가독성/응집도
- `vercel-react-best-practices` — 컴포넌트 작성 규칙

### 적용 Role

- `.claude/roles/developer.md` — 개발 전담 에이전트 규칙

### 참고 문서

- `.claude/tasks/data.md` — 챌린지별 실제 데이터
- `.claude/docs/tech-stack/README.md`
- `src/domain/report/` — 기존 랜딩페이지 패턴 참고
- `src/domain/program/challenge/` — 기존 챌린지 구조 참고

---

## 작업

- [ ] 1.0 프로젝트 세팅 및 기본 구조 생성
    - [ ] 1.1 타입 정의 (`src/domain/challenge-feedback/types.ts`)
        - ChallengeData, FeedbackOption, Mentor, BeforeAfter, LiveMentoring, SuccessStory, UserReview 타입
        - Mentor: { nickname, company, role, profileImage }
        - ChallengeData: { mentors, mentorDisplayCount?, mentorSectionTitle }
        - FeedbackOption: { tier(STANDARD|PREMIUM), feedbackCount, feedbackDetails[], method, mentorInfo }
        - [ ] 1.1.T1 테스트 코드 작성
        - [ ] 1.1.T2 테스트 실행 및 검증
    - [ ] 1.2 에셋 파일 배치
        - `.claude/tasks/asset/` → `public/images/challenge-feedback/` 복사
        - `before-after/` — before.png, after.png (마케팅 비포에프터)
        - `mentors/` — mentor-1.png ~ mentor-4.png (영문 rename)
        - `reviews/` — review-1.png ~ review-4.png (영문 rename)
        - [ ] 1.2.T1 이미지 파일 존재 확인 스크립트
        - [ ] 1.2.T2 테스트 실행 및 검증
    - [ ] 1.3 정적 데이터 파일 (`src/domain/challenge-feedback/data/challenge-feedback-data.ts`)
        - **이 파일 하나에서 모든 콘텐츠 수정 가능하게 설계**
        - 7개 챌린지 전체 실제 데이터 (`.claude/tasks/data.md` 참조):
          - 기필코 경험정리: STANDARD 3회(서면), 멘토(닉/삼성계열사)
          - 이력서 1주: STANDARD 1회(서면), 멘토(취업연구팀)
          - 자기소개서 2주: STANDARD(Live) + PREMIUM(Live), 멘토 2명
          - 포트폴리오 2주: STANDARD(Live) + PREMIUM(Live), 멘토 4명
          - 대기업 완성: STANDARD(서면+Live) + PREMIUM(서면+Live), 멘토 7명
          - 마케팅 서류: STANDARD(서면) + PREMIUM(서면), 멘토 5명
          - HR 서류: STANDARD(Live) + PREMIUM(Live), 멘토 4~5명
        - 멘토 데이터: 닉네임/회사/직무/이미지경로 개별 지정, displayCount 설정
        - 프로필 이미지 4장 돌려쓰기, 챌린지별 멘토 수 랜덤 배분
        - 조건부 섹션: beforeAfter(마케팅만), liveMentoring(자소서/포폴/대기업/HR)
        - 공통: 유저 후기 4개, 취업 성공 사례, 안내 문구
        - [ ] 1.3.T1 테스트 코드 작성
        - [ ] 1.3.T2 테스트 실행 및 검증
    - [ ] 1.4 라우트 엔트리 (`src/app/(user)/challenge/feedback-mentoring/page.tsx`)
        - URL 쿼리 파라미터 `?challenge=xxx` 처리
        - ChallengeFeedbackScreen import
        - generateMetadata로 SEO 메타데이터 설정
        - [ ] 1.4.T1 테스트 코드 작성
        - [ ] 1.4.T2 테스트 실행 및 검증
    - [ ] 1.5 메인 화면 컨테이너 (`src/domain/challenge-feedback/ChallengeFeedbackScreen.tsx`)
        - 선택된 챌린지 상태 관리 (URL 쿼리 기반)
        - 각 섹션 조건부 렌더링 뼈대 (placeholder div)
        - 섹션 간 간격/마진 통일 레이아웃 (py-20, max-w-[1200px])
        - [ ] 1.5.T1 테스트 코드 작성
        - [ ] 1.5.T2 테스트 실행 및 검증
    - [ ] 1.6 린트 및 타입 체크
        - ESLint + Prettier 전체 실행
        - `npx tsc --noEmit` 통과 확인
