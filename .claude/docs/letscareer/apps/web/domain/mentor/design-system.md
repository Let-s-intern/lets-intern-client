# Mentor Domain Design System

> 멘토 마이페이지 전체 UI에 적용되는 디자인 시스템 기준 문서

최종 업데이트: 2026-04-24

## 앱 위치 (2026-04-24 분리 완료)

멘토 마이페이지는 독립 앱으로 분리되었습니다.

- **앱 경로**: `apps/mentor/` (`@letscareer/mentor`)
- **번들러**: Vite + React Router v6 (`next/*` import 없음)
- **배포**: `mentor.letscareer.co.kr` (prod) / `test-mentor.letscareer.co.kr` (preview)
- **개발 포트**: 3002
- **라우팅**: react-router-dom v6. 기존 `/mentor/*` prefix 제거 (예: `/mentor/profile` → `/profile`)
- **web → mentor 이동**: `apps/web/src/middleware.ts`가 `/mentor/*` 요청을 mentor 서브도메인으로 308 리다이렉트

---

---

## 1. Color System

### Primary Colors (프로젝트 커스텀 토큰)

> **중요**: Tailwind 기본 색상(violet, indigo 등)을 사용하지 않는다. 반드시 프로젝트 커스텀 primary 토큰을 사용한다.

| Token | Tailwind Class | Hex | Usage |
|-------|---------------|-----|-------|
| Primary | `primary` | #4D55F5 | 주요 버튼 배경, 강조 텍스트 |
| Primary Hover | `primary-hover` | #474EE8 | 버튼 호버 상태 |
| Primary Dark | `primary-dark` | #4138A3 | 진한 강조 텍스트 |
| Primary Light | `primary-light` | #757BFF | 밝은 강조 |
| Primary XLight | `primary-xlight` | #A9C1FF | 매우 밝은 강조 |
| Primary 5 | `primary-5` | #F5F6FF | 연한 배경 (헤더 등) |
| Primary 10 | `primary-10` | #EDEEFE | 강조 배경, 뱃지 배경 |
| Primary 15 | `primary-15` | #E3E5FB | 선택 상태 배경 |
| Primary 20 | `primary-20` | #DBDDFD | 호버 배경 |
| Primary 80 | `primary-80` | #7177F7 | 중간 강조 |
| Primary 90 | `primary-90` | #5F66F6 | 중간 강조 |

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
| 회차 뱃지 | `primary-10` | `primary-dark` |

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
bg-primary text-white rounded-lg hover:bg-primary-hover
disabled:cursor-not-allowed disabled:opacity-50
```

### Secondary / Outline Button
```
border border-primary text-primary rounded-lg hover:bg-primary-5
disabled:cursor-not-allowed disabled:opacity-50
```

### Accent Action Button (e.g., "피드백 작성")
```
bg-primary text-white rounded-lg hover:bg-primary-hover
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
