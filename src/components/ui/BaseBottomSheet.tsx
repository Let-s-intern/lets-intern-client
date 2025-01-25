import { useControlScroll } from '@/hooks/useControlScroll';
import { twMerge } from '@/lib/twMerge';
import ModalOverlay from './ModalOverlay';
import ModalPortal from './ModalPortal';

/**
 * 기본 바텀시트 컴포넌트
 *
 * 사용예시:
 * <BaseBottomSheet isOpen={isOpen} onClose={handleClose}>
 *   <div>내용</div>
 * </BaseBottomSheet>
 */

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
}
const BaseBottomSheet = ({
  isOpen,
  onClose,
  children,
  className,
}: BaseModalProps) => {
  // 스크롤 제어
  useControlScroll(isOpen);

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-end">
        <ModalOverlay onClose={onClose} />
        <div
          className={twMerge(
            'relative w-full pt-1 px-1.5 pb-1.5 rounded-t-xxs bg-white',
            className,
          )}
        >
          {/* 닫기 버튼 */}
          <div className="w-full pb-5 bg-white">
            <div className="w-[4.375rem] mx-auto h-1.5 bg-neutral-80 rounded-xxs" />
          </div>
          {children}
        </div>
      </div>
    </ModalPortal>
  );
};

export default BaseBottomSheet;
