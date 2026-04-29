interface ConfirmSectionProps {
  isEdit: boolean;
  onConfirm: () => void;
  isDisabled: boolean;
}

const ConfirmSection = ({
  isEdit,
  onConfirm,
  isDisabled,
}: ConfirmSectionProps) => {
  return (
    <div className="w-full">
      <button
        className={`bg-primary w-full rounded-md px-6 py-3 text-lg font-medium text-neutral-100 ${
          isDisabled ? 'opacity-50' : ''
        } ${isEdit ? '' : 'submit_button'}`}
        onClick={onConfirm}
        disabled={isDisabled}
      >
        {isEdit ? '수정하기' : '등록하기'}
      </button>
    </div>
  );
};

export default ConfirmSection;
