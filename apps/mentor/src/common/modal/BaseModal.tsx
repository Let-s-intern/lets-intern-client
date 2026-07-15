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
  isLoading?: boolean;
  /** 오버레이(모달 바깥) 클릭으로 닫을지 여부. 기본 true. */
  closeOnOverlayClick?: boolean;
}
const BaseModal = ({
  isOpen,
  onClose,
  children,
  className,
  isLoading,
  closeOnOverlayClick = true,
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
        <ModalOverlay onClose={closeOnOverlayClick ? onClose : undefined} />
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
