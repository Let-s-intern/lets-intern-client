# 레이어 역할 및 네이밍 규칙

## 원칙

각 도메인 내부는 **역할별 레이어**로 구성한다. 레이어는 코드의 역할을 명확히 하고, 어디에 무엇이 있는지 예측 가능하게 만든다.

## 레이어 정의

| 레이어 | 역할 | 포함하는 것 | 포함하지 않는 것 |
|--------|------|------------|----------------|
| `ui/` | UI 컴포넌트 | React 컴포넌트 (.tsx) | 비즈니스 로직, API 호출 |
| `hooks/` | 커스텀 훅 | 상태 관리, 사이드 이펙트 | UI 렌더링 |
| `types/` | 타입 정의 | interface, type, enum | 런타임 코드 |
| `utils/` | 순수 유틸리티 | 포맷터, 변환기, 계산기 | React 의존 코드 |
| `constants/` | 상수 | 매직 넘버, 옵션 배열, 설정값 | 동적으로 변하는 값 |
| `schema/` | 검증 스키마 | Zod 스키마, 폼 검증 규칙 | UI, 비즈니스 로직 |

## 레이어 사용 규칙

### 필요한 레이어만 생성한다

```
# 나쁜 예 — 빈 레이어까지 미리 생성
domain/community/
  ui/
  hooks/        ← 빈 폴더
  types/        ← 빈 폴더
  utils/        ← 빈 폴더
  constants/    ← 빈 폴더
  schema/       ← 빈 폴더

# 좋은 예 — 필요한 것만
domain/community/
  ui/
```

### 단일 파일이면 레이어 폴더 없이 배치할 수 있다

파일이 1개뿐이고 확장 가능성이 낮으면 레이어 폴더 없이 도메인 루트에 배치해도 된다. 단, 파일이 2개 이상이 되면 즉시 레이어 폴더로 이동한다.

```
# 허용 — 타입 파일 1개
domain/community/
  ui/
  types.ts          ← 파일 1개일 때 허용

# 파일 추가 시 → 레이어 폴더로 이동
domain/community/
  ui/
  types/
    community.ts
    post.ts
```

## 레이어 간 의존 방향

레이어 간 import는 아래 방향으로만 허용한다:

```
ui/ → hooks/ → utils/
         ↓
      types/ ← (모든 레이어에서 import 가능)
      constants/ ← (모든 레이어에서 import 가능)
      schema/ ← (hooks/, ui/에서 import 가능)
```

- `ui/`는 `hooks/`, `types/`, `constants/`, `schema/`를 import할 수 있다
- `hooks/`는 `utils/`, `types/`, `constants/`, `schema/`를 import할 수 있다
- `utils/`는 `types/`, `constants/`만 import할 수 있다
- **역방향 금지**: `utils/`가 `hooks/`를, `hooks/`가 `ui/`를 import하면 안 된다

## 네이밍 규칙

| 레이어 | 파일 네이밍 | 예시 |
|--------|-----------|------|
| `ui/` | PascalCase | `ChallengeCard.tsx` |
| `hooks/` | camelCase, `use` 접두사 | `useChallengeList.ts` |
| `types/` | camelCase 또는 `index.ts` | `challenge.ts`, `index.ts` |
| `utils/` | camelCase | `priceFormatter.ts` |
| `constants/` | camelCase | `challengeOptions.ts` |
| `schema/` | camelCase, `Schema` 접미사 | `challengeFormSchema.ts` |
