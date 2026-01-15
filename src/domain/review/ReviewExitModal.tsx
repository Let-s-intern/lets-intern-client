import ModalButton from '@/common/button/ModalButton';
import BaseModal from '@/common/modal/BaseModal';

interface ReviewExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClickConfirm: () => void;
}

const ReviewExitModal = ({
  isOpen,
  onClose,
  onClickConfirm,
}: ReviewExitModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[20rem] md:max-w-[28rem]"
    >
      <div className="border-b border-neutral-80 px-6 py-5">
        <span className="mb-3 block text-xsmall16 font-semibold">
          후기 작성 폼에서 나가시겠습니까?
        </span>
        <p className="text-xsmall14">
          작성했던 내용이 저장되지 않을 수 있습니다.
        </p>
      </div>
      <div className="flex items-center text-xsmall14">
        <ModalButton
          className="border-r border-neutral-80 font-medium"
          onClick={onClose}
        >
          취소
        </ModalButton>
        <ModalButton
          className="font-semibold text-primary"
          onClick={onClickConfirm}
        >
          나가기
        </ModalButton>
      </div>
    </BaseModal>
  );
};

export default ReviewExitModal;
