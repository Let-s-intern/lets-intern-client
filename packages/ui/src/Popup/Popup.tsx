'use client';

/**
 * 헤드리스 범용 Popup (Radix Dialog 기반).
 *
 * 어떤 컴포넌트인가:
 *   `@radix-ui/react-dialog`로 조립한 제어형(open/onOpenChange) 모달 셸.
 *   Portal · Overlay(dim) · focus trap · ESC · return focus · 스크롤락은
 *   Radix가 책임지고, 여기서는 fade-in 오버레이와 닫기 X 버튼만 얹는다.
 *   비즈니스 로직은 없으며, 노출 정책/콘텐츠는 사용처가 children으로 주입한다.
 *
 * 접근성:
 *   Dialog는 접근 가능한 제목(Title)이 필요하다. 시각적 제목이 없으면 `title`
 *   prop으로 스크린리더 전용 제목을 제공한다(sr-only).
 *
 * 사용 예:
 * ```tsx
 * <Popup open={open} onOpenChange={setOpen} title="뉴스레터 구독 안내">
 *   <MyCreative />
 * </Popup>
 * ```
 */

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

const OVERLAY_CLASSES =
  'fixed inset-0 z-[1000] bg-black/50 data-[state=open]:animate-fade-in';

const CONTENT_CLASSES =
  'fixed left-1/2 top-1/2 z-[1001] -translate-x-1/2 -translate-y-1/2 ' +
  'focus:outline-none data-[state=open]:animate-fade-in';

const CLOSE_CLASSES =
  'absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center ' +
  'rounded-full text-xl leading-none text-static-100 focus:outline-none';

export interface PopupProps {
  /** 열림 상태 (제어형) */
  open: boolean;
  /** 열림 상태 변경 콜백 (ESC·오버레이 클릭·X 버튼이 호출) */
  onOpenChange: (open: boolean) => void;
  /** 스크린리더 전용 제목 (시각적 제목이 없을 때 필수) */
  title?: string;
  /** Content 컨테이너 클래스 (크기/레이아웃 커스터마이즈) */
  className?: string;
  /** Overlay(dim) 클래스 커스터마이즈 */
  overlayClassName?: string;
  /** 닫기 X 버튼 노출 여부 (기본 true) */
  showCloseButton?: boolean;
  children: React.ReactNode;
}

export function Popup({
  open,
  onOpenChange,
  title = '팝업',
  className,
  overlayClassName,
  showCloseButton = true,
  children,
}: PopupProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={
            overlayClassName
              ? `${OVERLAY_CLASSES} ${overlayClassName}`
              : OVERLAY_CLASSES
          }
        />
        <Dialog.Content
          className={
            className ? `${CONTENT_CLASSES} ${className}` : CONTENT_CLASSES
          }
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          {children}
          {showCloseButton ? (
            <Dialog.Close className={CLOSE_CLASSES} aria-label="닫기">
              ✕
            </Dialog.Close>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
