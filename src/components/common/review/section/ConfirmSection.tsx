interface ConfirmSectionProps {
  onConfirm: () => void;
}

const ConfirmSection = ({ onConfirm }: ConfirmSectionProps) => {
  return (
    <div className="w-full">
      <button
        className="w-full rounded-md bg-primary px-6 py-3 text-lg font-medium text-neutral-100"
        onClick={onConfirm}
      >
        등록하기
      </button>
    </div>
  );
};

export default ConfirmSection;
