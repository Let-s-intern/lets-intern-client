import BaseModal from '@/common/BaseModal';
import ModalButton from '@/common/ModalButton';

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
      <div className="border-b border-neutral-80 px-6 py-5">
        <span className="mb-3 block text-xsmall16 font-semibold">
          지금 취소하시면 수정사항이 삭제됩니다.
        </span>
        <p className="text-xsmall14">링크 변경을 취소하시겠어요?</p>
      </div>
      <div className="flex items-center text-xsmall14">
        <ModalButton
          className="border-r border-neutral-80 font-medium"
          onClick={onClickCancel}
        >
          수정 계속하기
        </ModalButton>
        <ModalButton
          className="font-semibold text-primary"
          onClick={onClickConfirm}
        >
          링크 변경 취소
        </ModalButton>
      </div>
    </BaseModal>
  );
}

export default LinkChangeConfirmationModal;
