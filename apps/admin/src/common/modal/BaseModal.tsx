import LoadingContainer from '@/common/loading/LoadingContainer';
import { useControlScroll } from '@/hooks/useControlScroll';
import { twMerge } from '@/lib/twMerge';
import ModalOverlay from '../ModalOverlay';
import ModalPortal from '../ModalPortal';

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
  /** 바깥 고정 레이어 클래스. MUI Dialog(z 1300) 안에서 띄울 때 z-index 를 올리는 데 쓴다. */
  containerClassName?: string;
  isLoading?: boolean;
}
const BaseModal = ({
  isOpen,
  onClose,
  children,
  className,
  containerClassName,
  isLoading,
}: BaseModalProps) => {
  // 스크롤 제어
  useControlScroll(isOpen);

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div
        className={twMerge(
          'fixed inset-0 z-50 flex items-center justify-center',
          containerClassName,
        )}
        role="dialog"
        aria-modal="true"
      >
        <ModalOverlay onClose={onClose} />
        <div
          className={twMerge(
            'rounded-ms relative w-full overflow-hidden bg-white',
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

export default BaseModal;
