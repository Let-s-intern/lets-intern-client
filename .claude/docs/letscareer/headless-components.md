# 헤드리스 컴포넌트 패턴

로직(상태·이펙트·접근성)과 디자인(마크업·스타일)을 분리해 공용 프리미티브를 만드는 방법과, 코드베이스에 이미 있는 참고 구현을 정리한다. 실제로 컴포넌트를 만들거나 공용화 판단을 할 때는 `headless-component` 스킬을 따르고, 이 문서는 그 근거가 되는 코드 사례집으로 쓴다.

관련 문서: [`design-system.md`](./design-system.md)(색상·타이포·라운드 토큰), [`packages/ui.md`](./packages/ui.md), [`packages/hooks.md`](./packages/hooks.md). 배치 규칙은 folder-structure 스킬.

## 3계층 모델

| 계층 | 책임 | 위치 |
|---|---|---|
| 헤드리스 로직 | 상태·이펙트·접근성 배선. 마크업·색상 없음 | `packages/hooks`, `packages/ui/<name>/use*.ts` |
| 디자인 전용 | controlled props로 렌더만. 동작 없음 | `packages/ui` |
| 조합 | 로직+디자인을 실제 데이터에 연결 | `domain/{d}/` |

전부 만들 필요는 없다. 필요한 층만 만든다. 디자인 전용 컴포넌트 하나로 충분한 경우(예: `CategoryTabs`)도 많다.

## 코드베이스 참고 구현

### 좋은 예 — 디자인 전용
`packages/ui/src/CategoryTabs/index.tsx`
- controlled 밑줄 탭(`options`/`selected`/`onChange`). 스크롤·페치 같은 동작 없음.
- 제네릭 `<Value extends string>` 으로 값 유니온을 타입 안전하게 받는다.
- 인디케이터 위치만 `ResizeObserver`로 계산 — 순수 표현 관심사.
- 재사용성이 높아 "모집중/모집종료" 같은 필터 탭에 그대로 쓸 수 있다.

### 좋은 예 — 헤드리스 훅
`apps/web/src/domain/membership/ui/useCarouselDots.ts`
- `IntersectionObserver`로 가로 scroll-snap 캐러셀의 active 슬라이드를 추적하고 `scrollToSlide(i)` 를 제공한다.
- 마크업·색상이 없어 어떤 도트 디자인에도 붙는다. 도메인에 있지만 성격은 완전히 헤드리스 → `packages/hooks` 승격 후보.
- `prefers-reduced-motion` 을 존중하는 등 접근성 배려가 로직 계층에 들어가 있다.

### 안티패턴 — 로직·디자인 융합
`apps/web/src/common/dropdown/FaqDropdown.tsx`
- 토글 `useState(isOpen)` + 보더·타이포 디자인 + 아이콘 회전이 한 컴포넌트에 섞여 있다.
- `Faq` 스키마 타입에 강결합돼 다른 데이터로 재사용 불가.
- 같은 FAQ 토글이 최소 4곳(`common/dropdown/FaqDropdown`, `domain/faq/FaqSection`, `domain/curation/faq/FaqSection`, `program-detail/regacy/.../FAQTab`)에 중복 → 헤드리스 아코디언으로 분리하면 해소되는 대표 사례.

### 중복·분열 사례 — 섹션 앵커 5곳
클릭 시 섹션으로 스크롤 이동하고 active를 추적하는 앵커가 5곳에 거의 복붙돼 있다.
- `domain/report/ui/ReportNavigation.tsx`, `domain/program/ProgramDetailNavigation.tsx`, `…/portfolio-view/ProgramChallengePortfolioDetailNavigation.tsx`, `…/challenge-view/ChallengeTabNavigation.tsx`, `domain/curation/nav/CurationStickyNav.tsx`
- 공유되는 상태는 사실상 `activeId` 하나인데, 스크롤 이동만 세 방식(`scrollBy(rect.top)` / `scrollBy(rect.top-70)` / `scrollIntoView`+CSS `scroll-mt-*`)으로 분열돼 있다.
- 색상·sticky 위치가 전부 인라인 `style` 로 하드코딩돼 재사용을 막는다.
- 교훈: `scrollIntoView` + 소비 측 `scroll-mt-*` 가 가장 이식성이 높다. offset을 JS 상수로 박지 말 것. active 추적은 옵션(`rootMargin`/`threshold`)을 파라미터화한 공용 훅으로 뽑을 수 있다.
- `ChallengeTabNavigation` 은 `Tab` 표현 컴포넌트를 분리해 그나마 헤드리스에 가깝고, `CurationStickyNav` 는 스크롤 이동을 부모 콜백으로 분리해 로직/뷰 분리의 참고가 된다.

## 이미 있는 공용 훅 (packages/hooks)

새로 만들기 전에 재사용 여부를 확인한다.
- `useScrollDirection`, `useSectionObserver`(GA 계측), `useControlScroll`, `useScrollShadow`, `useMounted` 등.
- 이 목록에 없는 재사용 로직만 신규/승격 대상이다.

## 구현 기준 요약

1. 스타일은 `className`/토큰 prop으로 주입. 색상 하드코딩 금지.
2. 스크롤 offset은 CSS `scroll-mt-*` 로. JS 상수 금지.
3. 상호작용 프리미티브는 aria·키보드를 로직 계층에서 배선.
4. 값 유니온은 `<Value extends string>` 제네릭.
5. 구조가 있으면 컴파운드(Context로 상태 공유).
6. controlled(`value`/`onChange`) 우선, 필요 시 uncontrolled.
7. 상태·이펙트가 있으면 `'use client'`.
8. `packages/*/src/index.ts` 에 export.
9. `packages/ui` 신규 컴포넌트는 Storybook.
10. 기존 중복 구현은 무수정 보존, 이관은 후속.
