# Tasks: 챌린지 피드백 멘토링 - Push 2

> PRD: `.claude/tasks/prd-260318.md`
> Push 범위: HeroSection (별 애니메이션) + ChallengeMenuSection (챌린지 선택 메뉴)
> 상태: 🔲 진행 중

---

### 관련 파일

- `src/domain/challenge-feedback/components/StarAnimation.tsx`
- `src/domain/challenge-feedback/sections/HeroSection.tsx`
- `src/domain/challenge-feedback/components/ChallengeMenuItem.tsx`
- `src/domain/challenge-feedback/sections/ChallengeMenuSection.tsx`
- `src/domain/challenge-feedback/ChallengeFeedbackScreen.tsx` (수정)

### 적용 스킬

- `vercel-react-best-practices` — 컴포넌트 최적화, memo, 호이스팅
- `code-quality` — 가독성, 예측 가능성, 응집도, 결합도
- `folder-structure` — 컴포넌트/섹션 파일 배치

### 적용 Role

- `.claude/roles/developer.md` — 개발 전담 에이전트 규칙

### 참고 문서

- `.claude/tasks/화면 이미지 260318/01_상단.png`
- `.claude/tasks/화면 이미지 260318/02_챌린지 메뉴.png`
- `.claude/docs/letscareer/common/components.md`

---

## 작업

- [ ] 2.0 HeroSection + ChallengeMenuSection 구현
    - [ ] 2.1 StarAnimation 컴포넌트
        - CSS keyframes: opacity(0.3↔1.0) + scale 변화
        - 랜덤 위치/크기/딜레이로 별(✦, ✧) 여러 개 배치
        - Tailwind + inline style 조합
        - [ ] 2.1.T1 테스트 코드 작성
        - [ ] 2.1.T2 테스트 실행 및 검증
    - [ ] 2.2 HeroSection
        - 어두운 남색/보라색 그라데이션 배경
        - 소제목: "렛츠커리어 현직자 멘토단과 함께하는"
        - 메인 카피: "혼자 준비하는 취업은 이제 그만, 현직자와 함께"
        - 서브 카피: "대기업 · IT 대기업 · 시리즈 B 이상 스타트업 현직자들이 여러분의 서류를 직접 진단합니다"
        - StarAnimation 배치
        - 좌우 서류 아이콘 장식 (기울어진 형태)
        - 반응형: 모바일/데스크톱 텍스트 크기 조정
        - [ ] 2.2.T1 테스트 코드 작성
        - [ ] 2.2.T2 테스트 실행 및 검증
    - [ ] 2.3 ChallengeMenuItem 컴포넌트
        - props: label, isActive, onClick
        - 호버: 텍스트 색상 변경 + 밑줄 (transition)
        - 클릭(활성): 보라색 하이라이트
        - [ ] 2.3.T1 테스트 코드 작성
        - [ ] 2.3.T2 테스트 실행 및 검증
    - [ ] 2.4 ChallengeMenuSection
        - 타이틀: "어떤 챌린지의 피드백이 궁금하신가요?"
        - 7개 메뉴 2줄 flex 배치 (데스크톱)
        - 모바일: wrap 또는 가로 스크롤
        - 클릭 → 선택 상태 변경 + URL 쿼리 업데이트
        - 어두운 배경
        - [ ] 2.4.T1 테스트 코드 작성
        - [ ] 2.4.T2 테스트 실행 및 검증
    - [ ] 2.5 ChallengeFeedbackScreen에 연결
        - HeroSection, ChallengeMenuSection import 및 렌더링
        - 선택된 챌린지 state를 ChallengeMenuSection에 전달
    - [ ] 2.6 린트 및 타입 체크
        - ESLint + Prettier 실행
        - `npx tsc --noEmit` 통과 확인
