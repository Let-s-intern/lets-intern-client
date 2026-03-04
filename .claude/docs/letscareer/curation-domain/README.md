# 큐레이션 페이지 도메인 구조

## 개요

큐레이션 페이지는 **사용자 맞춤형 챌린지 추천 시스템**으로, 6가지 페르소나 기반 3단계 질문을 통해 맞춤 프로그램을 추천한다.

- **큐레이션 파트**: 페르소나 선택 → 2단계 질문 → 맞춤 추천 결과
- **비교 파트**: 7개 챌린지를 최대 3개까지 선택하여 비교 (데스크톱/모바일 별도 뷰)
- **FAQ 파트**: 4가지 카테고리별 자주 묻는 질문

---

## 1. 라우트 구조

```
/curation                               -> src/app/(user)/curation/page.tsx
```

---

## 2. 도메인 파일 구조

```
src/domain/curation/
├── index.ts                              # 진입점 (CurationScreen export)
├── types.ts                              # 모든 타입 정의
│
├── screen/
│   └── CurationScreen.tsx                # 메인 화면 (Hero + Form + Comparison + FAQ)
│
├── hero/
│   └── CurationHero.tsx                  # 상단 Hero 배너
│
├── nav/
│   └── CurationStickyNav.tsx             # 스티키 네비게이션 바
│
├── flow/                                 # 큐레이션 흐름 (핵심 기능)
│   ├── useCurationFlow.ts                # 플로우 전체 상태 관리 훅
│   ├── curationEngine.ts                 # 추천 로직 (비즈니스 엔진)
│   ├── curationEngine.test.ts            # 추천 로직 테스트
│   ├── personas.ts                       # 6가지 페르소나 정의
│   ├── questions.ts                      # 페르소나별 질문/선택지 (QUESTION_MAP)
│   ├── guides.ts                         # 가이드 콘텐츠
│   ├── copy.ts                           # UI 문구 (heroCopy, stepLabels, defaultPersonaId)
│   ├── CurationStepper.tsx               # 4단계 스텝 표시기
│   ├── PersonaSelector.tsx               # 페르소나 선택 (데스크톱)
│   ├── MobilePersonaSelector.tsx         # 페르소나 선택 (모바일)
│   ├── QuestionStep.tsx                  # 질문 단계 (데스크톱)
│   ├── MobileQuestionStep.tsx            # 질문 단계 (모바일)
│   ├── ResultSection.tsx                 # 추천 결과 섹션
│   ├── DesktopRecommendationCard.tsx     # 추천 카드 (데스크톱)
│   └── MobileRecommendationCard.tsx      # 추천 카드 (모바일)
│
├── challenge-comparison/                 # 챌린지 비교 섹션
│   ├── useCompareCart.ts                 # 비교 장바구니 상태 훅
│   ├── ChallengeCompareSection.tsx       # 비교 섹션 메인
│   ├── ChallengeCard.tsx                 # 개별 챌린지 카드 (데스크톱)
│   ├── MobileChallengeCard.tsx           # 개별 챌린지 카드 (모바일 세로 리스트)
│   ├── CompareResultCard.tsx             # 비교 결과 카드 (데스크톱)
│   ├── MobileCompareView.tsx             # 비교 결과 전체화면 뷰 (모바일)
│   └── RecommendedComparisons.tsx        # 자주 비교하는 조합
│
├── faq/                                  # FAQ 섹션
│   ├── FaqSection.tsx                    # FAQ 메인
│   └── faqs.ts                           # FAQ 데이터 (4개 카테고리)
│
└── shared/                               # 공유 데이터
    ├── programs.ts                       # 7개 프로그램 상세 정보
    └── comparisons.ts                    # 챌린지 비교 데이터 (CHALLENGE_COMPARISON, FREQUENT_COMPARISON)
```

---

## 3. 핵심 훅

### useCurationFlow

큐레이션 플로우 전체 상태를 관리하는 핵심 훅. React Hook Form + Zod 기반.

```typescript
// 파라미터
interface UseCurationFlowParams {
  defaultPersonaId: PersonaId;
  questionMap?: Record<PersonaId, CurationQuestion[]>; // 기본값: QUESTION_MAP
  personaIds?: PersonaId[];                            // 기본값: PERSONA_IDS
}

const {
  formRef,        // 폼 영역 ref (스크롤)
  currentStep,    // 현재 단계 (0~3)
  setCurrentStep, // 단계 직접 설정
  personaId,      // 선택된 페르소나
  questionSet,    // 페르소나별 질문 세트
  errors,         // 폼 검증 에러
  watch,          // 폼 값 감시
  setValue,       // 폼 값 설정
  goNext,         // 다음 단계 (유효성 검사 후 진행)
  goToStep,       // 특정 단계로 이동 (뒤로가기만 허용)
  handleRestart,  // 처음부터 다시
  result,         // 최종 추천 결과 (CurationResult | null)
  scrollToForm,   // 폼 영역으로 스크롤
} = useCurationFlow({ defaultPersonaId, questionMap: QUESTION_MAP });
```

**플로우:**

1. Step 0: 페르소나 선택 (6가지) → 선택 즉시 `goNext()` 자동 호출
2. Step 1: 질문 1 (상황별 과제) → 선택 즉시 `goNext()` 자동 호출
3. Step 2: 질문 2 (시간/피드백 필요도) → 선택 즉시 `handleSubmit` → `curationEngine` 실행
4. Step 3: 추천 결과 표시 (`result`가 존재할 때 `ResultSection` 렌더)

**주의:** 페르소나 변경 시 step1/step2 값이 자동 초기화됨 (useEffect)

### useCompareCart

챌린지 비교 선택 상태를 관리하는 훅. 최대 3개까지 선택 가능.

```typescript
const {
  cartItems,      // 선택된 프로그램 ID 배열
  addToCart,      // 프로그램 추가 (최대 3개)
  removeFromCart, // 프로그램 제거
  toggleCartItem, // 토글
  clearCart,      // 초기화
  isInCart,       // 특정 프로그램 선택 여부
  isFull,         // 최대 선택 도달 여부 (3개)
  canCompare,     // 비교 가능 여부 (2개 이상)
} = useCompareCart();
```

---

## 4. 비즈니스 로직 (curationEngine)

### 추천 엔진

```
입력: FormValues { personaId, step1, step2 }
출력: CurationResult { personaId, headline, summary, recommendations[], emphasisNotes? }
```

- 6가지 페르소나 × 2~4가지 질문 조합에 따라 분기
- 프로그램 우선순위: basic / standard / premium 플랜 추천
- 중복 제거 로직 포함

### 7개 프로그램

| ID                | 프로그램명             |
| ----------------- | ---------------------- |
| experience        | 기필코 경험정리 챌린지 |
| resume            | 이력서 1주 완성        |
| coverLetter       | 자기소개서 2주 완성    |
| portfolio         | 포트폴리오 2주 완성    |
| enterpriseCover   | 대기업 자기소개서      |
| marketingAllInOne | 마케팅 올인원          |
| hrAllInOne        | HR 올인원              |

### 6가지 페르소나

| ID          | 타이틀                       |
| ----------- | ---------------------------- |
| starter     | 취준 입문 / 경험 정리가 먼저 |
| resume      | 이력서부터 빠르게 완성       |
| coverLetter | 자기소개서/지원동기 강화     |
| portfolio   | 포트폴리오/직무 자료 준비    |
| specialized | 특화 트랙 (대기업/마케팅/HR) |
| dontKnow    | 잘 모르겠어요                |

---

## 5. 타입 시스템

### 폼 관련

```typescript
type PersonaId =
  | 'starter'
  | 'resume'
  | 'coverLetter'
  | 'portfolio'
  | 'specialized'
  | 'dontKnow';
type PlanId = 'basic' | 'standard' | 'premium';
type ProgramId =
  | 'experience'
  | 'resume'
  | 'coverLetter'
  | 'portfolio'
  | 'enterpriseCover'
  | 'marketingAllInOne'
  | 'hrAllInOne';

interface FormValues {
  personaId?: PersonaId;
  step1: string;
  step2: string;
}
```

### 결과 관련

```typescript
interface CurationResult {
  personaId: PersonaId;
  headline: string;
  summary: string;
  recommendations: ProgramRecommendation[];
  emphasisNotes?: string[];
}

interface ProgramRecommendation {
  programId: ProgramId;
  emphasis: 'primary' | 'secondary';
  reason: string;
  suggestedPlanId?: PlanId;
}
```

### 프로그램 콘텐츠

```typescript
interface ProgramContent {
  id: ProgramId;
  title: string;
  subtitle: string;
  badge?: string;
  category?: string;
  target: string;
  duration: string;
  deliverable: string;
  feedback: string;
  curriculum: string[];
  features?: string[];
  plans: ProgramPlan[];
  thumbnail: string;
  link: string;
}
```

### 비교 관련

```typescript
interface ChallengeComparisonRow {
  programId: ProgramId;
  label: string;
  target: string;
  duration: string;
  pricing: string;
  curriculum: string;
  deliverable: string;
  feedback: string;
  features?: string;
}

interface FrequentComparisonItem {
  title: string; // e.g., "자소서 vs 대기업 자소서"
  left: string;
  right: string;
  rows: { label: string; left: string; right: string }[];
}
```

### FAQ 관련

```typescript
type FAQCategory = '프로그램 적합성' | '커리큘럼/자료' | '참여 방법' | '피드백/멘토링';

interface FAQItem {
  question: string;
  answer: string;
  category: FAQCategory;
  image?: string | any;
}
```

---

## 6. 화면 구성

```
CurationScreen
├── CurationHero                   # Hero 배너
├── CurationStickyNav              # 스티키 네비게이션 (Form / 비교 / FAQ)
│
├── [폼 섹션] #curation-form
│   ├── CurationStepper            # 4단계 진행 표시
│   ├── PersonaSelector            # Step 0: 페르소나 선택
│   ├── QuestionStep               # Step 1~2: 질문 답변
│   └── ResultSection              # Step 3: 추천 결과
│       ├── DesktopRecommendationCard (Primary)
│       └── DesktopRecommendationCard (Secondary)
│
├── [챌린지 비교 섹션] #curation-challenge-comparison
│   ├── RecommendedComparisons     # 자주 비교하는 조합 버튼
│   ├── ChallengeCard × 7          # 데스크톱: 4+3 그리드
│   ├── MobileChallengeCard × 7    # 모바일: 세로 리스트
│   ├── CompareResultCard          # 데스크톱: 비교 결과 (인라인)
│   └── MobileCompareView          # 모바일: 비교 결과 (전체화면)
│
└── [FAQ 섹션] #curation-faq
    └── FaqSection                 # 4개 카테고리 FAQ
```

**비교 섹션 반응형 동작:**
- 데스크톱: 비교 버튼 클릭 → `CompareResultCard` 인라인 표시
- 모바일: 플로팅 버튼 → `MobileCompareView` 전체화면 표시
- 추천 비교 조합 클릭 → 데스크톱은 인라인 결과, 모바일은 전체화면 뷰

---

## 7. 설계 특징

- **완전 정적**: API 연동 없음. 모든 데이터(personas, questions, programs, comparisons, faqs)는 정적 파일로 관리
- **반응형 분리**: 데스크톱/모바일 별도 컴포넌트 (PersonaSelector, QuestionStep, ChallengeCard, CompareView, RecommendationCard)
- **상태 관리**: React Hook Form + Zod + 커스텀 훅 (useCurationFlow, useCompareCart)
- **컴포넌트 계층**: Screen → Section → Card → UI
- **스크롤 최적화**: `requestAnimationFrame` 활용, sticky nav 높이(60px) 오프셋 계산
- **SEO**: 메타데이터 설정, canonical URL
