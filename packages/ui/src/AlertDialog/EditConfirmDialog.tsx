'use client';

import * as React from 'react';

import { ConfirmDialog, type ConfirmDialogProps } from './ConfirmDialog';

/**
 * Layer 2a — 수정/편집 작업용 preset.
 *
 * 어떤 컴포넌트인가:
 *   ConfirmDialog(Layer 1) 위에 얇게 얹은 wrapper. variant를 'default'로
 *   고정하고 confirmLabel 기본값을 '수정'으로 잡아, 호출부가 디자인 결정
 *   (variant)을 못 하도록 컴파일 타임에 차단한다. 사용자가 데이터를 수정/
 *   저장하는 액션 전용. 위험한 액션(삭제/탈퇴/로그아웃)에는 사용 금지 →
 *   그 경우 DangerConfirmDialog 사용.
 *
 * 어디에 쓰이는가 (apps/web — 2026-05-21):
 *   • apps/web/src/domain/mypage/privacy/section/BasicInfo.tsx
 *     "기본 정보를 수정하시겠어요?" — 마이페이지 개인정보 기본정보 저장 직전
 *   • apps/web/src/domain/mypage/privacy/section/ChangePassword.tsx
 *     "비밀번호를 변경하시겠어요?" — 마이페이지 개인정보 비밀번호 변경 직전
 *
 * 새 호출처 추가 시 위 목록과 packages/ui/src/AlertDialog/index.tsx 상단
 * 매핑에 같이 갱신해주세요.
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
