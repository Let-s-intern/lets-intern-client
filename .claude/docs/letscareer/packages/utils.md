# `@letscareer/utils`

순수 함수 유틸리티. 클래스 병합·디바운스·검증·상수 등 프레임워크 비특화 모듈.

## 위치

```
packages/utils/src/
├── cn.ts                                  # Tailwind 클래스 병합 (clsx + twMerge)
├── debounce.ts                            # 디바운스
├── throttle.ts                            # 쓰로틀
├── invariant.ts                           # 단언 (개발 시 throw)
├── valid.ts                               # 검증 함수들
├── random.ts                              # nanoid 등 랜덤
├── constants.ts                           # 공통 상수
├── converTypeToText.ts                    # 타입 → 한글 텍스트
├── convertTypeToBank.ts                   # 은행 코드 변환
├── programConst.ts                        # 프로그램 상수
├── dominantColor.ts                       # 이미지 주요 색 추출
├── colorthief.d.ts                        # colorthief 타입 선언
├── getSelectedNode.ts                     # Lexical 에디터 보조
├── setFloatingElemPosition.ts             # Lexical 플로팅 위치
├── setFloatingElemPositionForLinkEditor.ts
├── swipe.ts                               # 스와이프 보조
├── tableCellWidthList.ts                  # 테이블 셀 폭 상수
└── index.ts
```

## Export 표면

```ts
export * from './cn';
export * from './constants';
export * from './converTypeToText';
export * from './convertTypeToBank';
export { default as debounce } from './debounce';
export { default as getDominantColor } from './dominantColor';
export * from './getSelectedNode';
export { default as invariant } from './invariant';
export * from './programConst';
export * from './random';
export * from './setFloatingElemPosition';
export * from './setFloatingElemPositionForLinkEditor';
export * from './swipe';
export * from './tableCellWidthList';
export { default as throttle } from './throttle';
export * from './valid';
```

## 사용 예

```ts
import { cn, debounce, invariant } from '@letscareer/utils';

const className = cn('p-4', isActive && 'bg-primary-50');
const handleSearch = debounce((value: string) => fetch(...), 300);
invariant(user, 'User must be defined');
```

## 마이그레이션 진행 중

`apps/web/src/utils/`에도 같은 이름 파일(`cn.ts`, `debounce.ts`, `throttle.ts`, `constants.ts` 등)이 잔존. 새 코드는 `@letscareer/utils` 우선 사용. apps/web의 `utils/`에는 axios 인스턴스 구성·token·web 전용 헬퍼만 남기는 방향으로 정리한다.

## 관련

- [api.md](./api.md) — axios 인스턴스 생성기 (`@letscareer/api`)
- [`../apps/web/services.md`](../apps/web/services.md) — apps/web의 utils 카탈로그
