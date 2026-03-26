# 챌린지 상세페이지 도메인

> 챌린지 프로그램의 상세 정보(소개, 커리큘럼, 가격, 신청)를 보여주는 페이지

## URL 구조

```
/program/challenge/{id}            → /program/challenge/{id}/{title} 리다이렉트
/program/challenge/{id}/{title}    → 실제 상세페이지 (SEO용 title slug)
```

---

## 뷰 타입 분기

하나의 라우트에서 `challengeType`에 따라 다른 뷰 컴포넌트를 렌더링한다.

| 조건 | 뷰 컴포넌트 | 사용 챌린지 |
|---|---|---|
| `MARKETING` (ID > 75) | `ChallengeMarketingView` | 마케팅 서류 완성 챌린지 |
| `PORTFOLIO` (최근 startDate) | `ChallengePortfolioView` | 포트폴리오 2주 완성 챌린지 |
| `HR` | `ChallengeHrView` | HR 서류 완성 챌린지 |
| 그 외 (기본) | `ChallengeView` | 경험정리, 이력서, 자기소개서, 대기업 등 |

### 라우트 엔트리

```
src/app/(user)/program/challenge/[id]/page.tsx          # 리다이렉트
src/app/(user)/program/challenge/[id]/[title]/page.tsx  # 메인 (뷰 분기)
```

---

## 파일 구조

```
src/domain/program/challenge/
├── ChallengeView.tsx                  # 기본 뷰 (가장 범용)
├── ChallengePortfolioView.tsx         # 포트폴리오 전용 뷰
├── ChallengeMarketingView.tsx         # 마케팅 전용 뷰
├── ChallengeHrView.tsx                # HR 전용 뷰
├── ChallengeCTAButtons.tsx            # 하단 고정 CTA (신청하기 버튼)
│
├── challenge-view/                    # ChallengeView 하위 섹션
│   ├── ChallengeBasicInfo.tsx         # 상단 기본 정보 (제목, 일정, 가격 요약)
│   ├── ChallengePricePlanSection.tsx  # ⭐ 가격 플랜 카드 (베이직/스탠다드/프리미엄)
│   ├── ChallengePointView.tsx         # 핵심 포인트
│   ├── ChallengeFeedback.tsx          # 피드백 안내 배너
│   ├── ChallengeCheckList.tsx         # 체크리스트
│   ├── ChallengeResult.tsx            # 성과 섹션
│   ├── ChallengeSummarySection.tsx    # 요약
│   ├── ChallengeDifferent.tsx         # 차별점
│   └── ... (20+ 컴포넌트)
│
├── marketing-view/                    # ChallengeMarketingView 하위 섹션
│   ├── MarketingPricingSection.tsx    # ⭐ 마케팅 전용 가격 섹션 (레이아웃 다름)
│   └── ... (16 컴포넌트)
│
├── portfolio-view/                    # ChallengePortfolioView 하위 섹션
│   ├── PortfolioFeedbackInfo.tsx      # 포트폴리오 전용 피드백 옵션 상세
│   ├── PortfolioOneOnOne.tsx          # 1:1 멘토링 안내
│   └── ...
│
├── hr-view/                           # ChallengeHrView 하위 섹션 (최소)
│
└── ui/                                # 챌린지 공통 UI 컴포넌트
```

---

## 가격 플랜 구조

### 플랜 타입

```typescript
type ChallengePricePlan = 'LIGHT' | 'BASIC' | 'STANDARD' | 'PREMIUM';
```

| 플랜 | 포함 내용 | 비고 |
|---|---|---|
| LIGHT | 콘텐츠만 | 일부 챌린지에만 존재 |
| BASIC | 콘텐츠 + 템플릿 | 기본 |
| STANDARD | BASIC + 피드백 1회 | 피드백 멘토링 포함 |
| PREMIUM | BASIC + 피드백 2회+ | 피드백 멘토링 포함 |

### 가격 데이터 (API)

```typescript
// src/schema.ts
interface ChallengePriceInfo {
  title?: string;                    // "베이직", "스탠다드" 등
  description?: string;              // 옵션 설명 텍스트
  priceId: number;                   // 결제용 ID
  price?: number;                    // 정가
  discount?: number;                 // 할인액
  refund?: number;                   // 보증금
  deadline?: string;                 // 마감일
  challengePricePlanType: ChallengePricePlan;
  challengeOptionList: ChallengeOption[];
}
```

### 가격 플랜 렌더링

| 뷰 | 가격 컴포넌트 | 조건 |
|---|---|---|
| ChallengeView | `ChallengePricePlanSection` | `priceInfo.length >= 2` |
| ChallengePortfolioView | `ChallengePricePlanSection` | `priceInfo.length >= 2` |
| ChallengeMarketingView | `MarketingPricingSection` | 항상 |
| ChallengeHrView | 없음 | 가격 섹션 미사용 |

---

## 신청 플로우

```
1. 하단 "신청하기" 버튼 클릭 (ChallengeCTAButtons)
2. 로그인 확인 → 미로그인 시 /login 이동
3. PricePlanBottomSheet 오픈
4. 플랜 선택 (RadioGroup: LIGHT/BASIC/STANDARD/PREMIUM)
5. "신청하기" → useProgramStore에 결제 정보 저장 → /payment-input 이동
```

### PricePlanBottomSheet 구조

```
src/domain/program/PricePlanBottomSheet.tsx
```

- Props: `challenge: ChallengeIdPrimitive`, `challengeId: string`, `isOpen`, `onClose`
- 각 플랜을 `OptionFormRadioControlLabel`로 렌더링
- `right` prop에 가격 정보(`PriceView`) 표시
- 선택된 플랜의 총 결제 금액 하단 표시

---

## ChallengeType ↔ 챌린지 매핑

```typescript
// src/schema.ts
type ChallengeType =
  | 'CAREER_START'                  // 이력서 1주 완성
  | 'DOCUMENT_PREPARATION'
  | 'MEETING_PREPARATION'
  | 'ETC'
  | 'PERSONAL_STATEMENT'            // 자기소개서 2주 완성
  | 'PORTFOLIO'                     // 포트폴리오 2주 완성
  | 'PERSONAL_STATEMENT_LARGE_CORP' // 대기업 완성
  | 'MARKETING'                     // 마케팅 서류 완성
  | 'EXPERIENCE_SUMMARY'            // 기필코 경험정리
  | 'HR';                           // HR 서류 완성
```

---

## 색상 시스템

챌린지 타입별 프라이머리 컬러 (가격 카드 배경 등에 사용):

| ChallengeType | Primary | Light |
|---|---|---|
| CAREER_START | `#4D55F5` | `#F3F4FF` |
| PORTFOLIO | `#4A76FF` | `#F0F4FF` |
| PERSONAL_STATEMENT / LARGE_CORP | `#14BCFF` | `#EEFAFF` |
| EXPERIENCE_SUMMARY | `#F26646` | `#FFF6F4` |

정의: `ChallengeView.tsx` → `challengeColors` export

---

## 주요 의존성

| 용도 | 위치 |
|---|---|
| 챌린지 데이터 fetch | `src/api/challenge/challenge.ts` |
| 스키마 타입 | `src/schema.ts` (`ChallengeIdPrimitive`, `ChallengePriceInfo`) |
| 가격 계산 유틸 | `src/utils/getChallengeOptionPriceInfo.ts` |
| 결제 상태 관리 | `src/store/useProgramStore.ts` |
| 공통 컴포넌트 | `src/common/` (ControlLabel, BottomSheet, PriceSummary 등) |
