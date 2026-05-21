'use client';

import * as React from 'react';

import { ConfirmContext, type ConfirmFn } from './ConfirmProvider';

/**
 * imperative confirm API.
 *
 * ```tsx
 * const confirm = useConfirm();
 * const ok = await confirm({ title: '정말 로그아웃하시겠어요?' });
 * if (!ok) return;
 * ```
 *
 * `ConfirmProvider` 외부에서 호출 시 즉시 에러를 던진다.
 */
export function useConfirm(): ConfirmFn {
  const confirm = React.useContext(ConfirmContext);
  if (!confirm) {
    throw new Error(
      'useConfirm must be used within a <ConfirmProvider>. ' +
        '루트에 ConfirmProvider를 마운트해주세요.',
    );
  }
  return confirm;
}
