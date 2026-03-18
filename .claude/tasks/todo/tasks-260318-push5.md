# Tasks: 챌린지 피드백 멘토링 - Push 5

> PRD: `.claude/tasks/prd-260318.md`
> Push 범위: UserReviewSection + SuccessStoriesSection + ApplyCtaSection (공통 섹션 + CTA)
> 상태: ✅ 완료

---

### 관련 파일

- `src/domain/challenge-feedback/components/ReviewCard.tsx`
- `src/domain/challenge-feedback/sections/UserReviewSection.tsx`
- `src/domain/challenge-feedback/sections/SuccessStoriesSection.tsx`
- `src/domain/challenge-feedback/sections/ApplyCtaSection.tsx`
- `src/domain/challenge-feedback/ChallengeFeedbackScreen.tsx` (수정)

### 적용 스킬

- `vercel-react-best-practices` — Swiper 최적화, 번들 사이즈, lazy loading
- `code-quality` — 공통 컴포넌트 재사용성, 카드 응집도

### 적용 Role

- `.claude/roles/developer.md` — 개발 전담 에이전트 규칙

### 참고 문서

- `.claude/tasks/화면 이미지 260318/07_유저 후기.png`
- `.claude/tasks/화면 이미지 260318/08_취업에 성공한 사람들.png`
- `.claude/tasks/화면 이미지 260318/09_챌린지 신청하기.png`
- `src/domain/home/review/ReviewSection.tsx` — Swiper 롤링 패턴 참고

---

## 작업

- [x] 5.0 공통 섹션 + CTA 구현
    - [x] 5.1 ReviewCard 컴포넌트
        - props: review (이미지, 텍스트)
        - 캡쳐 이미지 기반 후기 카드
        - blur 효과용 className prop 지원
        - 약간 기울어진 배치 가능 (rotate)
        - [ ] 5.1.T1 테스트 코드 작성
        - [ ] 5.1.T2 테스트 실행 및 검증
    - [x] 5.2 UserReviewSection (공통)
        - 타이틀: "수강생의 피드백 솔직 후기"
        - 전면 2~3개 카드 선명, 뒤쪽 blur 처리
        - 카드 약간 기울여서 캐주얼 배치
        - 어두운 배경
        - [ ] 5.2.T1 테스트 코드 작성
        - [ ] 5.2.T2 테스트 실행 및 검증
    - [x] 5.3 SuccessStoriesSection (공통)
        - 타이틀: "렛츠커리어와 함께 취뽀한 주인공들을 소개합니다"
        - Swiper 롤링 카드 (Autoplay, 무한루프)
        - 클래스 참고: `swiper-horizontal slide-per-auto slide-rolling`
        - 배경 없이 카드만 롤링
        - 카드: 회사명, 직무, 이름(가명), 합격 연도, 회사 로고
        - `src/domain/home/review/ReviewSection.tsx` 패턴 참고
        - 반응형: 모바일/데스크톱 카드 크기 조정
        - [ ] 5.3.T1 테스트 코드 작성
        - [ ] 5.3.T2 테스트 실행 및 검증
    - [x] 5.4 ApplyCtaSection
        - 버튼: "[챌린지명] 신청하러 가기"
        - 선택된 챌린지에 따라 텍스트 + 이동 경로 동적 변경
        - 큰 CTA 버튼 스타일 (중앙 정렬)
        - [ ] 5.4.T1 테스트 코드 작성
        - [ ] 5.4.T2 테스트 실행 및 검증
    - [x] 5.5 ChallengeFeedbackScreen 최종 연결
        - UserReviewSection, SuccessStoriesSection, ApplyCtaSection 추가
        - 전체 섹션 순서 확인 (01~09)
    - [x] 5.6 린트 및 타입 체크
        - ESLint + Prettier 실행
        - `npx tsc --noEmit` 통과 확인
