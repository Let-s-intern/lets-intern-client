# 큐레이션 페이지 도메인 구조

## 개요

큐레이션 페이지는 **사용자 맞춤형 챌린지 추천 시스템**으로, 6가지 페르소나 기반 3단계 질문을 통해 맞춤 프로그램을 추천한다.

- **사용자 파트**: 페르소나 선택 -> 2단계 질문 -> 맞춤 추천 결과
- **비교 파트**: 7개 챌린지를 최대 3개까지 선택하여 비교
- **FAQ 파트**: 4가지 카테고리별 자주 묻는 질문
- **관리자 파트**: 홈 화면 큐레이션 섹션(배너/리뷰/블로그) CRUD 관리

---

## 1. 라우트 구조

### 사용자 페이지
```
/curation                               -> src/app/(user)/curation/page.tsx
```

### 관리자 페이지
```
/admin/home/curation                    -> src/app/admin/home/curation/page.tsx
/admin/home/curation/create             -> src/app/admin/home/curation/create/page.tsx
/admin/home/curation/[id]/edit          -> src/app/admin/home/curation/[id]/edit/page.tsx
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
│   ├── questions.ts                      # 페르소나별 질문/선택지
│   ├── guides.ts                         # 가이드 콘텐츠
│   ├── copy.ts                           # UI 문구 (Hero, Steps)
│   ├── CurationStepper.tsx               # 4단계 스텝 표시기
│   ├── PersonaSelector.tsx               # 페르소나 선택 (데스크톱)
│   ├── MobilePersonaSelector.tsx         # 페르소나 선택 (모바일)
│   ├── QuestionStep.tsx                  # 질문 단계 공통
│   ├── MobileQuestionStep.tsx            # 질문 단계 (모바일)
│   ├── ResultSection.tsx                 # 추천 결과 섹션
│   ├── DesktopRecommendationCard.tsx     # 추천 카드 (데스크톱)
│   └── MobileRecommendationCard.tsx      # 추천 카드 (모바일)
│
├── challenge-comparison/                 # 챌린지 비교 섹션
│   ├── useCompareCart.ts                 # 비교 장바구니 상태 훅
│   ├── ChallengeCompareSection.tsx       # 비교 섹션 메인
│   ├── ChallengeCard.tsx                 # 개별 챌린지 카드
│   ├── CompareResultCard.tsx             # 비교 결과 카드
│   └── RecommendedComparisons.tsx        # 자주 비교하는 조합
│
├── faq/                                  # FAQ 섹션
│   ├── FaqSection.tsx                    # FAQ 메인
│   └── faqs.ts                           # FAQ 데이터 (4개 카테고리)
│
└── shared/                               # 공유 데이터
    ├── programs.ts                       # 7개 프로그램 상세 정보
    └── comparisons.ts                    # 챌린지 비교 데이터
```

### 관리자 도메인
```
src/domain/admin/
├── pages/home/curation/
│   ├── HomeCurationListPage.tsx          # 목록 페이지 (DataGrid)
│   ├── HomeCurationCreatePage.tsx        # 생성 페이지
│   └── HomeCurationEditPage.tsx          # 수정 페이지
└── home/curation/
    ├── CurationItem.tsx                  # 개별 큐레이션 아이템
    ├── CurationSelectModal.tsx           # 아이템 선택 모달
    └── section/
        ├── CurationInfoSection.tsx       # 기본 정보 입력
        ├── CurationItemsSection.tsx      # 아이템 목록 관리
        └── CurationVisibleSection.tsx    # 노출 설정
```

---

## 3. 핵심 훅

### useCurationFlow

큐레이션 플로우 전체 상태를 관리하는 핵심 훅. React Hook Form 기반.

```typescript
const {
  formRef,           // 폼 영역 ref (스크롤)
  currentStep,       // 현재 단계 (0~3)
  personaId,         // 선택된 페르소나
  questionSet,       // 페르소나별 질문 세트
  errors,            // 폼 검증 에러
  watch,             // 폼 값 감시
  setValue,          // 폼 값 설정
  goNext,            // 다음 단계
  goToStep,          // 특정 단계로 이동 (뒤로가기만)
  handleRestart,     // 처음부터 다시
  result,            // 최종 추천 결과 (CurationResult)
  scrollToForm,      // 폼 영역으로 스크롤
} = useCurationFlow()
```

**플로우:**
1. Step 0: 페르소나 선택 (6가지)
2. Step 1: 질문 1 (상황별 과제)
3. Step 2: 질문 2 (시간/피드백 필요도)
4. Step 3: 추천 결과 (curationEngine 실행)

### useCompareCart

챌린지 비교 선택 상태를 관리하는 훅. 최대 3개까지 선택 가능.

```typescript
const {
  cartItems,         // 선택된 프로그램 ID 배열
  addToCart,         // 프로그램 추가 (최대 3개)
  removeFromCart,    // 프로그램 제거
  toggleCartItem,    // 토글
  clearCart,         // 초기화
  isInCart,          // 특정 프로그램 선택 여부
  isFull,            // 최대 선택 도달 여부
  canCompare,        // 비교 가능 여부 (2개 이상)
} = useCompareCart()
```

---

## 4. 비즈니스 로직 (curationEngine)

### 추천 엔진

```
입력: FormValues { personaId, step1, step2 }
출력: CurationResult { headline, summary, recommendations[] }
```

- 6가지 페르소나 x 2~4가지 질문 조합에 따라 분기
- 프로그램 우선순위: basic / standard / premium 플랜 추천
- 중복 제거 로직 포함

### 7개 프로그램

| ID | 프로그램명 |
|----|-----------|
| experience | 기필코 경험정리 챌린지 |
| resume | 이력서 1주 완성 |
| coverLetter | 자기소개서 2주 완성 |
| portfolio | 포트폴리오 2주 완성 |
| enterpriseCover | 대기업 자기소개서 |
| marketingAllInOne | 마케팅 올인원 |
| hrAllInOne | HR 올인원 |

### 6가지 페르소나

| ID | 타이틀 |
|----|--------|
| starter | 취준 입문 / 경험 정리가 먼저 |
| resume | 이력서부터 빠르게 완성 |
| coverLetter | 자기소개서/지원동기 강화 |
| portfolio | 포트폴리오/직무 자료 준비 |
| specialized | 특화 트랙 (대기업/마케팅/HR) |
| dontKnow | 잘 모르겠어요 |

---

## 5. 타입 시스템

### 폼 관련
```typescript
type PersonaId = 'starter' | 'resume' | 'coverLetter' | 'portfolio' | 'specialized' | 'dontKnow'
type PlanId = 'basic' | 'standard' | 'premium'
type ProgramId = 'experience' | 'resume' | 'coverLetter' | 'portfolio' | 'enterpriseCover' | 'marketingAllInOne' | 'hrAllInOne'

interface FormValues {
  personaId?: PersonaId
  step1: string
  step2: string
}
```

### 결과 관련
```typescript
interface CurationResult {
  personaId: PersonaId
  headline: string
  summary: string
  recommendations: ProgramRecommendation[]
  emphasisNotes?: string[]
}

interface ProgramRecommendation {
  programId: ProgramId
  emphasis: 'primary' | 'secondary'
  reason: string
  suggestedPlanId?: PlanId
}
```

### 비교 관련
```typescript
interface ChallengeComparisonRow {
  programId: string
  label: string
  target: string
  duration: string
  pricing: string
  curriculum: string
  deliverable: string
  feedback: string
  features?: string
}

interface FrequentComparisonItem {
  title: string          // e.g., "자소서 vs 대기업 자소서"
  left: string
  right: string
  rows: { label: string; left: string; right: string }[]
}
```

---

## 6. API

### 파일 위치: `src/api/curation.ts`

#### 관리자 API
| 훅 | 메서드 | 용도 |
|----|--------|------|
| useGetAdminCurationList | GET | 큐레이션 목록 조회 |
| useGetAdminCurationDetail | GET | 큐레이션 상세 조회 |
| usePostAdminCuration | POST | 큐레이션 생성 |
| usePatchAdminCuration | PATCH | 큐레이션 수정 |
| useDeleteAdminCuration | DELETE | 큐레이션 삭제 |

#### 사용자 API
| 훅 | 메서드 | 용도 |
|----|--------|------|
| useGetUserCuration | GET | 홈 큐레이션 데이터 조회 (위치별) |

### 관리자 데이터 스키마
```typescript
interface CurationListItemType {
  curationId: number
  locationType: 'UNDER_BANNER' | 'UNDER_REVIEW' | 'UNDER_BLOG'
  title: string
  startDate: string
  endDate: string
  isVisible: boolean
}

interface CurationItemType {
  id: number
  programType: 'CHALLENGE' | 'LIVE' | 'VOD' | 'REPORT' | 'BLOG' | 'ETC'
  programId?: number
  reportType?: string
  tag?: string
  title?: string
  url?: string
  thumbnail?: string
}
```

---

## 7. 사용자 화면 구성

```
CurationScreen
├── CurationStickyNav          # 스티키 네비게이션 (Form / Comparison / FAQ)
├── CurationHero               # Hero 배너
│
├── [폼 영역]
│   ├── CurationStepper        # 4단계 진행 표시
│   ├── PersonaSelector        # Step 0: 페르소나 선택
│   ├── QuestionStep           # Step 1~2: 질문 답변
│   └── ResultSection          # Step 3: 추천 결과
│       ├── DesktopRecommendationCard (Primary)
│       └── DesktopRecommendationCard (Secondary)
│
├── ChallengeCompareSection    # 챌린지 비교 섹션
│   ├── ChallengeCard (x7)     # 7개 챌린지 카드 그리드
│   ├── CompareResultCard      # 비교 결과
│   └── RecommendedComparisons # 자주 비교하는 조합 3가지
│
└── FaqSection                 # FAQ 섹션 (4개 카테고리)
```

---

## 8. 관리자 화면 기능

| 페이지 | 기능 |
|--------|------|
| **List** | 생성된 큐레이션 목록 (위치/제목/기간/노출여부), 개별 노출 토글, 수정/삭제 |
| **Create** | 위치 선택 (BANNER/REVIEW/BLOG), 기본정보, 아이템 추가, 노출설정 |
| **Edit** | 기존 큐레이션 수정 (Create와 동일 구조) |

---

## 9. 설계 특징

- **도메인 분리**: 사용자 큐레이션 vs 관리자 큐레이션 명확 분리
- **컴포넌트 계층**: Screen -> Section -> Card -> UI
- **반응형**: 데스크톱/모바일 별도 컴포넌트 (PersonaSelector, QuestionStep, RecommendationCard)
- **상태 관리**: React Hook Form + 커스텀 훅
- **정적 데이터**: personas, questions, programs, comparisons, faqs 모두 정적 파일로 관리
- **API 연동**: React Query + Axios
- **스크롤 최적화**: requestAnimationFrame 활용
- **SEO**: 메타데이터 설정, canonical URL
