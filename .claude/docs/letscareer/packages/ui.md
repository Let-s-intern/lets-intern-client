# `@letscareer/ui`

3개 앱(web·admin·mentor)이 공유하는 UI 컴포넌트. 토큰은 [`@letscareer/tailwind-config`](./config.md) 에서,
컴포넌트는 이 패키지에서 온다.

## 구성

```
packages/ui/src/
├── AlertDialog/    # Radix 기반 confirm (3-레이어 + imperative)
├── Toast/          # Radix 기반 결과 알림 (3-레이어 + imperative)
├── Popup/          # Radix Dialog 기반 범용 제어형 모달 셸
├── CategoryTabs/   # 제네릭 탭 (인디케이터 슬라이드 애니메이션)
├── JitsiEmbed/     # Jitsi 셀프호스팅 임베드 + health-check/failover 유틸
└── index.ts        # 배럴 (일부만 재export)
```

## Export 표면

`package.json` 의 서브패스 exports 로 컴포넌트별 직접 진입점을 노출한다 (배럴 대신 직접 import 권장).

```ts
import { JitsiEmbed, buildJitsiRoomUrl } from '@letscareer/ui/JitsiEmbed';
import { ConfirmDialog, useConfirm } from '@letscareer/ui/AlertDialog';
import { Toast, useToast, Toaster } from '@letscareer/ui/Toast';
import { Popup } from '@letscareer/ui/Popup';
import { CategoryTabs } from '@letscareer/ui/CategoryTabs';
```

## 컴포넌트별 요약

| 컴포넌트 | 성격 | 핵심 |
|---|---|---|
| `AlertDialog` | 확인(confirm) 모음 | Radix `react-alert-dialog` 기반. `ConfirmDialog` + preset(`EditConfirmDialog`·`DangerConfirmDialog`) + imperative(`ConfirmProvider`/`useConfirm`) |
| `Toast` | 결과 알림 모음 | Radix `react-toast` 기반. `Toast` + preset(`SuccessToast`·`ErrorToast`) + imperative(`Toaster`/`useToast`, 기본 권장) |
| `Popup` | 범용 제어형 모달 셸 | Radix `react-dialog` 기반. Portal·focus trap·ESC·스크롤락은 Radix가, fade-in 오버레이·닫기 X만 얹음. 콘텐츠는 children 주입 |
| `CategoryTabs` | 제네릭 탭 | `options`/`selected`/`onChange`, `size`·`full` prop, 선택 인디케이터 슬라이드 |
| `JitsiEmbed` | 라이브 피드백 화상 | Jitsi 셀프호스팅 iframe 임베드. `buildRoomUrl`·`jitsiHealthCheck`(base 후보 failover) 유틸 동봉 |

## 컴포넌트 컨벤션 (AlertDialog·Toast·Popup)

Radix 기반 인터랙션 컴포넌트는 **3-레이어 + imperative API** 규약을 따른다. 접근성(focus trap·ESC·
return focus·ARIA)은 Radix에 위임하고, 프로젝트는 스타일과 정책만 얹는다.

```
Layer 0  primitives.tsx   Radix를 가공 없이 raw 재export (스타일 0줄). 특수 케이스 직접 조립용.
   ↑
Layer 1  ConfirmDialog / Toast   Tailwind 토큰 스타일 + variant prop. 90~95% 케이스 흡수.
   ↑
Layer 2  Edit·DangerConfirmDialog / Success·ErrorToast   variant 고정한 preset.

+ Imperative API   ConfirmProvider/useConfirm, Toaster/useToast — 앱 루트에 Provider 1회 마운트 후
                   핸들러에서 await confirm(...) / toast.error(...) 로 호출.
```

세부 관례:

- **Radix 헤드리스 베이스** — `@radix-ui/react-{alert-dialog,dialog,toast}`, `clsx`로 className 병합, 전 컴포넌트 `'use client'`.
- **서브패스 exports** — 배럴 대신 `@letscareer/ui/Toast` 처럼 직접 import (barrel import 지양).
- **`peerDependencies: react`** — 앱의 React를 공유해 중복 번들 방지.
- **사용처 매핑 주석** — 각 컴포넌트 `index.tsx` 상단에 "누가·어디서 쓰는지"를 날짜와 함께 기록하고,
  미사용 export는 deprecate 후보로 표기한다. 새 호출처 추가 시 이 매핑도 갱신할 것.

## 왜 아직 작은가

Button·Layout·Input 같은 대다수 공용 UI는 *프레임워크 의존*이 크거나 도메인 색이 짙어 각 앱
`src/common/` 에 자체 구현을 둔다. `@letscareer/ui` 에는 **3개 앱이 동일 UX를 공유해야 하는 인터랙션
컴포넌트(AlertDialog·Toast·Popup·CategoryTabs)** 와 **화상 임베드(JitsiEmbed)** 만 승격한다.

## 앱 내부 공용 컴포넌트

- `apps/web/src/common/` — Button·Modal·Input·Layout 등 web 전용 → [`../apps/web/components.md`](../apps/web/components.md)
- `apps/admin/src/common/` — 어드민 전용 (MUI 의존)
- `apps/mentor/src/common/` — 멘토 전용
