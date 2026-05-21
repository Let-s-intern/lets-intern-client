'use client';

/**
 * Layer 0 — 헤드리스 primitives.
 *
 * Radix `@radix-ui/react-alert-dialog`의 raw 컴포넌트를 그대로 재export한다.
 * 스타일은 0줄. 호출부 또는 상위 Layer(ConfirmDialog 등)에서 스타일을 입힌다.
 *
 * 사용 예:
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
