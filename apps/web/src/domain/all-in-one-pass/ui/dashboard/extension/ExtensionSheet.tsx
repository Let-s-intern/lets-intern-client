// 연장 팝업·모달 공용 컨테이너 — 모바일 바텀시트 / 데스크톱 센터 모달 + 공용 헤더(타이틀·부제·X).
'use client';

import ModalOverlay from '@/common/ModalOverlay';
import ModalPortal from '@/common/ModalPortal';
import { useControlScroll } from '@/hooks/useControlScroll';
import { twMerge } from '@/lib/twMerge';
import { X } from 'lucide-react';

interface Props {
  title: React.ReactNode;
  description?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function ExtensionSheet({
  title,
  description,
  onClose,
  children,
  className,
}: Props) {
  useControlScroll(true);

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
        <ModalOverlay onClose={onClose} />
        <div
          className={twMerge(
            'relative max-h-[80vh] w-full overflow-y-auto rounded-t-sm bg-white p-6 md:w-[400px] md:rounded-sm',
            className,
          )}
        >
          <header className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-small18 text-neutral-0 font-semibold">
                {title}
              </h2>
              {description && (
                <p className="text-xsmall14 text-neutral-35 font-normal">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-40 shrink-0"
              aria-label="닫기"
            >
              <X size={24} />
            </button>
          </header>
          {children}
        </div>
      </div>
    </ModalPortal>
  );
}
