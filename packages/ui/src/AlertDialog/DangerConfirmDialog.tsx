'use client';

import * as React from 'react';

import { ConfirmDialog, type ConfirmDialogProps } from './ConfirmDialog';

/**
 * Layer 2b — 파괴적/위험 작업용 preset.
 *
 * 어떤 컴포넌트인가:
 *   ConfirmDialog(Layer 1) 위에 얹은 wrapper로 variant='destructive'를 강제한다.
 *   추가로 `requireTypedConfirmation` 옵션을 통해 사용자가 지정한 문자열을
 *   정확히 타이핑해야만 확인 버튼이 활성화되는 type-to-confirm 패턴을 지원.
 *   탈퇴/삭제/로그아웃처럼 되돌릴 수 없는 액션 전용. 일반 수정류 confirm에는
 *   EditConfirmDialog 사용.
 *
 * type-to-confirm 동작 명세:
 *   - `requireTypedConfirmation`이 truthy면 description 아래에 input이 자동 렌더된다
 *   - 입력값이 정확히 일치할 때만 confirm 버튼이 활성화된다
 *     (trim X, 대소문자 구분, 공백 포함 — 의도적으로 엄격)
 *   - 다이얼로그가 닫힐 때 input 값은 자동 초기화 (재오픈 시 빈 값에서 시작)
 *   - 검증 로직은 이 컴포넌트가 책임, ConfirmDialog는 `confirmDisabled` 가드만 받음
 *
 * 어디에 쓰이는가 (apps/web — 2026-05-21):
 *   • apps/web/src/common/layout/header/SideNavContainer.tsx
 *     "로그아웃 하시겠어요?" — 우측 사이드 네비 로그아웃 버튼
 *     (type-to-confirm 없음, 단순 destructive confirm)
 *   • apps/web/src/app/(user)/mypage/privacy/page.tsx
 *     "회원 탈퇴 하시겠어요?" + requireTypedConfirmation="회원탈퇴"
 *     (사용자가 "회원탈퇴" 정확히 입력해야 탈퇴 진행)
 *
 * 새 호출처 추가 시 위 목록과 packages/ui/src/AlertDialog/index.tsx 상단
 * 매핑에 같이 갱신해주세요.
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
  // 한 페이지에 여러 DangerConfirmDialog가 동시에 존재해도 label/input 매칭이
  // 어긋나지 않도록 인스턴스마다 고유 id를 생성한다.
  const inputId = React.useId();

  // 다이얼로그가 닫힐 때 input 값 초기화 (재오픈 시 빈 값으로 시작)
  React.useEffect(() => {
    if (!open) setTyped('');
  }, [open]);

  const isTypeValid =
    !requireTypedConfirmation || typed === requireTypedConfirmation;

  const extra = requireTypedConfirmation ? (
    <div>
      <label htmlFor={inputId} className={LABEL_CLASSES}>
        확인을 위해 &lsquo;{requireTypedConfirmation}&rsquo;를 입력해주세요.
      </label>
      <input
        id={inputId}
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
