import ModalButton from '@/common/button/ModalButton';
import BaseModal from '@/common/modal/BaseModal';

interface LinkChangeConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClickCancel?: () => void;
  onClickConfirm?: () => void;
}

function LinkChangeConfirmationModal({
  isOpen,
  onClose,
  onClickCancel,
  onClickConfirm,
}: LinkChangeConfirmationModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[20rem] md:max-w-[28rem]"
    >
      <div className="border-neutral-80 border-b px-6 py-5">
        <span className="text-xsmall16 mb-3 block font-semibold">
          지금 취소하시면 수정사항이 삭제됩니다.
        </span>
        <p className="text-xsmall14">링크 변경을 취소하시겠어요?</p>
      </div>
      <div className="text-xsmall14 flex items-center">
        <ModalButton
          className="border-neutral-80 border-r font-medium"
          onClick={onClickCancel}
        >
          수정 계속하기
        </ModalButton>
        <ModalButton
          className="text-primary font-semibold"
          onClick={onClickConfirm}
        >
          링크 변경 취소
        </ModalButton>
      </div>
    </BaseModal>
  );
}

export default LinkChangeConfirmationModal;
