# Tasks: 챌린지 피드백 멘토링 - Push 3

> PRD: `.claude/tasks/prd-260318.md`
> Push 범위: FeedbackIntroSection (피드백 옵션 소개) + MentorListSection (멘토 소개)
> 상태: 🔲 진행 중

---

### 관련 파일

- `src/domain/challenge-feedback/components/FeedbackOptionCard.tsx`
- `src/domain/challenge-feedback/components/FeedbackDetailModal.tsx`
- `src/domain/challenge-feedback/sections/FeedbackIntroSection.tsx`
- `src/domain/challenge-feedback/components/MentorCard.tsx`
- `src/domain/challenge-feedback/sections/MentorListSection.tsx`
- `src/domain/challenge-feedback/ChallengeFeedbackScreen.tsx` (수정)

### 적용 스킬

- `vercel-react-best-practices` — 컴포넌트 최적화, 리렌더 방지
- `code-quality` — 카드 컴포넌트 응집도, 모달 결합도 최소화
- `folder-structure` — 컴포넌트/섹션 파일 배치

### 적용 Role

- `.claude/roles/developer.md` — 개발 전담 에이전트 규칙

### 참고 문서

- `.claude/tasks/화면 이미지 260318/03_챌린지 피드백 소개.png`
- `.claude/tasks/화면 이미지 260318/04_챌린지 멘토 소개.png`
- `.claude/tasks/data.md` — 챌린지별 피드백/멘토 실제 데이터

---

## 작업

- [ ] 3.0 FeedbackIntroSection + MentorListSection 구현
    - [ ] 3.1 FeedbackOptionCard 컴포넌트
        - props: tier(STANDARD|PREMIUM), data(FeedbackOption)
        - 테이블 형태: 피드백 횟수, 개수, 진행 방식, 멘토 정보
        - "피드백 자세히 보기 →" 링크
        - 어두운 배경 + 밝은 텍스트
        - [ ] 3.1.T1 테스트 코드 작성
        - [ ] 3.1.T2 테스트 실행 및 검증
    - [ ] 3.2 FeedbackDetailModal 컴포넌트
        - "피드백 자세히 보기" 클릭 시 서면 피드백 이미지 표시
        - 모달 또는 확장형 패널
        - 닫기 버튼
        - [ ] 3.2.T1 테스트 코드 작성
        - [ ] 3.2.T2 테스트 실행 및 검증
    - [ ] 3.3 FeedbackIntroSection
        - 좌측: 피드백 리포트 이미지 + 카피
        - 우측: STANDARD + PREMIUM 옵션 카드
        - 조건부 렌더링: feedbackOptions 있는 챌린지만 표시
        - 반응형: 모바일 세로 스택
        - [ ] 3.3.T1 테스트 코드 작성
        - [ ] 3.3.T2 테스트 실행 및 검증
    - [ ] 3.4 MentorCard 컴포넌트
        - props: mentor (Mentor 타입)
        - 회사 로고 + 회사명 + 직무 + 프로필 이미지
        - 흰색 카드 배경
        - [ ] 3.4.T1 테스트 코드 작성
        - [ ] 3.4.T2 테스트 실행 및 검증
    - [ ] 3.5 MentorListSection
        - 타이틀: "[분야명], 현직자 N명이 다 봐드립니다" (데이터 기반)
        - 멘토 카드 가로 나열 (displayCount만큼)
        - 반응형: 모바일 가로 스크롤
        - [ ] 3.5.T1 테스트 코드 작성
        - [ ] 3.5.T2 테스트 실행 및 검증
    - [ ] 3.6 ChallengeFeedbackScreen 업데이트
        - FeedbackIntroSection, MentorListSection 연결
        - 선택된 챌린지 데이터 전달 + 조건부 렌더링
    - [ ] 3.7 린트 및 타입 체크
        - ESLint + Prettier 실행
        - `npx tsc --noEmit` 통과 확인
