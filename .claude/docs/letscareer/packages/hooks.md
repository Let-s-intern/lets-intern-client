# `@letscareer/hooks`

3개 앱이 공유하는 React 훅. 라이프사이클·스크롤·로딩·React Query·도메인 훅 등.

## 위치

```
packages/hooks/src/
├── useMounted.ts                  # 마운트 여부
├── useRunOnce.ts                  # 1회만 실행
├── useScrollDirection.ts          # 스크롤 방향 감지
├── useScrollFade.ts               # 스크롤 페이드 효과
├── useScrollShadow.ts             # 스크롤 그림자
├── useActiveLink.ts               # 현재 활성 링크
├── useValidateUrl.ts              # URL 검증
├── useBeforeUnloadWarning.ts      # 페이지 이탈 경고
├── useChangeDetectionHook.ts      # 변경 감지
├── useControlScroll.tsx           # 스크롤 제어
├── useCounter.ts                  # 카운터
├── useDecimalCounter.ts           # 소수점 카운터
├── useGoogleAnalytics.ts          # GA 이벤트
├── useInstagramAlert.tsx          # 인스타 외부 브라우저 안내
├── useLoading.tsx                 # 전역 로딩
├── useSectionObserver.tsx         # 섹션 관찰자
├── useInvalidateQueries.ts        # React Query 무효화
├── useCareerModals.ts             # 커리어 모달들
├── useReadItems.ts                # 읽음 표시 (notices·guides 포함)
└── index.ts
```

## Export 표면

```ts
export { default as useRunOnce } from './useRunOnce';
export { default as useMounted } from './useMounted';
export { default as useCounter } from './useCounter';
export { default as useDecimalCounter } from './useDecimalCounter';
export { default as useBeforeUnloadWarning } from './useBeforeUnloadWarning';
export { default as useScrollFade } from './useScrollFade';
export { default as useScrollShadow } from './useScrollShadow';
export { default as useScrollDirection } from './useScrollDirection';
export { default as useActiveLink } from './useActiveLink';
export { default as useGoogleAnalytics } from './useGoogleAnalytics';
export { default as useInstagramAlert } from './useInstagramAlert';
export { default as useLoading } from './useLoading';
export { default as useSectionObserver } from './useSectionObserver';
export { default as useValidateUrl } from './useValidateUrl';
export { default as useInvalidateQueries } from './useInvalidateQueries';
export { useCareerModals } from './useCareerModals';
export { useChangeDetection } from './useChangeDetectionHook';
export { useControlScroll } from './useControlScroll';
export { useReadItems, useReadNotices, useReadGuides } from './useReadItems';
```

## 사용 예

```ts
import { useMounted, useScrollDirection, useInvalidateQueries } from '@letscareer/hooks';

function Header() {
  const mounted = useMounted();
  const direction = useScrollDirection();
  const invalidate = useInvalidateQueries();

  if (!mounted) return null;
  return <header className={direction === 'DOWN' ? 'hidden' : 'block'} />;
}
```

## 앱 로컬 훅과의 분리

도메인 로직(`useChallengeProgram`, `useDeleteProgram` 등)은 *공유되지 않으므로* `apps/<app>/src/hooks/`에 둔다. apps/web 훅 카탈로그: [`../apps/web/hooks.md`](../apps/web/hooks.md).

## 관련

- [`../apps/web/hooks.md`](../apps/web/hooks.md) — apps/web의 도메인 훅
- [`../architecture.md`](../architecture.md) — 클라이언트 상태 관리(zustand + React Query) 두 축
