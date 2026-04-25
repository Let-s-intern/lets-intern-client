# `@letscareer/types`

3개 앱이 공유하는 TypeScript 타입.

## 위치

```
packages/types/src/
├── User.interface.ts
├── Banner.interface.ts
├── common.ts
└── index.ts
```

## 다루는 타입

| 파일 | 타입 |
|---|---|
| `User.interface.ts` | `User` 인터페이스 — 인증·프로필 공통 |
| `Banner.interface.ts` | `Banner` 인터페이스 — 홈·프로모션 배너 |
| `common.ts` | 페이지네이션·정렬·필터 등 공통 타입 |

## 사용 예

```ts
import type { User, Banner } from '@letscareer/types';

interface UserCardProps {
  user: User;
  onSelect?: (user: User) => void;
}
```

## 앱 로컬 타입

각 앱의 도메인 전용 타입은 그 앱 내부에 둔다.

- web: `apps/web/src/types/`, 도메인별 타입은 `apps/web/src/domain/<도메인>/types/`
- admin: `apps/admin/src/types/`
- mentor: `apps/mentor/src/types/`

## 새 타입 추가 결정

```
이 타입이 2개 이상 앱에서 같은 의미로 쓰일까?
   ├─ YES → packages/types
   └─ NO  → 해당 앱의 src/types/ 또는 도메인 폴더
```

서버 응답 타입은 가능하면 *Zod 스키마*로 정의해 런타임 검증과 타입 추론을 함께 얻는다.
