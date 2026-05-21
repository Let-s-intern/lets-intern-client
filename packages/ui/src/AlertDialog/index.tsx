'use client';

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import * as React from 'react';

/**
 * Radix `AlertDialog`는 destructive 액션을 위한 modal 다이얼로그다.
 * - `role="alertdialog"` 시맨틱
 * - 외부 클릭으로 닫히지 않음
 * - 포커스 트랩 + ESC 닫기 기본 제공
 *
 * Primitive를 그대로 재export하고, 시각적 기본을 갖는 일부(Overlay/Content/Title/Description)는
 * forwardRef로 감싼 컴포넌트를 제공한다. 호출부는 className을 통해 스타일을 덮어쓸 수 있다.
 */

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogPortal = AlertDialogPrimitive.Portal;
export const AlertDialogCancel = AlertDialogPrimitive.Cancel;
export const AlertDialogAction = AlertDialogPrimitive.Action;

function cx(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(' ');
}

const OVERLAY_CLASSES =
  'fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-fade-in';

export const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(function AlertDialogOverlay({ className, ...props }, ref) {
  return (
    <AlertDialogPrimitive.Overlay
      ref={ref}
      className={cx(OVERLAY_CLASSES, className)}
      {...props}
    />
  );
});

const CONTENT_CLASSES =
  'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-04 focus:outline-none data-[state=open]:animate-fade-in';

export const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(function AlertDialogContent({ className, children, ...props }, ref) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cx(CONTENT_CLASSES, className)}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  );
});

export const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(function AlertDialogTitle({ className, ...props }, ref) {
  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      className={cx(
        'text-small18 font-semibold text-neutral-0',
        className,
      )}
      {...props}
    />
  );
});

export const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(function AlertDialogDescription({ className, ...props }, ref) {
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      className={cx(
        'mt-2 text-xsmall14 text-neutral-30',
        className,
      )}
      {...props}
    />
  );
});

export { ConfirmDialog } from './ConfirmDialog';
export type { ConfirmDialogProps, ConfirmVariant } from './ConfirmDialog';
export { ConfirmProvider } from './ConfirmProvider';
export type { ConfirmOptions } from './ConfirmProvider';
export { useConfirm } from './useConfirm';
