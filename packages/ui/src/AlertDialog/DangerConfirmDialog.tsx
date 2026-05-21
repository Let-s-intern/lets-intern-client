'use client';

import * as React from 'react';

import { ConfirmDialog, type ConfirmDialogProps } from './ConfirmDialog';

/**
 * Layer 2b — 파괴적/위험 작업용 preset.
 *
 * - variant는 항상 'destructive' (컴파일 타임에 차단)
 * - `requireTypedConfirmation`이 truthy면:
 *   - description 아래에 input이 자동 렌더된다
 *   - 입력값이 정확히 일치할 때만 confirm 버튼이 활성화된다 (trim X, 대소문자 구분, 공백 포함)
 *   - 다이얼로그가 닫힐 때 input 값은 초기화된다
 */
export type DangerConfirmDialogProps = Omit<ConfirmDialogProps, 'variant'> & {
  requireTypedConfirmation?: string;
};

const INPUT_CLASSES =
  'mt-4 w-full rounded-sm border border-neutral-70 px-3 py-2 text-xsmall14 text-neutral-0 focus:border-primary focus:outline-none';

const LABEL_CLASSES = 'mt-4 block text-xsmall14 text-neutral-30';

export function DangerConfirmDialog({
  requireTypedConfirmation,
  open,
  onOpenChange,
  onConfirm,
  ...rest
}: DangerConfirmDialogProps) {
  const [typed, setTyped] = React.useState('');

  // 다이얼로그가 닫힐 때 input 값 초기화 (재오픈 시 빈 값으로 시작)
  React.useEffect(() => {
    if (!open) setTyped('');
  }, [open]);

  const isTypeValid =
    !requireTypedConfirmation || typed === requireTypedConfirmation;

  const extra = requireTypedConfirmation ? (
    <div>
      <label htmlFor="danger-confirm-typed-input" className={LABEL_CLASSES}>
        확인을 위해 &lsquo;{requireTypedConfirmation}&rsquo;를 입력해주세요.
      </label>
      <input
        id="danger-confirm-typed-input"
        type="text"
        className={INPUT_CLASSES}
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        autoComplete="off"
      />
    </div>
  ) : undefined;

  return (
    <ConfirmDialog
      {...rest}
      open={open}
      onOpenChange={onOpenChange}
      variant="destructive"
      extra={extra}
      confirmDisabled={!isTypeValid}
      onConfirm={() => {
        if (!isTypeValid) return;
        return onConfirm();
      }}
    />
  );
}
