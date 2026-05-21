'use client';

/**
 * Layer 0 — 완전 헤드리스 Radix re-export.
 *
 * 어떤 컴포넌트인가:
 *   `@radix-ui/react-alert-dialog`의 9개 primitive를 가공 없이 그대로 재노출.
 *   스타일도 없고 구조도 없다. focus trap / ESC / return focus / ARIA
 *   (role=alertdialog) 같은 행동은 Radix가 책임진다. 디자인 시스템 외 특수한
 *   모달 레이아웃을 직접 조립할 때만 사용한다. 90% 케이스는 Layer 1
 *   (ConfirmDialog) 또는 Layer 2 preset(EditConfirmDialog / DangerConfirmDialog)을
 *   써야 한다.
 *
 * 어디에 쓰이는가:
 *   직접 호출처 0건 (apps/web — 2026-05-21).
 *   ConfirmDialog(Layer 1)가 내부에서 모두 사용 중.
 *   직접 사용 케이스가 생기면 여기에 기록해주세요.
 *
 * 사용 예 (특수 케이스):
 * ```tsx
 * import {
 *   AlertDialog,
 *   AlertDialogTrigger,
 *   AlertDialogContent,
 * } from '@letscareer/ui';
 * ```
 */
export {
  Root as AlertDialog,
  Trigger as AlertDialogTrigger,
  Portal as AlertDialogPortal,
  Overlay as AlertDialogOverlay,
  Content as AlertDialogContent,
  Title as AlertDialogTitle,
  Description as AlertDialogDescription,
  Cancel as AlertDialogCancel,
  Action as AlertDialogAction,
} from '@radix-ui/react-alert-dialog';
