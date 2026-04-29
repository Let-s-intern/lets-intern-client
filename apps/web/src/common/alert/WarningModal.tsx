import ModalButton from '@/common/button/ModalButton';
import BaseModal from '@/common/modal/BaseModal';

interface WarningModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  content?: string;
  cancelText?: string;
  confirmText?: string;
  isLoading?: boolean;
}

const WarningModal = ({
  isOpen,
  onCancel,
  onConfirm,
  title = '정말로 나가시겠습니까?',
  content = '작성했던 내용이 저장되지 않을 수 있습니다.',
  cancelText = '취소',
  confirmText = '나가기',
  isLoading,
}: WarningModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onCancel}
      className="max-w-[20rem] md:max-w-[28rem]"
      isLoading={isLoading}
    >
      <div className="border-neutral-80 border-b px-6 py-5">
        <span className="text-xsmall16 mb-3 block font-semibold">{title}</span>
        <p className="text-xsmall14">{content}</p>
      </div>
      <div className="text-xsmall14 flex items-center">
        <ModalButton
          className="border-neutral-80 border-r font-medium"
          onClick={onCancel}
        >
          {cancelText}
        </ModalButton>
        <ModalButton className="text-primary font-semibold" onClick={onConfirm}>
          {confirmText}
        </ModalButton>
      </div>
    </BaseModal>
  );
};

export default WarningModal;
