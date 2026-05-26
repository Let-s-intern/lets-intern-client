'use client';

import * as React from 'react';

import { ConfirmContext, type ConfirmFn } from './ConfirmProvider';

/**
 * imperative confirm API.
 *
 * 어떤 훅인가:
 *   ConfirmProvider가 제공한 Context를 소비해 `confirm(options) => Promise<boolean>`
 *   함수를 반환한다. 핸들러 내부에서 `await confirm(...)` 후 결과에 따라 다음
 *   액션을 실행하는 imperative 흐름이 자연스러울 때 사용. UI 표현이 컴포넌트
 *   트리에 드러나지 않으므로, 일반 케이스는 선언적 preset 컴포넌트
 *   (EditConfirmDialog / DangerConfirmDialog) 사용을 권장.
 *
 * 어디서 호출되고 있는가:
 *   직접 호출처 0건 (apps/web — 2026-05-21). 4곳 모두 선언적 preset으로 전환됨.
 *   다른 앱(admin/mentor)에서 필요해질 때 재평가.
 *
 * 사용 예:
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
