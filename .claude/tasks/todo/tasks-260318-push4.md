# Tasks: 챌린지 피드백 멘토링 - Push 4

> PRD: `.claude/tasks/prd-260318.md`
> Push 범위: BeforeAfterSection (비포에프터) + LiveMentoringSection (라이브 멘토링)
> 상태: ✅ 완료

---

### 관련 파일

- `src/domain/challenge-feedback/components/BeforeAfterCard.tsx`
- `src/domain/challenge-feedback/sections/BeforeAfterSection.tsx`
- `src/domain/challenge-feedback/sections/LiveMentoringSection.tsx`
- `src/domain/challenge-feedback/ChallengeFeedbackScreen.tsx` (수정)

### 적용 스킬

- `vercel-react-best-practices` — 동적 임포트, 영상 lazy loading
- `code-quality` — 조건부 렌더링 가독성, 컴포넌트 예측 가능성

### 적용 Role

- `.claude/roles/developer.md` — 개발 전담 에이전트 규칙

### 참고 문서

- `.claude/tasks/화면 이미지 260318/05_챌린지 비포 에프터.png`
- `.claude/tasks/화면 이미지 260318/06_라이브멘토링.png`
- `.claude/tasks/화면설계.md` — 라이브멘토링 피드백 반영 사항

---

## 작업

- [x] 4.0 BeforeAfterSection + LiveMentoringSection 구현
    - [x] 4.1 BeforeAfterCard 컴포넌트
        - props: type(before|after), image, description
        - Before 카드: 밝은 배경, "Before" 라벨
        - After 카드: 보라색 포인트, "After" 라벨
        - 하단 설명 텍스트
        - [ ] 4.1.T1 테스트 코드 작성
        - [ ] 4.1.T2 테스트 실행 및 검증
    - [x] 4.2 BeforeAfterSection
        - 좌/우 비교 레이아웃
        - Before: "캡쳐된 이미지로 나열된 평범한 포트폴리오"
        - After: "문제와 해결 전략, 성과까지 핵심 역량이 돋보이는 포트폴리오"
        - 조건부: beforeAfter 데이터 있는 챌린지만 (현재 마케팅만)
        - 반응형: 모바일 세로 스택
        - [ ] 4.2.T1 테스트 코드 작성
        - [ ] 4.2.T2 테스트 실행 및 검증
    - [x] 4.3 LiveMentoringSection
        - 타이틀: "1:1 LIVE 피드백, 영상으로 미리 확인하세요!"
        - 서브카피1: "혼자 막막했던 고민들, 멘토님과 실시간으로 해결하세요"
        - 영상 임베딩 (YouTube iframe, aspect-ratio 16/9)
        - 서브카피2 (영상 하단): "라이브로 주고 받는 맞춤형 피드백으로, 서류 완성도 UP!"
          ※ 서브카피1과 동일 글씨 크기 (피드백 반영)
        - 조건부: liveMentoring 있는 챌린지만 (자소서/포폴/대기업/HR)
        - 영상 URL은 데이터 파일에서 관리 (추후 교체 가능)
        - [ ] 4.3.T1 테스트 코드 작성
        - [ ] 4.3.T2 테스트 실행 및 검증
    - [x] 4.4 ChallengeFeedbackScreen 업데이트
        - BeforeAfterSection, LiveMentoringSection 연결
        - 조건부 렌더링 적용
    - [x] 4.5 린트 및 타입 체크
        - ESLint + Prettier 실행
        - `npx tsc --noEmit` 통과 확인
