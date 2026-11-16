import { useControlScroll } from '@/hooks/useControlScroll';
import { twMerge } from '@/lib/twMerge';
import ModalOverlay from '../ModalOverlay';
import ModalPortal from '../ModalPortal';

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
            'relative max-h-[90vh] w-full overflow-y-auto rounded-t-lg bg-white px-5 pb-6',
            className,
          )}
        >
          {/* 닫기 버튼 */}
          <div className="sticky top-0 z-10 w-full bg-white pb-5 pt-3">
            <div
              className="mx-auto h-1.5 w-[4.375rem] rounded-xxs bg-neutral-80"
              onClick={onClose}
            />
          </div>
          {children}
        </div>
      </div>
    </ModalPortal>
  );
};

export default BaseBottomSheet;
