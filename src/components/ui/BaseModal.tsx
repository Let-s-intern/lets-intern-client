<<<<<<< HEAD
import { useControlScroll } from '@/hooks/useControlScroll';
=======
import useControlScroll from '@/hooks/useControlScroll';
>>>>>>> bda0e128782ff017c40eeb865e258ccc5b75a309
import { twMerge } from '@/lib/twMerge';
import ModalOverlay from './ModalOverlay';
import ModalPortal from './ModalPortal';

/**
 * 기본 모달 컴포넌트
 *
 * 사용예시:
 * <BaseModal isOpen={isOpen} onClose={handleClose}>
 *   <div>모달 내용</div>
 * </BaseModal>
 */

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
}
const BaseModal = ({
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
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
      >
        <ModalOverlay onClose={onClose} />
        <div
          className={twMerge(
            'relative w-full overflow-hidden rounded-ms bg-white',
            className,
          )}
        >
          {children}
        </div>
      </div>
    </ModalPortal>
  );
};

export default BaseModal;
