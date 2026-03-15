# 큐레이션 챌린지 비교 기능 재설계 - 작업 목록

## 관련 파일

### 삭제 대상
- `src/domain/curation/challenge-comparison/ChallengeComparisonSection.tsx` - 기존 전체 비교표 섹션 컴포넌트
- `src/domain/curation/challenge-comparison/ChallengeComparisonTable.tsx` - 데스크톱 비교 테이블
- `src/domain/curation/challenge-comparison/ChallengeComparisonCards.tsx` - 비교 카드 컴포넌트
- `src/domain/curation/challenge-comparison/MobileChallengeComparison.tsx` - 모바일 비교표
- `src/domain/curation/challenge-comparison/useExpandableRows.ts` - 행 확장 훅
- `src/domain/curation/frequent-comparison/FrequentComparisonSection.tsx` - 챌린지 차이점(캐러셀) 섹션
- `src/domain/curation/frequent-comparison/FrequentComparisonCarousel.tsx` - 데스크톱 무한 캐러셀
- `src/domain/curation/frequent-comparison/MobileFrequentComparison.tsx` - 모바일 아코디언 비교
- `src/domain/curation/frequent-comparison/useInfiniteCarousel.ts` - 무한 캐러셀 훅
- `src/domain/curation/frequent-comparison/carouselAnimation.ts` - 캐러셀 애니메이션 유틸
- `src/domain/curation/frequent-comparison/carouselAnimation.test.ts` - 캐러셀 테스트

### 수정 대상
- `src/domain/curation/screen/CurationScreen.tsx` - 메인 큐레이션 화면 (섹션 구조 변경, highlightedPrograms 제거)
- `src/domain/curation/nav/CurationStickyNav.tsx` - 스티키 네비게이션 (4항목→3항목)
- `src/domain/curation/types.ts` - 타입 정의 (비교함 관련 타입 추가, 불필요 타입 제거)
- `src/domain/curation/flow/ResultSection.tsx` - 추천 결과 카드 (배경색/그림자 변경, 비교함 담기 버튼 추가)
- `src/domain/curation/flow/MobileRecommendationCard.tsx` - 모바일 추천 카드 (배경색/그림자 변경, 비교함 담기 버튼 추가)
- `src/domain/curation/shared/comparisons.ts` - 비교 데이터 (FREQUENT_COMPARISON → 추천 비교 조합 데이터로 변환)
- `src/domain/curation/faq/FaqSection.tsx` - FAQ 섹션 (min-height 처리)

### 신규 생성
- `src/domain/curation/challenge-comparison/useCompareCart.ts` - 비교함 상태 관리 훅
- `src/domain/curation/challenge-comparison/CompareCartBar.tsx` - 비교함 하단 바 (담긴 항목 표시 + 비교하기 버튼)
- `src/domain/curation/challenge-comparison/CompareResultCard.tsx` - 두 챌린지 비교 결과 카드 UI
- `src/domain/curation/challenge-comparison/RecommendedComparisons.tsx` - 추천 비교 조합 버튼 목록
- `src/domain/curation/challenge-comparison/ChallengeCompareSection.tsx` - 새로운 챌린지 비교 섹션 (통합 컨테이너)

---

## 작업

- [ ] 1.0 전체 비교표 섹션 및 하이라이트 기능 제거, 섹션 구조 정리 (Push 단위)

    - [ ] 1.1 기존 전체 비교표(challenge-comparison) 컴포넌트 및 관련 파일 삭제
        - `ChallengeComparisonSection.tsx`, `ChallengeComparisonTable.tsx`, `ChallengeComparisonCards.tsx`, `MobileChallengeComparison.tsx`, `useExpandableRows.ts` 파일 삭제
        - `CurationScreen.tsx`에서 `ChallengeComparisonSection` import 및 렌더링 제거
        - `types.ts`에서 `ComparisonRowConfig` 인터페이스 제거
        - [ ] 1.1.1 테스트 코드 작성
        - [ ] 1.1.2 테스트 실행 및 검증 (빌드 에러 없는지 확인)
        - [ ] 1.1.3 오류 수정 (필요 시)

    - [ ] 1.2 챌린지 차이점(frequent-comparison) 섹션 전체 삭제
        - `frequent-comparison/` 디렉토리 전체 삭제 (`FrequentComparisonSection.tsx`, `FrequentComparisonCarousel.tsx`, `MobileFrequentComparison.tsx`, `useInfiniteCarousel.ts`, `carouselAnimation.ts`, `carouselAnimation.test.ts`)
        - `CurationScreen.tsx`에서 `FrequentComparisonSection` import 및 렌더링 제거
        - `shared/comparisons.ts`에서 `FREQUENT_COMPARISON` export는 유지 (추천 비교 조합 데이터로 재활용)
        - `types.ts`에서 `FrequentComparisonItem` 타입은 유지 (추천 비교 조합에서 사용)
        - [ ] 1.2.1 테스트 코드 작성
        - [ ] 1.2.2 테스트 실행 및 검증 (빌드 에러 없는지 확인)
        - [ ] 1.2.3 오류 수정 (필요 시)

    - [ ] 1.3 highlightedPrograms 로직 제거 및 스티키 네비게이션 3항목으로 축소
        - `CurationScreen.tsx`에서 `highlightedPrograms` useMemo 및 관련 prop 전달 코드 삭제
        - `CurationStickyNav.tsx` props에서 `onScrollToFrequentComparison` 제거
        - navItems 배열에서 '챌린지 차이점' 항목 삭제 → '맞춤 추천', '챌린지 비교', 'FAQ' 3개로 변경
        - IntersectionObserver에서 `curation-frequent-comparison` 감지 로직 제거
        - `CurationScreen.tsx`의 `scrollToSection` 호출부에서 `onScrollToFrequentComparison` 콜백 제거
        - [ ] 1.3.1 테스트 코드 작성
        - [ ] 1.3.2 테스트 실행 및 검증
        - [ ] 1.3.3 오류 수정 (필요 시)

    - [ ] 1.4 섹션 구조 정리: 맞춤 추천 → 챌린지 비교(빈 placeholder) → FAQ
        - `CurationScreen.tsx`의 하단 섹션에서 삭제된 컴포넌트 대신 챌린지 비교용 빈 placeholder `<section id="curation-challenge-comparison">` 배치
        - `FaqSection`은 그대로 유지
        - 빌드 및 렌더링이 정상 동작하는지 확인
        - [ ] 1.4.1 테스트 코드 작성
        - [ ] 1.4.2 테스트 실행 및 검증
        - [ ] 1.4.3 오류 수정 (필요 시)

---

- [ ] 2.0 챌린지 비교 기능 재설계 - 비교함 담기 및 비교 결과 카드 구현 (Push 단위)

    - [ ] 2.1 비교함 상태 관리 훅 (`useCompareCart`) 구현
        - `useCompareCart.ts` 생성: `cartItems: ProgramId[]`, `addToCart(id)`, `removeFromCart(id)`, `clearCart()`, `isInCart(id)` 기능
        - 최대 3개까지 담을 수 있도록 제한
        - 이미 담긴 항목을 다시 누르면 제거 (토글 동작)
        - [ ] 2.1.1 테스트 코드 작성 (useCompareCart 훅 단위 테스트)
        - [ ] 2.1.2 테스트 실행 및 검증
        - [ ] 2.1.3 오류 수정 (필요 시)

    - [ ] 2.2 추천 카드에 "비교함 담기" 버튼 추가
        - `ResultSection.tsx`의 `DesktopRecommendationCard`에 "비교함 담기" / "담김" 토글 버튼 추가
        - `MobileRecommendationCard.tsx`에도 동일 버튼 추가
        - `CurationScreen.tsx`에서 `useCompareCart` 훅 사용, 카드에 `onToggleCompare`, `isInCart` prop 전달
        - 버튼 클릭 시 비교함에 추가/제거 동작 연결
        - [ ] 2.2.1 테스트 코드 작성
        - [ ] 2.2.2 테스트 실행 및 검증
        - [ ] 2.2.3 오류 수정 (필요 시)

    - [ ] 2.3 비교함 하단 바 (`CompareCartBar`) 구현
        - 비교함에 1개 이상 담겼을 때 하단에 고정 바 표시
        - 담긴 챌린지명 표시 + 각 항목 X 버튼으로 제거 가능
        - "비교하기" 버튼: 2개 이상 담겼을 때 활성화 (1개일 때는 비활성 + "1개 더 담아주세요" 안내)
        - 비교하기 클릭 시 비교 결과 영역으로 스크롤 이동 + 비교 상태 활성화
        - [ ] 2.3.1 테스트 코드 작성
        - [ ] 2.3.2 테스트 실행 및 검증
        - [ ] 2.3.3 오류 수정 (필요 시)

    - [ ] 2.4 비교 결과 카드 (`CompareResultCard`) UI 구현
        - 최대 3개 챌린지를 가로 배치하여 비교하는 카드 컴포넌트
        - 비교 항목: 추천 대상, 기간, 플랜별 가격, 피드백 횟수, 결과물, 커리큘럼, 주요 특징
        - `CHALLENGE_COMPARISON` 데이터 또는 `PROGRAMS` 데이터를 사용하여 정보 표시
        - 비교 결과 닫기/다시 비교 버튼 제공
        - 데스크톱/모바일 반응형 레이아웃
        - [ ] 2.4.1 테스트 코드 작성
        - [ ] 2.4.2 테스트 실행 및 검증
        - [ ] 2.4.3 오류 수정 (필요 시)

    - [ ] 2.5 추천 비교 조합 (`RecommendedComparisons`) 구현
        - `FREQUENT_COMPARISON` 데이터 기반으로 추천 비교 조합 버튼 목록 렌더링
        - 각 버튼에 "자소서 vs 대기업 자소서" 등 제목 표시
        - 클릭 시 비교함 과정 없이 즉시 해당 두 프로그램의 `CompareResultCard` 표시
        - [ ] 2.5.1 테스트 코드 작성
        - [ ] 2.5.2 테스트 실행 및 검증
        - [ ] 2.5.3 오류 수정 (필요 시)

    - [ ] 2.6 챌린지 비교 섹션 통합 (`ChallengeCompareSection`) 조립
        - 새로운 `ChallengeCompareSection.tsx` 생성
        - 섹션 구성: 제목 + 추천 비교 조합 버튼 + 비교 결과 카드 영역
        - `useCompareCart`와 추천 비교 조합 상태를 통합 관리
        - 비교하기 클릭 또는 추천 조합 클릭 시 결과 카드 표시
        - `CurationScreen.tsx`에서 placeholder를 `ChallengeCompareSection`으로 교체
        - [ ] 2.6.1 테스트 코드 작성
        - [ ] 2.6.2 테스트 실행 및 검증
        - [ ] 2.6.3 오류 수정 (필요 시)

---

- [ ] 3.0 한 화면(뷰포트) 단위 레이아웃 적용 및 스크롤 애니메이션 (Push 단위)

    - [ ] 3.1 맞춤 추천 섹션 뷰포트 fit 레이아웃
        - `CurationScreen.tsx`의 curation-form 섹션에 `min-h-screen` 적용
        - 내부 padding, gap 등을 조정하여 한 화면 안에 폼 + 결과가 모두 보이도록 조정
        - 결과 표시 시에도 한 화면에 맞도록 ResultSection의 간격 조정
        - [ ] 3.1.1 테스트 코드 작성
        - [ ] 3.1.2 테스트 실행 및 검증
        - [ ] 3.1.3 오류 수정 (필요 시)

    - [ ] 3.2 챌린지 비교 섹션 뷰포트 fit 레이아웃
        - `ChallengeCompareSection`에 `min-h-screen` 적용
        - 추천 비교 조합 버튼 + 비교 결과 카드가 한 화면에 보이도록 내부 레이아웃 조정
        - 비교 결과가 없을 때도 한 화면 높이를 유지하도록 설정
        - [ ] 3.2.1 테스트 코드 작성
        - [ ] 3.2.2 테스트 실행 및 검증
        - [ ] 3.2.3 오류 수정 (필요 시)

    - [ ] 3.3 비교 결과 표시 시 스크롤 애니메이션 구현
        - 비교하기 클릭 시 비교 결과 영역으로 `smooth scroll` 애니메이션 적용
        - 결과가 뷰포트 한 화면에 모두 보이는 위치로 스크롤
        - 추천 비교 조합 클릭 시에도 동일한 스크롤 애니메이션 적용
        - `scrollIntoView({ behavior: 'smooth' })` 또는 `window.scrollTo` 활용
        - [ ] 3.3.1 테스트 코드 작성
        - [ ] 3.3.2 테스트 실행 및 검증
        - [ ] 3.3.3 오류 수정 (필요 시)

---

- [ ] 4.0 카드 디자인 변경 및 FAQ 높이 안정화 (Push 단위)

    - [ ] 4.1 큐레이션 결과 카드 디자인 변경 (배경색 + 그림자)
        - `ResultSection.tsx`의 `DesktopRecommendationCard`: `bg-[#FAFAFA]` → `bg-white`, `shadow-md` 추가
        - `MobileRecommendationCard.tsx`에도 동일 적용: 배경 흰색 + `shadow-md`
        - 기존 `border border-[#CFCFCF]`는 유지하거나 약간 연하게 조정하여 그림자와 조화
        - [ ] 4.1.1 테스트 코드 작성
        - [ ] 4.1.2 테스트 실행 및 검증
        - [ ] 4.1.3 오류 수정 (필요 시)

    - [ ] 4.2 FAQ 섹션 카테고리 필터 전환 시 높이 점프 방지
        - `FaqSection.tsx`에서 FAQ 리스트 컨테이너에 `min-h-[값]` 적용
        - 방법 1: 전체 카테고리일 때의 높이를 기준으로 고정 min-height 설정
        - 방법 2: `useRef`로 최대 높이를 측정하여 동적 min-height 적용
        - 카테고리 전환 시 `transition-all` 등으로 높이 변화를 부드럽게 처리
        - [ ] 4.2.1 테스트 코드 작성
        - [ ] 4.2.2 테스트 실행 및 검증
        - [ ] 4.2.3 오류 수정 (필요 시)

    - [ ] 4.3 전체 통합 확인 및 불필요 코드 정리
        - 미사용 import, 타입, 데이터 정리
        - `types.ts`에서 더 이상 사용하지 않는 `ChallengeComparisonRow` 타입이 `CompareResultCard`에서 재활용되는지 확인 후 필요 없으면 제거
        - 빌드 에러 없는지 전체 빌드 확인
        - 3개 섹션(맞춤 추천, 챌린지 비교, FAQ) 정상 렌더링 확인
        - [ ] 4.3.1 테스트 코드 작성 (통합 렌더링 테스트)
        - [ ] 4.3.2 테스트 실행 및 검증
        - [ ] 4.3.3 오류 수정 (필요 시)
