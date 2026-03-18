# Tasks: 챌린지 피드백 멘토링 - Push 6

> PRD: `.claude/tasks/prd-260318.md`
> Push 범위: 전체 통합 점검 — 애니메이션, 반응형, 디자인 일관성, 코드 품질
> 상태: 🔲 진행 중

---

### 관련 파일

- `src/domain/challenge-feedback/` 전체
- `src/app/(user)/challenge/feedback-mentoring/page.tsx`

### 적용 스킬

- `vercel-react-best-practices` — memo, 호이스팅, 번들 최적화 최종 점검
- `code-quality` — 가독성/예측가능성/응집도/결합도 최종 검토
- `seo` — 메타데이터, Open Graph, SSR/CSR 판단
- `folder-structure` — 최종 파일 배치 확인

### 적용 Role

- `.claude/roles/developer.md` — 개발 전담 에이전트 규칙

### 참고 문서

- `.claude/tasks/화면 이미지 260318/` (전체)

---

## 작업

- [ ] 6.0 통합 점검 및 마무리
    - [ ] 6.1 애니메이션 & 인터랙션 점검
        - 별 반짝임 애니메이션 보정
        - 챌린지 메뉴 호버/클릭 전환 매끄러움
        - 섹션 진입 시 fade-in / slide-up (Intersection Observer)
        - Swiper 롤링 무한 스크롤
        - 후기 카드 blur 효과
        - [ ] 6.1.T1 테스트 코드 작성
        - [ ] 6.1.T2 테스트 실행 및 검증
    - [ ] 6.2 반응형 디자인 점검
        - 모바일 (< 768px): 전체 섹션 세로 스택, 텍스트 크기
        - 태블릿 (768~1024px): 중간 레이아웃
        - 데스크톱 (> 1024px): max-width 적용
        - 챌린지 메뉴 모바일 처리 (wrap/스크롤)
        - [ ] 6.2.T1 테스트 코드 작성
        - [ ] 6.2.T2 테스트 실행 및 검증
    - [ ] 6.3 디자인 일관성 점검
        - 섹션 간 간격 (py) 통일
        - 좌우 마진/패딩 통일
        - 폰트 크기/웨이트 일관성
        - 색상 팔레트 일관성 (다크 배경, 보라색 포인트)
        - [ ] 6.3.T1 테스트 코드 작성
        - [ ] 6.3.T2 테스트 실행 및 검증
    - [ ] 6.4 기능 점검
        - URL 쿼리 파라미터 동작 (?challenge=xxx)
        - 챌린지 메뉴 전환 시 콘텐츠 변경
        - 조건부 섹션 표시/숨김
        - CTA 버튼 올바른 URL 이동
        - SEO 메타데이터
        - [ ] 6.4.T1 테스트 코드 작성
        - [ ] 6.4.T2 테스트 실행 및 검증
    - [ ] 6.5 코드 품질 최종 점검
        - memo/useMemo 적용 여부
        - 정적 값 호이스팅
        - 타입 안전성
        - ESLint + Prettier 최종 실행
        - `npx tsc --noEmit` 최종 통과
        - `npm run build` 빌드 테스트 통과
