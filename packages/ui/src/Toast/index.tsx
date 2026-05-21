'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * @letscareer/ui — Toast 패키지 (Radix 기반 헤드리스 결과 알림 모음)
 * ─────────────────────────────────────────────────────────────────────────
 *
 * 레이어 구조 (단방향 의존: Layer 0 ← Layer 1 ← Layer 2):
 *
 *  Layer 0  primitives.tsx           Radix `@radix-ui/react-toast`를
 *                                    가공 없이 raw 재export. 스타일 0줄.
 *                                    디자인 시스템 외 특수 toast 직접 조립
 *                                    시 사용. 7개 export.
 *
 *  Layer 1  Toast.tsx                Tailwind 스타일 + variant prop 지원
 *                                    ('default' | 'success' | 'error').
 *                                    닫기 버튼 기본 포함, duration prop으로
 *                                    자동 dismiss. 95% 케이스 흡수.
 *
 *  Layer 2a SuccessToast.tsx         variant='success' 강제. 성공/저장 완료
 *                                    류 결과 통보.
 *
 *  Layer 2b ErrorToast.tsx           variant='error' 강제. 실패/검증 에러/
 *                                    네트워크 오류 류 결과 통보.
 *
 *  Imperative API (기본 권장)
 *           Toaster                  Provider + Viewport 통합. 앱 루트에 1회
 *                                    마운트. 내부에 toast queue를 관리.
 *           useToast                 `toast.success(...)`, `toast.error(...)`,
 *                                    `toast({ variant, title, description })`
 *                                    imperative 호출. 결과 알림은 핸들러에서
 *                                    바로 발화하는 게 자연스러우므로 imperative
 *                                    가 기본.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * 현재 사용처 매핑 (apps/web 기준 — 2026-05-21)
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  Toaster
 *   • apps/web/src/context/Providers.tsx (앱 루트 마운트, useToast 백킹용)
 *
 *  useToast
 *   • apps/web/src/domain/mypage/privacy/section/ChangePassword.tsx
 *     비밀번호 변경 결과 알림 — success 1건 + error 4건
 *      ├ 성공: "비밀번호가 변경되었습니다"
 *      ├ 실패(400): "기존 비밀번호가 올바르지 않습니다"
 *      ├ 실패(기타): "비밀번호 변경에 실패했습니다"
 *      ├ 검증: "비밀번호가 일치하지 않습니다"
 *      └ 검증: "기존 비밀번호와 새로운 비밀번호가 같습니다"
 *   • apps/web/src/domain/mypage/privacy/section/BasicInfo.tsx
 *     기본 정보 수정 결과 알림 — success 1건 + error 1건
 *      ├ 성공: "정보가 수정되었습니다"
 *      └ 실패: "정보 수정에 실패했습니다"
 *
 *  SuccessToast / ErrorToast (선언적 사용 케이스)
 *   • 직접 호출처 0건. 호출 케이스가 생기면 여기에 기록해주세요.
 *
 * 새로 추가하는 호출처는 위 매핑에 반영해주세요 (검색·감사 편의).
 */

// Layer 0 — 헤드리스 primitives
export {
  ToastProvider,
  ToastViewport,
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
} from './primitives';

// Layer 1 — Toast
export { Toast } from './Toast';
export type { ToastProps, ToastVariant } from './Toast';

// Layer 2 — preset 컴포넌트
export { SuccessToast } from './SuccessToast';
export type { SuccessToastProps } from './SuccessToast';
export { ErrorToast } from './ErrorToast';
export type { ErrorToastProps } from './ErrorToast';

// imperative API
export { Toaster } from './Toaster';
export type { ToastOptions } from './Toaster';
export { useToast } from './useToast';
export type { ToastApi, ToastShortcutOptions } from './useToast';
