interface ConfirmSectionProps {
  onConfirm: () => void;
  isDisabled: boolean;
}

const ConfirmSection = ({ onConfirm, isDisabled }: ConfirmSectionProps) => {
  return (
    <div className="w-full">
      <button
        className={`w-full rounded-md bg-primary px-6 py-3 text-lg font-medium text-neutral-100 ${isDisabled ? 'opacity-50' : ''}`}
        onClick={onConfirm}
        disabled={isDisabled}
      >
        등록하기
      </button>
    </div>
  );
};

export default ConfirmSection;
