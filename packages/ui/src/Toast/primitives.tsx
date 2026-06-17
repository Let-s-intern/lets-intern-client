'use client';

/**
 * Layer 0 — 완전 헤드리스 Toast primitives (Radix raw re-export).
 *
 * 어떤 컴포넌트인가:
 *   `@radix-ui/react-toast`의 primitive를 가공 없이 그대로 재노출.
 *   스타일 0줄. swipe-to-dismiss / 자동 dismiss 타이머 / 다중 stacking /
 *   포커스 매니저 / ARIA(role=status) 같은 행동은 Radix가 책임진다.
 *
 *   디자인 시스템 외 특수한 toast 레이아웃을 직접 조립할 때만 사용한다.
 *   95% 케이스는 Layer 1(Toast) 또는 Layer 2 preset(SuccessToast / ErrorToast)을
 *   써야 한다. imperative 호출(useToast)도 Toaster + Toast(Layer 1)로 처리된다.
 *
 * 어디에 쓰이는가:
 *   직접 호출처 0건 (apps/web — 2026-05-21).
 *   Toast(Layer 1)와 Toaster가 내부에서 모두 사용 중.
 *   직접 사용 케이스가 생기면 여기에 기록해주세요.
 *
 * 사용 예 (특수 케이스):
 * ```tsx
 * import {
 *   ToastProvider,
 *   ToastViewport,
 *   ToastRoot,
 *   ToastTitle,
 * } from '@letscareer/ui';
 * ```
 */
export {
  Provider as ToastProvider,
  Viewport as ToastViewport,
  Root as ToastRoot,
  Title as ToastTitle,
  Description as ToastDescription,
  Action as ToastAction,
  Close as ToastClose,
} from '@radix-ui/react-toast';
