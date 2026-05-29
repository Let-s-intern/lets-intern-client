'use client';

/**
 * imperative Toast API.
 *
 * 어떤 훅인가:
 *   Toaster가 제공한 Context를 소비해 toast 발화 함수를 반환한다. 결과 알림은
 *   보통 핸들러(mutation onSuccess/onError) 안에서 즉시 발화되므로 imperative
 *   API가 자연스럽다. UI 트리에 toast 상태가 노출되지 않아 호출부도 깔끔하다.
 *
 *   반환 객체:
 *     - success(message, options?) — variant='success' toast 발화
 *     - error(message, options?)   — variant='error' toast 발화
 *     - toast(options)             — 일반 발화 (variant 직접 지정)
 *
 *   선언적 사용이 더 자연스러운 케이스(예: 폼 검증 결과를 컴포넌트 트리에 표현)는
 *   SuccessToast / ErrorToast 컴포넌트를 직접 렌더하면 된다.
 *
 * 어디서 호출되고 있는가 (apps/web — 2026-05-21):
 *   • apps/web/src/domain/mypage/privacy/section/ChangePassword.tsx
 *     비밀번호 변경 성공/실패/검증 에러 알림 (success 1 + error 4)
 *   • apps/web/src/domain/mypage/privacy/section/BasicInfo.tsx
 *     기본 정보 수정 성공/실패 알림 (success 1 + error 1)
 *
 *   새 호출처 추가 시 위 목록과 packages/ui/src/Toast/index.tsx 상단 매핑에 같이
 *   갱신해주세요.
 *
 * 사용 예:
 * ```tsx
 * const toast = useToast();
 * toast.success('비밀번호가 변경되었습니다');
 * toast.error('비밀번호 변경에 실패했습니다');
 * toast.toast({ variant: 'default', title: '안내', description: '...' });
 * ```
 *
 * `Toaster` 외부에서 호출 시 즉시 에러를 던진다.
 */

import * as React from 'react';

import { ToastEnqueueContext, type ToastOptions } from './Toaster';

export interface ToastShortcutOptions {
  description?: React.ReactNode;
  duration?: number;
}

export interface ToastApi {
  success: (message: React.ReactNode, options?: ToastShortcutOptions) => void;
  error: (message: React.ReactNode, options?: ToastShortcutOptions) => void;
  toast: (options: ToastOptions) => void;
}

export function useToast(): ToastApi {
  const enqueue = React.useContext(ToastEnqueueContext);
  if (!enqueue) {
    throw new Error(
      'useToast must be used within a <Toaster>. ' +
        '루트에 Toaster를 마운트해주세요.',
    );
  }

  return React.useMemo<ToastApi>(
    () => ({
      success: (message, options) =>
        enqueue({ ...options, variant: 'success', title: message }),
      error: (message, options) =>
        enqueue({ ...options, variant: 'error', title: message }),
      toast: (options) => enqueue(options),
    }),
    [enqueue],
  );
}
