import clsx from 'clsx';
import ModalButton from '../button/ModalButton';
import BaseModal from './BaseModal';

interface ReportSubmitModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onClickConfirm: () => void;
}

/**
 * 서류 제출 모달
 */

const ReportSubmitModal = ({
  isOpen,
  isLoading,
  onClose,
  onClickConfirm,
}: ReportSubmitModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[20rem] md:max-w-[28rem]"
    >
      <div className="border-b border-neutral-80 px-6 py-5">
        <span className="mb-3 block text-xsmall16 font-semibold">
          제출 전, 확인해주세요.
        </span>
        <p className="text-xsmall14">
          제출 후에는 수정이 어렵습니다. 그래도 제출하시겠어요?
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
          className={clsx('font-semibold text-primary', {
            'cursor-wait': isLoading,
          })}
          onClick={onClickConfirm}
        >
          제출하기
        </ModalButton>
      </div>
    </BaseModal>
  );
};

export default ReportSubmitModal;
