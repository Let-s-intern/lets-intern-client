'use client';

/**
 * AlertDialog 패키지 — 레이어 구조.
 *
 * Layer 0 (primitives): Radix raw re-export. 스타일 0줄.
 *   - AlertDialog, AlertDialogTrigger, AlertDialogPortal, AlertDialogOverlay,
 *     AlertDialogContent, AlertDialogTitle, AlertDialogDescription,
 *     AlertDialogCancel, AlertDialogAction
 *
 * Layer 1 (ConfirmDialog): 스타일 입힌 선언적 confirm 다이얼로그.
 *
 * Layer 2 (preset 컴포넌트): 자주 쓰이는 패턴을 variant로 잠근 wrapper.
 *   - EditConfirmDialog: variant='default' 강제
 *   - DangerConfirmDialog: variant='destructive' 강제 + type-to-confirm 옵션
 *
 * imperative API (선택):
 *   - ConfirmProvider, useConfirm — 호출부에서 await confirm({...})
 *
 * 의존 방향: Layer 0 ← Layer 1 ← Layer 2. 역방향 import 금지.
 */

// Layer 0 — 헤드리스 primitives
export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from './primitives';

// Layer 1 — ConfirmDialog
export { ConfirmDialog } from './ConfirmDialog';
export type { ConfirmDialogProps, ConfirmVariant } from './ConfirmDialog';

// Layer 2 — preset 컴포넌트
export { EditConfirmDialog } from './EditConfirmDialog';
export type { EditConfirmDialogProps } from './EditConfirmDialog';
export { DangerConfirmDialog } from './DangerConfirmDialog';
export type { DangerConfirmDialogProps } from './DangerConfirmDialog';

// imperative API
export { ConfirmProvider } from './ConfirmProvider';
export type { ConfirmOptions } from './ConfirmProvider';
export { useConfirm } from './useConfirm';
