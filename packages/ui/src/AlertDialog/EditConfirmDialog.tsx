'use client';

import * as React from 'react';

import { ConfirmDialog, type ConfirmDialogProps } from './ConfirmDialog';

/**
 * Layer 2a — 수정/편집 작업용 preset.
 *
 * - variant는 항상 'default' (컴파일 타임에 차단)
 * - confirmLabel 기본값은 '수정'
 */
export type EditConfirmDialogProps = Omit<ConfirmDialogProps, 'variant'>;

export function EditConfirmDialog({
  confirmLabel = '수정',
  ...rest
}: EditConfirmDialogProps) {
  return (
    <ConfirmDialog {...rest} variant="default" confirmLabel={confirmLabel} />
  );
}
