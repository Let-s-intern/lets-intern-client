'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * @letscareer/ui — AlertDialog 패키지 (Radix 기반 헤드리스 confirm 모음)
 * ─────────────────────────────────────────────────────────────────────────
 *
 * 레이어 구조 (단방향 의존: Layer 0 ← Layer 1 ← Layer 2):
 *
 *  Layer 0  primitives.tsx           Radix `@radix-ui/react-alert-dialog`를
 *                                    가공 없이 raw 재export. 스타일 0줄.
 *                                    디자인 시스템 외 특수 다이얼로그 직접
 *                                    조립 시 사용. 9개 export.
 *
 *  Layer 1  ConfirmDialog.tsx        Tailwind 스타일 + variant prop 지원.
 *                                    extra(slot) / confirmDisabled(외부 가드)
 *                                    prop을 통해 Layer 2가 검증 책임을 가짐.
 *                                    90% 케이스 흡수.
 *
 *  Layer 2a EditConfirmDialog.tsx    variant='default' 강제 + confirmLabel
 *                                    기본값 '수정'. 수정/저장 류 액션.
 *
 *  Layer 2b DangerConfirmDialog.tsx  variant='destructive' 강제 + 옵션
 *                                    requireTypedConfirmation으로 사용자가
 *                                    지정 문구를 직접 타이핑해야 확인되는
 *                                    type-to-confirm 패턴 지원.
 *                                    탈퇴/삭제/로그아웃 류 위험 액션.
 *
 *  Imperative API (선택 사용)
 *           ConfirmProvider / useConfirm — 핸들러 안에서 await confirm(...)
 *                                          imperative 호출. 현재 apps/web 직접
 *                                          호출처는 0건(2026-05-21 기준). 다른
 *                                          앱(admin/mentor)에서 필요해질 때
 *                                          재평가. 미사용 확정 시 deprecate.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * 현재 사용처 매핑 (apps/web 기준 — 2026-05-21)
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  EditConfirmDialog
 *   • apps/web/src/domain/mypage/privacy/section/BasicInfo.tsx
 *     → "기본 정보를 수정하시겠어요?" — 마이페이지 개인정보 기본정보 저장
 *   • apps/web/src/domain/mypage/privacy/section/ChangePassword.tsx
 *     → "비밀번호를 변경하시겠어요?" — 마이페이지 개인정보 비밀번호 변경
 *
 *  DangerConfirmDialog
 *   • apps/web/src/common/layout/header/SideNavContainer.tsx
 *     → "로그아웃 하시겠어요?" — 우측 사이드 네비 로그아웃 버튼
 *   • apps/web/src/app/(user)/mypage/privacy/page.tsx
 *     → "회원 탈퇴 하시겠어요?" + requireTypedConfirmation="회원탈퇴"
 *
 *  ConfirmProvider
 *   • apps/web/src/context/Providers.tsx (앱 루트 마운트, useConfirm 백킹용)
 *
 *  useConfirm (imperative)
 *   • apps/web/src/domain/mypage/application/section/LaunchAlertSection.tsx
 *     → "출시알림을 취소하시겠습니까?" — 신청현황 출시알림 탭 카드 신청취소
 *
 * 새로 추가하는 호출처는 위 매핑에 반영해주세요 (검색·감사 편의).
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

// Layer 1 — NoticeDialog (단일 확인 버튼, window.alert 대체)
export { NoticeDialog } from './NoticeDialog';
export type { NoticeDialogProps } from './NoticeDialog';

// Layer 2 — preset 컴포넌트
export { EditConfirmDialog } from './EditConfirmDialog';
export type { EditConfirmDialogProps } from './EditConfirmDialog';
export { DangerConfirmDialog } from './DangerConfirmDialog';
export type { DangerConfirmDialogProps } from './DangerConfirmDialog';

// imperative API
export { ConfirmProvider } from './ConfirmProvider';
export type { ConfirmOptions } from './ConfirmProvider';
export { useConfirm } from './useConfirm';
