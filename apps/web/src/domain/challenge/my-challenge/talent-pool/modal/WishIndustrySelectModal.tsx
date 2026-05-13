import { WishJobModal } from '@/common/modal/WishJobModal';
import { CheckboxItem } from '../WishJobCheckBox';

interface Industry {
  id: number;
  name: string;
}

interface WishIndustrySelectModalProps {
  industries: Industry[];
  selectedIndustries: string[];
  onIndustrySelect: (id: number) => void;
  onClose: () => void;
}

export default function WishIndustrySelectModal({
  industries,
  selectedIndustries,
  onIndustrySelect,
  onClose,
}: WishIndustrySelectModalProps) {
  return (
    <WishJobModal
      title="산업 선택 (최대 3개)"
      onClose={onClose}
      footer={
        <button
          onClick={onClose}
          className={`rounded-xs flex-1 py-3 text-white ${
            selectedIndustries.length > 0
              ? 'bg-primary'
              : 'bg-neutral-70 cursor-not-allowed'
          }`}
        >
          선택 완료
        </button>
      }
    >
      {industries.map((industry) => {
        const isSelected = selectedIndustries.includes(industry.name);
        const isDisabled =
          (!isSelected && selectedIndustries.length >= 3) ||
          (!isSelected &&
            selectedIndustries.some((name) => name === '산업 무관'));

        return (
          <CheckboxItem
            key={industry.id}
            label={industry.name}
            isSelected={isSelected}
            isDisabled={isDisabled}
            onChange={() => onIndustrySelect(industry.id)}
          />
        );
      })}
    </WishJobModal>
  );
}
