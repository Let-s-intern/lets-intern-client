import clsx from 'clsx';
import ModalButton from '@/common/button/ModalButton';
import BaseModal from '@/common/modal/BaseModal';

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
      <div className="border-neutral-80 border-b px-6 py-5">
        <span className="text-xsmall16 mb-3 block font-semibold">
          제출 전, 확인해주세요.
        </span>
        <p className="text-xsmall14">
          제출 후에는 수정이 어렵습니다. 그래도 제출하시겠어요?
        </p>
      </div>
      <div className="text-xsmall14 flex items-center">
        <ModalButton
          className="border-neutral-80 border-r font-medium"
          onClick={onClose}
        >
          취소
        </ModalButton>
        <ModalButton
          className={clsx('text-primary font-semibold', {
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
