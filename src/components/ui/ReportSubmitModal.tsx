import BaseModal from './BaseModal';

interface ReportSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClickConfirm: () => void;
}

/**
 * 서류 제출 모달
 */

const ReportSubmitModal = ({
  isOpen,
  onClose,
  onClickConfirm,
}: ReportSubmitModalProps) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="border-b border-neutral-80 px-6 py-5">
        <span className="mb-3 block text-xsmall16 font-semibold">
          제출 전, 확인해주세요.
        </span>
        <p className="text-xsmall14">
          제출 후에는 수정이 어렵습니다. 그래도 제출하시겠어요?
        </p>
      </div>
      <div className="flex items-center text-xsmall14 font-medium">
        <button
          className="flex-1 border-r border-neutral-80 py-4"
          onClick={onClose}
        >
          취소
        </button>
        <button className="flex-1 py-4 text-primary" onClick={onClickConfirm}>
          제출하기
        </button>
      </div>
    </BaseModal>
  );
};

export default ReportSubmitModal;
