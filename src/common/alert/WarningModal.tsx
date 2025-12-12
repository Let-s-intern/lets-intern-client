import BaseModal from '@/common/BaseModal';
import ModalButton from '@/common/ModalButton';

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
      <div className="border-b border-neutral-80 px-6 py-5">
        <span className="mb-3 block text-xsmall16 font-semibold">{title}</span>
        <p className="text-xsmall14">{content}</p>
      </div>
      <div className="flex items-center text-xsmall14">
        <ModalButton
          className="border-r border-neutral-80 font-medium"
          onClick={onCancel}
        >
          {cancelText}
        </ModalButton>
        <ModalButton className="font-semibold text-primary" onClick={onConfirm}>
          {confirmText}
        </ModalButton>
      </div>
    </BaseModal>
  );
};

export default WarningModal;
