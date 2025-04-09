'use client';

import { useControlScroll } from '@/hooks/useControlScroll';
import { twMerge } from '@/lib/twMerge';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import ModalOverlay from './ModalOverlay';
import ModalPortal from './ModalPortal';

/**
 * 반응형 모달 컴포넌트
 * @description 모바일에서는 페이지, 데스크탑에서는 모달처럼 보이는 모달 컴포넌트
 * 사용예시:
 * <ResponsiveModal isOpen={isOpen} onClose={handleClose}>
 *   <div>모달 내용</div>
 * </ResponsiveModal>
 */

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  isLoading?: boolean;
}
const ResponsiveModal = ({
  isOpen,
  onClose,
  children,
  className,
  wrapperClassName,
  isLoading,
}: Props) => {
  // 스크롤 제어
  useControlScroll(isOpen);

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div
        className={twMerge(
          'fixed inset-0 z-20 flex items-center justify-center md:z-50',
          wrapperClassName,
        )}
        role="dialog"
        aria-modal="true"
      >
        <ModalOverlay className="hidden md:block" onClose={onClose} />
        <div
          className={twMerge(
            'relative h-full w-full overflow-hidden bg-white pt-20 md:h-fit md:w-fit md:rounded-ms md:pt-0',
            className,
          )}
        >
          {
            // 로딩 중일 경우
            isLoading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70">
                <LoadingContainer />
              </div>
            )
          }
          {children}
        </div>
      </div>
    </ModalPortal>
  );
};

export default ResponsiveModal;
