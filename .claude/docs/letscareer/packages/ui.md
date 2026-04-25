# `@letscareer/ui`

3개 앱이 공유하는 UI 컴포넌트.

## 현재 상태

작은 패키지. `Link`, `Image` 두 가지만.

```
packages/ui/src/
├── Link/
├── Image/
└── index.ts
```

## Export 표면

```ts
export { Link } from './Link';
export { Image } from './Image';
```

## 왜 이렇게 작은가

대부분의 공용 UI 컴포넌트(Button·Modal·Layout 등)는 *프레임워크 의존*(Next.js의 `next/link`, `next/image`나 React Router의 `Link`)이라 단일 패키지로 통합하기 까다롭다. 각 앱 안의 `src/common/` 에 자체 구현을 두고 있다.

`@letscareer/ui`의 `Link`/`Image`는 *프레임워크별 처리를 추상화한 래퍼* — 같은 import로 web에선 `next/link`, admin/mentor에선 React Router `Link`로 분기.

## 사용 예

```ts
import { Link, Image } from '@letscareer/ui';

<Link to="/about">About</Link>
<Image src="/logo.png" width={120} height={40} alt="Logo" />
```

## 앱 내부 공용 컴포넌트

- `apps/web/src/common/` — Button·Modal·Input·Layout 등 web 전용 → [`../apps/web/components.md`](../apps/web/components.md)
- `apps/admin/src/common/` — 어드민 전용 (MUI 의존)
- `apps/mentor/src/common/` — 멘토 전용
