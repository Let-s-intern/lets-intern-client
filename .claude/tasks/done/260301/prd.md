# PRD: 유저 맞춤형 챌린지 큐레이션 페이지 — 모바일 미구현 영역 (LC-2835)

> **브랜치**: `LC-2835-유저-맞춤형-챌린지-큐레이션-페이지-개발`
> **라우트**: `/curation`
> **업데이트**: 2026-02-28

---

## 현재 구현 상태

| 영역 | 상태 | 비고 |
|------|------|------|
| Hero | ⚠️ | 모바일 패딩 `px-[120px]` 고정 → 깨짐 |
| Sticky Nav | ✅ | |
| 큐레이션 플로우 (데스크톱) | ✅ | |
| 큐레이션 플로우 (모바일) | ⚠️ | `MobileRecommendationCard` 스타일 불일치 |
| 챌린지 비교 (데스크톱) | ✅ | |
| 챌린지 비교 (모바일) | ❌ | 세로 리스트 + 플로팅 버튼 미구현 |
| 모바일 비교 결과 뷰 | ❌ | 전체화면 뷰 미구현 |
| FAQ | ✅ | |

---

## Task 1. Hero 모바일 반응형 패딩 수정

**파일**: `src/domain/curation/hero/CurationHero.tsx`

**문제**: 컨테이너 패딩이 `px-[120px]` 하드코딩 → 모바일에서 좌우 공간 없음

**수정**:
```tsx
// Before
<div className="relative flex h-[22rem] w-full flex-row items-center justify-between overflow-hidden px-[120px]">

// After
<div className="relative flex h-[22rem] w-full flex-row items-center justify-between overflow-hidden px-6 md:px-10 lg:px-[120px]">
```

---

## Task 2. MobileRecommendationCard 스타일 DesktopRecommendationCard 기준으로 맞추기

**파일**: `src/domain/curation/flow/MobileRecommendationCard.tsx`

**문제**: 데스크톱 카드(`DesktopRecommendationCard`)와 동일한 정보를 보여줘야 하는데 스타일 및 구조가 다름.

**참고 패턴**: `src/domain/curation/flow/DesktopRecommendationCard.tsx` — 모바일은 같은 정보를 `w-full flex-col`로 동일하게 표현.

**목표 구조** (DesktopRecommendationCard와 동일 정보, 모바일 너비 대응):
```tsx
// DesktopRecommendationCard의 구조를 그대로 유지하되 w-full로
<div className="flex w-full flex-col gap-2.5 rounded-[20px] border border-[#CFCFCF] bg-[#FAFAFA] px-6 py-7">
  {/* 1. 프로그램명 + 추천 뱃지 + 부제목 */}
  <div className="flex items-center justify-between">
    <span className="text-base font-bold text-black">{program.title}</span>
    {isPrimary && (
      <div className="rounded-[20px] bg-indigo-500 px-3 py-1">
        <span className="text-xs font-bold text-gray-50">추천</span>
      </div>
    )}
  </div>
  <span className="text-sm text-black">{program.subtitle}</span>

  {/* 2. 추천 대상 / 기간 / 피드백 — 구분선 포함 행 테이블 */}
  {/* DesktopRecommendationCard와 동일한 InfoRow 구조 */}
  <div className="flex flex-col gap-3 py-3">
    <div className="flex items-center gap-6">
      <span className="w-16 shrink-0 text-sm font-semibold text-black">추천 대상</span>
      <span className="text-sm text-black">{program.target}</span>
    </div>
    <div className="h-px bg-neutral-200" />
    <div className="flex items-center gap-6">
      <span className="w-16 shrink-0 text-sm font-semibold text-black">기간</span>
      <span className="text-sm text-black">{program.duration}</span>
    </div>
    <div className="h-px bg-neutral-200" />
    <div className="flex items-start gap-6">
      <span className="w-16 shrink-0 text-sm font-semibold text-black">피드백</span>
      <span className="text-sm text-black">{program.feedback}</span>
    </div>
    <div className="h-px bg-neutral-200" />

    {/* 3. 이 조합 추천해요! 박스 — DesktopRecommendationCard와 동일 */}
    <div className="flex flex-col gap-2.5 rounded-lg bg-indigo-50 p-3">
      <span className="text-xs font-bold text-indigo-600">이 조합 추천해요!</span>
      <span className="text-sm font-medium text-black">{recommendation.reason}</span>
    </div>

    {/* 4. 추천 플랜 박스 */}
    <div className="flex flex-col gap-2.5 rounded-lg bg-white p-3">
      <span className="text-xs font-bold text-zinc-400">추천 플랜</span>
      <div className="flex items-center gap-2.5">
        <span className="text-sm font-bold text-black">{plan.name}</span>
        <span className="text-sm text-black">{plan.price}{plan.note ? ` · ${plan.note}` : ''}</span>
      </div>
    </div>
    <div className="h-px bg-neutral-200" />

    {/* 5. 결과물 */}
    <div className="flex items-start gap-6">
      <span className="w-16 shrink-0 text-sm font-semibold text-black">결과물</span>
      <span className="text-sm text-black">{program.deliverable}</span>
    </div>
  </div>

  {/* 6. CTA — DesktopRecommendationCard와 동일 패턴 */}
  <a href={`/program/challenge/${program.id}`}
     className="flex h-11 items-center justify-center rounded-lg bg-indigo-500">
    <span className="text-sm font-bold text-indigo-50">[{program.title}] 바로가기</span>
  </a>
  {showExtraButton && (
    <button onClick={onExtraClick}
            className="flex h-11 items-center justify-center rounded-lg bg-neutral-200">
      <span className="text-sm font-medium text-zinc-500">+ 추가 추천 받기</span>
    </button>
  )}
</div>
```

**Props 추가**: `showExtraButton?: boolean`, `onExtraClick?: () => void`

**ResultSection.tsx 수정**: 모바일 카드에도 `showExtraButton` / `onExtraClick` 전달

---

## Task 3. 모바일 챌린지 비교 — 세로 리스트 + 플로팅 버튼

**파일**: `src/domain/curation/challenge-comparison/ChallengeCompareSection.tsx`

### 3-1. 모바일 카드 레이아웃 (세로 1열)

**참고 패턴**:
- 가로 배치: `src/domain/curation/challenge-comparison/ChallengeCard.tsx` (기존 카드)
- 세로 리스트 아이템: `src/domain/report/ReportCard.tsx` 등 가로 썸네일+텍스트 패턴

ChallengeCompareSection에 모바일 분기 추가:
```tsx
{/* 데스크톱: 기존 4+3 그리드 (변경 없음) */}
<div className="hidden md:flex flex-col gap-0">
  {/* 기존 Row 1, Row 2 코드 유지 */}
</div>

{/* 모바일: 세로 1열 리스트 */}
<div className="flex flex-col gap-3 md:hidden">
  {CHALLENGE_COMPARISON.map((challenge) => (
    <MobileChallengeCard
      key={challenge.programId}
      challenge={challenge}
      inCart={isInCart(challenge.programId)}
      isFull={isFull}
      onToggle={toggleCartItem}
      onRemove={removeFromCart}
    />
  ))}
</div>
```

**MobileChallengeCard 구조** (가로 배치: 썸네일 좌 + 텍스트/버튼 우):
```tsx
// 참고: src/domain/curation/challenge-comparison/ChallengeCard.tsx 기반
// 모바일에서는 썸네일을 왼쪽에 고정 크기로, 텍스트+버튼을 오른쪽에 배치
<div className="flex w-full items-center gap-4 rounded-lg border border-neutral-200 p-4">
  {/* 썸네일: 고정 크기 */}
  <div className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-[7px] p-2"
       style={{ backgroundColor: bgColor }}>
    <span className="text-xs font-bold text-white">{program.title}</span>
  </div>

  {/* 텍스트 + 버튼 */}
  <div className="flex flex-1 flex-col gap-2 min-w-0">
    <span className="text-sm font-bold text-[#27272d] line-clamp-1">{program.title}</span>
    <div className="flex items-start gap-1">
      <CheckIcon className="mt-0.5 shrink-0 text-[#7a7d84]" />
      <span className="text-xs text-[#27272d] line-clamp-1">{challenge.target}</span>
    </div>

    {/* 비교함 담기 버튼 */}
    <div className="flex gap-1">
      {inCart ? (
        <>
          <button onClick={() => onToggle(challenge.programId)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#dbddfd] px-2 py-2">
            <CheckIcon className="text-[#5f66f6]" />
            <span className="text-xs font-semibold text-[#5f66f6]">비교함 담기</span>
          </button>
          <button onClick={() => onRemove(challenge.programId)}
                  className="flex w-10 items-center justify-center rounded-lg bg-[#e7e7e7]">
            <CloseIcon />
          </button>
        </>
      ) : (
        <button onClick={() => onToggle(challenge.programId)}
                disabled={isFull}
                className="flex w-full items-center justify-center rounded-lg bg-[#e7e7e7] px-2 py-2 disabled:opacity-50">
          <span className="text-xs font-semibold text-[#5c5f66]">비교함 담기</span>
        </button>
      )}
    </div>
  </div>
</div>
```

**새 파일**: `src/domain/curation/challenge-comparison/MobileChallengeCard.tsx`

### 3-2. 모바일 플로팅 비교하기 버튼

**참고 패턴**: `src/common/button/ApplyCTA.tsx` MobileCTA → `safe-area-bottom fixed left-0 right-0 z-40 backdrop-blur`

```tsx
{/* 모바일 전용 플로팅 버튼 — canCompare 시 노출 */}
{canCompare && (
  <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-safe md:hidden">
    <div className="pb-4 backdrop-blur-sm">
      <button
        type="button"
        onClick={handleCompareMobile}  // 모바일 뷰 열기
        className="flex w-full items-center justify-center rounded-lg bg-[#5f66f6] py-4"
      >
        <span className="text-base font-semibold text-white">
          프로그램 {cartItems.length}개 비교하기
        </span>
      </button>
    </div>
  </div>
)}
```

기존 하단 비교 버튼 블록은 `hidden md:flex`로 모바일에서 숨김.

---

## Task 4. 모바일 비교 결과 전체화면 뷰 (MobileCompareView)

**새 파일**: `src/domain/curation/challenge-comparison/MobileCompareView.tsx`

**참고 패턴**: `src/domain/challenge/MobileReviewModal.tsx`
```tsx
// MobileReviewModal 구조:
<div className="fixed inset-x-0 top-0 z-50 flex h-screen flex-col
                gap-8 overflow-auto bg-white px-5 py-12"
     role="dialog" aria-modal="true">
```

**MobileCompareView 구조**:
```tsx
const MobileCompareView = ({ programIds, onClose }) => (
  <div className="fixed inset-x-0 top-0 z-50 flex h-screen flex-col
                  overflow-y-auto bg-white">
    {/* 헤더 — BackHeader 공통 컴포넌트 활용 */}
    {/* 참고: src/common/header/BackHeader.tsx */}
    <div className="sticky top-0 z-10 flex items-center gap-3
                    border-b border-neutral-200 bg-white px-5 py-4">
      <button onClick={onClose} className="p-1">
        <ChevronLeft className="h-5 w-5 text-neutral-0" />
      </button>
      <span className="text-base font-bold text-neutral-0">비교함</span>
    </div>

    {/* 동적 제목: "자소서 vs 마케팅" */}
    <div className="px-5 pt-6 pb-4">
      <h2 className="text-xl font-bold text-[#27272d]">{title}</h2>
    </div>

    {/* 프로그램 썸네일 + 바로가기 — 좌우 2분할 */}
    <div className="flex gap-3 px-5 pb-6">
      {programs.map((program) => (
        <div key={program.id} className="flex flex-1 flex-col gap-3">
          <div className="aspect-video w-full rounded-[7px] p-3"
               style={{ backgroundColor: CARD_COLORS[program.id as ProgramId] }}>
            <span className="text-sm font-bold text-white">{program.title}</span>
          </div>
          <span className="text-sm font-bold text-[#27272d] line-clamp-2">{program.title}</span>
          <a href={`/program/challenge/${program.id}`}
             className="flex items-center justify-center rounded-lg bg-[#f3f3f3] py-2.5">
            <span className="text-xs font-semibold text-[#5c5f66]">바로가기</span>
          </a>
        </div>
      ))}
    </div>

    {/* 비교 항목 테이블 */}
    {/* 참고: src/domain/curation/challenge-comparison/CompareResultCard.tsx InfoRow */}
    {/* 모바일은 라벨 행(회색 배경)을 위에, 값들을 아래에 2분할로 */}
    <div className="flex flex-col">
      {COMPARE_ROWS.map(({ label, key }) => (
        <div key={label} className="flex flex-col">
          {/* 라벨 행 */}
          <div className="bg-neutral-90 px-5 py-3">
            <span className="text-xs font-semibold text-[#5c5f66]">{label}</span>
          </div>
          {/* 값 행 — 2분할 */}
          <div className="flex gap-3 border-b border-neutral-200 px-5 py-4">
            {comparisons.map((c, i) => (
              <div key={i} className="flex-1 min-w-0">
                <span className="whitespace-pre-line text-sm text-[#27272d]">
                  {c[key]}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
```

**ChallengeCompareSection에 연결**:
```tsx
const [isMobileViewOpen, setIsMobileViewOpen] = useState(false);

// handleCompareMobile: 플로팅 버튼 클릭 시 모바일 뷰 열기
const handleCompareMobile = useCallback(() => {
  if (!canCompare) return;
  setCompareTargets([...cartItems]);
  setIsMobileViewOpen(true);
}, [canCompare, cartItems]);

// 렌더:
{isMobileViewOpen && (
  <div className="md:hidden">
    <MobileCompareView
      programIds={compareTargets}
      onClose={() => setIsMobileViewOpen(false)}
    />
  </div>
)}
```

---

## 파일 영향 범위

```
수정:
  src/domain/curation/hero/CurationHero.tsx                              (Task 1)
  src/domain/curation/flow/MobileRecommendationCard.tsx                  (Task 2)
  src/domain/curation/flow/ResultSection.tsx                             (Task 2 - props 전달)
  src/domain/curation/challenge-comparison/ChallengeCompareSection.tsx   (Task 3, 4)

신규:
  src/domain/curation/challenge-comparison/MobileChallengeCard.tsx       (Task 3)
  src/domain/curation/challenge-comparison/MobileCompareView.tsx         (Task 4)
```

---

## 참고한 기존 패턴

| 패턴 | 참고 파일 |
|------|----------|
| 전체화면 모바일 뷰 | `src/domain/challenge/MobileReviewModal.tsx` |
| 플로팅 하단 버튼 | `src/common/button/ApplyCTA.tsx` (MobileCTA) |
| 뒤로가기 헤더 | `src/common/header/BackHeader.tsx` |
| 비교 테이블 행 | `src/domain/curation/challenge-comparison/CompareResultCard.tsx` (InfoRow) |
| 모바일/데스크톱 분기 | `md:hidden` / `hidden md:flex` (프로젝트 전반) |
| 카드 색상 상수 | `src/domain/curation/challenge-comparison/ChallengeCard.tsx` (CARD_COLORS) |

---

## 완료 기준

- [x] Hero가 모바일(320px~767px)에서 레이아웃 깨지지 않음
- [x] 모바일 추천 결과 카드가 DesktopRecommendationCard와 동일한 정보/구조
- [x] 모바일 챌린지 비교 섹션이 세로 1열 리스트로 표시
- [x] 비교함에 2개 이상 담으면 하단 플로팅 버튼 등장
- [x] 플로팅 버튼 클릭 시 MobileCompareView 전체화면 열림
- [x] MobileCompareView에서 뒤로가기 시 다시 비교 섹션으로 복귀
- [x] 데스크톱 기존 동작 회귀 없음
