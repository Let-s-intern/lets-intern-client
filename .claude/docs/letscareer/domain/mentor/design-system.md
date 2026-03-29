# Mentor Domain Design System

> 멘토 마이페이지 전체 UI에 적용되는 디자인 시스템 기준 문서

---

## 1. Color System

### Primary Colors (Violet)

| Token | Tailwind Class | Hex | Usage |
|-------|---------------|-----|-------|
| Primary | `violet-600` | #7c3aed | 주요 버튼 배경, 강조 텍스트 |
| Primary Light | `violet-100` ~ `violet-200` | #ede9fe ~ #ddd6fe | 강조 배경, 호버 배경, 선택 상태 |
| Primary Hover | `violet-700` | #6d28d9 | 버튼 호버 상태 |

### Neutral Colors

| Token | Tailwind Class | Usage |
|-------|---------------|-------|
| Card Background | `white` | 카드 컴포넌트 배경 |
| Page Background | `gray-50` | 페이지 전체 배경 |
| Border | `gray-200` | 카드/섹션 테두리 |

### Status Colors

| Status | Tailwind Class | Usage |
|--------|---------------|-------|
| Completed | `green-500` / `green-100 + green-700` | 피드백 완료 |
| In Progress | `blue-500` / `blue-100 + blue-700` | 피드백 진행 중 |
| Waiting | `gray-400` / `gray-100 + gray-500` | 대기 상태 |
| Not Submitted | `red-500` | 미제출 상태 |
| Confirmed | `blue-100 + blue-700` | 확인 완료 |

### Challenge Tag Colors

| Status | Background | Text |
|--------|-----------|------|
| PREV (예정) | `yellow-100` | `yellow-700` |
| PROCEEDING (진행중) | `green-100` | `green-700` |
| POST (종료) | `gray-100` | `gray-500` |

### Mission Badge Colors

| Element | Background | Text |
|---------|-----------|------|
| 회차 뱃지 | `violet-100` | `violet-700` |

---

## 2. Border Radius (Round)

| Component | Tailwind Class | Value |
|-----------|---------------|-------|
| Card | `rounded-xl` | 12px |
| Button | `rounded-lg` | 8px |
| Badge / Tag | `rounded-full` | 9999px |
| Modal | `rounded-2xl` | 16px |
| Summary Card | `rounded-xl` | 12px |

---

## 3. Spacing & Sizing

### Card Padding

| Component | Padding |
|-----------|---------|
| Challenge Card (content area) | `p-4` |
| Feedback Card | `p-6` |
| Mission Row | `p-4` |
| Summary Card | `p-4` (mobile) / `p-6` (desktop) |

### Badge Sizing

| Component | Size |
|-----------|------|
| Mission 회차 뱃지 | `w-8 h-8` (고정) |
| Status Badge | auto (px-2 py-0.5) |

---

## 4. Typography

| Element | Size | Weight |
|---------|------|--------|
| Page Title (h1) | `text-xl` | `font-bold` or `font-semibold` |
| Card Title (h2) | `text-lg` | `font-bold` |
| Section Title | `text-base` | `font-semibold` |
| Body Text | `text-sm` | `font-normal` |
| Badge Text | `text-xs` | `font-medium` |
| Caption | `text-xs` | `font-normal` |

---

## 5. Button Styles

### Primary Button
```
bg-violet-600 text-white rounded-lg hover:bg-violet-700
disabled:cursor-not-allowed disabled:opacity-50
```

### Secondary / Outline Button
```
border border-violet-600 text-violet-600 rounded-lg hover:bg-violet-50
disabled:cursor-not-allowed disabled:opacity-50
```

### Accent Action Button (e.g., "피드백 작성")
```
bg-violet-600 text-white rounded-lg hover:bg-violet-700
```

---

## 6. Component Patterns

### Card Component
```
rounded-xl border border-gray-200 bg-white p-4~p-6
```

### Badge Component
```
rounded-full px-2 py-0.5 text-xs font-medium
```

### Modal
```
rounded-2xl (desktop: rounded-3xl)
```
